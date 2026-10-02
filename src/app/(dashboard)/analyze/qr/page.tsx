'use client'

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Upload, Camera, Link as LinkIcon, ShieldAlert, CheckCircle, AlertTriangle, Shield, Check, Globe, Activity, Loader2 } from 'lucide-react';
import { analyzeURL, type URLAnalysisResult } from '@/lib/ai/url-analyzer';

const ANALYSIS_STEPS = [
  'Decoding QR image...',
  'Extracting destination URL...',
  'Analyzing domain reputation...',
  'Checking for malicious patterns...',
  'Generating security report...'
];

export default function QRCodeAnalyzerPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedUrl, setDecodedUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<URLAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) return;
    
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    setDecodedUrl(null);
    setResult(null);
    
    simulateDecode('http://pay.scam-refund.xyz/receive?amount=5000');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const simulateDecode = (urlToExtract: string) => {
    setIsDecoding(true);
    setTimeout(() => {
      setDecodedUrl(urlToExtract);
      setIsDecoding(false);
      runAnalysis(urlToExtract);
    }, 1500);
  };

  const handleDemo = () => {
    setPreviewUrl('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png');
    simulateDecode('http://pay.scam-refund.xyz/receive?amount=5000');
  };

  const runAnalysis = async (url: string) => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
    
    const interval = setInterval(() => {
      setAnalysisStep(prev => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 600);

    const analysisResult = await analyzeURL(url);
    
    setTimeout(() => {
      clearInterval(interval);
      setResult(analysisResult);
      setIsAnalyzing(false);
    }, ANALYSIS_STEPS.length * 600);
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
    if (score >= 70) return <ShieldAlert className="w-8 h-8 text-red-500" />;
    if (score >= 40) return <AlertTriangle className="w-8 h-8 text-amber-500" />;
    return <CheckCircle className="w-8 h-8 text-emerald-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/20 rounded-xl">
            <QrCode className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">QR Code Scam Detector</h1>
            <p className="text-gray-500 dark:text-gray-400">Scan or upload QR codes to verify destination safety</p>
          </div>
        </div>
        
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'upload' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Upload QR Image
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'camera' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Scan with Camera
          </button>
        </div>
      </div>

      {activeTab === 'camera' ? (
        <div className="p-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center space-y-4 text-center">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Camera access required</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
              This feature works best on mobile devices or requires webcam access permissions.
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('upload')}
            className="mt-4 px-4 py-2 text-sm font-medium text-cyan-500 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20 transition-colors"
          >
            Switch to Upload
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                isDragging 
                  ? 'border-cyan-500 bg-cyan-500/5' 
                  : 'border-gray-300 dark:border-gray-700 hover:border-cyan-400 dark:hover:border-cyan-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={handleFileInput}
              />
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <Upload className="w-8 h-8 text-cyan-500" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    PNG, JPG, JPEG, WEBP (Max 10MB)
                  </p>
                </div>
              </div>
            </div>
            

          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {previewUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="backdrop-blur-xl bg-white/5 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center space-x-2">
                    <QrCode className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">QR Preview</h3>
                  </div>
                  <div className="relative aspect-square max-h-64 mx-auto bg-gray-100 dark:bg-gray-950 p-4 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg bg-white p-2" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {isDecoding && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 backdrop-blur-xl bg-white/5 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-4 shadow-lg"
                >
                  <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                  <p className="text-gray-600 dark:text-gray-300 font-medium">Decoding QR code...</p>
                </motion.div>
              )}

              {decodedUrl && !isDecoding && !result && !isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="backdrop-blur-xl bg-white/5 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <LinkIcon className="w-5 h-5 text-cyan-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Decoded Destination</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 break-all bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-sm font-mono mt-2">{decodedUrl}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="backdrop-blur-xl bg-white/5 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl p-8 mt-8"
          >
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                <Globe className="w-6 h-6 text-cyan-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
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
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            <div className={`col-span-1 md:col-span-3 p-6 rounded-2xl border ${getRiskBgColor(result.riskScore)} flex flex-col space-y-4`}>
              <div className="flex items-start space-x-4">
                {getRiskIcon(result.riskScore)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {result.classification}
                    </h2>
                    <span className={`text-2xl font-bold ${getRiskColor(result.riskScore)}`}>
                      {result.riskScore}/100
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {result.explanation}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">QR Destination</h4>
                <div className="flex items-center justify-between bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-gray-200 dark:border-gray-700/50">
                  <span className="font-mono text-sm text-gray-800 dark:text-gray-200 truncate pr-4">{result.url}</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                    {result.domain}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="p-6 backdrop-blur-xl bg-white/5 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ShieldAlert className="w-5 h-5 mr-2 text-cyan-500" />
                  Threat Indicators
                </h3>
                <ul className="space-y-3">
                  {result.indicators.map((indicator: any, idx: number) => (
                    <li key={idx} className="flex items-start space-x-3 text-sm text-gray-700 dark:text-gray-300">
                      <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-red-500" />
                      <span>{typeof indicator === 'string' ? indicator : (indicator.label ? `${indicator.label}: ${indicator.description}` : indicator.description || 'Suspicious indicator detected')}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6 backdrop-blur-xl bg-white/5 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-cyan-500" />
                  Domain Analysis
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Domain Age</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{result.details?.domainAge || 'Unknown'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">SSL Certificate</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{result.details?.sslValid ? 'Valid' : 'Invalid/Missing'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Registrar</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{result.details?.registrar || 'Hidden'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hosting</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{result.details?.hostingProvider || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <div className="p-6 backdrop-blur-xl bg-emerald-500/5 border border-emerald-500/20 rounded-2xl h-full">
                <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Recommendations
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
