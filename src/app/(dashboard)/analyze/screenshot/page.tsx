'use client'

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, FileImage, ShieldAlert, CheckCircle, AlertTriangle, Shield, Check, Info, FileText, Loader2 } from 'lucide-react';
import { analyzeMessage, type MessageAnalysisResult } from '@/lib/ai/message-analyzer';

const ANALYSIS_STEPS = [
  'Processing image...',
  'Extracting text (OCR)...',
  'Analyzing context...',
  'Detecting threats...',
  'Generating report...'
];

export default function ScreenshotAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<MessageAnalysisResult | null>(null);
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
    setExtractedText(null);
    setResult(null);
    
    simulateExtraction();
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

  const simulateExtraction = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setExtractedText('URGENT: Your SBI account has been blocked. Update KYC immediately at http://sbi-kyc-update.xyz or your account will be permanently closed. Call 9876543210');
      setIsExtracting(false);
    }, 2000);
  };

  const handleDemo = () => {
    setPreviewUrl('https://images.unsplash.com/photo-1614064641913-6b71a2bcbc07?auto=format&fit=crop&q=80&w=400');
    setExtractedText('URGENT: Your SBI account has been blocked. Update KYC immediately at http://sbi-kyc-update.xyz or your account will be permanently closed. Call 9876543210');
    setResult(null);
  };

  const runAnalysis = async () => {
    if (!extractedText) return;
    
    setIsAnalyzing(true);
    setAnalysisStep(0);
    
    const interval = setInterval(() => {
      setAnalysisStep(prev => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 600);

    const analysisResult = await analyzeMessage(extractedText);
    
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
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-cyan-500/20 rounded-xl">
          <Camera className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Screenshot Analyzer</h1>
          <p className="text-gray-500 dark:text-gray-400">Extract text from images and analyze for threats</p>
        </div>
      </div>

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
          
          <div className="flex justify-center">
            <button
              onClick={handleDemo}
              className="px-6 py-2 text-sm font-medium text-cyan-500 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-colors"
            >
              Try Demo Image
            </button>
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
                  <FileImage className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Image Preview</h3>
                </div>
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-950 p-2 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isExtracting && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 backdrop-blur-xl bg-white/5 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-4 shadow-lg"
              >
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                <p className="text-gray-600 dark:text-gray-300 font-medium">Extracting text...</p>
              </motion.div>
            )}

            {extractedText && !isExtracting && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-white/5 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg"
              >
                <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Extracted Text</h3>
                  </div>
                  {!isAnalyzing && !result && (
                    <button
                      onClick={runAnalysis}
                      className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    >
                      Analyze Text
                    </button>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">{extractedText}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

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
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            <div className={`col-span-1 md:col-span-3 p-6 rounded-2xl border ${getRiskBgColor(result.riskScore)} flex items-start space-x-4`}>
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

              {result.entities && result.entities.length > 0 && (
                <div className="p-6 backdrop-blur-xl bg-white/5 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-cyan-500" />
                    Extracted Entities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(result.entities || []).map((entity: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700">
                        {entity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
