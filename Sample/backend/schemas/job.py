from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field

JobStatus = Literal["pending", "approved", "rejected"]
JobMode = Literal["remote", "hybrid", "onsite"]


class JobCreate(BaseModel):
    title: str = Field(..., min_length=2)
    location: str = ""
    mode: JobMode = "remote"
    duration: str = ""
    stipend: str = ""
    eligibility: str = ""
    openings: int = 1
    deadline: datetime | None = None
    description: str = Field(..., min_length=10)


class JobStatusUpdate(BaseModel):
    status: JobStatus


class JobOut(BaseModel):
    id: str
    title: str
    location: str
    mode: JobMode
    duration: str
    stipend: str
    eligibility: str
    openings: int
    deadline: datetime | None = None
    description: str
    status: JobStatus
    company_id: str
    company_name: str
    created_at: datetime
