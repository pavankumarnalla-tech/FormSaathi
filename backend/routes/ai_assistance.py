from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from services.ai_service import get_field_assistance

router = APIRouter()

class AssistRequest(BaseModel):
    formName: str = ""
    sectionName: str = ""
    fieldName: str
    fieldDescription: str = ""
    question: str
    language: str = "English"

@router.post("/assist")
async def assist(req: AssistRequest):
    """
    Provides real contextual AI assistance for a specific form field using OpenAI API.
    """
    try:
        answer, is_demo = get_field_assistance(
            form_name=req.formName,
            section_name=req.sectionName,
            field_name=req.fieldName,
            field_description=req.fieldDescription,
            question=req.question,
            language=req.language
        )
        return {
            "success": True,
            "answer": answer,
            "isDemoMode": False
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e) if "temporarily unavailable" in str(e) else "AI assistance is temporarily unavailable. Please try again."
        )
