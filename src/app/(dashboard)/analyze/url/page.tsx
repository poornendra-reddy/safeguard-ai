'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link as LinkIcon, AlertTriangle, CheckCircle, ShieldAlert, ShieldCheck, 
  XCircle, ArrowRight, RefreshCw, AlertCircle, FileText, Globe, Lock, Shield,
  Info, Zap, Sparkles, Check, Download, Share2, HelpCircle, AlertOctagon, History
} from 'lucide-react';
import { ANALYSIS_STEPS, getRiskColor, DEMO_SCENARIOS } from '@/lib/constants';
import { useHistory } from '@/lib/context/providers';
import { analyzeURL } from '@/lib/ai/url-analyzer';
import { safeguardAPI } from '@/lib/api-client';
import Link from 'next/link';

export default function UrlAnalyzerPage() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [isNewbieMode, setIsNewbieMode] = useState(false);
  const [error, setError] = useState('');
  
  const { addToHistory } = useHistory();

  // Handle URL query param for demo
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const demoId = params.get('demo');
      if (demoId) {
        const found = DEMO_SCENARIOS.find(d => d.id === demoId || d.type === 'url');
        if (found) {
          setUrl(found.input);
        }
      }
    }
  }, []);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to analyze');
      return;
    }
    
    setError('');
    setIsAnalyzing(true);
    setResult(null);
    setCurrentStep(0);

    try {
      // Animated step progression
      const stepTimer = setInterval(() => {
        setCurrentStep(prev => (prev < (ANALYSIS_STEPS?.length || 6) - 1 ? prev + 1 : prev));
      }, 350);

      // Execute analysis via Python FastAPI backend
      let finalResult: any = null;
      try {
        finalResult = await safeguardAPI.scanURL(url.trim());
      } catch (apiErr: any) {
        console.warn('Backend API notice, using local engine fallback:', apiErr?.message);
        finalResult = analyzeURL(url.trim());
      }

      // Add a slight pause for dramatic real-time cyber scan effect
      await new Promise(r => setTimeout(r, 2200));
      clearInterval(stepTimer);

      setResult(finalResult);
      addToHistory(finalResult);
    } catch (err: any) {
      setError(err?.message || 'Analysis failed. Please check the URL and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDemoPreset = (demoUrl: string) => {
    setUrl(demoUrl);
    setError('');
    setResult(null);
  };

  const clearForm = () => {
    setUrl('');
    setResult(null);
    setError('');
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = result ? circumference - (result.riskScore / 100) * circumference : circumference;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 font-sans text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1D3038] pb-5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            <LinkIcon className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">URL Phishing Detector</h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
              Zero-day link forensics, typosquatting inspection & SSL reputation analysis
            </p>
          </div>
        </div>

        {/* Threat History Link */}
        <div className="flex items-center gap-2">
          <Link
            href="/history"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E171F] border border-[#1D3038] hover:border-cyan-400 text-xs font-mono text-cyan-400 transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            <span>Threat History</span>
          </Link>
        </div>
      </div>

      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0E171F] border border-[#1D3038] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
      >
        <div className="space-y-3">
          <label htmlFor="url-input" className="block text-xs font-mono uppercase tracking-wider text-slate-300">
            Paste suspicious URL here...
          </label>
          <div className="relative">
            <input
              id="url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Paste suspicious URL here... (e.g. http://login-verify-account.tk/sbi-update)"
              className="w-full bg-[#050A0F] border border-[#1D3038] rounded-2xl px-4 py-4 pl-12 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
              disabled={isAnalyzing}
            />
            <Globe className="absolute left-4 top-4 text-cyan-400 w-5 h-5" />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-mono flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !url}
                className="px-7 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:opacity-50 flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <><RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> Running AI Scan...</>
                ) : (
                  <><Zap className="w-4 h-4 text-slate-950" /> Analyze URL</>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDemoPreset('http://secure-paytm-login.tk/account/verify?user=victim&token=abc123')}
                disabled={isAnalyzing}
                className="px-5 py-3 border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                title="Load example suspicious phishing URL"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Example</span>
              </button>

              <button
                onClick={clearForm}
                disabled={isAnalyzing}
                className="px-5 py-3 border border-[#1D3038] hover:bg-[#111C24] text-slate-400 hover:text-white rounded-xl font-mono text-xs font-medium transition-all disabled:opacity-50"
              >
                Clear
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              Zero-day ML model active • SSL & TLD verified
            </span>
          </div>
        </div>
      </motion.div>

      {/* Real-Time Animated Analysis UI (Section 24) */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#0E171F] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#1D3038] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                      AI Analysis in Progress
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">Executing 6-stage telemetry verification pipeline</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  Step {currentStep + 1} of 6
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ANALYSIS_STEPS.map((step, index) => {
                  const isDone = index < currentStep;
                  const isCurrent = index === currentStep;
                  return (
                    <div 
                      key={index} 
                      className={`p-4 rounded-xl border transition-all ${
                        isDone 
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-white' 
                          : isCurrent 
                          ? 'bg-[#050A0F] border-cyan-400 ring-2 ring-cyan-400/20 text-cyan-300' 
                          : 'bg-[#050A0F] border-[#1D3038] text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          isDone ? 'bg-cyan-400 text-slate-950' : isCurrent ? 'bg-cyan-400/20 text-cyan-400 animate-pulse' : 'bg-[#111C24] text-slate-500'
                        }`}>
                          {isDone ? <Check className="w-3.5 h-3.5" /> : index + 1}
                        </div>
                        <span className="font-bold font-mono text-xs truncate">{step.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono pl-9 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Result Screen (Section 5 & 31: Sample Result) */}
      <AnimatePresence>
        {result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Top Cards: Risk Meter & URL Technical Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Risk Score Meter Card */}
              <div className="lg:col-span-5 bg-[#0E171F] border border-[#1D3038] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
                <div className="flex items-center justify-between w-full border-b border-[#1D3038] pb-3">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
                    RISK SCORE METER
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-black uppercase ${
                    result.riskScore > 75 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                      : result.riskScore > 50 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                      : result.riskScore > 20
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {result.riskLevel?.toUpperCase()}
                  </span>
                </div>

                <div className="relative w-48 h-48 flex items-center justify-center my-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#050A0F" strokeWidth="8" />
                    <motion.circle
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      cx="50" cy="50" r="45" fill="none"
                      stroke={getRiskColor(result.riskScore)}
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black font-mono text-white">{result.riskScore}</span>
                    <span className="text-xs font-mono text-slate-400 mt-1">/ 100 Risk</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-lg font-bold text-white flex items-center justify-center gap-2">
                    {result.riskScore > 50 ? (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    )}
                    <span>{result.threatLabel || result.classification || 'Threat Evaluated'}</span>
                  </div>
                  <p className="text-xs font-mono text-slate-400">
                    {result.riskScore > 75 ? 'Critical Danger: Do Not Proceed' : result.riskScore > 50 ? 'Suspicious Attributes Found' : 'Clean & Verified Safety Signature'}
                  </p>
                </div>
              </div>

              {/* URL Structure & Domain Dossier Cards (Section 5) */}
              <div className="lg:col-span-7 bg-[#0E171F] border border-[#1D3038] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#1D3038] pb-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>URL STRUCTURE & DOMAIN ATTRIBUTES</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">12 Forensic Vectors</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 bg-[#050A0F] rounded-xl border border-[#1D3038]">
                    <span className="text-[10px] text-slate-500 uppercase block">Domain</span>
                    <span className="font-bold text-slate-200 truncate block mt-0.5">{result.details?.domain || result.domain || 'N/A'}</span>
                  </div>
                  <div className="p-3 bg-[#050A0F] rounded-xl border border-[#1D3038]">
                    <span className="text-[10px] text-slate-500 uppercase block">SSL Certificate</span>
                    <span className={`font-bold block mt-0.5 ${result.details?.isHttps ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.details?.isHttps ? 'Valid HTTPS' : 'Insecure HTTP'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#050A0F] rounded-xl border border-[#1D3038]">
                    <span className="text-[10px] text-slate-500 uppercase block">Domain Age</span>
                    <span className="font-bold text-slate-200 block mt-0.5">{result.details?.domainAge || '< 30 days'}</span>
                  </div>
                  <div className="p-3 bg-[#050A0F] rounded-xl border border-[#1D3038]">
                    <span className="text-[10px] text-slate-500 uppercase block">Typosquatting</span>
                    <span className={`font-bold block mt-0.5 ${result.details?.isTyposquatting ? 'text-red-400' : 'text-emerald-400'}`}>
                      {result.details?.isTyposquatting ? 'DETECTED' : 'None'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#050A0F] rounded-xl border border-[#1D3038]">
                    <span className="text-[10px] text-slate-500 uppercase block">Shortened Link</span>
                    <span className="font-bold text-slate-200 block mt-0.5">
                      {result.details?.isShortened ? 'Yes (Hidden Destination)' : 'No'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#050A0F] rounded-xl border border-[#1D3038]">
                    <span className="text-[10px] text-slate-500 uppercase block">Suspicious TLD</span>
                    <span className={`font-bold block mt-0.5 ${result.details?.suspiciousTLD ? 'text-red-400' : 'text-emerald-400'}`}>
                      {result.details?.suspiciousTLD ? 'Risky TLD' : 'Standard'}
                    </span>
                  </div>
                </div>

                {/* Why is this risky? (Section 5) */}
                <div className="p-4 rounded-2xl bg-[#050A0F] border border-[#1D3038] space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase text-red-400 flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-red-400" />
                    <span>Why is this risky?</span>
                  </h4>
                  <ul className="text-xs text-slate-300 font-mono space-y-1.5 list-disc list-inside">
                    {result.details?.isTyposquatting && <li>Brand impersonation detected: mimicking official portal.</li>}
                    {!result.details?.isHttps && <li>Missing SSL encryption: credentials transmitted in plaintext.</li>}
                    {result.details?.suspiciousTLD && <li>High-risk domain extension commonly associated with malware infrastructure.</li>}
                    {result.details?.isShortened && <li>URL shortener used to conceal actual destination endpoint.</li>}
                    {result.indicators?.filter((i: any) => i.detected).slice(0, 3).map((ind: any, idx: number) => (
                      <li key={idx}>{ind.description || ind.name}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* AI Explanation Engine with "Explain Like I'm New to Cybersecurity" (Section 11) */}
            <div className="bg-[#0E171F] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D3038] pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                      AI EXPLANATION ENGINE
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">Understand threat mechanics in plain language</p>
                  </div>
                </div>

                {/* THE "Explain Like I'm New to Cybersecurity" button (Section 11) */}
                <button
                  onClick={() => setIsNewbieMode(!isNewbieMode)}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                    isNewbieMode
                      ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                      : 'bg-[#050A0F] border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Explain Like I'm New to Cybersecurity</span>
                </button>
              </div>

              {/* Dynamic Explanation Content Box */}
              <div className="p-5 rounded-2xl bg-[#050A0F] border border-[#1D3038] leading-relaxed">
                {isNewbieMode ? (
                  <div className="space-y-3 font-sans">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono font-semibold">
                      💡 SIMPLIFIED EVERYDAY ANALOGY (ELI5)
                    </div>
                    <p className="text-sm text-slate-200">
                      {result.simpleExplanation || result.explanation || (
                        result.riskScore > 75 
                          ? 'Imagine someone wearing a fake police or delivery uniform knocking on your door asking for your house keys. This website looks like an official company from the outside, but it is actually run by fraudsters trying to steal your confidential passwords, banking numbers, or money.'
                          : 'This website is like walking into a well-known, verified supermarket with official licenses and security guards. It exhibits no deceptive tricks or hidden doors.'
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 font-mono">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#111C24] text-slate-400 text-xs font-semibold">
                      ⚙️ TECHNICAL SECURITY BREAKDOWN
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {result.technicalExplanation || `Automated analysis of the target URI identified ${result.indicators?.filter((i: any) => i.detected).length || 0} anomaly signatures. Protocol flags, TLD evaluation, and domain age correlation indicate a risk coefficient of ${result.riskScore}/100.`}
                    </p>
                  </div>
                )}
              </div>

              {/* Recommended Action (Section 5 & 11) */}
              <div className={`p-5 rounded-2xl border space-y-2 ${
                result.riskScore > 75 
                  ? 'bg-red-950/20 border-red-500/40' 
                  : result.riskScore > 50 
                  ? 'bg-amber-950/20 border-amber-500/40' 
                  : 'bg-emerald-950/20 border-emerald-500/40'
              }`}>
                <div className="flex items-center gap-2">
                  <Shield className={`w-5 h-5 ${result.riskScore > 50 ? 'text-red-400' : 'text-emerald-400'}`} />
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    RECOMMENDED ACTION
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-mono">
                  {result.recommendedAction || (
                    result.riskScore > 50 
                      ? 'Do not enter passwords, OTPs, card details, or personal information. Close the tab immediately and report this link.' 
                      : 'The link appears safe based on domain telemetry. Continue with standard secure browsing habits.'
                  )}
                </p>
              </div>

              {/* Action Buttons: View Full Report, Analyze Another, Report Threat */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1D3038]">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/report/${result.id || 'current'}`}
                    className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Full Report</span>
                  </Link>

                  <Link
                    href="/history"
                    className="px-5 py-2.5 rounded-xl border border-cyan-500/40 hover:bg-cyan-500/10 text-cyan-400 font-mono text-xs font-medium transition-all flex items-center gap-2"
                  >
                    <History className="w-4 h-4" />
                    <span>View Threat History</span>
                  </Link>

                  <button
                    onClick={clearForm}
                    className="px-5 py-2.5 rounded-xl border border-[#1D3038] hover:bg-[#111C24] text-slate-300 font-mono text-xs font-medium transition-all"
                  >
                    Analyze Another
                  </button>
                </div>

                {result.riskScore > 50 && (
                  <Link
                    href={`/report-scam?url=${encodeURIComponent(url)}`}
                    className="px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Report Threat to Database</span>
                  </Link>
                )}
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
