"""
OCR Endpoints
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.api.deps import get_current_active_user
from app.models.user import User
from app.services.ocr_service import ocr_service

router = APIRouter()

@router.post("/scan")
async def scan_receipt(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """
    Upload a receipt image to extract amount and date.
    Returns suggested expense details.
    """
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    contents = await file.read()
    
    # Process image
    result = ocr_service.parse_receipt(contents)
    
    if not result["text"]:
        raise HTTPException(status_code=422, detail="Could not extract text from image")
        
    return {
        "success": True,
        "data": result
    }
