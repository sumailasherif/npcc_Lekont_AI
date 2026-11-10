"""OpenCode Go client.

Only OpenCode Go is used. The endpoint is OpenAI-compatible, so no vendor SDK
is needed; a plain httpx call keeps the dependency surface small.

Docs: https://opencode.ai/docs/go
"""

from __future__ import annotations

import uuid
from typing import Any

import httpx

from app.core.config import get_settings

USER_AGENT = "retenou-ai/0.1"

# OpenCode Go requires a stable session id so it can route and cache requests.
_DEFAULT_SESSION_ID = f"retenou-{uuid.uuid4()}"


class LLMNotConfigured(RuntimeError):
    """Raised when OPENCODE_GO_API_KEY is missing."""


def is_configured() -> bool:
    return bool(get_settings().opencode_go_api_key)


async def chat(
    messages: list[dict[str, str]],
    *,
    model: str | None = None,
    temperature: float = 0.2,
    session_id: str | None = None,
) -> str:
    """Send a chat completion to OpenCode Go and return the text content."""
    settings = get_settings()
    if not settings.opencode_go_api_key:
        raise LLMNotConfigured(
            "Set OPENCODE_GO_API_KEY in .env. Get a key at https://opencode.ai/console."
        )

    headers = {
        "Authorization": f"Bearer {settings.opencode_go_api_key}",
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
        "x-opencode-session": session_id or _DEFAULT_SESSION_ID,
    }

    payload: dict[str, Any] = {
        "model": model or settings.llm_model,
        "messages": messages,
        "temperature": temperature,
    }

    base_url = settings.opencode_go_base_url.rstrip("/")
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            f"{base_url}/chat/completions",
            headers=headers,
            json=payload,
        )
        response.raise_for_status()
        body = response.json()

    return body["choices"][0]["message"]["content"]
