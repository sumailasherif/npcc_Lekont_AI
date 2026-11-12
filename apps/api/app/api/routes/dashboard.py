from fastapi import APIRouter

from app.schemas.insights import DashboardSummary
from app.services import documents

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def summary() -> DashboardSummary:
    return documents.dashboard_summary()
