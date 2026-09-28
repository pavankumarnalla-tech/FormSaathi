import time

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
