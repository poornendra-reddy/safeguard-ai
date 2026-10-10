from typing import List, Dict, Any, Optional
from backend.schemas.analysis import AssistantResponse, AssistantMessage

ASSISTANT_KNOWLEDGE_BASE = [
    {
        "keywords": ["phishing", "fake link", "url", "link", "website"],
        "reply": "I recommend using Safeguard AI's **URL Scanner** to inspect domain reputation, SSL encryption, and typosquatting. Never enter credentials if the link was sent unexpectedly via SMS or email.",
        "tool": "/analyze/url",
        "actions": ["Run URL Scanner", "Check SSL Certificate", "Verify Official Domain"]
    },
    {
        "keywords": ["sms", "message", "whatsapp", "telegram", "won", "lottery", "50000"],
        "reply": "This sounds like a smishing or lottery scam. Cybercriminals use manufactured urgency and promises of cash prizes to trick victims into sharing OTPs or paying advance processing fees.",
        "tool": "/analyze/message",
        "actions": ["Run Message Scanner", "Block Sender", "Report to 1930"]
    },
    {
        "keywords": ["digital arrest", "police", "cbi", "customs", "arrest", "warrant"],
        "reply": "⚠️ **IMPORTANT**: Indian Law Enforcement (Police, CBI, ED, Customs) NEVER conducts 'Digital Arrests' over WhatsApp or Skype video calls. This is a severe extortion fraud.",
        "tool": "/analyze/call",
        "actions": ["Disconnect Call", "File Complaint on cybercrime.gov.in", "Dial 1930 Helpline"]
    },
    {
        "keywords": ["password", "breach", "hacked", "leak"],
        "reply": "Strong passwords should be at least 14 characters long and use passphrases combining random words and symbols. Test your password entropy in our zero-knowledge **Password Checker**.",
        "tool": "/analyze/password",
        "actions": ["Test Password Strength", "Enable Two-Factor Authentication (2FA)", "Use a Password Manager"]
    },
    {
        "keywords": ["qr", "scan", "upi", "paytm", "gpay", "receive money"],
        "reply": "Remember this golden rule: **Scanning a QR code always DEBITS money from your account, it NEVER receives money.** Never scan a QR code to claim cash or prizes.",
        "tool": "/analyze/qr",
        "actions": ["Run QR Code Scanner", "Never enter UPI PIN to receive money", "Report Fraud Merchant"]
    },
    {
        "keywords": ["cyber crime", "report", "helpline", "complaint", "1930", "india", "police"],
        "reply": "To report cyber crime in India: Call the National Cyber Crime Helpline at **1930** immediately for financial fraud, and register an official complaint at **cybercrime.gov.in** with evidence screenshots.",
        "tool": "/analyze/call",
        "actions": ["Dial 1930 Helpline", "Visit cybercrime.gov.in", "Save Transaction SMS/Screenshots"]
    }
]

def generate_assistant_response(user_msg: str, history: Optional[List[AssistantMessage]] = None) -> AssistantResponse:
    lower = user_msg.lower()
    
    for item in ASSISTANT_KNOWLEDGE_BASE:
        if any(kw in lower for kw in item["keywords"]):
            return AssistantResponse(
                reply=item["reply"],
                response=item["reply"],
                suggestedActions=item["actions"],
                relevantTool=item["tool"],
                threatLevel="advisory"
            )

    # General security assistant reply
    msg = (
        "Hello! I am your **SafeGuard AI Security Assistant**. "
        "I can help you identify phishing links, lottery scams, digital arrest threats, "
        "fake emails, and malicious downloads. How can I assist you in staying safe today?"
    )
    return AssistantResponse(
        reply=msg,
        response=msg,
        suggestedActions=[
            "Scan a Suspicious URL",
            "Check a Fraud SMS / Message",
            "Audit an Email for Phishing",
            "Check Wi-Fi Network Safety"
        ],
        relevantTool="/dashboard",
        threatLevel="info"
    )
