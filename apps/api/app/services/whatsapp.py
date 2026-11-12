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
from app.db import whatsapp_store
from app.schemas.common import Language
from app.schemas.documents import DocumentCreate, DocumentType
from app.schemas.whatsapp import SimulateResponse, WhatsAppMessage
from app.services import documents, insights

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
    "Here is what I can do:\n"
    "• “sold 3 bags at 250”\n"
    "• “what is low in stock?”\n"
    "• “add 10 copier paper”\n"
    "• “invoice Ramesh 2500”\n"
    "• “how much did I sell today?”\n"
    "• “remind me to call the supplier Friday”\n"
    "• send a photo of your notebook and I will read it"
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
    whatsapp_store.persist_message(
        _MESSAGES[-1].id, direction, from_number, text, intent
    )


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


def _record_sale(item: str, qty: int, price: float | None) -> tuple[str, dict]:
    key = item.strip().lower()
    unit_price = price if price is not None else float(_STOCK.get(key, {}).get("price", 0))
    if unit_price <= 0:
        return (
            f"I can log “{item}” but I need a price. Try: sold {qty} {item} at 250",
            {"needs_price": True},
        )
    total = round(qty * unit_price, 2)
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


def _create_invoice(customer: str, amount: float) -> tuple[str, dict]:
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
    reply = (
        f"Invoice draft created for {customer.strip()} at {_money(amount)}.\n"
        f"Reference {document.id}. It is waiting in Documents for review."
    )
    return reply, {"document_id": document.id, "total": document.total}


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
    total = round(sum(float(line["amount"]) for line in lines), 2)
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
        reply = "Hi 👋 I'm Lekont, your business assistant on WhatsApp.\n\n" + MENU
        data = None
        intent = "greeting"
    elif any(word in lowered for word in ("help", "menu", "start", "ki fer")):
        reply, data, intent = MENU, None, "help"
    elif INVOICE_RE.match(message):
        match = INVOICE_RE.match(message)
        assert match is not None
        customer = match.group(1)
        amount = float(match.group(2).replace(",", ""))
        reply, data = _create_invoice(customer, amount)
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
        reply, data = _record_sale(item, qty, price)
        intent = "sale"
    elif lowered in {"stock", "stok", "inventory", "stock?"} or "stock" in lowered:
        reply, data = _stock_reply()
        intent = "stock"
    elif ADD_RE.match(message):
        match = ADD_RE.match(message)
        assert match is not None
        reply, data = _add_stock(match.group(2), int(match.group(1)))
        intent = "stock_add"
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
