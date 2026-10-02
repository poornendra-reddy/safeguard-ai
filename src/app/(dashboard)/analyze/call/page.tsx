'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneOff, Search, AlertTriangle, ShieldCheck, RefreshCw, CheckCircle,
  HelpCircle, ChevronDown, ChevronUp, Copy, Share2, Info, Flag, AlertCircle,
  ShieldAlert, PhoneCall, Radio, UserX
} from 'lucide-react';
import { useHistory } from '@/lib/context/providers';
import { AnalysisResult } from '@/types';

const ANALYSIS_STEPS = [
  { label: 'Parsing Phone Number Format & Country Code...', desc: 'Checking international prefix reputation' },
  { label: 'Querying Telemarketing & Robocall Databases...', desc: 'Inspecting 140-series & Virtual Toll-Free prefixes' },
  { label: 'Analyzing Caller Narrative & Script Claims...', desc: 'Scanning for Digital Arrest, TRAI & Bank Vishing keywords' },
  { label: 'Evaluating Impersonation & Psychological Urgency...', desc: 'Checking intimidation & pressure tactics' },
  { label: 'Generating Spam Call Verdict & Risk Score...', desc: 'Synthesizing recommendations & safety steps' },
];

const DEMO_CALLS = [
  {
    title: 'Digital Arrest Scam Call',
    phone: '+91 98210 54321',
    claim: 'Caller claimed to be from Mumbai Police & CBI stating an illegal package with drugs was found in my name. Threatening digital arrest within 1 hour.',
    desc: 'Fake Police / CBI Digital Arrest Vishing'
  },
  {
    title: 'TRAI SIM Disconnection Threat',
    phone: '+91 91234 56789',
    claim: 'Automated call claiming to be TRAI stating my mobile number will be disconnected in 2 hours due to illegal activity. Pressed 1 to speak with executive.',
    desc: 'TRAI Impersonation SIM Block Scam'
  },
  {
    title: 'Bank Officer KYC / OTP Call',
    phone: '+91 98765 01234',
    claim: 'Caller claimed to be SBI Bank Manager asking for my debit card CVV and OTP to stop account closure.',
    desc: 'Banking Vishing & Credential Harvesting'
  },
  {
    title: 'High-Risk International Call',
    phone: '+882 1690 1234',
    claim: 'Missed call from suspicious international country code (+882 satellite series). Ringing twice and hanging up.',
    desc: 'One-Ring Wangiri Spam Call'
  }
];

export default function SpamCallDetectorPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [showTechnical, setShowTechnical] = useState(false);
  const [showSimple, setShowSimple] = useState(true);

  const { addToHistory } = useHistory();

  const handleAnalyze = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number to analyze');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setResult(null);
    setCurrentStep(0);

    try {
      const stepTimer = setInterval(() => {
        setCurrentStep(prev => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
      }, 80);

      const response = await fetch('/api/analyze/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, transcript })
      });

      clearInterval(stepTimer);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Backend API call failed');
      }

      const data = await response.json();
      if (data.success && data.result) {
        setResult(data.result);
        addToHistory(data.result);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Analysis failed. Please check the phone number and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadDemo = (demo: typeof DEMO_CALLS[0]) => {
    setPhoneNumber(demo.phone);
    setTranscript(demo.claim);
    setError('');
    setResult(null);
  };

  const clearForm = () => {
    setPhoneNumber('');
    setTranscript('');
    setResult(null);
    setError('');
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = result ? circumference - (result.riskScore / 100) * circumference : circumference;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
          <PhoneOff className="w-8 h-8 text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Spam Call & Vishing Detector <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">NEW TOOL</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Detect suspicious phone calls, robocalls, TRAI SIM block threats, & Digital Arrest scams</p>
        </div>
      </div>

      {/* Demo Quick Selectors */}
      <section className="bg-white dark:bg-gray-900/60 backdrop-blur-xl p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Quick Demo Scenarios (Click to test)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEMO_CALLS.map((demo, idx) => (
            <button
              key={idx}
              onClick={() => loadDemo(demo)}
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-red-500/10 dark:hover:bg-red-500/10 border border-gray-200 dark:border-gray-700/60 hover:border-red-500/40 text-left transition-all group"
            >
              <div className="font-semibold text-xs text-gray-900 dark:text-white group-hover:text-red-400 flex items-center justify-between">
                {demo.title}
                <PhoneCall className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-400" />
              </div>
              <div className="text-[11px] font-mono text-cyan-400 mt-1">{demo.phone}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-0.5">{demo.desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Input Form Card */}
      <section className="bg-white dark:bg-gray-900/60 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-red-400" /> Phone Number to Check *
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g. +91 98765 43210 or 140XXXXXX"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-mono text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" /> Caller Claim / Transcript (Optional)
            </span>
            <span className="text-xs font-normal text-gray-500">What did the caller say or threaten?</span>
          </label>
          <textarea
            rows={3}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="e.g. Claimed to be Mumbai Police stating drugs were found in my parcel... or TRAI warning SIM disconnection in 2 hours."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm text-gray-900 dark:text-white"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 hover:from-red-400 hover:to-rose-500 text-white font-semibold shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <><RefreshCw className="w-5 h-5 animate-spin" /> Analyzing Call Script...</>
            ) : (
              <><Search className="w-5 h-5" /> Analyze Spam Call</>
            )}
          </button>
          <button
            onClick={clearForm}
            className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
          >
            Clear
          </button>
        </div>
      </section>

      {/* Analyzing Progress Steps */}
      {isAnalyzing && (
        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-white/10 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-red-400" /> AI Call Analysis in Progress...
          </h3>
          <div className="space-y-3">
            {ANALYSIS_STEPS.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx <= currentStep ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${idx <= currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{step.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Analysis Result Output */}
      {result && !isAnalyzing && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          {/* Main Verdict Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-lg relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Circular Meter */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-800" />
                    <circle
                      cx="50" cy="50" r="45" fill="none"
                      stroke={result.riskScore > 70 ? '#ef4444' : result.riskScore > 30 ? '#f59e0b' : '#10b981'}
                      strokeWidth="8"
                      strokeDasharray={`${result.riskScore * 2.83} 283`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-extrabold ${result.riskScore > 70 ? 'text-red-500' : result.riskScore > 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {result.riskScore}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 uppercase">/ 100 Risk</span>
                  </div>
                </div>
              </div>

              {/* Classification Details */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.riskScore > 70 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : result.riskScore > 30 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {result.riskLevel.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">ID: {result.id}</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {result.riskScore > 50 ? <UserX className="w-6 h-6 text-red-500" /> : <ShieldCheck className="w-6 h-6 text-emerald-500" />}
                  {result.threatLabel}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                  {result.simpleExplanation}
                </p>
              </div>
            </div>
          </div>

          {/* Detected Threat Indicators */}
          {result.indicators.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" /> Detected Call Indicators ({result.indicators.length})
              </h3>
              <div className="space-y-3">
                {result.indicators.map((ind: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-1">
                        {ind.severity} Severity — {ind.type}
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{ind.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Safety Recommendations */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 via-rose-500/5 to-transparent border border-red-500/20 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" /> Recommended Safety Action
            </h3>
            <ul className="space-y-2">
              {(result.recommendations || [result.recommendedAction]).map((rec: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
