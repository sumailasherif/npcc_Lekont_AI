"""Optional Postgres/Supabase loader.

The app runs on synthetic in-memory data by default. When ``DATABASE_URL`` is
set and the back-office migration has been applied, this module loads the same
shapes from Postgres. Writes are best-effort: the demo stays usable if the
database is unreachable.
"""

from __future__ import annotations

import logging
from typing import Any

from app.core.config import get_settings

logger = logging.getLogger(__name__)

DEMO_ORG_ID = "00000000-0000-0000-0000-000000000001"


def _connect():
    settings = get_settings()
    if not settings.database_url:
        return None
    try:
        import psycopg
        from psycopg.rows import dict_row
    except ImportError:
        logger.warning("psycopg is not installed; using in-memory demo data")
        return None
    try:
        return psycopg.connect(
            settings.database_url,
            connect_timeout=5,
            row_factory=dict_row,
        )
    except Exception as exc:  # noqa: BLE001 - demo must degrade gracefully
        logger.warning("Postgres unavailable, using in-memory demo data: %s", exc)
        return None


def _query(sql: str, params: tuple[Any, ...] = ()) -> list[dict[str, Any]] | None:
    connection = _connect()
    if connection is None:
        return None
    try:
        with connection, connection.cursor() as cursor:
            cursor.execute(sql, params)
            return list(cursor.fetchall())
    except Exception as exc:  # noqa: BLE001
        logger.warning("Postgres query failed: %s", exc)
        return None
    finally:
        connection.close()


def _execute(sql: str, params: tuple[Any, ...] = ()) -> bool:
    connection = _connect()
    if connection is None:
        return False
    try:
        with connection, connection.cursor() as cursor:
            cursor.execute(sql, params)
        return True
    except Exception as exc:  # noqa: BLE001
        logger.warning("Postgres write failed: %s", exc)
        return False
    finally:
        connection.close()


def load_ledger() -> list[dict[str, Any]] | None:
    rows = _query(
        """
        select entry_date::text as date, month, supplier, category,
               amount::float as amount, vat::float as vat, doc_id
        from ledger_entries
        where org_id = %s
        order by entry_date
        """,
        (DEMO_ORG_ID,),
    )
    return rows or None


def load_documents() -> list[dict[str, Any]] | None:
    documents = _query(
        """
        select id, filename, doc_type, language, supplier, total::float as total,
               currency, status, confidence::float as confidence, reviewer,
               reviewed_at, uploaded_at, text_content as text
        from documents
        where org_id = %s
        order by uploaded_at desc
        """,
        (DEMO_ORG_ID,),
    )
    if not documents:
        return None

    ids = [document["id"] for document in documents]
    fields = _query(
        """
        select doc_id, key, label, value, confidence::float as confidence, page, corrected
        from document_fields
        where doc_id = any(%s)
        order by key
        """,
        (ids,),
    ) or []

    grouped: dict[str, list[dict[str, Any]]] = {document_id: [] for document_id in ids}
    for field in fields:
        grouped.setdefault(field.pop("doc_id"), []).append(field)
    for document in documents:
        document["fields"] = grouped.get(document["id"], [])
    return documents


def persist_review(
    document_id: str,
    reviewer: str,
    total: float | None,
    supplier: str | None,
    fields: list[dict[str, Any]],
) -> None:
    _execute(
        """
        update documents
        set status = 'approved', reviewer = %s, reviewed_at = now(),
            total = %s, supplier = %s
        where id = %s and org_id = %s
        """,
        (reviewer, total, supplier, document_id, DEMO_ORG_ID),
    )
    for field in fields:
        _execute(
            """
            insert into document_fields (doc_id, key, label, value, confidence, page, corrected)
            values (%s, %s, %s, %s, 1.0, 1, true)
            on conflict (doc_id, key)
            do update set value = excluded.value, confidence = 1.0, corrected = true
            """,
            (document_id, field["key"], field["label"], field["value"]),
        )


def persist_document(document: dict[str, Any]) -> None:
    _execute(
        """
        insert into documents
          (id, org_id, filename, doc_type, language, supplier, total, currency,
           status, confidence, text_content)
        values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        on conflict (id) do nothing
        """,
        (
            document["id"],
            DEMO_ORG_ID,
            document["filename"],
            document["doc_type"],
            document["language"],
            document["supplier"],
            document["total"],
            document["currency"],
            document["status"],
            document["confidence"],
            document["text"],
        ),
    )
    for field in document["fields"]:
        _execute(
            """
            insert into document_fields (doc_id, key, label, value, confidence, page, corrected)
            values (%s, %s, %s, %s, %s, %s, false)
            on conflict (doc_id, key) do nothing
            """,
            (
                document["id"],
                field["key"],
                field["label"],
                field["value"],
                field["confidence"],
            ),
        )


def persist_assessment(
    sector: str,
    employees: int,
    monthly_invoices: int,
    monthly_payslips: int,
    admin_hours: int,
    tools: list[str],
    pain_points: list[str],
    readiness_score: int,
    recommended_first: str,
) -> None:
    _execute(
        """
        insert into readiness_assessments
          (org_id, sector, employees, monthly_invoices, monthly_payslips,
           admin_hours, tools, pain_points, readiness_score, recommended_first)
        values (%s, %s, %s, %s, %s, %s, %s::jsonb, %s::jsonb, %s, %s)
        """,
        (
            DEMO_ORG_ID,
            sector,
            employees,
            monthly_invoices,
            monthly_payslips,
            admin_hours,
            __import__("json").dumps(tools),
            __import__("json").dumps(pain_points),
            readiness_score,
            recommended_first,
        ),
    )
