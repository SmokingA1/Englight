from typing import List, Any
import uuid

# required for avatar
from fastapi import Depends, UploadFile, File, Form
import shutil
import os
from uuid import uuid4
from app.core.config import settings

from fastapi import APIRouter, Path, Query, HTTPException

from app.schemas import UserCreate, UserCreateAvatar, UserPublic, UserUpdate, Message
from app.services.user import (
    get_user_by_email,
    get_user_by_id,
    get_user_by_phone,
    get_users,
    create_new_user,
    update_avatar_user,
    update_existing_user,
    delete_existing_user
)
from app.api.deps import CurrentUser
from app.core.database import SessionDep

router = APIRouter(prefix="/users", tags=["User"])

@router.get("/", response_model=List[UserPublic])
async def read_users(
    db: SessionDep,
    offset: int = Query(0, title="Quantity of skip elements is required"), 
    limit: int = Query(20, title="Quantity of elements to display is required"),
) -> Any:
    """
    Reading users with pagination
    """
    
    db_users = await get_users(db, offset, limit)

    if not db_users:
        raise HTTPException(status_code=404, detail="Users not found!")
    
    return db_users


@router.get("/me", response_model=UserPublic)
def read_user_me(current_user: CurrentUser) -> Any:
    """
    Get current user.
    """
    print("here beffore")
    return current_user


@router.get("/{user_id}", response_model=UserPublic)
async def read_user_by_id(db: SessionDep, user_id: uuid.UUID) -> Any:
    """
    Get a specific user by id
    """

    db_user = await get_user_by_id(db, user_id)

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found!")
    
    return db_user


@router.get("/email/{user_email}", response_model=UserPublic)
async def read_user_by_email(db: SessionDep, user_email: str) -> Any:
    """
    Get a specific user by email
    """

    db_user = await get_user_by_email(db, user_email)

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found!")
    
    return db_user


@router.get("/phone-number/{user_phone}", response_model=UserPublic)
async def read_user_by_phone_number(db: SessionDep, user_phone: str) -> Any:
    """
    Get a specific user by phone number
    """

    db_user = await get_user_by_phone(db, user_phone)

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return db_user


@router.post("/register", response_model=UserPublic)
async def create_user(db: SessionDep, user_create: UserCreate) -> Any:
    """
    Creating a new user
    """

    #Checking for existing data
    db_email = await get_user_by_email(db, user_create.email)
    db_phone = await get_user_by_phone(db, user_create.phone_number)

    if db_email:
        raise HTTPException(status_code=400, detail="Such email already exists!")
    if db_phone and db_phone.phone_number != None:
        print(db_phone.phone_number)
        raise HTTPException(status_code=400, detail="Such phone number already exists!")
    
    new_user = await create_new_user(db, user_create)

    if not new_user:
        raise HTTPException(status_code=400, detail="Something went wrong!")
    
    return new_user

#Очень страшные дела
@router.post("/upload-avatar", response_model=UserPublic)
async def upload_user_avatar(
    db: SessionDep,
    user_id: int = Form(...),
    file: UploadFile = File(...)
):
    # Генерируем уникальное имя файла
    file_ext = file.filename.split('.')[-1]
    unique_filename = f"{uuid4()}.{file_ext}"
    file_path = os.path.join(settings.AVATAR_UPLOAD_DIR, unique_filename)

    # Сохраняем файл
    os.makedirs(settings.AVATAR_UPLOAD_DIR, exist_ok=True)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    avatar_url = f"/{file_path}"

    # Обновляем пользователя
    user_data = UserCreateAvatar(id=user_id, avatar_url=avatar_url)
    user = await update_avatar_user(db, user_data)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.put("/update/me", response_model=UserPublic)
async def update_me(db: SessionDep, user_update: UserUpdate, current_user: CurrentUser) -> Any:
    """
    Updating the current user by id
    """

    updated_user = await update_existing_user(db, current_user.id, user_update)

    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found!")
    
    return updated_user


@router.put("/update/{user_id}", response_model=UserPublic)
async def update_user_by_id(db: SessionDep, user_id: uuid.UUID, user_update: UserUpdate) -> Any:
    """
    Updating a specific user by id
    """
    
    updated_user = await update_existing_user(db, user_id, user_update)

    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found!")
    
    return updated_user


@router.delete("/delete/me/", response_model=Message)
async def delete_user_me(db: SessionDep, current_user: CurrentUser) -> Any:
    """
    Deleting the current user by id
    """

    deleted_user = await delete_existing_user(db, current_user.id)

    if not deleted_user:
        raise HTTPException(status_code=404, detail="User not found!")
    
    return Message(data="User deleted successfully!")


@router.delete("/delete/{user_id}", response_model=Message)
async def delete_user_by_id(db: SessionDep, user_id: uuid.UUID) -> Any:
    """
    Deleting a specific user by id
    """
    deleted_user = await delete_existing_user(db, user_id)
    
    if not deleted_user:
        raise HTTPException(status_code=404, detail="User not found!")
    
    return Message(data="User deleted successfully!")

