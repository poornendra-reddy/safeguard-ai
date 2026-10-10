'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldOff, AlertTriangle, CheckCircle, ShieldAlert, Play, History, ArrowRight, Sparkles } from 'lucide-react';
import { useHistory } from '@/lib/context/providers';
import { analyzeRansomwarePattern } from '@/lib/ai/ransomware-analyzer';
import { safeguardAPI } from '@/lib/api-client';
import { AnalysisResult } from '@/types';

export default function RansomwareShieldPage() {
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { addToHistory } = useHistory();

  const handleTest = async () => {
    if (!scenario.trim()) return;
    let res: AnalysisResult | null = null;
    try {
      res = await safeguardAPI.scanRansomware(scenario.trim());
    } catch (err: any) {
      console.warn('Backend ransomware scan notice, using local engine fallback:', err?.message);
      res = analyzeRansomwarePattern(scenario);
    }
    setResult(res);
    addToHistory(res);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <ShieldOff className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Safe Ransomware Behavior Detector</h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-mono">Safely analyze process behaviors, mass file encryption indicators, & shadow copy deletion attempts.</p>
          </div>
        </div>

        <Link
          href="/history"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0E171F] border border-[#1D3038] hover:border-cyan-400 text-xs font-mono text-cyan-400 transition-all"
        >
          <History className="w-4 h-4" />
          <span>View Scan History</span>
        </Link>
      </div>

      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Process Log / Command Line Execution Signature to Test
          </label>
          <textarea
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="Paste suspicious process execution log, PowerShell command, or script to test..."
            className="w-full h-32 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl p-4 text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleTest}
            disabled={!scenario.trim()}
            className="px-6 py-3 bg-red-500 hover:bg-red-400 disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center gap-2 font-mono text-xs uppercase"
          >
            <Play className="w-4 h-4" /> Run Safe Behavior Analysis
          </button>
          <button
            onClick={async () => {
              const sampleLog = 'vssadmin.exe delete shadows /all /quiet && wmic shadowcopy delete && bcdedit /set {default} bootstatuspolicy ignoreallfailures';
              setScenario(sampleLog);
              let res: AnalysisResult | null = null;
              try {
                res = await safeguardAPI.scanRansomware(sampleLog);
              } catch {
                res = analyzeRansomwarePattern(sampleLog);
              }
              setResult(res);
              addToHistory(res);
            }}
            className="px-5 py-2.5 bg-[#081118] hover:bg-[#111C24] text-[#00E5FF] border border-[#00E5FF]/40 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            <span>Example</span>
          </button>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">{result.threatLabel}</div>
                <div className="text-xs text-gray-500 font-mono">Execution Analysis Complete</div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold font-mono ${result.riskScore <= 20 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                Threat Level: {result.riskScore}/100
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Ransomware Heuristic Flags</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.indicators.map((ind: any, i: number) => (
                  <div key={i} className="flex items-center space-x-2 text-sm p-3 rounded-lg bg-gray-100 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
                    {ind.detected ? <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" /> : <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span className="text-gray-700 dark:text-gray-300 font-mono text-xs">{ind.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300 font-mono text-xs">
              <strong>Emergency Guidance:</strong> {result.recommendedAction}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#1D3038]">
              <Link
                href="/history"
                className="px-4 py-2 bg-[#0E171F] border border-[#1D3038] hover:border-cyan-400 text-xs font-mono text-cyan-400 rounded-xl transition-all flex items-center gap-1.5"
              >
                <History className="w-3.5 h-3.5" />
                <span>View Threat History Logs</span>
              </Link>
              <Link
                href={`/report/${result.id || 'current'}`}
                className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-950 font-mono text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>View Full Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
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
