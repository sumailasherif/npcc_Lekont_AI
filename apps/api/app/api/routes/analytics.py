from fastapi import APIRouter

from app.schemas.analytics import AnalyticsSummary
from app.store import summary

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
def read_summary() -> AnalyticsSummary:
    return summary()
