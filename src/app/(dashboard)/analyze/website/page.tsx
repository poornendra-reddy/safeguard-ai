'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, ShieldAlert, CheckCircle, AlertTriangle, Shield, Check, Activity, Lock, Database, Info, Loader2 } from 'lucide-react';
import { analyzeURL, type URLAnalysisResult } from '@/lib/ai/url-analyzer';

const ANALYSIS_STEPS = [
  'Resolving domain...',
  'Checking SSL certificate...',
  'Analyzing domain reputation...',
  'Scanning for phishing signatures...',
  'Generating security assessment...'
];

export default function WebsiteSafetyCheckerPage() {
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<URLAnalysisResult | null>(null);

  const handleAnalyze = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!urlInput.trim()) return;

    let targetUrl = urlInput.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    setIsAnalyzing(true);
    setAnalysisStep(0);
    setResult(null);

    const interval = setInterval(() => {
      setAnalysisStep(prev => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 600);

    const analysisResult = await analyzeURL(targetUrl);
    
    setTimeout(() => {
      clearInterval(interval);
      setResult(analysisResult);
      setIsAnalyzing(false);
    }, ANALYSIS_STEPS.length * 600);
  };

  const handleDemo = () => {
    setUrlInput('flipkart-mega-sale-90off.shop');
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 70) return 'bg-red-500/10 border-red-500/20';
    if (score >= 40) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-emerald-500/10 border-emerald-500/20';
  };

  const getRiskIcon = (score: number) => {
    if (score >= 70) return <ShieldAlert className="w-10 h-10 text-red-500" />;
    if (score >= 40) return <AlertTriangle className="w-10 h-10 text-amber-500" />;
    return <CheckCircle className="w-10 h-10 text-emerald-500" />;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/20 rounded-xl">
            <Globe className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Website Safety Checker</h1>
            <p className="text-gray-500 dark:text-gray-400">Perform a comprehensive security scan on any URL</p>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/5 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg">
        <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter website address (e.g., www.example.com)"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isAnalyzing || !urlInput.trim()}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 text-white font-medium rounded-xl transition-colors flex items-center shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:shadow-none"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Check Website'
              )}
            </button>
            <button
              type="button"
              onClick={handleDemo}
              disabled={isAnalyzing}
              className="px-4 py-3 text-cyan-500 bg-cyan-500/10 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/20 transition-colors"
            >
              Load Sample Website
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="backdrop-blur-xl bg-white/5 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl p-8"
          >
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                <Shield className="w-6 h-6 text-cyan-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-2 text-center w-full max-w-md">
                {ANALYSIS_STEPS.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    {index < analysisStep ? (
                      <Check className="w-5 h-5 text-emerald-500" />
                    ) : index === analysisStep ? (
                      <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-700" />
                    )}
                    <span className={index <= analysisStep ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header Report Card */}
            <div className={`p-8 rounded-2xl border ${getRiskBgColor(result.riskScore)} flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <Shield className="w-48 h-48" />
              </div>
              
              <div className="flex items-center space-x-6 relative z-10">
                {getRiskIcon(result.riskScore)}
                <div>
                  <h4 className="text-sm font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-1">Security Report For</h4>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white break-all">
                    {result.domain}
                  </h2>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                      result.riskScore >= 70 ? 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30' :
                      result.riskScore >= 40 ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    }`}>
                      {result.classification}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10 relative z-10 min-w-[150px]">
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Risk Score</span>
                <span className={`text-4xl font-black ${getRiskColor(result.riskScore)}`}>
                  {result.riskScore}
                  <span className="text-lg text-gray-400 font-normal">/100</span>
                </span>
              </div>
            </div>

            {/* Assessment & Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 backdrop-blur-xl bg-white/5 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Security Assessment</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {result.explanation}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Domain Info */}
                  <div className="p-5 backdrop-blur-xl bg-white/5 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-xl">
                    <div className="flex items-center space-x-2 mb-4 text-cyan-500">
                      <Database className="w-5 h-5" />
                      <h4 className="font-semibold">Domain Information</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                        <span className="text-gray-500 dark:text-gray-400">Target</span>
                        <span className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{result.domain}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                        <span className="text-gray-500 dark:text-gray-400">Age</span>
                        <span className="font-medium text-gray-900 dark:text-white">{result.details?.domainAge || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                        <span className="text-gray-500 dark:text-gray-400">Registrar</span>
                        <span className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{result.details?.registrar || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>

                  {/* SSL Info */}
                  <div className="p-5 backdrop-blur-xl bg-white/5 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-xl">
                    <div className="flex items-center space-x-2 mb-4 text-cyan-500">
                      <Lock className="w-5 h-5" />
                      <h4 className="font-semibold">SSL Security</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                        <span className="text-gray-500 dark:text-gray-400">Status</span>
                        <span className={`font-medium ${result.details?.sslValid ? 'text-emerald-500' : 'text-red-500'}`}>
                          {result.details?.sslValid ? 'Valid HTTPS' : 'Missing/Invalid'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                        <span className="text-gray-500 dark:text-gray-400">Protocol</span>
                        <span className="font-medium text-gray-900 dark:text-white">TLS 1.3</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 backdrop-blur-xl bg-white/5 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <ShieldAlert className="w-5 h-5 mr-2 text-cyan-500" />
                    Threat Indicators
                  </h3>
                  {result.indicators.length > 0 ? (
                    <ul className="space-y-3">
                      {result.indicators.map((indicator: any, idx: number) => (
                        <li key={idx} className="flex items-start space-x-3 text-sm text-gray-700 dark:text-gray-300">
                          <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-red-500" />
                          <span>{typeof indicator === 'string' ? indicator : (indicator.label ? `${indicator.label}: ${indicator.description}` : indicator.description || 'Suspicious indicator detected')}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                      No threats detected during this scan.
                    </p>
                  )}
                </div>
              </div>

              {/* Sidebar Actions/Recommendations */}
              <div className="lg:col-span-1 space-y-6">
                <div className="p-6 backdrop-blur-xl bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                  <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Safety Recommendations
                  </h3>
                  <ul className="space-y-4">
                    {(result.recommendations || []).map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-3 text-sm text-gray-700 dark:text-gray-300">
                        <div className="mt-0.5 flex-shrink-0">
                          <Check className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 backdrop-blur-xl bg-white/5 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-center">
                  <Info className="w-8 h-8 text-cyan-500 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Need a deeper scan?</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Our basic scan checks for common patterns. For enterprise needs, try our deep analysis.
                  </p>
                  <button className="w-full py-2 px-4 border border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-500/10 transition-colors text-sm font-medium">
                    Upgrade to Enterprise
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
