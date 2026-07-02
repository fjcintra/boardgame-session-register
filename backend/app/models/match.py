from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class MatchRecord(Base):
    __tablename__ = "match_records"

    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("board_games.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    date = Column(Date, server_default=func.current_date(), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    players_count = Column(Integer, nullable=False)
    winner_name = Column(String(255), nullable=False)
    notes = Column(String(2000), nullable=True)  # Used for house rules / text logs
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    game = relationship("BoardGame", back_populates="matches")
    user = relationship("User", back_populates="matches")
