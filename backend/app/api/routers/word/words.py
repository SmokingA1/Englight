from typing import List, Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import select

from app.models import Word
from app.core.database import SessionDep
from app.schemas import WordCreate, WordRead, WordUpdate, Message
from app.services.word import (
    get_word_by_id,
    get_words_by_deck_id,
    get_words,
    create_word,
    update_word_by_id,
    delete_word_by_id,   
)

router = APIRouter(prefix="/words", tags=['Word'])

@router.get("/all", response_model=List[WordRead])
async def read_words(
    db: SessionDep,
    offset: int = Query(0, title="Quantity of skip elements is required!"),
    limit: int = Query(30, title="Quantity of skip elements is required!"),
) -> Any:
    """
        Get all words, not matter from which a deck.
    """
    db_words = await get_words(db, offset, limit)

    if not db_words:
        raise HTTPException(status_code=404, detail="Words not found!")
    
    return db_words


@router.get("/{word_id}", response_model=WordRead)
async def read_word_by_id(db: SessionDep, word_id: UUID) -> Any:
    """
        Get a specific word by id.
    """
    db_word = await get_word_by_id(db, word_id)

    if not db_word:
       raise HTTPException(status_code=404, detail='Not found')

    return db_word


@router.get("/all/{deck_id}", response_model=List[WordRead])
async def read_words_by_deck_id(
    db: SessionDep,
    deck_id: UUID,
    offset: int = Query(0, title="Quantity of skip elements is required!"),
    limit: int = Query(30, title="Quantity of skip elements is required!"),
) -> Any:
    """
        Get all words from a specific deck by deck id.
    """
    db_words = await get_words_by_deck_id(db, deck_id, offset, limit)
    
    if not db_words:
        raise HTTPException(status_code=404, detail="There are no words in the deck yet!")
    
    return db_words


@router.post("/create/", response_model=WordRead)
async def create_new_word(
    db: SessionDep, 
    word_create: WordCreate,
) -> Any:
    """
        Create new word with params.
    """
    existing_word = await db.execute(
                    select(Word)
                    .where(
                        (Word.deck_id == word_create.deck_id) &
                        (Word.name == word_create.name))
                    )

    if existing_word.scalars().first():
        raise HTTPException(status_code=400, detail="Word with this name already exists in the deck!")
    
    new_word = await create_word(db, word_create)

    if not new_word:
        raise HTTPException(status_code=500, detail="Failed to create new word.")

    return new_word


@router.put("/update/{word_id}/deck/{deck_id}", response_model=Message)
async def update_existing_word(
    db: SessionDep,
    word_id: UUID,
    deck_id: UUID,
    word_update: WordUpdate,
) -> Any:
    """
        Update existing word with params by id.
    """
    existing_word = await db.execute(
                    select(Word)
                    .where(
                        (Word.deck_id == deck_id) &
                        (Word.name == word_update.name))
                    )

    if existing_word.scalars().first():
        raise HTTPException(status_code=400, detail="Word with this name already exists in the deck!")
    
    updated_word = await update_word_by_id(db, word_id, word_update)

    if not updated_word:
        raise HTTPException(status_code=500, detail="Failed to update existing word.")

    return Message(data = "Word updated successfully!")


@router.delete("/delete/{word_id}", response_model=Message)
async def delete_existing_word(db: SessionDep, word_id: UUID) -> Any:
    """
        Delete existing word by id.
    """
    deleted_word = await delete_word_by_id(db, word_id)

    if not deleted_word:
        raise HTTPException(status_code=404, detail="Word not found!")
    
    return Message(data = "Word deleted successfully!")