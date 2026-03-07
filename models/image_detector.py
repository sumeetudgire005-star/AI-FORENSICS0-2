from PIL import Image
import sys
import os
import hashlib
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.ela import compute_ela
from utils.metadata import extract_exif, check_editing_software

class ImageDetector:
    def __init__(self):
        self.model = None
    
    def _load_model(self):
        pass  # Simplified - no ML model needed for MVP
    
    def analyze_image(self, filepath: str) -> dict:
        with open(filepath, 'rb') as f:
            sha256 = hashlib.sha256(f.read()).hexdigest()
        
        ela_array, ela_score, ela_heatmap_b64 = compute_ela(filepath)
        exif = extract_exif(filepath)
        edited_software = check_editing_software(exif)
        
        # Simplified classification based on ELA score
        if ela_score > 0.5:
            label = "FAKE"
            confidence = ela_score
        else:
            label = "REAL"
            confidence = 1.0 - ela_score
        
        if ela_score > 0.6 or (label == "FAKE" and confidence > 0.7):
            verdict = "TAMPERED"
            final_confidence = max(ela_score, confidence)
            reasoning = f"High ELA score ({ela_score:.2f}) indicates tampering"
        elif ela_score > 0.3:
            verdict = "SUSPICIOUS"
            final_confidence = ela_score
            reasoning = f"Moderate ELA score ({ela_score:.2f}) suggests possible editing"
        else:
            verdict = "AUTHENTIC"
            final_confidence = 1.0 - ela_score
            reasoning = f"Low ELA score ({ela_score:.2f}) indicates authentic image"
        
        if edited_software:
            reasoning += " | Editing software detected in EXIF"
        
        return {
            "evidence_type": "image",
            "filename": os.path.basename(filepath),
            "sha256": sha256,
            "ela_score": round(ela_score, 3),
            "ela_heatmap_b64": ela_heatmap_b64,
            "efficientnet_label": label,
            "efficientnet_confidence": round(confidence, 3),
            "exif": exif,
            "edited_software_detected": edited_software,
            "final_verdict": verdict,
            "final_confidence": round(final_confidence, 3),
            "reasoning": reasoning
        }

_detector = None

def get_detector():
    global _detector
    if _detector is None:
        _detector = ImageDetector()
    return _detector
