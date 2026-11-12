"""Ledger source: Postgres when configured, synthetic rows otherwise."""

from __future__ import annotations

from typing import Any

from app.data.backoffice import LEDGER
from app.db import postgres

_CACHE: list[dict[str, Any]] | None = None


def get_ledger() -> list[dict[str, Any]]:
    global _CACHE
    if _CACHE is None:
        _CACHE = postgres.load_ledger() or LEDGER
    return _CACHE
