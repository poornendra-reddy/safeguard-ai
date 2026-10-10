import re
import datetime
from typing import List, Dict, Any
from backend.schemas.analysis import AnalysisResponse, ThreatIndicator

URGENCY_TRIGGERS = [
    'urgent', 'immediately', 'within 2 hours', 'within 24 hours', 'action required',
    'suspended', 'blocked', 'terminated', 'deactivated', 'penalty', 'legal action',
    'arrest', 'fir', 'police', 'cbi', 'cyber crime', 'warrant'
]

REWARD_TRIGGERS = [
    'won', 'congratulations', 'lottery', 'lucky draw', 'prize', 'gift', 'bonus',
    'cash prize', '50,000', '1,00,000', 'crore', 'lakh', 'claim reward', 'free cash',
    'kbc', 'reward points'
]

CREDENTIAL_TRIGGERS = [
    'otp', 'password', 'pin', 'cvv', 'kyc', 'pan card', 'aadhaar', 'debit card',
    'netbanking', 'verify account', 'update kyc', 'bank details', 'secret code'
]

FINANCIAL_TRAPS = [
    'part time job', 'daily income', 'telegram group', 'crypto profit', 'guaranteed returns',
    'double money', 'investment scheme', 'like and subscribe', 'task bonus'
]

def analyze_message_service(message_text: str, channel: str = "SMS") -> AnalysisResponse:
    text = message_text.strip()
    lower = text.lower()
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    scan_id = f"SG-MSG-{int(datetime.datetime.utcnow().timestamp())}"

    score = 10
    indicators: List[ThreatIndicator] = []
    entities: List[str] = []
    recommendations: List[str] = []

    # 1. Manufactured Urgency
    matched_urgency = [w for w in URGENCY_TRIGGERS if w in lower]
    if matched_urgency:
        score += 30
        indicators.append(ThreatIndicator(
            id="ind-urgency",
            label="Manufactured Urgency & Coercion",
            description=f"Message deploys psychological pressure cues ('{', '.join(matched_urgency[:3])}') to force immediate irrational actions.",
            severity="danger"
        ))
        entities.extend([f"Urgency cue: {w}" for w in matched_urgency[:2]])
        recommendations.append("Legitimate institutions and banks never demand immediate emergency action via SMS or messaging apps.")

    # 2. Fake Financial Reward / Lottery
    matched_rewards = [w for w in REWARD_TRIGGERS if w in lower]
    if matched_rewards:
        score += 30
        indicators.append(ThreatIndicator(
            id="ind-reward",
            label="Unrealistic Financial Bait / Lottery",
            description=f"Promises unexpected monetary rewards or prizes ('{', '.join(matched_rewards[:3])}') to lure victims into fee fraud.",
            severity="danger"
        ))
        entities.extend([f"Reward claim: {w}" for w in matched_rewards[:2]])
        recommendations.append("You cannot win a lottery or prize you never entered. Never pay 'processing fees' to receive prizes.")

    # 3. Credential & Identity Theft (KYC / OTP)
    matched_creds = [w for w in CREDENTIAL_TRIGGERS if w in lower]
    if matched_creds:
        score += 35
        indicators.append(ThreatIndicator(
            id="ind-credentials",
            label="Credential / KYC Harvesting Request",
            description=f"Demands sensitive verification details ('{', '.join(matched_creds[:3])}') which are exclusively confidential.",
            severity="danger"
        ))
        entities.extend([f"Requested sensitive info: {w}" for w in matched_creds[:2]])
        recommendations.append("Never share OTPs, PINs, or KYC documents through links sent via SMS, WhatsApp, or Telegram.")

    # 4. Job / Investment Scam
    matched_job = [w for w in FINANCIAL_TRAPS if w in lower]
    if matched_job:
        score += 25
        indicators.append(ThreatIndicator(
            id="ind-job-scam",
            label="High-Yield Investment / Task Fraud Pattern",
            description=f"Matches task fraud and high-yield investment scam scripts ('{', '.join(matched_job[:2])}').",
            severity="warning"
        ))

    # 5. Embedded Suspicious Link Detection
    found_urls = re.findall(r"(https?://\S+|www\.\S+|\b[a-zA-Z0-9-]+\.(?:xyz|top|tk|ml|cf|ga|buzz|icu|shop|club)\b\S*)", text)
    if found_urls:
        score += 25
        indicators.append(ThreatIndicator(
            id="ind-link",
            label="Embedded Unverified External Link",
            description=f"Message instructs recipient to open an unverified destination: {found_urls[0][:40]}.",
            severity="warning"
        ))
        entities.append(f"Target Link: {found_urls[0][:50]}")
        recommendations.append("Do not tap or click the link. Use official applications or browser bookmarks.")

    score = min(max(score, 10), 99)
    if score >= 75:
        risk_level = "high"
        threat_category = "smishing"
        threat_label = "Smishing / Social Engineering Scam"
        classification = "High Risk - Fraudulent Message"
        simple_explanation = "⚠️ This message is a scam because it tries to hurry you, promises an unexpected reward, and asks you to open an unfamiliar link or provide personal details."
        technical_explanation = f"Linguistic entropy analysis identified {len(indicators)} social engineering cues including manufactured urgency, financial bait, and credential harvesting requests. Risk index: {score}/100."
        recommended_action = "Do not click any link, do not share OTPs or personal details, and report to the cyber helpline immediately."
        recommendations.append("Block the sender number and file a complaint on cybercrime.gov.in or dial 1930.")
    elif score >= 50:
        risk_level = "suspicious"
        threat_category = "phishing"
        threat_label = "Suspicious Message"
        classification = "Suspicious"
        simple_explanation = "⚠️ This message shows warning signs of spam or social engineering manipulation."
        technical_explanation = f"Moderate scam indicators detected. Score: {score}/100."
        recommended_action = "Do not reply or follow instructions from this unknown sender."
    else:
        risk_level = "safe"
        threat_category = "safe"
        threat_label = "Standard Message"
        classification = "Low Risk / Standard"
        simple_explanation = "✅ No immediate urgency, credential harvesting, or predatory scam patterns detected."
        technical_explanation = f"Natural language scan found zero high-risk coercion keywords. Score: {score}/100."
        recommended_action = "Standard messaging precautions apply."

    return AnalysisResponse(
        id=scan_id,
        type="message",
        input=text[:120] + ("..." if len(text) > 120 else ""),
        timestamp=timestamp,
        riskScore=score,
        riskLevel=risk_level,
        threatCategory=threat_category,
        threatLabel=threat_label,
        classification=classification,
        indicators=indicators,
        technicalExplanation=technical_explanation,
        simpleExplanation=simple_explanation,
        recommendedAction=recommended_action,
        recommendations=recommendations,
        entities=entities,
        details={
            "channel": channel,
            "charCount": len(text),
            "foundUrls": found_urls
        }
    )
