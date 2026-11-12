from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, Field

from app.schemas.common import Language


class DocumentType(StrEnum):
    INVOICE = "invoice"
    PAYSLIP = "payslip"
    CONTRACT = "contract"


class DocumentStatus(StrEnum):
    NEEDS_REVIEW = "needs_review"
    APPROVED = "approved"
    EXPORTED = "exported"


class ExtractedField(BaseModel):
    key: str
    label: str
    value: str
    confidence: float = Field(ge=0, le=1)
    page: int = 1
    corrected: bool = False


class DocumentCreate(BaseModel):
    filename: str = Field(min_length=3, max_length=200)
    doc_type: DocumentType
    language: Language = Language.EN
    text: str = Field(min_length=10, max_length=20000)


class DocumentSummary(BaseModel):
    id: str
    filename: str
    doc_type: DocumentType
    language: Language
    supplier: str | None
    total: float | None
    currency: str
    status: DocumentStatus
    confidence: float
    needs_review: int
    uploaded_at: datetime


class Document(DocumentSummary):
    text: str
    fields: list[ExtractedField]
    reviewer: str | None = None
    reviewed_at: datetime | None = None


class FieldCorrection(BaseModel):
    key: str
    value: str


class ReviewRequest(BaseModel):
    reviewer: str = Field(min_length=2, max_length=120)
    fields: list[FieldCorrection] = Field(default_factory=list)


class ExportResponse(BaseModel):
    filename: str
    rows: int
    csv: str
