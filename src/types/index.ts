// ============================================================
// SafeGuard AI — Core Types
// ============================================================

export type RiskLevel = 'safe' | 'low' | 'suspicious' | 'high';

export type ThreatCategory =
  | 'phishing'
  | 'smishing'
  | 'vishing'
  | 'fake-website'
  | 'shopping-scam'
  | 'banking-scam'
  | 'investment-scam'
  | 'job-scam'
  | 'lottery-scam'
  | 'social-media-scam'
  | 'romance-scam'
  | 'impersonation'
  | 'malware'
  | 'credential-harvesting'
  | 'qr-scam'
  | 'safe';

export type AnalysisType = 'url' | 'message' | 'email' | 'screenshot' | 'qr' | 'website';

export interface AnalysisResult {
  id: string;
  type: AnalysisType;
  input: string;
  timestamp: string;
  riskScore: number;
  riskLevel: RiskLevel;
  threatCategory: ThreatCategory;
  threatLabel: string;
  indicators: ThreatIndicator[];
  technicalExplanation: string;
  simpleExplanation: string;
  recommendedAction: string;
  details: Record<string, unknown>;
}

export interface ThreatIndicator {
  id: string;
  label: string;
  description: string;
  severity: 'info' | 'warning' | 'danger';
  detected: boolean;
}

export interface URLAnalysisDetails {
  url: string;
  domain: string;
  protocol: string;
  isHttps: boolean;
  domainAge: string;
  redirects: number;
  suspiciousKeywords: string[];
  domainReputation: string;
  isShortened: boolean;
  isTyposquatting: boolean;
  suspiciousTLD: boolean;
  isIPBased: boolean;
  sslInfo: string;
  urlStructure: string;
}

export interface MessageAnalysisDetails {
  messageType: string;
  urgencyLanguage: string[];
  fakeRewards: boolean;
  suspiciousLinks: string[];
  socialEngineering: string[];
  impersonation: boolean;
  financialManipulation: boolean;
  personalInfoRequest: boolean;
}

export interface EmailAnalysisDetails {
  senderEmail: string;
  subject: string;
  senderAuthenticity: string;
  domainMismatch: boolean;
  spoofingIndicators: string[];
  urgencyLevel: string;
  suspiciousAttachments: boolean;
  maliciousLinks: string[];
  credentialHarvesting: boolean;
  brandImpersonation: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  securityScore: number;
  joinDate: string;
  language: 'en' | 'te' | 'hi';
  awarenessLevel: 'beginner' | 'intermediate' | 'advanced';
  totalAnalyses: number;
  threatsDetected: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  timestamp: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

export interface ScamReport {
  id: string;
  type: 'url' | 'phone' | 'email' | 'message' | 'social-media' | 'website';
  description: string;
  evidence?: string;
  url?: string;
  contactInfo?: string;
  timestamp: string;
  status: 'submitted' | 'reviewing' | 'confirmed' | 'resolved';
}

export interface EducationTopic {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: {
    explanation: string;
    realWorldExample: string;
    warningSigns: string[];
    doList: string[];
    dontList: string[];
  };
}

export interface HistoryEntry {
  id: string;
  date: string;
  type: AnalysisType;
  content: string;
  riskScore: number;
  threat: string;
  status: RiskLevel;
}

export interface DashboardStats {
  threatsDetected: number;
  urlsAnalyzed: number;
  messagesAnalyzed: number;
  safeChecks: number;
  highRiskDetections: number;
  securityScore: number;
}

export interface AdminStats {
  totalUsers: number;
  totalAnalyses: number;
  threatsDetected: number;
  reportsSubmitted: number;
  highRiskThreats: number;
  activeUsers: number;
}

export interface AnalysisStep {
  label: string;
  description: string;
  status: 'pending' | 'active' | 'complete';
}
