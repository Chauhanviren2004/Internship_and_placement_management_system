from pydantic import BaseModel, Field
from datetime import datetime

class ResumeBase(BaseModel):
    filename: str
    content_type: str

class ResumeCreate(ResumeBase):
    user_id: str
    file_path: str

class ResumeOut(ResumeBase):
    id: str
    user_id: str
    uploaded_at: datetime
