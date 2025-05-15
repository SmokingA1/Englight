from fastapi import APIRouter, Response, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from app.services.user import authenticate
from app.core.config import settings
from app.core.security import create_access_token
from app.schemas import Message
from app.core.database import SessionDep

from typing import Annotated
from datetime import timedelta


router = APIRouter(tags=['Login'])


@router.post("/login", response_model=Message)
async def login(db: SessionDep, response: Response, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    """
    OAuth compatible token login, get an access token for future requests
    """
    db_user = await authenticate(db, email=form_data.username, password=form_data.password)
    if not db_user:
        raise HTTPException(status_code=404, detail="Incorrect email of password")
    
    expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(subject=db_user.id, expires_delta=expires_delta)
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        secure=False,
        httponly=True,
        samesite="Lax"
    )

    return Message(data="Logged in successfully!")