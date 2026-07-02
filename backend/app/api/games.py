from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.database import get_db
from app.api import deps
from app.models.user import User
from app.models.game import BoardGame
from app.models.match import MatchRecord
from app.schemas.game import GameOut, GameCreate, GameUpdate

router = APIRouter()


@router.get("/", response_model=List[GameOut])
async def list_games(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
    sort_by: str = Query("name-asc", description="Sort order: name-asc, name-desc, recent, oldest, most-played"),
    search: Optional[str] = Query(None, description="Search query matching boardgame title")
) -> Any:
    # Subquery / group-by to get times_played
    query = (
        select(BoardGame, func.count(MatchRecord.id).label("times_played"))
        .outerjoin(MatchRecord, BoardGame.id == MatchRecord.game_id)
        .where(BoardGame.owner_id == current_user.id)
    )

    if search:
        query = query.where(BoardGame.title.ilike(f"%{search}%"))

    query = query.group_by(BoardGame.id)

    # Apply sorting
    if sort_by == "name-asc":
        query = query.order_by(BoardGame.title.asc())
    elif sort_by == "name-desc":
        query = query.order_by(BoardGame.title.desc())
    elif sort_by == "recent":
        query = query.order_by(BoardGame.added_date.desc(), BoardGame.id.desc())
    elif sort_by == "oldest":
        query = query.order_by(BoardGame.added_date.asc(), BoardGame.id.asc())
    elif sort_by == "most-played":
        query = query.order_by(func.count(MatchRecord.id).desc(), BoardGame.title.asc())

    result = await db.execute(query)
    games_with_counts = result.all()

    out_list = []
    for row in games_with_counts:
        game, times_played = row
        out_list.append(
            GameOut(
                id=game.id,
                owner_id=game.owner_id,
                title=game.title,
                min_players=game.min_players,
                max_players=game.max_players,
                description=game.description,
                added_date=game.added_date,
                times_played=times_played
            )
        )
    return out_list


@router.post("/", response_model=GameOut, status_code=status.HTTP_201_CREATED)
async def create_game(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
    game_in: GameCreate
) -> Any:
    db_game = BoardGame(
        owner_id=current_user.id,
        title=game_in.title,
        min_players=game_in.min_players,
        max_players=game_in.max_players,
        description=game_in.description
    )
    db.add(db_game)
    await db.commit()
    await db.refresh(db_game)
    return GameOut(
        id=db_game.id,
        owner_id=db_game.owner_id,
        title=db_game.title,
        min_players=db_game.min_players,
        max_players=db_game.max_players,
        description=db_game.description,
        added_date=db_game.added_date,
        times_played=0
    )


@router.put("/{id}", response_model=GameOut)
async def update_game(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
    id: int,
    game_in: GameUpdate
) -> Any:
    result = await db.execute(
        select(BoardGame).where(BoardGame.id == id, BoardGame.owner_id == current_user.id)
    )
    game = result.scalars().first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found or access denied")

    for field in ["title", "min_players", "max_players", "description"]:
        value = getattr(game_in, field)
        if value is not None:
            setattr(game, field, value)

    db.add(game)
    await db.commit()
    await db.refresh(game)

    # Get dynamic times played
    result_count = await db.execute(
        select(func.count(MatchRecord.id)).where(MatchRecord.game_id == game.id)
    )
    times_played = result_count.scalar() or 0

    return GameOut(
        id=game.id,
        owner_id=game.owner_id,
        title=game.title,
        min_players=game.min_players,
        max_players=game.max_players,
        description=game.description,
        added_date=game.added_date,
        times_played=times_played
    )


@router.delete("/{id}")
async def delete_game(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
    id: int
) -> Any:
    result = await db.execute(
        select(BoardGame).where(BoardGame.id == id, BoardGame.owner_id == current_user.id)
    )
    game = result.scalars().first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found or access denied")

    await db.delete(game)
    await db.commit()
    return {"success": True}
