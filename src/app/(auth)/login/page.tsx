'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Loader2, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/context/providers';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('poorn@safeguard.ai');
    setPassword('CyberGuard#2026!');
    setLoading(true);
    try {
      await login('poorn@safeguard.ai', 'CyberGuard#2026!');
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#060D13] text-slate-100 font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#081118] items-center justify-center overflow-hidden border-r border-[#1D3038]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-cyan-500/20 blur-[130px] rounded-full" />
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-emerald-500/15 blur-[130px] rounded-full" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00e5ff08_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        </div>
        
        <div className="relative z-10 p-12 text-center max-w-lg space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="p-4 bg-[#0E171F] rounded-2xl border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(0,229,255,0.2)]">
              <Shield className="w-16 h-16 text-cyan-400" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-white"
          >
            SAFEGUARD <span className="text-cyan-400">AI</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-slate-400 leading-relaxed font-mono"
          >
            Detect. Understand. Stay Safe. Next-generation AI cybersecurity protection against phishing, fake links, and online scams.
          </motion.p>
          
          <div className="pt-4 flex flex-col gap-2.5 text-xs font-mono text-slate-400 text-left bg-[#050A0F] p-4 rounded-xl border border-[#1D3038]">
            <div className="flex items-center gap-2 text-cyan-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Multi-Vector URL & SMS Threat Scanner</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Plain-Language AI Explanations</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Citizen Cybercrime Reporting Suite</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-6">
            <Shield className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold tracking-tight">SAFEGUARD AI</span>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Operator Login</h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">Sign in to access your security telemetry & threat history.</p>
          </div>

          <div className="bg-[#0E171F] border border-[#1D3038] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs text-red-400 bg-red-950/30 border border-red-500/40 rounded-lg font-mono">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#050A0F] border border-[#1D3038] rounded-xl focus:border-cyan-400 focus:outline-none text-xs font-mono text-white placeholder-slate-600 transition-all"
                    placeholder="operator@safeguard.ai"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#050A0F] border border-[#1D3038] rounded-xl focus:border-cyan-400 focus:outline-none text-xs font-mono text-white placeholder-slate-600 transition-all"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-[#050A0F] border-[#1D3038] text-cyan-400 focus:ring-0"
                  />
                  <span>Remember session</span>
                </label>
                
                <Link href="/forgot-password" className="text-cyan-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authenticate & Sign In'}
              </button>
            </form>

            {/* Quick Demo Operator Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#081118] hover:bg-[#111C24] text-cyan-400 border border-cyan-500/30 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>1-Click Hackathon Demo Login</span>
            </button>

            <div className="relative pt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1D3038]"></div>
              </div>
              <div className="relative flex justify-center text-xs font-mono">
                <span className="px-2 bg-[#0E171F] text-slate-500">Or continue with</span>
              </div>
            </div>

            <div>
              <button 
                type="button" 
                onClick={handleDemoLogin}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-[#081118] border border-[#1D3038] hover:border-slate-600 rounded-xl font-mono text-xs text-slate-300 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
            
            <p className="pt-2 text-center text-xs font-mono text-slate-400">
              Don't have an operator account?{' '}
              <Link href="/register" className="text-cyan-400 font-bold hover:underline inline-flex items-center gap-1">
                Sign Up <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
