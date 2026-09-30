import os
import requests as py_requests
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError

from database import get_db
from models.user import User
from schemas.auth import UserRegister, UserLogin, UserResponse, TokenResponse, GoogleAuthRequest
from services.auth_service import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user
)

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "").strip()
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "").strip()

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user in the database.
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
            provider="email",
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
            detail="Database connection error. Please check your database configuration."
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
    Authenticate user against the database.
    """
    try:
        clean_email = login_data.email.lower().strip()
        user = db.query(User).filter(User.email == clean_email).first()
        
        if not user or not user.password_hash or not verify_password(login_data.password, user.password_hash):
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
            detail="Database connection error. Please check your database configuration."
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/google", response_model=TokenResponse)
def google_auth(auth_data: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Authenticate or Register a user via Google OAuth ID Token or Authorization Code.
    Verifies identity with Google before creating/logging in user and issuing JWT token.
    """
    if not auth_data.credential and not auth_data.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google credential token or authorization code is required."
        )

    id_info = None

    # 1. Verification via ID Token (from Google Identity Services frontend)
    if auth_data.credential:
        try:
            req = google_requests.Request()
            # If GOOGLE_CLIENT_ID is set in env, verify audience against it
            audience = GOOGLE_CLIENT_ID if GOOGLE_CLIENT_ID else None
            id_info = google_id_token.verify_oauth2_token(
                auth_data.credential, req, audience=audience
            )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid Google ID token: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Google token verification failed: {str(e)}"
            )

    # 2. Verification via OAuth Authorization Code Exchange
    elif auth_data.code:
        if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing on server."
            )
        try:
            token_resp = py_requests.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": auth_data.code,
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "redirect_uri": auth_data.redirect_uri or "",
                    "grant_type": "authorization_code"
                },
                timeout=15
            )
            token_json = token_resp.json()
            if token_resp.status_code != 200 or "id_token" not in token_json:
                error_desc = token_json.get("error_description", "Failed to exchange authorization code.")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Google OAuth exchange error: {error_desc}"
                )
            
            raw_id_token = token_json["id_token"]
            req = google_requests.Request()
            id_info = google_id_token.verify_oauth2_token(
                raw_id_token, req, audience=GOOGLE_CLIENT_ID
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Google authorization code exchange failed: {str(e)}"
            )

    if not id_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not verify Google identity."
        )

    # 3. Extract verified Google claims
    email = id_info.get("email")
    email_verified = id_info.get("email_verified", True)
    google_sub = id_info.get("sub")
    name = id_info.get("name") or id_info.get("given_name") or "Google User"

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account does not have a public email address."
        )

    if not email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account email is not verified."
        )

    clean_email = email.lower().strip()

    try:
        # 4. Check if user exists in database
        user = db.query(User).filter(User.email == clean_email).first()

        if user:
            # Update provider info if missing
            if not user.provider_id:
                user.provider = "google"
                user.provider_id = google_sub
                db.commit()
                db.refresh(user)
        else:
            # Create new user for Google account
            user = User(
                full_name=name.strip(),
                email=clean_email,
                password_hash=None,
                provider="google",
                provider_id=google_sub,
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account has been deactivated."
            )

        # 5. Issue standard Form Saathi JWT Token
        token = create_access_token(data={"sub": str(user.id), "email": user.email})
        return TokenResponse(
            access_token=token,
            user=UserResponse.model_validate(user)
        )

    except OperationalError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection error."
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Google login failed: {str(e)}"
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

