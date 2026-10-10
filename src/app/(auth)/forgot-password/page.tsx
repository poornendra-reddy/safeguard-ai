'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { KeyRound, Mail, ArrowLeft, Shield, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#060D13] text-slate-100 p-4 font-sans relative">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-500/10 blur-[130px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
              <Shield className="w-7 h-7 text-cyan-400" />
            </div>
            <span className="text-2xl font-extrabold text-white">SAFEGUARD AI</span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0E171F] border border-[#1D3038] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {!isSubmitted ? (
            <>
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#081118] border border-[#1D3038] mb-2 text-cyan-400">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-white">Password Recovery</h2>
                <p className="text-xs text-slate-400 font-mono">
                  Enter your registered operator email to receive a secure recovery OTP link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Registered Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-[#050A0F] border border-[#1D3038] rounded-xl focus:border-cyan-400 focus:outline-none text-xs font-mono text-white placeholder-slate-600 transition-all"
                      placeholder="operator@safeguard.ai"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center py-3 px-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                >
                  {loading ? 'Transmitting OTP...' : 'Send Recovery Instructions'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">Check Your Inbox</h2>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                We sent a secure password reset link and temporary verification PIN to <br />
                <span className="font-bold text-cyan-400">{email}</span>
              </p>
              
              <div className="p-3 bg-[#050A0F] border border-[#1D3038] rounded-xl text-[11px] font-mono text-slate-300">
                Token expires in 15 minutes. Ensure link is signed by verify.safeguard.ai.
              </div>

              <button
                onClick={() => setIsSubmitted(false)}
                className="text-xs font-mono text-cyan-400 hover:underline"
              >
                Didn't receive instructions? Click to resend
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-[#1D3038] text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Operator Sign In</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
