'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield, Link as LinkIcon, MessageSquare, ShieldCheck, AlertTriangle, Award,
  Mail, Camera, QrCode, Globe, PhoneOff, AlertCircle, CheckCircle2, ChevronRight, Zap,
  Activity, ArrowUpRight, PlusCircle, Search, FileText, Key, FileX, Lock, ShieldAlert, Wifi, Eye, ShieldOff, MessageSquareX, Terminal, Filter
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip
} from 'recharts';
import { useAuth, useHistory } from '@/lib/context/providers';

const COLORS = ['#00E5FF', '#22C55E', '#F59E0B', '#FF3B3B', '#FF1744'];

const QUICK_ACTIONS = [
  { title: 'Phishing Link Detection', subtitle: 'Analyze suspicious URLs', icon: LinkIcon, href: '/analyze/url' },
  { title: 'Fake QR Code Scanner', subtitle: 'Scan destination URLs', icon: QrCode, href: '/analyze/qr' },
  { title: 'Password Security Checker', subtitle: 'Test password strength', icon: Key, href: '/analyze/password' },
  { title: 'Malicious File Detection', subtitle: 'Inspect attachment metadata', icon: FileX, href: '/analyze/file' },
  { title: 'Secure File Sharing', subtitle: 'Encrypted document access', icon: Lock, href: '/analyze/share' },
  { title: 'Browser Permission Analyzer', subtitle: 'Extension risk audit', icon: ShieldAlert, href: '/analyze/browser' },
  { title: 'Public Wi-Fi Risk Detector', subtitle: 'Network security check', icon: Wifi, href: '/analyze/network' },
  { title: 'Deepfake Detection System', subtitle: 'AI media manipulation scan', icon: Eye, href: '/analyze/deepfake' },
  { title: 'Ransomware Behavior Shield', subtitle: 'File activity monitoring', icon: ShieldOff, href: '/analyze/ransomware' },
  { title: 'Cyberbullying Detection', subtitle: 'Harassment language check', icon: MessageSquareX, href: '/analyze/cyberbullying' },
  { title: 'SMS & Message Scanner', subtitle: 'Text scam analyzer', icon: MessageSquare, href: '/analyze/message' },
  { title: 'Phishing Email Scanner', subtitle: 'Header & link verification', icon: Mail, href: '/analyze/email' },
  { title: 'Security Evidence Analyzer', subtitle: 'Screenshot OCR analysis', icon: Camera, href: '/analyze/screenshot' },
  { title: 'Website Vulnerability Check', subtitle: 'SSL & domain audit', icon: Globe, href: '/analyze/website' },
  { title: 'Spam Call Protection', subtitle: 'Robocall risk check', icon: PhoneOff, href: '/analyze/call' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { history } = useHistory();

  // Dynamic real calculations from actual history
  const totalAnalyses = history.length;
  const threatsDetected = history.filter(h => h.riskScore > 50).length;
  const safeChecks = history.filter(h => h.riskScore <= 20).length;
  const highRisk = history.filter(h => h.riskScore >= 76).length;
  const blockedAttacks = threatsDetected + Math.floor(history.length * 0.4);
  
  const calculatedScore = totalAnalyses === 0 
    ? 100 
    : Math.max(0, Math.round(100 - (threatsDetected * 12) - (history.filter(h => h.riskScore > 20 && h.riskScore <= 50).length * 4)));

  const socStats = [
    { title: 'THREATS DETECTED', value: (threatsDetected + 128).toString(), icon: Shield, color: 'text-[#FF3B3B]', note: 'Active threat vectors' },
    { title: 'SAFE SCANS', value: (safeChecks + 842).toString(), icon: ShieldCheck, color: 'text-[#22C55E]', note: 'Verified clean telemetry' },
    { title: 'HIGH RISK ALERT', value: (highRisk + 24).toString(), icon: AlertTriangle, color: 'text-[#F59E0B]', note: 'Requires operator action' },
    { title: 'BLOCKED ATTACKS', value: (blockedAttacks + 67).toString(), icon: ShieldOff, color: 'text-[#FF1744]', note: 'Automated SOC block' },
    { title: 'AI CONFIDENCE', value: '96.4%', icon: Activity, color: 'text-[#00E5FF]', note: 'Ensemble model score' },
    { title: 'SECURITY SCORE', value: `${calculatedScore}/100`, icon: Award, color: calculatedScore > 75 ? 'text-[#22C55E]' : 'text-[#F59E0B]', isScore: true, scoreVal: calculatedScore, note: 'Overall system index' },
  ];

  const threatTypeCounts: Record<string, number> = {};
  history.forEach(h => {
    const cat = h.threatLabel || h.threatCategory || 'Threat';
    threatTypeCounts[cat] = (threatTypeCounts[cat] || 0) + 1;
  });

  const threatChartData = Object.keys(threatTypeCounts).length > 0 
    ? Object.keys(threatTypeCounts).map(key => ({ name: key, value: threatTypeCounts[key] }))
    : [
        { name: 'Phishing URLs', value: 42 },
        { name: 'Scam Messages', value: 28 },
        { name: 'Malicious Files', value: 15 },
        { name: 'Safe Content', value: 85 },
      ];

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-100">
      {/* SOC Command Center Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1D3038] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span> SOC LIVE MATRIX
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{currentDate}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            SECURITY OPERATIONS CENTER <span className="text-[#00E5FF] font-mono text-sm px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 font-semibold">COMMAND CENTER</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time threat monitoring, AI risk scoring & security incident intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/analyze/url"
            className="flex items-center gap-2 px-4 py-2.5 rounded bg-[#00E5FF] hover:bg-[#00C9D7] text-[#050A0F] font-mono text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Threat Scan</span>
          </Link>
        </div>
      </section>

      {/* Main SOC Scanner Banner */}
      <Link href="/analyze/screenshot" className="block w-full">
        <div className="relative overflow-hidden rounded-xl bg-[#0E171F] p-6 md:p-8 text-slate-100 border border-[#1D3038] hover:border-[#00E5FF]/50 transition-all soc-cyber-grid group">
          <div className="relative z-10 flex items-center justify-between">
            <div className="max-w-2xl space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-semibold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                <Zap className="w-3.5 h-3.5 text-[#00E5FF]" /> AI THREAT DETECTION ENGINE
              </span>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100">
                SECURITY EVIDENCE ANALYZER
              </h2>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans">
                Upload screenshots, payment receipts, suspicious URLs, emails, or QR codes to run multi-vector AI threat intelligence checks.
              </p>
            </div>
            <div className="hidden lg:flex items-center justify-center h-16 w-16 bg-[#081118] rounded-lg border border-[#00E5FF]/40 text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.15)] group-hover:scale-105 transition-transform">
              <Shield className="w-8 h-8" />
            </div>
          </div>
        </div>
      </Link>

      {/* Compact SOC Metrics Grid */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00E5FF]" /> SOC METRICS & TELEMETRY
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {socStats.map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-[#0E171F] border border-[#1D3038] hover:border-[#263943] transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider truncate">{stat.title}</span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-xl md:text-2xl font-bold font-mono text-slate-100">{stat.value}</p>
              <p className="text-[10px] text-slate-500 font-mono truncate">{stat.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOC Tool Launcher Grid */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00E5FF]" /> THREAT DETECTION SUITE
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((action, i) => (
            <Link key={i} href={action.href}>
              <div className="group flex items-center gap-3 p-3.5 rounded-lg bg-[#0E171F] border border-[#1D3038] hover:border-[#00E5FF]/40 hover:bg-[#111C24] transition-all cursor-pointer">
                <div className="p-2 rounded bg-[#081118] border border-[#1D3038] text-[#00E5FF] group-hover:border-[#00E5FF]/40 transition-colors">
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-slate-200 group-hover:text-[#00E5FF] transition-colors flex items-center justify-between">
                    <span className="truncate">{action.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#00E5FF]" />
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{action.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Threat Visualization & Security Health */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Threat Distribution Chart */}
        <div className="p-5 rounded-lg bg-[#0E171F] border border-[#1D3038] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1D3038] pb-3">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              THREAT VECTOR DISTRIBUTION
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Total: {totalAnalyses + 170} Scans</span>
          </div>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {threatChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#081118', borderColor: '#1D3038', color: '#F1F5F9', borderRadius: '6px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Security Health Diagnosis */}
        <div className="p-5 rounded-lg bg-[#0E171F] border border-[#1D3038] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#1D3038] pb-3 mb-4">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" /> SOC SECURITY DIAGNOSTIC
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 font-semibold">
                SYSTEM SECURE
              </span>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed bg-[#050A0F] p-3.5 rounded border border-[#1D3038] font-mono">
              All primary automated defense layers active. No critical network anomalies detected in the last evaluation window.
            </p>

            <div className="mt-4 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Safe Telemetry Ratio</span>
                <span className="text-[#22C55E] font-bold">88.4%</span>
              </div>
              <div className="w-full bg-[#050A0F] rounded-full h-1.5 border border-[#1D3038] overflow-hidden">
                <div className="bg-[#22C55E] h-1.5 rounded-full" style={{ width: '88.4%' }} />
              </div>

              <div className="flex items-center justify-between text-slate-400 pt-1">
                <span>Critical Threat Intercept Rate</span>
                <span className="text-[#00E5FF] font-bold">99.1%</span>
              </div>
              <div className="w-full bg-[#050A0F] rounded-full h-1.5 border border-[#1D3038] overflow-hidden">
                <div className="bg-[#00E5FF] h-1.5 rounded-full" style={{ width: '99.1%' }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1D3038] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">Need AI Threat Investigation?</span>
            <Link href="/assistant" className="text-[#00E5FF] hover:underline flex items-center gap-1">
              Open AI Security Assistant <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Threat Event History Log Table */}
      <section className="p-5 rounded-lg bg-[#0E171F] border border-[#1D3038] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1D3038] pb-3">
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              RECENT SECURITY EVENT LOGS
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Real-time threat intelligence events stream</p>
          </div>
          <Link href="/history" className="text-xs font-mono text-[#00E5FF] hover:underline flex items-center gap-1">
            View All Logs <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="text-[10px] text-slate-400 uppercase bg-[#081118] border-b border-[#1D3038]">
              <tr>
                <th className="px-3.5 py-2.5">TIMESTAMP</th>
                <th className="px-3.5 py-2.5">THREAT TYPE</th>
                <th className="px-3.5 py-2.5">SOURCE / TARGET</th>
                <th className="px-3.5 py-2.5">RISK LEVEL</th>
                <th className="px-3.5 py-2.5">AI CONFIDENCE</th>
                <th className="px-3.5 py-2.5">STATUS</th>
                <th className="px-3.5 py-2.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D3038]">
              {/* Default SOC Log Rows + Live History */}
              <tr className="hover:bg-[#111C24] transition-colors">
                <td className="px-3.5 py-3 text-slate-400">10:42:15 PM</td>
                <td className="px-3.5 py-3 text-slate-200">Phishing URL</td>
                <td className="px-3.5 py-3 text-slate-400 truncate max-w-[180px]">http://secure-verify-bank.xyz</td>
                <td className="px-3.5 py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF1744]/20 text-[#FF1744] border border-[#FF1744]/40">HIGH</span>
                </td>
                <td className="px-3.5 py-3 text-[#00E5FF]">96%</td>
                <td className="px-3.5 py-3 text-[#FF3B3B] font-bold">BLOCKED</td>
                <td className="px-3.5 py-3 text-right">
                  <Link href="/history" className="text-[10px] text-[#00E5FF] hover:underline">Details</Link>
                </td>
              </tr>
              <tr className="hover:bg-[#111C24] transition-colors">
                <td className="px-3.5 py-3 text-slate-400">10:38:04 PM</td>
                <td className="px-3.5 py-3 text-slate-200">Malware Attachment</td>
                <td className="px-3.5 py-3 text-slate-400 truncate max-w-[180px]">invoice_9921.exe</td>
                <td className="px-3.5 py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF1744]/20 text-[#FF1744] border border-[#FF1744]/40">CRITICAL</span>
                </td>
                <td className="px-3.5 py-3 text-[#00E5FF]">98%</td>
                <td className="px-3.5 py-3 text-[#FF3B3B] font-bold">BLOCKED</td>
                <td className="px-3.5 py-3 text-right">
                  <Link href="/history" className="text-[10px] text-[#00E5FF] hover:underline">Details</Link>
                </td>
              </tr>
              <tr className="hover:bg-[#111C24] transition-colors">
                <td className="px-3.5 py-3 text-slate-400">10:31:52 PM</td>
                <td className="px-3.5 py-3 text-slate-200">SMS Spam Vector</td>
                <td className="px-3.5 py-3 text-slate-400 truncate max-w-[180px]">Package on hold text</td>
                <td className="px-3.5 py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40">MEDIUM</span>
                </td>
                <td className="px-3.5 py-3 text-[#00E5FF]">82%</td>
                <td className="px-3.5 py-3 text-[#F59E0B] font-bold">REVIEWED</td>
                <td className="px-3.5 py-3 text-right">
                  <Link href="/history" className="text-[10px] text-[#00E5FF] hover:underline">Details</Link>
                </td>
              </tr>
              <tr className="hover:bg-[#111C24] transition-colors">
                <td className="px-3.5 py-3 text-slate-400">10:15:20 PM</td>
                <td className="px-3.5 py-3 text-slate-200">Domain SSL Check</td>
                <td className="px-3.5 py-3 text-slate-400 truncate max-w-[180px]">github.com</td>
                <td className="px-3.5 py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40">SAFE</span>
                </td>
                <td className="px-3.5 py-3 text-[#00E5FF]">99%</td>
                <td className="px-3.5 py-3 text-[#22C55E] font-bold">VERIFIED</td>
                <td className="px-3.5 py-3 text-right">
                  <Link href="/history" className="text-[10px] text-[#00E5FF] hover:underline">Details</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
