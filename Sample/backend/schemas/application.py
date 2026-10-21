from datetime import datetime
from typing import Literal

from pydantic import BaseModel

ApplicationStatus = Literal["pending", "shortlisted", "rejected", "accepted"]


class ApplicationCreate(BaseModel):
    cover_letter: str = ""


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationOut(BaseModel):
    id: str
    job_id: str
    company_id: str
    company_name: str
    student_id: str
    student_name: str
    student_email: str
    cover_letter: str = ""
    status: ApplicationStatus
    created_at: datetime
    updated_at: datetime
    job_title: str
    resume_url: str = ""
