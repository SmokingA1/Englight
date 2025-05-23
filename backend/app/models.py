import enum
import uuid
from datetime import datetime
from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Enum, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class Role(enum.Enum):
    user='user'
    admin='admin'


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    avatar_url: Mapped[str | None] = mapped_column(String(255), default=None, nullable=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    phone_number: Mapped[str | None] = mapped_column(String(15), default=None, nullable=True, unique=True, index=True)
    role: Mapped[Role] = mapped_column(Enum(Role, name="role_enum", native_enum=False), default=Role.user, nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, onupdate=datetime.utcnow)

    # level min 0  max 20 0-1(100exp) => regard(100monet) 1-2(prev * 2) after 10-11(prev * 1.5)
    # description
    # date_of_birth
    # country 
    # gender
    # deck limit = 5 , premium + 10 deck
    # premium ? true / false
    # bill: 0monet - max(9999)monet
    # background white/dark or custom
    
    decks: Mapped[List["Deck"]] = relationship("Deck", back_populates="owner", passive_deletes=True)


class Deck(Base):
    __tablename__ = "decks"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(40), nullable=False)
    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete='CASCADE'), nullable=False)
    
    #deck cover
    #limit 200-300 words if premium 500words
 
    owner: Mapped["User"] = relationship("User", back_populates="decks")
    words: Mapped[List["Word"]] = relationship("Word", back_populates="deck", passive_deletes=True)


class Rank(enum.Enum):
    easy='easy'
    medium='medium'
    difficult='difficult'


class Word(Base):
    __tablename__ = "word"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    deck_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("decks.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(45), index=True, nullable=False)
    translate: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    description: Mapped[str] = mapped_column(String(350), nullable=False)
    rank: Mapped[Rank] = mapped_column(Enum(Rank, name="rank_enum", native_enum=False), nullable=False, index=True)
    count: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    deck: Mapped["Deck"] = relationship("Deck", back_populates="words")