from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import current_user
from app.schemas.sops import (
    ApproveRequest,
    Sop,
    SopCreate,
    SopSummary,
    TranslateRequest,
)
from app.store import (
    approve_sop,
    create_sop,
    generate_sop,
    get_sop,
    list_sops,
    submit_sop,
    translate_sop,
)

router = APIRouter(prefix="/sops", tags=["sops"])


def _require(sop: Sop | None) -> Sop:
    if sop is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SOP not found")
    return sop


@router.get("", response_model=list[SopSummary])
def read_sops() -> list[SopSummary]:
    return list_sops()


@router.post("", response_model=Sop, status_code=status.HTTP_201_CREATED)
def add_sop(payload: SopCreate) -> Sop:
    return create_sop(payload)


@router.get("/{sop_id}", response_model=Sop)
def read_sop(sop_id: str) -> Sop:
    return _require(get_sop(sop_id))


@router.post("/{sop_id}/generate", response_model=Sop)
def generate(sop_id: str) -> Sop:
    return _require(generate_sop(sop_id))


@router.post("/{sop_id}/translate", response_model=Sop)
def translate(sop_id: str, payload: TranslateRequest) -> Sop:
    return _require(translate_sop(sop_id, payload.languages))


@router.post("/{sop_id}/submit", response_model=Sop)
def submit(sop_id: str) -> Sop:
    return _require(submit_sop(sop_id))


@router.post("/{sop_id}/approve", response_model=Sop)
def approve(
    sop_id: str,
    payload: ApproveRequest,
    actor: str = Depends(current_user),
) -> Sop:
    reviewer = payload.reviewer or actor
    return _require(approve_sop(sop_id, reviewer))
