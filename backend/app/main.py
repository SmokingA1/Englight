from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
app = FastAPI(title=settings.PROJECT_NAME)

# Настроим FastAPI на обслуживание статичных файлов
app.mount("/static", StaticFiles(directory="static"), name="static")


origins = [
    "http://localhost:3000",
    "http://localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.get("/", response_model=dict)
async def home_page():
    return {"data": "This is main route!"}
