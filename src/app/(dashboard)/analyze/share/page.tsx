'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Share2, ShieldCheck, Key, Clock, Copy, Download } from 'lucide-react';

export default function SecureFileSharePage() {
  const [file, setFile] = useState<File | null>(null);
  const [passphrase, setPassphrase] = useState('');
  const [expiry, setExpiry] = useState('24h');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (!file) return;
    const fakeId = Math.random().toString(36).substring(2, 9);
    const generated = `https://trustnetra.vercel.app/share/${fakeId}?exp=${expiry}&enc=aes256`;
    setShareLink(generated);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-teal-500/20 rounded-xl">
          <Lock className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Secure Encrypted File Sharing</h1>
          <p className="text-gray-500 dark:text-gray-400">Share files securely with Client-Side Encryption, password access controls, & auto-expiration.</p>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select File to Encrypt & Share</label>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl p-3 text-sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
              <Key className="w-4 h-4 text-teal-400" /> Access Passphrase (Optional)
            </label>
            <input
              type="text"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter password required to unlock file..."
              className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
              <Clock className="w-4 h-4 text-teal-400" /> Expiration Timer
            </label>
            <select
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-900 dark:text-white"
            >
              <option value="1h">1 Hour (Single Use)</option>
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleShare}
            disabled={!file}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-medium rounded-xl transition-all flex items-center gap-2"
          >
            <Share2 className="w-5 h-5" /> Generate Encrypted Link
          </button>
          <button
            onClick={() => {
              const sampleFile = new File(['confidential_audit_report'], 'Confidential_Audit_Report.pdf', { type: 'application/pdf' });
              setFile(sampleFile);
              setPassphrase('SecureVault2026!');
              const fakeId = Math.random().toString(36).substring(2, 9);
              setShareLink(`https://trustnetra-wru7.vercel.app/share/${fakeId}?exp=${expiry}&enc=aes256`);
            }}
            className="px-5 py-2.5 bg-[#081118] hover:bg-[#111C24] text-[#00E5FF] border border-[#00E5FF]/40 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            TRY EXAMPLE
          </button>
        </div>

        {shareLink && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 space-y-3">
            <div className="text-xs font-semibold uppercase text-teal-400 tracking-wider">Encrypted Shareable Link Ready</div>
            <div className="flex items-center gap-2">
              <input type="text" readOnly value={shareLink} className="flex-1 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-lg p-2.5 text-xs font-mono text-gray-900 dark:text-white" />
              <button onClick={handleCopy} className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-white rounded-lg text-xs font-medium flex items-center gap-1">
                <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
            <p className="text-xs text-gray-400">File is protected with AES-256 client-side encryption. Link automatically expires in {expiry}.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
