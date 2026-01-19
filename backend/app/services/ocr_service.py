"""
OCR Service for Receipt Scanning
"""
import re
import pytesseract
from PIL import Image
import io
from typing import Dict, Any, Optional
from datetime import datetime

# If tesseract is not in PATH, set it here. Windows example:
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# We will assume it's in the path or configured by the user provided environment variables if needed.

class OCRService:
    def __init__(self):
        pass

    def extract_text(self, image_bytes: bytes) -> str:
        """Extract raw text from image bytes"""
        try:
            image = Image.open(io.BytesIO(image_bytes))
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            print(f"OCR Error: {e}")
            return ""

    def parse_receipt(self, image_bytes: bytes) -> Dict[str, Any]:
        """Extract structured data from receipt image"""
        text = self.extract_text(image_bytes)
        
        # Basic Regex implementation for MVP
        # Find amounts (e.g., $10.00, 10.00)
        amount_pattern = r'(\$|€|£|₹)?\s?(\d+\.\d{2})'
        amounts = re.findall(amount_pattern, text)
        
        # Find dates (e.g., 2023-10-25, 25/10/2023)
        date_pattern = r'(\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4})'
        dates = re.findall(date_pattern, text)
        
        # Logic to pick the "Total" - commonly the largest amount found
        valid_amounts = []
        for match in amounts:
             try:
                 val = float(match[1])
                 valid_amounts.append(val)
             except:
                 pass
        
        total_amount = max(valid_amounts) if valid_amounts else 0.0
        date_str = dates[0] if dates else datetime.now().strftime("%Y-%m-%d")

        return {
            "text": text,
            "amount": total_amount,
            "date": date_str,
            "merchant": "Unknown (Edit Manually)" # Merchant extraction is hard without AI
        }

ocr_service = OCRService()
