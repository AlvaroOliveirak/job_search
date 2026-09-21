from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.job import JobResponse

class MatchStatusUpdate(BaseModel):
    is_favorite: Optional[bool] = None
    status: Optional[str] = None  # "new", "viewed", "applied", "discarded"

class UserJobMatchResponse(BaseModel):
    id: int
    user_id: int
    job_id: int
    score: float
    is_notified_telegram: bool
    is_favorite: bool
    status: str
    matched_at: datetime
    job: JobResponse

    model_config = ConfigDict(from_attributes=True)

