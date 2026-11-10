from fastapi import APIRouter

from app.schemas.query import QueryRequest, QueryResponse
from app.store import answer_question

router = APIRouter(tags=["query"])


@router.post("/query", response_model=QueryResponse)
def ask(payload: QueryRequest) -> QueryResponse:
    return answer_question(payload.question, payload.language, payload.role_id)
