import requests
import json

def load_prompt_template(detection_results: dict, case_meta: dict) -> str:
    file_list = ", ".join([r.get('filename', 'unknown') for r in detection_results])
    
    prompt = f"""You are a certified digital forensics examiner writing a legal forensic report for Indian courts under IT Act Section 65B.

EVIDENCE SUBMITTED:
- Files: {file_list}
- Analysis Date: {case_meta.get('date', 'N/A')}
- Case Reference: {case_meta.get('case_id', 'N/A')}

DETECTION RESULTS:
{json.dumps(detection_results, indent=2)}

Write a professional forensic findings section with:
1. SUMMARY: One paragraph plain-English summary for non-technical judges
2. FINDINGS PER EVIDENCE: For each file, state what was detected, confidence level, and what it means legally
3. CROSS-REFERENCE ANOMALIES: List any inconsistencies across evidence items
4. FRAUD PROBABILITY: Overall fraud risk (LOW / MEDIUM / HIGH / CRITICAL) with reasoning
5. RECOMMENDED ACTION: What should insurance investigators do next?

Use formal legal language. Be specific about technical findings. Do not use jargon without explanation.
Keep total length under 600 words."""
    
    return prompt

def generate_forensic_narrative(detection_results: list, case_meta: dict) -> str:
    try:
        prompt = load_prompt_template(detection_results, case_meta)
        
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "llama3.2", "prompt": prompt, "stream": False},
            timeout=90
        )
        
        if response.status_code == 200:
            return response.json().get("response", generate_fallback_narrative(detection_results))
        else:
            return generate_fallback_narrative(detection_results)
    except:
        return generate_fallback_narrative(detection_results)

def generate_fallback_narrative(detection_results: list) -> str:
    tampered_count = sum(1 for r in detection_results if r.get('final_verdict') == 'TAMPERED')
    suspicious_count = sum(1 for r in detection_results if r.get('final_verdict') == 'SUSPICIOUS')
    total = len(detection_results)
    
    if tampered_count > 0:
        risk = "HIGH"
    elif suspicious_count > 0:
        risk = "MEDIUM"
    else:
        risk = "LOW"
    
    narrative = f"""FORENSIC ANALYSIS SUMMARY

This forensic examination analyzed {total} evidence file(s) submitted for verification. 

FINDINGS:
"""
    
    for i, result in enumerate(detection_results, 1):
        verdict = result.get('final_verdict', 'UNKNOWN')
        confidence = result.get('final_confidence', 0.0)
        filename = result.get('filename', 'unknown')
        reasoning = result.get('reasoning', 'No details available')
        
        narrative += f"\n{i}. {filename}: {verdict} (Confidence: {confidence:.1%})\n   {reasoning}\n"
    
    narrative += f"""
OVERALL ASSESSMENT:
Based on the technical analysis, the fraud probability is assessed as {risk}. """
    
    if tampered_count > 0:
        narrative += f"{tampered_count} file(s) show clear signs of tampering or manipulation. "
    
    if suspicious_count > 0:
        narrative += f"{suspicious_count} file(s) exhibit suspicious characteristics requiring further investigation. "
    
    narrative += """

RECOMMENDED ACTION:
"""
    if risk == "HIGH":
        narrative += "Immediate investigation recommended. Evidence shows significant tampering indicators."
    elif risk == "MEDIUM":
        narrative += "Further verification recommended. Some evidence exhibits suspicious characteristics."
    else:
        narrative += "Evidence appears authentic. Standard verification procedures may proceed."
    
    return narrative
