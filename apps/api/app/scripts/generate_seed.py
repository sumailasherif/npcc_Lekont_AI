"""Generate the 100-row demo ledger and the Supabase seed SQL.

Run from apps/api with the venv:

    python -m app.scripts.generate_seed

Outputs:
    data/samples/ledger_100.csv
    supabase/seed/0001_documents.sql
    supabase/seed/0002_ledger_100.sql
"""

from __future__ import annotations

import csv
import random
from pathlib import Path

from app.data.backoffice import DOCUMENTS
from app.schemas.common import Language
from app.schemas.documents import DocumentType
from app.services.extraction import extract

ORG_ID = "00000000-0000-0000-0000-000000000001"
SUPPLIERS = [
    ("Island Packaging Ltd", "Packaging"),
    ("Moka Paper & Print", "Printing"),
    ("Port Logistics Co.", "Logistics"),
    ("Curepipe Office Supplies", "Office"),
    ("Beau Bassin Cleaning Co.", "Facilities"),
    ("Quatre Bornes IT Services", "IT"),
    ("Riviere Noire Cold Storage", "Cold chain"),
    ("Plaine Wilhems Maintenance", "Maintenance"),
    ("Tamarin Marketing Studio", "Marketing"),
    ("Ebene Legal Advisors", "Professional services"),
    ("Mauritius Telecom Business", "Telecom"),
    ("Payroll", "Payroll"),
]
MONTHS = [
    ("2026-02", 28),
    ("2026-03", 31),
    ("2026-04", 30),
    ("2026-05", 31),
    ("2026-06", 30),
    ("2026-07", 31),
    ("2026-08", 31),
    ("2026-09", 30),
    ("2026-10", 31),
    ("2026-11", 30),
]


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[4]


def _sql_escape(value: str | None) -> str:
    if value is None:
        return "null"
    return "'" + value.replace("'", "''") + "'"


def ledger_rows() -> list[dict[str, object]]:
    random.seed(42)
    rows: list[dict[str, object]] = []
    for month_index, (month, last_day) in enumerate(MONTHS):
        for index in range(10):
            supplier, category = SUPPLIERS[
                (index + month_index) % len(SUPPLIERS)
            ]
            day = 3 + (index * 2) % (last_day - 5)
            if category == "Payroll":
                amount = 54000 + random.randint(-900, 900)
                vat = 0.0
                supplier = "Payroll"
            else:
                amount = float(random.randint(2800, 38000))
                vat = round(amount * 0.15, 2)
            rows.append(
                {
                    "date": f"{month}-{day:02d}",
                    "month": month,
                    "supplier": supplier,
                    "category": category,
                    "amount": round(amount, 2),
                    "vat": vat,
                    "doc_id": None,
                }
            )
    return rows


def write_ledger_csv(rows: list[dict[str, object]], target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=["date", "month", "supplier", "category", "amount", "vat", "doc_id"],
        )
        writer.writeheader()
        writer.writerows(rows)


def write_ledger_sql(rows: list[dict[str, object]], target: Path) -> None:
    lines = [
        "-- 100 synthetic ledger entries for the Lekont demo tenant.",
        "-- Safe to re-run: duplicates are skipped by (org_id, entry_date, supplier, amount).",
        "insert into ledger_entries "
        "(org_id, entry_date, month, supplier, category, amount, vat, doc_id)",
        "values",
    ]
    values = [
        (
            f"('{ORG_ID}', '{row['date']}', '{row['month']}', "
            f"{_sql_escape(str(row['supplier']))}, {_sql_escape(str(row['category']))}, "
            f"{row['amount']}, {row['vat']}, null)"
        )
        for row in rows
    ]
    lines.append(",\n".join(values) + ";")
    target.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_documents_sql(target: Path) -> None:
    lines = [
        "-- Six synthetic documents with their extracted fields.",
        "insert into documents "
        "(id, org_id, filename, doc_type, language, supplier, total, currency, "
        "status, confidence, reviewer, text_content)",
        "values",
    ]
    values: list[str] = []
    fields: list[str] = []
    for item in DOCUMENTS:
        doc_type = DocumentType(item["doc_type"])
        language = Language(item["language"])
        result = extract(item["text"], doc_type, language, allow_llm=False)
        status = "approved" if item["id"] in {
            "doc-inv-014",
            "doc-inv-019",
            "doc-pay-10",
            "doc-ctr-001",
        } else "needs_review"
        reviewer = "demo.accountant" if status == "approved" else None
        values.append(
            "("
            f"{_sql_escape(item['id'])}, '{ORG_ID}', {_sql_escape(item['filename'])}, "
            f"{_sql_escape(doc_type.value)}, {_sql_escape(language.value)}, "
            f"{_sql_escape(result.supplier)}, "
            f"{result.total if result.total is not None else 'null'}, "
            f"{_sql_escape(result.currency)}, '{status}', {result.confidence}, "
            f"{_sql_escape(reviewer)}, {_sql_escape(item['text'])}"
            ")"
        )
        for field in result.fields:
            fields.append(
                "("
                f"{_sql_escape(item['id'])}, {_sql_escape(field.key)}, {_sql_escape(field.label)}, "
                f"{_sql_escape(field.value)}, {field.confidence}, {field.page}, false"
                ")"
            )
    lines.append(",\n".join(values) + "\non conflict (id) do nothing;")
    lines.append("")
    lines.append(
        "insert into document_fields (doc_id, key, label, value, confidence, page, corrected)"
    )
    lines.append("values")
    lines.append(",\n".join(fields) + "\non conflict (doc_id, key) do nothing;")
    target.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    root = _repo_root()
    rows = ledger_rows()
    write_ledger_csv(rows, root / "data" / "samples" / "ledger_100.csv")
    (root / "supabase" / "seed").mkdir(parents=True, exist_ok=True)
    write_ledger_sql(rows, root / "supabase" / "seed" / "0002_ledger_100.sql")
    write_documents_sql(root / "supabase" / "seed" / "0001_documents.sql")
    print(f"wrote {len(rows)} ledger rows and {len(DOCUMENTS)} documents")


if __name__ == "__main__":
    main()
