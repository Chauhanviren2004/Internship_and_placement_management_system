from datetime import datetime
from typing import Any, List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from api.deps import get_current_active_user, get_database, require_roles
from schemas.job import JobCreate, JobOut, JobStatusUpdate
from utils.serialization import serialize_document

router = APIRouter()


@router.get("/public", response_model=List[JobOut])
async def list_public_jobs(db: Any = Depends(get_database)):
    jobs = await db["jobs"].find({"status": "approved"}).sort("created_at", -1).to_list(length=500)
    return [serialize_document(job) for job in jobs]


@router.get("/", response_model=List[JobOut])
async def list_jobs(
    db: Any = Depends(get_database),
    current_user: dict = Depends(get_current_active_user),
):
    query = {}
    if current_user["role"] == "student":
        query["status"] = "approved"
    elif current_user["role"] == "company":
        query["company_id"] = current_user["id"]

    jobs = await db["jobs"].find(query).sort("created_at", -1).to_list(length=500)
    return [serialize_document(job) for job in jobs]


@router.post("/", response_model=JobOut, status_code=status.HTTP_201_CREATED)
async def create_job(
    payload: JobCreate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("company", "admin")),
):
    company_name = current_user.get("profile", {}).get("company_name") or current_user["full_name"]
    job = {
        **payload.model_dump(),
        "company_id": current_user["id"],
        "company_name": company_name,
        "status": "approved" if current_user["role"] == "admin" else "pending",
        "created_at": datetime.utcnow(),
    }
    result = await db["jobs"].insert_one(job)
    created_job = await db["jobs"].find_one({"_id": result.inserted_id})
    return serialize_document(created_job)


@router.patch("/{job_id}/status", response_model=JobOut)
async def update_job_status(
    job_id: str,
    payload: JobStatusUpdate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("admin")),
):
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid job id")

    result = await db["jobs"].update_one(
        {"_id": ObjectId(job_id)},
        {"$set": {"status": payload.status}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")

    job = await db["jobs"].find_one({"_id": ObjectId(job_id)})
    return serialize_document(job)
