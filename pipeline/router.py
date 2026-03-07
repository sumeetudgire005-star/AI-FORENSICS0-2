import os
import mimetypes

def route_file(filepath: str) -> dict:
    mime_type, _ = mimetypes.guess_type(filepath)
    ext = os.path.splitext(filepath)[1].lower()
    
    if ext in ['.jpg', '.jpeg', '.png', '.bmp'] or (mime_type and mime_type.startswith('image/')):
        from models.image_detector import get_detector
        detector = get_detector()
        return detector.analyze_image(filepath)
    
    elif ext in ['.pdf', '.docx'] or (mime_type and 'pdf' in mime_type):
        from models.doc_detector import get_detector
        detector = get_detector()
        return detector.analyze_document(filepath)
    
    elif ext in ['.wav', '.mp3', '.m4a', '.ogg'] or (mime_type and mime_type.startswith('audio/')):
        from models.audio_detector import get_detector
        detector = get_detector()
        return detector.analyze_audio(filepath)
    
    else:
        return {
            "evidence_type": "unsupported",
            "filename": os.path.basename(filepath),
            "final_verdict": "ERROR",
            "final_confidence": 0.0,
            "reasoning": f"Unsupported file type: {ext}"
        }
