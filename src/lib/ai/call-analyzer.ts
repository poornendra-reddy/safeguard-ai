// ============================================================
// SafeGuard AI — Spam Call & Vishing Threat Analyzer Engine
// ============================================================

import { AnalysisResult, ThreatIndicator } from '@/types';
import { getRiskLevel } from '@/lib/constants';

export function analyzeCall(phoneNumber: string, transcriptOrClaim: string = ''): AnalysisResult {
  const phone = phoneNumber.trim();
  const text = transcriptOrClaim.trim().toLowerCase();

  const indicators: ThreatIndicator[] = [];
  let score = 5; // Base score for unknown callers

  // 1. Phone number format & suspicious country code patterns
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  
  const suspiciousPrefixes = ['+88', '+92', '+234', '+254', '+216', '+351', '+60'];
  const isSuspiciousInternational = suspiciousPrefixes.some(p => phone.startsWith(p));
  
  if (isSuspiciousInternational) {
    score += 45;
    indicators.push({
      id: 'call-ind-intl',
      type: 'pattern',
      severity: 'danger',
      description: 'Incoming call from high-risk international country code known for telecommunication frauds & vishing scams.',
    });
  }

  // Virtual / VoIP / Premium Rate / Short Code patterns
  if (/^(1800|1860|140|0900|0901)/.test(cleanPhone)) {
    score += 20;
    indicators.push({
      id: 'call-ind-telemarketer',
      type: 'pattern',
      severity: 'warning',
      description: 'Telemarketing / Robocall prefix detected (140-series or 1800 commercial toll-free series).',
    });
  }

  // 2. High-Risk Scam Keyword & Narrative Analysis
  const digitalArrestKeywords = ['cbi', 'police', 'digital arrest', 'cyber cell', 'customs', 'illegal package', 'drugs', 'passport', 'mumbai police', 'delhi police'];
  const traiSimBlockKeywords = ['trai', 'sim block', 'disconnected in 2 hours', 'service disconnection', 'kyc update', 'trai authority'];
  const bankingKeywords = ['bank manager', 'rbi', 'account block', 'credit card expire', 'share otp', 'pin number', 'cvv', 'zelle', 'paytm kyc'];
  const electricityKeywords = ['electricity bill', 'power disconnect', 'light bill', 'electricity officer'];

  let matchedCategory = 'Spam Call';

  // Digital Arrest / Police Scam Detection
  const foundDigitalArrest = digitalArrestKeywords.filter(k => text.includes(k));
  if (foundDigitalArrest.length > 0) {
    score += 65;
    matchedCategory = 'Digital Arrest Scam';
    indicators.push({
      id: 'call-ind-digital-arrest',
      type: 'keyword',
      severity: 'danger',
      description: `Detected Digital Arrest / Police Impersonation keywords: "${foundDigitalArrest.join(', ')}". Authorities NEVER place people under digital arrest over phone calls.`,
    });
  }

  // TRAI / SIM Disconnection Scam
  const foundSimBlock = traiSimBlockKeywords.filter(k => text.includes(k));
  if (foundSimBlock.length > 0) {
    score += 55;
    matchedCategory = 'TRAI SIM Disconnection Scam';
    indicators.push({
      id: 'call-ind-sim-block',
      type: 'keyword',
      severity: 'danger',
      description: `Detected SIM Block / TRAI threat keywords: "${foundSimBlock.join(', ')}". TRAI never calls individuals threatening SIM disconnection within hours.`,
    });
  }

  // Banking & Financial Vishing Scam
  const foundBanking = bankingKeywords.filter(k => text.includes(k));
  if (foundBanking.length > 0) {
    score += 60;
    matchedCategory = 'Banking Vishing Scam';
    indicators.push({
      id: 'call-ind-banking',
      type: 'keyword',
      severity: 'danger',
      description: `Detected Banking/OTP harvesting keywords: "${foundBanking.join(', ')}". Genuine bank staff will NEVER ask for your OTP, PIN, or CVV over a call.`,
    });
  }

  // Electricity Disconnection Scam
  const foundElectricity = electricityKeywords.filter(k => text.includes(k));
  if (foundElectricity.length > 0) {
    score += 50;
    matchedCategory = 'Electricity Bill Fraud';
    indicators.push({
      id: 'call-ind-electricity',
      type: 'keyword',
      severity: 'danger',
      description: `Detected Electricity Disconnection threats: "${foundElectricity.join(', ')}". Power companies do not disconnect services via instant phone threats.`,
    });
  }

  // Urgency & Fear tactics
  if (text.includes('immediately') || text.includes('2 hours') || text.includes('arrest') || text.includes('press 1') || text.includes('court order')) {
    score += 20;
    indicators.push({
      id: 'call-ind-urgency',
      type: 'nlp',
      severity: 'danger',
      description: 'Psychological urgency / intimidation tactics used to induce panic and compliance.',
    });
  }

  score = Math.min(score, 98);
  if (indicators.length === 0 && score <= 20) {
    score = 10;
  }

  const riskLevel = getRiskLevel(score);

  const threatLabel = score > 75 
    ? matchedCategory
    : score > 50 
    ? 'Suspicious Telemarketing / Spam Call' 
    : 'Unknown Caller / Low Risk';

  const simpleExplanation = score > 50
    ? `⚠️ This phone call appears to be a ${threatLabel}. Scammers use fake phone numbers and impersonate officials (like Police, Bank Officers, or TRAI) to create panic and demand money, OTPs, or personal data.`
    : `✅ No high-risk scam patterns detected for number ${phone}. However, always remain cautious with unknown callers asking for personal details.`;

  const recommendedAction = score > 50
    ? `Do NOT press any keys, do NOT share OTPs or bank details, disconnect immediately, and report the caller on Chakshu portal or Cyber Crime helpline 1930.`
    : `If the caller claims to be from a bank or utility provider, hang up and call the official customer service number listed on their official website.`;

  return {
    id: `call-${Date.now()}`,
    type: 'call',
    input: phone + (transcriptOrClaim ? ` ("${transcriptOrClaim.slice(0, 40)}...")` : ''),
    timestamp: new Date().toISOString(),
    riskScore: score,
    riskLevel,
    threatCategory: score > 50 ? 'vishing' : 'safe',
    threatLabel,
    indicators,
    technicalExplanation: `Analyzed phone number "${phone}" and caller transcript claims. Evaluated international country prefixes, 140 telemarketing series, digital arrest scripts, TRAI disconnection claims, and banking OTP harvesting tactics.`,
    simpleExplanation,
    recommendedAction,
    recommendation: recommendedAction,
    recommendations: [
      recommendedAction,
      'Do NOT press any keys (like "Press 1 to speak with executive")',
      'Never share OTPs, CVV, passwords, or transfer money to safe accounts',
      'Report suspicious spam calls to Chakshu (sancharsaathi.gov.in) or Cyber Helpline 1930'
    ],
    entities: [phone, matchedCategory],
    details: {
      phoneNumber: phone,
      countryCodeCheck: isSuspiciousInternational ? 'High Risk' : 'Normal',
      detectedNarrative: matchedCategory,
      scamIndicatorsCount: indicators.length
    }
  };
}
