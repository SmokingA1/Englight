from typing import List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.schemas import WordCreate, WordUpdate
from app.models import Word

async def get_word_by_id(db: AsyncSession, word_id: UUID) -> Word | None:
    db_word = await db.get(Word, word_id)
    return db_word


async def get_words_by_deck_id(
    db: AsyncSession,
    deck_id: UUID,
    offset: int,
    limit: int,
) -> List[Word] | None:
    query = await db.execute(
        select(Word)
        .where(Word.deck_id == deck_id)
        .offset(offset)
        .limit(limit)
        )
    db_words = query.scalars().all()
    return db_words


async def get_words(
    db: AsyncSession,
    offset: int,
    limit: int,
) -> List[Word] | None:
    query = await db.execute(
        select(Word).offset(offset).limit(limit)
    )
    db_words = query.scalars().all()
    return db_words


async def create_word(
    db: AsyncSession,
    word_create: WordCreate,
) -> Word | None:
    new_word = Word(**word_create.model_dump())

    db.add(new_word)
    await db.commit()
    await db.refresh(new_word)

    return new_word


async def update_word_by_id(
    db: AsyncSession,
    word_id: UUID,
    word_update: WordUpdate,
) -> Word | None:
    db_word = await get_word_by_id(db, word_id)

    if not db_word:
        return None

    update_data = word_update.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(db_word, k, v)
    
    await db.commit()
    await db.refresh(db_word)

    return db_word


async def delete_word_by_id(
    db: AsyncSession,
    word_id: UUID,
) -> Word | None:
    db_word = await get_word_by_id(db, word_id)

    if not db_word:
        return None
    
    await db.delete(db_word)
    await db.commit()

    return db_word