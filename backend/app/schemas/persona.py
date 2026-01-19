from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class PersonaBase(BaseModel):
    name: str
    title: str
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    experience_level: Optional[str] = None
    skills: List[str] = []
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None


class PersonaCreate(PersonaBase):
    cv_file_name: Optional[str] = None
    cv_file_url: Optional[str] = None


class PersonaUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    experience_level: Optional[str] = None
    skills: Optional[List[str]] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    is_active: Optional[bool] = None


class PersonaResponse(PersonaBase):
    id: str
    user_id: str
    cv_file_url: Optional[str] = None
    cv_file_name: Optional[str] = None
    market_demand: str
    global_matches: int
    confidence_score: float
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class CVParseRequest(BaseModel):
    cv_text: str


class CVParseResponse(BaseModel):
    name: str
    title: str
    location: Optional[str] = None
    experience_level: Optional[str] = None
    skills: List[str] = []
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
