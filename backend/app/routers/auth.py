from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth import UserRegister, UserLogin, Token, UserResponse
from app.database import get_supabase
from app.middleware.auth import get_current_user
from supabase import Client


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token)
async def register(
    user_data: UserRegister,
    supabase: Client = Depends(get_supabase)
):
    """Register a new user with email and password"""
    try:
        # Register user with Supabase Auth
        response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "name": user_data.name
                }
            }
        })
        
        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user"
            )
        
        return Token(
            access_token=response.session.access_token,
            token_type="bearer",
            expires_in=response.session.expires_in or 3600,
            user={
                "id": response.user.id,
                "email": response.user.email,
                "created_at": response.user.created_at
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    supabase: Client = Depends(get_supabase)
):
    """Login with email and password"""
    try:
        # Sign in with Supabase Auth
        response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if not response.user or not response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        return Token(
            access_token=response.session.access_token,
            token_type="bearer",
            expires_in=response.session.expires_in or 3600,
            user={
                "id": response.user.id,
                "email": response.user.email,
                "created_at": response.user.created_at
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )


@router.post("/logout")
async def logout(
    supabase: Client = Depends(get_supabase),
    current_user = Depends(get_current_user)
):
    """Logout current user"""
    try:
        supabase.auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user = Depends(get_current_user)
):
    """Get current authenticated user information"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        created_at=current_user.created_at
    )
