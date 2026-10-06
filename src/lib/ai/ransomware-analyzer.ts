import { AnalysisResult } from '@/types';

export function analyzeRansomwarePattern(scenarioText: string): AnalysisResult {
  const textLower = scenarioText.toLowerCase();

  const triggers = ['vssadmin delete shadows', 'bcdedit /set', 'crypt', '.locked', 'ransom', 'decrypt_instructions', 'wbadmin delete', 'wbadmin disable'];
  const matchedTriggers = triggers.filter(t => textLower.includes(t));

  let riskScore = 20;
  if (matchedTriggers.length > 0) {
    riskScore = Math.min(98, 70 + matchedTriggers.length * 10);
  }

  const indicators = [
    { label: 'Volume Shadow Copy Deletion (vssadmin delete)', detected: textLower.includes('vssadmin'), severity: 'danger' },
    { label: 'Rapid Mass File Extension Rename (.locked)', detected: textLower.includes('crypt') || textLower.includes('locked'), severity: 'danger' },
    { label: 'Ransom Note File Generation (HOW_TO_DECRYPT.txt)', detected: textLower.includes('ransom') || textLower.includes('decrypt'), severity: 'danger' },
    { label: 'Windows Boot Recovery Disabling (bcdedit)', detected: textLower.includes('bcdedit'), severity: 'danger' },
  ];

  const riskLevel = riskScore <= 20 ? 'safe' : riskScore <= 50 ? 'low' : riskScore <= 75 ? 'suspicious' : 'high';

  return {
    id: `rw-${Date.now()}`,
    type: 'ransomware',
    input: scenarioText.slice(0, 80) + '...',
    timestamp: new Date().toISOString(),
    riskScore,
    riskLevel,
    threatCategory: riskScore > 50 ? 'ransomware-pattern' : 'safe',
    threatLabel: riskScore > 50 ? 'Ransomware Behavior Detected' : 'Normal System Process Behavior',
    indicators,
    technicalExplanation: `Pattern detection matched ${matchedTriggers.length} ransomware heuristics: [${matchedTriggers.join(', ')}]. Note: Web app execution is safe and simulated; no OS commands are executed.`,
    simpleExplanation: riskScore <= 20
      ? 'The process activity exhibits normal non-malicious system file operations.'
      : 'ALERT: Dangerous ransomware behavior detected! The process is attempting to delete backups and encrypt system files.',
    recommendedAction: riskScore <= 20
      ? 'Maintain regular automated offline backups of critical data.'
      : 'IMMEDIATELY disconnect your device from local Wi-Fi / LAN networks to isolate the infection and stop spread!',
    recommendations: [
      'Disconnect network cable / Wi-Fi immediately if you notice files being renamed to .locked.',
      'Maintain an offline (air-gapped) secondary backup disk not connected to your network.',
      'Keep your Operating System and antivirus real-time protection enabled.'
    ],
    entities: [],
    details: { matchedTriggers }
  };
}
