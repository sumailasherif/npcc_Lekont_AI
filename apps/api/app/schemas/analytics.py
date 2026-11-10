from pydantic import BaseModel

from app.schemas.common import Language


class AnalyticsSummary(BaseModel):
    questions_total: int
    covered_rate: float
    gaps_open: int
    sops_published: int
    sops_in_review: int
    languages: list[Language]
