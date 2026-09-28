import os
from dotenv import load_dotenv

load_dotenv()

# Ensure absolute path for GOOGLE_APPLICATION_CREDENTIALS
cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if cred_path and not os.path.isabs(cred_path):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath(
        os.path.join(os.path.dirname(os.path.dirname(__file__)), cred_path)
    )

def extract_text_from_file(file_path: str, content_type: str) -> str:
    """
    Extracts raw text from an image or PDF file using Google Cloud Vision OCR and PyPDF.
    """
    extracted_text = ""

    # PDF Processing
    if content_type == "application/pdf" or file_path.lower().endswith(".pdf"):
        try:
            from pypdf import PdfReader
            reader = PdfReader(file_path)
            for page in reader.pages:
                txt = page.extract_text()
                if txt:
                    extracted_text += txt + "\n"
        except Exception as e:
            print(f"PyPDF extraction error: {e}")

    # Image / Google Cloud Vision OCR Processing
    try:
        from google.cloud import vision
        client = vision.ImageAnnotatorClient()

        if os.path.exists(file_path):
            with open(file_path, "rb") as image_file:
                content = image_file.read()

            if content_type in ["image/jpeg", "image/png", "image/jpg"] or not extracted_text:
                image = vision.Image(content=content)
                response = client.document_text_detection(image=image)

                if response.error.message:
                    print(f"Google Vision API Error: {response.error.message}")
                elif response.full_text_annotation and response.full_text_annotation.text:
                    extracted_text += "\n" + response.full_text_annotation.text
    except Exception as e:
        print(f"Google Cloud Vision OCR error: {e}")

    return extracted_text.strip()
