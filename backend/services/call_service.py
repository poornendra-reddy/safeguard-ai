import datetime
from typing import List, Dict, Any
from backend.schemas.analysis import AnalysisResponse, ThreatIndicator

VISHING_KEYWORDS = [
    'cbi', 'police', 'digital arrest', 'trai', 'customs', 'fedex', 'narcotics',
    'money laundering', 'illegal parcel', 'sim card blocked', 'court warrant',
    'stay on video call', 'transfer money to rbi safe account', 'verify aadhaar'
]

def analyze_call_service(phone_number: str, transcript: str) -> AnalysisResponse:
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    scan_id = f"SG-CAL-{int(datetime.datetime.utcnow().timestamp())}"
    lower = transcript.lower()
    
    score = 15
    indicators: List[ThreatIndicator] = []
    entities: List[str] = [f"Caller ID: {phone_number}"]
    recommendations: List[str] = []

    matched_keywords = [kw for kw in VISHING_KEYWORDS if kw in lower]
    if 'digital arrest' in lower or 'cbi' in lower or 'police' in lower or 'customs' in lower:
        score += 60
        if 'digital arrest' in lower:
            score += 15
        indicators.append(ThreatIndicator(
            id="ind-digital-arrest",
            label="Digital Arrest Impersonation Scam",
            description="Law enforcement and police NEVER conduct 'Digital Arrests' or demand video call confinement.",
            severity="danger"
        ))
        recommendations.append("Disconnect immediately. No Indian law enforcement agency conducts arrests over Skype/WhatsApp.")

    if 'sim card blocked' in lower or 'trai' in lower:
        score += 40
        indicators.append(ThreatIndicator(
            id="ind-trai-threat",
            label="TRAI / Telecom Disconnection Threat",
            description="TRAI never calls individual citizens to threaten immediate SIM card termination.",
            severity="danger"
        ))
        recommendations.append("Report caller number to Chakshu portal on sancharsaathi.gov.in.")

    if matched_keywords:
        entities.extend([f"Identified Claim: {kw.upper()}" for kw in matched_keywords[:3]])

    score = min(max(score, 15), 98)
    if score >= 70:
        risk_level = "high"
        threat_label = "Vishing / Digital Arrest Scam Call"
        simple_explanation = "⚠️ FRAUD CALL: This caller is impersonating officials using fear and fake legal threats to extract money."
        recommended_action = "Hang up immediately. Do not transfer any money. Report number to National Cyber Crime helpline 1930."
    else:
        risk_level = "safe"
        threat_label = "Standard / Unclassified Call"
        simple_explanation = "✅ No recognized vishing scripts or extortion patterns detected."
        recommended_action = "Never disclose OTPs or banking credentials over the telephone."

    technical_explanation = f"Vishing audio script analysis matched {len(indicators)} social extortion patterns. Risk score: {score}/100."

    return AnalysisResponse(
        id=scan_id,
        type="call",
        input=f"{phone_number}: {transcript[:80]}...",
        timestamp=timestamp,
        riskScore=score,
        riskLevel=risk_level,
        threatCategory="vishing" if score >= 70 else "safe",
        threatLabel=threat_label,
        classification="High Risk - Vishing Scam" if score >= 70 else "Standard Call",
        indicators=indicators,
        technicalExplanation=technical_explanation,
        simpleExplanation=simple_explanation,
        recommendedAction=recommended_action,
        recommendations=recommendations,
        entities=entities,
        details={"phone": phone_number, "transcript": transcript}
    )
