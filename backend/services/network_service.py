import datetime
from typing import List, Dict, Any
from backend.schemas.analysis import AnalysisResponse, ThreatIndicator

def analyze_network_risk_service(ssid: str, auth_type: str = "Open / No Encryption", is_public: bool = False) -> AnalysisResponse:
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    scan_id = f"SG-NET-{int(datetime.datetime.utcnow().timestamp())}"
    clean_ssid = ssid.strip()
    
    score = 10
    indicators: List[ThreatIndicator] = []
    entities: List[str] = [f"SSID: {clean_ssid}", f"Auth: {auth_type}"]
    recommendations: List[str] = []

    auth_lower = auth_type.lower()
    
    # 1. Unencrypted Open Wi-Fi
    if "open" in auth_lower or "none" in auth_lower or "unencrypted" in auth_lower:
        score += 65
        indicators.append(ThreatIndicator(
            id="ind-open-wifi",
            label="Zero Link Layer Encryption (Open Wi-Fi)",
            description="Radio traffic is broadcast in unencrypted plaintext. Eavesdroppers on the same frequency can intercept unencrypted sessions and conduct Man-In-The-Middle (MITM) attacks.",
            severity="danger"
        ))
        recommendations.append("Always connect through a trusted VPN (Virtual Private Network) on open networks.")

    # 2. Obsolete WEP / WPA1
    elif "wep" in auth_lower or "wpa " in auth_lower:
        score += 50
        indicators.append(ThreatIndicator(
            id="ind-obsolete-cipher",
            label="Obsolete Wi-Fi Encryption Standard",
            description="WEP/WPA1 utilizes broken RC4/TKIP algorithms crackable within minutes via packet injection.",
            severity="danger"
        ))
        recommendations.append("Upgrade access point configuration to WPA2-AES or WPA3-SAE.")

    # 3. Evil Twin Name Heuristic
    if any(keyword in clean_ssid.lower() for keyword in ['free', 'airport', 'hotel', 'guest', 'starbucks', 'metro']):
        score += 20
        indicators.append(ThreatIndicator(
            id="ind-evil-twin",
            label="Rogue AP / Evil-Twin High Likelihood Target",
            description=f"SSID '{clean_ssid}' matches common public network names cloned by portable Wi-Fi Pineapples.",
            severity="warning"
        ))
        recommendations.append("Verify network authenticity with venue staff before authenticating.")

    score = min(max(score, 10), 98)
    if score >= 70:
        risk_level = "high"
        threat_label = "Vulnerable Unsecured Network (MITM Danger)"
        simple_explanation = "⚠️ This Wi-Fi network does not encrypt your data. Anyone nearby can potentially see the websites you visit and steal session tokens."
        recommended_action = "Disconnect immediately or activate a VPN before browsing."
    elif score >= 40:
        risk_level = "suspicious"
        threat_label = "Moderate Risk Network"
        simple_explanation = "⚠️ Network has security limitations or uses older encryption standards."
        recommended_action = "Avoid accessing sensitive banking or work portals without VPN protection."
    else:
        risk_level = "safe"
        threat_label = "Secure WPA2/WPA3 Encrypted Network"
        simple_explanation = "✅ Network employs modern link-layer encryption."
        recommended_action = "Safe to connect."

    technical_explanation = f"Evaluated wireless 802.11 beacon profile for '{clean_ssid}'. Auth standard '{auth_type}'. Risk index: {score}/100."

    return AnalysisResponse(
        id=scan_id,
        type="network",
        input=f"SSID: {clean_ssid} ({auth_type})",
        timestamp=timestamp,
        riskScore=score,
        riskLevel=risk_level,
        threatCategory="unsecure-network" if score > 50 else "safe",
        threatLabel=threat_label,
        classification="High Risk Network" if score > 50 else "Secure Wi-Fi",
        indicators=indicators,
        technicalExplanation=technical_explanation,
        simpleExplanation=simple_explanation,
        recommendedAction=recommended_action,
        recommendations=recommendations,
        entities=entities,
        details={"ssid": clean_ssid, "authType": auth_type, "isPublic": is_public}
    )
