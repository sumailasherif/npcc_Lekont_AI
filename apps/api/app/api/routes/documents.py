from fastapi import APIRouter, HTTPException, status

from app.schemas.documents import (
    Document,
    DocumentCreate,
    DocumentSummary,
    ExportResponse,
    ReviewRequest,
)
from app.services import documents

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("", response_model=list[DocumentSummary])
def read_documents() -> list[DocumentSummary]:
    return documents.list_documents()


@router.post("", response_model=Document, status_code=status.HTTP_201_CREATED)
def add_document(payload: DocumentCreate) -> Document:
    return documents.create_document(payload)


@router.get("/export", response_model=ExportResponse)
def export() -> ExportResponse:
    return documents.export_csv()


@router.get("/{document_id}", response_model=Document)
def read_document(document_id: str) -> Document:
    document = documents.get_document(document_id)
    if document is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return document


@router.post("/{document_id}/review", response_model=Document)
def review(document_id: str, payload: ReviewRequest) -> Document:
    document = documents.review_document(document_id, payload)
    if document is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return document
