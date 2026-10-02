// ============================================================
// SafeGuard AI — Email Analyzer (Demo Engine)
// ============================================================

import { AnalysisResult, ThreatIndicator } from '@/types';
import { getRiskLevel } from '@/lib/constants';

const SUSPICIOUS_SENDER_DOMAINS = ['.tk', '.ml', '.ga', '.cf', '.xyz', '.top', '.club', '.buzz', '.ru', '.cn'];
const LEGITIMATE_DOMAINS = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'protonmail.com', 'icloud.com', 'amazon.com', 'google.com', 'microsoft.com', 'apple.com', 'facebook.com', 'paypal.com', 'sbi.co.in', 'hdfcbank.com', 'icicibank.com'];
const URGENCY_SUBJECTS = ['urgent', 'immediate', 'action required', 'verify', 'suspended', 'blocked', 'unauthorized', 'security alert', 'account compromised', 'password expired', 'final notice', 'last warning'];
const CREDENTIAL_WORDS = ['password', 'login', 'credential', 'verify your', 'confirm your identity', 'update your account', 'click here to', 'sign in', 'log in', 'reset your'];

export function analyzeEmail(senderEmail: string, subject: string, body: string): AnalysisResult {
  const senderDomain = senderEmail.split('@')[1]?.toLowerCase() || '';
  const subjectLower = subject.toLowerCase();
  const bodyLower = body.toLowerCase();
  const fullText = `${subject} ${body}`;

  // Checks
  const isSuspiciousDomain = SUSPICIOUS_SENDER_DOMAINS.some(d => senderDomain.endsWith(d));
  const isLegitDomain = LEGITIMATE_DOMAINS.some(d => senderDomain === d);
  const hasUrgentSubject = URGENCY_SUBJECTS.some(u => subjectLower.includes(u));
  const hasCredentialLanguage = CREDENTIAL_WORDS.some(c => bodyLower.includes(c));
  const domainMismatch = (() => {
    const brandMentions = ['amazon', 'google', 'microsoft', 'paypal', 'sbi', 'hdfc', 'icici', 'flipkart', 'netflix'].filter(b => fullText.toLowerCase().includes(b));
    if (brandMentions.length > 0 && !brandMentions.some(b => senderDomain.includes(b))) return true;
    return false;
  })();
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const bodyUrls = body.match(urlPattern) || [];
  const suspiciousUrls = bodyUrls.filter(u => {
    const domain = (() => { try { return new URL(u).hostname; } catch { return u; } })();
    return SUSPICIOUS_SENDER_DOMAINS.some(d => domain.endsWith(d)) || domain.includes('-') || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(domain);
  });
  const hasSpoofingIndicators = senderEmail.includes('+') || senderDomain.includes('-') || /\d{3,}/.test(senderDomain);
  const mentionsAttachments = bodyLower.includes('attachment') || bodyLower.includes('attached') || bodyLower.includes('download');

  // Calculate score
  let score = 0;
  if (isSuspiciousDomain) score += 20;
  if (hasUrgentSubject) score += 15;
  if (hasCredentialLanguage) score += 15;
  if (domainMismatch) score += 25;
  if (suspiciousUrls.length > 0) score += 15;
  if (hasSpoofingIndicators) score += 10;
  if (mentionsAttachments && !isLegitDomain) score += 10;
  if (isLegitDomain) score = Math.max(0, score - 30);

  score = Math.min(100, Math.max(0, score));
  const riskLevel = getRiskLevel(score);

  const indicators: ThreatIndicator[] = [
    { id: 'sender', label: 'Sender Authenticity', description: isSuspiciousDomain ? `Sender domain "${senderDomain}" uses a suspicious TLD` : isLegitDomain ? `Sender domain "${senderDomain}" is a known legitimate service` : `Sender domain "${senderDomain}" is unverified`, severity: isSuspiciousDomain ? 'danger' : 'info', detected: isSuspiciousDomain },
    { id: 'domain-mismatch', label: 'Domain Mismatch', description: domainMismatch ? 'Email claims to be from a brand but sender domain doesn\'t match' : 'No domain mismatch detected', severity: 'danger', detected: domainMismatch },
    { id: 'spoofing', label: 'Spoofing Indicators', description: hasSpoofingIndicators ? 'Sender email shows signs of spoofing' : 'No spoofing indicators detected', severity: 'warning', detected: hasSpoofingIndicators },
    { id: 'urgency', label: 'Urgent Subject Line', description: hasUrgentSubject ? `Subject contains urgency language` : 'Subject line is normal', severity: 'warning', detected: hasUrgentSubject },
    { id: 'credentials', label: 'Credential Harvesting', description: hasCredentialLanguage ? 'Email body contains language requesting login credentials or account verification' : 'No credential harvesting language detected', severity: 'danger', detected: hasCredentialLanguage },
    { id: 'links', label: 'Malicious Links', description: suspiciousUrls.length > 0 ? `Contains ${suspiciousUrls.length} suspicious link(s)` : bodyUrls.length > 0 ? `Contains ${bodyUrls.length} link(s) that appear normal` : 'No links detected', severity: suspiciousUrls.length > 0 ? 'danger' : 'info', detected: suspiciousUrls.length > 0 },
    { id: 'attachments', label: 'Suspicious Attachments', description: mentionsAttachments ? 'Email references attachments which could contain malware' : 'No attachment references detected', severity: 'warning', detected: mentionsAttachments && !isLegitDomain },
    { id: 'brand', label: 'Brand Impersonation', description: domainMismatch ? 'Email content impersonates a known brand but originates from an unrelated domain' : 'No brand impersonation detected', severity: 'danger', detected: domainMismatch },
  ];

  let threatCategory: AnalysisResult['threatCategory'] = 'safe';
  let threatLabel = 'Safe';
  if (score > 75) {
    if (domainMismatch) { threatCategory = 'phishing'; threatLabel = 'Phishing Email'; }
    else if (hasCredentialLanguage) { threatCategory = 'credential-harvesting'; threatLabel = 'Credential Harvesting'; }
    else { threatCategory = 'phishing'; threatLabel = 'Suspicious Email'; }
  } else if (score > 50) {
    threatCategory = 'phishing'; threatLabel = 'Potential Phishing';
  } else if (score > 20) {
    threatCategory = 'safe'; threatLabel = 'Low Risk';
  }

  const detectedIndicators = indicators.filter(i => i.detected);
  const technicalExplanation = detectedIndicators.length > 0
    ? `Email analysis identified ${detectedIndicators.length} suspicious indicators. Sender: "${senderEmail}" (${isSuspiciousDomain ? 'suspicious domain' : isLegitDomain ? 'legitimate domain' : 'unverified domain'}). ${domainMismatch ? 'Domain mismatch detected — email content references a brand not matching the sender domain.' : ''} ${hasCredentialLanguage ? 'Email contains credential harvesting language.' : ''} ${suspiciousUrls.length > 0 ? `Found ${suspiciousUrls.length} suspicious URL(s).` : ''}`
    : `Email analysis found no significant suspicious indicators. Sender "${senderEmail}" appears legitimate.`;

  const simpleExplanation = score > 75
    ? `⚠️ This email looks like a scam. ${domainMismatch ? 'It claims to be from a well-known company, but the sender\'s email address doesn\'t match that company.' : ''} ${hasCredentialLanguage ? 'It\'s asking for your password or account details — real companies never ask for this via email.' : ''} ${hasUrgentSubject ? 'The subject line tries to scare you into acting quickly.' : ''} Don't click any links or download attachments from this email.`
    : score > 50
    ? `⚠️ This email has some suspicious elements. Be cautious and verify the sender before taking any action.`
    : score > 20
    ? `This email has minor risk indicators but appears mostly safe. Always verify unexpected requests.`
    : `✅ This email appears safe. The sender and content look legitimate.`;

  const recommendedAction = score > 75
    ? 'Do not click any links, download attachments, or reply to this email. Mark it as spam/phishing in your email client. If it claims to be from a company, contact them directly through official channels.'
    : score > 50
    ? 'Verify the sender through official channels before taking any action. Do not click links without verification.'
    : score > 20
    ? 'Exercise normal caution. The email has minor risk indicators.'
    : 'No action required. The email appears safe.';

  return {
    id: `email-${Date.now()}`,
    type: 'email',
    input: `From: ${senderEmail} | Subject: ${subject}`,
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
      senderEmail,
      subject,
      senderAuthenticity: isSuspiciousDomain ? 'Suspicious' : isLegitDomain ? 'Verified' : 'Unverified',
      domainMismatch,
      spoofingIndicators: hasSpoofingIndicators ? ['Unusual sender format'] : [],
      urgencyLevel: hasUrgentSubject ? 'High' : 'Normal',
      suspiciousAttachments: mentionsAttachments && !isLegitDomain,
      maliciousLinks: suspiciousUrls,
      credentialHarvesting: hasCredentialLanguage,
      brandImpersonation: domainMismatch ? 'Detected' : 'None',
    },
    classification: threatLabel,
    explanation: simpleExplanation,
    recommendation: recommendedAction,
    recommendations: [
      recommendedAction,
      'Never open unexpected email attachments or click embedded links',
      'Verify the true sender email header and domain before responding'
    ],
    entities: [senderDomain, ...(suspiciousUrls.length > 0 ? ['Suspicious URL detected'] : [])],
  };
}
