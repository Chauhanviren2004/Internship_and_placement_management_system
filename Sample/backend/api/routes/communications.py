from datetime import datetime
from typing import Any, List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from api.deps import get_current_active_user, get_database
from schemas.communication import FeedbackCreate, FeedbackOut, MessageCreate, MessageOut
from utils.serialization import serialize_document
from utils.user_store import ROLE_COLLECTIONS

router = APIRouter()


async def find_recipient(db, recipient_id: str):
    for role, collection_name in ROLE_COLLECTIONS.items():
        if not ObjectId.is_valid(recipient_id):
            return None
        user = await db[collection_name].find_one({"_id": ObjectId(recipient_id)})
        if user:
            return {
                "id": str(user["_id"]),
                "name": user.get("full_name") or user.get("name") or "",
                "role": role,
            }
    return None


@router.post("/public-feedback", response_model=FeedbackOut, status_code=status.HTTP_201_CREATED)
async def create_public_feedback(
    payload: FeedbackCreate,
    db: Any = Depends(get_database),
):
    feedback = {
        **payload.model_dump(),
        "company_id": None,
        "company_name": payload.name,
        "created_at": datetime.utcnow(),
    }
    result = await db["feedback"].insert_one(feedback)
    created = await db["feedback"].find_one({"_id": result.inserted_id})
    return serialize_document(created)


@router.get("/messages", response_model=List[MessageOut])
async def list_messages(
    db: Any = Depends(get_database),
    current_user: dict = Depends(get_current_active_user),
):
    messages = await db["chat"].find(
        {"$or": [{"sender_id": current_user["id"]}, {"recipient_id": current_user["id"]}]}
    ).sort("created_at", -1).to_list(length=500)
    return [serialize_document(message) for message in messages]


@router.post("/messages", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
async def create_message(
    payload: MessageCreate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(get_current_active_user),
):
    recipient = await find_recipient(db, payload.recipient_id)
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")

    message = {
        "sender_id": current_user["id"],
        "sender_name": current_user["full_name"],
        "recipient_id": recipient["id"],
        "recipient_name": recipient["name"],
        "subject": payload.subject,
        "message": payload.message,
        "application_id": payload.application_id,
        "created_at": datetime.utcnow(),
    }
    result = await db["chat"].insert_one(message)
    created = await db["chat"].find_one({"_id": result.inserted_id})
    return serialize_document(created)


@router.get("/feedback", response_model=List[FeedbackOut])
async def list_feedback(
    db: Any = Depends(get_database),
    current_user: dict = Depends(get_current_active_user),
):
    query = {}
    if current_user["role"] == "student":
        query["student_id"] = current_user["id"]
    elif current_user["role"] == "company":
        query["company_id"] = current_user["id"]

    feedback_items = await db["feedback"].find(query).sort("created_at", -1).to_list(length=500)
    return [serialize_document(item) for item in feedback_items]


@router.post("/feedback", response_model=FeedbackOut, status_code=status.HTTP_201_CREATED)
async def create_feedback(
    payload: FeedbackCreate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(get_current_active_user),
):
    feedback = {
        **payload.model_dump(),
        "company_id": current_user["id"] if current_user["role"] in {"company", "admin"} else None,
        "company_name": current_user["full_name"],
        "created_at": datetime.utcnow(),
    }
    result = await db["feedback"].insert_one(feedback)
    created = await db["feedback"].find_one({"_id": result.inserted_id})
    return serialize_document(created)
