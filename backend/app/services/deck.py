from typing import Any
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.database import SessionDep
from app.models import Deck
from app.schemas import (
    DeckBase,
    DeckRead
)


async def get_deck_by_id(db: AsyncSession, deck_id: UUID) -> Any:   
    db_deck = await db.get(Deck, deck_id)
    return db_deck


async def get_deck_by_user_id(db: AsyncSession, owner_id: UUID) -> Any:
    query = await db.execute(select(Deck).where(Deck.owner_id == owner_id))
    db_deck = query.scalars().first()
    return db_deck


async def get_decks(
    db: AsyncSession
) -> Any:
    query = await db.execute(select(Deck))
    db_decks = query.scalars().all()
    return db_decks
