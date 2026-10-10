'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, AlertTriangle, CheckCircle, ShieldAlert, ShieldCheck, 
  RefreshCw, AlertCircle, FileText, Zap, Info, Shield, MessageCircle, Send,
  Smartphone, Hash, ArrowUpRight, Sparkles, Check, HelpCircle, AlertOctagon,
  CreditCard, Gift, Clock, UserX, History
} from 'lucide-react';
import { ANALYSIS_STEPS, getRiskColor, DEMO_SCENARIOS } from '@/lib/constants';
import { useHistory } from '@/lib/context/providers';
import { analyzeMessage } from '@/lib/ai/message-analyzer';
import { safeguardAPI } from '@/lib/api-client';
import Link from 'next/link';

type MessageType = 'SMS' | 'WhatsApp' | 'Telegram' | 'Social Media' | 'Unknown Message';

const MESSAGE_SOURCES: { type: MessageType; icon: React.FC<any> }[] = [
  { type: 'SMS', icon: Smartphone },
  { type: 'WhatsApp', icon: MessageCircle },
  { type: 'Telegram', icon: Send },
  { type: 'Social Media', icon: Hash },
  { type: 'Unknown Message', icon: MessageSquare },
];

export default function MessageAnalyzerPage() {
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState<MessageType>('SMS');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [isNewbieMode, setIsNewbieMode] = useState(false);
  const [error, setError] = useState('');
  
  const { addToHistory } = useHistory();

  // Handle query param for demo
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const demoId = params.get('demo');
      if (demoId) {
        const found = DEMO_SCENARIOS.find(d => d.id === demoId || d.type === 'message');
        if (found) {
          setMessage(found.input);
        }
      }
    }
  }, []);

  const handleDemoPreset = (presetText: string) => {
    setMessage(presetText);
    setError('');
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!message.trim()) {
      setError('Please enter or paste a message to analyze');
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

      // Execute analysis via Python FastAPI backend
      let finalResult: any = null;
      try {
        finalResult = await safeguardAPI.scanMessage(message.trim(), msgType);
      } catch (apiErr: any) {
        console.warn('Backend API notice, using local engine fallback:', apiErr?.message);
        finalResult = analyzeMessage(message.trim(), msgType);
      }

      await new Promise(r => setTimeout(r, 2200));
      clearInterval(stepTimer);

      setResult(finalResult);
      addToHistory(finalResult);
    } catch (err: any) {
      setError(err?.message || 'Analysis failed. Please check your input and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearForm = () => {
    setMessage('');
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
            <MessageSquare className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Message & SMS Scam Detector</h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
              Social engineering detection, urgency analysis, fake lottery traps & banking smishing scanner
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
        className="bg-[#0E171F] border border-[#1D3038] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
      >
        {/* Source Switcher */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2.5">
            Select Message Channel / Source
          </label>
          <div className="flex flex-wrap gap-2">
            {MESSAGE_SOURCES.map(({ type, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setMsgType(type)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all ${
                  msgType === type
                    ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                    : 'bg-[#050A0F] border border-[#1D3038] text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div className="space-y-3">
          <label htmlFor="msg-input" className="block text-xs font-mono uppercase tracking-wider text-slate-300">
            Paste suspicious message text here...
          </label>
          <div className="relative">
            <textarea
              id="msg-input"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Congratulations! You won ₹50,000. Click this link to claim your reward: http://bit.ly/claim-reward-now..."
              className="w-full bg-[#050A0F] border border-[#1D3038] rounded-2xl p-4 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
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
                disabled={isAnalyzing || !message}
                className="px-7 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:opacity-50 flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <><RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> Running AI NLP Analysis...</>
                ) : (
                  <><Zap className="w-4 h-4 text-slate-950" /> Analyze Message</>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDemoPreset('Congratulations! You won ₹50,000 in Google Lucky Draw. Click this link to claim your reward: http://kbc-reward-claim.xyz/bonus')}
                disabled={isAnalyzing}
                className="px-5 py-3 border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                title="Load example suspicious message"
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
              Scans for urgency, fake rewards, OTP requests & psychological manipulation
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
                      Analyzing Message Payload
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">Running psychological NLP & threat signature models</p>
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

      {/* Analysis Results Display (Section 6 & 11) */}
      <AnimatePresence>
        {result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Top Cards: Score Meter & "Why This Message Looks Suspicious" */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Risk Score Meter */}
              <div className="lg:col-span-5 bg-[#0E171F] border border-[#1D3038] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
                <div className="flex items-center justify-between w-full border-b border-[#1D3038] pb-3">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
                    SCAM PROBABILITY SCORE
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
                    <span className="text-xs font-mono text-slate-400 mt-1">/ 100 Scam Risk</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-lg font-bold text-white flex items-center justify-center gap-2">
                    {result.riskScore > 50 ? (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    )}
                    <span>{result.threatLabel || result.classification || 'Scam Evaluation'}</span>
                  </div>
                  <p className="text-xs font-mono text-slate-400">
                    Channel: {msgType} • Sentiment: {result.riskScore > 60 ? 'Manipulative / High Urgency' : 'Normal'}
                  </p>
                </div>
              </div>

              {/* Highlighted Section: "Why this message looks suspicious" (Section 6) */}
              <div className="lg:col-span-7 bg-[#0E171F] border border-[#1D3038] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#1D3038] pb-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Why this message looks suspicious</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">Heuristic Indicators</span>
                </div>

                {/* Detected Indicators List */}
                <div className="space-y-2.5">
                  {result.indicators?.filter((i: any) => i.detected).map((ind: any, i: number) => (
                    <div 
                      key={i} 
                      className="p-3.5 rounded-xl bg-[#050A0F] border border-[#1D3038] flex items-start gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-100 font-mono block">
                          {ind.label || ind.name || 'Suspicious Characteristic'}
                        </span>
                        <p className="text-xs text-slate-400 font-mono">
                          {ind.description}
                        </p>
                      </div>
                    </div>
                  ))}

                  {(!result.indicators || result.indicators.filter((i: any) => i.detected).length === 0) && (
                    <div className="p-4 rounded-xl bg-[#050A0F] border border-[#1D3038] text-xs font-mono text-slate-400">
                      No deceptive psychological triggers or suspicious links identified in this message.
                    </div>
                  )}
                </div>

                {/* Key Detected Attributes Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1D3038] font-mono text-[11px]">
                  <div className="p-2.5 rounded-lg bg-[#050A0F] text-center border border-[#1D3038]">
                    <span className="text-slate-500 text-[10px] block uppercase">Urgency</span>
                    <span className={`font-bold ${result.details?.urgencyLanguage?.length > 0 ? 'text-red-400' : 'text-slate-300'}`}>
                      {result.details?.urgencyLanguage?.length > 0 ? 'YES' : 'NONE'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#050A0F] text-center border border-[#1D3038]">
                    <span className="text-slate-500 text-[10px] block uppercase">Fake Reward</span>
                    <span className={`font-bold ${result.details?.fakeRewards ? 'text-red-400' : 'text-slate-300'}`}>
                      {result.details?.fakeRewards ? 'DETECTED' : 'NONE'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#050A0F] text-center border border-[#1D3038]">
                    <span className="text-slate-500 text-[10px] block uppercase">Links Found</span>
                    <span className={`font-bold ${result.details?.suspiciousLinks?.length > 0 ? 'text-red-400' : 'text-slate-300'}`}>
                      {result.details?.suspiciousLinks?.length || 0} LINK(S)
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#050A0F] text-center border border-[#1D3038]">
                    <span className="text-slate-500 text-[10px] block uppercase">Credential Ask</span>
                    <span className={`font-bold ${result.details?.personalInfoRequest ? 'text-red-400' : 'text-slate-300'}`}>
                      {result.details?.personalInfoRequest ? 'YES (OTP/PIN)' : 'NO'}
                    </span>
                  </div>
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
                          ? '⚠️ This message is a scam trap. Think of it like a stranger running up to you on the street shouting that you won a lottery ticket you never bought, but demanding you immediately hand over your house keys or bank card to collect the money. Real banks and companies never demand urgent PINs or send strange links over SMS.'
                          : 'This message does not appear to contain deceptive reward promises, panic threats, or requests for private passwords.'
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 font-mono">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#111C24] text-slate-400 text-xs font-semibold">
                      ⚙️ TECHNICAL SECURITY BREAKDOWN
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {result.technicalExplanation || `NLP sentiment and pattern engine parsed ${message.length} characters. Identified social engineering tokens, synthetic urgency constructs, and financial manipulation signatures yielding a ${result.riskScore}/100 fraud confidence score.`}
                    </p>
                  </div>
                )}
              </div>

              {/* Safety Recommendation (Section 6) */}
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
                    SAFETY RECOMMENDATION
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-mono">
                  {result.recommendedAction || 'Do NOT click any links, call any numbers, or reply with OTPs. Block the sender and report to cybercrime authorities.'}
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
                    href={`/report-scam?msg=${encodeURIComponent(message.slice(0, 100))}`}
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
