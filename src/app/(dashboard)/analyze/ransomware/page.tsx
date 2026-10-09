'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldOff, AlertTriangle, CheckCircle, ShieldAlert, Play } from 'lucide-react';
import { useHistory } from '@/lib/context/providers';
import { analyzeRansomwarePattern } from '@/lib/ai/ransomware-analyzer';
import { AnalysisResult } from '@/types';

export default function RansomwareShieldPage() {
  const [scenario, setScenario] = useState('vssadmin delete shadows /all /quiet && bcdedit /set {default} recoveryenabled No');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { addToHistory } = useHistory();

  const handleTest = () => {
    const res = analyzeRansomwarePattern(scenario);
    setResult(res);

    addToHistory(res);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-red-500/20 rounded-xl">
          <ShieldOff className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Safe Ransomware Behavior Detector</h1>
          <p className="text-gray-500 dark:text-gray-400">Safely analyze process behaviors, mass file encryption indicators, & shadow copy deletion attempts.</p>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Process Log / Command Line Execution Signature to Test
          </label>
          <textarea
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="Paste process execution log or command line parameters..."
            className="w-full h-32 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl p-4 text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleTest}
            className="px-6 py-3 bg-red-500 hover:bg-red-400 text-white font-medium rounded-xl transition-all flex items-center gap-2"
          >
            <Play className="w-5 h-5" /> Run Safe Behavior Analysis
          </button>
          <button
            onClick={() => {
              const sampleLog = 'vssadmin.exe delete shadows /all /quiet && wmic shadowcopy delete && bcdedit /set {default} bootstatuspolicy ignoreallfailures';
              setScenario(sampleLog);
              const res = analyzeRansomwarePattern(sampleLog);
              setResult(res);
              addToHistory(res);
            }}
            className="px-5 py-2.5 bg-[#081118] hover:bg-[#111C24] text-[#00E5FF] border border-[#00E5FF]/40 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            TRY EXAMPLE
          </button>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">{result.threatLabel}</div>
                <div className="text-xs text-gray-500">Execution Analysis Complete</div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${result.riskScore <= 20 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                Threat Level: {result.riskScore}/100
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Ransomware Heuristic Flags</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.indicators.map((ind: any, i: number) => (
                  <div key={i} className="flex items-center space-x-2 text-sm p-3 rounded-lg bg-gray-100 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
                    {ind.detected ? <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" /> : <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span className="text-gray-700 dark:text-gray-300">{ind.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
              <strong>Emergency Guidance:</strong> {result.recommendedAction}
            </div>

            <p className="text-xs text-emerald-400">
              🛡️ Safety Guarantee: This tool runs 100% simulated pattern matching. Zero actual OS commands or malicious code are ever executed.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
