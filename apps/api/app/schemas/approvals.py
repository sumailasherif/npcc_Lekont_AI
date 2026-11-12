from datetime import datetime
from enum import StrEnum
from typing import Any

from pydantic import BaseModel, Field


class ApprovalKind(StrEnum):
    INVOICE = "invoice"
    NOTEBOOK = "notebook"
    SALE = "sale"


class ApprovalStatus(StrEnum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class Approval(BaseModel):
    id: str
    kind: ApprovalKind
    summary: str
    amount: float
    currency: str = "MUR"
    requested_by: str
    status: ApprovalStatus = ApprovalStatus.PENDING
    reviewer: str | None = None
    comment: str | None = None
    created_at: datetime
    decided_at: datetime | None = None
    payload: dict[str, Any] = Field(default_factory=dict)


class ApprovalDecision(BaseModel):
    reviewer: str = Field(min_length=2, max_length=120)
    comment: str | None = Field(default=None, max_length=500)
