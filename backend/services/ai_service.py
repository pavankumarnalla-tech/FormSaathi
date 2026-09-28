"""
ai_service.py — Form Saathi AI Service
Uses Google Gemini API (google-genai SDK) for:
  1. get_field_assistance()  — contextual form field help (AI Saathi)
  2. analyze_form()          — document understanding + structured JSON extraction
"""

import os
import json
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL   = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite").strip()

# ── Validate key at startup ──────────────────────────────────────────────────
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY is not set. AI features will be unavailable.")

# ── Initialise Gemini client ─────────────────────────────────────────────────
try:
    from google import genai
    _client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None
except Exception as _e:
    print(f"WARNING: Failed to initialise Gemini client: {_e}")
    _client = None


# ─────────────────────────────────────────────────────────────────────────────
def _require_client():
    """Raise a clear error if Gemini is not configured."""
    if not GEMINI_API_KEY:
        raise ValueError(
            "GEMINI_API_KEY is not configured. "
            "Add it to backend/.env and restart the server."
        )
    if _client is None:
        raise ValueError(
            "Gemini client failed to initialise. "
            "Check that google-genai is installed and GEMINI_API_KEY is valid."
        )


# ─────────────────────────────────────────────────────────────────────────────
def get_field_assistance(
    form_name: str,
    section_name: str,
    field_name: str,
    field_description: str,
    question: str,
    language: str = "English",
) -> tuple:
    """
    Calls Gemini to answer a citizen's contextual question about a form field.
    Returns (answer: str, is_demo: bool).
    Raises ValueError with a descriptive message on any failure.
    """
    _require_client()

    prompt = f"""You are 'AI Saathi', a helpful citizen assistance assistant for official Indian government forms.
Your job is to help citizens understand and fill their forms correctly.
Always answer clearly, accurately, and in simple language.
Never invent legal requirements or document names.
Always answer strictly in the language requested.

Context:
- Form Name      : {form_name or 'Official Application'}
- Section        : {section_name or 'General'}
- Field Name     : {field_name or 'Selected Field'}
- Field Details  : {field_description or 'N/A'}
- Reply Language : {language}

Citizen's Question: "{question}"

Instructions:
1. Explain what this field means and what the citizen should enter.
2. If relevant, mention where to obtain the information or document.
3. Keep the response to 2–4 clear, conversational sentences.
4. Respond entirely in {language}.
"""

    try:
        response = _client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )
        answer = response.text.strip()
        if not answer:
            raise ValueError("Gemini returned an empty response.")
        return answer, False

    except ValueError:
        raise
    except Exception as e:
        err_str = str(e)
        print(f"Gemini API error in get_field_assistance: {err_str}")

        # Surface quota / rate-limit errors clearly
        if "quota" in err_str.lower() or "429" in err_str or "rate" in err_str.lower():
            raise ValueError(
                "Gemini API rate limit or quota exceeded. "
                "Please wait a moment and try again."
            )
        if "api_key" in err_str.lower() or "invalid" in err_str.lower() or "401" in err_str:
            raise ValueError(
                "Gemini API key is invalid or expired. "
                "Check GEMINI_API_KEY in backend/.env."
            )
        raise ValueError(
            f"AI assistance is currently unavailable. "
            f"Gemini API error: {err_str}"
        )


# ─────────────────────────────────────────────────────────────────────────────
def analyze_form(file_path: str, filename: str, content_type: str) -> dict:
    """
    Sends the uploaded document (PDF or image) directly to Gemini for
    native document/image understanding + structured JSON extraction.
    Returns the parsed JSON dict.
    Raises ValueError with a descriptive message on any failure.
    """
    _require_client()

    # ── Determine MIME type ──────────────────────────────────────────────────
    mime_map = {
        "application/pdf": "application/pdf",
        "image/jpeg":      "image/jpeg",
        "image/jpg":       "image/jpeg",
        "image/png":       "image/png",
    }
    mime_type = mime_map.get(content_type)
    if not mime_type:
        # Fallback: derive from extension
        ext = os.path.splitext(filename)[1].lower()
        ext_map = {".pdf": "application/pdf", ".jpg": "image/jpeg",
                   ".jpeg": "image/jpeg", ".png": "image/png"}
        mime_type = ext_map.get(ext)
    if not mime_type:
        raise ValueError(
            f"Unsupported file type '{content_type}'. "
            "Please upload a PDF, JPG, or PNG."
        )

    # ── Read file bytes ──────────────────────────────────────────────────────
    try:
        with open(file_path, "rb") as f:
            file_bytes = f.read()
    except Exception as e:
        raise ValueError(f"Failed to read uploaded file: {e}")

    if len(file_bytes) == 0:
        raise ValueError("The uploaded file is empty.")

    # ── Build Gemini inline-data part ────────────────────────────────────────
    try:
        from google.genai import types as genai_types
        document_part = genai_types.Part.from_bytes(
            data=file_bytes,
            mime_type=mime_type,
        )
    except Exception as e:
        raise ValueError(f"Failed to prepare document for Gemini: {e}")

    # ── System instruction ───────────────────────────────────────────────────
    system_instruction = (
        "You are an expert document analysis AI specialised in Indian government "
        "forms, application forms, and official documents. "
        "You analyse uploaded forms and extract all fields, sections, and values "
        "as structured JSON. You never invent field names or values — only extract "
        "what is actually present in the document."
    )

    # ── User prompt ──────────────────────────────────────────────────────────
    analysis_prompt = f"""Analyse the uploaded form document (filename: '{filename}').

Carefully examine:
- The form title and type
- All sections and sub-sections
- Every field label, type, and any pre-filled value
- Checkboxes and their checked/unchecked state
- Radio buttons and selected option
- Dates, signatures, tables
- Required vs optional field indicators
- Any supporting document requirements
- Any instructions printed on the form

Return ONLY a valid JSON object matching this exact schema — no markdown, no explanation, only raw JSON:

{{
  "formSummary": {{
    "name": "Detected form title",
    "confidence": "High (95%)",
    "totalFields": 0,
    "completedFields": 0,
    "emptyFields": 0,
    "needsReview": 0
  }},
  "sections": [
    {{
      "name": "Section Name",
      "fields": [
        {{
          "name": "Field Name",
          "label": "Field Label as printed",
          "type": "text|number|date|email|phone|address|select|radio|checkbox|textarea|signature|file|unknown",
          "required": true,
          "value": "extracted value or empty string",
          "status": "found|empty|review",
          "help": "Brief description of what this field is for"
        }}
      ]
    }}
  ]
}}

Rules:
- status must be "found" if a value exists, "empty" if blank, "review" if unclear or partially filled.
- Do not invent field names. Only include fields visible in the document.
- totalFields must equal the sum of all fields across all sections.
- completedFields = number of "found" fields.
- emptyFields = number of "empty" fields.
- needsReview = number of "review" fields.
- Return ONLY the raw JSON string. No code blocks, no markdown.
"""

    # ── Call Gemini ──────────────────────────────────────────────────────────
    try:
        from google.genai import types as genai_types
        response = _client.models.generate_content(
            model=GEMINI_MODEL,
            contents=[
                genai_types.Content(
                    role="user",
                    parts=[
                        genai_types.Part.from_text(text=analysis_prompt),
                        document_part,
                    ],
                )
            ],
            config=genai_types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.1,
            ),
        )
    except Exception as e:
        err_str = str(e)
        print(f"Gemini API error in analyze_form: {err_str}")
        if "quota" in err_str.lower() or "429" in err_str or "rate" in err_str.lower():
            raise ValueError(
                "Gemini API rate limit or quota exceeded. Please try again shortly."
            )
        if "api_key" in err_str.lower() or "invalid" in err_str.lower() or "401" in err_str:
            raise ValueError(
                "Gemini API key is invalid or expired. Check GEMINI_API_KEY in backend/.env."
            )
        raise ValueError(f"Gemini API request failed: {err_str}")

    # ── Parse JSON response ──────────────────────────────────────────────────
    raw_text = response.text.strip() if response.text else ""
    if not raw_text:
        raise ValueError(
            "Gemini returned an empty response for form analysis. "
            "The document may be unreadable or corrupt."
        )

    # Strip accidental markdown fences (safety net)
    if raw_text.startswith("```"):
        lines = raw_text.splitlines()
        raw_text = "\n".join(
            line for line in lines
            if not line.strip().startswith("```")
        ).strip()

    try:
        result = json.loads(raw_text)
    except json.JSONDecodeError as e:
        print(f"JSON parse error. Raw Gemini response (first 500 chars): {raw_text[:500]}")
        raise ValueError(
            f"Gemini returned a response that could not be parsed as JSON. "
            f"Parse error: {e}"
        )

    # ── Validate minimum schema ──────────────────────────────────────────────
    if "formSummary" not in result or "sections" not in result:
        raise ValueError(
            "Gemini response is missing required fields ('formSummary' or 'sections'). "
            "The document may not be a recognisable form."
        )

    result["isDemoMode"] = False
    return result
