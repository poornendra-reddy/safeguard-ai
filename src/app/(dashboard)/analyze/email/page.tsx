'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, AlertTriangle, CheckCircle, ShieldAlert, ShieldCheck, 
  RefreshCw, AlertCircle, FileText, Zap, Info, Shield, Link as LinkIcon
} from 'lucide-react';
import { ANALYSIS_STEPS, getRiskColor } from '@/lib/constants';
import { useHistory } from '@/lib/context/providers';
import { analyzeEmail } from '@/lib/ai/email-analyzer';

export default function EmailAnalyzerPage() {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [links, setLinks] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [explanationMode, setExplanationMode] = useState<'technical' | 'simple' | 'new'>('technical');
  const [error, setError] = useState('');
  
  const historyContext = useHistory();
  const { addToHistory } = useHistory();

  const handleDemo = () => {
    setSender('security-alert@paypal-verify.xyz');
    setSubject('URGENT: Your PayPal account has been compromised');
    setBody('Dear Customer, We have detected unauthorized access to your PayPal account. Your account will be suspended within 24 hours unless you verify your identity. Click here to verify: http://paypal-secure.xyz/verify Please update your password and security questions immediately. PayPal Security Team');
    setLinks('http://paypal-secure.xyz/verify');
    setError('');
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
      }, 80);

      const response = await fetch('/api/analyze/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, subject, body })
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
      setError(err?.message || 'Analysis failed. Please try again.');
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
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
          <Mail className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Phishing Analyzer</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Deep analysis of email headers, content, and embedded links</p>
        </div>
      </div>

      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sender Email</label>
            <input
              id="sender"
              type="email"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="sender@example.com"
              className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              disabled={isAnalyzing}
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject line"
              className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              disabled={isAnalyzing}
            />
          </div>
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Body (Required)</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste email content here..."
            className="w-full h-40 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none"
            disabled={isAnalyzing}
          />
        </div>
        
        <div>
          <label htmlFor="links" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <LinkIcon className="w-4 h-4" /> Extracted Links (Optional)
          </label>
          <textarea
            id="links"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            placeholder="Paste any links extracted from the email..."
            className="w-full h-16 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none text-sm"
            disabled={isAnalyzing}
          />
        </div>

        {error && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4"/>{error}</p>}

        <div className="flex flex-wrap gap-3 items-center justify-between pt-2">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !body}
              className="px-6 py-2.5 bg-[#00E5FF] hover:bg-[#00C9D7] text-[#050A0F] rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] disabled:opacity-50 flex items-center gap-2"
            >
              {isAnalyzing ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...</>
              ) : (
                <><Zap className="w-4 h-4" /> Analyze Email</>
              )}
            </button>
            <button
              onClick={() => {
                setSender('security@paypal-verification-alert.com');
                setSubject('URGENT: Suspicious Login Detected on your PayPal Account');
                setBody('Dear Customer,\n\nWe detected an unauthorized login to your account from an unknown IP address. Please verify your credentials immediately to prevent account suspension.\n\nClick here: http://paypal-security-login-verify.com/auth');
                setLinks('http://paypal-security-login-verify.com/auth');
                setError('');
              }}
              disabled={isAnalyzing}
              className="px-5 py-2.5 bg-[#081118] hover:bg-[#111C24] text-[#00E5FF] border border-[#00E5FF]/40 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-[#00E5FF]" /> TRY EXAMPLE
            </button>
            <button
              onClick={clearForm}
              disabled={isAnalyzing}
              className="px-5 py-2.5 border border-[#1D3038] hover:bg-[#111C24] text-slate-300 rounded-lg font-mono text-xs font-medium transition-all disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>
      </motion.div>

      {/* Analysis Loading State */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-cyan-500" />
                AI Analysis in Progress
              </h3>
              <div className="space-y-4">
                {(ANALYSIS_STEPS || []).map((step: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      index < currentStep ? 'bg-cyan-500 border-cyan-500 text-white' :
                      index === currentStep ? 'border-cyan-500 text-cyan-500 animate-pulse' :
                      'border-gray-300 dark:border-gray-700 text-gray-400'
                    }`}>
                      {index < currentStep ? <CheckCircle className="w-5 h-5" /> : <span>{index + 1}</span>}
                    </div>
                    <div>
                      <span className={`font-medium block ${
                        index <= currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'
                      }`}>
                        {typeof step === 'string' ? step : step.label}
                      </span>
                      {typeof step !== 'string' && step.description && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {step.description}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Risk Score Card */}
              <div className="col-span-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Threat Score</h3>
                
                <div className="relative w-48 h-48 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-gray-200 dark:text-gray-800" strokeWidth="8" />
                    <motion.circle
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      cx="50" cy="50" r="45" fill="none"
                      stroke={getRiskColor ? getRiskColor(result.riskScore) : '#06b6d4'}
                      strokeWidth="8" strokeDasharray={circumference}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">{result.riskScore}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">/ 100</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className={`text-lg font-bold ${
                    result.riskScore > 75 ? 'text-red-500' : result.riskScore > 40 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {result.riskLevel}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
                    {result.threatType === 'Phishing' ? <ShieldAlert className="w-5 h-5 text-red-500" /> : <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                    {result.threatType}
                  </div>
                </div>
              </div>

              {/* Threat Indicators */}
              <div className="col-span-1 md:col-span-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-cyan-500" /> Threat Indicators
                </h3>
                <ul className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                  {result.indicators?.map((ind: any, i: number) => (
                    <li key={i} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                      {ind.detected ? (
                        <AlertTriangle className={`w-5 h-5 shrink-0 ${ind.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                      ) : (
                        <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{ind.name}</p>
                        {ind.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ind.description}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Explanation */}
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-cyan-500" /> AI Explanation
                </h3>
                <div className="flex bg-gray-100 dark:bg-gray-950 rounded-lg p-1">
                  {(['technical', 'simple', 'new'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setExplanationMode(mode)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        explanationMode === mode 
                          ? 'bg-white dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-950 rounded-xl p-4 border border-gray-200 dark:border-gray-800 overflow-y-auto">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {result.explanation?.[explanationMode] || 'Explanation not available.'}
                </p>
              </div>
            </div>

            {/* Recommended Action */}
            <div className={`rounded-2xl p-6 shadow-lg border ${
              result.riskScore > 75 
                ? 'bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-500/30' 
                : result.riskScore > 40
                ? 'bg-amber-50/50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-500/30'
                : 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-500/30'
            }`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Shield className={`w-5 h-5 ${
                  result.riskScore > 75 ? 'text-red-500' : result.riskScore > 40 ? 'text-amber-500' : 'text-emerald-500'
                }`} />
                Recommended Action
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {result.recommendedAction || 'Exercise normal caution.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium transition-all hover:opacity-90 flex items-center gap-2">
                <FileText className="w-5 h-5" /> View Full Report
              </button>
              <button onClick={clearForm} className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all">
                Analyze Another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
