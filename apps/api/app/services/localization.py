"""Localise the plain-language parts of an analytics answer.

The numbers, SQL calculation and row data are produced deterministically and are
never touched. Only the sentences and labels are translated, using OpenCode Go.
If the model is unavailable, the English answer is returned unchanged.
"""

from __future__ import annotations

import json
from typing import Any

from app.schemas.common import Language
from app.schemas.insights import AskResponse, Column
from app.services import llm

LANGUAGE_LABEL = {
    Language.FR: "French",
    Language.CR: "Mauritian Kreol (Kreol Morisien)",
}

SYSTEM_PROMPT = """You translate accounting software text for small businesses in Mauritius.
Rules:
- Translate every string value into {language}.
- Keep numbers, dates, currency amounts, supplier names and SQL exactly as they are.
- Keep the same JSON keys and array lengths.
- Return only valid JSON, with no markdown fences and no explanation."""

USER_PROMPT = """Translate the natural-language fields of this JSON.
Do not translate the "key" fields.

{payload}"""


def localize_response(response: AskResponse, language: Language) -> AskResponse:
    """Return the response with translated prose, or the original if unavailable."""
    if language is Language.EN or not llm.is_enabled():
        return response

    payload = {
        "answer": response.answer,
        "caveats": response.caveats,
        "suggested": response.suggested,
        "columns": [{"key": column.key, "label": column.label} for column in response.columns],
    }
    raw = llm.complete(
        SYSTEM_PROMPT.format(language=LANGUAGE_LABEL[language]),
        USER_PROMPT.format(payload=json.dumps(payload, ensure_ascii=False)),
        temperature=0.0,
        max_tokens=2000,
    )
    if not raw:
        return response

    data = _parse(raw)
    if data is None:
        return response

    answer = _string(data.get("answer")) or response.answer
    caveats = _strings(data.get("caveats")) or response.caveats
    suggested = _strings(data.get("suggested")) or response.suggested
    columns = _columns(data.get("columns"), response.columns)

    return response.model_copy(
        update={
            "answer": answer,
            "caveats": caveats,
            "suggested": suggested,
            "columns": columns,
        }
    )


def _parse(raw: str) -> dict[str, Any] | None:
    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        return None
    return parsed if isinstance(parsed, dict) else None


def _string(value: Any) -> str | None:
    return value if isinstance(value, str) and value.strip() else None


def _strings(value: Any) -> list[str] | None:
    if not isinstance(value, list):
        return None
    items = [item for item in value if isinstance(item, str) and item.strip()]
    return items or None


def _columns(value: Any, original: list[Column]) -> list[Column]:
    if not isinstance(value, list):
        return original
    labels = {
        item.get("key"): item.get("label")
        for item in value
        if isinstance(item, dict) and isinstance(item.get("key"), str)
    }
    return [
        Column(key=column.key, label=labels.get(column.key) or column.label)
        for column in original
    ]
