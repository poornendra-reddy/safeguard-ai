import datetime
from typing import List, Dict, Any
from backend.schemas.analysis import AnalysisResponse, ThreatIndicator

TOXIC_TERMS = [
    'worthless', 'kill yourself', 'die', 'nobody likes you', 'target you',
    'ugly', 'loser', 'destroy you', 'leak your photos', 'doxx', 'expose you'
]

def analyze_cyberbullying_service(text: str) -> AnalysisResponse:
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    scan_id = f"SG-CBL-{int(datetime.datetime.utcnow().timestamp())}"
    lower = text.lower()
    
    score = 10
    indicators: List[ThreatIndicator] = []
    entities: List[str] = []
    recommendations: List[str] = []

    matched_toxic = [t for t in TOXIC_TERMS if t in lower]
    if matched_toxic:
        score = 85
        indicators.append(ThreatIndicator(
            id="ind-harassment-pattern",
            label="Targeted Harassment & Hostile Toxicity",
            description=f"Contains hostile language intended to intimidate or emotionally distress target ('{', '.join(matched_toxic[:2])}').",
            severity="danger"
        ))
        recommendations.append("Do not engage with the harasser. Take screenshots as legal evidence and block them immediately.")
        recommendations.append("If under immediate threat, contact local cyber crime cell or National Commission for Women (NCW) helpline.")
    else:
        score = 15
        indicators.append(ThreatIndicator(
            id="ind-neutral-text",
            label="Non-Toxic Communication",
            description="Text exhibits standard sentiment without abusive keywords or extortion threats.",
            severity="info"
        ))

    risk_level = "high" if score >= 70 else "safe"
    threat_label = "Cyberbullying / Harassment Detected" if score >= 70 else "Standard Text"

    return AnalysisResponse(
        id=scan_id,
        type="cyberbullying",
        input=text[:80] + ("..." if len(text) > 80 else ""),
        timestamp=timestamp,
        riskScore=score,
        riskLevel=risk_level,
        threatCategory="cyberbullying" if score >= 70 else "safe",
        threatLabel=threat_label,
        classification="Hostile Harassment" if score >= 70 else "Standard Message",
        indicators=indicators,
        technicalExplanation=f"NLP toxicity scan identified {len(matched_toxic)} hostile abuse triggers. Severity index: {score}/100.",
        simpleExplanation="⚠️ This message contains abusive or threatening language classified as online harassment/cyberbullying." if score >= 70 else "✅ No hostile bullying language detected.",
        recommendedAction="Block the sender, preserve screenshots, and report to platform moderation." if score >= 70 else "No action required.",
        recommendations=recommendations,
        entities=entities,
        details={"textLength": len(text), "toxicMatches": matched_toxic}
    )
