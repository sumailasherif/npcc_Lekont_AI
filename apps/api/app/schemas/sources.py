from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, Field

from app.schemas.common import Sector


class SourceKind(StrEnum):
    PDF = "pdf"
    DOCX = "docx"
    AUDIO = "audio"
    VIDEO = "video"
    URL = "url"
    TEXT = "text"


class SourceStatus(StrEnum):
    UPLOADED = "uploaded"
    INGESTING = "ingesting"
    READY = "ready"
    FAILED = "failed"


class SourceCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    kind: SourceKind
    sector: Sector
    language: str = "en"
    notes: str | None = Field(default=None, max_length=1000)


class Source(BaseModel):
    id: str
    title: str
    kind: SourceKind
    sector: Sector
    language: str
    status: SourceStatus
    chunks: int
    created_at: datetime
    notes: str | None = None
