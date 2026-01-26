from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class WorkHistoryItem(BaseModel):
    company: str
    position: str
    duration: Optional[str] = None
    description: Optional[str] = None
    achievements: List[str] = []
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    skills: List[str] = []


class ImprovementItem(BaseModel):
    title: str
    description: str


class PersonaBase(BaseModel):
    name: str
    title: str
    location: Optional[str] = None
    avatar_url: Optional[str] = Field(None, alias="avatar")
    experience_level: Optional[str] = Field(None, alias="experience")
    skills: List[str] = []
    salary_min: Optional[int] = Field(None, alias="salaryMin")
    salary_max: Optional[int] = Field(None, alias="salaryMax")
    email: Optional[str] = None
    phone: Optional[str] = None
    summary: Optional[str] = None
    roles: List[str] = []
    job_search_location: Optional[str] = Field(None, alias="jobSearchLocation")
    education: Optional[str] = None
    gender: Optional[str] = None
    areas_of_improvement: List[Dict[str, str]] = Field(default_factory=list, alias="areasOfImprovement")
    
    class Config:
        populate_by_name = True


class PersonaCreate(PersonaBase):
    cv_file_name: Optional[str] = None
    cv_file_url: Optional[str] = None
    work_history: List[Dict[str, Any]] = Field(default_factory=list, alias="workHistory")


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
    email: Optional[str] = None
    phone: Optional[str] = None
    summary: Optional[str] = None
    roles: Optional[List[str]] = None
    job_search_location: Optional[str] = None
    education: Optional[str] = None
    work_history: Optional[List[Dict[str, Any]]] = None
    gender: Optional[str] = None
    areas_of_improvement: Optional[List[Dict[str, str]]] = None


class PersonaResponse(PersonaBase):
    id: str
    user_id: str = Field(..., alias="userId")
    cv_file_url: Optional[str] = Field(None, alias="cvFileUrl")
    cv_file_name: Optional[str] = Field(None, alias="cvFileName")
    market_demand: str = Field(..., alias="marketDemand")
    global_matches: int = Field(..., alias="globalMatches")
    confidence_score: float = Field(..., alias="confidence")
    is_active: bool = Field(..., alias="isActive")
    work_history: List[Dict[str, Any]] = Field(default_factory=list, alias="workHistory")
    created_at: datetime = Field(..., alias="createdAt")
    updated_at: datetime = Field(..., alias="updatedAt")
    
    class Config:
        from_attributes = True
        populate_by_name = True
        by_alias = True


class CVParseRequest(BaseModel):
    cv_text: str


class CVParseResponse(BaseModel):
    name: str
    title: str
    location: Optional[str] = None
    experience: Optional[str] = None
    experience_level: Optional[str] = None
    skills: List[str] = []
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    summary: Optional[str] = None
    roles: List[str] = []
    job_search_location: Optional[str] = None
    education: Optional[str] = None
    work_history: List[Dict[str, Any]] = []
    gender: Optional[str] = None
    areas_of_improvement: List[Dict[str, str]] = []
