import { AnalysisResult } from '@/types';

const SUSPICIOUS_EXTENSIONS = ['.exe', '.bat', '.cmd', '.ps1', '.vbs', '.scr', '.js', '.jar', '.iso', '.dll', '.sys', '.sh', '.htm', '.html', '.php'];
const DANGEROUS_MIME_TYPES = ['application/x-msdownload', 'application/x-executable', 'application/x-bat', 'application/x-sh', 'application/javascript'];

export function analyzeFileMetadata(file: { name: string; size: number; type: string }): AnalysisResult {
  const fileName = file.name.toLowerCase();
  const extMatch = fileName.match(/\.[0-9a-z]+$/i);
  const ext = extMatch ? extMatch[0] : '';

  // Double extension detection (e.g. invoice.pdf.exe)
  const parts = fileName.split('.');
  const isDoubleExt = parts.length > 2 && SUSPICIOUS_EXTENSIONS.includes(`.${parts[parts.length - 1]}`);
  
  const isSuspiciousExt = SUSPICIOUS_EXTENSIONS.includes(ext);
  const isDangerousMime = DANGEROUS_MIME_TYPES.includes(file.type);
  const isExecutableSize = file.size < 50 * 1024 * 1024; // Most web malware is < 50MB

  let riskScore = 10; // Base risk score for safe files
  let threatCategory: any = 'safe';
  let threatLabel = 'Safe File Format';

  if (isDoubleExt || (isSuspiciousExt && isDangerousMime)) {
    riskScore = 95;
    threatCategory = 'malicious-file';
    threatLabel = 'Executable / Malware File';
  } else if (isSuspiciousExt) {
    riskScore = 78;
    threatCategory = 'malicious-file';
    threatLabel = 'Suspicious Script File';
  } else if (file.name.includes('invoice') || file.name.includes('receipt') || file.name.includes('payment')) {
    if (ext === '.zip' || ext === '.rar' || ext === '.7z') {
      riskScore = 65;
      threatCategory = 'malicious-file';
      threatLabel = 'Archive with Phishing Attachment Risk';
    }
  }

  const indicators = [
    { label: 'Executable / Script File Extension', detected: isSuspiciousExt, severity: isSuspiciousExt ? 'danger' : 'info' },
    { label: 'Double Extension Masking (e.g., .doc.exe)', detected: isDoubleExt, severity: isDoubleExt ? 'danger' : 'info' },
    { label: 'Dangerous MIME Type Header', detected: isDangerousMime, severity: isDangerousMime ? 'danger' : 'info' },
    { label: 'Compressed Archive Container (.zip / .rar)', detected: ext === '.zip' || ext === '.rar', severity: (ext === '.zip' || ext === '.rar') ? 'warning' : 'info' },
  ];

  const riskLevel = riskScore <= 20 ? 'safe' : riskScore <= 50 ? 'low' : riskScore <= 75 ? 'suspicious' : 'high';

  return {
    id: `file-${Date.now()}`,
    type: 'file',
    input: file.name,
    timestamp: new Date().toISOString(),
    riskScore,
    riskLevel,
    threatCategory,
    threatLabel,
    indicators,
    technicalExplanation: `File: ${file.name} (${(file.size / 1024).toFixed(1)} KB). Extension: ${ext}. MIME: ${file.type || 'unknown'}. Double Extension flag: ${isDoubleExt}.`,
    simpleExplanation: riskScore <= 20 
      ? 'This file format (e.g. standard PDF/Document/Image) displays standard non-executable characteristics.' 
      : 'This file contains an executable extension or script format commonly used by hackers to deliver malware.',
    recommendedAction: riskScore <= 20 
      ? 'You can open this file safely, but ensure your system antivirus is up to date.' 
      : 'Do NOT run or double-click this file! Delete it immediately or scan it with an offline antivirus scanner.',
    recommendations: [
      'Never open executable files (.exe, .vbs, .bat) received via email.',
      'Show hidden file extensions in your OS file explorer to spot double extensions.',
      'Upload suspicious attachments to Virustotal before opening.'
    ],
    entities: [file.name],
    details: { fileName: file.name, size: file.size, type: file.type, ext, isDoubleExt }
  };
}
