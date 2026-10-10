import re
import datetime
from typing import List, Dict, Any, Optional
from backend.schemas.analysis import AnalysisResponse, ThreatIndicator

SUSPICIOUS_EMAIL_TLDS = {'.xyz', '.top', '.tk', '.ml', '.buzz', '.icu', '.club', '.shop', '.work', '.click', '.info'}
POPULAR_FREE_PROVIDERS = {'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'proton.me', 'aol.com'}
ENTERPRISE_BRANDS = ['paypal', 'netflix', 'amazon', 'apple', 'microsoft', 'google', 'bank', 'sbi', 'hdfc', 'chase', 'wellsfargo']

def analyze_email_service(sender: str, subject: str, body: str, links: Optional[List[str]] = None) -> AnalysisResponse:
    sender_clean = sender.strip().lower()
    subject_clean = subject.strip()
    body_clean = body.strip()
    content_combined = (subject_clean + " " + body_clean).lower()
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    scan_id = f"SG-EML-{int(datetime.datetime.utcnow().timestamp())}"

    score = 10
    indicators: List[ThreatIndicator] = []
    entities: List[str] = []
    recommendations: List[str] = []

    # Extract sender domain
    sender_domain = ""
    if "@" in sender_clean:
        sender_domain = sender_clean.split("@")[-1].strip(">").strip()
        entities.append(f"Sender Domain: {sender_domain}")

    # 1. Suspicious Sender TLD
    for tld in SUSPICIOUS_EMAIL_TLDS:
        if sender_domain.endswith(tld):
            score += 35
            indicators.append(ThreatIndicator(
                id="ind-email-tld",
                label="High-Risk Sender TLD",
                description=f"Sender domain uses '{tld}', an untrusted TLD rarely used by authentic institutions.",
                severity="danger"
            ))
            break

    # 2. Corporate Brand Impersonation via Free Email or Typosquatted Domain
    for brand in ENTERPRISE_BRANDS:
        if brand in sender_clean or brand in subject_clean.lower():
            entities.append(f"Referenced Brand: {brand.upper()}")
            # If claiming to be brand but sent from free provider or misspelled domain
            if sender_domain in POPULAR_FREE_PROVIDERS:
                score += 45
                indicators.append(ThreatIndicator(
                    id=f"ind-free-provider-{brand}",
                    label=f"Brand Spoofing via Free Webmail",
                    description=f"Email claims to represent {brand.upper()} but is sent from a public free email account ({sender_domain}).",
                    severity="danger"
                ))
                recommendations.append(f"Official {brand.upper()} communications are never sent from public Gmail or Yahoo accounts.")
                break
            elif not (sender_domain == f"{brand}.com" or sender_domain.endswith(f".{brand}.com")):
                score += 40
                indicators.append(ThreatIndicator(
                    id=f"ind-spoofed-domain-{brand}",
                    label=f"Domain Mismatch Impersonation",
                    description=f"Claims {brand.upper()} identity but domain '{sender_domain}' is not authorized by the legitimate owner.",
                    severity="danger"
                ))
                recommendations.append(f"Verify sender headers against official {brand.upper()} security advisories.")
                break

    # 3. Urgency & Account Threat Phrasing
    if any(w in content_combined for w in ['suspended', 'termination', '24 hours', 'immediate action', 'security alert', 'unauthorized access']):
        score += 25
        indicators.append(ThreatIndicator(
            id="ind-email-urgency",
            label="Coercive Account Threat Urgency",
            description="Subject or body creates fear of service cancellation or penalty to bypass rational evaluation.",
            severity="warning"
        ))
        recommendations.append("Do not click links embedded in security warning emails. Log into the official service independently.")

    # 4. Credential Harvesting Links
    if any(w in content_combined for w in ['verify your password', 'confirm identity', 'update payment method', 'click here to verify', 'login to resolve']):
        score += 30
        indicators.append(ThreatIndicator(
            id="ind-credential-harvesting",
            label="Credential Harvesting Call-to-Action",
            description="Explicitly prompts recipient to re-enter sensitive login or billing credentials via an unverified link.",
            severity="danger"
        ))

    score = min(max(score, 10), 99)
    if score >= 75:
        risk_level = "high"
        threat_category = "phishing"
        threat_label = "Phishing Email (Brand Spoofing)"
        classification = "High Risk - Phishing"
        simple_explanation = "⚠️ This email is a phishing attempt. The sender address does not match the company they claim to be, and it urges you to verify credentials."
        technical_explanation = f"Detected brand impersonation, sender domain spoofing ({sender_domain}), and credential collection phrasing. Risk score: {score}/100."
        recommended_action = "Do not open attachments or click links. Mark as Phishing/Spam and delete."
        recommendations.append("Report this email to your organization's IT security team or phish@abuse.net.")
    elif score >= 50:
        risk_level = "suspicious"
        threat_category = "phishing"
        threat_label = "Suspicious Email"
        classification = "Suspicious"
        simple_explanation = "⚠️ This email contains unverified sender elements and high-urgency language."
        technical_explanation = f"Moderate indicators detected. Score: {score}/100."
        recommended_action = "Verify the sender through a secondary official channel before replying."
    else:
        risk_level = "safe"
        threat_category = "safe"
        threat_label = "Legitimate Email"
        classification = "Safe / Trusted"
        simple_explanation = "✅ No spoofing or predatory phishing cues detected in sender headers and message body."
        technical_explanation = f"Sender headers align with content. Baseline score: {score}/100."
        recommended_action = "Standard email safety practices apply."

    return AnalysisResponse(
        id=scan_id,
        type="email",
        input=f"From: {sender} | Subj: {subject}",
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
            "senderDomain": sender_domain,
            "subject": subject,
            "hasLinks": bool(links or ("http" in body_clean))
        }
    )
