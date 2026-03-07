"""Generate demo evidence files for testing"""
import os
from PIL import Image, ImageDraw, ImageFont
import numpy as np
from scipy.io import wavfile
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch

# Create directory
os.makedirs('demo_evidence', exist_ok=True)

def generate_tampered_image():
    """Create a tampered image with visible manipulation"""
    # Create base image
    img = Image.new('RGB', (800, 600), color=(100, 150, 200))
    draw = ImageDraw.Draw(img)
    
    # Draw some content
    draw.rectangle([100, 100, 300, 300], fill=(200, 100, 100))
    draw.ellipse([400, 200, 600, 400], fill=(100, 200, 100))
    draw.text((50, 50), "Original Content", fill=(255, 255, 255))
    
    # Save at high quality first
    img.save('demo_evidence/original_temp.jpg', 'JPEG', quality=95)
    
    # Reopen and add tampering
    img = Image.open('demo_evidence/original_temp.jpg')
    draw = ImageDraw.Draw(img)
    
    # Add "tampered" region with different compression
    draw.rectangle([500, 100, 700, 250], fill=(255, 255, 100))
    draw.text((520, 150), "TAMPERED", fill=(255, 0, 0))
    
    # Save at different quality (creates ELA signature)
    img.save('demo_evidence/tampered_accident_photo.jpg', 'JPEG', quality=75)
    
    # Cleanup
    if os.path.exists('demo_evidence/original_temp.jpg'):
        os.remove('demo_evidence/original_temp.jpg')
    
    print("✓ Generated tampered_accident_photo.jpg")

def generate_authentic_image():
    """Create an authentic image for comparison"""
    img = Image.new('RGB', (800, 600), color=(50, 100, 150))
    draw = ImageDraw.Draw(img)
    
    # Draw natural-looking content
    draw.ellipse([200, 150, 600, 450], fill=(150, 180, 200))
    draw.rectangle([100, 400, 700, 550], fill=(80, 120, 100))
    draw.text((300, 50), "Authentic Photo", fill=(255, 255, 255))
    
    # Save at consistent quality
    img.save('demo_evidence/authentic_photo.jpg', 'JPEG', quality=90)
    print("✓ Generated authentic_photo.jpg")

def generate_fake_certificate():
    """Create a PDF with inconsistent fonts (tampering indicator)"""
    filename = 'demo_evidence/fake_medical_certificate.pdf'
    c = canvas.Canvas(filename, pagesize=letter)
    
    # Header
    c.setFont("Helvetica-Bold", 20)
    c.drawString(2*inch, 10*inch, "MEDICAL CERTIFICATE")
    
    # Body with mixed fonts (tampering indicator)
    c.setFont("Helvetica", 12)
    c.drawString(1*inch, 9*inch, "This is to certify that Mr. John Doe")
    
    # Tampered line - different font size
    c.setFont("Helvetica", 16)  # Different size!
    c.drawString(1*inch, 8.5*inch, "was absent due to illness on 2026-03-15")
    
    c.setFont("Helvetica", 12)
    c.drawString(1*inch, 8*inch, "and is fit to resume duties.")
    
    # Future date (red flag)
    c.setFont("Helvetica", 10)
    c.drawString(1*inch, 2*inch, "Date: 2026-12-31")  # Future date!
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(1*inch, 1.5*inch, "Dr. Smith")
    c.drawString(1*inch, 1.2*inch, "Medical Officer")
    
    c.save()
    print("✓ Generated fake_medical_certificate.pdf")

def generate_authentic_certificate():
    """Create an authentic-looking PDF"""
    filename = 'demo_evidence/authentic_certificate.pdf'
    c = canvas.Canvas(filename, pagesize=letter)
    
    # Header
    c.setFont("Helvetica-Bold", 18)
    c.drawString(2*inch, 10*inch, "EMPLOYMENT CERTIFICATE")
    
    # Body with consistent formatting
    c.setFont("Helvetica", 12)
    c.drawString(1*inch, 9*inch, "This is to certify that Ms. Jane Smith")
    c.drawString(1*inch, 8.5*inch, "has been employed with our organization")
    c.drawString(1*inch, 8*inch, "from January 2024 to March 2026.")
    
    c.drawString(1*inch, 7*inch, "She has been a valuable member of our team")
    c.drawString(1*inch, 6.5*inch, "and we wish her success in future endeavors.")
    
    # Proper date
    c.setFont("Helvetica", 10)
    c.drawString(1*inch, 2*inch, "Date: 2026-03-06")
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(1*inch, 1.5*inch, "HR Manager")
    c.drawString(1*inch, 1.2*inch, "ABC Corporation")
    
    c.save()
    print("✓ Generated authentic_certificate.pdf")

def generate_synthetic_audio():
    """Create synthetic audio with unnatural characteristics"""
    sample_rate = 16000
    duration = 3  # seconds
    
    # Generate tone sweep (clearly synthetic)
    t = np.linspace(0, duration, sample_rate * duration)
    
    # Frequency sweep from 200Hz to 800Hz
    frequency = np.linspace(200, 800, len(t))
    audio = np.sin(2 * np.pi * frequency * t)
    
    # Add some silence (perfect silence is unnatural in real recordings)
    silence = np.zeros(int(sample_rate * 0.5))
    audio = np.concatenate([audio, silence, audio])
    
    # Normalize
    audio = audio / np.max(np.abs(audio))
    audio = (audio * 32767).astype(np.int16)
    
    wavfile.write('demo_evidence/synthetic_audio_sample.wav', sample_rate, audio)
    print("✓ Generated synthetic_audio_sample.wav")

def generate_natural_audio():
    """Create more natural-sounding audio"""
    sample_rate = 16000
    duration = 2
    
    # Generate multiple frequencies (more natural)
    t = np.linspace(0, duration, sample_rate * duration)
    
    # Mix of frequencies
    audio = (np.sin(2 * np.pi * 440 * t) * 0.3 +  # A note
             np.sin(2 * np.pi * 554 * t) * 0.2 +  # C# note
             np.sin(2 * np.pi * 659 * t) * 0.2)   # E note
    
    # Add some noise (natural recordings have background noise)
    noise = np.random.normal(0, 0.02, len(audio))
    audio = audio + noise
    
    # Normalize
    audio = audio / np.max(np.abs(audio))
    audio = (audio * 32767).astype(np.int16)
    
    wavfile.write('demo_evidence/natural_audio_sample.wav', sample_rate, audio)
    print("✓ Generated natural_audio_sample.wav")

def generate_invoice_pdf():
    """Create a fake invoice with tampering signs"""
    filename = 'demo_evidence/suspicious_invoice.pdf'
    c = canvas.Canvas(filename, pagesize=letter)
    
    # Header
    c.setFont("Helvetica-Bold", 16)
    c.drawString(2.5*inch, 10*inch, "INVOICE")
    
    c.setFont("Helvetica", 10)
    c.drawString(1*inch, 9.5*inch, "Invoice #: INV-2026-001")
    c.drawString(1*inch, 9.2*inch, "Date: March 6, 2026")
    
    # Items
    c.setFont("Helvetica-Bold", 11)
    c.drawString(1*inch, 8.5*inch, "Item")
    c.drawString(5*inch, 8.5*inch, "Amount")
    
    c.setFont("Helvetica", 10)
    c.drawString(1*inch, 8*inch, "Consulting Services")
    c.drawString(5*inch, 8*inch, "$5,000.00")
    
    # Tampered amount - different font
    c.setFont("Helvetica", 14)  # Larger font - suspicious!
    c.drawString(1*inch, 7.5*inch, "Additional Charges")
    c.drawString(5*inch, 7.5*inch, "$15,000.00")
    
    c.setFont("Helvetica-Bold", 11)
    c.drawString(1*inch, 6.5*inch, "Total:")
    c.drawString(5*inch, 6.5*inch, "$20,000.00")
    
    c.save()
    print("✓ Generated suspicious_invoice.pdf")

if __name__ == "__main__":
    print("Generating demo evidence files...")
    print()
    
    # Generate all test files
    generate_tampered_image()
    generate_authentic_image()
    generate_fake_certificate()
    generate_authentic_certificate()
    generate_synthetic_audio()
    generate_natural_audio()
    generate_invoice_pdf()
    
    print()
    print("✓ All demo files generated successfully!")
    print()
    print("Files created in demo_evidence/:")
    print("  IMAGES:")
    print("    - tampered_accident_photo.jpg (should detect as TAMPERED)")
    print("    - authentic_photo.jpg (should detect as AUTHENTIC)")
    print("  DOCUMENTS:")
    print("    - fake_medical_certificate.pdf (should detect as TAMPERED)")
    print("    - authentic_certificate.pdf (should detect as AUTHENTIC)")
    print("    - suspicious_invoice.pdf (should detect as SUSPICIOUS)")
    print("  AUDIO:")
    print("    - synthetic_audio_sample.wav (should detect as SYNTHETIC)")
    print("    - natural_audio_sample.wav (should detect as REAL)")
    print()
    print("Upload these files to http://localhost:8501 to test the system!")
