from datetime import datetime
from typing import Any, List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.errors import DuplicateKeyError

from api.deps import get_database, require_roles
from schemas.application import ApplicationCreate, ApplicationOut, ApplicationStatusUpdate
from utils.serialization import serialize_document
from api.websockets_manager import manager

router = APIRouter()


@router.post("/jobs/{job_id}", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
async def apply_to_job(
    job_id: str,
    payload: ApplicationCreate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("student")),
):
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid job id")

    job = await db["jobs"].find_one({"_id": ObjectId(job_id), "status": "approved"})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or not approved")

    application = {
        "job_id": str(job["_id"]),
        "company_id": job["company_id"],
        "company_name": job["company_name"],
        "student_id": current_user["id"],
        "student_name": current_user["full_name"],
        "student_email": current_user["email"],
        "cover_letter": payload.cover_letter,
        "status": "pending",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "job_title": job["title"],
        "resume_url": current_user.get("profile", {}).get("resume_url", ""),
    }
    try:
        result = await db["applied_jobs"].insert_one(application)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="You have already applied to this job")

    created = await db["applied_jobs"].find_one({"_id": result.inserted_id})
    
    # Trigger websocket notification to company
    company_id = job.get("company_id")
    student_name = current_user.get("full_name", "A student")
    job_title = job.get("title", "an internship")
    if company_id:
        message = f"New application received from {student_name} for '{job_title}'!"
        await manager.send_personal_message(message, company_id)

    return serialize_document(created)


@router.get("/mine", response_model=List[ApplicationOut])
async def get_my_applications(
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("student")),
):
    applications = await db["applied_jobs"].find({"student_id": current_user["id"]}).sort("created_at", -1).to_list(length=500)
    return [serialize_document(application) for application in applications]


@router.get("/received", response_model=List[ApplicationOut])
async def get_received_applications(
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("company", "admin")),
):
    query = {} if current_user["role"] == "admin" else {"company_id": current_user["id"]}
    applications = await db["applied_jobs"].find(query).sort("created_at", -1).to_list(length=500)
    return [serialize_document(application) for application in applications]


@router.patch("/{application_id}/status", response_model=ApplicationOut)
async def update_application_status(
    application_id: str,
    payload: ApplicationStatusUpdate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("company", "admin")),
):
    if not ObjectId.is_valid(application_id):
        raise HTTPException(status_code=400, detail="Invalid application id")

    query = {"_id": ObjectId(application_id)}
    if current_user["role"] == "company":
        query["company_id"] = current_user["id"]

    result = await db["applied_jobs"].update_one(
        query,
        {"$set": {"status": payload.status, "updated_at": datetime.utcnow()}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")

    updated = await db["applied_jobs"].find_one({"_id": ObjectId(application_id)})
    
    # Trigger websocket notification
    student_id = updated.get("student_id")
    job_title = updated.get("job_title", "an internship")
    status_val = updated.get("status")
    if student_id:
        message = f"Your application for '{job_title}' has been {status_val}!"
        await manager.send_personal_message(message, student_id)

    return serialize_document(updated)
