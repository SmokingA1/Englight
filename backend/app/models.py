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

    decks: Mapped[List["Deck"]] = relationship("Deck", back_populates="owner", passive_deletes=True)


class Deck(Base):
    __tablename__ = "decks"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(40), nullable=False)
    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete='CASCADE'), nullable=False)

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
    name: Mapped[str] = mapped_column(String(45))
    description: Mapped[str] = mapped_column(String(150), nullable=False)
    rank: Mapped[Rank] = mapped_column(Enum(Rank, name="rank_enum", native_enum=False))
    count: Mapped[int] = mapped_column(Integer)

    deck: Mapped["Deck"] = relationship("Deck", back_populates="words")