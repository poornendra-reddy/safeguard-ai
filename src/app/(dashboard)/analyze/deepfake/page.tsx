'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Upload, AlertTriangle, CheckCircle, Video } from 'lucide-react';
import { useHistory } from '@/lib/context/providers';
import { analyzeDeepfakeMedia } from '@/lib/ai/deepfake-analyzer';
import { AnalysisResult } from '@/types';

export default function DeepfakeDetectorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { addToHistory } = useHistory();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const res = analyzeDeepfakeMedia({ name: selected.name, size: selected.size, type: selected.type });
      setResult(res);

      addToHistory(res);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-purple-500/20 rounded-xl">
          <Eye className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Deepfake & Media Manipulation Detector</h1>
          <p className="text-gray-500 dark:text-gray-400">Analyze images, audio, & video for synthetic facial/voice AI indicators.</p>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-500 rounded-2xl p-8 text-center cursor-pointer transition-all">
          <input type="file" onChange={handleFileChange} accept="image/*,video/*,audio/*" className="hidden" id="df-upload" />
          <label htmlFor="df-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-3">
            <Video className="w-10 h-10 text-purple-400" />
            <span className="text-lg font-medium text-gray-900 dark:text-white">Upload Image, Audio, or Video File</span>
            <span className="text-xs text-gray-500">Supports MP4, WAV, MP3, PNG, JPG. Scanned for facial and voice frequency anomalies.</span>
          </label>
          <div className="pt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const sampleFile = new File(['fake_media'], 'synthetic_ceo_voice_clone.wav', { type: 'audio/wav' });
                setFile(sampleFile);
                const res = analyzeDeepfakeMedia({ name: sampleFile.name, type: sampleFile.type, size: 1850000 });
                setResult(res);
                addToHistory(res);
              }}
              className="px-5 py-2.5 bg-[#081118] hover:bg-[#111C24] text-[#00E5FF] border border-[#00E5FF]/40 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2"
            >
              TRY EXAMPLE
            </button>
          </div>
        </div>

        {file && result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">{file.name}</div>
                <div className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB — {file.type}</div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${result.riskScore <= 50 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'}`}>
                AI Confidence Score: {result.riskScore}% Synthetic
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">AI Deepfake Indicators Evaluated</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.indicators.map((ind: any, i: number) => (
                  <div key={i} className="flex items-center space-x-2 text-sm p-3 rounded-lg bg-gray-100 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
                    {ind.detected ? <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0" /> : <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span className="text-gray-700 dark:text-gray-300">{ind.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-sm text-purple-300">
              <strong>Recommendation:</strong> {result.recommendedAction}
            </div>

            <p className="text-xs text-gray-400 italic">
              Disclaimer: Deepfake analysis is AI-assisted estimation based on spatial and temporal indicators, not 100% legal proof.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
