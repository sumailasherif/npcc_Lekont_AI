"""Field extraction for invoices, payslips and contracts (FR/EN).

Regex first for speed and determinism, then the LLM only for fields the regex
missed. Every field carries a confidence and a human must approve before export.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field

from app.schemas.common import Language
from app.schemas.documents import DocumentType, ExtractedField
from app.services import llm

NUM = r"([0-9][0-9,]*(?:\.[0-9]{2})?)"

LABELS: dict[DocumentType, dict[str, str]] = {
    DocumentType.INVOICE: {
        "supplier": "Supplier",
        "invoice_no": "Invoice number",
        "date": "Invoice date",
        "currency": "Currency",
        "subtotal": "Subtotal",
        "vat": "VAT",
        "total": "Total",
    },
    DocumentType.PAYSLIP: {
        "employee": "Employee",
        "period": "Period",
        "currency": "Currency",
        "gross": "Gross pay",
        "deductions": "Deductions",
        "net": "Net pay",
    },
    DocumentType.CONTRACT: {
        "parties": "Parties",
        "start": "Start date",
        "end": "End date",
        "currency": "Currency",
        "value": "Contract value",
    },
}

REQUIRED: dict[DocumentType, list[str]] = {
    DocumentType.INVOICE: ["supplier", "invoice_no", "date", "subtotal", "vat", "total"],
    DocumentType.PAYSLIP: ["employee", "period", "gross", "deductions", "net"],
    DocumentType.CONTRACT: ["parties", "start", "end", "value"],
}


@dataclass
class ExtractionResult:
    fields: list[ExtractedField] = field(default_factory=list)
    supplier: str | None = None
    total: float | None = None
    currency: str = "MUR"
    confidence: float = 0.0
    missing: list[str] = field(default_factory=list)


def _search(pattern: str, text: str) -> str | None:
    match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
    if not match:
        return None
    value = match.group(1).strip()
    return value or None


def _money(value: str | None) -> float | None:
    if not value:
        return None
    cleaned = re.sub(r"[^\d.]", "", value.replace(",", ""))
    try:
        return round(float(cleaned), 2)
    except ValueError:
        return None


def _regex_fields(text: str, doc_type: DocumentType) -> dict[str, tuple[str, float]]:
    found: dict[str, tuple[str, float]] = {}

    def put(key: str, value: str | None, confidence: float = 0.96) -> None:
        if value:
            found[key] = (value, confidence)

    currency = _search(r"(?:Currency|Devise)\s*[:\-]\s*([A-Z]{3})", text)
    put("currency", currency)

    if doc_type is DocumentType.INVOICE:
        put("supplier", _search(r"(?:Supplier|Fournisseur)\s*[:\-]\s*(.+)", text))
        put(
            "invoice_no",
            _search(
                r"(?:Invoice\s*(?:No|Number)|Num[eé]ro de facture)\s*[:\-]\s*([A-Z0-9\-/]+)", text
            ),
        )
        put("date", _search(r"(?:Invoice date|Date)\s*[:\-]\s*([0-9]{2}/[0-9]{2}/[0-9]{4})", text))
        put("subtotal", _search(rf"(?:Subtotal|Sous-total)\s*[:\-]\s*{NUM}", text))
        put("vat", _search(rf"(?:VAT|TVA)[^\n:]*[:\-]\s*{NUM}", text))
        put("total", _search(rf"(?:^|\n)Total\s*[:\-]\s*{NUM}", text))

    elif doc_type is DocumentType.PAYSLIP:
        put("employee", _search(r"(?:Employee|Employ[eé])\s*[:\-]\s*(.+)", text))
        put("period", _search(r"(?:Period|P[eé]riode)\s*[:\-]\s*(.+)", text))
        put("gross", _search(rf"(?:Gross|Brut)\s*[:\-]\s*{NUM}", text))
        put("deductions", _search(rf"(?:Deductions|Retenues)\s*[:\-]\s*{NUM}", text))
        put("net", _search(rf"(?:^|\n)Net\s*[:\-]\s*{NUM}", text))

    else:
        put("parties", _search(r"(?:Parties|Party)\s*[:\-]\s*(.+)", text))
        put("start", _search(r"(?:Start|D[eé]but)\s*[:\-]\s*([0-9]{2}/[0-9]{2}/[0-9]{4})", text))
        put("end", _search(r"(?:End|Fin)\s*[:\-]\s*([0-9]{2}/[0-9]{2}/[0-9]{4})", text))
        put("value", _search(rf"(?:Value|Valeur)\s*[:\-]\s*{NUM}", text))

    return found


def _llm_fields(
    text: str,
    doc_type: DocumentType,
    missing: list[str],
    language: Language,
) -> dict[str, tuple[str, float]]:
    if not llm.is_enabled() or not missing:
        return {}
    prompt = (
        f"Document type: {doc_type.value}\nLanguage: {language.value}\n"
        f"Missing fields: {', '.join(missing)}\n\n"
        f"Document text:\n{text}\n\n"
        "Return only a JSON object mapping each missing field to its value, or null. "
        "Do not invent values that are not in the text."
    )
    raw = llm.complete(
        "You extract structured fields from business documents. Return JSON only.",
        prompt,
        temperature=0.0,
        max_tokens=600,
    )
    if not raw:
        return {}
    try:
        payload = json.loads(raw.strip().strip("`").removeprefix("json").strip())
    except (ValueError, TypeError):
        return {}
    found: dict[str, tuple[str, float]] = {}
    for key in missing:
        value = payload.get(key)
        if isinstance(value, (int, float)):
            value = str(value)
        if isinstance(value, str) and value.strip():
            found[key] = (value.strip(), 0.84)
    return found


def extract(
    text: str,
    doc_type: DocumentType,
    language: Language = Language.EN,
    allow_llm: bool = True,
) -> ExtractionResult:
    found = _regex_fields(text, doc_type)
    required = REQUIRED[doc_type]
    missing = [key for key in required if key not in found]

    if allow_llm and missing:
        found.update(_llm_fields(text, doc_type, missing, language))
        missing = [key for key in required if key not in found]

    fields = [
        ExtractedField(
            key=key,
            label=LABELS[doc_type].get(key, key.replace("_", " ").title()),
            value=value,
            confidence=confidence,
        )
        for key, (value, confidence) in found.items()
    ]
    fields.sort(
        key=lambda item: (
            list(LABELS[doc_type]).index(item.key) if item.key in LABELS[doc_type] else 99
        )
    )

    confidence = (
        round(sum(field.confidence for field in fields) / len(fields), 2) if fields else 0.0
    )
    if missing:
        confidence = round(max(0.0, confidence - 0.05 * len(missing)), 2)

    lookup = {field.key: field.value for field in fields}
    currency = lookup.get("currency", "MUR")
    if doc_type is DocumentType.INVOICE:
        supplier = lookup.get("supplier")
        total = _money(lookup.get("total"))
    elif doc_type is DocumentType.PAYSLIP:
        supplier = lookup.get("employee")
        total = _money(lookup.get("net"))
    else:
        supplier = lookup.get("parties")
        total = _money(lookup.get("value"))

    return ExtractionResult(
        fields=fields,
        supplier=supplier,
        total=total,
        currency=currency,
        confidence=confidence,
        missing=missing,
    )
