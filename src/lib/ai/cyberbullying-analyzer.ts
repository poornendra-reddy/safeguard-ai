import { AnalysisResult } from '@/types';

export function analyzeCyberbullying(text: string): AnalysisResult {
  const textLower = text.toLowerCase();

  const severeHarassment = ['kill yourself', 'die', 'threaten', 'hurt you', 'ugly', 'stalk', 'ruin your life', 'nobody likes you', 'go away forever'];
  const mildInsults = ['stupid', 'dumb', 'idiot', 'shut up', 'loser', 'hate you'];

  const matchedSevere = severeHarassment.filter(w => textLower.includes(w));
  const matchedMild = mildInsults.filter(w => textLower.includes(w));

  let riskScore = 10;
  if (matchedSevere.length > 0) {
    riskScore = Math.min(96, 75 + matchedSevere.length * 10);
  } else if (matchedMild.length > 0) {
    riskScore = Math.min(60, 35 + matchedMild.length * 10);
  }

  const indicators = [
    { label: 'Severe Threat / Harmful Targeted Harassment', detected: matchedSevere.length > 0, severity: 'danger' },
    { label: 'Abusive & Insulting Language', detected: matchedMild.length > 0, severity: 'warning' },
    { label: 'Normal Disagreement / Safe Context', detected: riskScore <= 20, severity: 'info' },
  ];

  const riskLevel = riskScore <= 20 ? 'safe' : riskScore <= 50 ? 'low' : riskScore <= 75 ? 'suspicious' : 'high';

  return {
    id: `cb-${Date.now()}`,
    type: 'cyberbullying',
    input: text.slice(0, 100),
    timestamp: new Date().toISOString(),
    riskScore,
    riskLevel,
    threatCategory: riskScore > 50 ? 'cyberbullying' : 'safe',
    threatLabel: riskScore > 50 ? 'Abusive & Harassing Language' : 'Safe / Respectful Text',
    indicators,
    technicalExplanation: `Text Toxicity Classifier: Severe matches=${matchedSevere.length}, Mild matches=${matchedMild.length}. Context score: ${riskScore}/100.`,
    simpleExplanation: riskScore <= 20
      ? 'The text appears to be standard non-harassing conversational language or disagreement.'
      : 'This message contains aggressive, abusive, or harassing content that violates online safety standards.',
    recommendedAction: riskScore <= 20
      ? 'No action required.'
      : 'Do NOT engage or reply. Take screenshots as evidence, block the sender, and report the message to platform moderators.',
    recommendations: [
      'Take screenshots of abusive messages including date, time, and user handle.',
      'Use platform "Block" and "Report" tools immediately.',
      'Reach out to a trusted friend, family member, or cyber-helpline if you feel unsafe.'
    ],
    entities: [],
    details: { matchedSevere, matchedMild }
  };
}
