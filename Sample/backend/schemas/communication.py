from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class MessageCreate(BaseModel):
    recipient_id: str
    subject: str = ""
    message: str = Field(..., min_length=1)
    application_id: str | None = None


class MessageOut(BaseModel):
    id: str
    sender_id: str
    sender_name: str
    recipient_id: str
    recipient_name: str
    subject: str = ""
    message: str
    application_id: str | None = None
    created_at: datetime


class FeedbackCreate(BaseModel):
    student_id: str | None = None
    job_id: str | None = None
    application_id: str | None = None
    type: str = "general"
    message: str = Field(..., min_length=1)
    rating: int | None = None
    name: str | None = None
    email: EmailStr | None = None


class FeedbackOut(BaseModel):
    id: str
    type: str
    message: str
    rating: int | None = None
    student_id: str | None = None
    job_id: str | None = None
    application_id: str | None = None
    company_id: str | None = None
    company_name: str | None = None
    name: str | None = None
    email: EmailStr | None = None
    created_at: datetime
