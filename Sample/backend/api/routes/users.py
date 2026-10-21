from typing import Any, List

from fastapi import APIRouter, Depends

from api.deps import get_current_active_user, get_database, require_roles
from schemas.user import UserOut, UserProfileUpdate
from utils.user_store import ROLE_COLLECTIONS, get_user_with_profile_by_role

router = APIRouter()


@router.get("/me", response_model=UserOut)
async def read_user_me(current_user: dict = Depends(get_current_active_user)):
    return current_user


@router.put("/me/profile", response_model=UserOut)
async def update_profile(
    payload: UserProfileUpdate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(get_current_active_user),
):
    if current_user["role"] == "student":
        await db["studentProfile"].update_one(
            {"student_id": current_user["id"]},
            {
                "$set": {
                    "student_id": current_user["id"],
                    "phone": payload.phone,
                    "college": payload.college,
                    "skills": payload.skills,
                    "description": payload.description,
                    "resume_url": payload.resume_url,
                }
            },
            upsert=True,
        )
    else:
        collection_name = ROLE_COLLECTIONS[current_user["role"]]
        update_data = {
            "phone": payload.phone,
            "description": payload.description,
        }
        if current_user["role"] == "company":
            update_data.update(
                {
                    "company_name": payload.company_name or current_user["full_name"],
                    "website": payload.website,
                    "location": payload.location,
                }
            )
        await db[collection_name].update_one(
            {"email": current_user["email"]},
            {"$set": update_data},
        )

    return await get_user_with_profile_by_role(db, current_user["role"], current_user["id"])


@router.get("/", response_model=List[UserOut])
async def get_all_users(
    role: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("admin")),
):
    roles_to_fetch = [role] if role in ROLE_COLLECTIONS else list(ROLE_COLLECTIONS.keys())
    results = []
    remaining = limit

    for current_role in roles_to_fetch:
        if remaining <= 0:
            break
        collection_name = ROLE_COLLECTIONS[current_role]
        users = await db[collection_name].find().skip(skip if len(results) == 0 else 0).limit(remaining).to_list(length=remaining)
        for user in users:
            results.append(await get_user_with_profile_by_role(db, current_role, str(user["_id"])))
        remaining = limit - len(results)

    return results
