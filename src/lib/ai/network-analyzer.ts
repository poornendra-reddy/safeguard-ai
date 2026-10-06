import { AnalysisResult } from '@/types';

export function analyzeNetworkRisk(params: { ssid?: string; isHttps?: boolean; isPublic?: boolean; authType?: string }): AnalysisResult {
  const isHttps = params.isHttps ?? (typeof window !== 'undefined' ? window.location.protocol === 'https:' : true);
  const isPublic = params.isPublic ?? true; // Assume public Wi-Fi assessment context
  const authType = params.authType || 'Open / Captive Portal';

  let riskScore = 20;
  if (!isHttps) riskScore += 45;
  if (authType.toLowerCase().includes('open') || authType.toLowerCase().includes('none')) riskScore += 35;

  const indicators = [
    { label: 'Unencrypted Wi-Fi Connection (Open SSID)', detected: authType.toLowerCase().includes('open'), severity: 'danger' },
    { label: 'HTTP / Non-SSL Traffic Exposure', detected: !isHttps, severity: 'danger' },
    { label: 'Public Access Point (Potential Evil Twin Risk)', detected: isPublic, severity: 'warning' },
    { label: 'Captive Portal Interception Warning', detected: true, severity: 'info' },
  ];

  const riskLevel = riskScore <= 20 ? 'safe' : riskScore <= 50 ? 'low' : riskScore <= 75 ? 'suspicious' : 'high';

  return {
    id: `net-${Date.now()}`,
    type: 'network',
    input: params.ssid || 'Public Wi-Fi Connection',
    timestamp: new Date().toISOString(),
    riskScore,
    riskLevel,
    threatCategory: riskScore > 50 ? 'unsecure-network' : 'safe',
    threatLabel: riskScore > 50 ? 'High-Risk Public Wi-Fi' : 'Secure Encrypted Network',
    indicators,
    technicalExplanation: `Network Protocol: HTTPS=${isHttps}. Encryption Mode: ${authType}. Note: Standard browsers restrict raw ARP/packet inspection due to security sandboxing.`,
    simpleExplanation: riskScore <= 20
      ? 'Your current connection is using secure HTTPS encryption.'
      : 'Unencrypted public Wi-Fi allows attacker eavesdropping and Man-In-The-Middle (MITM) session hijacking.',
    recommendedAction: riskScore <= 20
      ? 'Always verify website HTTPS lock icons before submitting personal information.'
      : 'Turn on a trusted Virtual Private Network (VPN) immediately or switch to your mobile data hotspot.',
    recommendations: [
      'Use a trusted VPN whenever connected to airports, cafes, or hotel Wi-Fi.',
      'Disable "Auto-Connect to Open Wi-Fi Networks" on your phone and laptop.',
      'Never access mobile banking apps on unencrypted public Wi-Fi.'
    ],
    entities: [params.ssid || 'Public Wi-Fi'],
    details: { isHttps, isPublic, authType }
  };
}
