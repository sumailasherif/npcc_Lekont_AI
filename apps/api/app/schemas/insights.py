from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.common import Language


class AskRequest(BaseModel):
    question: str = Field(min_length=3, max_length=500)
    language: Language = Language.EN


class Column(BaseModel):
    key: str
    label: str


class Chart(BaseModel):
    type: Literal["bar", "line"] = "bar"
    x: str
    y: str


class AskResponse(BaseModel):
    intent: str
    answer: str
    calculation: str
    columns: list[Column]
    rows: list[dict[str, str | float]]
    chart: Chart | None = None
    confidence: float = Field(ge=0, le=1)
    caveats: list[str]
    suggested: list[str]


class DiagnosticRequest(BaseModel):
    sector: str = Field(min_length=2, max_length=80)
    employees: int = Field(ge=1, le=500)
    monthly_invoices: int = Field(ge=0, le=10000)
    monthly_payslips: int = Field(ge=0, le=5000)
    admin_hours: int = Field(ge=0, le=400)
    tools: list[str] = Field(default_factory=list)
    pain_points: list[str] = Field(default_factory=list)


class ProcessScore(BaseModel):
    process: str
    score: int = Field(ge=0, le=100)
    effort: Literal["low", "medium", "high"]
    impact: Literal["low", "medium", "high"]
    reason: str


class DiagnosticResponse(BaseModel):
    readiness_score: int = Field(ge=0, le=100)
    band: str
    recommended_first: str
    summary: str
    scores: list[ProcessScore]
    next_steps: list[str]


class MonthlyPoint(BaseModel):
    month: str
    spend: float
    vat: float


class DashboardSummary(BaseModel):
    documents_total: int
    needs_review: int
    approved: int
    monthly_spend: float
    monthly_vat: float
    readiness_score: int
    top_supplier: str | None
    top_supplier_spend: float
    currency: str
    monthly: list[MonthlyPoint]
