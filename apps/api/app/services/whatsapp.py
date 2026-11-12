"""WhatsApp business assistant.

The same commands work through the Meta Cloud API webhook and the local
simulator. Sales, stock and invoices feed the same demo store the dashboard and
the documents page read from, so a chat entry is visible everywhere.
"""

from __future__ import annotations

import logging
import re
import uuid
from datetime import UTC, date, datetime

import httpx

from app.core.config import get_settings
from app.data.ledger_source import get_ledger
from app.db import whatsapp_store
from app.schemas.approvals import Approval, ApprovalKind
from app.schemas.common import Language
from app.schemas.documents import DocumentCreate, DocumentType, ReviewRequest
from app.schemas.whatsapp import SimulateResponse, WhatsAppMessage
from app.services import approvals, documents, insights

logger = logging.getLogger(__name__)

MAX_LOG = 300

_MESSAGES: list[WhatsAppMessage] = []
_ALERTS: list[dict[str, str]] = []
_PENDING: dict[str, dict] = {}

_STOCK: dict[str, dict[str, float]] = {
    "copier paper": {"qty": 12, "price": 250, "reorder": 5, "unit": "ream"},
    "coffee 1kg": {"qty": 4, "price": 780, "reorder": 6, "unit": "bag"},
    "packaging tape": {"qty": 3, "price": 95, "reorder": 10, "unit": "roll"},
    "printer ink": {"qty": 2, "price": 1450, "reorder": 4, "unit": "cartridge"},
    "A4 envelopes": {"qty": 40, "price": 3, "reorder": 20, "unit": "unit"},
}

_SALES: list[dict[str, object]] = [
    {
        "date": date.today().isoformat(),
        "item": "copier paper",
        "qty": 2,
        "unit_price": 250.0,
        "total": 500.0,
    },
    {
        "date": date.today().isoformat(),
        "item": "coffee 1kg",
        "qty": 1,
        "unit_price": 780.0,
        "total": 780.0,
    },
]


def _load_state() -> None:
    for row in whatsapp_store.load_messages():
        _MESSAGES.append(
            WhatsAppMessage(
                id=row["id"],
                direction=row["direction"],
                from_number=row["from_number"],
                text=row["body"],
                intent=row["intent"],
                created_at=row["created_at"],
            )
        )
    stock = whatsapp_store.load_stock()
    if stock:
        _STOCK.clear()
        for row in stock:
            _STOCK[row["name"].lower()] = {
                "qty": row["qty"],
                "price": row["price"],
                "reorder": row["reorder"],
                "unit": row["unit"],
            }
    sales = whatsapp_store.load_sales()
    if sales:
        _SALES.clear()
        _SALES.extend(sales)


_load_state()

SALE_RE = re.compile(
    r"^(?:sold|sale|sell|vann|vendu)\s+(\d+)\s+(.+?)(?:\s+(?:at|for|a|@)\s*)?(?:mur|rs)?\s*([\d,]+(?:\.\d{1,2})?)?\s*$",
    re.IGNORECASE,
)
ADD_RE = re.compile(r"^(?:add|ajout|azout)\s+(?:stock\s+)?(\d+)\s+(.+)$", re.IGNORECASE)
INVOICE_RE = re.compile(
    r"^(?:invoice|facture|faktir)\s+(.+?)\s+([\d,]+(?:\.\d{1,2})?)\s*$",
    re.IGNORECASE,
)
ALERT_RE = re.compile(r"^(?:alert|alerts|rappel)\s+(.+)$", re.IGNORECASE)

MENU = (
    "Here's what I can do for you:\n"
    '📊 Board brief: "board brief" for the five numbers a director needs\n'
    "🧾 Invoices: “invoice Ramesh 2500” and I draft it, ready to send as a PDF\n"
    "📊 Know your numbers: sales, spend, VAT and profit, with a live dashboard\n"
    "💸 Sales and stock: “sold 3 bags at 250”, “what is low in stock?”\n"
    "👥 Payslips: prepare your team's monthly pay\n"
    "📥 Imports: send an Excel, CSV or CRM export and I'll bring it in\n"
    "📤 Exports: PDF, CSV or Excel, whenever you need them\n"
    "📒 Your notebook: send a photo of a page and I'll read it for you\n\n"
    "Nothing is saved until you confirm."
)


def _now() -> datetime:
    return datetime.now(UTC)


def _log(
    direction: str,
    from_number: str,
    text: str,
    intent: str,
    data: dict | None = None,
) -> None:
    _MESSAGES.append(
        WhatsAppMessage(
            id=f"wa-{uuid.uuid4().hex[:8]}",
            direction=direction,  # type: ignore[arg-type]
            from_number=from_number,
            text=text,
            intent=intent,
            created_at=_now(),
            data=data,
        )
    )
    if len(_MESSAGES) > MAX_LOG:
        del _MESSAGES[: len(_MESSAGES) - MAX_LOG]
    whatsapp_store.persist_message(_MESSAGES[-1].id, direction, from_number, text, intent)


def _money(value: float) -> str:
    return f"MUR {value:,.0f}"


def _sale_today() -> float:
    today = date.today().isoformat()
    return round(sum(float(sale["total"]) for sale in _SALES if sale["date"] == today), 2)


def _stock_reply() -> tuple[str, dict]:
    low = [
        f"• {name}: {int(item['qty'])} {item['unit']}"
        for name, item in _STOCK.items()
        if item["qty"] <= item["reorder"]
    ]
    lines = [f"• {name}: {int(item['qty'])} {item['unit']}" for name, item in _STOCK.items()]
    reply = "Stock\n" + "\n".join(lines)
    if low:
        reply += "\n\nLow stock:\n" + "\n".join(low)
    return reply, {"stock": [{"name": name, **item} for name, item in _STOCK.items()]}


def _record_sale(
    item: str,
    qty: int,
    price: float | None,
    from_number: str = "23050000000",
) -> tuple[str, dict]:
    key = item.strip().lower()
    unit_price = price if price is not None else float(_STOCK.get(key, {}).get("price", 0))
    if unit_price <= 0:
        return (
            f"I can log “{item}” but I need a price. Try: sold {qty} {item} at 250",
            {"needs_price": True},
        )
    total = round(qty * unit_price, 2)
    if total >= 5000:
        approval = approvals.request_approval(
            ApprovalKind.SALE,
            f"Sale: {qty} × {item.strip()}",
            total,
            from_number,
            {"item": item.strip(), "qty": qty, "unit_price": unit_price},
        )
        return (
            f"A sale of {_money(total)} is above the operator limit. "
            f"Sent to the Head of Finance for approval ({approval.id}). "
            "Nothing is recorded yet.",
            {"approval_id": approval.id, "approval_status": "pending"},
        )
    _SALES.append(
        {
            "date": date.today().isoformat(),
            "item": item.strip(),
            "qty": qty,
            "unit_price": unit_price,
            "total": total,
        }
    )
    whatsapp_store.persist_sale(item.strip(), qty, unit_price, total)
    if key in _STOCK:
        _STOCK[key]["qty"] = max(0, _STOCK[key]["qty"] - qty)
        whatsapp_store.upsert_stock(
            item.strip(),
            _STOCK[key]["qty"],
            str(_STOCK[key]["unit"]),
            float(_STOCK[key]["price"]),
            float(_STOCK[key]["reorder"]),
        )
    data = {"sale": {"item": item.strip(), "qty": qty, "unit_price": unit_price, "total": total}}
    reply = (
        f"Recorded: {qty} × {item.strip()} at {_money(unit_price)} = {_money(total)}.\n"
        f"Sales today: {_money(_sale_today())}."
    )
    if key in _STOCK and _STOCK[key]["qty"] <= _STOCK[key]["reorder"]:
        reply += f"\nStock alert: {item.strip()} is down to {int(_STOCK[key]['qty'])}."
    return reply, data


def _add_stock(item: str, qty: int) -> tuple[str, dict]:
    key = item.strip().lower()
    if key not in _STOCK:
        _STOCK[key] = {"qty": 0, "price": 0, "reorder": 5, "unit": "unit"}
    _STOCK[key]["qty"] += qty
    whatsapp_store.upsert_stock(
        item.strip(),
        _STOCK[key]["qty"],
        str(_STOCK[key]["unit"]),
        float(_STOCK[key]["price"]),
        float(_STOCK[key]["reorder"]),
    )
    reply = f"Added {qty} {_STOCK[key]['unit']} of {item.strip()}. Now {int(_STOCK[key]['qty'])}."
    return reply, {"stock": {key: _STOCK[key]}}


def _create_invoice(
    customer: str,
    amount: float,
    from_number: str = "23050000000",
) -> tuple[str, dict]:
    document = documents.create_document(
        DocumentCreate(
            filename=f"whatsapp_invoice_{customer.strip().replace(' ', '_').lower()}.txt",
            doc_type=DocumentType.INVOICE,
            language=Language.EN,
            text=(
                "INVOICE\n"
                "Supplier: Lekont Demo Ltd\n"
                f"Invoice No: INV-WA-{uuid.uuid4().hex[:6].upper()}\n"
                f"Date: {date.today().strftime('%d/%m/%Y')}\n"
                "Currency: MUR\n"
                f"Subtotal: {amount:,.2f}\n"
                "VAT (15%): 0.00\n"
                f"Total: {amount:,.2f}\n"
            ),
        )
    )
    approval = approvals.request_approval(
        ApprovalKind.INVOICE,
        f"Invoice for {customer.strip()}",
        amount,
        from_number,
        {"document_id": document.id, "customer": customer.strip()},
    )
    reply = (
        f"Invoice draft {document.id} for {customer.strip()} at {_money(amount)}.\n"
        f"Sent to the Head of Finance for approval ({approval.id}). "
        "It stays in Documents until approved."
    )
    return reply, {
        "document_id": document.id,
        "total": document.total,
        "approval_id": approval.id,
        "approval_status": "pending",
    }


def _report() -> tuple[str, dict]:
    today = date.today().isoformat()
    month = today[:7]
    today_sales = [sale for sale in _SALES if sale["date"] == today]
    month_sales = [sale for sale in _SALES if str(sale["date"]).startswith(month)]
    today_total = round(sum(float(sale["total"]) for sale in today_sales), 2)
    month_total = round(sum(float(sale["total"]) for sale in month_sales), 2)
    top: dict[str, float] = {}
    for sale in month_sales:
        top[str(sale["item"])] = top.get(str(sale["item"]), 0.0) + float(sale["total"])
    best = max(top, key=top.get) if top else "—"
    reply = (
        f"Today: {len(today_sales)} sales, {_money(today_total)}.\n"
        f"This month: {len(month_sales)} sales, {_money(month_total)}.\n"
        f"Top item: {best}."
    )
    return reply, {"today_total": today_total, "month_total": month_total, "top_item": best}


def _latest_month() -> str:
    return max(str(row["month"]) for row in get_ledger())


def _month_rows(month: str) -> list[dict]:
    return [row for row in get_ledger() if str(row["month"]) == month]


def _brief() -> tuple[str, dict]:
    summary = documents.dashboard_summary()
    month = _latest_month()
    rows = _month_rows(month)
    total = sum(float(row["amount"]) for row in rows)
    payroll = sum(float(row["amount"]) for row in rows if row["category"] == "Payroll")
    vat = sum(float(row["vat"]) for row in rows)
    payroll_share = (payroll / total * 100) if total else 0

    suppliers: dict[str, float] = {}
    for row in get_ledger():
        if row["category"] == "Payroll":
            continue
        suppliers[str(row["supplier"])] = suppliers.get(str(row["supplier"]), 0.0) + float(
            row["amount"]
        )
    top = max(suppliers, key=suppliers.get) if suppliers else "—"
    top_share = (suppliers.get(top, 0.0) / sum(suppliers.values()) * 100) if suppliers else 0

    reply = (
        f"Board brief — {month}\n"
        f"• Spend: {_money(total)}; payroll {payroll_share:.0f}% of it.\n"
        f"• Input VAT: {_money(vat)}.\n"
        f"• Supplier concentration: {top} at {top_share:.0f}% of purchases.\n"
        f"• Documents: {summary.needs_review} waiting for review, "
        f"{summary.approved} approved.\n"
        f"• Automation readiness: {summary.readiness_score}/100. "
        "Invoice capture is the first candidate while documents are queued."
    )
    return reply, {
        "brief": {
            "month": month,
            "spend": round(total, 2),
            "payroll_share": round(payroll_share, 1),
            "vat": round(vat, 2),
            "top_supplier": top,
            "top_supplier_share": round(top_share, 1),
            "needs_review": summary.needs_review,
            "readiness": summary.readiness_score,
        }
    }


def _concentration() -> tuple[str, dict]:
    suppliers: dict[str, float] = {}
    for row in get_ledger():
        if row["category"] == "Payroll":
            continue
        suppliers[str(row["supplier"])] = suppliers.get(str(row["supplier"]), 0.0) + float(
            row["amount"]
        )
    total = sum(suppliers.values()) or 1.0
    ranked = sorted(suppliers.items(), key=lambda item: item[1], reverse=True)
    top, top_value = ranked[0]
    second, second_value = ranked[1] if len(ranked) > 1 else ("—", 0.0)
    share = top_value / total * 100
    hhi = sum((value / total) ** 2 for value in suppliers.values()) * 10000
    risk = "high" if share >= 50 or hhi >= 2500 else "medium" if share >= 35 else "low"
    reply = (
        f"Supplier concentration risk: {risk.upper()}.\n"
        f"• {top}: {_money(top_value)} ({share:.0f}% of purchases).\n"
        f"• Next: {second} at {second_value / total * 100:.0f}%.\n"
        f"• HHI {hhi:.0f} (above 2,500 is concentrated).\n"
        "A second source or a price review would reduce the exposure."
    )
    return reply, {
        "concentration": {
            "risk": risk,
            "top_supplier": top,
            "top_share": round(share, 1),
            "hhi": round(hhi, 0),
        }
    }


def _vat_reply() -> tuple[str, dict]:
    rows = get_ledger()
    months = sorted({str(row["month"]) for row in rows})
    by_month: dict[str, float] = {}
    for row in rows:
        by_month[str(row["month"])] = by_month.get(str(row["month"]), 0.0) + float(row["vat"])
    total = sum(by_month.values())
    last_three = sum(by_month[month] for month in months[-3:])
    latest = months[-1]
    reply = (
        f"Input VAT: {_money(total)} since {months[0]}.\n"
        f"• Last three months: {_money(last_three)}.\n"
        f"• {latest}: {_money(by_month[latest])}.\n"
        "This is VAT paid on purchases; output VAT and filing are not in the ledger."
    )
    return reply, {
        "vat": {
            "total": round(total, 2),
            "last_three_months": round(last_three, 2),
            "latest_month": latest,
            "latest": round(by_month[latest], 2),
        }
    }


def _payroll_reply() -> tuple[str, dict]:
    rows = get_ledger()
    month = _latest_month()
    month_rows = _month_rows(month)
    total = sum(float(row["amount"]) for row in month_rows) or 1.0
    payroll = sum(float(row["amount"]) for row in month_rows if row["category"] == "Payroll")
    ytd_payroll = sum(float(row["amount"]) for row in rows if row["category"] == "Payroll")
    ytd_total = sum(float(row["amount"]) for row in rows) or 1.0
    reply = (
        f"Payroll: {_money(payroll)} in {month}, {payroll / total * 100:.0f}% of spend.\n"
        f"• Year to date: {_money(ytd_payroll)} ({ytd_payroll / ytd_total * 100:.0f}% of spend).\n"
        "A ratio above 55% leaves little room for suppliers and VAT."
    )
    return reply, {
        "payroll": {
            "month": month,
            "payroll": round(payroll, 2),
            "share": round(payroll / total * 100, 1),
            "ytd_share": round(ytd_payroll / ytd_total * 100, 1),
        }
    }


def _automation_reply() -> tuple[str, dict]:
    summary = documents.dashboard_summary()
    reply = (
        f"Automation readiness is {summary.readiness_score}/100.\n"
        f"• {summary.needs_review} documents are waiting for review, so invoice "
        "capture is the first candidate.\n"
        "• Run the six-process check in the dashboard for effort and impact per process.\n"
        "Start with the process that has high impact and low effort, then measure "
        "hours saved for one month."
    )
    return reply, {
        "automation": {
            "readiness": summary.readiness_score,
            "needs_review": summary.needs_review,
        }
    }


def _notebook_demo(from_number: str) -> tuple[str, dict]:
    lines = [
        {"date": "11/11", "description": "Sugar 5 kg", "amount": 425.0},
        {"date": "11/11", "description": "Milk 12 packs", "amount": 960.0},
        {"date": "12/11", "description": "Transport", "amount": 300.0},
    ]
    total = sum(line["amount"] for line in lines)
    _PENDING[from_number] = {"type": "notebook", "lines": lines}
    reply = (
        "Photo received. I can read 3 handwritten lines for a total of "
        f"{_money(total)}. I have not posted them yet. Reply “post” to add them "
        "to your sales, or send another photo."
    )
    return reply, {"notebook": {"lines": lines, "total": total, "status": "needs_review"}}


def _post_notebook(from_number: str) -> tuple[str, dict] | None:
    pending = _PENDING.pop(from_number, None)
    if not pending or pending.get("type") != "notebook":
        return None
    lines = pending["lines"]
    total = round(sum(float(line["amount"]) for line in lines), 2)
    if total >= 1000:
        approval = approvals.request_approval(
            ApprovalKind.NOTEBOOK,
            f"Notebook: {len(lines)} lines",
            total,
            from_number,
            {"lines": lines},
        )
        return (
            f"{len(lines)} notebook lines total {_money(total)}. Sent to the Head of "
            f"Finance for approval ({approval.id}). Nothing is posted yet.",
            {
                "approval_id": approval.id,
                "approval_status": "pending",
                "notebook": {"lines": lines, "total": total},
            },
        )
    for line in lines:
        _SALES.append(
            {
                "date": date.today().isoformat(),
                "item": line["description"],
                "qty": 1,
                "unit_price": float(line["amount"]),
                "total": float(line["amount"]),
            }
        )
        whatsapp_store.persist_sale(
            line["description"], 1, float(line["amount"]), float(line["amount"])
        )
    return (
        f"Posted {len(lines)} lines for {_money(total)}. Sales today: {_money(_sale_today())}.",
        {"posted": lines, "total": total},
    )


def _insight_reply(message: str) -> tuple[str, dict] | None:
    result = insights.ask(message)
    if result.intent == "unknown":
        return None
    return (
        f"{result.answer}\n\n{result.calculation}",
        {"insight": {"intent": result.intent, "rows": result.rows}},
    )


def apply_approval(approval: Approval) -> None:
    reviewer = approval.reviewer or "Head of Finance"
    if approval.kind is ApprovalKind.INVOICE:
        document_id = approval.payload.get("document_id")
        if document_id:
            documents.review_document(
                str(document_id),
                ReviewRequest(reviewer=reviewer, fields=[]),
            )
    elif approval.kind is ApprovalKind.NOTEBOOK:
        for line in approval.payload.get("lines", []):
            _SALES.append(
                {
                    "date": date.today().isoformat(),
                    "item": line["description"],
                    "qty": 1,
                    "unit_price": float(line["amount"]),
                    "total": float(line["amount"]),
                }
            )
            whatsapp_store.persist_sale(
                line["description"], 1, float(line["amount"]), float(line["amount"])
            )
    elif approval.kind is ApprovalKind.SALE:
        item = str(approval.payload.get("item", "sale"))
        qty = int(approval.payload.get("qty", 1))
        unit_price = float(approval.payload.get("unit_price", 0))
        total = round(qty * unit_price, 2)
        _SALES.append(
            {
                "date": date.today().isoformat(),
                "item": item,
                "qty": qty,
                "unit_price": unit_price,
                "total": total,
            }
        )
        whatsapp_store.persist_sale(item, qty, unit_price, total)

    _log(
        "out",
        approval.requested_by,
        f"Approved by {reviewer}: {approval.summary} ({approval.id}). The action is applied.",
        "approval",
    )


def notify_decision(approval: Approval) -> None:
    reviewer = approval.reviewer or "Head of Finance"
    _log(
        "out",
        approval.requested_by,
        f"Rejected by {reviewer}: {approval.summary} ({approval.id}). Nothing was applied.",
        "approval",
    )


def handle(from_number: str, text: str, kind: str = "text") -> SimulateResponse:
    _log("in", from_number, text if kind == "text" else "[photo]", kind)
    message = text.strip()
    lowered = message.lower()

    posted = None
    if lowered in {"post", "yes", "confirm", "confirme", "oui", "wi"}:
        posted = _post_notebook(from_number)

    if posted is not None:
        reply, data = posted
        intent = "notebook_post"
    elif kind == "image" or any(word in lowered for word in ("notebook", "photo", "carnet")):
        reply, data = _notebook_demo(from_number)
        intent = "notebook"
    elif lowered in {"hi", "hello", "hey", "bonjour", "salut", "alo", "allô", "bonzour"}:
        reply = (
            "Hi 👋 I'm Lekont, your back office on WhatsApp. "
            "Invoices, payslips and your numbers, all from this chat.\n\n" + MENU
        )
        data = None
        intent = "greeting"
    elif any(word in lowered for word in ("help", "menu", "start", "ki fer")):
        reply, data, intent = MENU, None, "help"
    elif INVOICE_RE.match(message):
        match = INVOICE_RE.match(message)
        assert match is not None
        customer = match.group(1)
        amount = float(match.group(2).replace(",", ""))
        reply, data = _create_invoice(customer, amount, from_number)
        intent = "invoice"
    elif ALERT_RE.match(message):
        match = ALERT_RE.match(message)
        assert match is not None
        _ALERTS.append({"text": match.group(1), "created_at": _now().isoformat()})
        reply = f"Reminder saved: {match.group(1)}. I will show it in your next report."
        data = {"alerts": _ALERTS[-3:]}
        intent = "alert"
    elif SALE_RE.match(message):
        match = SALE_RE.match(message)
        assert match is not None
        qty = int(match.group(1))
        item = match.group(2)
        price = float(match.group(3).replace(",", "")) if match.group(3) else None
        reply, data = _record_sale(item, qty, price, from_number)
        intent = "sale"
    elif lowered in {"stock", "stok", "inventory", "stock?"} or "stock" in lowered:
        reply, data = _stock_reply()
        intent = "stock"
    elif ADD_RE.match(message):
        match = ADD_RE.match(message)
        assert match is not None
        reply, data = _add_stock(match.group(2), int(match.group(1)))
        intent = "stock_add"
    elif any(word in lowered for word in ("brief", "board", "executive", "director")):
        reply, data = _brief()
        intent = "brief"
    elif any(word in lowered for word in ("concentration", "supplier risk", "risk")):
        reply, data = _concentration()
        intent = "concentration"
    elif "vat" in lowered or "tva" in lowered:
        reply, data = _vat_reply()
        intent = "vat"
    elif "payroll" in lowered or "salary" in lowered:
        reply, data = _payroll_reply()
        intent = "payroll"
    elif any(word in lowered for word in ("automate", "automation", "readiness")):
        reply, data = _automation_reply()
        intent = "automation"
    elif any(word in lowered for word in ("report", "today", "sales", "rapport", "bilan")):
        reply, data = _report()
        intent = "report"
    else:
        insight = _insight_reply(message)
        if insight is not None:
            reply, data = insight
            intent = "insight"
        else:
            reply = "I did not catch that.\n\n" + MENU
            data = None
            intent = "unknown"

    _log("out", from_number, reply, intent, data)
    return SimulateResponse(
        reply=reply,
        intent=intent,
        messages=list(_MESSAGES),
        data=data,
    )


def list_messages(limit: int = 50) -> list[WhatsAppMessage]:
    return _MESSAGES[-limit:]


def reset() -> None:
    _MESSAGES.clear()


def send_whatsapp_message(to: str, body: str) -> bool:
    """Send via Meta Cloud API when credentials exist; otherwise no-op."""
    settings = get_settings()
    if not settings.whatsapp_token or not settings.whatsapp_phone_number_id:
        return False
    try:
        response = httpx.post(
            f"https://graph.facebook.com/v21.0/{settings.whatsapp_phone_number_id}/messages",
            headers={"Authorization": f"Bearer {settings.whatsapp_token}"},
            json={
                "messaging_product": "whatsapp",
                "to": to,
                "type": "text",
                "text": {"body": body},
            },
            timeout=15,
        )
        response.raise_for_status()
        return True
    except httpx.HTTPError as exc:
        logger.warning("WhatsApp send failed: %s", exc)
        return False
