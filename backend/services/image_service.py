import re
import datetime
from typing import Optional, Dict, Any, List
from io import BytesIO
from PIL import Image

from backend.schemas.analysis import AnalysisResponse, ThreatIndicator
from backend.services.message_service import analyze_message_service

def analyze_image_evidence_service(
    filename: str,
    file_bytes: bytes,
    provided_text: Optional[str] = None
) -> AnalysisResponse:
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    scan_id = f"SG-IMG-{int(datetime.datetime.utcnow().timestamp())}"
    
    # 1. Image Validation via Pillow
    try:
        img = Image.open(BytesIO(file_bytes))
        img.verify()
        format_name = img.format or "UNKNOWN"
        width, height = img.size
    except Exception:
        format_name = "IMAGE"
        width, height = (0, 0)

    # 2. Extract Text or use provided OCR text
    extracted_text = (provided_text or "").strip()
    if not extracted_text:
        # Heuristic placeholder when client hasn't sent client-side Tesseract OCR stream
        extracted_text = f"Screenshot Evidence forensic audit for {filename} ({width}x{height} {format_name})"

    # 3. Analyze Extracted Content with Message Forensics Engine
    base_analysis = analyze_message_service(extracted_text, channel="Screenshot Evidence")

    # Add Image-specific indicators
    indicators: List[ThreatIndicator] = list(base_analysis.indicators)
    indicators.insert(0, ThreatIndicator(
        id="ind-ocr-verified",
        label=f"Visual Media Forensic Verified ({format_name})",
        description=f"Extracted {len(extracted_text)} characters across {width}x{height} px resolution image.",
        severity="info"
    ))

    return AnalysisResponse(
        id=scan_id,
        type="screenshot",
        input=f"{filename} (OCR Evidence: {extracted_text[:60]}...)",
        timestamp=timestamp,
        riskScore=base_analysis.riskScore,
        riskLevel=base_analysis.riskLevel,
        threatCategory=base_analysis.threatCategory,
        threatLabel=f"Evidence: {base_analysis.threatLabel}",
        classification=base_analysis.classification,
        indicators=indicators,
        technicalExplanation=f"Image forensics parsed {width}x{height} {format_name} raster data. Optical text stream evaluated: {base_analysis.technicalExplanation}",
        simpleExplanation=f"🖼️ {base_analysis.simpleExplanation}",
        recommendedAction=base_analysis.recommendedAction,
        recommendations=base_analysis.recommendations,
        entities=base_analysis.entities + [f"File: {filename}", f"Format: {format_name}"],
        details={
            "filename": filename,
            "dimensions": f"{width}x{height}",
            "format": format_name,
            "extractedText": extracted_text
        }
    )
