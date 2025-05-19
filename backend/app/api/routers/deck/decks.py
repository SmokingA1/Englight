from uuid import UUID
from typing import Any, List

from fastapi import APIRouter, HTTPException, Query

from app.api.deps import CurrentUser
from app.core.database import SessionDep
from app.schemas import DeckCreate, DeckRead, DeckUpdate, Message
from app.services.deck import (
    get_deck_by_id,
    get_decks_by_user_id,
    get_decks,
    create_deck,
    update_deck_name,
    delete_deck_by_id
)

router = APIRouter(prefix="/decks", tags=["Deck"])

@router.get("/my-all", response_model=List[DeckRead])
async def read_decks_my(db: SessionDep, current_user: CurrentUser) -> Any:
    """
        Get all decks by current user id
    """
    db_decks = await get_decks_by_user_id(db, current_user.id)

    if not db_decks:
        raise HTTPException(status_code=404, detail="Decks not found!")
    
    return db_decks


@router.get("/all", response_model=List[DeckRead])
async def read_decks(
    db: SessionDep,
    offset: int = Query(0, title="Quantit of skip decks is required"),
    limit: int = Query(20, title="Quantity of elements to display id required"),
) -> Any:
    """
        Get all decks
    """
    db_decks = await get_decks(db, offset, limit)

    if not db_decks:
        raise HTTPException(status_code=404, detail="Decks not found!")
    
    return db_decks


@router.get("/{deck_id}", response_model=DeckRead)
async def read_deck_by_id(db: SessionDep, deck_id: UUID) -> Any:
    """
        Get specifig deck by id
    """
    db_deck = await get_deck_by_id(db, deck_id)

    if not db_deck:
        raise HTTPException(status_code=404, detail="Deck not found!")
    
    return db_deck


@router.post("/create/", response_model=DeckRead)
async def create_new_deck(db: SessionDep, deck_create: DeckCreate) -> Any:
    """
        Create new deck 
    """
    new_deck = await create_deck(db, deck_create)

    if not new_deck:
        raise HTTPException(status_code=400, detail="Something went wrong, incorrect data!")
    
    return new_deck


@router.put("/update-name/{deck_id}", response_model=Message)
async def update_existing_deck_name(
    db: SessionDep,
    deck_id: UUID,
    deck_update: DeckUpdate,
) -> Any:
    """
        Updating name of existing deck
    """
    updated_deck = await update_deck_name(db, deck_id, deck_update)

    if not updated_deck:
        raise HTTPException(status_code=404, detail="Deck not found!")
    
    return Message(data="Deck name updated successfully!")


@router.delete("/delete/{deck_id}", response_model=Message)
async def delete_exsting_deck_by_id(db: SessionDep, deck_id: UUID) -> Any:
    """
        Delete a specific deck by id
    """
    deleted_deck = await delete_deck_by_id(db, deck_id)
    
    if not deleted_deck:
        raise HTTPException(status_code=404, detail="Deck not found!")
    
    return Message(data="Deck deleted successfully!")