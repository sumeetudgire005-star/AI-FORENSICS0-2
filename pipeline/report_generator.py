from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, PageBreak
from reportlab.lib.units import inch
from io import BytesIO
import base64
from datetime import datetime

def generate_report(case_id: str, detection_results: list, llm_narrative: str, chain_log: list) -> str:
    filename = f"forensic_report_{case_id}.pdf"
    doc = SimpleDocTemplate(filename, pagesize=letter)
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'], fontSize=24, textColor=colors.HexColor('#1a1a1a'), spaceAfter=30)
    heading_style = ParagraphStyle('CustomHeading', parent=styles['Heading2'], fontSize=14, textColor=colors.HexColor('#2c3e50'), spaceAfter=12)
    
    story.append(Paragraph("FORENSIC EVIDENCE ANALYSIS REPORT", title_style))
    story.append(Paragraph(f"Case Reference: {case_id}", styles['Normal']))
    story.append(Paragraph(f"Analysis Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}", styles['Normal']))
    story.append(Paragraph("Examiner: AI Forensic Engine v1.0", styles['Normal']))
    story.append(Spacer(1, 0.3*inch))
    
    story.append(Paragraph("1. CASE SUMMARY", heading_style))
    story.append(Paragraph(f"Total Evidence Files: {len(detection_results)}", styles['Normal']))
    story.append(Paragraph(f"Submission Timestamp: {datetime.now().isoformat()}", styles['Normal']))
    story.append(Spacer(1, 0.2*inch))
    
    story.append(Paragraph("2. EVIDENCE INVENTORY", heading_style))
    table_data = [['#', 'Filename', 'Type', 'SHA-256', 'Verdict']]
    for i, result in enumerate(detection_results, 1):
        table_data.append([
            str(i),
            result.get('filename', 'N/A')[:20],
            result.get('evidence_type', 'N/A'),
            result.get('sha256', 'N/A')[:16] + '...',
            result.get('final_verdict', 'N/A')
        ])
    
    table = Table(table_data, colWidths=[0.5*inch, 2*inch, 1*inch, 1.5*inch, 1*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(table)
    story.append(Spacer(1, 0.3*inch))
    
    story.append(Paragraph("3. DETAILED EVIDENCE ANALYSIS", heading_style))
    for i, result in enumerate(detection_results, 1):
        story.append(Paragraph(f"Evidence #{i}: {result.get('filename', 'N/A')}", styles['Heading3']))
        story.append(Paragraph(f"Type: {result.get('evidence_type', 'N/A')}", styles['Normal']))
        
        verdict = result.get('final_verdict', 'UNKNOWN')
        confidence = result.get('final_confidence', 0.0)
        
        verdict_color = colors.green if verdict == 'AUTHENTIC' else (colors.orange if verdict == 'SUSPICIOUS' else colors.red)
        story.append(Paragraph(f"<font color='{verdict_color.hexval()}'>Verdict: {verdict} ({confidence:.1%} confidence)</font>", styles['Normal']))
        story.append(Paragraph(f"Reasoning: {result.get('reasoning', 'N/A')}", styles['Normal']))
        
        if 'ela_heatmap_b64' in result and result['ela_heatmap_b64']:
            try:
                img_data = base64.b64decode(result['ela_heatmap_b64'])
                img = RLImage(BytesIO(img_data), width=3*inch, height=2*inch)
                story.append(Spacer(1, 0.1*inch))
                story.append(Paragraph("ELA Heatmap:", styles['Normal']))
                story.append(img)
            except:
                pass
        
        story.append(Spacer(1, 0.2*inch))
    
    story.append(PageBreak())
    story.append(Paragraph("4. FORENSIC NARRATIVE", heading_style))
    for para in llm_narrative.split('\n\n'):
        if para.strip():
            story.append(Paragraph(para.strip(), styles['Normal']))
            story.append(Spacer(1, 0.1*inch))
    
    story.append(Spacer(1, 0.3*inch))
    story.append(Paragraph("5. CONCLUSION", heading_style))
    tampered = sum(1 for r in detection_results if r.get('final_verdict') == 'TAMPERED')
    suspicious = sum(1 for r in detection_results if r.get('final_verdict') == 'SUSPICIOUS')
    
    fraud_score = (tampered * 80 + suspicious * 40) / len(detection_results) if detection_results else 0
    risk_level = "CRITICAL" if fraud_score > 70 else ("HIGH" if fraud_score > 40 else ("MEDIUM" if fraud_score > 20 else "LOW"))
    
    story.append(Paragraph(f"Overall Fraud Probability: {fraud_score:.0f}%", styles['Normal']))
    story.append(Paragraph(f"Risk Level: {risk_level}", styles['Normal']))
    story.append(Spacer(1, 0.2*inch))
    
    story.append(PageBreak())
    story.append(Paragraph("6. IT ACT SECTION 65B CERTIFICATE", heading_style))
    cert_text = f"""CERTIFICATE UNDER SECTION 65B OF THE INDIAN EVIDENCE ACT, 1872

I hereby certify that the information contained in this report is a true and accurate output of the AI Forensic Evidence Verification Engine operating on the submitted digital evidence.

Case Reference: {case_id}
Analysis Timestamp: {datetime.now().isoformat()}
SHA-256 Report Hash: [Generated upon completion]

[Digital Signature Placeholder]
_______________________________
Authorized Forensic Examiner"""
    
    story.append(Paragraph(cert_text, styles['Normal']))
    story.append(Spacer(1, 0.3*inch))
    
    story.append(Paragraph("7. SHA-256 EVIDENCE CHAIN", heading_style))
    chain_data = [['Step', 'Event', 'SHA-256 Hash', 'Timestamp']]
    for entry in chain_log[:10]:
        chain_data.append([
            str(entry.get('step', '')),
            entry.get('event', '')[:30],
            entry.get('sha256', '')[:16] + '...',
            entry.get('timestamp', '')[:19]
        ])
    
    chain_table = Table(chain_data, colWidths=[0.5*inch, 2.5*inch, 2*inch, 1.5*inch])
    chain_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(chain_table)
    
    doc.build(story)
    return filename
