from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Dict, Any, Union

class ThreatIndicator(BaseModel):
    id: str
    label: str
    description: str
    severity: str = "warning"  # "info", "warning", "danger"
    detected: bool = True
    type: Optional[str] = None

class AnalysisResponse(BaseModel):
    id: str
    type: str  # "url", "message", "email", "screenshot", "qr", "website", "call", "password", "file", "share", "browser", "network", "deepfake", "ransomware", "cyberbullying"
    input: str
    timestamp: str
    riskScore: int  # 0 - 100
    riskLevel: str  # "safe", "low", "suspicious", "high"
    threatCategory: str
    threatLabel: str
    indicators: List[ThreatIndicator] = []
    technicalExplanation: str
    simpleExplanation: str
    recommendedAction: str
    recommendations: List[str] = []
    entities: List[str] = []
    details: Dict[str, Any] = {}
    classification: Optional[str] = None
    confidence: Optional[float] = None
    domain: Optional[str] = None
    url: Optional[str] = None

# ----------------- Tool Specific Requests -----------------

class URLScanRequest(BaseModel):
    url: str = Field(..., min_length=3, max_length=2048, description="URL to scan for phishing and malicious indicators")

class MessageScanRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000, description="SMS, WhatsApp, or chat text to analyze")
    channel: Optional[str] = Field("SMS", description="Delivery channel (SMS, WhatsApp, Telegram, Email)")

    @model_validator(mode='before')
    @classmethod
    def normalize_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "text" in data and "message" not in data:
                data["message"] = data["text"]
        return data

class EmailScanRequest(BaseModel):
    sender: str = Field(..., max_length=320, description="Sender email address")
    subject: str = Field(..., max_length=1000, description="Email subject line")
    body: str = Field(..., max_length=50000, description="Email body content")
    links: Optional[Union[List[str], str]] = Field(default=[], description="Extracted links from email")

    @model_validator(mode='before')
    @classmethod
    def normalize_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            l = data.get("links")
            if isinstance(l, str):
                data["links"] = [l] if l.strip() else []
            elif l is None:
                data["links"] = []
        return data

class QRScanRequest(BaseModel):
    payload: str = Field(..., min_length=1, max_length=4096, description="Decoded QR content or URL payload")

    @model_validator(mode='before')
    @classmethod
    def normalize_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "qr_content" in data and "payload" not in data:
                data["payload"] = data["qr_content"]
        return data

class PasswordScanRequest(BaseModel):
    password: str = Field(..., min_length=1, max_length=512, description="Password to test for entropy and breach patterns")

class FileScanRequest(BaseModel):
    filename: str = Field(..., max_length=512)
    filesize: Optional[int] = 0
    mimetype: Optional[str] = ""

class BrowserScanRequest(BaseModel):
    manifest: str = Field(..., min_length=2, max_length=50000, description="JSON string of browser extension manifest.json")

    @model_validator(mode='before')
    @classmethod
    def normalize_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "manifest_text" in data and "manifest" not in data:
                data["manifest"] = data["manifest_text"]
        return data

class NetworkScanRequest(BaseModel):
    ssid: str = Field(..., min_length=1, max_length=64, description="Wi-Fi Network Name / SSID")
    auth_type: str = Field("Open / No Encryption", description="Encryption type")
    is_public: Optional[bool] = False

    @model_validator(mode='before')
    @classmethod
    def normalize_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "authType" in data and "auth_type" not in data:
                data["auth_type"] = data["authType"]
            if "isPublic" in data and "is_public" not in data:
                data["is_public"] = data["isPublic"]
        return data

class DeepfakeScanRequest(BaseModel):
    filename: str = Field(..., max_length=512)
    filetype: Optional[str] = "audio/wav"
    filesize: Optional[int] = 0

class RansomwareScanRequest(BaseModel):
    commands: str = Field(..., min_length=1, max_length=10000, description="Script or command string to test for shadow copy deletion")

    @model_validator(mode='before')
    @classmethod
    def normalize_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "scenario" in data and "commands" not in data:
                data["commands"] = data["scenario"]
        return data

class WebsiteScanRequest(BaseModel):
    domain_or_url: str = Field(..., min_length=2, max_length=2048, description="Website domain or full URL")

    @model_validator(mode='before')
    @classmethod
    def normalize_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "url" in data and "domain_or_url" not in data:
                data["domain_or_url"] = data["url"]
        return data

class CallScanRequest(BaseModel):
    phone_number: str = Field(..., max_length=64, description="Caller phone number")
    transcript: str = Field(..., min_length=1, max_length=10000, description="Call claims / spoken transcript")

    @model_validator(mode='before')
    @classmethod
    def normalize_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "phoneNumber" in data and "phone_number" not in data:
                data["phone_number"] = data["phoneNumber"]
        return data

class CyberbullyingScanRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Text to analyze for harassment and toxicity")

class AssistantMessage(BaseModel):
    role: str
    content: str

class AssistantChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    history: Optional[List[AssistantMessage]] = []

class AssistantResponse(BaseModel):
    reply: str
    response: Optional[str] = None
    suggestedActions: List[str] = []
    relevantTool: Optional[str] = None
    threatLevel: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str
    uptime_seconds: float
    environment: str
