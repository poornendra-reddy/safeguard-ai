'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ShieldAlert, Activity, ShieldBan, Link2 } from 'lucide-react';
import { 
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { THREAT_DISTRIBUTION_DATA, DAILY_DETECTIONS_DATA } from '@/lib/constants';

const COLORS = ['#06b6d4', '#3b82f6', '#f59e0b', '#ef4444', '#10b981'];

const RISK_LEVEL_DATA = [
  { name: 'Safe', value: 45, fill: '#10b981' },
  { name: 'Low', value: 20, fill: '#3b82f6' },
  { name: 'Suspicious', value: 20, fill: '#f59e0b' },
  { name: 'High', value: 15, fill: '#ef4444' },
];

const TRENDING_CATEGORIES = [
  { name: 'Phishing', count: 420 },
  { name: 'Malware', count: 380 },
  { name: 'Identity Theft', count: 310 },
  { name: 'Crypto Scam', count: 250 },
  { name: 'Tech Support', count: 180 },
];

const TRENDING_THREATS = [
  {
    title: 'Banking KYC SMS Scam',
    description: 'Fraudulent SMS messages claiming users need to update their KYC details via a malicious link to avoid account suspension.',
    risk: 'High',
    color: 'red'
  },
  {
    title: 'Fake Job Offers via WhatsApp',
    description: 'Scammers reaching out on WhatsApp with lucrative part-time job offers that eventually require "activation fees".',
    risk: 'High',
    color: 'red'
  },
  {
    title: 'Phishing Emails impersonating Amazon',
    description: 'Emails mimicking Amazon order confirmations with malicious PDF attachments or credential harvesting links.',
    risk: 'Suspicious',
    color: 'amber'
  }
];

export default function ThreatsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-500/20 rounded-xl">
          <BarChart3 className="w-8 h-8 text-indigo-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Threat Intelligence</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Global security metrics and current threat landscape</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Threats Detected', value: '23,156', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Phishing Attempts', value: '8,104', icon: ShieldAlert, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Scam Reports', value: '4,521', icon: ShieldBan, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Malicious URLs', value: '10,531', icon: Link2, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800/50 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Detections */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800/50 p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Daily Detections</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DAILY_DETECTIONS_DATA}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} vertical={false} />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#06b6d4' }}
                />
                <Area type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Threat Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800/50 p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Threat Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={THREAT_DISTRIBUTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {THREAT_DISTRIBUTION_DATA.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '0.5rem' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Level Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800/50 p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Risk Level Distribution (%)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RISK_LEVEL_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '0.5rem' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {RISK_LEVEL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Trending Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800/50 p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Trending Scam Categories</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TRENDING_CATEGORIES} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} horizontal={false} />
                <XAxis type="number" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '0.5rem' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Trending Threats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800/50 p-6 backdrop-blur-xl"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Currently Trending Threats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRENDING_THREATS.map((threat, i) => (
            <div key={i} className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 hover:border-cyan-500/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white leading-tight">{threat.title}</h4>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  threat.color === 'red' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                }`}>
                  {threat.risk}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {threat.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
