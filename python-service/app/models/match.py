from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Float, Boolean, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserJobMatch(Base):
    __tablename__ = "user_job_matches"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Float, default=0.0)
    is_notified_telegram = Column(Boolean, default=False)
    is_favorite = Column(Boolean, default=False)
    status = Column(String, default="new")  # "new", "viewed", "applied", "discarded"
    matched_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Garante que não teremos duplicidade de match para o mesmo usuário e mesma vaga
    __table_args__ = (
        UniqueConstraint("user_id", "job_id", name="uq_user_job"),
    )

    # Relacionamentos
    user = relationship("User", back_populates="matches")
    job = relationship("Job", back_populates="matches")

