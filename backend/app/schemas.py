from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime, timedelta
from uuid import UUID
from typing import List
from enum import Enum

class RoleEnum(str, Enum):
    user = "user"
    admin = "admin"


class UserBase(BaseModel):
    username: str = Field(..., min_length=1, max_length=30)
    avatar_url: str = Field("static/avatars/d-avatar.jpg", min_length=1)
    email: EmailStr = Field(...)
    phone_number: str | None = Field(None, min_length=10, max_length=15)
    role: RoleEnum = Field(default=RoleEnum.user, max_length=5)
    created_at: datetime | None = Field(default_factory=datetime.utcnow)
    updated_at: datetime | None = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

    @field_validator("phone_number", mode="before")
    @classmethod
    def parse_null_phone(cls, v):
        if v is None or not v.strip():
            return None
        return v


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=64)


class UserCreateAvatar(BaseModel):
    id: UUID
    avatar_url:str


class UserUpdate(BaseModel):
    username: str | None = Field(None, min_length=1, max_length=30)
    email: EmailStr | None = Field(None)
    phone_number: str | None = Field(None, min_length=10, max_length=15)
    
    @field_validator("phone_number", mode="before")
    @classmethod
    def empty_string_to_none(cls, v):
        if isinstance(v, str) and not v.strip():
            return None
        return v


class UserPublic(UserBase):
    id: UUID

    class Config:
        from_attributes = True  # Это обязательно для работы с SQLAlchemy моделями


class DeckBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=40)
    owner_id: UUID

class DeckCreate(DeckBase):
    pass 


class DeckUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=40)

class DeckRead(DeckBase):
    id: UUID
    # words: List["WordRead"]

    class Config:
        from_attributes = True


class RankEnum(str, Enum):
    easy='easy'
    medium='medium'
    difficult='difficult'


class WordBase(BaseModel):
    deck_id: UUID
    name: str = Field(..., min_length=1, max_length=45)
    description: str = Field(..., min_length=10, max_length=150)
    rank:  RankEnum = Field(default=RankEnum.difficult, max_length=9)
    count: int = Field(0, ge=0)
    

class WordCreate(WordBase):
    pass


class WordRead(WordBase):
    id: UUID

    class Config:
        from_attributes = True


class WordUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=45)
    description: str | None = Field(None, min_length=10, max_length=150)
    rank:  RankEnum | None = Field(None, max_length=9)
    count: int | None = Field(None, ge=0)


class Message(BaseModel):
    data: str


class Token(BaseModel):
    sub: str
    exp: timedelta


class TokenPayload(BaseModel):
    sub: str | None = None 
    exp: float