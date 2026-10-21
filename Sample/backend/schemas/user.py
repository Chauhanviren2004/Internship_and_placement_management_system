from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field

UserRole = Literal["student", "company", "admin"]


class UserProfile(BaseModel):
    phone: str = ""
    college: str = ""
    skills: str = ""
    description: str = ""
    resume_url: str = ""
    company_name: str = ""
    website: str = ""
    location: str = ""


class UserProfileUpdate(BaseModel):
    phone: str = ""
    college: str = ""
    skills: str = ""
    description: str = ""
    resume_url: str = ""
    company_name: str = ""
    website: str = ""
    location: str = ""


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = Field(..., description="Role of the user")


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserDB(UserBase):
    id: str
    hashed_password: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    profile: UserProfile = Field(default_factory=UserProfile)


class UserOut(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    profile: UserProfile
