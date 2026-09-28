"""
PDF generation service for Form Saathi.

DEMO MODE: Generates a clearly labelled sample PDF using Python's
built-in capabilities (no extra PDF library needed beyond reportlab if available,
otherwise falls back to a minimal hand-crafted PDF).

In production:
- Use reportlab or fpdf2 to populate a real government form template.
- Replace the body of generate_form_pdf() with real template logic.
"""

from datetime import datetime
import textwrap

def generate_form_pdf(form_name: str, form_id: str, sections: list) -> bytes:
    """
    Generates and returns PDF bytes for the completed form.
    Attempts to use reportlab if available, falls back to minimal PDF bytes.
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
            rightMargin=2*cm, leftMargin=2*cm,
            topMargin=2*cm, bottomMargin=2*cm
        )

        styles = getSampleStyleSheet()
        story = []

        # ── Demo banner ──────────────────────────────────────────────
        demo_style = ParagraphStyle('demo', parent=styles['Normal'],
            fontSize=10, textColor=colors.HexColor('#92400e'),
            backColor=colors.HexColor('#fef3c7'), borderPadding=8,
            alignment=TA_CENTER, spaceAfter=6)
        story.append(Paragraph(
            "⚠  DEMO FORM — SAMPLE OUTPUT  ⚠  "
            "This document is for demonstration purposes only. "
            "It is not a real government document.",
            demo_style
        ))
        story.append(Spacer(1, 0.4*cm))

        # ── Title ────────────────────────────────────────────────────
        title_style = ParagraphStyle('title', parent=styles['Title'],
            fontSize=18, textColor=colors.HexColor('#4338ca'),
            spaceAfter=4, alignment=TA_CENTER)
        story.append(Paragraph(form_name, title_style))

        sub_style = ParagraphStyle('sub', parent=styles['Normal'],
            fontSize=10, textColor=colors.HexColor('#64748b'),
            alignment=TA_CENTER, spaceAfter=4)
        story.append(Paragraph(f"Prepared by Form Saathi  ·  Generated: {datetime.now().strftime('%d %B %Y, %H:%M')}", sub_style))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#4338ca'), spaceAfter=14))

        # ── Sections ────────────────────────────────────────────────
        section_hdr = ParagraphStyle('sec_hdr', parent=styles['Heading2'],
            fontSize=12, textColor=colors.HexColor('#1e1b4b'),
            backColor=colors.HexColor('#e0e7ff'), borderPadding=6,
            spaceBefore=10, spaceAfter=6)
        label_style = ParagraphStyle('lbl', parent=styles['Normal'],
            fontSize=9, textColor=colors.HexColor('#64748b'))
        value_style = ParagraphStyle('val', parent=styles['Normal'],
            fontSize=11, textColor=colors.HexColor('#0f172a'), spaceAfter=2)
        empty_style = ParagraphStyle('empty', parent=styles['Normal'],
            fontSize=11, textColor=colors.HexColor('#94a3b8'),
            spaceAfter=2)

        for section in sections:
            story.append(Paragraph(f"  {section['name']}", section_hdr))

            table_data = []
            for field in section.get('fields', []):
                label = field.get('label', field.get('key', ''))
                value = str(field.get('value', '') or '').strip()
                label_p = Paragraph(label, label_style)
                if value:
                    value_p = Paragraph(value, value_style)
                else:
                    value_p = Paragraph('— not provided —', empty_style)
                table_data.append([label_p, value_p])

            if table_data:
                col_widths = [6*cm, 11*cm]
                t = Table(table_data, colWidths=col_widths)
                t.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
                    ('LINEBELOW', (0, 0), (-1, -1), 0.25, colors.HexColor('#e2e8f0')),
                    ('LEFTPADDING', (0, 0), (-1, -1), 8),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                    ('TOPPADDING', (0, 0), (-1, -1), 6),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ]))
                story.append(t)

            story.append(Spacer(1, 0.3*cm))

        # ── Footer ──────────────────────────────────────────────────
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cbd5e1'), spaceBefore=12))
        footer_style = ParagraphStyle('footer', parent=styles['Normal'],
            fontSize=8, textColor=colors.HexColor('#94a3b8'), alignment=TA_CENTER)
        story.append(Paragraph(
            "This form was filled using Form Saathi — an AI-powered form assistance tool. "
            "Please verify all information and submit through the appropriate official channel. "
            "Form Saathi does not submit to any government portal.",
            footer_style
        ))

        doc.build(story)
        return buffer.getvalue()

    except ImportError:
        # Fallback: return a minimal but valid hand-crafted PDF
        return _minimal_pdf_fallback(form_name, sections)


def _minimal_pdf_fallback(form_name: str, sections: list) -> bytes:
    """Generates a minimal valid PDF without any external library."""
    lines = [f"DEMO FORM - SAMPLE OUTPUT", f"", f"Form: {form_name}",
             f"Generated: {datetime.now().strftime('%d %B %Y %H:%M')}",
             f"",
             f"This is a sample output. Please use the Form Saathi PDF",
             f"(install reportlab: pip install reportlab) for a formatted PDF.",
             f""]
    for section in sections:
        lines.append(f"--- {section['name']} ---")
        for field in section.get('fields', []):
            label = field.get('label', field.get('key', ''))
            value = str(field.get('value', '') or '').strip() or '(not provided)'
            lines.append(f"  {label}: {value}")
        lines.append("")

    # Encode the lines as text content inside a valid PDF structure
    content_text = "\n".join(lines)
    # Build a barebones PDF 1.4 file
    objects = []

    # Obj 1: Catalog
    objects.append(b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    # Obj 2: Pages
    objects.append(b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")

    # Build stream content
    safe_lines = []
    for line in lines:
        wrapped = textwrap.wrap(line, 80) or ['']
        safe_lines.extend(wrapped)

    page_stream = "BT\n/F1 11 Tf\n50 780 Td\n12 TL\n"
    for ln in safe_lines[:55]:  # cap at ~55 lines per page
        escaped = ln.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)').replace('\r', '')
        page_stream += f"({escaped}) Tj T*\n"
    page_stream += "ET"
    stream_bytes = page_stream.encode('latin-1', errors='replace')

    # Obj 3: Page
    objects.append(
        f"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        f"/Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n".encode()
    )
    # Obj 4: Content stream
    objects.append(
        f"4 0 obj\n<< /Length {len(stream_bytes)} >>\nstream\n".encode() +
        stream_bytes + b"\nendstream\nendobj\n"
    )
    # Obj 5: Font
    objects.append(
        b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"
    )

    # Assemble PDF
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
