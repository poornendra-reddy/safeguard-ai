import { AnalysisResult } from '@/types';

export function analyzeBrowserPermissions(permissionsText: string): AnalysisResult {
  const textLower = permissionsText.toLowerCase();

  const highRiskPatterns = ['<all_urls>', 'http://*/*', 'https://*/*', 'webrequest', 'cookies', 'debugger', 'nativemessaging'];
  const warningPatterns = ['tabs', 'storage', 'clipboardread', 'clipboardwrite', 'activeTab', 'bookmarks', 'history'];

  const detectedHighRisk = highRiskPatterns.filter(p => textLower.includes(p));
  const detectedWarning = warningPatterns.filter(p => textLower.includes(p));

  let riskScore = 15;
  if (detectedHighRisk.length > 0) {
    riskScore = Math.min(95, 60 + detectedHighRisk.length * 15);
  } else if (detectedWarning.length > 0) {
    riskScore = Math.min(50, 25 + detectedWarning.length * 10);
  }

  const indicators = [
    { label: 'Access to All Website Data (<all_urls>)', detected: textLower.includes('<all_urls>') || textLower.includes('http://*/*'), severity: 'danger' },
    { label: 'Cookie / Session Token Reading', detected: textLower.includes('cookies'), severity: 'danger' },
    { label: 'Clipboard Reading (Sensitive data theft)', detected: textLower.includes('clipboardread'), severity: 'warning' },
    { label: 'Tab Activity & Browsing History Monitoring', detected: textLower.includes('history') || textLower.includes('tabs'), severity: 'warning' },
  ];

  const riskLevel = riskScore <= 20 ? 'safe' : riskScore <= 50 ? 'low' : riskScore <= 75 ? 'suspicious' : 'high';

  return {
    id: `browser-${Date.now()}`,
    type: 'browser',
    input: permissionsText.slice(0, 100) + '...',
    timestamp: new Date().toISOString(),
    riskScore,
    riskLevel,
    threatCategory: riskScore > 50 ? 'risky-permission' : 'safe',
    threatLabel: riskScore > 50 ? 'Excessive Browser Permission' : 'Safe Extension Permissions',
    indicators,
    technicalExplanation: `Detected ${detectedHighRisk.length} high-risk permission scope(s) [${detectedHighRisk.join(', ')}] and ${detectedWarning.length} moderate scope(s).`,
    simpleExplanation: riskScore <= 20
      ? 'This extension asks only for essential permissions needed to function.'
      : 'This extension requests broad access to read your private web activity, passwords, or cookies across all websites.',
    recommendedAction: riskScore <= 20
      ? 'Permissions look clean. Keep your extension updated.'
      : 'Remove this extension if you do not completely trust the developer. Never install unknown extensions requesting "<all_urls>".',
    recommendations: [
      'Only install browser extensions from official Chrome Web Store / Firefox Addons.',
      'Review extension permissions quarterly in browser settings.',
      'Remove extensions that have not been updated in over 1 year.'
    ],
    entities: [],
    details: { detectedHighRisk, detectedWarning }
  };
}
