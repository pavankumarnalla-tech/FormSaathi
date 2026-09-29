"""
PDF generation service for Form Saathi.

Generates clean, official PDF application documents for government forms.
Maps user inputs directly to clean, official form fields.
"""

from datetime import datetime
import textwrap

def generate_form_pdf(form_name: str, form_id: str, sections: list) -> bytes:
    """
    Generates and returns PDF bytes for the completed official government form.
    Uses reportlab if available, with fallback to clean PDF stream formatting.
    """
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib import colors
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import cm
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        from reportlab.lib.enums import TA_CENTER, TA_LEFT
        import io

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=1.5*cm, leftMargin=1.5*cm,
            topMargin=1.5*cm, bottomMargin=1.5*cm
        )

        styles = getSampleStyleSheet()
        story = []

        # ── Official Header ──────────────────────────────────────────────
        hdr_badge_style = ParagraphStyle('hdr_badge', parent=styles['Normal'],
            fontSize=10, textColor=colors.HexColor('#1e3a8a'),
            backColor=colors.HexColor('#dbeafe'), borderPadding=6,
            alignment=TA_CENTER, spaceAfter=8)
        story.append(Paragraph("<b>OFFICIAL GOVERNMENT APPLICATION FORM</b>", hdr_badge_style))

        # ── Form Title ────────────────────────────────────────────────────
        title_style = ParagraphStyle('title', parent=styles['Title'],
            fontSize=16, textColor=colors.HexColor('#0f172a'),
            spaceAfter=4, alignment=TA_CENTER)
        story.append(Paragraph(form_name.upper(), title_style))

        sub_style = ParagraphStyle('sub', parent=styles['Normal'],
            fontSize=9, textColor=colors.HexColor('#475569'),
            alignment=TA_CENTER, spaceAfter=4)
        story.append(Paragraph(f"Application Prepared via Form Saathi  ·  Date: {datetime.now().strftime('%d %B %Y')}", sub_style))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1e3a8a'), spaceAfter=12))

        # ── Form Sections & Fields ────────────────────────────────────────
        section_hdr = ParagraphStyle('sec_hdr', parent=styles['Heading2'],
            fontSize=11, textColor=colors.HexColor('#1e3a8a'),
            backColor=colors.HexColor('#f1f5f9'), borderPadding=5,
            spaceBefore=8, spaceAfter=6)
        label_style = ParagraphStyle('lbl', parent=styles['Normal'],
            fontSize=9, textColor=colors.HexColor('#334155'))
        value_style = ParagraphStyle('val', parent=styles['Normal'],
            fontSize=10, textColor=colors.HexColor('#0f172a'), spaceAfter=2)
        empty_style = ParagraphStyle('empty', parent=styles['Normal'],
            fontSize=10, textColor=colors.HexColor('#94a3b8'), spaceAfter=2)

        for section in sections:
            story.append(Paragraph(f"<b>{section['name']}</b>", section_hdr))

            table_data = []
            for field in section.get('fields', []):
                label = field.get('label', field.get('key', ''))
                value = str(field.get('value', '') or '').strip()
                label_p = Paragraph(f"<b>{label}</b>", label_style)
                if value:
                    value_p = Paragraph(value, value_style)
                else:
                    value_p = Paragraph('— N/A —', empty_style)
                table_data.append([label_p, value_p])

            if table_data:
                col_widths = [6.5*cm, 11.5*cm]
                t = Table(table_data, colWidths=col_widths)
                t.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
                    ('LINEBELOW', (0, 0), (-1, -1), 0.25, colors.HexColor('#e2e8f0')),
                    ('LEFTPADDING', (0, 0), (-1, -1), 6),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                    ('TOPPADDING', (0, 0), (-1, -1), 5),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
                ]))
                story.append(t)

            story.append(Spacer(1, 0.2*cm))

        # ── Declaration Section ──────────────────────────────────────────
        story.append(Spacer(1, 0.4*cm))
        decl_hdr = ParagraphStyle('decl_hdr', parent=styles['Normal'],
            fontSize=9, textColor=colors.HexColor('#1e3a8a'))
        decl_text = ParagraphStyle('decl_text', parent=styles['Normal'],
            fontSize=8, textColor=colors.HexColor('#475569'), spaceAfter=15)

        story.append(Paragraph("<b>APPLICANT DECLARATION</b>", decl_hdr))
        story.append(Paragraph(
            "I hereby declare that all information provided in this application form is true, correct, and complete "
            "to the best of my knowledge and belief. I understand that submitting false or misleading information may lead to rejection "
            "of the application or legal action under applicable laws.",
            decl_text
        ))

        # Signature box table
        sig_data = [
            [Paragraph("<b>Date:</b> " + datetime.now().strftime('%d/%m/%Y'), label_style),
             Paragraph("<b>Signature / Thumb Impression of Applicant</b>", ParagraphStyle('sig', parent=label_style, alignment=TA_CENTER))]
        ]
        sig_table = Table(sig_data, colWidths=[8*cm, 10*cm])
        sig_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ]))
        story.append(sig_table)

        # ── Official Footer ──────────────────────────────────────────────
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cbd5e1'), spaceBefore=15))
        footer_style = ParagraphStyle('footer', parent=styles['Normal'],
            fontSize=8, textColor=colors.HexColor('#64748b'), alignment=TA_CENTER)
        story.append(Paragraph(
            "Form Saathi Official Form Output  ·  Please submit this completed form with required supporting documents to your nearest designated center or official portal.",
            footer_style
        ))

        doc.build(story)
        return buffer.getvalue()

    except ImportError:
        return _clean_pdf_fallback(form_name, sections)


def _clean_pdf_fallback(form_name: str, sections: list) -> bytes:
    """Generates a clean PDF without external libraries."""
    lines = [
        "OFFICIAL GOVERNMENT APPLICATION FORM",
        "",
        f"Form: {form_name.upper()}",
        f"Prepared: {datetime.now().strftime('%d %B %Y %H:%M')}",
        "----------------------------------------------------------------",
        ""
    ]
    for section in sections:
        lines.append(f"[{section['name'].upper()}]")
        for field in section.get('fields', []):
            label = field.get('label', field.get('key', ''))
            value = str(field.get('value', '') or '').strip() or 'N/A'
            lines.append(f"  {label}: {value}")
        lines.append("")

    lines.append("DECLARATION:")
    lines.append("I hereby declare that all details provided are true and accurate.")
    lines.append("")
    lines.append(f"Date: {datetime.now().strftime('%d/%m/%Y')}                           Signature of Applicant")

    content_text = "\n".join(lines)
    objects = []
    objects.append(b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    objects.append(b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")

    safe_lines = []
    for line in lines:
        wrapped = textwrap.wrap(line, 80) or ['']
        safe_lines.extend(wrapped)

    page_stream = "BT\n/F1 10 Tf\n40 780 Td\n12 TL\n"
    for ln in safe_lines[:55]:
        escaped = ln.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)').replace('\r', '')
        page_stream += f"({escaped}) Tj T*\n"
    page_stream += "ET"
    stream_bytes = page_stream.encode('latin-1', errors='replace')

    objects.append(
        f"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        f"/Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n".encode()
    )
    objects.append(
        f"4 0 obj\n<< /Length {len(stream_bytes)} >>\nstream\n".encode() +
        stream_bytes + b"\nendstream\nendobj\n"
    )
    objects.append(
        b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"
    )

    header = b"%PDF-1.4\n"
    body = b""
    xref_offsets = []
    pos = len(header)
    for obj in objects:
        xref_offsets.append(pos)
        body += obj
        pos += len(obj)

    xref_pos = len(header) + len(body)
    xref = f"xref\n0 {len(objects) + 1}\n"
    xref += "0000000000 65535 f \n"
    for off in xref_offsets:
        xref += f"{off:010d} 00000 n \n"

    trailer = (
        f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
        f"startxref\n{xref_pos}\n%%EOF"
    )
    return header + body + xref.encode() + trailer.encode()
