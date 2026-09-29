from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Any
from services.pdf_service import generate_form_pdf
import io

router = APIRouter()

class FieldData(BaseModel):
    label: str
    key: str
    value: Any = ""

class SectionData(BaseModel):
    name: str
    fields: List[FieldData]

class GenerateRequest(BaseModel):
    formName: str
    formId: str = ""
    sections: List[SectionData]

@router.post("/generate")
async def generate_form(req: GenerateRequest):
    """
    Generates an official completed PDF application form from user inputs.
    Outputs clean PDF document formatted for submission.
    """
    pdf_bytes = generate_form_pdf(
        form_name=req.formName,
        form_id=req.formId,
        sections=[s.dict() for s in req.sections]
    )

    safe_name = "".join(c for c in req.formName if c.isalnum() or c in " _-")
    safe_name = safe_name.strip().replace(" ", "-")
    filename = f"{safe_name}-Filled.pdf"

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
