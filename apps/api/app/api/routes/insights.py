from fastapi import APIRouter

from app.schemas.insights import AskRequest, AskResponse, DiagnosticRequest, DiagnosticResponse
from app.services import documents, insights

router = APIRouter(prefix="/insights", tags=["insights"])


@router.post("/ask", response_model=AskResponse)
def ask(payload: AskRequest) -> AskResponse:
    return insights.ask(payload.question, payload.language)


@router.post("/readiness", response_model=DiagnosticResponse)
def readiness(payload: DiagnosticRequest) -> DiagnosticResponse:
    result = insights.diagnose(payload)
    documents.set_readiness(result.readiness_score)
    return result
