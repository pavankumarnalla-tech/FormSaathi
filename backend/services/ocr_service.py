"""
ocr_service.py — Form Saathi OCR/Document Service

Google Cloud Vision has been replaced by Gemini's native document/image
understanding. This module is now a thin compatibility shim; actual text
extraction is performed inside ai_service.analyze_form() by sending the
raw file bytes directly to Gemini.

This file is kept for backwards compatibility with any import that may call
extract_text_from_file(), but the primary form-analysis pipeline no longer
goes through this module — ai_service.analyze_form() handles everything.
"""


def extract_text_from_file(file_path: str, content_type: str) -> str:
    """
    Deprecated: text extraction is now handled natively by Gemini inside
    ai_service.analyze_form(). This stub is retained so that any legacy
    import does not break. Returns an empty string.
    """
    return ""
