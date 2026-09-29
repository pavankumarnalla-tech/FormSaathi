import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas

def create_official_templates():
    out_dir = os.path.join(os.path.dirname(__file__), "..", "official_forms", "telangana")
    os.makedirs(out_dir, exist_ok=True)

    # 1. Official Telangana Residence Certificate Application Template
    residence_pdf_path = os.path.join(out_dir, "telangana_residence_certificate.pdf")
    c = canvas.Canvas(residence_pdf_path, pagesize=letter)
    width, height = letter # 612 x 792 pt

    # Official Header
    c.setLineWidth(1.5)
    c.setStrokeColor(colors.HexColor('#1b4332'))
    c.rect(36, 36, width - 72, height - 72)

    # Top emblem banner & Title
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(colors.HexColor('#1b4332'))
    c.drawCentredString(width / 2.0, 735, "GOVERNMENT OF TELANGANA")
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(colors.HexColor('#2d6a4f'))
    c.drawCentredString(width / 2.0, 718, "REVENUE DEPARTMENT / MEESEVA SERVICES")
    c.setFont("Helvetica-Bold", 13)
    c.setFillColor(colors.HexColor('#000000'))
    c.drawCentredString(width / 2.0, 698, "APPLICATION FOR ISSUANCE OF RESIDENCE / NATIVITY CERTIFICATE")
    c.setFont("Helvetica-Oblique", 9)
    c.drawCentredString(width / 2.0, 684, "(See Rule 3 of Telangana Rights & Domicile Regulations)")

    c.setLineWidth(1)
    c.setStrokeColor(colors.HexColor('#1b4332'))
    c.line(50, 674, width - 50, 674)

    # Application Reference Box
    c.setFont("Helvetica-Bold", 9)
    c.drawString(60, 656, "Application No:")
    c.rect(140, 650, 160, 16)
    c.drawString(340, 656, "Date of Application:")
    c.rect(440, 650, 110, 16)

    # Section 1: APPLICANT PERSONAL DETAILS
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.HexColor('#1b4332'))
    c.rect(50, 624, width - 100, 18, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.drawString(58, 629, "1. PERSONAL DETAILS OF APPLICANT")

    c.setFillColor(colors.black)
    c.setFont("Helvetica", 9)

    # Row 1: Full Name
    c.drawString(60, 600, "Full Name of Applicant:")
    c.rect(200, 594, 350, 18)

    # Row 2: Father / Husband Name
    c.drawString(60, 572, "Father's / Husband's Name:")
    c.rect(200, 566, 350, 18)

    # Row 3: DOB & Gender
    c.drawString(60, 544, "Date of Birth (DD/MM/YYYY):")
    c.rect(200, 538, 140, 18)
    c.drawString(360, 544, "Gender:")
    c.rect(410, 538, 140, 18)

    # Row 4: Aadhaar & Mobile
    c.drawString(60, 516, "Aadhaar UID Number:")
    c.rect(200, 510, 140, 18)
    c.drawString(360, 516, "Mobile Number:")
    c.rect(440, 510, 110, 18)

    # Section 2: RESIDENTIAL ADDRESS DETAILS
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.HexColor('#1b4332'))
    c.rect(50, 480, width - 100, 18, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.drawString(58, 485, "2. RESIDENTIAL ADDRESS IN TELANGANA")

    c.setFillColor(colors.black)
    c.setFont("Helvetica", 9)

    # Row 5: Door No / House Address
    c.drawString(60, 456, "Door No. / Building / Street:")
    c.rect(200, 444, 350, 24)

    # Row 6: Village / Mandal
    c.drawString(60, 420, "Village / Town / Mandal:")
    c.rect(200, 414, 140, 18)
    c.drawString(360, 420, "District:")
    c.rect(410, 414, 140, 18)

    # Row 7: Residing Since & Purpose
    c.drawString(60, 392, "Residing at Present Address Since:")
    c.rect(230, 386, 110, 18)
    c.drawString(360, 392, "Purpose:")
    c.rect(410, 386, 140, 18)

    # Section 3: DOCUMENTS ATTACHED
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.HexColor('#1b4332'))
    c.rect(50, 356, width - 100, 18, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.drawString(58, 361, "3. DOCUMENTS ENCLOSED WITH APPLICATION")

    c.setFillColor(colors.black)
    c.setFont("Helvetica", 9)
    c.drawString(60, 336, "[  ] 1. Copy of Aadhaar Card / Identity Proof")
    c.drawString(60, 320, "[  ] 2. Copy of Electricity Bill / Gas Bill / Ration Card (Address Proof)")
    c.drawString(60, 304, "[  ] 3. Study Certificates / Property Tax Receipts (if applicable)")

    # Section 4: APPLICANT DECLARATION
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.HexColor('#1b4332'))
    c.rect(50, 276, width - 100, 18, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.drawString(58, 281, "4. SELF-DECLARATION BY APPLICANT")

    c.setFillColor(colors.black)
    c.setFont("Helvetica", 8.5)
    decl = (
        "I hereby solemnly declare that the statements made above are true and correct to the best of my knowledge and belief. "
        "I am a continuous resident of the specified address in the State of Telangana. In case any information provided herein "
        "is found to be false or incorrect, I shall be liable for legal prosecution under Section 199 and Section 200 of IPC."
    )
    from textwrap import wrap
    y_decl = 258
    for line in wrap(decl, 95):
        c.drawString(60, y_decl, line)
        y_decl -= 12

    # Signature Area
    c.setFont("Helvetica", 9)
    c.drawString(60, 180, "Date: ____________________")
    c.drawString(60, 162, "Place: ___________________")

    c.rect(360, 145, 190, 50)
    c.setFont("Helvetica", 8)
    c.drawCentredString(455, 150, "Signature / Thumb Impression of Applicant")

    # Office Verification Box (Bottom)
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(colors.HexColor('#1b4332'))
    c.drawString(60, 120, "FOR OFFICE USE ONLY — REVENUE DEPARTMENT TELANGANA")
    c.setFont("Helvetica", 8)
    c.setFillColor(colors.black)
    c.drawString(60, 105, "Enquiry Report of VRO / Revenue Inspector:  [  ] Verified & Approved   [  ] Rejected")
    c.drawString(60, 90, "Signature of VRO/RI: _______________________      Tahsildar Seal & Signature: _______________________")

    # Footer note
    c.setFont("Helvetica-Oblique", 7.5)
    c.setFillColor(colors.HexColor('#475569'))
    c.drawCentredString(width / 2.0, 48, "Official Template — Government of Telangana Revenue Department (e-Service Portal)")

    c.save()
    print("Created official template:", residence_pdf_path)

if __name__ == "__main__":
    create_official_templates()
