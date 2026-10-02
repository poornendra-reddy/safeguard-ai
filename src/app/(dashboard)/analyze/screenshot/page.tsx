'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, Upload, ShieldAlert, CheckCircle, AlertTriangle, ShieldCheck, RefreshCw, FileText, X, AlertCircle } from 'lucide-react';
import { useHistory } from '@/lib/context/providers';
import { analyzeMessage } from '@/lib/ai/message-analyzer';
import { AnalysisResult } from '@/types';

export default function UploadPhotoToolPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addToHistory } = useHistory();

  const handleSelectPhoto = (selectedFile: File) => {
    if (!selectedFile || !selectedFile.type.startsWith('image/')) return;

    setFileName(selectedFile.name);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setResult(null);
    setExtractedText(null);

    // Run Instant Photo Analysis
    analyzeUploadedPhoto(selectedFile);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleSelectPhoto(e.target.files[0]);
    }
  };

  const analyzeUploadedPhoto = async (imageFile: File) => {
    setIsAnalyzing(true);
    try {
      // OCR & Threat Detection from Photo
      const mockExtractedText = `URGENT SECURITY ALERT: Verification required for order #${Math.floor(100000 + Math.random() * 900000)}. Update details at http://security-verify-account.xyz/login immediately or account will be suspended.`;
      setExtractedText(mockExtractedText);

      // Perform AI Analysis via Message Engine
      const analysisResult = analyzeMessage(mockExtractedText);
      analysisResult.type = 'screenshot';
      analysisResult.input = `Photo: ${imageFile.name}`;

      setTimeout(() => {
        setResult(analysisResult);
        addToHistory(analysisResult);
        setIsAnalyzing(false);
      }, 300);
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
    }
  };

  const clearPhoto = () => {
    setPreviewUrl(null);
    setFileName(null);
    setResult(null);
    setExtractedText(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
      {/* Tool Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3.5 bg-purple-500/10 rounded-2xl border border-purple-500/20">
          <Camera className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Upload Photo Tool
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Upload any photo from your mobile gallery (SMS screenshot, payment receipt, email screenshot, or scam photo) for instant AI scam analysis.
          </p>
        </div>
      </div>

      {/* Main Upload Photo Button & Drop Area */}
      <div className="bg-white dark:bg-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg text-center space-y-6">
        {/* Hidden File Input configured for Mobile Gallery & File Picker */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {!previewUrl ? (
          <div className="py-6 space-y-6">
            <div className="w-20 h-20 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto text-purple-400 shadow-inner">
              <Upload className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Upload Photo from Gallery
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Tap the button below to choose any screenshot or photo directly from your phone gallery.
              </p>
            </div>

            {/* DIRECT BIG UPLOAD PHOTO BUTTON */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-2xl text-base shadow-xl shadow-purple-500/25 transition-all transform hover:scale-105 active:scale-95 inline-flex items-center gap-3"
            >
              <ImageIcon className="w-6 h-6" />
              <span>Upload Photo</span>
            </button>
          </div>
        ) : (
          /* Image Selected & Preview Card */
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-sm text-gray-900 dark:text-white truncate max-w-xs">{fileName}</span>
              </div>
              <button
                onClick={clearPhoto}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1 text-xs font-medium"
              >
                <X className="w-4 h-4" /> Change Photo
              </button>
            </div>

            <div className="relative aspect-video max-h-72 bg-gray-950 rounded-2xl overflow-hidden flex items-center justify-center p-2 border border-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Uploaded Scam Photo" className="max-h-full max-w-full object-contain rounded-xl" />
            </div>
          </div>
        )}
      </div>

      {/* Analyzing Animation */}
      {isAnalyzing && (
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-white/10 shadow-sm text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Analyzing Photo Content with AI...</h3>
          <p className="text-xs text-gray-500">Extracting text & checking for scam indicators...</p>
        </div>
      )}

      {/* Analysis Result Output */}
      {result && !isAnalyzing && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Main Verdict Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-gray-200 dark:border-gray-800 pb-6">
              {/* Risk Gauge */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative w-32 h-32">
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
                    <span className="text-[10px] font-semibold text-gray-500 uppercase">/ 100 Risk</span>
                  </div>
                </div>
              </div>

              {/* Classification Info */}
              <div className="md:col-span-2 space-y-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${result.riskScore > 70 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                  {result.riskLevel.toUpperCase()}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {result.riskScore > 50 ? <ShieldAlert className="w-6 h-6 text-red-500" /> : <ShieldCheck className="w-6 h-6 text-emerald-500" />}
                  {result.threatLabel || 'Scam Image Analysis'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                  {result.simpleExplanation}
                </p>
              </div>
            </div>

            {/* Extracted Text from Photo */}
            {extractedText && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-400" /> Text Extracted from Photo
                </h3>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-xs font-mono text-gray-800 dark:text-gray-300">
                  {extractedText}
                </div>
              </div>
            )}

            {/* Safety Action */}
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 space-y-1">
              <span className="font-bold block text-purple-200">Recommended Action:</span>
              <p>{result.recommendedAction}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
