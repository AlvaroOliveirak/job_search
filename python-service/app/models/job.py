from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    job_hash = Column(String(64), unique=True, index=True, nullable=False)  # Hash SHA-256 para deduplicação
    title = Column(String, nullable=False, index=True)
    company = Column(String, nullable=False, index=True)
    location = Column(String, nullable=True)
    url = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    source = Column(String, nullable=False, default="Gupy")
    posted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relacionamentos
    matches = relationship("UserJobMatch", back_populates="job", cascade="all, delete-orphan")

