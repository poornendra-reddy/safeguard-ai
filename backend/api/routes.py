import time
import datetime
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends, Request
from typing import Optional, List

from backend.core.config import settings
from backend.schemas.analysis import (
    URLScanRequest, MessageScanRequest, EmailScanRequest, QRScanRequest,
    PasswordScanRequest, FileScanRequest, BrowserScanRequest, NetworkScanRequest,
    DeepfakeScanRequest, RansomwareScanRequest, WebsiteScanRequest, CallScanRequest,
    CyberbullyingScanRequest, AssistantChatRequest, AssistantResponse,
    AnalysisResponse, HealthResponse
)
from backend.services.url_service import analyze_url_service
from backend.services.message_service import analyze_message_service
from backend.services.email_service import analyze_email_service
from backend.services.image_service import analyze_image_evidence_service
from backend.services.qr_service import analyze_qr_service
from backend.services.password_service import analyze_password_service
from backend.services.file_service import analyze_file_metadata_service
from backend.services.browser_service import analyze_browser_manifest_service
from backend.services.network_service import analyze_network_risk_service
from backend.services.deepfake_service import analyze_deepfake_media_service
from backend.services.ransomware_service import analyze_ransomware_pattern_service
from backend.services.website_service import analyze_website_service
from backend.services.call_service import analyze_call_service
from backend.services.cyberbullying_service import analyze_cyberbullying_service
from backend.services.assistant_service import generate_assistant_response
from backend.services.history_service import history_store

router = APIRouter()
START_TIME = time.time()

# ----------------- System & Health -----------------

@router.get("/health", response_model=HealthResponse, tags=["System"])
async def get_health():
    return HealthResponse(
        status="healthy",
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        timestamp=datetime.datetime.utcnow().isoformat() + "Z",
        uptime_seconds=round(time.time() - START_TIME, 2),
        environment=settings.ENVIRONMENT
    )

# ----------------- Threat Scanners -----------------

@router.post("/scan/url", response_model=AnalysisResponse, tags=["Scanners"])
async def scan_url(req: URLScanRequest, request: Request):
    client = getattr(request.app.state, "http_client", None)
    res = await analyze_url_service(req.url, client=client)
    history_store.add(res)
    return res

@router.post("/scan/message", response_model=AnalysisResponse, tags=["Scanners"])
async def scan_message(req: MessageScanRequest):
    res = analyze_message_service(req.message, channel=req.channel or "SMS")
    history_store.add(res)
    return res

@router.post("/scan/email", response_model=AnalysisResponse, tags=["Scanners"])
async def scan_email(req: EmailScanRequest):
    res = analyze_email_service(req.sender, req.subject, req.body, links=req.links)
    history_store.add(res)
    return res

@router.post("/scan/image", response_model=AnalysisResponse, tags=["Scanners"])
async def scan_image(
    file: Optional[UploadFile] = File(None),
    extracted_text: Optional[str] = Form(None)
):
    if not file:
        raise HTTPException(status_code=400, detail="Image file is required for evidence upload.")
    
    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File size exceeds maximum permitted limit (10MB).")

    res = analyze_image_evidence_service(file.filename or "evidence.png", contents, provided_text=extracted_text)
    history_store.add(res)
    return res

@router.post("/scan/qr", response_model=AnalysisResponse, tags=["Scanners"])
async def scan_qr(req: QRScanRequest):
    res = await analyze_qr_service(req.payload)
    history_store.add(res)
    return res

@router.post("/scan/password", response_model=AnalysisResponse, tags=["Scanners"])
async def scan_password(req: PasswordScanRequest):
    res = analyze_password_service(req.password)
    history_store.add(res)
    return res

@router.post("/scan/file", response_model=AnalysisResponse, tags=["Scanners"])
async def scan_file_metadata(req: FileScanRequest):
    res = analyze_file_metadata_service(req.filename, filesize=req.filesize or 0, mimetype=req.mimetype or "")
    history_store.add(res)
    return res

@router.post("/scan/browser", response_model=AnalysisResponse, tags=["Scanners"])
async def scan_browser(req: BrowserScanRequest):
    res = analyze_browser_manifest_service(req.manifest)
    history_store.add(res)
    return res

@router.post("/scan/network", response_model=AnalysisResponse, tags=["Scanners"])
async def scan_network(req: NetworkScanRequest):
    res = analyze_network_risk_service(req.ssid, auth_type=req.auth_type, is_public=req.is_public or False)
    history_store.add(res)
    return res

@router.post("/scan/deepfake", response_model=AnalysisResponse, tags=["Scanners"])
async def scan_deepfake(req: DeepfakeScanRequest):
    res = analyze_deepfake_media_service(req.filename, filetype=req.filetype or "audio/wav", filesize=req.filesize or 0)
    history_store.add(res)
    return res

@router.post("/scan/ransomware", response_model=AnalysisResponse, tags=["Scanners"])
async def scan_ransomware(req: RansomwareScanRequest):
    res = analyze_ransomware_pattern_service(req.commands)
    history_store.add(res)
    return res

@router.post("/scan/website", response_model=AnalysisResponse, tags=["Scanners"])
async def scan_website(req: WebsiteScanRequest, request: Request):
    client = getattr(request.app.state, "http_client", None)
    res = await analyze_website_service(req.domain_or_url, client=client)
    history_store.add(res)
    return res

@router.post("/scan/call", response_model=AnalysisResponse, tags=["Scanners"])
async def scan_call(req: CallScanRequest):
    res = analyze_call_service(req.phone_number, req.transcript)
    history_store.add(res)
    return res

@router.post("/scan/cyberbullying", response_model=AnalysisResponse, tags=["Scanners"])
async def scan_cyberbullying(req: CyberbullyingScanRequest):
    res = analyze_cyberbullying_service(req.text)
    history_store.add(res)
    return res

@router.post("/assistant", response_model=AssistantResponse, tags=["Assistant"])
@router.post("/chat/assistant", response_model=AssistantResponse, tags=["Assistant"])
async def chat_assistant(req: AssistantChatRequest):
    return generate_assistant_response(req.message, history=req.history)

@router.get("/history", response_model=List[AnalysisResponse], tags=["Audit"])
async def get_history(filter: Optional[str] = None, limit: int = 50):
    return history_store.get_all(filter_type=filter, limit=limit)

@router.delete("/history", tags=["Audit"])
async def clear_history():
    history_store.clear()
    return {"success": True, "message": "Threat audit history cleared"}
