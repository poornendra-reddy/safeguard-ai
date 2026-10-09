'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, ShieldAlert, CheckCircle, WifiOff, RefreshCw } from 'lucide-react';
import { useHistory } from '@/lib/context/providers';
import { analyzeNetworkRisk } from '@/lib/ai/network-analyzer';
import { AnalysisResult } from '@/types';

export default function NetworkRiskPage() {
  const [ssid, setSsid] = useState('Airport_Free_WiFi');
  const [authType, setAuthType] = useState('Open / No Encryption');
  const [isPublic, setIsPublic] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const { addToHistory } = useHistory();

  const handleScan = () => {
    const res = analyzeNetworkRisk({ ssid, authType, isPublic });
    setResult(res);

    addToHistory(res);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-cyan-500/20 rounded-xl">
          <Wifi className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Public Wi-Fi Risk Detector</h1>
          <p className="text-gray-500 dark:text-gray-400">Assess network encryption and Man-In-The-Middle risks on public connections.</p>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Network Name (SSID)</label>
            <input
              type="text"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wi-Fi Encryption Mode</label>
            <select
              value={authType}
              onChange={(e) => setAuthType(e.target.value)}
              className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-900 dark:text-white"
            >
              <option value="Open / No Encryption">Open / Unencrypted Network</option>
              <option value="WPA2-Personal">WPA2 Personal (Password Protected)</option>
              <option value="WPA3-Enterprise">WPA3 Enterprise (Secure Encrypted)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleScan}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-medium rounded-xl transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" /> Run Wi-Fi Risk Assessment
          </button>
          <button
            onClick={() => {
              setSsid('Airport_Free_Unsecured_WiFi');
              setAuthType('Open / No Encryption');
              const res = analyzeNetworkRisk({ ssid: 'Airport_Free_Unsecured_WiFi', authType: 'Open / No Encryption' });
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
                <div className="text-xs text-gray-500">{result.input}</div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${result.riskScore <= 20 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                Risk: {result.riskScore}/100
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Security Indicators</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.indicators.map((ind: any, i: number) => (
                  <div key={i} className="flex items-center space-x-2 text-sm p-3 rounded-lg bg-gray-100 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
                    {ind.detected ? <WifiOff className="w-4 h-4 text-amber-400 shrink-0" /> : <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span className="text-gray-700 dark:text-gray-300">{ind.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-300">
              <strong>Recommendation:</strong> {result.recommendedAction}
            </div>
            
            <p className="text-xs text-gray-400 italic">
              Note: Web browsers enforce security sandboxing that prevents direct access to raw OS hardware Wi-Fi interfaces. This security assessment evaluates technical parameters available to the browser context.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
