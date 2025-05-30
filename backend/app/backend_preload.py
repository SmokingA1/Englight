from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User
from app.core.security import hash_password

async def check_admin(db: AsyncSession) -> User:
    """
        Function check for existing admin in the db if not create him.
    """
    query = select(User).where(User.role == "admin")
    admin = await db.execute(query)
    
    if not admin.scalars().one_or_none():
        new_admin = User(
            username="SmokingA1", # any name
            email="smokinga1wm@gmail.com", # any email
            avatar_url="static/avatars/d-avatar.jpg",   
            hashed_password=hash_password("admin12345678admin"),
            phone_number=None,
            role="admin",
        )

        db.add(new_admin)
        await db.commit()
        await db.refresh(new_admin)

        return new_admin
    else: 
        print({"data": "It's fine admin exists!"})

