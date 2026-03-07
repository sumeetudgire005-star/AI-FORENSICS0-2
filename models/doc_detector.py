import os
import hashlib
from PIL import Image

class DocumentDetector:
    def __init__(self):
        self.ocr_reader = None
    
    def analyze_document(self, filepath: str) -> dict:
        from utils.ela import compute_ela
        
        with open(filepath, 'rb') as f:
            sha256 = hashlib.sha256(f.read()).hexdigest()
        
        if filepath.lower().endswith('.pdf'):
            try:
                from pdf2image import convert_from_path
                images = convert_from_path(filepath, first_page=1, last_page=1)
                temp_image_path = filepath.replace('.pdf', '_temp.jpg')
                images[0].save(temp_image_path, 'JPEG')
                analysis_path = temp_image_path
            except:
                return {
                    "evidence_type": "document",
                    "filename": os.path.basename(filepath),
                    "sha256": sha256,
                    "final_verdict": "ERROR",
                    "final_confidence": 0.0,
                    "reasoning": "Could not process PDF"
                }
        else:
            analysis_path = filepath
        
        ela_array, ela_score, ela_heatmap_b64 = compute_ela(analysis_path)
        suspicious_regions = []
        
        if ela_score > 0.5 or len(suspicious_regions) > 0:
            verdict = "TAMPERED"
            confidence = ela_score
            reasoning = f"Document shows signs of tampering (ELA: {ela_score:.2f})"
        elif ela_score > 0.3:
            verdict = "SUSPICIOUS"
            confidence = ela_score
            reasoning = f"Document may have been edited (ELA: {ela_score:.2f})"
        else:
            verdict = "AUTHENTIC"
            confidence = 1.0 - ela_score
            reasoning = f"Document appears authentic (ELA: {ela_score:.2f})"
        
        if filepath.lower().endswith('.pdf') and os.path.exists(analysis_path):
            try:
                os.remove(analysis_path)
            except:
                pass
        
        return {
            "evidence_type": "document",
            "filename": os.path.basename(filepath),
            "sha256": sha256,
            "ela_score": round(ela_score, 3),
            "ela_heatmap_b64": ela_heatmap_b64,
            "suspicious_regions": suspicious_regions,
            "final_verdict": verdict,
            "final_confidence": round(confidence, 3),
            "reasoning": reasoning
        }

_detector = None

def get_detector():
    global _detector
    if _detector is None:
        _detector = DocumentDetector()
    return _detector
