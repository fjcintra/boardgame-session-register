from fastapi import APIRouter
from app.api import auth, users, games, matches

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(games.router, prefix="/games", tags=["games"])
api_router.include_router(matches.router, prefix="/matches", tags=["matches"])
