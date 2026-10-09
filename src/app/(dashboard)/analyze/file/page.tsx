'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileX, Upload, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { useHistory } from '@/lib/context/providers';
import { analyzeFileMetadata } from '@/lib/ai/file-analyzer';
import { AnalysisResult } from '@/types';

export default function MaliciousFileDetectorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { addToHistory } = useHistory();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const res = analyzeFileMetadata({ name: selected.name, size: selected.size, type: selected.type });
      setResult(res);
      
      addToHistory(res);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-rose-500/20 rounded-xl">
          <FileX className="w-6 h-6 text-rose-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Malicious File Detection System</h1>
          <p className="text-gray-500 dark:text-gray-400">Inspect file extension, double masking, and headers before opening attachments.</p>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-rose-500 rounded-2xl p-8 text-center cursor-pointer transition-all">
          <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-3">
            <Upload className="w-10 h-10 text-rose-500" />
            <span className="text-lg font-medium text-gray-900 dark:text-white">Click to choose a file for security analysis</span>
            <span className="text-xs text-gray-500">Supports documents, scripts, executables, & archives. Files are NOT executed.</span>
          </label>
          <div className="pt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const sampleFile = new File(['fake_payload'], 'invoice_urgent_scan.pdf.exe', { type: 'application/x-msdownload' });
                setFile(sampleFile);
                const res = analyzeFileMetadata({ name: sampleFile.name, size: 245000, type: sampleFile.type });
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
                <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB — {file.type || 'Unknown MIME type'}</div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${result.riskScore <= 20 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {result.threatLabel} (Risk: {result.riskScore}/100)
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Security Indicators</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.indicators.map((ind: any, i: number) => (
                  <div key={i} className="flex items-center space-x-2 text-sm p-3 rounded-lg bg-gray-100 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
                    {ind.detected ? <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" /> : <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span className="text-gray-700 dark:text-gray-300">{ind.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-300">
              <strong>Action Required:</strong> {result.recommendedAction}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
