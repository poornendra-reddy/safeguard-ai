import datetime
from typing import Optional
import httpx
from backend.schemas.analysis import AnalysisResponse
from backend.services.url_service import analyze_url_service

async def analyze_website_service(domain_or_url: str, client: Optional[httpx.AsyncClient] = None) -> AnalysisResponse:
    url_target = domain_or_url.strip()
    if not url_target.startswith(('http://', 'https://')):
        url_target = 'https://' + url_target

    res = await analyze_url_service(url_target, client=client)
    res.type = "website"
    res.id = f"SG-WEB-{int(datetime.datetime.utcnow().timestamp())}"
    res.threatLabel = f"Website Audit: {res.threatLabel}"
    return res
