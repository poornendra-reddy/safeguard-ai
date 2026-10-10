'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield, Link as LinkIcon, MessageSquare, ShieldCheck, AlertTriangle, Award,
  Mail, Camera, QrCode, Globe, Zap, Activity, ArrowRight, ArrowUpRight, PlusCircle,
  FileText, CheckCircle2, AlertCircle, ChevronRight, HelpCircle, Lock, Lightbulb, RefreshCw,
  Key, FileX, ShieldAlert, Wifi, Eye, ShieldOff, PhoneOff
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useAuth, useHistory } from '@/lib/context/providers';
import { SECURITY_TIPS, WEEKLY_ACTIVITY_DATA } from '@/lib/constants';

const PIE_COLORS = ['#ef4444', '#f97316', '#eab308', '#8b5cf6', '#06b6d4', '#10b981'];

const QUICK_ANALYSIS_OPTIONS = [
  { id: 1, title: 'URL Scanner', desc: 'Scan domain age, typosquatting, redirect chains & malicious TLDs', icon: LinkIcon, href: '/analyze/url', color: 'text-cyan-400', border: 'hover:border-cyan-400' },
  { id: 2, title: 'Message Scanner', desc: 'Detect SMS smishing, fake lottery prizes & WhatsApp/Telegram scams', icon: MessageSquare, href: '/analyze/message', color: 'text-orange-400', border: 'hover:border-orange-400' },
  { id: 3, title: 'Email Analyzer', desc: 'Verify sender authenticity, domain mismatch, spoofing & links', icon: Mail, href: '/analyze/email', color: 'text-blue-400', border: 'hover:border-blue-400' },
  { id: 4, title: 'Evidence Analyzer (Photo/Camera)', desc: 'OCR image text extraction for screenshots & live camera fraud proofs', icon: Camera, href: '/analyze/screenshot', color: 'text-purple-400', border: 'hover:border-purple-400' },
  { id: 5, title: 'QR Code Scanner', desc: 'Scan or upload QR code to intercept malicious links & UPI debit traps', icon: QrCode, href: '/analyze/qr', color: 'text-yellow-400', border: 'hover:border-yellow-400' },
  { id: 6, title: 'Password Strength & Breach Check', desc: 'Test password entropy and cross-reference 850M+ leaked breach records', icon: Key, href: '/analyze/password', color: 'text-amber-400', border: 'hover:border-amber-400' },
  { id: 7, title: 'Malicious File Analyzer', desc: 'Detect dangerous extensions, double-masking & weaponized attachments', icon: FileX, href: '/analyze/file', color: 'text-rose-400', border: 'hover:border-rose-400' },
  { id: 8, title: 'Encrypted File Share', desc: 'Client-side AES-256 encrypted file transfer with password & expiry controls', icon: Lock, href: '/analyze/share', color: 'text-teal-400', border: 'hover:border-teal-400' },
  { id: 9, title: 'Browser Security Scanner', desc: 'Audit browser extensions for high-risk permissions & clipboard access', icon: ShieldAlert, href: '/analyze/browser', color: 'text-red-400', border: 'hover:border-red-400' },
  { id: 10, title: 'Wi-Fi Network Scanner', desc: 'Detect insecure open Wi-Fi, MITM eavesdropping & evil-twin risks', icon: Wifi, href: '/analyze/network', color: 'text-sky-400', border: 'hover:border-sky-400' },
  { id: 11, title: 'Deepfake Audio/Video Analyzer', desc: 'Inspect media for AI voice cloning, facial artifacts & synthetic media', icon: Eye, href: '/analyze/deepfake', color: 'text-violet-400', border: 'hover:border-violet-400' },
  { id: 12, title: 'Ransomware Pattern Detector', desc: 'Safe simulation of volume shadow deletion & mass encryption behaviors', icon: ShieldOff, href: '/analyze/ransomware', color: 'text-red-500', border: 'hover:border-red-500' },
  { id: 13, title: 'Website Reputation Checker', desc: 'Full domain identity audit, SSL cipher rating, and brand spoofing score', icon: Globe, href: '/analyze/website', color: 'text-emerald-400', border: 'hover:border-emerald-400' },
  { id: 14, title: 'Spam/Vishing Call Analyzer', desc: 'Detect Digital Arrest calls, TRAI threats, & telecom robocalls', icon: PhoneOff, href: '/analyze/call', color: 'text-fuchsia-400', border: 'hover:border-fuchsia-400' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { history } = useHistory();
  const [tipIndex, setTipIndex] = useState(0);

  // User details & default fallback
  const userName = user?.name || 'Security Operator';
  
  // Real dynamic telemetry calculations from scan history
  const totalScans = history.length;
  const urlsAnalyzed = history.filter(h => h.type === 'url' || h.type === 'website').length;
  const messagesAnalyzed = history.filter(h => h.type === 'message' || h.type === 'email').length;
  const threatsDetected = history.filter(h => h.riskScore > 50).length;
  const safeChecks = history.filter(h => h.riskScore <= 20).length;
  const highRiskDetections = history.filter(h => h.riskScore >= 76).length;

  // Calculated Security Awareness Score (starts at 78 baseline or calibrated by user performance)
  const userSecurityScore = user?.securityScore || 78;

  // Category distribution for pie chart (100% real logs from history)
  const categoryCounts: Record<string, number> = {};
  if (history.length > 0) {
    history.forEach(item => {
      const cat = item.threatLabel || item.threatCategory || 'Unknown';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
  }

  const threatChartData = Object.keys(categoryCounts).map(k => ({
    name: k,
    value: categoryCounts[k]
  }));

  const activeTip = SECURITY_TIPS[tipIndex] || SECURITY_TIPS[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-100">
      
      {/* Welcome Banner & Main Action */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#081118] via-[#0D1822] to-[#081118] border border-cyan-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>COMMAND CENTER • ACTIVE SHIELD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">{userName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-xl">
            SafeGuard AI continuous threat radar is active. Submit suspicious content for immediate multi-layered analysis.
          </p>
        </div>

        {/* Big Prominent CTA: "Analyze Suspicious Content" */}
        <div className="relative z-10 flex flex-wrap gap-3">
          <Link
            href="/analyze/url"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-sm tracking-wide shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all hover:scale-105"
          >
            <Zap className="w-5 h-5 text-slate-950" />
            <span>Analyze Suspicious Content</span>
          </Link>
          <Link
            href="/report-scam"
            className="inline-flex items-center gap-2 px-5 py-4 rounded-2xl bg-[#0E171F] border border-[#1D3038] hover:border-red-500/50 text-slate-300 hover:text-white font-mono text-xs font-semibold transition-all"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Report Scam</span>
          </Link>
        </div>
      </section>

      {/* Security Overview Cards (Section 4) */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>SECURITY OVERVIEW TELEMETRY</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { label: 'Threats Detected', val: threatsDetected, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'URLs Analyzed', val: urlsAnalyzed, icon: LinkIcon, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            { label: 'Messages Analyzed', val: messagesAnalyzed, icon: MessageSquare, color: 'text-orange-400', bg: 'bg-orange-500/10' },
            { label: 'Safe Checks', val: safeChecks, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'High-Risk Detections', val: highRiskDetections, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
            { label: 'Security Score', val: `${userSecurityScore}/100`, icon: Award, color: 'text-teal-300', bg: 'bg-teal-500/10', isScore: true },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-2xl bg-[#0E171F] border border-[#1D3038] hover:border-slate-600 transition-all space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 truncate">{item.label}</span>
                <div className={`p-1.5 rounded-lg ${item.bg}`}>
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                {item.val}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                {item.isScore ? 'Overall awareness' : 'Verified logs'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Analysis Options Grid (6 Tools) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>QUICK ANALYSIS SUITE</span>
          </h2>
          <span className="text-[10px] font-mono text-cyan-400 font-semibold">14 Specialized AI Forensic Engines</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_ANALYSIS_OPTIONS.map((tool) => (
            <Link key={tool.id} href={tool.href}>
              <div className={`p-5 rounded-2xl bg-[#0E171F] border border-[#1D3038] ${tool.border} hover:bg-[#111C24] transition-all group flex items-start gap-4 cursor-pointer h-full`}>
                <div className="p-3 rounded-xl bg-[#050A0F] border border-[#1D3038] group-hover:border-cyan-400/50 transition-colors">
                  <tool.icon className={`w-6 h-6 ${tool.color}`} />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {tool.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">
                    {tool.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Charts & Security Score Gauge (Widgets Section) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Security Score Widget with Suggestions */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0E171F] border border-[#1D3038] space-y-6 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                YOUR SECURITY SCORE
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                AWARENESS RANK
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Real-time composite metric based on safe habits & training</p>
          </div>

          {/* Radial Circular Meter Display */}
          <div className="flex flex-col items-center justify-center my-2">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#050A0F" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - userSecurityScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold font-mono text-white">{userSecurityScore}</span>
                <span className="text-xs font-mono text-cyan-400 uppercase mt-0.5">Good Standing</span>
              </div>
            </div>
          </div>

          {/* Actionable suggestions to improve score */}
          <div className="space-y-2 pt-2 border-t border-[#1D3038] font-mono text-xs">
            <div className="text-[10px] font-bold uppercase text-slate-400">Suggestions to improve score:</div>
            <div className="flex items-start gap-2 text-slate-300 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>Complete the 3-minute Phishing Awareness Quiz (+5 pts)</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>Verify upcoming UPI payment links before scanning (+5 pts)</span>
            </div>
          </div>

          <Link
            href="/quiz"
            className="w-full py-2.5 rounded-xl bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 border border-cyan-500/30 font-mono text-xs font-bold uppercase text-center tracking-wider transition-colors block"
          >
            Take Security Quiz
          </Link>
        </div>

        {/* Threat Vector Distribution Chart */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0E171F] border border-[#1D3038] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                THREAT DISTRIBUTION
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Breakdown</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Classification breakdown of scanned attack payloads</p>
          </div>

          {threatChartData.length === 0 ? (
            <div className="h-52 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-dashed border-[#1D3038] bg-[#050A0F]/60">
              <ShieldCheck className="w-8 h-8 text-cyan-400 mb-2 opacity-60" />
              <p className="text-xs font-mono text-slate-300 font-semibold">No Threats Logged Yet</p>
              <p className="text-[11px] font-mono text-slate-500 mt-1">Run any scan tool or click "TRY EXAMPLE" to populate threat metrics.</p>
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={threatChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {threatChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#050A0F', borderColor: '#1D3038', color: '#FFF', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="pt-2 border-t border-[#1D3038] flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Primary Vector:</span>
            <span className={threatChartData.length > 0 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
              {threatChartData.length > 0
                ? `${threatChartData[0]?.name} (${Math.round((threatChartData[0]?.value / Math.max(1, history.length)) * 100)}%)`
                : 'All Clean (0 Threats)'}
            </span>
          </div>
        </div>

        {/* Weekly Activity Area Chart */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0E171F] border border-[#1D3038] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                WEEKLY ACTIVITY
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Last 7 Days</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Volume of scans analyzed vs. threats neutralized</p>
          </div>

          <div className="h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_ACTIVITY_DATA}>
                <defs>
                  <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1D3038" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#050A0F', borderColor: '#1D3038', color: '#FFF', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="analyses" stroke="#00E5FF" fillOpacity={1} fill="url(#colorAnalyses)" name="Total Scans" />
                <Area type="monotone" dataKey="threats" stroke="#ef4444" fillOpacity={1} fill="url(#colorThreats)" name="Threats Blocked" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-[#1D3038] flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Peak Activity Day:</span>
            <span className="text-cyan-400 font-bold">Friday (28 Scans)</span>
          </div>
        </div>

      </section>

      {/* Security Tip of the Day & Recent Analysis Widgets */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Security Tip of the Day */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-[#0E171F] to-[#0A141D] border border-cyan-500/20 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Security Tip of the Day</span>
              </div>
              <button 
                onClick={() => setTipIndex((prev) => (prev + 1) % SECURITY_TIPS.length)}
                className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-[#050A0F] transition-colors"
                title="Next Tip"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="text-base font-bold text-white leading-snug">
              {activeTip.title}
            </h4>
            
            <p className="text-xs text-slate-300 leading-relaxed font-mono bg-[#050A0F] p-4 rounded-xl border border-[#1D3038]">
              {activeTip.content}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1D3038] text-xs font-mono">
            <span className="text-slate-500">Category: {activeTip.category}</span>
            <Link href="/learn" className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold">
              Browse Education Hub <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Recent Analysis Table (Section 4 & 14) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0E171F] border border-[#1D3038] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1D3038] pb-3">
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                RECENT ANALYSIS HISTORY
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Live log stream of your threat investigations</p>
            </div>
            <Link href="/history" className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1">
              View Complete Logs ({history.length}) <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 bg-[#050A0F] border border-dashed border-[#1D3038] rounded-xl space-y-2">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-mono text-slate-300">No Analysis History Recorded Yet</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Scan your first URL, SMS, or QR code to record telemetry.
              </p>
              <div className="pt-2">
                <Link
                  href="/analyze/url"
                  className="px-4 py-2 bg-cyan-400 text-slate-950 font-mono font-bold text-xs rounded-lg inline-block"
                >
                  Run First URL Scan
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="text-[10px] text-slate-400 uppercase bg-[#081118] border-b border-[#1D3038]">
                  <tr>
                    <th className="px-3 py-2">TIME</th>
                    <th className="px-3 py-2">TYPE</th>
                    <th className="px-3 py-2">CONTENT</th>
                    <th className="px-3 py-2">RISK SCORE</th>
                    <th className="px-3 py-2 text-right">VERDICT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D3038]">
                  {history.slice(0, 4).map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#111C24] transition-colors">
                      <td className="px-3 py-3 text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-3 py-3 uppercase text-[10px] text-cyan-400">
                        {item.type}
                      </td>
                      <td className="px-3 py-3 text-slate-200 truncate max-w-[180px]">
                        {item.input}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.riskScore > 75 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : item.riskScore > 40
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {item.riskScore}/100
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className={`font-bold text-[11px] ${item.riskScore > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {item.riskScore > 50 ? 'SUSPICIOUS' : 'SAFE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </section>

    </div>
  );
}
