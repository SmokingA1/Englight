from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.schemas import UserCreate, UserCreateAvatar, UserUpdate
from app.models import User
from app.core.security import verify_password
from typing import List
from uuid import UUID
from app.core.security import hash_password

async def get_user_by_id(db: AsyncSession, user_id: UUID) -> User | None:
    db_user = await db.get(User, user_id)
    return db_user


async def get_user_by_email(db: AsyncSession, user_email: str) -> User | None:
    query = select(User).where(User.email == user_email)
    db_user = await db.execute(query)

    return db_user.scalars().first()


async def get_user_by_phone(db: AsyncSession, user_phone: str) -> User | None:
    query = select(User).where(User.phone_number == user_phone)
    db_user = await db.execute(query)

    return db_user.scalars().first()


async def get_user_by_username(db: AsyncSession, username: str) -> User | None:
    query = select(User).where(User.username == username)
    db_user = await db.execute(query)

    return db_user.scalars().all()


async def get_users(db: AsyncSession, offset: int, limit: int = 20) -> List[User] | None:
    query = select(User).offset(offset=offset).limit(limit=limit)
    db_users = await db.execute(query)

    return db_users.scalars().all()


async def create_new_user(db: AsyncSession, user_create: UserCreate) -> User | None:
    new_user = User(username = user_create.username,
                    hashed_password = hash_password(user_create.password),
                    email = user_create.email,
                    phone_number = user_create.phone_number,
                    avatar_url = user_create.avatar_url,
                    role = user_create.role
                    )   

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


async def update_avatar_user(db: AsyncSession, user_create_avatar: UserCreateAvatar) -> User | None:
    db_user = await get_user_by_id(db, user_create_avatar.id)
    if not db_user:
        return None
    
    db_user.avatar_url = user_create_avatar.avatar_url

    await db.commit()
    await db.refresh(db_user)

    return db_user


async def update_existing_user(db: AsyncSession, user_id: UUID, user_update: UserUpdate) -> User | None:
    db_user = await get_user_by_id(db, user_id)
    
    if not db_user: 
        return None
    
    update_data = user_update.model_dump()
    for k, v in update_data.items():
        if v is not None:
            setattr(db_user, k, v)

    await db.commit()
    await db.refresh(db_user)
    return db_user


async def delete_existing_user(db: AsyncSession, user_id: UUID) -> User | None:
    db_user = await get_user_by_id(db, user_id)
    if not db_user:
        return None
    
    await db.delete(db_user)
    await db.commit()

    return db_user


async def authenticate(db: AsyncSession, email: str, password: str) -> User | None:
    db_user = await get_user_by_email(db, user_email=email)
    
    if not db_user or not verify_password(password, db_user.hashed_password):
        return None
    
    return db_user