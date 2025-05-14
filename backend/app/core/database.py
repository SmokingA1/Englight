from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker, AsyncAttrs
from sqlalchemy.orm import DeclarativeBase
from typing import AsyncGenerator, Annotated
from app.core.config import settings
from fastapi import Depends

class Base(AsyncAttrs, DeclarativeBase):
    pass


engine = create_async_engine(settings.DATABASE_url_asyncpg, echo=True)
SessionLocal = async_sessionmaker(
    autoflush=False,
    autocommit=False,
    bind=engine,
    class_=AsyncSession
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session


SessionDep = Annotated[AsyncSession, Depends(get_db)]