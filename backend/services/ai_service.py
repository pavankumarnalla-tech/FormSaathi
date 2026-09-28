import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini API
AI_API_KEY = os.getenv("AI_API_KEY")
if not AI_API_KEY or AI_API_KEY == "your_gemini_api_key_here":
    HAS_REAL_AI = False
else:
    genai.configure(api_key=AI_API_KEY)
    HAS_REAL_AI = True


def get_field_assistance(
    form_name: str,
    section_name: str,
    field_name: str,
    field_description: str,
    question: str,
    language: str
) -> tuple:
    """
    Returns (answer: str, is_demo: bool).
    Calls Gemini API to get contextual assistance.
    """
    if not HAS_REAL_AI:
        raise ValueError("AI_API_KEY is not configured in the backend .env file. Please add your Gemini API key.")

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""You are 'Form Saathi', a helpful and simple assistant for citizens filling out government and official forms.
The user is filling out a form called '{form_name}'.
They are currently at the section '{section_name}', on the field '{field_name}'.
The field description is: '{field_description}'.

The user asks: "{question}"

Provide a simple, clear, and direct explanation. 
Do not invent legal requirements. If you are uncertain, advise checking official sources.
Respond in the language: {language}.
Keep the response to 2-3 short sentences.
"""
        response = model.generate_content(prompt)
        if response.text:
            return response.text.strip(), False
        else:
            raise ValueError("Empty response from AI.")
    except Exception as e:
        print(f"AI Assistance Error: {e}")
        raise ValueError(f"AI Assistance failed: {str(e)}")


def analyze_form(file_path: str, filename: str, content_type: str) -> dict:
    """
    Analyzes the uploaded form using Gemini Vision.
    """
    if not HAS_REAL_AI:
        raise ValueError("AI_API_KEY is not configured in the backend .env file. Please add your Gemini API key.")

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = """Analyze this uploaded form.
Identify the form name, and extract all fields grouped by logical sections.
Determine field types (text, date, radio, number, tel, file, etc.).
Determine if they are required.
If any values are already filled in the image/document, extract them and set status="found".
If they are empty, set status="empty".
Return the response STRICTLY as a JSON object with this structure:
{
  "formSummary": {
    "name": "Form Name",
    "confidence": "High",
    "totalFields": 0,
    "completedFields": 0,
    "emptyFields": 0,
    "needsReview": 0
  },
  "sections": [
    {
      "name": "Section Name",
      "fields": [
        {
          "name": "Field Name",
          "label": "Original Field Label",
          "type": "text",
          "required": true,
          "value": "extracted value or empty string",
          "status": "found or empty or review",
          "help": "Short help text for this field"
        }
      ]
    }
  ]
}
Do not include any Markdown formatting (like ```json), just the raw JSON.
"""
        # Upload the file to Gemini
        uploaded_file = genai.upload_file(path=file_path, display_name=filename)
        
        # Generate content
        response = model.generate_content([uploaded_file, prompt])
        
        # Cleanup uploaded file
        try:
            genai.delete_file(uploaded_file.name)
        except:
            pass
        
        # Parse response
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
            
        result = json.loads(raw_text.strip())
        result["isDemoMode"] = False
        return result
        
    except Exception as e:
        print(f"AI Analysis Error: {e}")
        raise ValueError(f"AI Analysis failed: {str(e)}")
