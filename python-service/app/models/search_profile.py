from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class SearchProfile(Base):
    __tablename__ = "search_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    keywords = Column(Text, nullable=False)  # Armazena termos/regex separados por vírgula ou JSON
    min_score = Column(Integer, default=50)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relacionamentos
    user = relationship("User", back_populates="search_profiles")

