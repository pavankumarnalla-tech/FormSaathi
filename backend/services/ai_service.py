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

    prompt = f"""You are 'AI Saathi', an AI assistant helping citizens understand official Indian government forms, application requirements, and field definitions.

Your role:
- Explain what the requested field means and what information the citizen should enter.
- Simplify complex government terminology into plain, easy-to-understand language.
- Preserve the exact legal and factual meaning of official terms.
- Never invent fees, eligibility rules, or document requirements.
- Never claim that an application has been submitted by Form Saathi.
- If asked whether Form Saathi submits applications or generates completed forms, clearly clarify: "Form Saathi provides guidance only. Applications must be submitted through the official government portal or MeeSeva center."
- Respond strictly in the requested language ({language}).

Context:
- Form / Service : {form_name or 'Official Application'}
- Section        : {section_name or 'General'}
- Field Name     : {field_name or 'Selected Field'}
- Field Context  : {field_description or 'N/A'}
- Reply Language : {language}

Citizen's Question: "{question}"

Instructions:
1. Explain what this field means and what the citizen should enter.
2. Keep the response to 2–4 clear, conversational sentences.
3. Respond entirely in {language}.
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
def analyze_form(file_path: str, filename: str, content_type: str, language: str = "English") -> dict:
    """
    Sends the uploaded document (PDF or image) directly to Gemini for
    native document/image understanding + structured JSON extraction.
    Returns the parsed JSON dict with AI explanations in requested language.
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
    analysis_prompt = f"""Analyze the uploaded Indian government form document (filename: '{filename}').

Extract the following information from the uploaded document into clean citizen guidance.
All explanations, purpose, required document descriptions, whatItMeans, whatToEnter, and important instructions MUST be written strictly in {language} language.

1. Form Title: The exact official title printed on the form.
2. Purpose: A simple 1-2 sentence explanation of what this form is used for in {language}.
3. Required Documents: Any supporting document proofs explicitly listed or requested on the form (in {language}). If none listed, return [].
4. Field-by-Field Guidance: For EVERY actual field/box printed on this form that an applicant must fill out:
   - "name": Exact field name as printed on the form.
   - "whatItMeans": Simple 1-sentence explanation of what this field means, written in {language}.
   - "whatToEnter": Simple 1-sentence instruction on what information the citizen should enter, written in {language}.
5. Important Instructions: Any official guidelines, notes, or submission instructions printed on the form (in {language}). If none, return [].

Return ONLY a valid JSON object matching this exact schema — no markdown, no extra explanation:

{{
  "formTitle": "Official Form Title",
  "purpose": "Simple explanation of what this form is for in {language}.",
  "requiredDocuments": [
    "Aadhaar Card Copy",
    "Proof of Income"
  ],
  "fieldsGuidance": [
    {{
      "name": "Field Name as printed",
      "whatItMeans": "Simple 1-sentence explanation in {language}.",
      "whatToEnter": "Simple 1-sentence instruction in {language}."
    }}
  ],
  "importantInstructions": [
    "Instruction line 1",
    "Instruction line 2"
  ]
}}

Rules:
- Write ALL explanations (purpose, whatItMeans, whatToEnter, instructions, documents) strictly in {language}.
- Include ONLY fields visible in the uploaded document. Do NOT invent fields.
- Do NOT include technical extraction data, raw codes, coordinates, or confidence scores.
- Different uploaded forms must produce different fields specific to that uploaded document.
- Return ONLY the raw JSON string.
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
    if "formTitle" not in result and "fieldsGuidance" not in result:
        raise ValueError(
            "Gemini response is missing required guidance fields ('formTitle' or 'fieldsGuidance'). "
            "The document may not be a recognisable form."
        )

    result["isDemoMode"] = False
    return result


# ─────────────────────────────────────────────────────────────────────────────
# ─────────────────────────────────────────────────────────────────────────────
def generate_dynamic_form_guidance_and_documents(
    form_name: str,
    department: str = "",
    purpose: str = "",
    pdf_text: str = "",
    language: str = "English",
) -> dict:
    """
    Calls Gemini to analyze the form's PDF text or official metadata to extract:
    1. Actual field guidance (name, whatItMeans, whatToEnter).
    2. Actual required documents specific to this form (written strictly in the requested language).
    """
    _require_client()

    if pdf_text and pdf_text.strip():
        prompt = f"""You are an expert Indian government form analyzer.

Form Name: {form_name}
Department: {department}
Target Language: {language}

Extracted Text from the Official Government Form PDF:
\"\"\"
{pdf_text[:3500]}
\"\"\"

Task:
Analyze the form text above and extract:
1. "requiredDocuments": A list of specific required supporting documents mentioned or requested in this form (e.g., Aadhaar Card, Ration Card, Bank Passbook, Salary Certificate, Death Certificate, etc.). If no specific supporting documents are mentioned or required in the form, return [].
2. "fields": ALL actual fields/questions that the applicant must fill in this specific form.

Return ONLY a valid JSON object matching this exact schema:
{{
  "requiredDocuments": [
    "Document Name 1",
    "Document Name 2"
  ],
  "fields": [
    {{
      "name": "Field Name",
      "whatItMeans": "Simple 1-sentence explanation strictly in {language}.",
      "whatToEnter": "Simple 1-sentence instruction strictly in {language}."
    }}
  ]
}}

Rules:
- Write ALL required document names, whatItMeans, and whatToEnter strictly in {language}.
- Do NOT append English translations or text in brackets when {language} is Telugu or Hindi. Write in {language} only.
- For requiredDocuments: Include ONLY documents that are actually required or relevant to this specific form. If requirements cannot be reliably determined from the text or service context, return []. Do NOT invent generic filler documents.
- For fields: Include ONLY fields present or referenced in the form.
- Return ONLY valid JSON, no markdown formatting outside JSON.
"""
    else:
        prompt = f"""You are an expert Indian government form analyzer.

Form Name: {form_name}
Department: {department}
Purpose: {purpose}
Target Language: {language}

Task:
Based strictly on the official service purpose and department details for '{form_name}', identify:
1. "requiredDocuments": The actual required supporting documents specific to this government form/service (e.g. for Income Certificate: Ration Card/Salary Slip; for Crop Insurance: Land Passbook/Bank Account; for Health Card Pensioner: PPO Copy/Aadhaar Card). If specific requirements cannot be reliably determined for this form, return [].
2. "fields": The standard required fields specific to '{form_name}'.

Return ONLY a valid JSON object matching this exact schema:
{{
  "requiredDocuments": [
    "Document 1 strictly in {language}",
    "Document 2 strictly in {language}"
  ],
  "fields": [
    {{
      "name": "Field Name",
      "whatItMeans": "Simple explanation strictly in {language}.",
      "whatToEnter": "Simple instruction strictly in {language}."
    }}
  ]
}}

Rules:
- Write ALL required document names, whatItMeans, and whatToEnter strictly in {language}.
- Do NOT append English translations or text in brackets when {language} is Telugu or Hindi. Write in {language} only.
- Include ONLY documents and fields specific to {form_name}.
- Do NOT invent generic filler documents. If specific required documents cannot be reliably determined for {form_name}, return [] for requiredDocuments.
- Return ONLY valid JSON, no markdown.
"""

    try:
        response = _client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )
        raw_text = (response.text or "").strip()
        if raw_text.startswith("```"):
            raw_text = "\n".join(
                l for l in raw_text.splitlines()
                if not l.strip().startswith("```")
            ).strip()

        result = json.loads(raw_text)
        if isinstance(result, dict):
            req_docs = result.get("requiredDocuments", [])
            fields_list = result.get("fields", [])
            return {
                "fields": fields_list if isinstance(fields_list, list) else [],
                "requiredDocuments": req_docs if isinstance(req_docs, list) else []
            }
        return {"fields": [], "requiredDocuments": []}
    except Exception as e:
        print(f"Gemini API error in generate_dynamic_form_guidance_and_documents: {e}")
        return {"fields": [], "requiredDocuments": []}


def generate_dynamic_field_guidance(
    form_name: str,
    department: str = "",
    purpose: str = "",
    pdf_text: str = "",
    language: str = "English",
) -> list:
    """Legacy wrapper for field guidance."""
    res = generate_dynamic_form_guidance_and_documents(
        form_name=form_name,
        department=department,
        purpose=purpose,
        pdf_text=pdf_text,
        language=language
    )
    return res.get("fields", [])


