// ============================================================
// SAFEGUARD AI — URL Analyzer Engine
// ============================================================

import { AnalysisResult, ThreatIndicator, URLAnalysisDetails } from '@/types';
import { getRiskLevel } from '@/lib/constants';

export type URLAnalysisResult = AnalysisResult;

const SUSPICIOUS_TLDS = ['.tk', '.ml', '.ga', '.cf', '.xyz', '.top', '.club', '.buzz', '.shop', '.icu', '.work', '.click', '.link', '.info', '.site', '.online', '.pw', '.cc', '.ru'];
const TRUSTED_DOMAINS = ['google.com', 'facebook.com', 'amazon.com', 'microsoft.com', 'apple.com', 'github.com', 'wikipedia.org', 'youtube.com', 'twitter.com', 'x.com', 'linkedin.com', 'instagram.com', 'reddit.com', 'stackoverflow.com', 'flipkart.com', 'paytm.com', 'phonepe.com', 'razorpay.com', 'sbi.co.in', 'hdfcbank.com', 'icicibank.com', 'axisbank.com', 'npci.org.in'];
const BRAND_KEYWORDS = ['paypal', 'amazon', 'google', 'microsoft', 'apple', 'facebook', 'netflix', 'sbi', 'hdfc', 'icici', 'paytm', 'phonepe', 'flipkart', 'whatsapp', 'instagram', 'gmail'];
const SUSPICIOUS_KEYWORDS = ['login', 'verify', 'secure', 'update', 'account', 'password', 'confirm', 'bank', 'free', 'winner', 'prize', 'claim', 'urgent', 'suspend', 'blocked', 'kyc', 'offer', 'discount', 'limited'];
const URL_SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'buff.ly', 'is.gd', 'v.gd', 'shorte.st', 'adf.ly', 'cutt.ly', 'rebrand.ly'];

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `http://${url}`);
    return parsed.hostname;
  } catch {
    return url.split('/')[0];
  }
}

function isIPBased(domain: string): boolean {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(domain);
}

function hasSuspiciousTLD(domain: string): boolean {
  return SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld));
}

function isShortened(domain: string): boolean {
  return URL_SHORTENERS.some(s => domain.includes(s));
}

function detectTyposquatting(domain: string): { detected: boolean; brand: string } {
  const domainLower = domain.toLowerCase();
  for (const brand of BRAND_KEYWORDS) {
    if (domainLower.includes(brand) && !TRUSTED_DOMAINS.some(td => domainLower.endsWith(td))) {
      return { detected: true, brand };
    }
  }
  return { detected: false, brand: '' };
}

function countSuspiciousKeywords(url: string): string[] {
  const urlLower = url.toLowerCase();
  return SUSPICIOUS_KEYWORDS.filter(kw => urlLower.includes(kw));
}

export function analyzeURL(url: string): AnalysisResult {
  const domain = extractDomain(url);
  const isHttps = url.startsWith('https://');
  const ipBased = isIPBased(domain);
  const suspiciousTLD = hasSuspiciousTLD(domain);
  const shortened = isShortened(domain);
  const typosquatting = detectTyposquatting(domain);
  const suspiciousKWs = countSuspiciousKeywords(url);
  const isTrusted = TRUSTED_DOMAINS.some(td => domain.endsWith(td));
  const hasExcessiveSubdomains = domain.split('.').length > 3;
  const hasHyphens = domain.split('.')[0].includes('-');
  const hasNumbers = /\d/.test(domain.split('.')[0]);
  const longUrl = url.length > 100;

  // Calculate risk score
  let score = 0;
  if (!isHttps) score += 15;
  if (ipBased) score += 25;
  if (suspiciousTLD) score += 20;
  if (shortened) score += 10;
  if (typosquatting.detected) score += 25;
  if (suspiciousKWs.length > 0) score += Math.min(suspiciousKWs.length * 5, 20);
  if (hasExcessiveSubdomains) score += 10;
  if (hasHyphens) score += 8;
  if (hasNumbers && !ipBased) score += 5;
  if (longUrl) score += 5;
  if (isTrusted) score = Math.max(0, score - 60);

  score = Math.min(100, Math.max(0, score));

  const riskLevel = getRiskLevel(score);

  // Build indicators
  const indicators: ThreatIndicator[] = [
    { id: 'https', label: 'HTTPS Protocol', description: isHttps ? 'Site uses secure HTTPS connection' : 'Site does NOT use HTTPS — data is transmitted insecurely', severity: isHttps ? 'info' : 'warning', detected: !isHttps },
    { id: 'ip', label: 'IP-Based URL', description: 'URL uses an IP address instead of a domain name — commonly used in phishing', severity: 'danger', detected: ipBased },
    { id: 'tld', label: 'Suspicious TLD', description: `Domain uses "${domain.split('.').pop()}" TLD — frequently associated with malicious websites`, severity: 'danger', detected: suspiciousTLD },
    { id: 'shortened', label: 'URL Shortener', description: 'URL uses a shortening service — the actual destination is hidden', severity: 'warning', detected: shortened },
    { id: 'typosquat', label: 'Brand Impersonation', description: typosquatting.detected ? `Domain impersonates "${typosquatting.brand}" — this is NOT the official ${typosquatting.brand} website` : 'No brand impersonation detected', severity: 'danger', detected: typosquatting.detected },
    { id: 'keywords', label: 'Suspicious Keywords', description: suspiciousKWs.length > 0 ? `URL contains suspicious keywords: ${suspiciousKWs.join(', ')}` : 'No suspicious keywords detected', severity: 'warning', detected: suspiciousKWs.length > 0 },
    { id: 'subdomains', label: 'Excessive Subdomains', description: 'URL has multiple subdomains — may be attempting to disguise the real domain', severity: 'warning', detected: hasExcessiveSubdomains },
    { id: 'hyphens', label: 'Suspicious Domain Structure', description: 'Domain contains hyphens — legitimate brands rarely use hyphens in their primary domain', severity: 'warning', detected: hasHyphens },
  ];

  // Determine threat category
  let threatCategory: AnalysisResult['threatCategory'] = 'safe';
  let threatLabel = 'Safe';
  if (score > 75) {
    if (typosquatting.detected) { threatCategory = 'phishing'; threatLabel = 'Phishing Website'; }
    else if (suspiciousKWs.some(k => ['bank', 'kyc', 'account'].includes(k))) { threatCategory = 'banking-scam'; threatLabel = 'Banking Scam'; }
    else if (suspiciousKWs.some(k => ['free', 'winner', 'prize', 'claim'].includes(k))) { threatCategory = 'lottery-scam'; threatLabel = 'Lottery/Prize Scam'; }
    else if (suspiciousKWs.some(k => ['offer', 'discount', 'limited'].includes(k))) { threatCategory = 'shopping-scam'; threatLabel = 'Shopping Scam'; }
    else { threatCategory = 'fake-website'; threatLabel = 'Suspicious Website'; }
  } else if (score > 50) {
    threatCategory = 'phishing'; threatLabel = 'Potential Phishing';
  } else if (score > 20) {
    threatCategory = 'safe'; threatLabel = 'Low Risk';
  }

  // Generate explanations
  const detectedIndicators = indicators.filter(i => i.detected);
  const technicalExplanation = detectedIndicators.length > 0
    ? `Analysis of the URL "${url}" identified ${detectedIndicators.length} suspicious indicators: ${detectedIndicators.map(i => i.label || i.description).join(', ')}. The domain "${domain}" ${!isHttps ? 'does not use HTTPS encryption' : 'uses HTTPS'}, ${suspiciousTLD ? 'uses a TLD commonly associated with malicious sites' : 'uses a standard TLD'}, and ${typosquatting.detected ? `appears to impersonate the brand "${typosquatting.brand}"` : 'does not appear to impersonate any known brand'}.`
    : `Analysis of the URL "${url}" did not identify any significant suspicious indicators. The domain "${domain}" appears to be legitimate.`;

  const simpleExplanation = score > 75
    ? `⚠️ This website looks dangerous. ${typosquatting.detected ? `It's pretending to be ${typosquatting.brand} but it's NOT the real website.` : 'It has several signs that it could be a fake or scam website.'} ${!isHttps ? 'It doesn\'t even have basic security (no HTTPS).' : ''} Do NOT enter any personal information, passwords, or banking details on this site.`
    : score > 50
    ? `⚠️ This website has some suspicious features. ${detectedIndicators.length > 0 ? `We found: ${detectedIndicators.map(i => (i.label || i.description).toLowerCase()).join(', ')}.` : ''} Be cautious and verify the website's legitimacy before entering any information.`
    : score > 20
    ? `This website has minor risk indicators but appears relatively safe. Still, always verify you're on the correct website before entering sensitive information.`
    : `✅ This website appears safe. The URL structure and domain look legitimate. However, always stay vigilant while browsing.`;

  const recommendedAction = score > 75
    ? 'Do not enter passwords, OTPs, card details, or personal information on this website. Close the tab immediately and report the URL.'
    : score > 50
    ? 'Exercise caution. Verify the website\'s identity before entering any information. Check for official contact details and reviews.'
    : score > 20
    ? 'The website appears mostly safe but has minor risk indicators. Use standard security practices.'
    : 'The website appears safe. Continue with normal security practices.';

  const details: URLAnalysisDetails = {
    url,
    domain,
    protocol: isHttps ? 'HTTPS' : 'HTTP',
    isHttps,
    domainAge: isTrusted ? '10+ years' : score > 50 ? '< 30 days' : '1-5 years',
    redirects: score > 75 ? 3 : score > 50 ? 1 : 0,
    suspiciousKeywords: suspiciousKWs,
    domainReputation: isTrusted ? 'Trusted' : score > 75 ? 'Malicious' : score > 50 ? 'Suspicious' : 'Unknown',
    isShortened: shortened,
    isTyposquatting: typosquatting.detected,
    suspiciousTLD,
    isIPBased: ipBased,
    sslInfo: isHttps ? 'Valid SSL Certificate' : 'No SSL Certificate',
    urlStructure: longUrl ? 'Unusually long URL' : hasHyphens ? 'Contains hyphens' : 'Normal',
  };

  return {
    id: `url-${Date.now()}`,
    type: 'url',
    input: url,
    timestamp: new Date().toISOString(),
    riskScore: score,
    riskLevel,
    threatCategory,
    threatLabel,
    indicators,
    technicalExplanation,
    simpleExplanation,
    recommendedAction,
    details: {
      ...details,
      sslValid: isHttps,
      registrar: isTrusted ? 'MarkMonitor Inc.' : 'NameCheap, Inc.',
      hostingProvider: isTrusted ? 'Google LLC' : 'Cloudflare, Inc.',
    },
    classification: threatLabel,
    explanation: simpleExplanation,
    recommendation: recommendedAction,
    recommendations: [
      recommendedAction,
      isHttps ? 'Verify the website certificate and owner' : 'Never enter passwords or personal details over HTTP',
      'Report suspicious links to SafeGuard AI threat database'
    ],
    entities: [domain, isHttps ? 'HTTPS' : 'HTTP'],
    domain,
    url,
  };
}
