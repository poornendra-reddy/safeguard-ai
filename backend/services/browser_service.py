import json
import datetime
from typing import List, Dict, Any
from backend.schemas.analysis import AnalysisResponse, ThreatIndicator

HIGH_RISK_PERMISSIONS = {
    '<all_urls>': 'Access and modify data on EVERY website you visit (passwords, banking, sessions)',
    '*://*/*': 'Access all web traffic on all domains',
    'webRequestBlocking': 'Intercept, inspect, and block network requests',
    'clipboardRead': 'Read data copied to your system clipboard (seed phrases, OTPs, credentials)',
    'cookies': 'Read authentication session cookies across all sites',
    'management': 'Install and uninstall other browser extensions silently',
    'tabs': 'Access active browsing tab titles and URLs'
}

def analyze_browser_manifest_service(manifest_content: str) -> AnalysisResponse:
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    scan_id = f"SG-BRW-{int(datetime.datetime.utcnow().timestamp())}"
    
    score = 10
    indicators: List[ThreatIndicator] = []
    entities: List[str] = []
    
    try:
        data = json.loads(manifest_content)
    except Exception:
        # Fallback to text matching
        data = {}

    ext_name = data.get('name', 'Browser Extension')
    entities.append(f"Extension: {ext_name}")
    permissions = data.get('permissions', [])
    if isinstance(manifest_content, str) and not permissions:
        # Regex or string scan
        permissions = [p for p in HIGH_RISK_PERMISSIONS.keys() if p in manifest_content]

    for p in permissions:
        if p in HIGH_RISK_PERMISSIONS:
            score += 25
            indicators.append(ThreatIndicator(
                id=f"ind-perm-{p.replace('*', '_').replace('/', '_')}",
                label=f"High-Risk Permission: {p}",
                description=HIGH_RISK_PERMISSIONS[p],
                severity="danger" if p in ('<all_urls>', 'clipboardRead', 'webRequestBlocking') else "warning"
            ))
            entities.append(f"Permission: {p}")

    score = min(max(score, 10), 99)
    if score >= 75:
        risk_level = "high"
        threat_label = "Excessive Critical Privileges (Spyware Risk)"
        simple_explanation = "⚠️ This extension requests dangerous permissions allowing it to read your clipboard and inspect all web traffic."
        recommended_action = "Uninstall extension unless publisher is fully verified."
    elif score >= 50:
        risk_level = "suspicious"
        threat_label = "Elevated Permissions"
        simple_explanation = "⚠️ Requests access to sensitive browser features."
        recommended_action = "Review whether permissions match the extension's stated functionality."
    else:
        risk_level = "safe"
        threat_label = "Standard Minimal Permissions"
        simple_explanation = "✅ Extension requests standard scoped permissions."
        recommended_action = "Safe to use."

    technical_explanation = f"Evaluated manifest permissions against WebExtension security policies. Risk index: {score}/100 with {len(indicators)} security flags."

    return AnalysisResponse(
        id=scan_id,
        type="browser",
        input=f"{ext_name} (Audit Permissions)",
        timestamp=timestamp,
        riskScore=score,
        riskLevel=risk_level,
        threatCategory="risky-permission" if score > 50 else "safe",
        threatLabel=threat_label,
        classification="High Risk Permission" if score > 50 else "Safe Extension",
        indicators=indicators,
        technicalExplanation=technical_explanation,
        simpleExplanation=simple_explanation,
        recommendedAction=recommended_action,
        recommendations=["Limit extension permissions in browser settings (chrome://extensions)."],
        entities=entities,
        details={"permissions": permissions, "extensionName": ext_name}
    )
