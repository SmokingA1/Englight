from typing import Any, List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.database import SessionDep
from app.models import Deck
from app.schemas import (
    DeckCreate,
    DeckUpdate
)

async def get_deck_by_id(db: AsyncSession, deck_id: UUID) -> Deck | None:   
    db_deck = await db.get(Deck, deck_id)
    return db_deck


async def get_deck_by_user_id(db: AsyncSession, owner_id: UUID) -> Deck | None:
    query = await db.execute(select(Deck).where(Deck.owner_id == owner_id))
    db_deck = query.scalars().first()
    return db_deck


async def get_decks(
    db: AsyncSession,
    offset: int,
    limit: int,
) -> List[Deck] | None:
    query = await db.execute(select(Deck).offset(offset).limit(limit))
    db_decks = query.scalars().all()
    return db_decks


async def get_decks_by_user_id(
    db: AsyncSession, owner_id: UUID
) -> List[Deck] | None:
    query = await db.execute(select(Deck).where(Deck.owner_id == owner_id))
    db_decks = query.scalars().all()
    return db_decks


async def create_deck(db: AsyncSession, deck_create: DeckCreate) -> Deck | None:
    new_deck = Deck(
        name = deck_create.name,
        owner_id = deck_create.owner_id
    )

    db.add(new_deck)
    await db.commit()
    await db.refresh(new_deck)
    return new_deck


async def update_deck_name(db: AsyncSession, deck_id: UUID, deck_update: DeckUpdate) -> Deck | None:
    db_deck = await get_deck_by_id(db, deck_id)
    
    if not db_deck:
        return None
    
    db_deck.name = deck_update.name
    await db.commit()
    await db.refresh(db_deck)

    return db_deck


async def delete_deck_by_id(db: AsyncSession, deck_id: UUID) -> Deck | None:
    db_deck = await get_deck_by_id(db, deck_id)
    
    if not db_deck:
        return None
    
    await db.delete(db_deck)
    await db.commit()

    return db_deck