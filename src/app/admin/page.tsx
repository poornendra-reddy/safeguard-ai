'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ShieldAlert, Users, BarChart, Flag, 
  AlertTriangle, UserCheck, ArrowLeft,
  Server, Database, Cpu
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart as RechartsBarChart, Bar
} from 'recharts';

// Mock Constants if not imported
const SAMPLE_ADMIN_STATS = {
  totalUsers: '12,847',
  totalAnalyses: '89,432',
  threatsDetected: '23,156',
  reportsSubmitted: '4,521',
  highRiskThreats: '8,934',
  activeUsers: '3,421'
};

const userGrowthData = [
  { name: 'Jan', users: 4000 },
  { name: 'Feb', users: 5000 },
  { name: 'Mar', users: 6500 },
  { name: 'Apr', users: 7800 },
  { name: 'May', users: 9200 },
  { name: 'Jun', users: 11000 },
  { name: 'Jul', users: 12847 },
];

const analysisVolumeData = [
  { name: 'Mon', volume: 1200 },
  { name: 'Tue', volume: 1500 },
  { name: 'Wed', volume: 2100 },
  { name: 'Thu', volume: 1800 },
  { name: 'Fri', volume: 2400 },
  { name: 'Sat', volume: 900 },
  { name: 'Sun', volume: 750 },
];

const recentUsers = [
  { id: 1, name: 'Alice Chen', email: 'alice@example.com', date: '2023-10-24', analyses: 14, status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', date: '2023-10-23', analyses: 8, status: 'Active' },
  { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', date: '2023-10-22', analyses: 42, status: 'Warning' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', date: '2023-10-21', analyses: 3, status: 'Active' },
  { id: 5, name: 'Evan Wright', email: 'evan@example.com', date: '2023-10-20', analyses: 0, status: 'Inactive' },
];

const recentReports = [
  { id: 'REP-001', type: 'Phishing URL', desc: 'Suspicious login page mimicking bank', date: '2 hrs ago', status: 'Reviewing' },
  { id: 'REP-002', type: 'Malware File', desc: 'Executable hidden in PDF', date: '5 hrs ago', status: 'Confirmed' },
  { id: 'REP-003', type: 'Spam Email', desc: 'Lottery scam email with attachments', date: '1 day ago', status: 'Submitted' },
  { id: 'REP-004', type: 'Suspicious SMS', desc: 'Package delivery smishing attempt', date: '1 day ago', status: 'Confirmed' },
  { id: 'REP-005', type: 'Phishing URL', desc: 'Fake social media reset link', date: '2 days ago', status: 'Confirmed' },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      
      {/* Top Banner */}
      <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center">
        <ShieldAlert className="w-4 h-4 mr-2" />
        Administrator Panel — Restricted Access
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/" className="inline-flex items-center text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold flex items-center">
              <ShieldAlert className="w-8 h-8 mr-3 text-cyan-500" />
              Admin Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">System overview, metrics, and administrative controls.</p>
          </div>

          {/* System Health */}
          <div className="flex space-x-4 bg-white dark:bg-gray-900/50 p-3 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-2 px-3 border-r border-gray-200 dark:border-gray-800">
              <Server className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium">API: <span className="text-emerald-500">Operational</span></span>
            </div>
            <div className="flex items-center space-x-2 px-3 border-r border-gray-200 dark:border-gray-800">
              <Cpu className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium">AI Engine: <span className="text-emerald-500">Active</span></span>
            </div>
            <div className="flex items-center space-x-2 px-3">
              <Database className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium">DB: <span className="text-emerald-500">Connected</span></span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Users" value={SAMPLE_ADMIN_STATS.totalUsers} icon={Users} color="text-blue-500" bg="bg-blue-500/10" />
          <StatCard title="Total Analyses" value={SAMPLE_ADMIN_STATS.totalAnalyses} icon={BarChart} color="text-cyan-500" bg="bg-cyan-500/10" />
          <StatCard title="Threats Detected" value={SAMPLE_ADMIN_STATS.threatsDetected} icon={ShieldAlert} color="text-amber-500" bg="bg-amber-500/10" />
          <StatCard title="Reports Submitted" value={SAMPLE_ADMIN_STATS.reportsSubmitted} icon={Flag} color="text-purple-500" bg="bg-purple-500/10" />
          <StatCard title="High Risk Threats" value={SAMPLE_ADMIN_STATS.highRiskThreats} icon={AlertTriangle} color="text-red-500" bg="bg-red-500/10" />
          <StatCard title="Active Users" value={SAMPLE_ADMIN_STATS.activeUsers} icon={UserCheck} color="text-emerald-500" bg="bg-emerald-500/10" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-6">User Growth (7 Months)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-6">Analysis Volume (7 Days)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={analysisVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }}
                  />
                  <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Users</h3>
              <button className="text-sm text-cyan-500 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Join Date</th>
                    <th className="px-6 py-3 font-medium">Analyses</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {recentUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">{u.date}</td>
                      <td className="px-6 py-4">{u.analyses}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          u.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                          u.status === 'Warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Reports</h3>
              <button className="text-sm text-cyan-500 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3 font-medium">ID / Type</th>
                    <th className="px-6 py-3 font-medium">Description</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {recentReports.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-gray-500">{r.id}</div>
                        <div className="font-medium text-gray-900 dark:text-white">{r.type}</div>
                      </td>
                      <td className="px-6 py-4 max-w-[200px] truncate" title={r.desc}>{r.desc}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{r.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          r.status === 'Confirmed' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                          r.status === 'Reviewing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800 flex items-center space-x-4 shadow-sm"
    >
      <div className={`p-4 rounded-xl ${bg} ${color}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h4>
      </div>
    </motion.div>
  );
}
