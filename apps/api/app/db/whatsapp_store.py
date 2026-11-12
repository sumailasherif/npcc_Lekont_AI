"""Postgres persistence for the WhatsApp chatbot.

Best-effort: the bot keeps working in memory when the database is unavailable.
"""

from __future__ import annotations

import logging
from typing import Any

from app.db import postgres

logger = logging.getLogger(__name__)


def _rows(sql: str, params: tuple[Any, ...]) -> list[dict[str, Any]]:
    connection = postgres._connect()  # noqa: SLF001 - same package
    if connection is None:
        return []
    try:
        with connection, connection.cursor() as cursor:
            cursor.execute(sql, params)
            return list(cursor.fetchall())
    except Exception as exc:  # noqa: BLE001
        logger.warning("WhatsApp read failed: %s", exc)
        return []
    finally:
        connection.close()


def _write(sql: str, params: tuple[Any, ...]) -> None:
    connection = postgres._connect()  # noqa: SLF001
    if connection is None:
        return
    try:
        with connection, connection.cursor() as cursor:
            cursor.execute(sql, params)
    except Exception as exc:  # noqa: BLE001
        logger.warning("WhatsApp write failed: %s", exc)
    finally:
        connection.close()


def load_messages(limit: int = 60) -> list[dict[str, Any]]:
    return _rows(
        """
        select id, direction, from_number, body, intent, created_at
        from whatsapp_messages
        where org_id = %s
        order by created_at desc
        limit %s
        """,
        (postgres.DEMO_ORG_ID, limit),
    )[::-1]


def persist_message(
    message_id: str,
    direction: str,
    from_number: str,
    body: str,
    intent: str,
) -> None:
    _write(
        """
        insert into whatsapp_messages
          (id, org_id, direction, from_number, body, intent)
        values (%s, %s, %s, %s, %s, %s)
        on conflict (id) do nothing
        """,
        (message_id, postgres.DEMO_ORG_ID, direction, from_number, body, intent),
    )


def load_stock() -> list[dict[str, Any]]:
    return _rows(
        """
        select name, quantity::float as qty, unit, unit_price::float as price,
               reorder_level::float as reorder
        from stock_items
        where org_id = %s
        order by name
        """,
        (postgres.DEMO_ORG_ID,),
    )


def upsert_stock(
    name: str,
    quantity: float,
    unit: str,
    unit_price: float,
    reorder: float,
) -> None:
    _write(
        """
        insert into stock_items
          (org_id, name, quantity, unit, unit_price, reorder_level, updated_at)
        values (%s, %s, %s, %s, %s, %s, now())
        on conflict (org_id, name)
        do update set quantity = excluded.quantity, unit = excluded.unit,
                      unit_price = excluded.unit_price,
                      reorder_level = excluded.reorder_level,
                      updated_at = now()
        """,
        (postgres.DEMO_ORG_ID, name, quantity, unit, unit_price, reorder),
    )


def load_sales() -> list[dict[str, Any]]:
    return _rows(
        """
        select sold_at::date::text as date, item, quantity::float as qty,
               unit_price::float as unit_price, total::float as total
        from sales
        where org_id = %s
        order by sold_at
        """,
        (postgres.DEMO_ORG_ID,),
    )


def persist_sale(item: str, qty: float, unit_price: float, total: float) -> None:
    _write(
        """
        insert into sales (org_id, item, quantity, unit_price, total, channel)
        values (%s, %s, %s, %s, %s, 'whatsapp')
        """,
        (postgres.DEMO_ORG_ID, item, qty, unit_price, total),
    )
