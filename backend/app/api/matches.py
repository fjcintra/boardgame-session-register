from datetime import date
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.database import get_db
from app.api import deps
from app.models.user import User
from app.models.match import MatchRecord
from app.models.game import BoardGame
from app.schemas.match import MatchOut, MatchCreate

router = APIRouter()


@router.get("/", response_model=List[MatchOut])
async def list_matches(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
    game_ids: Optional[List[int]] = Query(None, description="Filter matches by boardgame IDs"),
    sort_by: str = Query("date-desc", description="Sort order: date-desc, date-asc, winner, playtime, players"),
    search: Optional[str] = Query(None, description="Search matches by winner name or notes")
) -> Any:
    # Query matches and select game title
    query = (
        select(MatchRecord, BoardGame.title)
        .join(BoardGame, MatchRecord.game_id == BoardGame.id)
        .where(MatchRecord.user_id == current_user.id)
    )

    # Filter by games
    if game_ids:
        query = query.where(MatchRecord.game_id.in_(game_ids))

    # Search keyword
    if search:
        query = query.where(
            (MatchRecord.winner_name.ilike(f"%{search}%")) |
            (MatchRecord.notes.ilike(f"%{search}%"))
        )

    # Apply sorting
    if sort_by == "date-desc":
        query = query.order_by(MatchRecord.date.desc(), MatchRecord.id.desc())
    elif sort_by == "date-asc":
        query = query.order_by(MatchRecord.date.asc(), MatchRecord.id.asc())
    elif sort_by == "winner":
        query = query.order_by(MatchRecord.winner_name.asc())
    elif sort_by == "playtime":
        query = query.order_by(MatchRecord.duration_minutes.desc())
    elif sort_by == "players":
        query = query.order_by(MatchRecord.players_count.desc())

    result = await db.execute(query)
    matches_raw = result.all()

    out_list = []
    for row in matches_raw:
        match_rec, game_title = row
        out_list.append(
            MatchOut(
                id=match_rec.id,
                game_id=match_rec.game_id,
                user_id=match_rec.user_id,
                date=match_rec.date,
                duration_minutes=match_rec.duration_minutes,
                players_count=match_rec.players_count,
                winner_name=match_rec.winner_name,
                notes=match_rec.notes,
                game_title=game_title,
                created_at=match_rec.created_at
            )
        )
    return out_list


@router.post("/", response_model=MatchOut, status_code=status.HTTP_201_CREATED)
async def create_match(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
    match_in: MatchCreate
) -> Any:
    # Ensure the board game exists and is owned by the user
    result_game = await db.execute(
        select(BoardGame).where(BoardGame.id == match_in.game_id, BoardGame.owner_id == current_user.id)
    )
    game = result_game.scalars().first()
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The specified board game does not exist in your collection."
        )

    db_match = MatchRecord(
        game_id=match_in.game_id,
        user_id=current_user.id,
        date=match_in.date or date.today(),
        duration_minutes=match_in.duration_minutes,
        players_count=match_in.players_count,
        winner_name=match_in.winner_name,
        notes=match_in.notes
    )
    db.add(db_match)
    await db.commit()
    await db.refresh(db_match)

    return MatchOut(
        id=db_match.id,
        game_id=db_match.game_id,
        user_id=db_match.user_id,
        date=db_match.date,
        duration_minutes=db_match.duration_minutes,
        players_count=db_match.players_count,
        winner_name=db_match.winner_name,
        notes=db_match.notes,
        game_title=game.title,
        created_at=db_match.created_at
    )


@router.delete("/{id}")
async def delete_match(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
    id: int
) -> Any:
    result = await db.execute(
        select(MatchRecord).where(MatchRecord.id == id, MatchRecord.user_id == current_user.id)
    )
    match_rec = result.scalars().first()
    if not match_rec:
        raise HTTPException(status_code=404, detail="Match record not found or access denied")

    await db.delete(match_rec)
    await db.commit()
    return {"success": True}
