// ============================================================
// SafeGuard AI — Message/SMS Analyzer (Demo Engine)
// ============================================================

import { AnalysisResult, ThreatIndicator } from '@/types';
import { getRiskLevel } from '@/lib/constants';

export type MessageAnalysisResult = AnalysisResult;

const URGENCY_WORDS = ['urgent', 'immediately', 'now', 'hurry', 'quick', 'fast', 'asap', 'deadline', 'expire', 'expiring', 'limited time', 'act now', 'within 24 hours', 'within 48 hours', 'last chance', 'final warning', 'account will be', 'permanently', 'suspended', 'blocked', 'closed', 'terminated'];
const REWARD_WORDS = ['congratulations', 'winner', 'won', 'prize', 'reward', 'cashback', 'free', 'gift', 'bonus', 'jackpot', 'lottery', 'selected', 'lucky', 'claim', 'redeem'];
const FINANCIAL_WORDS = ['bank', 'account', 'transfer', 'payment', 'upi', 'otp', 'pin', 'cvv', 'credit card', 'debit card', 'loan', 'emi', 'kyc', 'pan', 'aadhaar', 'refund', 'transaction'];
const PERSONAL_INFO_WORDS = ['password', 'otp', 'pin', 'cvv', 'aadhaar', 'pan card', 'pan number', 'bank account', 'account number', 'ifsc', 'credit card number', 'social security', 'date of birth', 'mother\'s maiden'];
const SOCIAL_ENGINEERING = ['click here', 'click this', 'click below', 'tap here', 'open this', 'visit this', 'verify your', 'confirm your', 'update your', 'validate your', 'secure your', 'protect your'];
const JOB_SCAM_WORDS = ['work from home', 'part time job', 'earn money', 'daily income', 'no experience', 'no interview', 'registration fee', 'joining fee', 'selected for', 'offer letter'];
const URL_PATTERN = /https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(tk|ml|ga|cf|xyz|top|club|buzz|shop|icu|work|click|link)\/?[^\s]*/gi;

function findMatches(text: string, keywords: string[]): string[] {
  const lower = text.toLowerCase();
  return keywords.filter(kw => lower.includes(kw));
}

function extractUrls(text: string): string[] {
  const matches = text.match(URL_PATTERN);
  return matches || [];
}

export function analyzeMessage(message: string, messageType: string = 'SMS'): AnalysisResult {
  const urgencyMatches = findMatches(message, URGENCY_WORDS);
  const rewardMatches = findMatches(message, REWARD_WORDS);
  const financialMatches = findMatches(message, FINANCIAL_WORDS);
  const personalInfoMatches = findMatches(message, PERSONAL_INFO_WORDS);
  const socialEngMatches = findMatches(message, SOCIAL_ENGINEERING);
  const jobScamMatches = findMatches(message, JOB_SCAM_WORDS);
  const urls = extractUrls(message);
  const hasPhoneNumber = /(\+91|91)?\s*\d{10}/.test(message) || /\d{10}/.test(message);
  const hasMoneyMention = /₹\s*[\d,]+|rs\.?\s*[\d,]+|\d+\s*(?:lakh|crore|thousand|rupee)/i.test(message);
  const isAllCaps = message.replace(/[^a-zA-Z]/g, '').length > 10 && message.replace(/[^a-zA-Z]/g, '') === message.replace(/[^a-zA-Z]/g, '').toUpperCase();
  const hasExclamation = (message.match(/!/g) || []).length >= 2;

  // Calculate risk score
  let score = 0;
  score += urgencyMatches.length * 8;
  score += rewardMatches.length * 10;
  score += financialMatches.length * 6;
  score += personalInfoMatches.length * 12;
  score += socialEngMatches.length * 7;
  score += jobScamMatches.length * 9;
  score += urls.length * 8;
  if (hasMoneyMention && rewardMatches.length > 0) score += 15;
  if (isAllCaps) score += 5;
  if (hasExclamation) score += 5;
  if (hasPhoneNumber && urgencyMatches.length > 0) score += 5;

  score = Math.min(100, Math.max(0, score));
  const riskLevel = getRiskLevel(score);

  // Build indicators
  const indicators: ThreatIndicator[] = [
    { id: 'urgency', label: 'Urgency Language', description: urgencyMatches.length > 0 ? `Contains urgency words: "${urgencyMatches.join('", "')}"` : 'No urgency language detected', severity: 'warning', detected: urgencyMatches.length > 0 },
    { id: 'reward', label: 'Fake Reward/Prize', description: rewardMatches.length > 0 ? `Contains reward/prize language: "${rewardMatches.join('", "')}"` : 'No fake reward language detected', severity: 'danger', detected: rewardMatches.length > 0 },
    { id: 'financial', label: 'Financial Manipulation', description: financialMatches.length > 0 ? `References financial terms: "${financialMatches.join('", "')}"` : 'No financial manipulation detected', severity: 'warning', detected: financialMatches.length > 0 },
    { id: 'personal', label: 'Personal Information Request', description: personalInfoMatches.length > 0 ? `Asks for sensitive information: "${personalInfoMatches.join('", "')}"` : 'No personal information requests detected', severity: 'danger', detected: personalInfoMatches.length > 0 },
    { id: 'social', label: 'Social Engineering', description: socialEngMatches.length > 0 ? `Contains social engineering phrases: "${socialEngMatches.join('", "')}"` : 'No social engineering tactics detected', severity: 'warning', detected: socialEngMatches.length > 0 },
    { id: 'links', label: 'Suspicious Links', description: urls.length > 0 ? `Contains ${urls.length} link(s): ${urls.join(', ')}` : 'No links detected in the message', severity: urls.length > 0 ? 'danger' : 'info', detected: urls.length > 0 },
    { id: 'job', label: 'Job Scam Indicators', description: jobScamMatches.length > 0 ? `Contains job scam language: "${jobScamMatches.join('", "')}"` : 'No job scam indicators detected', severity: 'danger', detected: jobScamMatches.length > 0 },
    { id: 'impersonation', label: 'Impersonation Signals', description: hasPhoneNumber && urgencyMatches.length > 0 ? 'Message includes phone number with urgent language — common in impersonation scams' : 'No impersonation signals detected', severity: 'warning', detected: hasPhoneNumber && urgencyMatches.length > 0 },
  ];

  // Determine threat category
  let threatCategory: AnalysisResult['threatCategory'] = 'safe';
  let threatLabel = 'Safe';
  if (score > 75) {
    if (jobScamMatches.length > 0) { threatCategory = 'job-scam'; threatLabel = 'Job Scam'; }
    else if (rewardMatches.length > 0) { threatCategory = 'lottery-scam'; threatLabel = 'Lottery/Prize Scam'; }
    else if (financialMatches.length > 0) { threatCategory = 'banking-scam'; threatLabel = 'Banking Scam'; }
    else { threatCategory = 'smishing'; threatLabel = 'SMS Scam (Smishing)'; }
  } else if (score > 50) {
    threatCategory = 'smishing'; threatLabel = 'Potential Scam';
  } else if (score > 20) {
    threatCategory = 'safe'; threatLabel = 'Low Risk';
  }

  const detectedIndicators = indicators.filter(i => i.detected);
  const technicalExplanation = detectedIndicators.length > 0
    ? `Analysis of the ${messageType} message identified ${detectedIndicators.length} suspicious indicators: ${detectedIndicators.map(i => i.label || i.description).join(', ')}. ${urgencyMatches.length > 0 ? `Urgency language detected (${urgencyMatches.join(', ')}).` : ''} ${rewardMatches.length > 0 ? `Fake reward/prize language detected.` : ''} ${personalInfoMatches.length > 0 ? `The message requests sensitive personal information.` : ''} ${urls.length > 0 ? `Contains ${urls.length} suspicious link(s).` : ''}`
    : `The ${messageType} message does not contain significant suspicious indicators.`;

  const simpleExplanation = score > 75
    ? `⚠️ This message is very likely a scam. ${rewardMatches.length > 0 ? 'It promises a fake reward or prize to trick you.' : ''} ${urgencyMatches.length > 0 ? 'It uses scary or urgent words to pressure you into acting quickly without thinking.' : ''} ${personalInfoMatches.length > 0 ? 'It asks for your personal information like passwords or OTPs, which no legitimate organization would do via message.' : ''} ${urls.length > 0 ? 'It contains a suspicious link that could steal your information.' : ''} Do NOT respond to this message.`
    : score > 50
    ? `⚠️ This message has some suspicious elements. ${detectedIndicators.length > 0 ? `Warning signs include: ${detectedIndicators.map(i => (i.label || i.description).toLowerCase()).join(', ')}.` : ''} Be cautious and don't click any links or share personal information.`
    : score > 20
    ? `This message has minor risk indicators. While it may be legitimate, always be careful with messages from unknown senders.`
    : `✅ This message appears safe. No significant scam indicators were detected.`;

  const recommendedAction = score > 75
    ? 'Do NOT click any links, call any numbers, or respond to this message. Block the sender and report the message as spam. If it claims to be from a bank or company, contact them directly through official channels.'
    : score > 50
    ? 'Be cautious with this message. Do not click links or share personal information. Verify the sender through official channels if it claims to be from a known organization.'
    : score > 20
    ? 'Exercise normal caution. The message has minor risk indicators.'
    : 'No action required. The message appears safe.';

  return {
    id: `msg-${Date.now()}`,
    type: 'message',
    input: message,
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
      messageType,
      urgencyLanguage: urgencyMatches,
      fakeRewards: rewardMatches.length > 0,
      suspiciousLinks: urls,
      socialEngineering: socialEngMatches,
      impersonation: hasPhoneNumber && urgencyMatches.length > 0,
      financialManipulation: financialMatches.length > 0,
      personalInfoRequest: personalInfoMatches.length > 0,
    },
    classification: threatLabel,
    explanation: simpleExplanation,
    recommendation: recommendedAction,
    recommendations: [
      recommendedAction,
      'Never share OTP, PIN, passwords, or personal credentials with anyone',
      'Verify unsolicited messages directly with the claimed sender through official channels'
    ],
    entities: [
      ...(urgencyMatches.length > 0 ? ['Urgency Tactics'] : []),
      ...(rewardMatches.length > 0 ? ['Prize/Lure'] : []),
      ...(urls.length > 0 ? [`${urls.length} Embedded Link(s)`] : []),
      messageType
    ],
  };
}
