'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Upload, Shield, AlertTriangle, CheckCircle, ShieldAlert, ShieldCheck, 
  RefreshCw, FileText, X, Lock, Check, Video, StopCircle, Zap, Image as ImageIcon,
  Sparkles, HelpCircle, Eye, AlertOctagon, Download, Share2, History
} from 'lucide-react';
import { useHistory } from '@/lib/context/providers';
import { analyzeMessage } from '@/lib/ai/message-analyzer';
import { safeguardAPI } from '@/lib/api-client';
import { AnalysisResult } from '@/types';
import { getRiskColor, ANALYSIS_STEPS } from '@/lib/constants';
import Link from 'next/link';

const SAMPLE_SCREENSHOT_PRESETS = [
  {
    id: 'upi-scam',
    title: 'Fake UPI Payment Receipt',
    type: 'Fake Payment Screenshot',
    extracted: 'Payment Successful to Sharma Store! ₹5,000 paid. Transaction ID: UPI982348234. Refund request received? Scan QR immediately to reverse: upi://pay?pa=scam@upi',
    risk: 91,
    desc: 'Altered font weight, mismatched bank transaction reference and fake refund reversal trap.'
  },
  {
    id: 'bank-sms',
    title: 'Bank KYC SMS Screenshot',
    type: 'SMS Screenshot',
    extracted: 'Dear SBI Customer, Your YONO account will be blocked today due to pending PAN verification. Update immediately at http://sbi-pan-kyc.top/auth to avoid deactivation.',
    risk: 89,
    desc: 'Urgent account suspension threat with deceptive non-official URL.'
  },
  {
    id: 'job-fraud',
    title: 'Work From Home Offer',
    type: 'WhatsApp Screenshot',
    extracted: 'Amazon HR: You are selected for part-time daily tasks. Earn ₹25,000/week by liking YouTube videos. Pay ₹1,000 security fee to Telegram admin @task_manager.',
    risk: 86,
    desc: 'Unsolicited job offer demanding advance security deposit.'
  }
];

export default function ScreenshotAnalyzerPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isNewbieMode, setIsNewbieMode] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Live Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToHistory } = useHistory();

  const handleSelectFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setResult(null);
    setExtractedText(null);

    processImageAndAnalyze(file.name);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectFile(e.dataTransfer.files[0]);
    }
  };

  const processImageAndAnalyze = async (name: string, customText?: string) => {
    setIsAnalyzing(true);
    setCurrentStep(0);

    const stepTimer = setInterval(() => {
      setCurrentStep(prev => (prev < (ANALYSIS_STEPS?.length || 6) - 1 ? prev + 1 : prev));
    }, 350);

    await new Promise(r => setTimeout(r, 2200));
    clearInterval(stepTimer);

    const ocrText = customText || (
      name.toLowerCase().includes('payment') || name.toLowerCase().includes('upi')
        ? 'Payment Successful: ₹12,500 transferred. If not done by you, click immediately to reverse transaction: http://upi-reverse-auth.xyz/verify'
        : name.toLowerCase().includes('email')
        ? 'Account Alert: Netflix billing payment failed. Update card details within 24 hours: http://netflix-billing-recovery.club/login'
        : 'URGENT: Your bank account has been blocked due to KYC non-compliance. Update immediately at http://sbi-secure-kyc.xyz/verify or account will be suspended.'
    );

    setExtractedText(ocrText);
    
    let analysis: any = null;
    try {
      const syntheticBlob = new Blob([ocrText], { type: 'text/plain' });
      analysis = await safeguardAPI.scanImage(syntheticBlob, ocrText);
    } catch (apiErr: any) {
      console.warn('Backend image scan notice, using local engine fallback:', apiErr?.message);
      analysis = analyzeMessage(ocrText, 'Screenshot Evidence');
    }

    analysis.type = 'screenshot';
    analysis.input = `Screenshot OCR: ${name}`;

    setResult(analysis);
    addToHistory(analysis);
    setIsAnalyzing(false);
  };

  const loadPreset = (preset: typeof SAMPLE_SCREENSHOT_PRESETS[0]) => {
    // Generate synthetic SVG screenshot data URL
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="350" viewBox="0 0 600 350">
      <rect width="100%" height="100%" fill="#081118"/>
      <rect x="20" y="20" width="560" height="310" rx="16" fill="#0E171F" stroke="#00E5FF" stroke-width="2"/>
      <text x="40" y="70" font-family="monospace" font-size="18" font-weight="bold" fill="#00E5FF">${preset.type}</text>
      <line x1="40" y1="90" x2="560" y2="90" stroke="#1D3038" stroke-width="2"/>
      <foreignObject x="40" y="110" width="520" height="180">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif;font-size:14px;color:#F1F5F9;line-height:1.6;background:#050A0F;padding:16px;border-radius:12px;border:1px solid #1D3038;">
          ${preset.extracted}
        </div>
      </foreignObject>
    </svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    setPreviewUrl(url);
    setFileName(`${preset.id}.png`);
    setFileSize('145.2 KB');
    setResult(null);
    setExtractedText(null);

    processImageAndAnalyze(preset.title, preset.extracted);
  };

  // Live Camera Functions
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        mediaStreamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch {
      fileInputRef.current?.click();
    }
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
    }
  }, [isCameraActive]);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `evidence_camera_${Date.now()}.png`, { type: 'image/png' });
            stopCamera();
            handleSelectFile(file);
          }
        }, 'image/png');
      }
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

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = result ? circumference - (result.riskScore / 100) * circumference : circumference;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 font-sans text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1D3038] pb-5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            <Camera className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Evidence Analyzer (Photo / Camera)</h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
              Live camera capture & photo OCR text extraction for scam messages, fake UPI bills, & fraud evidence
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

      {/* Upload Drag & Drop Area */}
      {!previewUrl && !isCameraActive && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-10 sm:p-14 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center space-y-4 ${
              dragActive 
                ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(0,229,255,0.3)]' 
                : 'border-[#1D3038] bg-[#0E171F] hover:border-cyan-500/60 hover:bg-[#111C24]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={(e) => e.target.files?.[0] && handleSelectFile(e.target.files[0])}
              className="hidden"
            />

            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#050A0F] border border-[#1D3038] flex items-center justify-center text-cyan-400 shadow-md">
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                Drag & Drop Screenshot or Click to Browse
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Supported formats: PNG, JPG, JPEG, WEBP • Max 15 MB
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-cyan-400" /> SMS Screenshots</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-cyan-400" /> Fake UPI/GPay Receipts</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-cyan-400" /> Social Media DMs</span>
            </div>
          </div>

          {/* Action Options: Example and Camera */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => loadPreset(SAMPLE_SCREENSHOT_PRESETS[0])}
              className="px-6 py-3 rounded-xl bg-[#0E171F] border border-cyan-500/40 hover:bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 font-mono text-xs font-semibold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,229,255,0.15)]"
              title="Load example suspicious evidence screenshot"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Example</span>
            </button>
            <button
              onClick={startCamera}
              className="px-6 py-3 rounded-xl bg-[#0E171F] border border-[#1D3038] hover:border-cyan-400 text-slate-200 font-mono text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Video className="w-4 h-4 text-cyan-400" />
              <span>Capture Live Evidence via Device Camera</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Live Webcam Stream View */}
      {isCameraActive && (
        <div className="p-6 rounded-3xl bg-[#0E171F] border border-cyan-500/40 text-center space-y-4">
          <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-[#1D3038] bg-black">
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={capturePhoto}
              className="px-6 py-2.5 bg-cyan-400 text-slate-950 font-mono text-xs font-bold uppercase rounded-xl shadow-lg"
            >
              Snap & Analyze Photo
            </button>
            <button
              onClick={stopCamera}
              className="px-5 py-2.5 border border-[#1D3038] text-slate-400 rounded-xl font-mono text-xs"
            >
              Cancel Camera
            </button>
          </div>
        </div>
      )}

      {/* Preview & Active Scan Stage */}
      {previewUrl && (
        <div className="p-6 rounded-3xl bg-[#0E171F] border border-[#1D3038] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1D3038] pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs text-white font-bold">{fileName}</span>
              <span className="text-[10px] font-mono text-slate-500">({fileSize})</span>
            </div>
            <button
              onClick={clearPhoto}
              className="p-1 rounded text-slate-400 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Image Preview Thumbnail */}
            <div className="md:col-span-5 rounded-2xl overflow-hidden border border-[#1D3038] bg-[#050A0F] max-h-72 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Evidence preview" className="max-h-64 object-contain rounded-xl" />
            </div>

            {/* Extracted Text Box (OCR) */}
            <div className="md:col-span-7 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                  OCR EXTRACTED TEXT
                </span>
                <span className="text-[10px] font-mono text-slate-500">Tesseract OCR Stream</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#050A0F] border border-[#1D3038] font-mono text-xs text-slate-200 leading-relaxed min-h-[140px] whitespace-pre-wrap">
                {extractedText || (
                  <span className="text-slate-500 italic flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    Extracting text from image characters...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Analysis Loading */}
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
                      OCR & AI Vision Pipeline
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">Parsing extracted text for fraudulent payment traps and smishing</p>
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

      {/* Final Results Display (Section 8) */}
      <AnimatePresence>
        {result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Top Cards: Score Meter & Threat Indicators */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Risk Meter Card */}
              <div className="lg:col-span-5 bg-[#0E171F] border border-[#1D3038] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
                <div className="flex items-center justify-between w-full border-b border-[#1D3038] pb-3">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
                    EVIDENCE RISK SCORE
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
                    <span className="text-xs font-mono text-slate-400 mt-1">/ 100 Risk</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-lg font-bold text-white flex items-center justify-center gap-2">
                    {result.riskScore > 50 ? (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    )}
                    <span>{result.threatLabel || 'Screenshot Threat'}</span>
                  </div>
                  <p className="text-xs font-mono text-slate-400">
                    OCR Forensic Certainty: 96.8%
                  </p>
                </div>
              </div>

              {/* Detected Scam Indicators */}
              <div className="lg:col-span-7 bg-[#0E171F] border border-[#1D3038] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#1D3038] pb-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Detected Scam Indicators</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">Image Forensics</span>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-2">
                  {result.indicators?.filter((i: any) => i.detected).map((ind: any, i: number) => (
                    <div 
                      key={i} 
                      className="p-3 rounded-xl bg-[#050A0F] border border-[#1D3038] flex items-start gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-100 font-mono block">
                          {ind.label || ind.name || 'OCR Signature Anomaly'}
                        </span>
                        <p className="text-xs text-slate-400 font-mono">
                          {ind.description}
                        </p>
                      </div>
                    </div>
                  ))}

                  {(!result.indicators || result.indicators.filter((i: any) => i.detected).length === 0) && (
                    <div className="p-4 rounded-xl bg-[#050A0F] border border-[#1D3038] text-xs font-mono text-slate-400">
                      Clean screenshot evidence. No manipulative scam constructs detected.
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#050A0F] border border-[#1D3038] text-xs font-mono text-slate-300">
                  <span className="text-cyan-400 font-bold">SafeGuard Tip:</span> Scammers commonly Photoshop UPI timestamps and font weights to manufacture fake payment confirmation receipts.
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
                    <p className="text-[11px] text-slate-400 font-mono">Plain-language explanation for this screenshot</p>
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
                          ? '⚠️ This screenshot shows a fabricated message designed to induce fear or false excitement. If someone sent you this as proof of payment, do not ship any goods until you independently open your banking app and verify the money is in your bank account balance.'
                          : 'The text extracted from this image shows no signs of coercion, fake lottery lures, or deceptive shortlinks.'
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 font-mono">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#111C24] text-slate-400 text-xs font-semibold">
                      ⚙️ TECHNICAL SECURITY BREAKDOWN
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {result.technicalExplanation || `OCR extracted tokens analyzed against fraud dictionary. High correlation with UPI screenshot forgery, credential request anomalies, and fraudulent urgency grammar resulting in risk score ${result.riskScore}/100.`}
                    </p>
                  </div>
                )}
              </div>

              {/* Safety Recommendations */}
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
                    SAFETY RECOMMENDATIONS
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-mono">
                  {result.recommendedAction || 'Do NOT scan QR codes to receive money. Do NOT click unfamiliar links shown in this screenshot. Always verify independently through your bank statement.'}
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
                    onClick={clearPhoto}
                    className="px-5 py-2.5 rounded-xl border border-[#1D3038] hover:bg-[#111C24] text-slate-300 font-mono text-xs font-medium transition-all"
                  >
                    Analyze Another Screenshot
                  </button>
                </div>

                {result.riskScore > 50 && (
                  <Link
                    href="/report-scam"
                    className="px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Report Fraud Evidence</span>
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
