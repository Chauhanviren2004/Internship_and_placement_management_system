from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

from core.security import create_access_token, get_password_hash, validate_password_length, verify_password
from db.database import get_database
from schemas.user import UserCreate, UserOut, UserRole
from utils.user_store import ROLE_COLLECTIONS, profile_defaults_for_role, user_to_response

router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: UserRole


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: Any = Depends(get_database)):
    try:
        validate_password_length(user_in.password)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    collection_name = ROLE_COLLECTIONS[user_in.role]
    existing_user = await db[collection_name].find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    document = {
        "email": user_in.email,
        "full_name": user_in.full_name,
        "hashed_password": get_password_hash(user_in.password),
        "is_active": True,
        "created_at": datetime.utcnow(),
        "role": user_in.role,
    }

    if user_in.role == "company":
        document["company_name"] = user_in.full_name

    result = await db[collection_name].insert_one(document)
    created_user = await db[collection_name].find_one({"_id": result.inserted_id})

    if user_in.role == "student":
        await db["studentProfile"].update_one(
            {"student_id": str(result.inserted_id)},
            {"$setOnInsert": {"student_id": str(result.inserted_id), **profile_defaults_for_role("student")}},
            upsert=True,
        )

    return user_to_response(created_user, user_in.role, profile_defaults_for_role(user_in.role))


@router.post("/login")
async def login(payload: LoginRequest, db: Any = Depends(get_database)):
    try:
        validate_password_length(payload.password)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    collection_name = ROLE_COLLECTIONS[payload.role]
    user = await db[collection_name].find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    token_with_role = create_access_token({"sub": str(user["_id"]), "role": payload.role})

    await db[collection_name].update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login_at": datetime.utcnow()}},
    )

    profile = profile_defaults_for_role(payload.role)
    if payload.role == "student":
        stored_profile = await db["studentProfile"].find_one({"student_id": str(user["_id"])})
        if stored_profile:
            profile.update(
                {
                    "phone": stored_profile.get("phone", ""),
                    "college": stored_profile.get("college", ""),
                    "skills": stored_profile.get("skills", ""),
                    "description": stored_profile.get("description", ""),
                    "resume_url": stored_profile.get("resume_url", ""),
                }
            )
    elif payload.role == "company":
        profile.update(
            {
                "phone": user.get("phone", ""),
                "description": user.get("description", ""),
                "company_name": user.get("company_name", user.get("full_name", "")),
                "website": user.get("website", ""),
                "location": user.get("location", ""),
            }
        )

    return {
        "access_token": token_with_role,
        "token_type": "bearer",
        "user": user_to_response(user, payload.role, profile),
    }
