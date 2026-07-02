from typing import Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.api import deps
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate
from app.core import security

router = APIRouter()


@router.get("/me", response_model=UserOut)
async def get_user_me(
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    return current_user


@router.put("/me", response_model=UserOut)
async def update_user_me(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    for field in ["nome", "sobrenome", "telefone", "endereco", "numero", "complemento", "cidade", "estado"]:
        value = getattr(user_in, field)
        if value is not None:
            setattr(current_user, field, value)
            
    if user_in.password is not None:
        current_user.hashed_password = security.get_password_hash(user_in.password)
        
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user
