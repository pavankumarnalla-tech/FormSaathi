import time

# ─────────────────────────────────────────────────────────────────────────────
# DEMO MODE field-assistance answers
# In a real implementation, this would call an LLM API (e.g. Gemini, OpenAI)
# with the form/field context and user question.
# ─────────────────────────────────────────────────────────────────────────────
_DEMO_FIELD_ANSWERS = {
    "annual":        "This refers to the total income earned by your family from all sources (salary, agriculture, business, rent, etc.) in one full year. If you are unsure, check your salary slips or a previous income certificate.",
    "income":        "Enter the total yearly earnings of your household — include salary, business income, farming income, rent, and any other regular earnings.",
    "aadhaar":       "Your Aadhaar is a 12-digit unique identity number issued by UIDAI. It is printed on your Aadhaar card. You can also check DigiLocker for a digital copy.",
    "date of birth": "Enter your date of birth exactly as shown on your Aadhaar card or birth certificate, in DD/MM/YYYY format.",
    "address":       "Enter your full residential address: include house/door number, street name, locality, city or village, district, state, and PIN code.",
    "mobile":        "Enter your active 10-digit Indian mobile phone number. This will be used to send status updates.",
    "occupation":    "Your occupation is your main job or profession — for example: Farmer, Government Employee, Private Employee, Business Owner, Daily Wage Worker, Student.",
    "signature":     "In a physical form, you sign here. In this digital form, submitting the form serves as your declaration and consent.",
    "gender":        "Select the gender that matches your official documents such as Aadhaar or passport.",
    "caste":         "Select the caste category as mentioned in your official caste certificate. If you do not have one, select General.",
    "bank":          "Enter your active bank account number. Any scholarship, pension, or benefit amount will be deposited into this account.",
    "ifsc":          "IFSC stands for Indian Financial System Code. It is an 11-character code identifying your bank branch. Find it on your passbook cover page or cheque leaf.",
    "name":          "Enter your full legal name exactly as it appears on your Aadhaar card or official identity document.",
}

_DEMO_ANSWER_TELUGU = "ఈ ఫీల్డ్‌లో మీ అధికారిక పత్రాలలో ఉన్న సమాచారాన్ని నమోదు చేయండి. ఏదైనా అనుమానం ఉంటే, మీ ఆధార్ కార్డు లేదా సంబంధిత సర్టిఫికెట్ చూడండి. (Demo Mode)"
_DEMO_ANSWER_HINDI   = "इस फ़ील्ड में अपने आधिकारिक दस्तावेज़ों में दी गई जानकारी दर्ज करें। यदि संदेह हो, तो अपना आधार कार्ड या संबंधित प्रमाण पत्र देखें। (Demo Mode)"
_DEMO_ANSWER_DEFAULT = "Please enter the information as shown on your official documents. If unsure, check your Aadhaar card or the relevant certificate. (AI Demo Mode)"

def _get_demo_answer(field_name: str, language: str) -> str:
    lower = field_name.lower()
    if language == "Telugu":
        return _DEMO_ANSWER_TELUGU
    if language == "Hindi":
        return _DEMO_ANSWER_HINDI
    for keyword, answer in _DEMO_FIELD_ANSWERS.items():
        if keyword in lower:
            return answer
    return _DEMO_ANSWER_DEFAULT

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

    In production, replace this with a real LLM API call using the
    form context (form_name, section_name, field_name, field_description, question).
    Keep the AI provider replaceable by changing only this function.
    """
    # TODO: Replace demo logic with real LLM API call, for example:
    #   import os, openai
    #   openai.api_key = os.getenv("OPENAI_API_KEY")
    #   response = openai.chat.completions.create(...)
    
    answer = _get_demo_answer(field_name, language)
    return answer, True  # (answer, is_demo_mode)


def analyze_form(file_path: str, filename: str, content_type: str) -> dict:
    """
    Analyzes the uploaded form.
    In a real implementation, this would call OCR and an LLM API.
    For this MVP/Step 5, it acts in DEMO MODE to return structured sample data 
    that realistically simulates AI extraction of a partially filled form.
    """
    # Simulate processing time (Frontend also shows progress, but this makes the backend realistic)
    time.sleep(2.5)
    
    # Return a structured demo response (Partially filled Income Certificate)
    return {
        "isDemoMode": True,
        "formSummary": {
            "name": "Income Certificate Application",
            "confidence": "High (92%)",
            "totalFields": 12,
            "completedFields": 5,
            "emptyFields": 5,
            "needsReview": 2
        },
        "sections": [
            {
                "name": "Personal Information",
                "fields": [
                    {
                        "name": "Full Name",
                        "label": "Name of the Applicant",
                        "type": "text",
                        "required": True,
                        "value": "Pavan Kumar",
                        "status": "found",
                        "help": "Full legal name as per Aadhaar."
                    },
                    {
                        "name": "Date of Birth",
                        "label": "DOB (DD/MM/YYYY)",
                        "type": "date",
                        "required": True,
                        "value": "15/06/1990",
                        "status": "found",
                        "help": "Date of birth of the applicant."
                    },
                    {
                        "name": "Gender",
                        "label": "Gender",
                        "type": "radio",
                        "required": True,
                        "value": "Male",
                        "status": "found",
                        "help": "Applicant's gender."
                    },
                    {
                        "name": "Aadhaar Number",
                        "label": "Aadhaar UID",
                        "type": "text",
                        "required": True,
                        "value": "XXXX-XXXX-1234",
                        "status": "review",
                        "help": "12-digit Aadhaar number. Note: Partial match detected."
                    }
                ]
            },
            {
                "name": "Income Details",
                "fields": [
                    {
                        "name": "Annual Income",
                        "label": "Total Annual Income from all sources (₹)",
                        "type": "number",
                        "required": True,
                        "value": "",
                        "status": "empty",
                        "help": "Include salary, business, agriculture, etc."
                    },
                    {
                        "name": "Occupation",
                        "label": "Occupation of the Applicant",
                        "type": "text",
                        "required": True,
                        "value": "",
                        "status": "empty",
                        "help": "Current primary occupation."
                    },
                    {
                        "name": "Source of Income",
                        "label": "Main Source of Income",
                        "type": "text",
                        "required": True,
                        "value": "Business",
                        "status": "found",
                        "help": "e.g., Salary, Agriculture, Business"
                    }
                ]
            },
            {
                "name": "Contact & Declaration",
                "fields": [
                    {
                        "name": "Mobile Number",
                        "label": "Mobile No.",
                        "type": "tel",
                        "required": True,
                        "value": "9876543210",
                        "status": "found",
                        "help": "Active mobile number for SMS updates."
                    },
                    {
                        "name": "Address",
                        "label": "Permanent Address",
                        "type": "text",
                        "required": True,
                        "value": "",
                        "status": "empty",
                        "help": "Full postal address."
                    },
                    {
                        "name": "Date of Application",
                        "label": "Date",
                        "type": "date",
                        "required": True,
                        "value": "",
                        "status": "empty",
                        "help": "Today's date."
                    },
                    {
                        "name": "Signature",
                        "label": "Signature of Applicant",
                        "type": "signature",
                        "required": True,
                        "value": "",
                        "status": "empty",
                        "help": "Sign physically or digitally."
                    },
                    {
                        "name": "Supporting Documents Attached",
                        "label": "List of Enclosures",
                        "type": "text",
                        "required": False,
                        "value": "",
                        "status": "review",
                        "help": "Specify which documents are attached. (May require document assistance)"
                    }
                ]
            }
        ]
    }
