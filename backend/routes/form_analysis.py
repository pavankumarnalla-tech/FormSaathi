import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.ai_service import analyze_form

router = APIRouter()

# Ensure temp directory exists
TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

ALLOWED_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
}

MAX_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/analyze")
async def analyze_uploaded_form(file: UploadFile = File(...)):
    """
    Receives an uploaded form (PDF or image), sends it to Gemini for
    native document understanding, and returns structured JSON analysis.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file was provided.")

    # Normalise content-type (browsers sometimes send image/jpg)
    content_type = file.content_type or ""
    if content_type == "image/jpg":
        content_type = "image/jpeg"

    if content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported file type: '{content_type}'. "
                "Please upload a PDF, JPG, or PNG file."
            ),
        )

    # Generate a safe temp file path
    file_ext = os.path.splitext(file.filename)[1].lower() or ".tmp"
    temp_filename = f"{uuid.uuid4()}{file_ext}"
    temp_path = os.path.join(TEMP_DIR, temp_filename)

    try:
        # Save to disk temporarily
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Size check
        file_size = os.path.getsize(temp_path)
        if file_size == 0:
            raise HTTPException(status_code=400, detail="The uploaded file is empty.")
        if file_size > MAX_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"File too large ({file_size // (1024*1024)} MB). Maximum allowed size is 10 MB.",
            )

        # Analyse with Gemini
        result = analyze_form(temp_path, file.filename, content_type)
        return {"success": True, "data": result}

    except HTTPException:
        raise
    except ValueError as e:
        # Descriptive errors from ai_service (config, quota, parse errors)
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected server error during form analysis: {str(e)}",
        )
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
