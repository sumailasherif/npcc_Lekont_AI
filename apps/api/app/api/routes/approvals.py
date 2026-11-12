from fastapi import APIRouter, HTTPException, status

from app.schemas.approvals import Approval, ApprovalDecision, ApprovalStatus
from app.services import approvals

router = APIRouter(prefix="/approvals", tags=["approvals"])


@router.get("", response_model=list[Approval])
def read_approvals(status_filter: ApprovalStatus | None = None) -> list[Approval]:
    return approvals.list_approvals(status_filter)


@router.get("/{approval_id}", response_model=Approval)
def read_approval(approval_id: str) -> Approval:
    approval = approvals.get_approval(approval_id)
    if approval is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Approval not found")
    return approval


@router.post("/{approval_id}/approve", response_model=Approval)
def approve(approval_id: str, payload: ApprovalDecision) -> Approval:
    approval = approvals.decide(approval_id, True, payload.reviewer, payload.comment)
    if approval is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Approval not found or already decided",
        )
    return approval


@router.post("/{approval_id}/reject", response_model=Approval)
def reject(approval_id: str, payload: ApprovalDecision) -> Approval:
    approval = approvals.decide(approval_id, False, payload.reviewer, payload.comment)
    if approval is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Approval not found or already decided",
        )
    return approval
