import datetime
from typing import List, Dict, Any
from backend.schemas.analysis import AnalysisResponse, ThreatIndicator
from backend.services.url_service import analyze_url_service

async def analyze_qr_service(payload: str) -> AnalysisResponse:
    clean_payload = payload.strip()
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    scan_id = f"SG-QR-{int(datetime.datetime.utcnow().timestamp())}"

    # 1. UPI Payment Debit Trap Detection
    if clean_payload.lower().startswith("upi://pay"):
        indicators = [
            ThreatIndicator(
                id="ind-upi-scheme",
                label="Direct UPI Payment Debit Intent",
                description="This QR code triggers a payment debit command to transfer money out of your account, NOT to receive funds.",
                severity="danger"
            )
        ]
        return AnalysisResponse(
            id=scan_id,
            type="qr",
            input=clean_payload[:80] + ("..." if len(clean_payload) > 80 else ""),
            timestamp=timestamp,
            riskScore=88,
            riskLevel="high",
            threatCategory="qr-scam",
            threatLabel="Malicious UPI Debit QR Trap",
            classification="High Risk - Payment Fraud",
            indicators=indicators,
            technicalExplanation="Parsed URI scheme 'upi://pay'. Cybercriminals frequently trick victims into scanning QR codes claiming they will 'receive' money, whereas scanning a QR code can only DEBIT your bank account.",
            simpleExplanation="⚠️ DANGER: Scanning this QR code will transfer money OUT of your bank account. You NEVER need to scan a QR code to receive money.",
            recommendedAction="Cancel transaction immediately. Never enter UPI PIN when scanning unknown QR codes.",
            recommendations=[
                "Remember: Entering your UPI PIN always sends money, never receives it.",
                "Block and report the merchant / contact immediately."
            ],
            entities=["Protocol: upi://pay", "Target: Financial Transfer"],
            details={"payload": clean_payload, "scheme": "upi"}
        )

    # 2. URL Payload
    if clean_payload.startswith(("http://", "https://", "www.")) or "." in clean_payload:
        url_analysis = await analyze_url_service(clean_payload)
        url_analysis.type = "qr"
        url_analysis.id = scan_id
        url_analysis.threatLabel = f"QR Destination: {url_analysis.threatLabel}"
        url_analysis.simpleExplanation = f"QR Destination Audit: {url_analysis.simpleExplanation}"
        return url_analysis

    # 3. Arbitrary Text / Wi-Fi / Contact Payload
    return AnalysisResponse(
        id=scan_id,
        type="qr",
        input=clean_payload[:60],
        timestamp=timestamp,
        riskScore=15,
        riskLevel="safe",
        threatCategory="safe",
        threatLabel="Standard Text QR Payload",
        classification="Safe",
        indicators=[
            ThreatIndicator(
                id="ind-text-qr",
                label="Standard Plaintext Data",
                description="Contains plain textual data without executable web links or payment intents.",
                severity="info"
            )
        ],
        technicalExplanation=f"Payload parsed as plaintext string of length {len(clean_payload)}.",
        simpleExplanation="✅ This QR code contains harmless text information.",
        recommendedAction="Safe to view.",
        recommendations=["Verify intended recipient before sharing."],
        entities=["Format: Plaintext"],
        details={"payload": clean_payload}
    )
