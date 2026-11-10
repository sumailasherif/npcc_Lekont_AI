from pydantic import BaseModel, Field

from app.schemas.common import Sector


class SkillRequirement(BaseModel):
    skill: str
    required: int = Field(ge=1, le=4, description="1 = awareness, 4 = can train others")


class Role(BaseModel):
    id: str
    name: str
    sector: Sector
    headcount: int
    skills: list[SkillRequirement]
