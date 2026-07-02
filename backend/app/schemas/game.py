from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict


# Shared properties
class GameBase(BaseModel):
    title: str
    min_players: Optional[int] = None
    max_players: Optional[int] = None
    description: Optional[str] = None


# Properties to receive on creation
class GameCreate(GameBase):
    pass


# Properties to receive on update
class GameUpdate(BaseModel):
    title: Optional[str] = None
    min_players: Optional[int] = None
    max_players: Optional[int] = None
    description: Optional[str] = None


# Properties to return
class GameOut(GameBase):
    id: int
    owner_id: str
    added_date: date
    times_played: int = 0  # Calculated dynamically in endpoints

    model_config = ConfigDict(from_attributes=True)
