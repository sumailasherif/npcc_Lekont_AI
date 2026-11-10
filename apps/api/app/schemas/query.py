from pydantic import BaseModel, Field

from app.schemas.common import Language


class QueryRequest(BaseModel):
    question: str = Field(min_length=3, max_length=1000)
    language: Language = Language.EN
    role_id: str | None = None


class Citation(BaseModel):
    sop_id: str
    version: int
    step: int
    quote: str


class QueryResponse(BaseModel):
    covered: bool
    answer: str
    language: Language
    confidence: float = Field(ge=0, le=1)
    citations: list[Citation]
    gap_id: str | None = None
    disclaimer: str
