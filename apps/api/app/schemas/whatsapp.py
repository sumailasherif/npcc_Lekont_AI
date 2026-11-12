from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class WhatsAppMessage(BaseModel):
    id: str
    direction: Literal["in", "out"]
    from_number: str
    text: str
    intent: str = "text"
    created_at: datetime
    data: dict[str, Any] | None = None


class SimulateRequest(BaseModel):
    from_number: str = Field(default="23050000000", min_length=6, max_length=24)
    text: str = Field(default="", max_length=1000)
    kind: Literal["text", "image"] = "text"


class SimulateResponse(BaseModel):
    reply: str
    intent: str
    messages: list[WhatsAppMessage]
    data: dict[str, Any] | None = None
