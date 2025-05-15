from fastapi import APIRouter
from app.api.routers.user import login
from app.api.routers.user import users

api_router = APIRouter()

api_router.include_router(login.router)
api_router.include_router(users.router)
