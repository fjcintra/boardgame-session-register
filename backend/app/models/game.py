from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class BoardGame(Base):
    __tablename__ = "board_games"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    title = Column(String(255), nullable=False)
    min_players = Column(Integer, nullable=True)
    max_players = Column(Integer, nullable=True)
    description = Column(String(1000), nullable=True)
    added_date = Column(Date, server_default=func.current_date(), nullable=False)

    # Relationships
    owner = relationship("User", back_populates="games")
    matches = relationship("MatchRecord", back_populates="game", cascade="all, delete-orphan")
