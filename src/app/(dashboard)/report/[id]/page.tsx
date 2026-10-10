'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield, ArrowLeft, Download, Share2, FileText, AlertTriangle,
  CheckCircle, XCircle, Info, Clock, Globe, MessageSquare, Mail,
  Camera, QrCode, ExternalLink, ShieldCheck, ShieldAlert, Flag, Check, Printer
} from 'lucide-react';
import { useHistory } from '@/lib/context/providers';
import { AnalysisResult } from '@/types';
import { getRiskColor } from '@/lib/constants';

const typeIcons: Record<string, React.ReactNode> = {
  url: <Globe className="w-5 h-5" />,
  message: <MessageSquare className="w-5 h-5" />,
  email: <Mail className="w-5 h-5" />,
  screenshot: <Camera className="w-5 h-5" />,
  qr: <QrCode className="w-5 h-5" />,
  website: <Globe className="w-5 h-5" />,
};

const DEFAULT_REPORT: AnalysisResult = {
  id: 'RPT-2026-98124',
  type: 'url',
  input: 'http://secure-sbi-kyc-update.xyz/verify?token=89234',
  timestamp: new Date().toISOString(),
  riskScore: 87,
  riskLevel: 'high',
  threatCategory: 'phishing',
  threatLabel: 'Phishing Website (Banking KYC Scam)',
  indicators: [
    { id: '1', name: 'Brand Impersonation', description: 'Domain mimics State Bank of India brand keywords', detected: true, severity: 'danger' },
    { id: '2', name: 'Newly Registered Domain', description: 'Domain registered < 7 days ago via anonymous proxy', detected: true, severity: 'danger' },
    { id: '3', name: 'Missing HTTPS Encryption', description: 'Data entered into this page is unencrypted and insecure', detected: true, severity: 'warning' },
    { id: '4', name: 'Credential Harvesting Form', description: 'Input fields request NetBanking password & OTP', detected: true, severity: 'danger' },
  ],
  technicalExplanation: 'The target URI contains multiple threat signatures. DNS resolution points to a bulletproof hosting provider frequently flagged for credential theft. Structural lexical analysis detected typosquatting, high character entropy, and an unauthorized payment gateway redirect hook.',
  simpleExplanation: '⚠️ This website is an impersonation trap pretending to be State Bank of India. It was registered recently by scammers to steal your bank password, OTP, and debit card PIN. Real banks never ask you to click urgent SMS links to update KYC.',
  recommendedAction: 'Do not enter passwords, OTPs, card details, or personal information. Close the tab immediately and report this incident to cybercrime authorities.',
  recommendations: [
    'Do not enter passwords, OTPs, card details, or personal information.',
    'Block the sending number or email domain.',
    'Report the URL to the National Cyber Crime Reporting Portal (cybercrime.gov.in).'
  ],
  entities: ['sbi-kyc-update.xyz', 'HTTP', 'Banking Scam'],
  details: {
    domain: 'secure-sbi-kyc-update.xyz',
    protocol: 'HTTP',
    isHttps: false,
    domainAge: '3 days old',
    redirects: 2,
    domainReputation: 'Malicious',
    registrar: 'NameCheap, Inc.',
    hostingProvider: 'Cloudflare Proxy'
  }
};

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const { history } = useHistory();
  const [result, setResult] = useState<AnalysisResult>(DEFAULT_REPORT);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = params?.id as string;
    if (id) {
      const found = history.find(h => h.id === id);
      if (found) {
        setResult(found);
      }
    }
  }, [params, history]);

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleShare = () => {
    const shareText = `SAFEGUARD AI SECURITY REPORT\nID: ${result.id}\nTarget: ${result.input}\nRisk Score: ${result.riskScore}/100 (${result.riskLevel.toUpperCase()})\nVerdict: ${result.threatLabel || 'Threat Detected'}`;
    
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formattedDate = new Date(result.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 font-sans text-slate-100">
      
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1D3038] pb-5 print:hidden">
        <Link
          href="/history"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Threat History</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E171F] border border-[#1D3038] hover:border-cyan-400 text-xs font-mono text-slate-200 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? 'Copied Summary!' : 'Share Report'}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          >
            <Printer className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Canvas (Section 15: SAFEGUARD AI SECURITY REPORT) */}
      <div id="printable-report" className="bg-[#0E171F] border border-[#1D3038] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 print:bg-white print:text-black print:border-black print:p-8">
        
        {/* Formal Report Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1D3038] pb-6 print:border-slate-300">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 print:border-slate-800">
              <Shield className="w-8 h-8 text-cyan-400 print:text-cyan-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white print:text-black font-mono">
                SAFEGUARD AI SECURITY REPORT
              </h1>
              <p className="text-xs text-slate-400 print:text-slate-600 font-mono mt-0.5">
                Official Incident Telemetry & AI Forensic Analysis Document
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs space-y-0.5">
            <div className="text-slate-400 print:text-slate-600">
              Analysis ID: <span className="text-cyan-400 print:text-cyan-600 font-bold">{result.id}</span>
            </div>
            <div className="text-slate-500 print:text-slate-600 text-[11px]">{formattedDate}</div>
          </div>
        </div>

        {/* Executive Summary Grid (Section 15) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 bg-[#050A0F] print:bg-slate-100 rounded-2xl border border-[#1D3038] print:border-slate-300 space-y-1">
            <span className="text-[10px] uppercase text-slate-500">Input Type</span>
            <div className="text-sm font-bold text-white print:text-black uppercase flex items-center gap-1.5">
              {typeIcons[result.type] || <Globe className="w-4 h-4 text-cyan-400" />}
              <span>{result.type}</span>
            </div>
          </div>

          <div className="p-4 bg-[#050A0F] print:bg-slate-100 rounded-2xl border border-[#1D3038] print:border-slate-300 space-y-1">
            <span className="text-[10px] uppercase text-slate-500">Risk Score</span>
            <div className={`text-xl font-black ${result.riskScore > 50 ? 'text-red-400 print:text-red-600' : 'text-emerald-400'}`}>
              {result.riskScore}/100
            </div>
          </div>

          <div className="p-4 bg-[#050A0F] print:bg-slate-100 rounded-2xl border border-[#1D3038] print:border-slate-300 space-y-1">
            <span className="text-[10px] uppercase text-slate-500">Risk Level</span>
            <div className={`text-sm font-black uppercase ${result.riskScore > 50 ? 'text-red-400 print:text-red-600' : 'text-emerald-400'}`}>
              {result.riskLevel}
            </div>
          </div>

          <div className="p-4 bg-[#050A0F] print:bg-slate-100 rounded-2xl border border-[#1D3038] print:border-slate-300 space-y-1">
            <span className="text-[10px] uppercase text-slate-500">Threat Verdict</span>
            <div className="text-xs font-bold text-white print:text-black truncate">
              {result.threatLabel || result.classification || 'Threat Analysis'}
            </div>
          </div>
        </div>

        {/* Submitted Target Content Box */}
        <div className="space-y-2 font-mono text-xs">
          <span className="text-slate-400 print:text-slate-600 uppercase text-[11px] font-bold">
            Target Content Analyzed
          </span>
          <div className="p-4 bg-[#050A0F] print:bg-slate-50 rounded-2xl border border-[#1D3038] print:border-slate-300 text-slate-200 print:text-black break-all select-all">
            {result.input}
          </div>
        </div>

        {/* Detected Threat Indicators (Section 15) */}
        <div className="space-y-3 font-mono text-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 print:text-amber-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Detected Threat Indicators</span>
          </h3>

          <div className="space-y-2">
            {(result.indicators || []).map((indicator: any, idx: number) => (
              <div 
                key={idx}
                className="p-3.5 bg-[#050A0F] print:bg-slate-50 rounded-xl border border-[#1D3038] print:border-slate-300 flex items-start gap-3"
              >
                <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${indicator.detected ? 'bg-red-400' : 'bg-emerald-400'}`} />
                <div className="space-y-0.5">
                  <span className="font-bold text-white print:text-black block">
                    {indicator.name || indicator.label || 'Indicator'}
                  </span>
                  <p className="text-slate-400 print:text-slate-600 text-xs">
                    {indicator.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Explanations Section (Section 15: Simple & Technical) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* Simple Explanation */}
          <div className="p-5 rounded-2xl bg-[#050A0F] print:bg-slate-50 border border-[#1D3038] print:border-slate-300 space-y-2">
            <span className="text-cyan-400 print:text-cyan-700 font-bold uppercase text-[11px] block">
              Plain-Language Explanation
            </span>
            <p className="text-slate-300 print:text-slate-800 leading-relaxed font-sans text-xs sm:text-sm">
              {result.simpleExplanation || result.explanation || 'No plain explanation generated.'}
            </p>
          </div>

          {/* Technical Details */}
          <div className="p-5 rounded-2xl bg-[#050A0F] print:bg-slate-50 border border-[#1D3038] print:border-slate-300 space-y-2">
            <span className="text-slate-400 print:text-slate-700 font-bold uppercase text-[11px] block">
              Technical Forensics
            </span>
            <p className="text-slate-400 print:text-slate-700 leading-relaxed text-xs">
              {result.technicalExplanation || 'Automated feature extraction confirmed anomaly thresholds exceeded.'}
            </p>
          </div>
        </div>

        {/* Recommended Actions (Section 15) */}
        <div className={`p-5 rounded-2xl border space-y-2 font-mono text-xs ${
          result.riskScore > 50 
            ? 'bg-red-950/20 print:bg-red-50 border-red-500/40 print:border-red-400 text-slate-100 print:text-red-900' 
            : 'bg-emerald-950/20 print:bg-emerald-50 border-emerald-500/40 print:border-emerald-400 text-slate-100 print:text-emerald-900'
        }`}>
          <div className="flex items-center gap-2">
            <Shield className={`w-4 h-4 ${result.riskScore > 50 ? 'text-red-400' : 'text-emerald-400'}`} />
            <span className="font-bold uppercase tracking-wider text-sm">RECOMMENDED SAFETY ACTIONS</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed">
            {result.recommendedAction}
          </p>
        </div>

        {/* Technical Metadata Dossier */}
        {result.details && Object.keys(result.details).length > 0 && (
          <div className="p-5 rounded-2xl bg-[#050A0F] print:bg-slate-50 border border-[#1D3038] print:border-slate-300 space-y-3 font-mono text-xs">
            <span className="text-slate-400 print:text-slate-600 font-bold uppercase text-[11px] block">
              Technical Metadata
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              {Object.entries(result.details).slice(0, 8).map(([key, value]) => (
                <div key={key} className="space-y-0.5">
                  <span className="text-slate-500 uppercase text-[10px] block">{key}</span>
                  <span className="text-slate-200 print:text-black font-semibold truncate block">
                    {typeof value === 'boolean' ? (value ? 'True' : 'False') : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report Footer / Signature */}
        <div className="pt-6 border-t border-[#1D3038] print:border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] font-mono text-slate-500">
          <div>
            Generated by SafeGuard AI Automated Threat Intelligence Unit • Hash: {result.id}
          </div>
          <div>
            Digital India Cyber Defense Framework
          </div>
        </div>

      </div>

    </div>
  );
}
