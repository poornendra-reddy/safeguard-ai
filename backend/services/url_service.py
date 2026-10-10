import re
import datetime
import urllib.parse
from typing import List, Dict, Any, Optional
import httpx

from backend.core.security import validate_url_for_ssrf, FORBIDDEN_HOSTNAMES
from backend.schemas.analysis import AnalysisResponse, ThreatIndicator

SUSPICIOUS_TLDS = {'.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.buzz', '.icu', '.club', '.shop', '.work', '.click', '.cc', '.ru', '.cn', '.gq'}
KNOWN_SHORTENERS = {'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'adf.ly', 'bit.do'}
LEGIT_BRANDS = ['sbi', 'hdfc', 'icici', 'axis', 'paytm', 'phonepe', 'gpay', 'amazon', 'flipkart', 'google', 'apple', 'microsoft', 'paypal', 'netflix', 'facebook', 'instagram', 'whatsapp']
PHISHING_KEYWORDS = ['login', 'signin', 'verify', 'update', 'account', 'secure', 'banking', 'wallet', 'kyc', 'pan', 'aadhaar', 'claim', 'bonus', 'free']

async def analyze_url_service(url_str: str, client: Optional[httpx.AsyncClient] = None) -> AnalysisResponse:
    clean_url = url_str.strip()
    if not clean_url.startswith(('http://', 'https://')):
        clean_url = 'https://' + clean_url

    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    scan_id = f"SG-URL-{int(datetime.datetime.utcnow().timestamp())}"

    # 1. SSRF Safety Check
    is_safe, ssrf_error, resolved_ip = validate_url_for_ssrf(clean_url)
    if not is_safe:
        return AnalysisResponse(
            id=scan_id,
            type="url",
            input=clean_url,
            timestamp=timestamp,
            riskScore=95,
            riskLevel="high",
            threatCategory="phishing",
            threatLabel="Restricted / SSRF Target Blocked",
            classification="High Risk - Blocked",
            indicators=[
                ThreatIndicator(
                    id="ind-ssrf",
                    label="SSRF & Private Network Target",
                    description=ssrf_error or "URL points to a restricted internal or link-local address.",
                    severity="danger"
                )
            ],
            technicalExplanation=f"Security engine intercepted internal address request: {ssrf_error}",
            simpleExplanation="⚠️ This link attempts to access private system addresses and is blocked for your protection.",
            recommendedAction="Do not navigate to this URL.",
            recommendations=["Immediately discard link", "Never open internal IP links from external senders"],
            entities=["Restricted Network Target"],
            details={"ssrf_blocked": True, "reason": ssrf_error}
        )

    score = 5
    indicators: List[ThreatIndicator] = []
    entities: List[str] = []
    recommendations: List[str] = []

    parsed = urllib.parse.urlparse(clean_url)
    hostname = (parsed.hostname or "").lower()
    path_and_query = (parsed.path + "?" + parsed.query).lower()

    # 2. Protocol Check (HTTPS)
    if not clean_url.startswith("https://"):
        score += 25
        indicators.append(ThreatIndicator(
            id="ind-http",
            label="Insecure Protocol (HTTP)",
            description="The connection lacks SSL/TLS encryption. Passwords and credentials can be intercepted in transit.",
            severity="warning"
        ))
        recommendations.append("Never enter confidential details or passwords over unencrypted HTTP connections.")

    # 3. Raw IP Check
    if re.search(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", hostname):
        score += 40
        indicators.append(ThreatIndicator(
            id="ind-ip",
            label="Direct IP Hostname",
            description="Uses raw numerical IP instead of a registered domain to bypass reputation filters.",
            severity="danger"
        ))
        entities.append(f"Host IP: {hostname}")

    # 4. Suspicious TLD
    for tld in SUSPICIOUS_TLDS:
        if hostname.endswith(tld):
            score += 30
            indicators.append(ThreatIndicator(
                id=f"ind-tld-{tld}",
                label=f"High-Risk TLD ({tld})",
                description=f"Domain registered under '{tld}', an inexpensive top-level domain frequently weaponized in cyber attacks.",
                severity="danger"
            ))
            entities.append(f"TLD: {tld}")
            break

    # 5. URL Shortener Detection
    if hostname in KNOWN_SHORTENERS:
        score += 20
        indicators.append(ThreatIndicator(
            id="ind-shortener",
            label="URL Shortener Detected",
            description=f"Destination is masked using '{hostname}', concealing the true target server.",
            severity="warning"
        ))
        recommendations.append("Expand shortened links with a safe preview tool before proceeding.")

    # 6. Brand Spoofing / Impersonation
    for brand in LEGIT_BRANDS:
        if brand in hostname:
            is_legit_domain = (
                hostname == f"{brand}.com" or
                hostname.endswith(f".{brand}.com") or
                hostname == f"{brand}.in" or
                hostname.endswith(f".{brand}.in") or
                hostname == f"{brand}.co.in" or
                hostname.endswith(f".{brand}.co.in") or
                hostname == f"{brand}.org" or
                hostname.endswith(f".{brand}.org")
            )
            if not is_legit_domain:
                score += 40
                indicators.append(ThreatIndicator(
                    id=f"ind-brand-{brand}",
                    label=f"Brand Impersonation ({brand.upper()})",
                    description=f"The domain incorporates '{brand}' into an unauthorized hostname pattern, typical of credential phishing.",
                    severity="danger"
                ))
                entities.append(f"Spoofed Brand: {brand.upper()}")
                recommendations.append(f"Always verify official {brand.upper()} portals directly via bookmark or official app.")
                break

    # 7. Subdomain Stacking Check
    subdomain_parts = hostname.split('.')
    if len(subdomain_parts) >= 4 and not hostname in KNOWN_SHORTENERS:
        score += 20
        indicators.append(ThreatIndicator(
            id="ind-subdomains",
            label="Excessive Subdomain Stacking",
            description=f"Hostname contains {len(subdomain_parts)} domain segments, often used to disguise fake portals.",
            severity="warning"
        ))

    # 8. Phishing Keywords in Path/Query
    flagged_keywords = [kw for kw in PHISHING_KEYWORDS if kw in path_and_query or kw in hostname]
    if flagged_keywords:
        score += min(len(flagged_keywords) * 10, 25)
        indicators.append(ThreatIndicator(
            id="ind-keywords",
            label="Deceptive Action Keywords",
            description=f"URL contains sensitive credential collection triggers: {', '.join(flagged_keywords[:4])}.",
            severity="warning"
        ))
        entities.extend([f"Keyword: {k}" for k in flagged_keywords[:3]])

    # 9. Live HTTP Redirect Probe (bounded 3.0s timeout)
    redirect_chain = []
    if client and is_safe and not hostname in FORBIDDEN_HOSTNAMES:
        try:
            resp = await client.head(clean_url, follow_redirects=True, timeout=3.0)
            if str(resp.url) != clean_url:
                redirect_chain.append(str(resp.url))
                # Check final destination for SSRF
                final_safe, _, _ = validate_url_for_ssrf(str(resp.url))
                if not final_safe:
                    score += 35
                    indicators.append(ThreatIndicator(
                        id="ind-redirect-ssrf",
                        label="Malicious Redirection Chain",
                        description="Initial URL redirects to a restricted or suspicious destination.",
                        severity="danger"
                    ))
        except Exception:
            # Network probe timeout or dead host; continue with static heuristics
            pass

    # Risk level classification
    score = min(max(score, 5), 98)
    if score >= 75:
        risk_level = "high"
        threat_category = "phishing"
        threat_label = "Phishing Website"
        classification = "High Risk - Phishing"
        simple_explanation = "⚠️ This website contains characteristics commonly associated with phishing and credential theft."
        technical_explanation = f"Heuristic inspection flagged {len(indicators)} security anomalies across protocol, TLD reputation, and lexical brand spoofing. Cumulative threat score evaluates to {score}/100."
        recommended_action = "Do not enter passwords, OTPs, card details, or personal information on this page."
        recommendations.append("Close the browser tab immediately and report this URL to your security team or national cyber helpline.")
    elif score >= 50:
        risk_level = "suspicious"
        threat_category = "fake-website"
        threat_label = "Suspicious Link"
        classification = "Suspicious - Potential Scam"
        simple_explanation = "⚠️ This website exhibits unusual structural patterns and lacks verified trust markers."
        technical_explanation = f"Multiple moderate risk factors detected: {', '.join(i.label for i in indicators[:3])}. Risk score: {score}/100."
        recommended_action = "Exercise caution. Do not perform financial transactions or login actions."
        recommendations.append("Navigate to the service directly via search or verified application.")
    elif score >= 25:
        risk_level = "low"
        threat_category = "safe"
        threat_label = "Low Risk Link"
        classification = "Low Risk"
        simple_explanation = "ℹ️ This link has minor irregularities but does not demonstrate active phishing vectors."
        technical_explanation = f"Minor warnings identified with a baseline score of {score}/100."
        recommended_action = "Verify site certificate before submitting sensitive data."
        recommendations.append("Ensure the browser address bar displays the official domain.")
    else:
        risk_level = "safe"
        threat_category = "safe"
        threat_label = "Legitimate Website"
        classification = "Safe / Trusted"
        simple_explanation = "✅ This website appears legitimate and uses standard HTTPS security protocols."
        technical_explanation = f"No deceptive patterns, brand hijacking, or suspicious TLDs identified. Calculated safety score: {score}/100."
        recommended_action = "Standard safe browsing practices apply."
        recommendations.append("Regularly update your browser and keep password protection enabled.")

    return AnalysisResponse(
        id=scan_id,
        type="url",
        input=clean_url,
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
            "domain": hostname,
            "isHttps": clean_url.startswith("https://"),
            "redirects": redirect_chain,
            "resolvedIp": resolved_ip
        },
        domain=hostname,
        url=clean_url
    )
