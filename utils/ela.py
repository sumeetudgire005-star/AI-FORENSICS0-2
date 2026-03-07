import numpy as np
from PIL import Image
from io import BytesIO
import base64

def compute_ela(image_path: str, quality: int = 75, scale: int = 10):
    try:
        original = Image.open(image_path).convert('RGB')
        
        temp_buffer = BytesIO()
        original.save(temp_buffer, 'JPEG', quality=quality)
        temp_buffer.seek(0)
        recompressed = Image.open(temp_buffer)
        
        ela_array = np.array(original, dtype=np.float32) - np.array(recompressed, dtype=np.float32)
        ela_array = np.abs(ela_array) * scale
        ela_array = np.clip(ela_array, 0, 255).astype(np.uint8)
        
        manipulation_score = float(np.mean(ela_array) / 255.0)
        
        ela_image = Image.fromarray(ela_array)
        buffer = BytesIO()
        ela_image.save(buffer, format='PNG')
        ela_heatmap_b64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        return ela_array, manipulation_score, ela_heatmap_b64
    except Exception as e:
        return None, 0.0, ""
