from pydantic import BaseModel, Field

from app.schemas.common import Language


class TranslationRequest(BaseModel):
    text: str = Field(min_length=1, max_length=4000)
    target_language: Language
    source_language: Language = Language.EN


class TranslationResponse(BaseModel):
    source_text: str
    translated_text: str
    source_language: Language
    target_language: Language
    engine: str
    review_required: bool
    confidence: float = Field(ge=0, le=1)
