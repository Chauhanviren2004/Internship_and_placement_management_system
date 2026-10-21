from typing import Any, List

from fastapi import APIRouter, Depends, File, UploadFile, status

from api.deps import get_database, require_roles
from api.routes.applications import (
    apply_to_job,
    get_my_applications,
    get_received_applications,
    update_application_status,
)
from api.routes.communications import (
    create_feedback,
    create_message,
    create_public_feedback,
    list_feedback,
    list_messages,
)
from api.routes.jobs import create_job, list_jobs, list_public_jobs, update_job_status
from api.routes.resumes import get_my_resume, upload_resume
from api.routes.users import get_all_users, update_profile
from schemas.application import ApplicationCreate, ApplicationOut, ApplicationStatusUpdate
from schemas.communication import FeedbackCreate, FeedbackOut, MessageCreate, MessageOut
from schemas.job import JobCreate, JobOut, JobStatusUpdate
from schemas.user import UserOut, UserProfileUpdate

router = APIRouter()


@router.get("/internships", response_model=List[JobOut], tags=["public"])
async def public_internships(db: Any = Depends(get_database)):
    return await list_public_jobs(db)


@router.post("/feedback", response_model=FeedbackOut, tags=["public"])
async def public_feedback(payload: FeedbackCreate, db: Any = Depends(get_database)):
    return await create_public_feedback(payload, db)


@router.get("/student/profile", response_model=UserOut, tags=["student"])
async def student_profile(current_user: dict = Depends(require_roles("student"))):
    return current_user


@router.put("/student/profile", response_model=UserOut, tags=["student"])
async def student_update_profile(
    payload: UserProfileUpdate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("student")),
):
    return await update_profile(payload, db, current_user)


@router.get("/student/jobs", response_model=List[JobOut], tags=["student"])
async def student_jobs(
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("student")),
):
    return await list_jobs(db, current_user)


@router.post("/student/apply/{job_id}", response_model=ApplicationOut, tags=["student"])
async def student_apply(
    job_id: str,
    payload: ApplicationCreate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("student")),
):
    return await apply_to_job(job_id, payload, db, current_user)


@router.get("/student/applied-jobs", response_model=List[ApplicationOut], tags=["student"])
async def student_applied_jobs(
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("student")),
):
    return await get_my_applications(db, current_user)


@router.get("/student/messages", response_model=List[MessageOut], tags=["student"])
async def student_messages(
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("student")),
):
    return await list_messages(db, current_user)


@router.post("/student/messages", response_model=MessageOut, tags=["student"])
async def student_send_message(
    payload: MessageCreate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("student")),
):
    return await create_message(payload, db, current_user)


@router.get("/student/feedback", response_model=List[FeedbackOut], tags=["student"])
async def student_feedback(
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("student")),
):
    return await list_feedback(db, current_user)


@router.post("/student/upload-resume", tags=["student"])
async def student_resume_upload(
    file: UploadFile = File(...),
    current_user: dict = Depends(require_roles("student")),
    db: Any = Depends(get_database),
):
    return await upload_resume(file, current_user, db)


@router.get("/student/resume", tags=["student"])
async def student_resume(
    current_user: dict = Depends(require_roles("student")),
    db: Any = Depends(get_database),
):
    return await get_my_resume(current_user, db)


@router.get("/company/profile", response_model=UserOut, tags=["company"])
async def company_profile(current_user: dict = Depends(require_roles("company"))):
    return current_user


@router.put("/company/profile", response_model=UserOut, tags=["company"])
async def company_update_profile(
    payload: UserProfileUpdate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("company")),
):
    return await update_profile(payload, db, current_user)


@router.get("/company/jobs", response_model=List[JobOut], tags=["company"])
async def company_jobs(
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("company")),
):
    return await list_jobs(db, current_user)


@router.post("/company/jobs", response_model=JobOut, status_code=status.HTTP_201_CREATED, tags=["company"])
async def company_create_job(
    payload: JobCreate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("company")),
):
    return await create_job(payload, db, current_user)


@router.get("/company/applications", response_model=List[ApplicationOut], tags=["company"])
async def company_applications(
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("company")),
):
    return await get_received_applications(db, current_user)


@router.patch("/company/applications/{application_id}/status", response_model=ApplicationOut, tags=["company"])
async def company_application_status(
    application_id: str,
    payload: ApplicationStatusUpdate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("company")),
):
    return await update_application_status(application_id, payload, db, current_user)


@router.get("/company/messages", response_model=List[MessageOut], tags=["company"])
async def company_messages(
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("company")),
):
    return await list_messages(db, current_user)


@router.post("/company/messages", response_model=MessageOut, tags=["company"])
async def company_send_message(
    payload: MessageCreate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("company")),
):
    return await create_message(payload, db, current_user)


@router.get("/company/feedback", response_model=List[FeedbackOut], tags=["company"])
async def company_feedback(
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("company")),
):
    return await list_feedback(db, current_user)


@router.post("/company/feedback", response_model=FeedbackOut, tags=["company"])
async def company_create_feedback(
    payload: FeedbackCreate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("company")),
):
    return await create_feedback(payload, db, current_user)


@router.get("/admin/profile", response_model=UserOut, tags=["admin"])
async def admin_profile(current_user: dict = Depends(require_roles("admin"))):
    return current_user


@router.put("/admin/profile", response_model=UserOut, tags=["admin"])
async def admin_update_profile(
    payload: UserProfileUpdate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("admin")),
):
    return await update_profile(payload, db, current_user)


@router.get("/admin/jobs", response_model=List[JobOut], tags=["admin"])
async def admin_jobs(
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("admin")),
):
    return await list_jobs(db, current_user)


@router.patch("/admin/jobs/{job_id}/status", response_model=JobOut, tags=["admin"])
async def admin_job_status(
    job_id: str,
    payload: JobStatusUpdate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("admin")),
):
    return await update_job_status(job_id, payload, db, current_user)


@router.get("/admin/students", response_model=List[UserOut], tags=["admin"])
async def admin_students(
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("admin")),
):
    return await get_all_users("student", 0, 100, db, current_user)


@router.get("/admin/companies", response_model=List[UserOut], tags=["admin"])
async def admin_companies(
    db: Any = Depends(get_database),
    current_user: dict = Depends(require_roles("admin")),
):
    return await get_all_users("company", 0, 100, db, current_user)
