"""Generate simple test files quickly"""
import os
from PIL import Image, ImageDraw
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch

os.makedirs('demo_evidence', exist_ok=True)

# 1. Tampered Image
img = Image.new('RGB', (800, 600), color=(100, 150, 200))
draw = ImageDraw.Draw(img)
draw.rectangle([100, 100, 300, 300], fill=(200, 100, 100))
draw.text((50, 50), "Original", fill=(255, 255, 255))
img.save('demo_evidence/temp.jpg', 'JPEG', quality=95)

img = Image.open('demo_evidence/temp.jpg')
draw = ImageDraw.Draw(img)
draw.rectangle([500, 100, 700, 250], fill=(255, 255, 100))
draw.text((520, 150), "EDITED", fill=(255, 0, 0))
img.save('demo_evidence/tampered_photo.jpg', 'JPEG', quality=75)
os.remove('demo_evidence/temp.jpg')
print("✓ tampered_photo.jpg")

# 2. Authentic Image
img = Image.new('RGB', (800, 600), color=(50, 100, 150))
draw = ImageDraw.Draw(img)
draw.ellipse([200, 150, 600, 450], fill=(150, 180, 200))
draw.text((300, 50), "Authentic", fill=(255, 255, 255))
img.save('demo_evidence/authentic_photo.jpg', 'JPEG', quality=90)
print("✓ authentic_photo.jpg")

# 3. Fake Certificate PDF
c = canvas.Canvas('demo_evidence/fake_certificate.pdf', pagesize=letter)
c.setFont("Helvetica-Bold", 20)
c.drawString(2*inch, 10*inch, "MEDICAL CERTIFICATE")
c.setFont("Helvetica", 12)
c.drawString(1*inch, 9*inch, "This certifies that John Doe")
c.setFont("Helvetica", 16)  # Different size - tampering!
c.drawString(1*inch, 8.5*inch, "was absent on 2026-03-15")
c.setFont("Helvetica", 12)
c.drawString(1*inch, 8*inch, "and is fit to work.")
c.setFont("Helvetica", 10)
c.drawString(1*inch, 2*inch, "Date: 2026-12-31")  # Future date!
c.save()
print("✓ fake_certificate.pdf")

# 4. Authentic Certificate PDF
c = canvas.Canvas('demo_evidence/authentic_certificate.pdf', pagesize=letter)
c.setFont("Helvetica-Bold", 18)
c.drawString(2*inch, 10*inch, "EMPLOYMENT CERTIFICATE")
c.setFont("Helvetica", 12)
c.drawString(1*inch, 9*inch, "This certifies that Jane Smith")
c.drawString(1*inch, 8.5*inch, "worked from Jan 2024 to Mar 2026")
c.setFont("Helvetica", 10)
c.drawString(1*inch, 2*inch, "Date: 2026-03-06")
c.save()
print("✓ authentic_certificate.pdf")

# 5. Suspicious Invoice
c = canvas.Canvas('demo_evidence/suspicious_invoice.pdf', pagesize=letter)
c.setFont("Helvetica-Bold", 16)
c.drawString(2.5*inch, 10*inch, "INVOICE")
c.setFont("Helvetica", 10)
c.drawString(1*inch, 9*inch, "Invoice #: INV-001")
c.setFont("Helvetica", 10)
c.drawString(1*inch, 8*inch, "Services: $5,000")
c.setFont("Helvetica", 14)  # Larger - suspicious!
c.drawString(1*inch, 7.5*inch, "Extra: $15,000")
c.setFont("Helvetica-Bold", 11)
c.drawString(1*inch, 6.5*inch, "Total: $20,000")
c.save()
print("✓ suspicious_invoice.pdf")

print("\n✅ All test files created in demo_evidence/")
print("\nUpload these to http://localhost:8501 to test!")
