from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List
from app.schemas.persona import PersonaCreate, PersonaUpdate, PersonaResponse, CVParseRequest, CVParseResponse
from app.database import get_supabase
from app.middleware.auth import get_current_user_id
from app.services.cv_parser import cv_parser
from supabase import Client


router = APIRouter(prefix="/personas", tags=["Personas"])


@router.get("", response_model=List[PersonaResponse])
async def list_personas(
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
):
    """Get all personas for the current user"""
    try:
        response = supabase.table("personas").select("*").eq("user_id", user_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch personas: {str(e)}"
        )


@router.post("", response_model=PersonaResponse, status_code=status.HTTP_201_CREATED)
async def create_persona(
    persona: PersonaCreate,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
):
    """Create a new persona"""
    try:
        # Check if this should be the first/active persona
        existing = supabase.table("personas").select("id").eq("user_id", user_id).execute()
        is_first_persona = len(existing.data) == 0
        
        persona_data = {
            "user_id": user_id,
            "name": persona.name,
            "title": persona.title,
            "location": persona.location,
            "avatar_url": persona.avatar_url,
            "experience_level": persona.experience_level,
            "skills": persona.skills,
            "salary_min": persona.salary_min,
            "salary_max": persona.salary_max,
            "cv_file_name": persona.cv_file_name,
            "cv_file_url": persona.cv_file_url,
            "is_active": is_first_persona,  # First persona is active by default
            "market_demand": "medium",
            "global_matches": 0,
            "confidence_score": 0.0
        }
        
        response = supabase.table("personas").insert(persona_data).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create persona"
            )
        
        return response.data[0]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/{persona_id}", response_model=PersonaResponse)
async def get_persona(
    persona_id: str,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
):
    """Get a specific persona by ID"""
    try:
        response = supabase.table("personas")\
            .select("*")\
            .eq("id", persona_id)\
            .eq("user_id", user_id)\
            .execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Persona not found"
            )
        
        return response.data[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.put("/{persona_id}", response_model=PersonaResponse)
async def update_persona(
    persona_id: str,
    persona_update: PersonaUpdate,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
):
    """Update a persona"""
    try:
        # Build update dict with only provided fields
        update_data = {k: v for k, v in persona_update.dict(exclude_unset=True).items()}
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update"
            )
        
        response = supabase.table("personas")\
            .update(update_data)\
            .eq("id", persona_id)\
            .eq("user_id", user_id)\
            .execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Persona not found"
            )
        
        return response.data[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{persona_id}")
async def delete_persona(
    persona_id: str,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
):
    """Delete a persona"""
    try:
        response = supabase.table("personas")\
            .delete()\
            .eq("id", persona_id)\
            .eq("user_id", user_id)\
            .execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Persona not found"
            )
        
        return {"message": "Persona deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.patch("/{persona_id}/activate", response_model=PersonaResponse)
async def activate_persona(
    persona_id: str,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
):
    """Set a persona as the active one"""
    try:
        # Deactivate all other personas
        supabase.table("personas")\
            .update({"is_active": False})\
            .eq("user_id", user_id)\
            .execute()
        
        # Activate the selected persona
        response = supabase.table("personas")\
            .update({"is_active": True})\
            .eq("id", persona_id)\
            .eq("user_id", user_id)\
            .execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Persona not found"
            )
        
        return response.data[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/parse-cv", response_model=CVParseResponse)
async def parse_cv_file(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id)
):
    """
    Upload and parse a CV file (PDF or DOCX) using OpenAI
    Returns extracted persona data
    """
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.pdf', '.docx')):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF and DOCX files are supported"
            )
        
        # Read file content
        content = await file.read()
        
        # Extract text based on file type
        if file.filename.lower().endswith('.pdf'):
            cv_text = cv_parser.extract_text_from_pdf(content)
        else:
            cv_text = cv_parser.extract_text_from_docx(content)
        
        # Parse with OpenAI
        parsed_data = await cv_parser.parse_cv_with_openai(cv_text)
        
        return CVParseResponse(**parsed_data)
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse CV: {str(e)}"
        )
