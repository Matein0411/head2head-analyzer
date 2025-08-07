from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class User(BaseModel):
    firebase_uid: str
    email: EmailStr
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    auth_provider: str
    credits: int = 0
    created_at: datetime
    updated_at: datetime

class PredictionRequest(BaseModel):
    credits_to_deduct: int = 20

    class Config:
        from_attributes = True

