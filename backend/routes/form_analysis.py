import os
import json
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
from services.ai_service import analyze_form, generate_dynamic_field_guidance, generate_dynamic_form_guidance_and_documents

router = APIRouter()

# ── Writable directories ──────────────────────────────────────────────────────
# Vercel (and most serverless/read-only filesystems) only allow writes to /tmp.
# Locally, /tmp works fine on Linux/macOS. On Windows dev machines the path is
# still created inside the system temp area, so local development is unaffected.
import tempfile as _tempfile

_TMP_ROOT = os.path.join(_tempfile.gettempdir(), "formsaathi")

TEMP_DIR         = os.path.join(_TMP_ROOT, "temp_uploads")
GUIDANCE_CACHE_DIR = os.path.join(_TMP_ROOT, "guidance_cache")

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(GUIDANCE_CACHE_DIR, exist_ok=True)

# OFFICIAL_FORMS_DIR lives inside the project bundle — it is only ever READ,
# never written, so a read-only filesystem is not a problem here.
OFFICIAL_FORMS_DIR = os.path.join(os.path.dirname(__file__), "..", "official_forms", "telangana")
os.makedirs(OFFICIAL_FORMS_DIR, exist_ok=True)

ALLOWED_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
}

MAX_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/analyze")
async def analyze_uploaded_form(
    file: UploadFile = File(...),
    language: Optional[str] = Form("English"),
):
    """
    Receives an uploaded form (PDF or image), sends it to Gemini for
    native document understanding, and returns structured JSON analysis in requested language.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file was provided.")

    content_type = file.content_type or ""
    if content_type == "image/jpg":
        content_type = "image/jpeg"

    if content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: '{content_type}'. Please upload a PDF, JPG, or PNG file.",
        )

    file_ext = os.path.splitext(file.filename)[1].lower() or ".tmp"
    temp_filename = f"{uuid.uuid4()}{file_ext}"
    temp_path = os.path.join(TEMP_DIR, temp_filename)

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        file_size = os.path.getsize(temp_path)
        if file_size == 0:
            raise HTTPException(status_code=400, detail="The uploaded file is empty.")
        if file_size > MAX_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"File too large ({file_size // (1024*1024)} MB). Maximum allowed size is 10 MB.",
            )

        result = analyze_form(temp_path, file.filename, content_type, language=language or "English")
        return {"success": True, "data": result}

    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected server error during form analysis: {str(e)}",
        )
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


# ── Raw Official PDF Serving Endpoint (ISSUE 1 FIX) ──────────────────────────
@router.get("/raw-pdf/{filename}")
def serve_raw_official_pdf(filename: str):
    """
    Serves exact unmodified original government PDF template stored locally.
    Does NOT modify, overlay, or regenerate the PDF.
    """
    safe_filename = os.path.basename(filename)
    pdf_path = os.path.join(OFFICIAL_FORMS_DIR, safe_filename)

    if not os.path.exists(pdf_path):
        raise HTTPException(
            status_code=404,
            detail=f"Official form PDF '{filename}' is not stored locally."
        )

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=safe_filename
    )


# ── Form-Specific Guidance Endpoint (ISSUE 2 FIX) ─────────────────────────────
class GuidanceRequest(BaseModel):
    formId: int
    formName: str
    department: Optional[str] = ""
    purpose: Optional[str] = ""
    localPdfPath: Optional[str] = None
    language: Optional[str] = "English"


@router.post("/guidance")
def get_form_dynamic_guidance(req: GuidanceRequest):
    """
    Returns form-specific dynamic field guidance (name, whatItMeans, whatToEnter) and required documents in requested language.
    Checks guidance_cache/{formId}_{language}_v2.json first. If not cached, analyzes PDF/metadata using Gemini,
    caches the result on disk, and returns it.
    """
    lang_name = req.language or "English"
    lang_key = lang_name.lower().replace(" ", "_")
    cache_path = os.path.join(GUIDANCE_CACHE_DIR, f"{req.formId}_{lang_key}_v2.json")

    # 1. Check disk cache
    if os.path.exists(cache_path):
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                cached_data = json.load(f)
            if isinstance(cached_data, dict):
                return {
                    "success": True,
                    "cached": True,
                    "fields": cached_data.get("fields", []),
                    "requiredDocuments": cached_data.get("requiredDocuments", [])
                }
        except Exception as e:
            print(f"Failed to read cache for form {req.formId}: {e}")

    # 2. Extract PDF text if local PDF exists
    pdf_text = ""
    if req.localPdfPath:
        safe_filename = os.path.basename(req.localPdfPath)
        forms_root = os.path.join(os.path.dirname(__file__), "..", "official_forms")
        pdf_file = None
        for root_dir, _, files in os.walk(forms_root):
            if safe_filename in files:
                pdf_file = os.path.join(root_dir, safe_filename)
                break

        if pdf_file and os.path.exists(pdf_file):
            try:
                from pypdf import PdfReader
                reader = PdfReader(pdf_file)
                extracted_pages = []
                for p in reader.pages:
                    txt = p.extract_text()
                    if txt:
                        extracted_pages.append(txt)
                pdf_text = "\n".join(extracted_pages)
            except Exception as e:
                print(f"Error extracting PDF text for guidance: {e}")

    # 3. Call Gemini for dynamic guidance and required documents in requested language
    guidance_data = {"fields": [], "requiredDocuments": []}
    try:
        guidance_data = generate_dynamic_form_guidance_and_documents(
            form_name=req.formName,
            department=req.department or "",
            purpose=req.purpose or "",
            pdf_text=pdf_text,
            language=lang_name
        )
    except Exception as e:
        print(f"Error generating dynamic guidance for form {req.formId}: {e}")

    fields = guidance_data.get("fields", [])
    required_documents = guidance_data.get("requiredDocuments", [])

    # 4. Save to disk cache if fields or required documents found
    if fields or required_documents:
        try:
            with open(cache_path, "w", encoding="utf-8") as f:
                json.dump({"fields": fields, "requiredDocuments": required_documents}, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Failed to write cache for form {req.formId}: {e}")

    return {
        "success": True,
        "cached": False,
        "fields": fields,
        "requiredDocuments": required_documents
    }

