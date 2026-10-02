'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link as LinkIcon, AlertTriangle, CheckCircle, ShieldAlert, ShieldCheck, 
  XCircle, ArrowRight, RefreshCw, AlertCircle, FileText, Globe, Lock, Shield,
  Info, ArrowUpRight, Zap
} from 'lucide-react';
import { ANALYSIS_STEPS, getRiskColor, DEMO_SCENARIOS } from '@/lib/constants';
import { useHistory } from '@/lib/context/providers';
import { analyzeURL } from '@/lib/ai/url-analyzer';

export default function UrlAnalyzerPage() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [explanationMode, setExplanationMode] = useState<'technical' | 'simple' | 'new'>('technical');
  const [error, setError] = useState('');
  
  // Safe default for useHistory in case provider is not ready
  const { addToHistory } = useHistory();

  const handleDemo = () => {
    setUrl('http://secure-paytm-login.tk/account/verify?user=victim&token=abc123');
    setError('');
  };

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
      // Fast responsive step progression
      const stepTimer = setInterval(() => {
        setCurrentStep(prev => (prev < (ANALYSIS_STEPS?.length || 6) - 1 ? prev + 1 : prev));
      }, 80);

      // Call Backend API Endpoint
      const response = await fetch('/api/analyze/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
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
      setError(err?.message || 'Analysis failed. Please check the URL and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearForm = () => {
    setUrl('');
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
          <LinkIcon className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">URL Phishing Detector</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Identify malicious links and fraudulent domains</p>
        </div>
      </div>

      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Suspicious URL
            </label>
            <div className="relative">
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste suspicious URL here (e.g., https://example.com/login)"
                className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl px-4 py-4 pl-12 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                disabled={isAnalyzing}
              />
              <Globe className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
            </div>
            {error && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4"/>{error}</p>}
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-between pt-2">
            <div className="flex gap-3">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !url}
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <><RefreshCw className="w-5 h-5 animate-spin" /> Analyzing...</>
                ) : (
                  <><Zap className="w-5 h-5" /> Analyze URL</>
                )}
              </button>
              <button
                onClick={clearForm}
                disabled={isAnalyzing}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all disabled:opacity-50"
              >
                Clear
              </button>
            </div>
            <button
              onClick={handleDemo}
              disabled={isAnalyzing}
              className="text-cyan-500 hover:text-cyan-400 text-sm font-medium flex items-center gap-1"
            >
              Try Demo <ArrowUpRight className="w-4 h-4" />
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
            {/* Top Cards: Score & Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Risk Score Card */}
              <div className="col-span-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Threat Assessment</h3>
                
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

              {/* URL Details */}
              <div className="col-span-1 md:col-span-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-500" /> URL Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Domain</div>
                    <div className="font-medium text-gray-900 dark:text-white truncate">{result.urlDetails?.domain || 'Unknown'}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Domain Age</div>
                    <div className="font-medium text-gray-900 dark:text-white">{result.urlDetails?.domainAge || 'Unknown'}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Protocol</div>
                    <div className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                      {result.urlDetails?.isHttps ? <Lock className="w-4 h-4 text-emerald-500" /> : <ShieldAlert className="w-4 h-4 text-red-500" />}
                      {result.urlDetails?.protocol || 'HTTP'}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Redirects</div>
                    <div className="font-medium text-gray-900 dark:text-white">{result.urlDetails?.redirects || 0} hop(s)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicators & Explanations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Threat Indicators */}
              <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-500" /> Threat Indicators
                </h3>
                <ul className="space-y-3">
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
                
                <div className="flex-1 bg-gray-50 dark:bg-gray-950 rounded-xl p-4 border border-gray-200 dark:border-gray-800 overflow-y-auto">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {result.explanation?.[explanationMode] || 'Explanation not available.'}
                  </p>
                </div>
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
              {result.riskScore > 50 && (
                <button className="px-6 py-2.5 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg font-medium transition-all ml-auto">
                  Report Threat
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Target(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
}
