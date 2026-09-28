from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_service import get_field_assistance

router = APIRouter()

class AssistRequest(BaseModel):
    formName: str
    sectionName: str = ""
    fieldName: str
    fieldDescription: str = ""
    question: str
    language: str = "English"

@router.post("/assist")
async def assist(req: AssistRequest):
    """
    Provides contextual AI assistance for a specific form field.
    """
    answer, is_demo = get_field_assistance(
        form_name=req.formName,
        section_name=req.sectionName,
        field_name=req.fieldName,
        field_description=req.fieldDescription,
        question=req.question,
        language=req.language
    )
    return {
        "answer": answer,
        "isDemoMode": is_demo
    }
