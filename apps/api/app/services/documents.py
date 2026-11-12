"""In-memory document store with human review and CSV export."""

from __future__ import annotations

import csv
import io
import uuid
from datetime import UTC, datetime
from threading import Lock

from app.data.backoffice import CURRENCY, DOCUMENTS
from app.data.ledger_source import get_ledger
from app.db import postgres
from app.schemas.common import Language
from app.schemas.documents import (
    Document,
    DocumentCreate,
    DocumentStatus,
    DocumentSummary,
    DocumentType,
    ExportResponse,
    ExtractedField,
    ReviewRequest,
)
from app.schemas.insights import DashboardSummary
from app.services.extraction import REQUIRED, extract

_LOCK = Lock()
_DOCUMENTS: dict[str, Document] = {}
_READINESS_SCORE = 58

_APPROVED_AT_SEED = {
    "doc-inv-014",
    "doc-inv-019",
    "doc-pay-10",
    "doc-ctr-001",
}


def _now() -> datetime:
    return datetime.now(UTC)


def _needs_review(document: Document) -> int:
    missing = len(REQUIRED[document.doc_type]) - len(document.fields)
    low = sum(1 for field in document.fields if field.confidence < 0.9)
    return max(0, missing) + low


def _summary(document: Document) -> DocumentSummary:
    return DocumentSummary(
        id=document.id,
        filename=document.filename,
        doc_type=document.doc_type,
        language=document.language,
        supplier=document.supplier,
        total=document.total,
        currency=document.currency,
        status=document.status,
        confidence=document.confidence,
        needs_review=_needs_review(document),
        uploaded_at=document.uploaded_at,
    )


def _seed() -> None:
    loaded = postgres.load_documents()
    if loaded:
        for row in loaded:
            _DOCUMENTS[row["id"]] = Document(
                id=row["id"],
                filename=row["filename"],
                doc_type=DocumentType(row["doc_type"]),
                language=Language(row["language"]),
                supplier=row["supplier"],
                total=row["total"],
                currency=row["currency"],
                status=DocumentStatus(row["status"]),
                confidence=row["confidence"],
                needs_review=0,
                uploaded_at=row["uploaded_at"],
                text=row["text"],
                fields=[ExtractedField(**field) for field in row["fields"]],
                reviewer=row["reviewer"],
                reviewed_at=row["reviewed_at"],
            )
        return

    for item in DOCUMENTS:
        doc_type = DocumentType(item["doc_type"])
        language = Language(item["language"])
        result = extract(item["text"], doc_type, language, allow_llm=False)
        approved = item["id"] in _APPROVED_AT_SEED
        _DOCUMENTS[item["id"]] = Document(
            id=item["id"],
            filename=item["filename"],
            doc_type=doc_type,
            language=language,
            supplier=result.supplier,
            total=result.total,
            currency=result.currency,
            status=DocumentStatus.APPROVED if approved else DocumentStatus.NEEDS_REVIEW,
            confidence=result.confidence,
            needs_review=0,
            uploaded_at=_now(),
            text=item["text"],
            fields=result.fields,
            reviewer="demo.accountant" if approved else None,
            reviewed_at=_now() if approved else None,
        )


_seed()


def list_documents() -> list[DocumentSummary]:
    return [
        _summary(document)
        for document in sorted(_DOCUMENTS.values(), key=lambda item: item.uploaded_at, reverse=True)
    ]


def get_document(document_id: str) -> Document | None:
    return _DOCUMENTS.get(document_id)


def create_document(payload: DocumentCreate) -> Document:
    result = extract(payload.text, payload.doc_type, payload.language)
    with _LOCK:
        document = Document(
            id=f"doc-{uuid.uuid4().hex[:8]}",
            filename=payload.filename,
            doc_type=payload.doc_type,
            language=payload.language,
            supplier=result.supplier,
            total=result.total,
            currency=result.currency,
            status=DocumentStatus.NEEDS_REVIEW,
            confidence=result.confidence,
            needs_review=0,
            uploaded_at=_now(),
            text=payload.text,
            fields=result.fields,
        )
        _DOCUMENTS[document.id] = document
        postgres.persist_document(document.model_dump(mode="json"))
        return document


def review_document(document_id: str, payload: ReviewRequest) -> Document | None:
    with _LOCK:
        document = _DOCUMENTS.get(document_id)
        if document is None:
            return None
        by_key = {field.key: field for field in document.fields}
        for correction in payload.fields:
            field = by_key.get(correction.key)
            if field is None:
                continue
            field.value = correction.value
            field.confidence = 1.0
            field.corrected = True

        if document.doc_type is DocumentType.INVOICE:
            if "total" in by_key:
                document.total = _to_float(by_key["total"].value)
            if "supplier" in by_key:
                document.supplier = by_key["supplier"].value
        elif document.doc_type is DocumentType.PAYSLIP:
            if "net" in by_key:
                document.total = _to_float(by_key["net"].value)
            if "employee" in by_key:
                document.supplier = by_key["employee"].value
        else:
            if "value" in by_key:
                document.total = _to_float(by_key["value"].value)
            if "parties" in by_key:
                document.supplier = by_key["parties"].value

        document.status = DocumentStatus.APPROVED
        document.reviewer = payload.reviewer
        document.reviewed_at = _now()
        document.confidence = (
            round(sum(field.confidence for field in document.fields) / len(document.fields), 2)
            if document.fields
            else 0.0
        )
        postgres.persist_review(
            document.id,
            payload.reviewer,
            document.total,
            document.supplier,
            [field.model_dump(mode="json") for field in document.fields],
        )
        return document


def _to_float(value: str) -> float | None:
    cleaned = "".join(character for character in value if character.isdigit() or character == ".")
    try:
        return round(float(cleaned), 2)
    except ValueError:
        return None


def export_csv() -> ExportResponse:
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(
        [
            "document_id",
            "filename",
            "type",
            "supplier_or_employee",
            "total",
            "currency",
            "status",
            "confidence",
            "reviewer",
        ]
    )
    for document in _DOCUMENTS.values():
        writer.writerow(
            [
                document.id,
                document.filename,
                document.doc_type.value,
                document.supplier or "",
                f"{document.total:.2f}" if document.total is not None else "",
                document.currency,
                document.status.value,
                f"{document.confidence:.2f}",
                document.reviewer or "",
            ]
        )
    csv_text = buffer.getvalue()
    return ExportResponse(
        filename="lekont_documents.csv",
        rows=len(_DOCUMENTS),
        csv=csv_text,
    )


def set_readiness(score: int) -> None:
    global _READINESS_SCORE
    _READINESS_SCORE = max(0, min(100, score))


def dashboard_summary() -> DashboardSummary:
    from app.schemas.insights import MonthlyPoint

    ledger = get_ledger()
    latest_month = max(row["month"] for row in ledger)
    month_rows = [row for row in ledger if row["month"] == latest_month]
    monthly_spend = round(sum(row["amount"] for row in month_rows), 2)
    monthly_vat = round(sum(row["vat"] for row in month_rows), 2)

    suppliers: dict[str, float] = {}
    for row in ledger:
        if row["category"] == "Payroll":
            continue
        suppliers[row["supplier"]] = suppliers.get(row["supplier"], 0.0) + row["amount"]
    top_supplier = max(suppliers, key=suppliers.get) if suppliers else None

    documents = list(_DOCUMENTS.values())
    monthly: dict[str, dict[str, float]] = {}
    for row in ledger:
        bucket = monthly.setdefault(row["month"], {"spend": 0.0, "vat": 0.0})
        bucket["spend"] += row["amount"]
        bucket["vat"] += row["vat"]

    return DashboardSummary(
        documents_total=len(documents),
        needs_review=sum(1 for doc in documents if doc.status is DocumentStatus.NEEDS_REVIEW),
        approved=sum(1 for doc in documents if doc.status is DocumentStatus.APPROVED),
        monthly_spend=monthly_spend,
        monthly_vat=monthly_vat,
        readiness_score=_READINESS_SCORE,
        top_supplier=top_supplier,
        top_supplier_spend=round(suppliers.get(top_supplier, 0.0), 2) if top_supplier else 0.0,
        currency=CURRENCY,
        monthly=[
            MonthlyPoint(month=month, spend=round(values["spend"], 2), vat=round(values["vat"], 2))
            for month, values in sorted(monthly.items())
        ],
    )
