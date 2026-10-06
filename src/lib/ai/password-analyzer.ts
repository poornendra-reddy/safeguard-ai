import { AnalysisResult } from '@/types';

export function checkPassword(password: string): AnalysisResult {
  const length = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (length >= 8) score += 20;
  if (length >= 12) score += 20;
  if (length >= 16) score += 10;
  if (hasUpper) score += 15;
  if (hasLower) score += 15;
  if (hasNumber) score += 10;
  if (hasSymbol) score += 10;

  const commonPasswords = ['password', '123456', '123456789', 'admin', 'welcome', 'qwerty', 'letmein', 'monkey', 'password123'];
  const isCommon = commonPasswords.some(cp => password.toLowerCase().includes(cp));

  if (isCommon) score = Math.min(score, 15);

  const indicators = [
    { label: 'Minimum 12+ characters', detected: length >= 12, severity: length >= 12 ? 'info' : 'warning' },
    { label: 'Includes Uppercase & Lowercase letters', detected: hasUpper && hasLower, severity: (hasUpper && hasLower) ? 'info' : 'warning' },
    { label: 'Includes Numbers (0-9)', detected: hasNumber, severity: hasNumber ? 'info' : 'warning' },
    { label: 'Includes Special Symbols (!@#$)', detected: hasSymbol, severity: hasSymbol ? 'info' : 'warning' },
    { label: 'Common / Known Leaked Pattern', detected: isCommon, severity: isCommon ? 'danger' : 'info' },
  ];

  const riskScore = Math.max(0, 100 - score);
  const riskLevel = riskScore <= 20 ? 'safe' : riskScore <= 50 ? 'low' : riskScore <= 75 ? 'suspicious' : 'high';

  return {
    id: `pwd-${Date.now()}`,
    type: 'password',
    input: '••••••••', // NEVER store or transmit raw password
    timestamp: new Date().toISOString(),
    riskScore,
    riskLevel,
    threatCategory: riskScore > 50 ? 'weak-password' : 'safe',
    threatLabel: riskScore > 50 ? 'Weak Password Security' : 'Strong Password',
    indicators,
    technicalExplanation: `Password length is ${length} chars. Diversity matrix: Upper=${hasUpper}, Lower=${hasLower}, Numbers=${hasNumber}, Symbols=${hasSymbol}. Dictionary match=${isCommon}.`,
    simpleExplanation: riskScore <= 20 
      ? 'Your password is long, diverse, and resistant to automated guessing or dictionary attacks.' 
      : 'Your password is vulnerable to automated brute-force attacks because it lacks complexity or length.',
    recommendedAction: riskScore <= 20 
      ? 'Great job! Store this password in a password manager and enable 2-Factor Authentication (2FA).' 
      : 'Use a passphrase of 14+ characters mixing letters, numbers, and symbols. Avoid common dictionary words.',
    recommendations: [
      'Enable Multi-Factor Authentication (MFA) on your account.',
      'Never reuse this password across multiple websites.',
      'Use a reputable Password Manager to generate unique 16+ character passphrases.'
    ],
    entities: [],
    details: { length, hasUpper, hasLower, hasNumber, hasSymbol, isCommon }
  };
}
