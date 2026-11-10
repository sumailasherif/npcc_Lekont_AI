from fastapi import APIRouter, HTTPException, status

from app.schemas.sources import Source, SourceCreate
from app.store import create_source, delete_source, list_sources

router = APIRouter(prefix="/sources", tags=["sources"])


@router.get("", response_model=list[Source])
def read_sources() -> list[Source]:
    return list_sources()


@router.post("", response_model=Source, status_code=status.HTTP_201_CREATED)
def add_source(payload: SourceCreate) -> Source:
    return create_source(payload)


@router.delete("/{source_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_source(source_id: str) -> None:
    if not delete_source(source_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Source not found")
