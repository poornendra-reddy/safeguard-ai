'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, ShieldCheck, AlertTriangle, CheckCircle, Copy, Info, ShieldAlert } from 'lucide-react';
import { useHistory } from '@/lib/context/providers';
import { checkPassword } from '@/lib/ai/password-analyzer';
import { AnalysisResult } from '@/types';

export default function PasswordCheckerPage() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { addToHistory } = useHistory();

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (!val) {
      setResult(null);
      return;
    }
    const res = checkPassword(val);
    setResult(res);
  };

  const handleSaveAssessment = () => {
    if (result) {
      addToHistory(result);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-yellow-500/20 rounded-xl">
          <Key className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Password Security Checker</h1>
          <p className="text-gray-500 dark:text-gray-400">Test password strength securely in real-time. Password is NEVER stored or sent to a server.</p>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter Password to Test
          </label>
          <input
            type="password"
            value={password}
            onChange={handleCheck}
            placeholder="Type a password to test strength..."
            className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl px-4 py-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all font-mono"
          />
          <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> 100% Client-Side Computation — zero data leaves your browser.
          </p>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Security Score</div>
                <div className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                  {100 - result.riskScore}/100
                </div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${result.riskScore <= 20 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : result.riskScore <= 50 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {result.threatLabel}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Security Indicators</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.indicators.map((ind: any, i: number) => (
                  <div key={i} className="flex items-center space-x-2 text-sm p-3 rounded-lg bg-gray-100 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
                    {ind.detected ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                    <span className="text-gray-700 dark:text-gray-300">{ind.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-300">
              <strong>Recommendation:</strong> {result.recommendedAction}
            </div>

            <button onClick={handleSaveAssessment} className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium transition-all">
              Save Assessment to History
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
