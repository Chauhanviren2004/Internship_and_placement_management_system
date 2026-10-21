import os
import shutil
from datetime import datetime
from typing import Any
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from api.deps import get_current_active_user, get_database

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_active_user),
    db: Any = Depends(get_database),
):
    if current_user.get("role") != "student":
        raise HTTPException(status_code=403, detail="Only students can upload resumes")

    if not file.filename.endswith((".pdf", ".doc", ".docx")):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and DOCX are allowed.")

    file_location = f"{UPLOAD_DIR}/{current_user['id']}_{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    await db["studentProfile"].update_one(
        {"student_id": current_user["id"]},
        {
            "$set": {
                "student_id": current_user["id"],
                "resume_url": file_location,
                "resume_filename": file.filename,
                "updated_at": datetime.utcnow(),
            }
        },
        upsert=True,
    )

    return {"info": f"file '{file.filename}' saved successfully", "resume_url": file_location}


@router.get("/my-resume")
async def get_my_resume(current_user: dict = Depends(get_current_active_user), db: Any = Depends(get_database)):
    resume = await db["studentProfile"].find_one({"student_id": current_user["id"]})
    if not resume or not resume.get("resume_url"):
        raise HTTPException(status_code=404, detail="Resume not found")
    return {
        "student_id": current_user["id"],
        "resume_url": resume["resume_url"],
        "resume_filename": resume.get("resume_filename", ""),
    }

@router.get("/all")
async def get_all_resumes(
    db: Any = Depends(get_database),
    current_user: dict = Depends(get_current_active_user),
):
    if current_user.get("role") not in ["admin", "company"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    profiles = await db["studentProfile"].find().to_list(100)

    result = []
    for p in profiles:
        if not p.get("resume_url"):
            continue

        # ⚠️ FIX ObjectId conversion
        user = await db["users"].find_one({"_id": p["student_id"]})

        if user:
            result.append({
                "name": user.get("full_name", ""),
                "email": user.get("email", ""),
                "role": user.get("role", ""),
                "resume": p.get("resume_url"),
            })

    return result