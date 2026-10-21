from datetime import datetime

from bson import ObjectId


ROLE_COLLECTIONS = {
    "student": "students",
    "company": "companies",
    "admin": "admins",
}


def profile_defaults_for_role(role: str) -> dict:
    base_profile = {
        "phone": "",
        "college": "",
        "skills": "",
        "description": "",
        "resume_url": "",
        "company_name": "",
        "website": "",
        "location": "",
    }
    if role == "company":
        return {
            **base_profile,
            "company_name": "",
            "website": "",
            "location": "",
        }
    return base_profile


def user_to_response(user: dict, role: str, profile: dict | None = None) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user.get("full_name") or user.get("name") or "",
        "role": role,
        "is_active": user.get("is_active", True),
        "created_at": user.get("created_at") or datetime.utcnow(),
        "profile": profile or profile_defaults_for_role(role),
    }


async def get_user_with_profile_by_role(db, role: str, user_id: str):
    collection_name = ROLE_COLLECTIONS[role]
    user = await db[collection_name].find_one({"_id": ObjectId(user_id)})
    if not user:
        return None

    profile = profile_defaults_for_role(role)
    if role == "student":
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
    elif role == "company":
        profile.update(
            {
                "phone": user.get("phone", ""),
                "description": user.get("description", ""),
                "company_name": user.get("company_name", user.get("full_name", "")),
                "website": user.get("website", ""),
                "location": user.get("location", ""),
            }
        )
    else:
        profile.update(
            {
                "phone": user.get("phone", ""),
                "description": user.get("description", ""),
            }
        )

    return user_to_response(user, role, profile)
