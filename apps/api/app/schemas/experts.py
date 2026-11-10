from enum import StrEnum
from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.common import Language


class ExpertCategory(StrEnum):
    LEADERSHIP = "leadership"
    TEXTILE = "textile"
    FOOD = "food"
    ENGINEERING = "engineering"
    SUPPLY_CHAIN = "supply_chain"
    QUALITY = "quality"
    MAINTENANCE = "maintenance"
    AI = "ai"
    FINANCE = "finance"


class KnowledgeCard(BaseModel):
    id: str
    title: str
    body: str
    source: str
    year: int | None = None
    topics: list[str] = Field(default_factory=list)


class Expert(BaseModel):
    id: str
    name: str
    initials: str
    role: str
    organisation: str
    country: str
    city: str | None = None
    categories: list[ExpertCategory]
    headline: str
    bio: str
    languages: list[str]
    accent: str
    featured: bool = False
    mauritian: bool = False
    verified: bool = False
    profile_type: Literal["public_record", "composite"] = "public_record"
    disclaimer: str
    topics: list[str]
    sample_questions: list[str]
    knowledge: list[KnowledgeCard]


class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ExpertChatRequest(BaseModel):
    message: str = Field(min_length=2, max_length=1200)
    language: Language = Language.EN
    history: list[ChatTurn] = Field(default_factory=list, max_length=20)


class ExpertCitation(BaseModel):
    card_id: str
    title: str
    source: str
    year: int | None = None


class ExpertChatResponse(BaseModel):
    answer: str
    source_answer: str
    language: Language
    citations: list[ExpertCitation]
    confidence: float
    engine: str
    review_required: bool
    suggested: list[str]
    disclaimer: str
