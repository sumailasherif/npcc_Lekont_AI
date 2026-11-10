from datetime import datetime

from pydantic import BaseModel

from app.schemas.common import GapStatus, Language, Sector


class Gap(BaseModel):
    id: str
    question: str
    language: Language
    sector: Sector
    role_id: str | None
    count: int
    status: GapStatus
    first_seen: datetime
    last_seen: datetime
