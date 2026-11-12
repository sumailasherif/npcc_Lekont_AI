"""Minimal OpenAI-compatible client used for document extraction.

Works with OpenCode Go (default), OpenAI, or any provider exposing
``POST {base_url}/chat/completions``. The rest of the app works offline when no
key is configured; the LLM is an enhancement, never a hard dependency.
"""

from __future__ import annotations

import logging
import uuid

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)

USER_AGENT = "lekont-ai/0.1"
_SESSION_ID = f"lekont-{uuid.uuid4()}"


def is_enabled() -> bool:
    return bool(get_settings().opencode_go_api_key)


def complete(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.2,
    max_tokens: int | None = None,
) -> str | None:
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
