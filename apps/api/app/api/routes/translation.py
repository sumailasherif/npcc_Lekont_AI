from fastapi import APIRouter

from app.schemas.translation import TranslationRequest, TranslationResponse
from app.services import translation

router = APIRouter(tags=["translation"])


@router.post("/translate", response_model=TranslationResponse)
def translate(payload: TranslationRequest) -> TranslationResponse:
    result = translation.translate(payload.text, payload.target_language)
    return TranslationResponse(
        source_text=payload.text,
        translated_text=result.text,
        source_language=payload.source_language,
        target_language=payload.target_language,
        engine=result.engine,
        review_required=result.review_required,
        confidence=result.confidence,
    )
