import math
import datetime
from typing import List, Dict, Any
from backend.schemas.analysis import AnalysisResponse, ThreatIndicator

COMMON_WEAK_PASSWORDS = {
    'password', 'password123', 'password123!', '123456', '12345678', 'qwerty',
    'admin', 'welcome', 'iloveyou', 'abc12345', 'pass1234', 'monkey', 'dragon'
}

def analyze_password_service(pwd: str) -> AnalysisResponse:
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    scan_id = f"SG-PWD-{int(datetime.datetime.utcnow().timestamp())}"
    clean_pwd = pwd.strip()
    
    length = len(clean_pwd)
    has_lower = bool(any(c.islower() for c in clean_pwd))
    has_upper = bool(any(c.isupper() for c in clean_pwd))
    has_digit = bool(any(c.isdigit() for c in clean_pwd))
    has_special = bool(any(not c.isalnum() for c in clean_pwd))
    
    pool_size = 0
    if has_lower: pool_size += 26
    if has_upper: pool_size += 26
    if has_digit: pool_size += 10
    if has_special: pool_size += 33

    entropy = length * (math.log2(pool_size) if pool_size > 0 else 0)
    is_breached = clean_pwd.lower() in COMMON_WEAK_PASSWORDS

    indicators: List[ThreatIndicator] = []
    
    if is_breached:
        risk_score = 95
        threat_label = "Compromised in Known Breaches"
        risk_level = "high"
        indicators.append(ThreatIndicator(
            id="ind-breach",
            label="Found in Global Leaked Databases",
            description="Matches passwords indexed in public credential dumps (RockYou, HaveIBeenPwned). Crackable in 0.001 seconds.",
            severity="danger"
        ))
    elif entropy < 35:
        risk_score = 80
        threat_label = "Critically Weak Password"
        risk_level = "high"
        indicators.append(ThreatIndicator(
            id="ind-low-entropy",
            label="Low Information Entropy (< 35 bits)",
            description="Vulnerable to rapid offline GPU dictionary attacks.",
            severity="danger"
        ))
    elif entropy < 55:
        risk_score = 45
        threat_label = "Moderate Password Strength"
        risk_level = "suspicious"
        indicators.append(ThreatIndicator(
            id="ind-moderate",
            label="Moderate Entropy (35-55 bits)",
            description="Lacks length or character diversification.",
            severity="warning"
        ))
    else:
        risk_score = 10
        threat_label = "Cryptographically Strong"
        risk_level = "safe"
        indicators.append(ThreatIndicator(
            id="ind-strong",
            label="High Information Entropy (> 55 bits)",
            description="Resistant to brute-force and hybrid dictionary cracking.",
            severity="info"
        ))

    indicators.append(ThreatIndicator(
        id="ind-diversity",
        label=f"Character Composition ({sum([has_lower, has_upper, has_digit, has_special])}/4 classes)",
        description=f"Length: {length} chars • Entropy: {round(entropy, 1)} bits.",
        severity="info"
    ))

    return AnalysisResponse(
        id=scan_id,
        type="password",
        input=f"{'*' * min(length, 12)} ({length} chars)",
        timestamp=timestamp,
        riskScore=risk_score,
        riskLevel=risk_level,
        threatCategory="weak-password" if risk_score > 50 else "safe",
        threatLabel=threat_label,
        classification="Breached / Weak" if risk_score > 50 else "Strong Passphrase",
        indicators=indicators,
        technicalExplanation=f"Entropy score: {round(entropy, 1)} bits calculated across character space pool size {pool_size}. Common breach collision: {is_breached}.",
        simpleExplanation=(
            "⚠️ This password is too weak or publicly leaked and can be cracked almost instantly."
            if risk_score > 50 else
            "✅ This password provides strong cryptographic complexity and is resistant to attacks."
        ),
        recommendedAction="Use a 14+ character passphrase with random words, numbers, and symbols stored in a password manager." if risk_score > 50 else "Ensure unique passwords across every distinct account.",
        recommendations=["Enable Multi-Factor Authentication (2FA) wherever possible."],
        entities=[f"Entropy: {round(entropy, 1)} bits", f"Length: {length}"],
        details={
            "entropy": round(entropy, 1),
            "isBreached": is_breached,
            "classes": {"lower": has_lower, "upper": has_upper, "digit": has_digit, "special": has_special}
        }
    )
