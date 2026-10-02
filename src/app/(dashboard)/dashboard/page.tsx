'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield, Link as LinkIcon, MessageSquare, ShieldCheck, AlertTriangle, Award,
  Mail, Camera, QrCode, Globe, PhoneOff, AlertCircle, CheckCircle2, ChevronRight, Zap,
  Activity, ArrowUpRight, PlusCircle, Search, FileText
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAuth, useHistory } from '@/lib/context/providers';

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const QUICK_ACTIONS = [
  { title: 'Check URL', subtitle: 'Analyze suspicious links', icon: LinkIcon, href: '/analyze/url', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { title: 'Analyze Message', subtitle: 'Scan text for threats', icon: MessageSquare, href: '/analyze/message', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { title: 'Analyze Email', subtitle: 'Check email headers & links', icon: Mail, href: '/analyze/email', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { title: 'Spam Call Check', subtitle: 'Detect robocalls & vishing', icon: PhoneOff, href: '/analyze/call', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { title: 'Upload Screenshot', subtitle: 'Extract & scan image text', icon: Camera, href: '/analyze/screenshot', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { title: 'Check QR Code', subtitle: 'Scan hidden destination URLs', icon: QrCode, href: '/analyze/qr', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { title: 'Check Website', subtitle: 'Deep domain & SSL scan', icon: Globe, href: '/analyze/website', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
];

const TIPS = [
  { title: 'Verify URLs Carefully', text: 'Always check the domain name carefully before entering credentials or passwords.', icon: LinkIcon },
  { title: 'Enable 2FA Everywhere', text: 'Turn on Two-Factor Authentication on all your personal and financial accounts.', icon: ShieldCheck },
  { title: 'Beware of Urgency Signals', text: 'Scammers often create false urgency to make you panic and click blindly.', icon: AlertTriangle },
  { title: 'Never Share OTPs', text: 'Legitimate banks and organizations will never ask for your One-Time Password.', icon: MessageSquare },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { history } = useHistory();

  // Dynamic real calculations from actual history
  const totalAnalyses = history.length;
  const threatsDetected = history.filter(h => h.riskScore > 50).length;
  const urlsAnalyzed = history.filter(h => h.type === 'url' || h.type === 'website').length;
  const messagesAnalyzed = history.filter(h => h.type === 'message' || h.type === 'email').length;
  const safeChecks = history.filter(h => h.riskScore <= 20).length;
  const highRisk = history.filter(h => h.riskScore >= 76).length;
  
  // Real security score calculation
  const calculatedScore = totalAnalyses === 0 
    ? 100 
    : Math.max(0, Math.round(100 - (threatsDetected * 15) - (history.filter(h => h.riskScore > 20 && h.riskScore <= 50).length * 5)));

  const stats = [
    { title: 'Threats Detected', value: threatsDetected.toString(), icon: Shield, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', note: threatsDetected > 0 ? 'Action required' : 'No active threats' },
    { title: 'URLs Analyzed', value: urlsAnalyzed.toString(), icon: LinkIcon, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', note: `${urlsAnalyzed} total scanned` },
    { title: 'Messages Analyzed', value: messagesAnalyzed.toString(), icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', note: `${messagesAnalyzed} verified` },
    { title: 'Safe Checks', value: safeChecks.toString(), icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', note: 'Verified safe content' },
    { title: 'High Risk Detections', value: highRisk.toString(), icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', note: highRisk > 0 ? 'Critical alerts' : 'Clean activity' },
    { title: 'Security Score', value: `${calculatedScore}/100`, icon: Award, color: calculatedScore > 75 ? 'text-emerald-400' : calculatedScore > 50 ? 'text-amber-400' : 'text-red-400', bg: 'bg-cyan-500/10 border-cyan-500/20', isScore: true, scoreVal: calculatedScore },
  ];

  // Dynamic threat distribution chart data
  const threatTypeCounts: Record<string, number> = {};
  history.forEach(h => {
    const cat = h.threatLabel || h.threatCategory || 'Threat';
    threatTypeCounts[cat] = (threatTypeCounts[cat] || 0) + 1;
  });

  const threatChartData = Object.keys(threatTypeCounts).length > 0 
    ? Object.keys(threatTypeCounts).map(key => ({ name: key, value: threatTypeCounts[key] }))
    : [
        { name: 'Phishing', value: 0 },
        { name: 'Scam Messages', value: 0 },
        { name: 'Malicious URLs', value: 0 },
        { name: 'Safe Content', value: 1 },
      ];

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-gray-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> SafeGuard Shield Active
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{currentDate}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            Welcome back, {user?.name || 'User'} <span className="animate-wave inline-block origin-bottom-right">👋</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time cybersecurity overview & AI threat detector hub.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/analyze/url"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Scan</span>
          </Link>
        </div>
      </section>

      {/* Main CTA Banner */}
      <Link href="/analyze/url" className="block w-full">
        <motion.div
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-8 text-white shadow-xl shadow-cyan-500/10 border border-cyan-400/20"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cyan-200 border border-white/20 mb-3 backdrop-blur-md">
                <Zap className="w-3.5 h-3.5 text-yellow-300" /> Instant AI Threat Scanner
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">
                Analyze Suspicious Content
              </h2>
              <p className="text-cyan-100 text-sm sm:text-base leading-relaxed">
                Paste any URL, SMS, WhatsApp message, email, screenshot, or QR code to get an instant AI risk score & safety report.
              </p>
            </div>
            <div className="hidden lg:flex items-center justify-center h-20 w-20 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl">
              <Shield className="w-10 h-10 text-cyan-300 animate-pulse" />
            </div>
          </div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl mix-blend-overlay"></div>
        </motion.div>
      </Link>

      {/* Real Dynamic Stats Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" /> Real Security Metrics
          </h2>
          {totalAnalyses === 0 && (
            <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
              No scans yet — numbers update automatically as you perform checks!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-sm hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{stat.value}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{stat.note}</p>
                </div>
                <div className={`p-3 rounded-xl border ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              {stat.isScore && (
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mt-4 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${stat.scoreVal > 75 ? 'bg-emerald-500' : stat.scoreVal > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                    style={{ width: `${stat.scoreVal}%` }}
                  ></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Launchers */}
      <section>
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Quick Analysis Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action, i) => (
            <Link key={i} href={action.href}>
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                className="group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all cursor-pointer"
              >
                <div className={`p-3 rounded-xl border ${action.bg} group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                    {action.title}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{action.subtitle}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Dynamic Activity & Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-white/10 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center justify-between">
            <span>Threat Breakdown</span>
            <span className="text-xs font-normal text-gray-500">{history.length} Total Analyses</span>
          </h2>
          <div className="h-64 flex items-center justify-center">
            {history.length === 0 ? (
              <div className="text-center p-6 text-gray-400 dark:text-gray-500">
                <PieChart className="w-12 h-12 mx-auto mb-2 opacity-30 text-cyan-400" />
                <p className="text-sm">No analysis data recorded yet.</p>
                <p className="text-xs mt-1 text-gray-500">Scan any URL or message to generate live charts.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={threatChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {threatChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Security Health Summary */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Security Health Diagnosis
            </h2>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Current Protection Level</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${calculatedScore > 75 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                  {calculatedScore > 75 ? 'EXCELLENT' : 'NEEDS ATTENTION'}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {calculatedScore > 75 
                  ? 'Your active scanning habits are helping maintain a clean security score. Continue verifying unknown links & messages.'
                  : 'Multiple high-risk items detected recently. Avoid opening unrecognized links or sharing OTPs.'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Safe Checks Ratio</span>
                <span className="font-semibold text-emerald-400">{totalAnalyses === 0 ? '100%' : `${Math.round((safeChecks / totalAnalyses) * 100)}%`}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Threat Rate</span>
                <span className="font-semibold text-red-400">{totalAnalyses === 0 ? '0%' : `${Math.round((threatsDetected / totalAnalyses) * 100)}%`}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-500">Need immediate help?</span>
            <Link href="/assistant" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              Ask SafeGuard AI Assistant <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Real Dynamic History Table */}
      <section className="p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Real Analyses</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Live records of your recent security scans</p>
          </div>
          <Link href="/history" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium">
            View Full History <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
            <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">No Analysis History Yet</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1 mb-4">
              Paste a link, message, email, or screenshot to run your first security check.
            </p>
            <Link
              href="/analyze/url"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold transition-colors"
            >
              <Search className="w-3.5 h-3.5" /> Run First Check
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Timestamp</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Content / Input</th>
                  <th className="px-4 py-3">Risk Score</th>
                  <th className="px-4 py-3 rounded-r-lg">Threat Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {history.slice(0, 5).map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-2 text-gray-900 dark:text-gray-200 capitalize text-xs font-medium">
                        {item.type === 'url' ? <LinkIcon className="w-3.5 h-3.5 text-cyan-400" /> : <MessageSquare className="w-3.5 h-3.5 text-blue-400" />}
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300 truncate max-w-[240px] text-xs">
                      {item.input}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.riskScore > 70 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : item.riskScore > 30 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        {item.riskScore}/100
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-1.5 text-xs font-medium">
                        {item.riskScore <= 20 ? (
                          <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> <span className="text-emerald-400">Safe</span></>
                        ) : (
                          <><AlertCircle className="w-4 h-4 text-red-400" /> <span className="text-red-400">{item.threatLabel || 'Suspicious'}</span></>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Security Tips */}
      <section>
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Security Best Practices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIPS.map((tip, i) => (
            <div key={i} className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/80 dark:to-gray-800/80 border border-gray-200 dark:border-white/5">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                  <tip.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{tip.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{tip.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
