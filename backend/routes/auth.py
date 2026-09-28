from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError

from database import get_db
from models.user import User
from schemas.auth import UserRegister, UserLogin, UserResponse, TokenResponse
from services.auth_service import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user
)

router = APIRouter()

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user in MySQL database.
    """
    try:
        clean_email = user_data.email.lower().strip()
        existing_user = db.query(User).filter(User.email == clean_email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered. Please login or use a different email."
            )

        hashed_pwd = get_password_hash(user_data.password)
        new_user = User(
            full_name=user_data.full_name.strip(),
            email=clean_email,
            password_hash=hashed_pwd,
            is_active=True
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        token = create_access_token(data={"sub": str(new_user.id), "email": new_user.email})
        return TokenResponse(
            access_token=token,
            user=UserResponse.model_validate(new_user)
        )
    except OperationalError as oe:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection error. Please make sure MySQL is running."
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=TokenResponse)
def login_user(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user against MySQL database.
    """
    try:
        clean_email = login_data.email.lower().strip()
        user = db.query(User).filter(User.email == clean_email).first()
        
        if not user or not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account has been deactivated."
            )

        token = create_access_token(data={"sub": str(user.id), "email": user.email})
        return TokenResponse(
            access_token=token,
            user=UserResponse.model_validate(user)
        )
    except OperationalError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection error. Please make sure MySQL is running."
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_user)):
    """
    Fetch details of currently authenticated user.
    """
    return UserResponse.model_validate(current_user)

@router.post("/logout")
def logout_user(current_user: User = Depends(get_current_user)):
    """
    Logout endpoint for client session cleanup.
    """
    return {"message": "Successfully logged out."}
