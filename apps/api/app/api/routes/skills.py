from fastapi import APIRouter, HTTPException, status

from app.schemas.skills import Role
from app.store import list_roles

router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("/roles", response_model=list[Role])
def read_roles() -> list[Role]:
    return list_roles()


@router.get("/roles/{role_id}", response_model=Role)
def read_role(role_id: str) -> Role:
    for role in list_roles():
        if role.id == role_id:
            return role
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
