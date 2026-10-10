import os
import datetime
from typing import List, Dict, Any, Optional
from backend.schemas.analysis import AnalysisResponse, ThreatIndicator

DANGEROUS_EXTENSIONS = {
    '.exe', '.bat', '.cmd', '.vbs', '.vbe', '.js', '.jse', '.wsf', '.wsh',
    '.ps1', '.scr', '.hta', '.jar', '.com', '.pif', '.cpl', '.iso', '.img'
}

MACRO_EXTENSIONS = {'.docm', '.xlsm', '.pptm', '.dotm'}

def analyze_file_metadata_service(filename: str, filesize: int = 0, mimetype: str = "") -> AnalysisResponse:
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    scan_id = f"SG-FIL-{int(datetime.datetime.utcnow().timestamp())}"
    clean_name = filename.strip()
    lower_name = clean_name.lower()
    
    score = 10
    indicators: List[ThreatIndicator] = []
    entities: List[str] = [f"File: {clean_name}", f"Size: {filesize} bytes"]
    recommendations: List[str] = []

    # 1. Double Extension Masking (e.g. statement.pdf.exe)
    parts = lower_name.split('.')
    if len(parts) >= 3:
        penultimate = f".{parts[-2]}"
        final_ext = f".{parts[-1]}"
        if final_ext in DANGEROUS_EXTENSIONS:
            score += 55
            indicators.append(ThreatIndicator(
                id="ind-double-ext",
                label="Double Extension Masking Attack",
                description=f"File disguises executable payload ({final_ext}) under decoy document extension ({penultimate}).",
                severity="danger"
            ))
            recommendations.append("Never open files with dual extensions sent via email or downloads.")

    # 2. Executable / Script Payload Check
    _, ext = os.path.splitext(lower_name)
    if ext in DANGEROUS_EXTENSIONS:
        score += 45
        indicators.append(ThreatIndicator(
            id=f"ind-exec-ext-{ext}",
            label=f"Dangerous Executable Extension ({ext})",
            description=f"Directly executable binary or automation script capable of executing arbitrary code on target machine.",
            severity="danger"
        ))

    # 3. Macro-Enabled Document
    if ext in MACRO_EXTENSIONS:
        score += 35
        indicators.append(ThreatIndicator(
            id="ind-macro",
            label="Macro-Enabled Office Document",
            description="Contains embedded Visual Basic (VBA) macro routines frequently weaponized in initial access stages.",
            severity="warning"
        ))
        recommendations.append("Do not enable macros if prompted by this document.")

    score = min(max(score, 10), 99)
    if score >= 75:
        risk_level = "high"
        threat_label = "Weaponized Malicious File"
        classification = "High Risk - Dangerous File"
        simple_explanation = "⚠️ This file is dangerous. It contains executable code or a disguised extension intended to compromise your system."
        recommended_action = "Do not open, execute, or extract this file. Delete it and run an antivirus scan."
    elif score >= 50:
        risk_level = "suspicious"
        threat_label = "Potentially Unwanted File"
        classification = "Suspicious"
        simple_explanation = "⚠️ This file exhibits warning indicators such as macro scripts or archive packaging."
        recommended_action = "Inspect file origin and scan with an updated endpoint antivirus before opening."
    else:
        risk_level = "safe"
        threat_label = "Standard Document Format"
        classification = "Safe"
        simple_explanation = "✅ File extension and metadata align with standard non-executable documents."
        recommended_action = "Normal handling precautions apply."

    technical_explanation = f"Analyzed filename structure and extension '{ext}'. Flagged {len(indicators)} heuristic flags. Computed risk score: {score}/100."

    return AnalysisResponse(
        id=scan_id,
        type="file",
        input=f"{clean_name} ({filesize} B)",
        timestamp=timestamp,
        riskScore=score,
        riskLevel=risk_level,
        threatCategory="malicious-file" if score > 50 else "safe",
        threatLabel=threat_label,
        classification=classification,
        indicators=indicators,
        technicalExplanation=technical_explanation,
        simpleExplanation=simple_explanation,
        recommendedAction=recommended_action,
        recommendations=recommendations,
        entities=entities,
        details={"filename": clean_name, "filesize": filesize, "mimetype": mimetype, "extension": ext}
    )
