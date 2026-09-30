from datetime import datetime
from typing import Optional
from pydantic import BaseModel, HttpUrl, ConfigDict

class JobBase(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    url: str
    description: Optional[str] = None
    source: str = "Gupy"

class JobCreate(JobBase):
    job_hash: str
    posted_at: Optional[datetime] = None

class JobResponse(JobBase):
    id: int
    job_hash: str
    posted_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

