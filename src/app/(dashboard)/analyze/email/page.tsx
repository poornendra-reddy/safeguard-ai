'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, AlertTriangle, CheckCircle, ShieldAlert, ShieldCheck, 
  RefreshCw, AlertCircle, FileText, Zap, Info, Shield, Link as LinkIcon,
  Sparkles, Check, HelpCircle, AlertOctagon, UserX, ExternalLink, History
} from 'lucide-react';
import { ANALYSIS_STEPS, getRiskColor } from '@/lib/constants';
import { useHistory } from '@/lib/context/providers';
import { analyzeEmail } from '@/lib/ai/email-analyzer';
import { safeguardAPI } from '@/lib/api-client';
import Link from 'next/link';

export default function EmailAnalyzerPage() {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [links, setLinks] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [isNewbieMode, setIsNewbieMode] = useState(false);
  const [error, setError] = useState('');
  
  const { addToHistory } = useHistory();

  const handleDemoPreset = () => {
    setSender('security-alert@paypal-verify.xyz');
    setSubject('URGENT: Your PayPal account has been compromised');
    setBody('Dear Customer, We have detected unauthorized access to your PayPal account. Your account will be suspended within 24 hours unless you verify your identity. Click here to verify: http://paypal-secure.xyz/verify Please update your password and security questions immediately. PayPal Security Team');
    setLinks('http://paypal-secure.xyz/verify');
    setError('');
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!sender.trim() && !body.trim()) {
      setError('Please enter at least a sender email or email body');
      return;
    }
    
    setError('');
    setIsAnalyzing(true);
    setResult(null);
    setCurrentStep(0);

    try {
      const stepTimer = setInterval(() => {
        setCurrentStep(prev => (prev < (ANALYSIS_STEPS?.length || 6) - 1 ? prev + 1 : prev));
      }, 350);

      let finalResult: any = null;
      try {
        finalResult = await safeguardAPI.scanEmail({
          sender: sender.trim(),
          subject: subject.trim(),
          body: body.trim(),
          links: links.trim() || undefined
        });
      } catch (apiErr: any) {
        console.warn('Backend API notice, using local engine fallback:', apiErr?.message);
        finalResult = analyzeEmail(sender, subject, `${body}${links ? `\nLinks: ${links}` : ''}`);
      }

      await new Promise(r => setTimeout(r, 2200));
      clearInterval(stepTimer);

      setResult(finalResult);
      addToHistory(finalResult);
    } catch (err: any) {
      setError(err?.message || 'Analysis failed. Please check your inputs and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearForm = () => {
    setSender('');
    setSubject('');
    setBody('');
    setLinks('');
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
            <Mail className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Email Phishing Analyzer</h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
              Domain mismatch, brand spoofing verification, credential harvester & SPF/DKIM audit
            </p>
          </div>
        </div>

        {/* Threat History Link */}
        <div className="flex items-center gap-2">
          <Link
            href="/history"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0E171F] border border-[#1D3038] hover:border-cyan-400 text-xs font-mono text-cyan-400 transition-colors"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="sender" className="block text-xs font-mono uppercase tracking-wider text-slate-300">
              Sender Email
            </label>
            <input
              id="sender"
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g. support@netflix-billing-update.xyz"
              className="w-full bg-[#050A0F] border border-[#1D3038] rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-all"
              disabled={isAnalyzing}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-wider text-slate-300">
              Email Subject Line
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Your Subscription is Suspended - Action Required"
              className="w-full bg-[#050A0F] border border-[#1D3038] rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-all"
              disabled={isAnalyzing}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="body" className="block text-xs font-mono uppercase tracking-wider text-slate-300">
            Email Body Content
          </label>
          <textarea
            id="body"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste full or partial email body here..."
            className="w-full bg-[#050A0F] border border-[#1D3038] rounded-2xl p-4 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
            disabled={isAnalyzing}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="links" className="block text-xs font-mono uppercase tracking-wider text-slate-300">
            Embedded Link(s) in Email (Optional)
          </label>
          <input
            id="links"
            type="text"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            placeholder="e.g. http://netflix-secure-login.xyz/pay-auth"
            className="w-full bg-[#050A0F] border border-[#1D3038] rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-all"
            disabled={isAnalyzing}
          />
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
              disabled={isAnalyzing || (!sender && !body)}
              className="px-7 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:opacity-50 flex items-center gap-2"
            >
              {isAnalyzing ? (
                <><RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> Auditing Email Vectors...</>
              ) : (
                <><Zap className="w-4 h-4 text-slate-950" /> Analyze Email</>
              )}
            </button>

            <button
              type="button"
              onClick={handleDemoPreset}
              disabled={isAnalyzing}
              className="px-5 py-3 border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
              title="Load example spoofed phishing email"
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
            Extracts domain mismatch, spoofing headers & malicious attachment indicators
          </span>
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
                      Analyzing Email Authenticity
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">Cross-checking sender domain against claimed brand identity</p>
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

      {/* Results Display */}
      <AnimatePresence>
        {result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Top Cards: Score Meter & Detected Indicators */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Risk Score Meter */}
              <div className="lg:col-span-5 bg-[#0E171F] border border-[#1D3038] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
                <div className="flex items-center justify-between w-full border-b border-[#1D3038] pb-3">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
                    EMAIL THREAT SCORE
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-black uppercase ${
                    result.riskScore > 75 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                      : result.riskScore > 50 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
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
                    <span className="text-xs font-mono text-slate-400 mt-1">/ 100 Threat</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-lg font-bold text-white flex items-center justify-center gap-2">
                    {result.riskScore > 50 ? (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    )}
                    <span>{result.threatLabel || result.classification || 'Phishing Email'}</span>
                  </div>
                  <p className="text-xs font-mono text-slate-400">
                    Sender: {sender || 'Parsed Sender'}
                  </p>
                </div>
              </div>

              {/* Email Forensics & Indicators (Section 7) */}
              <div className="lg:col-span-7 bg-[#0E171F] border border-[#1D3038] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#1D3038] pb-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>EMAIL SPOOFING & HEADER FORENSICS</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">Authentication Dossier</span>
                </div>

                {/* Detected Indicators List */}
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-2">
                  {result.indicators?.filter((i: any) => i.detected).map((ind: any, i: number) => (
                    <div 
                      key={i} 
                      className="p-3 rounded-xl bg-[#050A0F] border border-[#1D3038] flex items-start gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-100 font-mono block">
                          {ind.label || ind.name || 'Email Anomaly'}
                        </span>
                        <p className="text-xs text-slate-400 font-mono">
                          {ind.description}
                        </p>
                      </div>
                    </div>
                  ))}

                  {(!result.indicators || result.indicators.filter((i: any) => i.detected).length === 0) && (
                    <div className="p-4 rounded-xl bg-[#050A0F] border border-[#1D3038] text-xs font-mono text-slate-400">
                      Legitimate sender signatures, no spoofing or domain mismatch detected.
                    </div>
                  )}
                </div>

                {/* Key Summary Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1D3038] font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-[#050A0F] text-center border border-[#1D3038]">
                    <span className="text-slate-500 text-[10px] block uppercase">Domain Match</span>
                    <span className={`font-bold ${result.details?.domainMismatch ? 'text-red-400' : 'text-emerald-400'}`}>
                      {result.details?.domainMismatch ? 'MISMATCH' : 'VALID'}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#050A0F] text-center border border-[#1D3038]">
                    <span className="text-slate-500 text-[10px] block uppercase">Impersonation</span>
                    <span className={`font-bold ${result.details?.brandImpersonation ? 'text-red-400' : 'text-slate-300'}`}>
                      {result.details?.brandImpersonation || 'NONE'}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#050A0F] text-center border border-[#1D3038]">
                    <span className="text-slate-500 text-[10px] block uppercase">Attachments</span>
                    <span className={`font-bold ${result.details?.suspiciousAttachments ? 'text-red-400' : 'text-slate-300'}`}>
                      {result.details?.suspiciousAttachments ? 'RISKY' : 'CLEAN'}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#050A0F] text-center border border-[#1D3038]">
                    <span className="text-slate-500 text-[10px] block uppercase">Harvesting</span>
                    <span className={`font-bold ${result.details?.credentialHarvesting ? 'text-red-400' : 'text-slate-300'}`}>
                      {result.details?.credentialHarvesting ? 'YES' : 'NO'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* AI Explanation Engine with "Explain Like I'm New to Cybersecurity" */}
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
                    <p className="text-[11px] text-slate-400 font-mono">Simple plain-language risk breakdown</p>
                  </div>
                </div>

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
                      {result.simpleExplanation || (
                        result.riskScore > 75 
                          ? '⚠️ This email is an impersonation scam. Notice that while it claims to come from a major service like PayPal or Netflix, the actual sender address belongs to a completely different, suspicious website. Real companies will never ask you to click urgent password links from unfamiliar web addresses.'
                          : 'This email appears legitimate. The sender domain matches the claimed service and contains no deceptive link tricks.'
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 font-mono">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#111C24] text-slate-400 text-xs font-semibold">
                      ⚙️ TECHNICAL SECURITY BREAKDOWN
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {result.technicalExplanation || `Analyzed sender domain against DKIM/SPF alignment and corporate identity records. Extracted embedded hyperlinks and body text tokens to calculate an aggregated threat score of ${result.riskScore}/100.`}
                    </p>
                  </div>
                )}
              </div>

              {/* Recommended Action */}
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
                  {result.recommendedAction || 'Do NOT click any links, open attachments, or reply with passwords. Mark as Phishing in your email client immediately.'}
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
                    href={`/report-scam?email=${encodeURIComponent(sender)}`}
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
