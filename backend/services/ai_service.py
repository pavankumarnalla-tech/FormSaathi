import os
import json
from dotenv import load_dotenv
from services.ocr_service import extract_text_from_file

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or os.getenv("AI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

client = None
if OPENAI_API_KEY and not OPENAI_API_KEY.startswith("your_"):
    try:
        from openai import OpenAI
        client = OpenAI(api_key=OPENAI_API_KEY)
    except Exception as e:
        print(f"Warning: Failed to initialize OpenAI client: {e}")


def get_field_assistance(
    form_name: str,
    section_name: str,
    field_name: str,
    field_description: str,
    question: str,
    language: str = "English"
) -> tuple:
    """
    Calls OpenAI API to generate real contextual form assistance.
    Returns (answer: str, is_demo: bool = False).
    """
    if not client:
        raise ValueError("AI assistance is temporarily unavailable. (API key unconfigured)")

    system_prompt = (
        "You are 'AI Saathi', an expert citizen assistance assistant designed to simplify "
        "complex government and official forms in India. Your responses must be clear, concise, accurate, "
        "and easy to understand. Never invent false legal requirements. Always answer in the user's requested language."
    )

    user_prompt = f"""
Context:
- Form Name: {form_name or 'Official Application'}
- Section: {section_name or 'General'}
- Field Name: {field_name or 'Selected Field'}
- Field Description: {field_description or 'N/A'}
- User's Preferred Language: {language}

User's Question: "{question}"

Instructions:
1. Explain what this field means and what the citizen should enter.
2. If applicable, mention where to find this information or document.
3. Keep the response to 2 to 4 simple, conversational sentences.
4. Answer strictly in {language}.
"""

    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=350
        )
        answer = response.choices[0].message.content.strip()
        return answer, False
    except Exception as e:
        print(f"OpenAI API Error in get_field_assistance: {e}")
        raise ValueError("AI assistance is temporarily unavailable. Please try again.")


def analyze_form(file_path: str, filename: str, content_type: str) -> dict:
    """
    Real pipeline: Google Cloud Vision OCR -> OpenAI Form Analysis -> Structured JSON.
    """
    if not client:
        raise ValueError("Form analysis could not be completed. (AI service unconfigured)")

    # Step 1: Perform Google Cloud Vision OCR Text Extraction
    ocr_text = ""
    try:
        ocr_text = extract_text_from_file(file_path, content_type)
    except Exception as e:
        print(f"OCR Extraction Exception: {e}")

    # Step 2: Use OpenAI to structure the extracted form content into sections & fields
    system_prompt = "You are an expert OCR & Document Analysis AI for Indian government forms."
    user_prompt = f"""
Uploaded Document Filename: '{filename}'
Extracted OCR Text Content:
\"\"\"
{ocr_text if ocr_text else 'No OCR text extracted directly. Infer standard fields based on form title.'}
\"\"\"

Analyze the extracted form text above.
Identify all sections and fields, determine field types (text, date, number, radio, tel, file), 
determine if required, and extract any pre-filled values visible in the OCR text.

Return response strictly as a JSON object matching this schema:
{{
  "formSummary": {{
    "name": "Detected Form Name",
    "confidence": "High (94%)",
    "totalFields": 10,
    "completedFields": 3,
    "emptyFields": 7,
    "needsReview": 1
  }},
  "sections": [
    {{
      "name": "Personal Information",
      "fields": [
        {{
          "name": "Full Name",
          "label": "Applicant Name",
          "type": "text",
          "required": true,
          "value": "Extracted name or empty string",
          "status": "found or empty or review",
          "help": "Help text for this field"
        }}
      ]
    }}
  ]
}}
Do NOT include markdown formatting or markdown codeblocks, return ONLY the raw JSON string.
"""

    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        raw_json = response.choices[0].message.content.strip()
        result = json.loads(raw_json)
        result["isDemoMode"] = False
        return result
    except Exception as e:
        print(f"OpenAI Form Analysis Error: {e}")
        raise ValueError("Form analysis could not be completed. Please try again.")
