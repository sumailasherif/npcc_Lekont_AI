"""Grounded answer generation over an OpenAI-compatible chat endpoint.

Works with OpenCode Go (default), OpenAI, or any provider exposing
``POST {base_url}/chat/completions``. The model only ever sees approved SOP
steps, and callers fall back to the raw steps if this returns ``None``.
"""

from __future__ import annotations

import logging
import uuid

import httpx

from app.core.config import get_settings
from app.schemas.common import Language

logger = logging.getLogger(__name__)

USER_AGENT = "retenou-ai/0.1"
# OpenCode Go requires a stable session id so it can route and cache requests.
_SESSION_ID = f"retenou-{uuid.uuid4()}"

LANGUAGE_NAMES = {
    Language.EN: "English",
    Language.FR: "French",
    Language.CR: "Mauritian Creole (Kreol Morisien)",
}

SYSTEM_PROMPT = """You are Retenou AI, a shop-floor assistant for factory operators in Mauritius.
Answer ONLY from the approved work-instruction steps provided. Rules:
- Do not add steps, tools, settings or safety advice that are not in the steps.
- Keep every safety step and keep the original step order.
- Refer to steps by their number, e.g. "(step 2)".
- If the steps do not answer the question, reply exactly: NOT_COVERED
- Be short and practical: numbered steps an operator can follow at the machine.
- Reply in {language}."""


def is_enabled() -> bool:
    return bool(get_settings().opencode_go_api_key)


def complete(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.2,
    max_tokens: int | None = None,
) -> str | None:
    """Generic grounded completion, used by the translation and expert layers."""
    settings = get_settings()
    if not settings.opencode_go_api_key:
        return None

    try:
        response = httpx.post(
            f"{settings.opencode_go_base_url.rstrip('/')}/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.opencode_go_api_key}",
                "Content-Type": "application/json",
                "User-Agent": USER_AGENT,
                "x-opencode-session": _SESSION_ID,
            },
            json={
                "model": settings.llm_model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": temperature,
                "max_tokens": max_tokens or settings.llm_max_tokens,
            },
            timeout=settings.llm_timeout_seconds,
        )
        response.raise_for_status()
        content = response.json()["choices"][0]["message"].get("content") or ""
    except (httpx.HTTPError, KeyError, IndexError, ValueError) as exc:
        logger.warning("LLM call failed: %s", exc)
        return None

    content = content.strip()
    return content or None


def generate_answer(
    question: str,
    language: Language,
    sop_title: str,
    steps: list[tuple[int, str]],
) -> str | None:
    """Return a grounded answer, or ``None`` if the LLM is off or the call fails."""
    settings = get_settings()
    if not settings.opencode_go_api_key:
        return None

    context = "\n".join(f"{order}. {text}" for order, text in steps)
    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT.format(language=LANGUAGE_NAMES[language]),
        },
        {
            "role": "user",
            "content": (
                f"Approved work instruction: {sop_title}\n{context}\n\n"
                f"Operator question: {question}"
            ),
        },
    ]

    try:
        response = httpx.post(
            f"{settings.opencode_go_base_url.rstrip('/')}/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.opencode_go_api_key}",
                "Content-Type": "application/json",
                "User-Agent": USER_AGENT,
                "x-opencode-session": _SESSION_ID,
            },
            json={
                "model": settings.llm_model,
                "messages": messages,
                "temperature": 0.2,
                "max_tokens": settings.llm_max_tokens,
            },
            timeout=settings.llm_timeout_seconds,
        )
        response.raise_for_status()
        content = response.json()["choices"][0]["message"].get("content") or ""
    except (httpx.HTTPError, KeyError, IndexError, ValueError) as exc:
        logger.warning("LLM call failed, falling back to raw SOP steps: %s", exc)
        return None

    content = content.strip()
    if not content or "NOT_COVERED" in content:
        return None
    return content
