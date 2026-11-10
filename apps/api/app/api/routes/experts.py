from fastapi import APIRouter, HTTPException, status

from app.data.experts import EXPERTS_BY_ID
from app.schemas.experts import (
    Expert,
    ExpertCategory,
    ExpertChatRequest,
    ExpertChatResponse,
)
from app.services import expert_chat

router = APIRouter(prefix="/experts", tags=["experts"])


def list_experts(
    category: ExpertCategory | None = None,
    q: str | None = None,
) -> list[Expert]:
    experts = list(EXPERTS_BY_ID.values())
    if category is not None:
        experts = [expert for expert in experts if category in expert.categories]
    if q:
        needle = q.strip().lower()
        experts = [
            expert
            for expert in experts
            if needle in expert.name.lower()
            or needle in expert.role.lower()
            or needle in expert.organisation.lower()
            or needle in expert.headline.lower()
            or any(needle in topic.lower() for topic in expert.topics)
        ]
    return sorted(experts, key=lambda expert: (not expert.mauritian, not expert.featured))


@router.get("", response_model=list[Expert])
def read_experts(
    category: ExpertCategory | None = None,
    q: str | None = None,
) -> list[Expert]:
    return list_experts(category=category, q=q)


@router.get("/{expert_id}", response_model=Expert)
def read_expert(expert_id: str) -> Expert:
    expert = EXPERTS_BY_ID.get(expert_id)
    if expert is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expert not found")
    return expert


@router.post("/{expert_id}/chat", response_model=ExpertChatResponse)
def chat(expert_id: str, payload: ExpertChatRequest) -> ExpertChatResponse:
    expert = EXPERTS_BY_ID.get(expert_id)
    if expert is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expert not found")
    return expert_chat.reply(
        expert,
        payload.message,
        payload.language,
        payload.history,
    )
