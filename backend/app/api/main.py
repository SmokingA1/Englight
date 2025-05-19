from fastapi import APIRouter
from app.api.routers.user import login
from app.api.routers.user import users
from app.api.routers.deck import decks
from app.api.routers.word import words

api_router = APIRouter()

api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(decks.router)
api_router.include_router(words.router)