'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield, ArrowLeft, Download, Share2, FileText, AlertTriangle,
  CheckCircle, XCircle, Info, Clock, Globe, MessageSquare, Mail,
  Camera, QrCode, ExternalLink, ShieldCheck, ShieldAlert, Flag
} from 'lucide-react';
import { useHistory } from '@/lib/context/providers';
import { AnalysisResult, ThreatCategory } from '@/types';
import { RISK_LEVELS, getRiskColor, THREAT_CATEGORIES } from '@/lib/constants';

const typeIcons: Record<string, React.ReactNode> = {
  url: <Globe className="w-5 h-5" />,
  message: <MessageSquare className="w-5 h-5" />,
  email: <Mail className="w-5 h-5" />,
  screenshot: <Camera className="w-5 h-5" />,
  qr: <QrCode className="w-5 h-5" />,
  website: <Globe className="w-5 h-5" />,
};

const typeLabels: Record<string, string> = {
  url: 'URL Analysis',
  message: 'Message Analysis',
  email: 'Email Analysis',
  screenshot: 'Screenshot Analysis',
  qr: 'QR Code Analysis',
  website: 'Website Analysis',
};

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const { history } = useHistory();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const id = params.id as string;
    const found = history.find(h => h.id === id);
    if (found) {
      setResult(found);
    }
  }, [params.id, history]);

  const handleDownloadPDF = () => {
    alert('PDF report download would be generated here. In production, this uses html2canvas + jspdf.');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'TrustNetra Security Report',
        text: `Security analysis report - Risk Score: ${result?.riskScore}/100`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard!');
    }
  };

  if (!result) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Report Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">This analysis report may have been deleted or does not exist.</p>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to History
          </Link>
        </motion.div>
      </div>
    );
  }

  const riskLevel = RISK_LEVELS[result.riskLevel];
  const riskColor = getRiskColor(result.riskScore);
  const threatInfo = THREAT_CATEGORIES[result.threatCategory as ThreatCategory] || THREAT_CATEGORIES.safe;
  const detectedIndicators = result.indicators.filter(i => i.detected);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-cyan-500 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </motion.div>

      {/* Report Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800/50 bg-white dark:bg-gray-900/50 backdrop-blur-xl p-8"
      >
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: riskColor }} />
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <Shield className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TRUSTNETRA SECURITY REPORT</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive Threat Analysis</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Analysis ID</p>
            <p className="font-mono text-gray-900 dark:text-white">{result.id}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Date & Time</p>
            <p className="text-gray-900 dark:text-white">{new Date(result.timestamp).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Input Type</p>
            <div className="flex items-center gap-1.5 text-gray-900 dark:text-white">
              {typeIcons[result.type]} {typeLabels[result.type]}
            </div>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Status</p>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              result.riskLevel === 'safe' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
              result.riskLevel === 'low' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
              result.riskLevel === 'suspicious' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {result.riskLevel === 'safe' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
              {riskLevel.label}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Risk Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-gray-200 dark:border-gray-800/50 bg-white dark:bg-gray-900/50 backdrop-blur-xl p-8 text-center"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Risk Assessment</h2>
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-800" />
            <circle
              cx="60" cy="60" r="50" fill="none" stroke={riskColor} strokeWidth="8"
              strokeDasharray={`${(result.riskScore / 100) * 314} 314`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ color: riskColor }}>{result.riskScore}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">/100</span>
          </div>
        </div>
        <p className={`text-lg font-bold ${riskLevel.color}`}>{riskLevel.label}</p>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{result.threatLabel}</p>
      </motion.div>

      {/* Analyzed Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-gray-200 dark:border-gray-800/50 bg-white dark:bg-gray-900/50 backdrop-blur-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Analyzed Content</h3>
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 font-mono text-sm text-gray-700 dark:text-gray-300 break-all">
          {result.input}
        </div>
      </motion.div>

      {/* Detected Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-gray-200 dark:border-gray-800/50 bg-white dark:bg-gray-900/50 backdrop-blur-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detected Indicators</h3>
        <div className="space-y-3">
          {result.indicators.map(indicator => (
            <div
              key={indicator.id}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                indicator.detected
                  ? indicator.severity === 'danger'
                    ? 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30'
                    : 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30'
                  : 'bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/30'
              }`}
            >
              {indicator.detected ? (
                indicator.severity === 'danger' ? (
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                )
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className={`font-medium text-sm ${indicator.detected ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                  {indicator.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{indicator.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-gray-200 dark:border-gray-800/50 bg-white dark:bg-gray-900/50 backdrop-blur-xl p-6 space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Analysis</h3>
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Technical Explanation</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{result.technicalExplanation}</p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" /> Simple Explanation
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{result.simpleExplanation}</p>
        </div>
      </motion.div>

      {/* Recommended Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`rounded-2xl border p-6 ${
          result.riskScore > 75
            ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'
            : result.riskScore > 50
            ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30'
            : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30'
        }`}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" /> Recommended Action
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">{result.recommendedAction}</p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-wrap gap-3 justify-center pt-4"
      >
        <Link
          href={`/analyze/${result.type}`}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-colors font-medium"
        >
          <ExternalLink className="w-4 h-4" /> Analyze Another
        </Link>
        <Link
          href="/report-scam"
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors font-medium"
        >
          <Flag className="w-4 h-4" /> Report Threat
        </Link>
        <Link
          href="/history"
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors font-medium"
        >
          <Clock className="w-4 h-4" /> View History
        </Link>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-xs text-gray-400 dark:text-gray-500 py-4"
      >
        <p>AI analysis provides risk indicators and should not be considered an absolute guarantee that content is safe or malicious.</p>
        <p className="mt-1">TrustNetra &mdash; Detect. Understand. Stay Safe.</p>
      </motion.div>
    </div>
  );
}
