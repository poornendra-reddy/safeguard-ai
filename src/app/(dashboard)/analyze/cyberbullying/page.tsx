'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareX, AlertTriangle, CheckCircle, Search, ShieldCheck } from 'lucide-react';
import { useHistory } from '@/lib/context/providers';
import { analyzeCyberbullying } from '@/lib/ai/cyberbullying-analyzer';
import { AnalysisResult } from '@/types';

export default function CyberbullyingDetectorPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { addToHistory } = useHistory();

  const handleAnalyze = () => {
    if (!text.trim()) return;
    const res = analyzeCyberbullying(text);
    setResult(res);

    addToHistory(res);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-pink-500/20 rounded-xl">
          <MessageSquareX className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cyberbullying & Harassment Detector</h1>
          <p className="text-gray-500 dark:text-gray-400">Classify abusive, threatening, or toxic comments while preserving safe disagreements.</p>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Paste Message, Comment, or Social Media Text to Check
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste suspicious text or comment here..."
            className="w-full h-36 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl p-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!text.trim()}
          className="px-6 py-3 bg-pink-500 hover:bg-pink-400 text-white font-medium rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Search className="w-5 h-5" /> Analyze Text Toxicity
        </button>

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">{result.threatLabel}</div>
                <div className="text-xs text-gray-500">Classification Complete</div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${result.riskScore <= 20 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                Toxicity Score: {result.riskScore}/100
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Toxicity Flags</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.indicators.map((ind: any, i: number) => (
                  <div key={i} className="flex items-center space-x-2 text-sm p-3 rounded-lg bg-gray-100 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
                    {ind.detected ? <AlertTriangle className="w-4 h-4 text-pink-400 shrink-0" /> : <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span className="text-gray-700 dark:text-gray-300">{ind.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 text-sm text-pink-300">
              <strong>Recommended Safety Action:</strong> {result.recommendedAction}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
