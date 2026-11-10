from fastapi import APIRouter, HTTPException, status

from app.schemas.gaps import Gap
from app.store import list_gaps, promote_gap

router = APIRouter(prefix="/gaps", tags=["gaps"])


@router.get("", response_model=list[Gap])
def read_gaps() -> list[Gap]:
    return list_gaps()


@router.post("/{gap_id}/promote", response_model=Gap)
def promote(gap_id: str) -> Gap:
    gap = promote_gap(gap_id)
    if gap is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gap not found")
    return gap
