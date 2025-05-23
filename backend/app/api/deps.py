from datetime import datetime
from typing import Annotated, Any

from fastapi import Request, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError, jwt
from pydantic import ValidationError

from app.core.database import SessionDep
from app.models import User
from app.schemas import TokenPayload
from app.core.config import settings

async def get_current_user(db: SessionDep, request: Request) -> User:
    print("here")
    token = request.cookies.get("access_token")

    print(token)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Token is missing")

    try: 
        token_payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM] )
        token_data = TokenPayload(**token_payload)

        if token_data.exp < datetime.utcnow().timestamp():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
            )
        
    except (ValidationError, JWTError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials!"
        )

    db_user = await db.get(User, token_data.sub)
    if not db_user: 
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found while token decoding!")
    
    return db_user

CurrentUser = Annotated[User, Depends(get_current_user)]