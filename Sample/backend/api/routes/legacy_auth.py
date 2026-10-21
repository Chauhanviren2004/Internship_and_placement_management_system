from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

from core.security import create_access_token, get_password_hash, validate_password_length, verify_password
from db.database import get_database
from utils.user_store import ROLE_COLLECTIONS, get_user_with_profile_by_role, profile_defaults_for_role

router = APIRouter()


class LegacyRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LegacyLoginRequest(BaseModel):
    email: EmailStr
    password: str


async def register_legacy_user(role: str, payload: LegacyRegisterRequest, db: Any):
    try:
        validate_password_length(payload.password)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    collection_name = ROLE_COLLECTIONS[role]
    existing_user = await db[collection_name].find_one({"email": payload.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    document = {
        "email": payload.email,
        "full_name": payload.name,
        "hashed_password": get_password_hash(payload.password),
        "is_active": True,
        "created_at": datetime.utcnow(),
        "role": role,
    }
    if role == "company":
        document["company_name"] = payload.name

    result = await db[collection_name].insert_one(document)
    if role == "student":
        await db["studentProfile"].update_one(
            {"student_id": str(result.inserted_id)},
            {"$setOnInsert": {"student_id": str(result.inserted_id), **profile_defaults_for_role("student")}},
            upsert=True,
        )

    return {
        "message": "User created Successfully",
        "register_id": str(result.inserted_id),
    }


async def login_legacy_user(role: str, payload: LegacyLoginRequest, db: Any):
    try:
        validate_password_length(payload.password)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    collection_name = ROLE_COLLECTIONS[role]
    user = await db[collection_name].find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    password_valid = False
    if user.get("hashed_password"):
        password_valid = verify_password(payload.password, user["hashed_password"])
    elif user.get("password") is not None:
        password_valid = payload.password == user.get("password")
        if password_valid:
            await db[collection_name].update_one(
                {"_id": user["_id"]},
                {
                    "$set": {"hashed_password": get_password_hash(payload.password)},
                    "$unset": {"password": ""},
                },
            )
            user = await db[collection_name].find_one({"_id": user["_id"]})

    if not password_valid:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token = create_access_token({"sub": str(user["_id"]), "role": role})
    normalized_user = await get_user_with_profile_by_role(db, role, str(user["_id"]))
    return {
        "message": "Login successful",
        "token": access_token,
        "user": normalized_user,
    }


@router.post("/student/register", status_code=status.HTTP_200_OK, tags=["student"])
async def student_register(payload: LegacyRegisterRequest, db: Any = Depends(get_database)):
    return await register_legacy_user("student", payload, db)


@router.post("/company/register", status_code=status.HTTP_200_OK, tags=["company"])
async def company_register(payload: LegacyRegisterRequest, db: Any = Depends(get_database)):
    return await register_legacy_user("company", payload, db)


@router.post("/admin/register", status_code=status.HTTP_200_OK, tags=["admin"])
async def admin_register(payload: LegacyRegisterRequest, db: Any = Depends(get_database)):
    return await register_legacy_user("admin", payload, db)


@router.post("/student/login", status_code=status.HTTP_200_OK, tags=["student"])
async def student_login(payload: LegacyLoginRequest, db: Any = Depends(get_database)):
    return await login_legacy_user("student", payload, db)


@router.post("/company/login", status_code=status.HTTP_200_OK, tags=["company"])
async def company_login(payload: LegacyLoginRequest, db: Any = Depends(get_database)):
    return await login_legacy_user("company", payload, db)


@router.post("/admin/login", status_code=status.HTTP_200_OK, tags=["admin"])
async def admin_login(payload: LegacyLoginRequest, db: Any = Depends(get_database)):
    return await login_legacy_user("admin", payload, db)
