from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class SearchProfileBase(BaseModel):
    name: str
    keywords: str
    min_score: int = 50

class SearchProfileCreate(SearchProfileBase):
    pass

class SearchProfileUpdate(BaseModel):
    name: Optional[str] = None
    keywords: Optional[str] = None
    min_score: Optional[int] = None

class SearchProfileResponse(SearchProfileBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

