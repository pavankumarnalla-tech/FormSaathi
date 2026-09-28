import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.ai_service import analyze_form

router = APIRouter()

# Ensure temp directory exists
TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

@router.post("/analyze")
async def analyze_uploaded_form(file: UploadFile = File(...)):
    """
    Endpoint to receive an uploaded form (PDF or Image) and perform AI analysis.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Basic file type check
    allowed_types = ["application/pdf", "image/jpeg", "image/png"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")

    # Generate a safe temp file path
    file_ext = os.path.splitext(file.filename)[1]
    temp_filename = f"{uuid.uuid4()}{file_ext}"
    temp_path = os.path.join(TEMP_DIR, temp_filename)

    try:
        # Save file temporarily
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Pass to the AI Service for analysis
        result = analyze_form(temp_path, file.filename, file.content_type)
        
        return {
            "success": True,
            "data": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    finally:
        # Clean up the temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
