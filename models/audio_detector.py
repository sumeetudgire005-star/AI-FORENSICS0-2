import os
import hashlib

class AudioDetector:
    def __init__(self):
        self.model = None
    
    def analyze_audio(self, filepath: str) -> dict:
        with open(filepath, 'rb') as f:
            sha256 = hashlib.sha256(f.read()).hexdigest()
        
        # Simplified analysis without librosa
        file_size = os.path.getsize(filepath)
        
        # Simple heuristic based on file size and extension
        ext = os.path.splitext(filepath)[1].lower()
        
        if file_size < 50000:  # Very small file - suspicious
            verdict = "SYNTHETIC"
            confidence = 0.7
            reasoning = "Unusually small file size for audio"
        else:
            verdict = "REAL"
            confidence = 0.6
            reasoning = "Audio file appears normal"
        
        return {
            "evidence_type": "audio",
            "filename": os.path.basename(filepath),
            "sha256": sha256,
            "file_size_bytes": file_size,
            "format": ext,
            "spectrogram_b64": "",  # No spectrogram without librosa
            "final_verdict": verdict,
            "final_confidence": round(confidence, 3),
            "reasoning": reasoning
        }

_detector = None

def get_detector():
    global _detector
    if _detector is None:
        _detector = AudioDetector()
    return _detector
