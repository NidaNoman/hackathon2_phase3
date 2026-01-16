# backend/app/schemas/user.py
# Schemas for User-related data, moved from packages/types/python/user.py for local use in backend.

from pydantic import BaseModel, Field

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8) # This will be hashed

class UserInDB(UserBase):
    id: int
    password_hash: str

    class Config:
        from_attributes = True

class UserPublic(UserBase):
    id: int

    class Config:
        from_attributes = True
