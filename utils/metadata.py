from PIL import Image
from PIL.ExifTags import TAGS

def extract_exif(image_path: str) -> dict:
    try:
        image = Image.open(image_path)
        exif_data = image._getexif()
        
        if not exif_data:
            return {}
        
        exif = {}
        for tag_id, value in exif_data.items():
            tag = TAGS.get(tag_id, tag_id)
            exif[tag] = str(value)
        
        return exif
    except:
        return {}

def check_editing_software(exif: dict) -> bool:
    editing_keywords = ['photoshop', 'gimp', 'adobe', 'lightroom', 'edited']
    software = exif.get('Software', '').lower()
    return any(keyword in software for keyword in editing_keywords)

def format_gps(exif: dict):
    if 'GPSInfo' in exif:
        return exif['GPSInfo']
    return None
