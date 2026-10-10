import datetime
from typing import List, Dict, Any
from backend.schemas.analysis import AnalysisResponse, ThreatIndicator

RANSOMWARE_TACTICS = {
    'vssadmin': 'Volume Shadow Copies Deletion (inhibits Windows restore)',
    'shadowcopy delete': 'WMI Shadow Copy Destruction',
    'bcdedit': 'Boot Configuration Tampering & Recovery Disable',
    'wbadmin delete': 'Windows Backup Catalog Erasure',
    'net stop': 'Terminating Endpoint Antivirus / Security Services',
    'sc stop': 'Service Controller Service Termination',
    'cipher /w': 'Free Disk Space Overwriting',
    'wevtutil cl': 'Windows Security Event Log Clearing'
}

def analyze_ransomware_pattern_service(commands: str) -> AnalysisResponse:
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    scan_id = f"SG-RSM-{int(datetime.datetime.utcnow().timestamp())}"
    lower = commands.lower()
    
    score = 15
    indicators: List[ThreatIndicator] = []
    entities: List[str] = []
    recommendations: List[str] = []

    for tactic, desc in RANSOMWARE_TACTICS.items():
        if tactic in lower:
            score += 40
            indicators.append(ThreatIndicator(
                id=f"ind-tactic-{tactic.replace(' ', '_')}",
                label=f"Ransomware Inhibit System Recovery ({tactic})",
                description=desc,
                severity="danger"
            ))
            entities.append(f"Command Pattern: {tactic}")

    score = min(max(score, 15), 99)
    if score >= 70:
        risk_level = "high"
        threat_label = "Active Ransomware Staging Sequence"
        simple_explanation = "⚠️ CRITICAL: These commands delete your system backups and shadow copies, a hallmark of active ransomware payloads."
        recommended_action = "Isolate machine from network immediately (unplug Ethernet / turn off Wi-Fi). Do not reboot."
        recommendations = [
            "Disconnect network cable immediately to halt lateral spread.",
            "Contact your Incident Response / CSIRT team.",
            "Verify offline, air-gapped immutable backup integrity."
        ]
    else:
        risk_level = "safe"
        threat_label = "Benign Administrative Command"
        simple_explanation = "✅ No shadow copy deletion or destructive ransomware preparation routines detected."
        recommended_action = "Standard administrative privileges control applies."

    technical_explanation = f"Evaluated script against MITRE ATT&CK T1490 (Inhibit System Recovery). Flagged {len(indicators)} critical indicators. Risk score: {score}/100."

    return AnalysisResponse(
        id=scan_id,
        type="ransomware",
        input=commands[:100] + ("..." if len(commands) > 100 else ""),
        timestamp=timestamp,
        riskScore=score,
        riskLevel=risk_level,
        threatCategory="ransomware-pattern" if score >= 70 else "safe",
        threatLabel=threat_label,
        classification="Critical Ransomware Indicator" if score >= 70 else "Benign Script",
        indicators=indicators,
        technicalExplanation=technical_explanation,
        simpleExplanation=simple_explanation,
        recommendedAction=recommended_action,
        recommendations=recommendations,
        entities=entities,
        details={"commandLength": len(commands), "tacticMatches": len(indicators)}
    )
