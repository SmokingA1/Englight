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
    email: EmailStr = Field(..., min_length=1)
    phone_number: str | None = Field(None, min_length=10, max_length=15)
    role: str = Field(default=RoleEnum.user, max_length=5)
    created_at: datetime | None = Field(default_factory=datetime.utcnow)
    updated_at: datetime | None = Field(default_factory=datetime.utcnow)

    @field_validator("phone_number", mode="before")
    @classmethod
    def empty_str_to_none(cls, v):
        if isinstance(v, str) and not v.strip():  # Если строка пустая или состоит только из пробелов
            return None
        return v

    @field_validator("phone_number")
    @classmethod
    def validate_phone(cls, v):
        if v is not None and not v.strip():
            raise ValueError("Phone number cannot be empty if provided")
        return v

    class Config:
        from_attributes = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=64)


class UserCreateAvatar(BaseModel):
    id: UUID
    avatar_url:str


class UserUpdate(BaseModel):
    username: str | None = Field(min_length=1, max_length=30)
    email: EmailStr | None = Field(min_length=1)
    phone_number: str | None = Field(min_length=10, max_length=15)
    

class UserPublic(UserBase):
    id: UUID

    # model_config = {'from_attributes': True}
    class Config:
        from_attributes = True  # Это обязательно для работы с SQLAlchemy моделями


class DeckBase(BaseModel):
    words: List["WordRead"]


class DeckRead(DeckBase):
    id: UUID
    owner_id: UUID

    model_config = {'from_attributes': True}


class WordBase(BaseModel):
    name: str
    rank: str
    count: int


class WordCreate(WordBase):
    pass


class WordRead(WordBase):
    id: UUID

    model_config = {'from_attributes': True}


class WordUpdate(BaseModel):
    rank: None | str


class Message(BaseModel):
    data: str


class Token(BaseModel):
    sub: str
    exp: timedelta


class TokenPayload(BaseModel):
    sub: str | None = None 
    exp: float