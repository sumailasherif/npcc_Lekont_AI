from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import Language, RiskLevel, Sector, SopStatus


class SopStep(BaseModel):
    order: int = Field(ge=1)
    text: str = Field(min_length=3)
    risk: RiskLevel = RiskLevel.LOW


class SopTranslation(BaseModel):
    language: Language
    title: str
    steps: list[SopStep]


class SopSummary(BaseModel):
    id: str
    title: str
    sector: Sector
    role_id: str
    machine_id: str | None
    status: SopStatus
    version: int
    languages: list[Language]
    approved_by: str | None
    updated_at: datetime


class Sop(SopSummary):
    translations: dict[Language, SopTranslation]


class SopCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    sector: Sector
    role_id: str
    machine_id: str | None = None
    source_id: str | None = None


class TranslateRequest(BaseModel):
    languages: list[Language] = Field(default_factory=lambda: [Language.EN])


class ApproveRequest(BaseModel):
    reviewer: str = Field(min_length=2, max_length=120)
    comment: str | None = Field(default=None, max_length=1000)
