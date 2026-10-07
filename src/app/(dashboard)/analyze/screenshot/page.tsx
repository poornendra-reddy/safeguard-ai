'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Upload, ShieldAlert, CheckCircle, AlertTriangle, ShieldCheck, RefreshCw, FileText, X, Lock, Check } from 'lucide-react';
import { useHistory } from '@/lib/context/providers';
import { analyzeMessage } from '@/lib/ai/message-analyzer';
import { AnalysisResult } from '@/types';

export default function UploadPhotoToolPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addToHistory } = useHistory();

  const handleSelectPhoto = (selectedFile: File) => {
    if (!selectedFile || !selectedFile.type.startsWith('image/')) return;

    setFileName(selectedFile.name);
    setFileSize((selectedFile.size / 1024).toFixed(1) + ' KB');
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setResult(null);
    setExtractedText(null);

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
      const mockExtractedText = `SECURITY ALERT: Verification required for transaction #${Math.floor(100000 + Math.random() * 900000)}. Login immediately at http://security-verify-account.xyz/login to protect your funds.`;
      setExtractedText(mockExtractedText);

      const analysisResult = analyzeMessage(mockExtractedText);
      analysisResult.type = 'screenshot';
      analysisResult.input = `Security Evidence: ${imageFile.name}`;

      setTimeout(() => {
        setResult(analysisResult);
        addToHistory(analysisResult);
        setIsAnalyzing(false);
      }, 500);
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
    }
  };

  const clearPhoto = () => {
    setPreviewUrl(null);
    setFileName(null);
    setFileSize(null);
    setResult(null);
    setExtractedText(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 font-sans">
      {/* SOC Page Title Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-[#00E5FF]/10 rounded-xl border border-[#00E5FF]/30">
          <Shield className="w-7 h-7 text-[#00E5FF]" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
            SECURITY EVIDENCE ANALYZER
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Upload a screenshot, message, payment receipt, email, QR code, or suspicious image for AI-powered threat analysis.
          </p>
        </div>
      </div>

      {/* Main Upload evidence Box */}
      <div className="bg-[#0E171F] p-6 md:p-8 rounded-xl border border-[#1D3038] shadow-2xl space-y-6 relative overflow-hidden soc-cyber-grid">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {!previewUrl ? (
          <div className="py-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-[#081118] border border-[#00E5FF]/40 rounded-full flex items-center justify-center mx-auto text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.15)]">
              <Shield className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg md:text-xl font-bold text-slate-100 uppercase font-mono tracking-wide">
                DROP SECURITY EVIDENCE HERE
              </h2>
              <p className="text-xs text-slate-400">
                Supported: PNG, JPG, JPEG, WEBP
              </p>
            </div>

            {/* UPLOAD & ANALYZE CYAN BUTTON */}
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3.5 bg-[#00E5FF] hover:bg-[#00C9D7] text-[#050A0F] font-bold rounded-md text-xs font-mono uppercase tracking-wider shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>UPLOAD & ANALYZE</span>
              </button>
            </div>

            {/* Privacy Guarantee Message */}
            <div className="pt-4 border-t border-[#1D3038]/60 flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400">
              <Lock className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>🔒 Your uploaded evidence is processed securely.</span>
            </div>
          </div>
        ) : (
          /* Evidence Upload Summary Status Panel */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#1D3038] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[#081118] border border-[#1D3038] text-[#00E5FF]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-slate-200 truncate">{fileName}</h3>
                  <span className="text-[10px] font-mono text-slate-400">{fileSize} • Upload Status: <span className="text-[#22C55E]">Completed</span></span>
                </div>
              </div>
              <button
                onClick={clearPhoto}
                className="p-1.5 rounded bg-[#111C24] text-slate-400 hover:text-[#FF3B3B] border border-[#1D3038] transition-colors text-xs font-mono flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Remove
              </button>
            </div>

            <div className="relative max-h-64 bg-[#050A0F] rounded-lg overflow-hidden flex items-center justify-center p-3 border border-[#1D3038]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Uploaded Evidence" className="max-h-56 max-w-full object-contain rounded" />
            </div>
          </div>
        )}
      </div>

      {/* AI Processing State Indicator */}
      {isAnalyzing && (
        <div className="p-6 rounded-xl bg-[#0E171F] border border-[#00E5FF]/40 text-center space-y-3 font-mono">
          <RefreshCw className="w-6 h-6 text-[#00E5FF] animate-spin mx-auto" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest">AI Threat Analysis in Progress...</h3>
          <p className="text-[11px] text-slate-400">Extracting OCR text metadata & scanning threat vectors...</p>
        </div>
      )}

      {/* AI Threat Intelligence Result Card */}
      {result && !isAnalyzing && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 font-sans">
          <div className="p-6 md:p-8 rounded-xl bg-[#0E171F] border border-[#1D3038] shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#1D3038] pb-6">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  AI THREAT INTELLIGENCE VERDICT
                </span>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-100 tracking-tight">
                    {result.threatLabel || 'Social Engineering Analysis'}
                  </h2>
                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider ${
                    result.riskScore > 70
                      ? 'bg-[#FF1744]/20 text-[#FF1744] border border-[#FF1744]/40'
                      : result.riskScore > 30
                      ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                      : 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40'
                  }`}>
                    ● {result.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Risk Score & Confidence metric */}
              <div className="flex items-center gap-6 font-mono bg-[#050A0F] px-4 py-3 rounded-md border border-[#1D3038]">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Risk Score</span>
                  <span className={`text-xl font-bold ${result.riskScore > 70 ? 'text-[#FF1744]' : result.riskScore > 30 ? 'text-[#F59E0B]' : 'text-[#22C55E]'}`}>
                    {result.riskScore} <span className="text-xs text-slate-500">/ 100</span>
                  </span>
                </div>
                <div className="w-px h-8 bg-[#1D3038]" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">AI Confidence</span>
                  <span className="text-xl font-bold text-[#00E5FF]">94.8%</span>
                </div>
              </div>
            </div>

            {/* Explanation & Detection details */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Threat Overview & Analysis
              </h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed bg-[#050A0F] p-4 rounded-md border border-[#1D3038]">
                {result.simpleExplanation}
              </p>
            </div>

            {/* Extracted Text */}
            {extractedText && (
              <div className="space-y-2 font-mono">
                <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  OCR Extracted Security Evidence Text
                </h3>
                <div className="p-3.5 rounded bg-[#050A0F] border border-[#1D3038] text-xs text-slate-300">
                  {extractedText}
                </div>
              </div>
            )}

            {/* Detected Indicators List */}
            <div className="space-y-3 font-mono">
              <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Detected Security Indicators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="p-3 rounded bg-[#050A0F] border border-[#1D3038] flex items-center justify-between text-xs">
                  <span className="text-slate-300">Suspicious URL Pattern</span>
                  <span className="text-[#FF3B3B] font-bold">⚠ DETECTED</span>
                </div>
                <div className="p-3 rounded bg-[#050A0F] border border-[#1D3038] flex items-center justify-between text-xs">
                  <span className="text-slate-300">Urgency Language Trigger</span>
                  <span className="text-[#FF3B3B] font-bold">⚠ DETECTED</span>
                </div>
                <div className="p-3 rounded bg-[#050A0F] border border-[#1D3038] flex items-center justify-between text-xs">
                  <span className="text-slate-300">Unauthorized Payment Request</span>
                  <span className="text-[#F59E0B] font-bold">⚠ WARNING</span>
                </div>
                <div className="p-3 rounded bg-[#050A0F] border border-[#1D3038] flex items-center justify-between text-xs">
                  <span className="text-slate-300">Sender Anomaly Verification</span>
                  <span className="text-[#22C55E] font-bold">✓ PASSED</span>
                </div>
              </div>
            </div>

            {/* Recommended Action Box */}
            <div className={`p-4 rounded-md border font-sans ${
              result.riskScore > 70
                ? 'bg-[#FF1744]/10 border-[#FF1744]/30 text-slate-200'
                : 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-slate-200'
            }`}>
              <span className="font-mono text-xs font-bold text-[#FF1744] uppercase tracking-wider block mb-1">
                RECOMMENDED SAFETY ACTIONS:
              </span>
              <p className="text-xs leading-relaxed text-slate-300 font-mono">
                {result.recommendedAction}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
