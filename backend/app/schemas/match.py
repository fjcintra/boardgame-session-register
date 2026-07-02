from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


# Shared properties
class MatchBase(BaseModel):
    game_id: int
    date: date
    duration_minutes: int
    players_count: int
    winner_name: str
    notes: Optional[str] = None


# Properties to receive on creation
class MatchCreate(BaseModel):
    game_id: int
    winner_name: str
    duration_minutes: int
    players_count: int
    notes: Optional[str] = None
    date: Optional[date] = None


# Properties to return
class MatchOut(MatchBase):
    id: int
    user_id: str
    game_title: str  # Dynamically loaded from relationship
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
