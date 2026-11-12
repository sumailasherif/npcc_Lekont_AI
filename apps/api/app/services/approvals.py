"""Human-in-the-loop approvals for high-value or irreversible actions.

A Head of Finance (or any named reviewer) approves or rejects:
- invoice drafts before they can be sent,
- notebook postings above the threshold,
- sales above the operator's limit.

Every decision is recorded and the requester is notified on WhatsApp.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime
from threading import Lock
from typing import Any

from app.schemas.approvals import Approval, ApprovalKind, ApprovalStatus

# Above this amount, a human must approve before the action is applied.
APPROVAL_THRESHOLD_MUR = 1000.0

_LOCK = Lock()
_APPROVALS: dict[str, Approval] = {}


def _now() -> datetime:
    return datetime.now(UTC)


def request_approval(
    kind: ApprovalKind,
    summary: str,
    amount: float,
    requested_by: str,
    payload: dict[str, Any],
) -> Approval:
    approval = Approval(
        id=f"req-{uuid.uuid4().hex[:8]}",
        kind=kind,
        summary=summary,
        amount=round(amount, 2),
        requested_by=requested_by,
        created_at=_now(),
        payload=payload,
    )
    with _LOCK:
        _APPROVALS[approval.id] = approval
    return approval


def list_approvals(status: ApprovalStatus | None = None) -> list[Approval]:
    items = list(_APPROVALS.values())
    if status is not None:
        items = [item for item in items if item.status is status]
    return sorted(
        items,
        key=lambda item: (item.status is not ApprovalStatus.PENDING, item.created_at),
        reverse=False,
    )


def get_approval(approval_id: str) -> Approval | None:
    return _APPROVALS.get(approval_id)


def decide(
    approval_id: str,
    approve: bool,
    reviewer: str,
    comment: str | None = None,
) -> Approval | None:
    with _LOCK:
        approval = _APPROVALS.get(approval_id)
        if approval is None or approval.status is not ApprovalStatus.PENDING:
            return None
        approval.status = ApprovalStatus.APPROVED if approve else ApprovalStatus.REJECTED
        approval.reviewer = reviewer
        approval.comment = comment
        approval.decided_at = _now()

    if approve:
        # Lazy import avoids a cycle: WhatsApp creates approvals.
        from app.services import whatsapp

        whatsapp.apply_approval(approval)
    else:
        from app.services import whatsapp

        whatsapp.notify_decision(approval)
    return approval
