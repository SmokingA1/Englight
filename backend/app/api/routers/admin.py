from typing import Any

from fastapi import APIRouter, HTTPException

from app.models import Role
from app.api.deps import CurrentUser 

router = APIRouter(prefix="/admin", tags=['Admin'])

@router.get('/check', response_model=bool)
async def is_admin(current_user: CurrentUser) -> Any:
    print("HEREEEEEEEEEEEEEEEEEE", current_user.role)

    if current_user.role == Role.admin:
        return True
    return False