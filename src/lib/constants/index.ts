// ============================================================
// SafeGuard AI — Constants & Demo Data
// ============================================================

import { 
  ThreatCategory, EducationTopic, QuizQuestion, HistoryEntry, 
  Notification, DashboardStats, AdminStats 
} from '@/types';

// Threat category metadata
export const THREAT_CATEGORIES: Record<ThreatCategory, { label: string; icon: string; color: string; description: string }> = {
  phishing: { label: 'Phishing', icon: 'Fish', color: 'text-red-500', description: 'Fraudulent attempts to obtain sensitive information by disguising as a trustworthy entity.' },
  smishing: { label: 'Smishing (SMS Phishing)', icon: 'MessageSquareWarning', color: 'text-orange-500', description: 'Phishing attacks conducted through SMS text messages.' },
  vishing: { label: 'Vishing (Voice Phishing)', icon: 'PhoneOff', color: 'text-red-400', description: 'Phone-based social engineering scams.' },
  'fake-website': { label: 'Fake Website', icon: 'Globe', color: 'text-red-500', description: 'Websites designed to mimic legitimate sites to steal information.' },
  'shopping-scam': { label: 'Online Shopping Scam', icon: 'ShoppingBag', color: 'text-amber-500', description: 'Fraudulent online stores or deals designed to steal money or information.' },
  'banking-scam': { label: 'Banking Scam', icon: 'Landmark', color: 'text-red-600', description: 'Scams targeting banking credentials and financial information.' },
  'investment-scam': { label: 'Investment Scam', icon: 'TrendingUp', color: 'text-amber-600', description: 'Fraudulent investment schemes promising unrealistic returns.' },
  'job-scam': { label: 'Job Scam', icon: 'Briefcase', color: 'text-orange-400', description: 'Fake job offers designed to steal personal information or money.' },
  'lottery-scam': { label: 'Lottery/Prize Scam', icon: 'Gift', color: 'text-yellow-500', description: 'Fake lottery or prize notifications requiring payment or personal information.' },
  'social-media-scam': { label: 'Social Media Scam', icon: 'Users', color: 'text-purple-500', description: 'Scams spread through social media platforms.' },
  'romance-scam': { label: 'Romance Scam', icon: 'Heart', color: 'text-pink-500', description: 'Emotional manipulation scams through fake romantic relationships.' },
  impersonation: { label: 'Impersonation', icon: 'UserX', color: 'text-red-400', description: 'Scammers pretending to be someone else to gain trust.' },
  malware: { label: 'Malware Link', icon: 'Bug', color: 'text-red-600', description: 'Links that download malicious software to your device.' },
  'credential-harvesting': { label: 'Credential Harvesting', icon: 'KeyRound', color: 'text-red-500', description: 'Attempts to collect usernames, passwords, and other credentials.' },
  'qr-scam': { label: 'QR Code Scam', icon: 'QrCode', color: 'text-orange-500', description: 'Malicious QR codes that redirect to phishing or scam websites.' },
  'weak-password': { label: 'Weak Password', icon: 'Key', color: 'text-amber-500', description: 'Passwords with weak patterns susceptible to brute-force or dictionary attacks.' },
  'malicious-file': { label: 'Malicious File', icon: 'FileX', color: 'text-red-600', description: 'Potentially dangerous executable or script file detected.' },
  'risky-permission': { label: 'Risky Permission', icon: 'ShieldAlert', color: 'text-orange-500', description: 'Excessive browser permissions that could compromise privacy or data.' },
  'unsecure-network': { label: 'Unsecure Wi-Fi', icon: 'WifiOff', color: 'text-amber-600', description: 'Public network missing encryption or exhibiting man-in-the-middle risks.' },
  'deepfake-manipulation': { label: 'Deepfake Media', icon: 'Eye', color: 'text-purple-500', description: 'Media exhibiting indicators of synthetic or AI manipulation.' },
  'ransomware-pattern': { label: 'Ransomware Behavior', icon: 'Lock', color: 'text-red-700', description: 'Rapid mass encryption or suspicious shadow copy deletion activity.' },
  cyberbullying: { label: 'Cyberbullying & Harassment', icon: 'MessageSquareX', color: 'text-red-500', description: 'Toxic, threatening, or harassing text directed at individuals.' },
  safe: { label: 'Safe', icon: 'ShieldCheck', color: 'text-emerald-500', description: 'No threats detected.' },
};

// Risk level metadata
export const RISK_LEVELS = {
  safe: { label: 'SAFE', color: 'text-emerald-500', bg: 'bg-emerald-500', range: '0–20' },
  low: { label: 'LOW RISK', color: 'text-yellow-500', bg: 'bg-yellow-500', range: '21–50' },
  suspicious: { label: 'SUSPICIOUS', color: 'text-amber-500', bg: 'bg-amber-500', range: '51–75' },
  high: { label: 'HIGH RISK', color: 'text-red-500', bg: 'bg-red-500', range: '76–100' },
};

export function getRiskLevel(score: number): 'safe' | 'low' | 'suspicious' | 'high' {
  if (score <= 20) return 'safe';
  if (score <= 50) return 'low';
  if (score <= 75) return 'suspicious';
  return 'high';
}

export function getRiskColor(score: number): string {
  if (score <= 20) return '#10b981';
  if (score <= 50) return '#eab308';
  if (score <= 75) return '#f59e0b';
  return '#ef4444';
}

// Demo analysis scenarios
export const DEMO_SCENARIOS = [
  {
    id: 'fake-bank-sms',
    title: 'Fake Bank SMS',
    type: 'message' as const,
    input: 'URGENT: Your SBI account has been blocked due to KYC verification failure. Update your KYC immediately by clicking: http://sbi-kyc-update.xyz/verify or your account will be permanently closed within 24 hours. Call 9876543210 for support.',
    expectedScore: 92,
    expectedThreat: 'Banking Scam',
  },
  {
    id: 'phishing-url',
    title: 'Phishing Login URL',
    type: 'url' as const,
    input: 'http://secure-paytm-login.tk/account/verify?user=victim&token=abc123',
    expectedScore: 89,
    expectedThreat: 'Phishing',
  },
  {
    id: 'fake-job',
    title: 'Fake Job Offer',
    type: 'message' as const,
    input: 'Congratulations! You have been selected for a work-from-home position at Amazon. Salary: ₹45,000/month. No interview needed. Pay ₹500 registration fee to confirm your position. Contact HR: wa.me/919999888877',
    expectedScore: 88,
    expectedThreat: 'Job Scam',
  },
  {
    id: 'lottery-scam',
    title: 'Lottery Scam',
    type: 'message' as const,
    input: 'Dear Winner! Your mobile number has won ₹50,00,000 in the Google Lottery 2026. To claim your prize, send your full name, address, bank account number, and Aadhaar number to claims@google-lottery-winner.com. Claim within 48 hours!',
    expectedScore: 95,
    expectedThreat: 'Lottery Scam',
  },
  {
    id: 'fake-shopping',
    title: 'Fake Shopping Website',
    type: 'url' as const,
    input: 'https://flipkart-mega-sale-90off.shop/iphone15-999',
    expectedScore: 87,
    expectedThreat: 'Shopping Scam',
  },
  {
    id: 'qr-scam',
    title: 'QR Code Payment Scam',
    type: 'message' as const,
    input: 'I sent extra money by mistake. Please scan this QR code to refund ₹2,000 to my account. The QR is for receiving money only, I promise. Please do it urgently before the bank blocks the transaction.',
    expectedScore: 91,
    expectedThreat: 'QR Code Scam',
  },
];

// Sample dashboard stats
export const SAMPLE_DASHBOARD_STATS: DashboardStats = {
  threatsDetected: 24,
  urlsAnalyzed: 156,
  messagesAnalyzed: 89,
  safeChecks: 198,
  highRiskDetections: 12,
  securityScore: 78,
};

// Sample history
export const SAMPLE_HISTORY: HistoryEntry[] = [
  { id: 'h1', date: '2026-09-30T09:15:00', type: 'url', content: 'http://secure-paytm-login.tk/verify', riskScore: 89, threat: 'Phishing', status: 'high' },
  { id: 'h2', date: '2026-09-29T14:30:00', type: 'message', content: 'URGENT: Your SBI account has been blocked...', riskScore: 92, threat: 'Banking Scam', status: 'high' },
  { id: 'h3', date: '2026-09-29T11:00:00', type: 'url', content: 'https://www.google.com', riskScore: 5, threat: 'Safe', status: 'safe' },
  { id: 'h4', date: '2026-09-28T16:45:00', type: 'email', content: 'Subject: Your Amazon order #12345...', riskScore: 67, threat: 'Phishing', status: 'suspicious' },
  { id: 'h5', date: '2026-09-28T10:20:00', type: 'message', content: 'Congratulations! You won ₹50,000...', riskScore: 95, threat: 'Lottery Scam', status: 'high' },
  { id: 'h6', date: '2026-09-27T13:10:00', type: 'url', content: 'https://github.com', riskScore: 3, threat: 'Safe', status: 'safe' },
  { id: 'h7', date: '2026-09-27T09:50:00', type: 'website', content: 'flipkart-mega-sale.shop', riskScore: 87, threat: 'Fake Website', status: 'high' },
  { id: 'h8', date: '2026-09-26T15:30:00', type: 'message', content: 'Work from home job opportunity...', riskScore: 88, threat: 'Job Scam', status: 'high' },
  { id: 'h9', date: '2026-09-26T11:15:00', type: 'qr', content: 'QR Code → http://pay.scam.xyz', riskScore: 84, threat: 'QR Scam', status: 'high' },
  { id: 'h10', date: '2026-09-25T14:00:00', type: 'url', content: 'https://www.wikipedia.org', riskScore: 2, threat: 'Safe', status: 'safe' },
];

// Sample notifications
export const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'High-Risk Threat Detected', message: 'A phishing URL you analyzed has been confirmed as malicious by our threat intelligence system.', type: 'danger', timestamp: '2026-09-30T09:00:00', read: false },
  { id: 'n2', title: 'Security Score Improved', message: 'Your security awareness score has improved to 78/100. Keep up the good work!', type: 'success', timestamp: '2026-09-29T14:00:00', read: false },
  { id: 'n3', title: 'New Scam Alert', message: 'A new banking SMS scam targeting SBI customers has been detected in your region.', type: 'warning', timestamp: '2026-09-29T10:00:00', read: true },
  { id: 'n4', title: 'Training Completed', message: 'You completed the "Phishing Awareness" training module. +5 security score points!', type: 'info', timestamp: '2026-09-28T16:00:00', read: true },
  { id: 'n5', title: 'Weekly Report Available', message: 'Your weekly threat analysis report is ready for review.', type: 'info', timestamp: '2026-09-28T09:00:00', read: true },
];

// Admin stats
export const SAMPLE_ADMIN_STATS: AdminStats = {
  totalUsers: 12847,
  totalAnalyses: 89432,
  threatsDetected: 23156,
  reportsSubmitted: 4521,
  highRiskThreats: 8934,
  activeUsers: 3421,
};

// Education topics
export const EDUCATION_TOPICS: EducationTopic[] = [
  {
    id: 'phishing',
    title: 'Phishing Attacks',
    icon: 'Fish',
    description: 'Learn how to identify and avoid phishing attacks.',
    content: {
      explanation: 'Phishing is a type of cyberattack where criminals send fraudulent messages designed to trick you into revealing sensitive information like passwords, credit card numbers, or personal data. These messages often appear to come from trusted sources like banks, tech companies, or government agencies.',
      realWorldExample: 'You receive an email that looks like it\'s from your bank saying "Your account has been compromised. Click here to verify your identity immediately." The email uses the bank\'s logo and formatting, but the link leads to a fake website designed to steal your login credentials.',
      warningSigns: ['Urgent or threatening language', 'Requests for personal information', 'Suspicious sender email addresses', 'Misspelled URLs or domain names', 'Generic greetings like "Dear Customer"', 'Too-good-to-be-true offers', 'Unexpected attachments'],
      doList: ['Verify the sender\'s email address carefully', 'Hover over links before clicking to see the real URL', 'Contact the organization directly using official contact information', 'Use two-factor authentication on all accounts', 'Report phishing attempts to your email provider'],
      dontList: ['Don\'t click links in suspicious emails', 'Don\'t download attachments from unknown senders', 'Don\'t enter personal information on unfamiliar websites', 'Don\'t respond to emails asking for passwords or OTPs', 'Don\'t trust emails just because they have official-looking logos'],
    },
  },
  {
    id: 'password-security',
    title: 'Password Security',
    icon: 'Lock',
    description: 'Best practices for creating and managing strong passwords.',
    content: {
      explanation: 'Strong passwords are your first line of defense against unauthorized access. A weak password can be cracked in seconds using modern computing tools, while a strong password could take centuries to break.',
      realWorldExample: 'A user named Rahul used "rahul123" as his password for multiple accounts. When one website suffered a data breach, attackers used his leaked password to access his email, social media, and even his bank account.',
      warningSigns: ['Using the same password for multiple accounts', 'Passwords shorter than 12 characters', 'Using personal information in passwords', 'Never changing passwords', 'Sharing passwords with others'],
      doList: ['Use at least 12 characters with mixed case, numbers, and symbols', 'Use a unique password for every account', 'Use a password manager', 'Enable two-factor authentication', 'Change passwords after a data breach'],
      dontList: ['Don\'t use dictionary words or common phrases', 'Don\'t include personal info like birthdays or names', 'Don\'t reuse passwords across sites', 'Don\'t write passwords on sticky notes', 'Don\'t share passwords via text or email'],
    },
  },
  {
    id: 'online-banking',
    title: 'Online Banking Safety',
    icon: 'Landmark',
    description: 'Protect your financial information when banking online.',
    content: {
      explanation: 'Online banking provides convenience but also creates opportunities for cybercriminals. Understanding how to bank safely online is essential to protecting your money and personal financial information.',
      realWorldExample: 'A customer received an SMS saying "Your UPI ID is being used on another device. Verify now: http://upi-verify.xyz". After clicking and entering their UPI PIN, ₹25,000 was transferred from their account.',
      warningSigns: ['SMS asking you to click links for banking verification', 'Calls from "bank officials" asking for OTP or PIN', 'Emails asking you to update banking details', 'Pop-ups on banking websites asking for additional information', 'Requests to install remote access apps'],
      doList: ['Always type your bank\'s URL directly in the browser', 'Use official banking apps from app stores', 'Enable transaction alerts', 'Check your bank statements regularly', 'Log out after every banking session'],
      dontList: ['Never share OTP, PIN, or CVV with anyone', 'Don\'t bank on public Wi-Fi networks', 'Don\'t save banking passwords in browsers', 'Don\'t click on links in SMS for banking', 'Don\'t install apps suggested by callers claiming to be bank staff'],
    },
  },
  {
    id: 'social-media-safety',
    title: 'Social Media Safety',
    icon: 'Users',
    description: 'Stay safe on social media platforms.',
    content: {
      explanation: 'Social media platforms are common targets for scammers who create fake profiles, run fraudulent schemes, and use social engineering to exploit users. Being aware of common tactics can help you stay safe.',
      realWorldExample: 'A person received a message on Instagram from a friend\'s account saying "Look at this photo of you!" with a link. After clicking, they were asked to log in again. The "friend\'s" account had been hacked, and the link was a phishing page that stole their Instagram credentials.',
      warningSigns: ['Messages from friends with unusual links', 'Investment opportunities promising high returns', 'Accounts offering free products or giveaways', 'Romantic interests who quickly ask for money', 'Job offers that seem too good to be true'],
      doList: ['Use strong privacy settings', 'Verify friend requests from people you know', 'Be cautious about sharing personal information', 'Report suspicious accounts and content', 'Use two-factor authentication'],
      dontList: ['Don\'t accept friend requests from strangers', 'Don\'t click on suspicious links in messages', 'Don\'t share location or personal details publicly', 'Don\'t send money to people you\'ve only met online', 'Don\'t participate in chain messages or "share to win" schemes'],
    },
  },
  {
    id: 'shopping-scams',
    title: 'Online Shopping Scams',
    icon: 'ShoppingBag',
    description: 'Identify and avoid fake online stores and deals.',
    content: {
      explanation: 'Fake online stores create professional-looking websites that mimic popular e-commerce platforms. They offer extremely low prices to lure victims, collect payment, and either send counterfeit products or nothing at all.',
      realWorldExample: 'A website claiming to be a Flipkart clearance sale offered iPhone 15 for ₹9,999 (90% off). The site looked professional with the Flipkart logo. After customers paid, they received cheap counterfeit products or nothing at all.',
      warningSigns: ['Prices that are too good to be true (80-90% off)', 'No physical address or contact information', 'Only accepting direct bank transfers', 'Poor grammar and spelling on the website', 'No customer reviews or all 5-star reviews', 'Recently created website'],
      doList: ['Buy from established, reputable websites', 'Check for secure payment options (HTTPS, trusted payment gateways)', 'Read reviews from multiple sources', 'Use credit cards for purchase protection', 'Verify the website\'s contact information'],
      dontList: ['Don\'t trust deals that seem too good to be true', 'Don\'t pay via direct bank transfer to unknown sellers', 'Don\'t shop on websites without HTTPS', 'Don\'t ignore red flags like no return policy', 'Don\'t provide more personal information than necessary'],
    },
  },
  {
    id: 'job-scams',
    title: 'Job Scams',
    icon: 'Briefcase',
    description: 'Recognize fake job offers and employment fraud.',
    content: {
      explanation: 'Job scams exploit people seeking employment by offering fake positions that require upfront payments, personal information, or unpaid work. These scams can result in financial loss and identity theft.',
      realWorldExample: 'A fresh graduate received a WhatsApp message: "Selected for Amazon data entry job. Salary ₹45,000/month. Work from home. Pay ₹999 registration fee." After paying, they were added to a group that asked them to "like YouTube videos" and invest more money for higher returns.',
      warningSigns: ['Job offers without interviews', 'Requiring payment for training or registration', 'Extremely high salary for simple work', 'Communication only through WhatsApp or Telegram', 'Vague job descriptions', 'Pressure to decide quickly'],
      doList: ['Research the company thoroughly', 'Apply through official company websites', 'Verify job offers by calling the company directly', 'Be skeptical of unsolicited job offers', 'Check if the recruiter has a legitimate LinkedIn profile'],
      dontList: ['Never pay money to get a job', 'Don\'t share Aadhaar, PAN, or bank details before verification', 'Don\'t trust offers that come only via messaging apps', 'Don\'t do unpaid "test work" for companies you haven\'t verified', 'Don\'t click on suspicious links in job offer messages'],
    },
  },
  {
    id: 'qr-safety',
    title: 'QR Code Safety',
    icon: 'QrCode',
    description: 'Understand the risks associated with QR codes.',
    content: {
      explanation: 'QR codes can be weaponized by scammers to redirect users to malicious websites, initiate unauthorized payments, or download malware. Always verify QR codes before scanning, especially those received from unknown sources.',
      realWorldExample: 'A seller on OLX told the buyer to scan a QR code to "receive" a refund of ₹5,000. Instead, scanning the QR code initiated a payment FROM the buyer\'s account, and ₹5,000 was deducted.',
      warningSigns: ['QR codes received from unknown people', 'QR codes claiming to "send you money"', 'QR codes pasted over original ones in public places', 'Pressure to scan QR codes quickly', 'QR codes in suspicious emails or messages'],
      doList: ['Preview the URL before opening it after scanning', 'Use your phone\'s built-in QR scanner (it shows URL preview)', 'Verify QR codes at payment terminals', 'Only scan QR codes from trusted sources', 'Report suspicious QR codes'],
      dontList: ['Never scan QR codes to "receive" money', 'Don\'t scan QR codes from unknown sources', 'Don\'t enter UPI PIN after scanning an unknown QR', 'Don\'t scan QR codes attached to suspicious messages', 'Don\'t trust QR codes stuck over original ones in public places'],
    },
  },
  {
    id: 'email-security',
    title: 'Email Security',
    icon: 'Mail',
    description: 'Protect yourself from email-based threats.',
    content: {
      explanation: 'Email remains one of the most common attack vectors for cybercriminals. From phishing emails to malware attachments, understanding email security is crucial for personal and professional safety.',
      realWorldExample: 'An employee received an email from what appeared to be their CEO requesting an urgent wire transfer of ₹10 lakhs. The email address was ceo@company.co (instead of ceo@company.com). The subtle domain difference was overlooked.',
      warningSigns: ['Sender\'s email domain doesn\'t match the organization', 'Urgent requests for money or information', 'Unexpected attachments', 'Links that don\'t match the displayed text', 'Poor grammar and formatting'],
      doList: ['Check sender email addresses carefully', 'Hover over links to see actual URLs', 'Use email filtering and spam protection', 'Verify unexpected requests through a separate channel', 'Keep email software updated'],
      dontList: ['Don\'t open attachments from unknown senders', 'Don\'t click links without verifying', 'Don\'t forward suspicious emails to others', 'Don\'t reply with sensitive information', 'Don\'t disable spam filters'],
    },
  },
  {
    id: 'mobile-security',
    title: 'Mobile Security',
    icon: 'Smartphone',
    description: 'Keep your smartphone safe from threats.',
    content: {
      explanation: 'Smartphones contain a wealth of personal information, making them prime targets for cybercriminals. Mobile security involves protecting your device, data, and privacy from various threats including malware, phishing, and unauthorized access.',
      realWorldExample: 'A user downloaded a "free antivirus" app from a third-party website. The app requested permissions for contacts, SMS, and camera. It turned out to be spyware that read OTPs from SMS messages and made unauthorized UPI transactions.',
      warningSigns: ['Apps requesting excessive permissions', 'Battery draining faster than usual', 'Unknown apps appearing on your device', 'Unexpected data usage', 'Pop-ups and unwanted ads'],
      doList: ['Only install apps from official app stores', 'Keep your OS and apps updated', 'Use biometric lock or strong PIN', 'Review app permissions regularly', 'Enable Find My Device features'],
      dontList: ['Don\'t install apps from unknown sources', 'Don\'t root or jailbreak your device', 'Don\'t connect to unknown Wi-Fi networks', 'Don\'t ignore OS update notifications', 'Don\'t leave Bluetooth on when not in use'],
    },
  },
  {
    id: 'ai-scams',
    title: 'AI-Powered Scams',
    icon: 'Bot',
    description: 'Understand emerging scams that use artificial intelligence.',
    content: {
      explanation: 'As AI technology advances, scammers are using deepfakes, AI-generated voices, and AI-written messages to create more convincing scams. These AI-powered attacks are harder to detect because they can mimic real people and organizations with high accuracy.',
      realWorldExample: 'A woman received a phone call from what sounded exactly like her son, saying he had been in an accident and needed ₹2 lakhs immediately. The voice was actually an AI deepfake generated from social media videos of her son.',
      warningSigns: ['Phone calls with slightly unnatural voice patterns', 'Video calls with visual glitches or unnatural movements', 'Messages with perfect grammar but unusual requests', 'Calls from family members making urgent financial requests', 'Emails that perfectly mimic writing style but make unusual asks'],
      doList: ['Establish a family code word for emergencies', 'Verify urgent requests through a separate channel', 'Be skeptical of unexpected audio/video calls requesting money', 'Stay informed about the latest AI scam techniques', 'Report AI-powered scams to authorities'],
      dontList: ['Don\'t immediately trust voice or video calls requesting money', 'Don\'t share too many voice/video clips publicly on social media', 'Don\'t act on urgent financial requests without verification', 'Don\'t assume that a familiar voice means it\'s really that person', 'Don\'t ignore the possibility that content could be AI-generated'],
    },
  },
];

// Quiz questions
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1', difficulty: 'beginner', category: 'Phishing',
    question: 'You receive an email from "support@amaz0n.com" asking you to verify your account. What should you do?',
    options: ['Click the link and verify your account', 'Reply with your account details', 'Delete the email — the domain "amaz0n" with a zero is suspicious', 'Forward it to your friends to check'],
    correctAnswer: 2,
    explanation: 'The email uses "amaz0n" (with a zero instead of the letter O) — a common typosquatting technique. Legitimate Amazon emails come from @amazon.com.',
  },
  {
    id: 'q2', difficulty: 'beginner', category: 'SMS Scams',
    question: 'An SMS says: "Your bank account will be blocked in 24 hours. Click here to update KYC." What is this likely?',
    options: ['A legitimate bank notification', 'A smishing (SMS phishing) attack', 'A routine security update', 'A government requirement'],
    correctAnswer: 1,
    explanation: 'Banks never send SMS with links asking for KYC updates. This is a classic smishing attack using urgency to trick you into clicking a malicious link.',
  },
  {
    id: 'q3', difficulty: 'beginner', category: 'Password Security',
    question: 'Which of the following is the strongest password?',
    options: ['password123', 'Rahul@1990', 'Tr0ub4dor&3', 'M@ng0_Sunrise#2026!kite'],
    correctAnswer: 3,
    explanation: 'A long passphrase with mixed characters, numbers, and symbols is the strongest. Short passwords, even with substitutions, can be cracked quickly.',
  },
  {
    id: 'q4', difficulty: 'intermediate', category: 'URL Safety',
    question: 'Which URL is most likely a phishing attempt?',
    options: ['https://www.paypal.com/login', 'http://paypal-secure-login.xyz/verify', 'https://paypal.com/settings', 'https://www.paypal.com/security'],
    correctAnswer: 1,
    explanation: 'The URL "paypal-secure-login.xyz" is NOT paypal.com — it\'s a completely different domain using the .xyz TLD, which is commonly used in phishing.',
  },
  {
    id: 'q5', difficulty: 'intermediate', category: 'Social Engineering',
    question: 'Someone claiming to be from IT support calls and asks for your password to "fix a security issue." What should you do?',
    options: ['Give them the password to fix the issue', 'Ask for their employee ID and verify independently', 'Change your password first, then give the old one', 'Give a fake password to test them'],
    correctAnswer: 1,
    explanation: 'Legitimate IT support never asks for your password. Always verify the caller\'s identity through official channels before taking any action.',
  },
  {
    id: 'q6', difficulty: 'intermediate', category: 'QR Codes',
    question: 'A stranger asks you to scan a QR code to "receive" a payment of ₹5,000. What should you know?',
    options: ['Scanning QR codes is always safe', 'QR codes can only receive payments', 'Scanning a QR code can SEND money from your account', 'QR codes don\'t work with UPI apps'],
    correctAnswer: 2,
    explanation: 'QR codes are used to MAKE payments, not receive them. If someone asks you to scan a QR to "receive" money and enter your UPI PIN, money will be DEDUCTED from your account.',
  },
  {
    id: 'q7', difficulty: 'advanced', category: 'Email Analysis',
    question: 'An email from "security@microsoft.com" has a link pointing to "http://microsoft.security-update.ru/patch". What red flags do you see?',
    options: ['The email is from Microsoft, so it\'s safe', 'The link uses HTTP (not HTTPS) and the domain is .ru, not microsoft.com', 'Microsoft always sends patches via email', 'The email is legitimate because it mentions security'],
    correctAnswer: 1,
    explanation: 'Multiple red flags: 1) The link uses HTTP instead of HTTPS, 2) The actual domain is "security-update.ru" (a Russian domain), not microsoft.com, 3) Microsoft doesn\'t send patches via email links.',
  },
  {
    id: 'q8', difficulty: 'advanced', category: 'AI Scams',
    question: 'You receive a video call showing your boss asking you to urgently transfer money. The video looks real but slightly glitchy. What could this be?',
    options: ['A normal video call with bad connection', 'A deepfake video generated by AI', 'Your boss testing your security awareness', 'A prank by a colleague'],
    correctAnswer: 1,
    explanation: 'AI-generated deepfake videos can now convincingly mimic real people. Visual glitches, unnatural eye movements, or unusual requests during video calls could indicate a deepfake attack.',
  },
  {
    id: 'q9', difficulty: 'advanced', category: 'Network Security',
    question: 'You\'re at a café and see a free Wi-Fi network called "CaféFreeWiFi_Secure". What should you consider?',
    options: ['It says "Secure" so it must be safe', 'Anyone can create a Wi-Fi hotspot with any name — it could be a honeypot', 'Free Wi-Fi is always safe in cafés', 'The café must have set it up'],
    correctAnswer: 1,
    explanation: 'Evil twin attacks involve creating fake Wi-Fi hotspots that mimic legitimate ones. Anyone can name a network anything. Use a VPN on public Wi-Fi, and verify the network name with the café staff.',
  },
  {
    id: 'q10', difficulty: 'beginner', category: 'Online Shopping',
    question: 'A website offers iPhone 15 for ₹4,999 (95% off). What should you do?',
    options: ['Buy it immediately before the offer expires', 'Share it with friends', 'It\'s likely a scam — check the website\'s reputation first', 'Pay via bank transfer for the discount'],
    correctAnswer: 2,
    explanation: 'Prices that are too good to be true are a classic sign of an online shopping scam. Always verify the website\'s legitimacy, check reviews, and never pay via direct bank transfer to unknown sellers.',
  },
];

// Chatbot quick prompts
export const CHATBOT_QUICK_PROMPTS = [
  'What is phishing?',
  'How do I identify a fake website?',
  'Is this SMS a scam?',
  'What should I do if I clicked a suspicious link?',
  'How to create a strong password?',
  'Is this job offer legitimate?',
  'How do QR code scams work?',
  'What is two-factor authentication?',
];

// Chatbot responses
export const CHATBOT_RESPONSES: Record<string, string> = {
  'what is phishing': '🎣 **Phishing** is a cyberattack where criminals send fake messages (emails, SMS, or social media messages) that look like they\'re from trusted organizations to trick you into revealing sensitive information.\n\n**How it works:**\n1. You receive a message that looks legitimate\n2. The message creates urgency ("Your account will be blocked!")\n3. It asks you to click a link or share information\n4. The link leads to a fake website that steals your data\n\n**How to protect yourself:**\n- Always check the sender\'s email/phone number\n- Don\'t click links in unexpected messages\n- Verify requests through official channels\n- Use two-factor authentication',

  'how do i identify a fake website': '🌐 **How to Identify a Fake Website:**\n\n1. **Check the URL carefully** — Look for misspellings (amaz0n.com), unusual domains (.xyz, .tk), or extra words (secure-login-paypal.com)\n\n2. **Look for HTTPS** — Legitimate sites use HTTPS (🔒), but note that some scam sites also use it\n\n3. **Check the domain age** — Scam sites are usually very new\n\n4. **Look for contact information** — Real companies provide physical address, phone number, and email\n\n5. **Check for poor grammar** — Many fake sites have spelling and grammar errors\n\n6. **Verify the company** — Search for the company name + "scam" or "review"\n\n7. **Be suspicious of unrealistic offers** — 90% off deals are almost always scams\n\n💡 **Tip:** Use SafeGuard AI\'s URL Scanner to instantly check any website!',

  'what should i do if i clicked a suspicious link': '⚠️ **If You Clicked a Suspicious Link:**\n\n**Immediate Steps:**\n1. 🔌 Disconnect from the internet (turn off Wi-Fi/data)\n2. 🔐 Change passwords for any accounts you may have exposed\n3. 📱 Run a virus scan on your device\n4. 🏦 If you entered banking details, call your bank immediately\n\n**Next Steps:**\n5. Enable two-factor authentication on all accounts\n6. Monitor your accounts for unusual activity\n7. Report the incident to the platform where you found the link\n8. File a complaint at cybercrime.gov.in if you lost money\n\n**If you entered personal information:**\n- Monitor your credit reports\n- Be alert for identity theft\n- Consider placing a fraud alert\n\n**Remember:** Acting quickly is key. The sooner you take action, the less damage a scammer can do.',

  'how to create a strong password': '🔐 **Creating a Strong Password:**\n\n**Do\'s:**\n- Use **at least 12 characters**\n- Mix **uppercase, lowercase, numbers, and symbols**\n- Use a **passphrase** (e.g., "Mango_Sunrise#2026!kite")\n- Use a **unique password** for each account\n- Use a **password manager** (Bitwarden, 1Password, etc.)\n\n**Don\'ts:**\n- ❌ Don\'t use personal info (name, birthday)\n- ❌ Don\'t use common words (password, 123456)\n- ❌ Don\'t reuse passwords across sites\n- ❌ Don\'t share passwords via text/email\n\n**Password Strength Examples:**\n- ❌ Weak: `password123` (cracked in <1 second)\n- ⚠️ Medium: `Rahul@1990` (cracked in hours)\n- ✅ Strong: `M@ng0_Sunrise#2026!kite` (centuries to crack)\n\n💡 **Pro Tip:** Enable **Two-Factor Authentication (2FA)** on all important accounts for an extra layer of security!',

  'default': '🛡️ I\'m the **SafeGuard Assistant**, your AI cybersecurity guide! I can help you with:\n\n• **Identifying threats** — Ask me about phishing, scams, or suspicious messages\n• **Safety guidance** — Learn how to protect yourself online\n• **Security education** — Understand cybersecurity concepts in simple language\n• **Incident response** — Know what to do if you\'ve been compromised\n\nTry asking me questions like:\n- "What is phishing?"\n- "How do I identify a fake website?"\n- "Is this job offer legitimate?"\n- "What should I do if I clicked a suspicious link?"\n\nOr use the **Analyze** tools to scan a suspicious URL, message, or email!',
};

// Analysis pipeline steps
export const ANALYSIS_STEPS = [
  { label: 'Validating Input', description: 'Checking input format and content...' },
  { label: 'Extracting Indicators', description: 'Identifying suspicious patterns...' },
  { label: 'Analyzing Patterns', description: 'Running pattern analysis engine...' },
  { label: 'Checking Threat Intelligence', description: 'Cross-referencing threat databases...' },
  { label: 'Generating Risk Assessment', description: 'Calculating risk score...' },
  { label: 'Preparing Recommendation', description: 'Generating safety recommendation...' },
];

// Chart data for threat intelligence
export const THREAT_DISTRIBUTION_DATA = [
  { name: 'Phishing', value: 35, fill: '#ef4444' },
  { name: 'Smishing', value: 22, fill: '#f97316' },
  { name: 'Fake Sites', value: 18, fill: '#eab308' },
  { name: 'Banking', value: 12, fill: '#8b5cf6' },
  { name: 'Job Scams', value: 8, fill: '#06b6d4' },
  { name: 'Others', value: 5, fill: '#64748b' },
];

export const WEEKLY_ACTIVITY_DATA = [
  { day: 'Mon', analyses: 12, threats: 3 },
  { day: 'Tue', analyses: 19, threats: 5 },
  { day: 'Wed', analyses: 15, threats: 2 },
  { day: 'Thu', analyses: 22, threats: 7 },
  { day: 'Fri', analyses: 28, threats: 9 },
  { day: 'Sat', analyses: 8, threats: 1 },
  { day: 'Sun', analyses: 5, threats: 0 },
];

export const DAILY_DETECTIONS_DATA = [
  { date: 'Sep 24', detections: 45 },
  { date: 'Sep 25', detections: 52 },
  { date: 'Sep 26', detections: 38 },
  { date: 'Sep 27', detections: 65 },
  { date: 'Sep 28', detections: 71 },
  { date: 'Sep 29', detections: 58 },
  { date: 'Sep 30', detections: 84 },
];
