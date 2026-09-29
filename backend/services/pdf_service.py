"""
PDF Generation Service — Official Government Template Population

Loads original official government PDF templates and overlays user inputs
onto exact official field coordinates using pypdf and ReportLab.

Strictly follows official government form templates without custom layouts.
"""

import os
import io
from datetime import datetime
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "..", "official_forms", "telangana")

# Field coordinate definitions (x, y) for official PDF templates (Page 1)
# Coordinates measured in PDF points (1/72 inch, origin at bottom-left)
# Verified against official downloaded Telangana Revenue Department forms
TEMPLATE_MAPPINGS = {
    # ── 1 & 121: Income Certificate Application (income_general.pdf) ────────
    "1": {
        "template": "income_general.pdf",
        "fields": {
            "fullName":        {"x": 190, "y": 598.7, "font_size": 9.5},
            "fatherName":      {"x": 300, "y": 575.8, "font_size": 9.5},
            "gender":          {"x": 180, "y": 553.0, "font_size": 9.5},
            "dob":             {"x": 360, "y": 553.0, "font_size": 9.5},
            "address":         {"x": 145, "y": 516.6, "font_size": 9.0},
            "district":        {"x": 140, "y": 499.4, "font_size": 9.0},
            "mandal":          {"x": 320, "y": 499.4, "font_size": 9.0},
            "village":         {"x": 140, "y": 482.3, "font_size": 9.0},
            "pincode":         {"x": 320, "y": 482.3, "font_size": 9.0},
            "rationCard":      {"x": 190, "y": 456.5, "font_size": 9.0},
            "mobile":          {"x": 190, "y": 439.4, "font_size": 9.0},
            "aadhaar":         {"x": 190, "y": 422.3, "font_size": 9.0},
            "annualIncome":    {"x": 300, "y": 297.2, "font_size": 9.5},
            "purpose":         {"x": 230, "y": 276.1, "font_size": 9.5},
            "appDate":         {"x": 395, "y": 621.5, "font_size": 9.0},
        }
    },
    "121": {
        "template": "income_general.pdf",
        "fields": {
            "fullName":        {"x": 190, "y": 598.7, "font_size": 9.5},
            "fatherName":      {"x": 300, "y": 575.8, "font_size": 9.5},
            "gender":          {"x": 180, "y": 553.0, "font_size": 9.5},
            "dob":             {"x": 360, "y": 553.0, "font_size": 9.5},
            "address":         {"x": 145, "y": 516.6, "font_size": 9.0},
            "district":        {"x": 140, "y": 499.4, "font_size": 9.0},
            "mandal":          {"x": 320, "y": 499.4, "font_size": 9.0},
            "village":         {"x": 140, "y": 482.3, "font_size": 9.0},
            "pincode":         {"x": 320, "y": 482.3, "font_size": 9.0},
            "rationCard":      {"x": 190, "y": 456.5, "font_size": 9.0},
            "mobile":          {"x": 190, "y": 439.4, "font_size": 9.0},
            "aadhaar":         {"x": 190, "y": 422.3, "font_size": 9.0},
            "annualIncome":    {"x": 300, "y": 297.2, "font_size": 9.5},
            "purpose":         {"x": 230, "y": 276.1, "font_size": 9.5},
            "appDate":         {"x": 395, "y": 621.5, "font_size": 9.0},
        }
    },
    # ── 2: Residence Certificate Application ──────────────────────────────
    "2": {
        "template": "telangana_residence_certificate.pdf",
        "fields": {
            "fullName":        {"x": 205, "y": 598, "font_size": 9.5},
            "fatherName":      {"x": 205, "y": 570, "font_size": 9.5},
            "dob":             {"x": 205, "y": 542, "font_size": 9.5},
            "gender":          {"x": 415, "y": 542, "font_size": 9.5},
            "aadhaar":         {"x": 205, "y": 514, "font_size": 9.5},
            "mobile":          {"x": 445, "y": 514, "font_size": 9.5},
            "address":         {"x": 205, "y": 450, "font_size": 9.0},
            "village":         {"x": 205, "y": 418, "font_size": 9.0},
            "district":        {"x": 415, "y": 418, "font_size": 9.0},
            "residingSince":   {"x": 235, "y": 390, "font_size": 9.0},
            "purpose":         {"x": 415, "y": 390, "font_size": 9.0},
            "appDate":         {"x": 445, "y": 654, "font_size": 9.0},
        }
    },
    # ── 3: Caste Certificate Application ──────────────────────────────────
    "3": {
        "template": "telangana_residence_certificate.pdf",
        "fields": {
            "fullName":        {"x": 205, "y": 598, "font_size": 9.5},
            "fatherName":      {"x": 205, "y": 570, "font_size": 9.5},
            "dob":             {"x": 205, "y": 542, "font_size": 9.5},
            "gender":          {"x": 415, "y": 542, "font_size": 9.5},
            "aadhaar":         {"x": 205, "y": 514, "font_size": 9.5},
            "mobile":          {"x": 445, "y": 514, "font_size": 9.5},
            "caste":           {"x": 205, "y": 450, "font_size": 9.0},
            "communityCategory": {"x": 415, "y": 450, "font_size": 9.0},
            "address":         {"x": 205, "y": 418, "font_size": 9.0},
            "appDate":         {"x": 445, "y": 654, "font_size": 9.0},
        }
    }
}


def generate_form_pdf(form_name: str, form_id: str, sections: list) -> bytes:
    """
    Populates an original official government PDF template by mapping
    user inputs onto official field coordinates.

    If an official PDF template or field mapping is unavailable, raises ValueError.
    Does NOT generate custom/demo fallback PDFs.
    """
    form_key = str(form_id).strip()

    # Flatten user values from sections list
    field_values = {}
    for section in sections:
        for field in section.get("fields", []):
            k = field.get("key") or field.get("name")
            val = field.get("value", "")
            if k and val:
                field_values[k] = str(val).strip()

    # Automatically set appDate if missing
    if "appDate" not in field_values:
        field_values["appDate"] = datetime.now().strftime("%d/%m/%Y")

    # Check mapping registry
    mapping_config = TEMPLATE_MAPPINGS.get(form_key)
    if not mapping_config:
        raise ValueError(
            f"Official PDF template mapping is not available for form '{form_name}' (ID: {form_id}). "
            "Form Saathi only generates filled documents for verified official government templates."
        )

    template_filename = mapping_config["template"]
    template_path = os.path.join(TEMPLATE_DIR, template_filename)

    if not os.path.exists(template_path):
        raise ValueError(
            f"Original government PDF template '{template_filename}' was not found on the server."
        )

    # 1. Read original government PDF template
    reader = PdfReader(template_path)
    if len(reader.pages) == 0:
        raise ValueError("Original government PDF template is invalid or empty.")

    first_page = reader.pages[0]
    page_width = float(first_page.mediabox.width)
    page_height = float(first_page.mediabox.height)

    # 2. Create overlay canvas with user answers
    packet = io.BytesIO()
    can = canvas.Canvas(packet, pagesize=(page_width, page_height))
    can.setFillColorRGB(0, 0, 0.7) # Clean blue ink font for filled answers

    field_coords = mapping_config.get("fields", {})
    for field_key, coords in field_coords.items():
        val = field_values.get(field_key)
        if val:
            x = coords["x"]
            y = coords["y"]
            font_size = coords.get("font_size", 9.5)
            can.setFont("Helvetica-Bold", font_size)
            can.drawString(x, y, str(val))

    can.save()
    packet.seek(0)

    # 3. Merge overlay with original government PDF
    overlay_pdf = PdfReader(packet)
    overlay_page = overlay_pdf.pages[0]

    first_page.merge_page(overlay_page)

    # 4. Write output PDF bytes
    writer = PdfWriter()
    writer.add_page(first_page)

    # Copy any remaining pages of the original PDF template unmodified
    for page_idx in range(1, len(reader.pages)):
        writer.add_page(reader.pages[page_idx])

    output_stream = io.BytesIO()
    writer.write(output_stream)
    return output_stream.getvalue()
