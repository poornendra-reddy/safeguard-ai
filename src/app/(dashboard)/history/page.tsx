'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  History, Search, Filter, Trash2, Download, AlertTriangle,
  ShieldCheck, AlertCircle, Eye, ChevronLeft, ChevronRight, FileText, PlusCircle
} from 'lucide-react';
import Link from 'next/link';
import { useHistory } from '@/lib/context/providers';
import { AnalysisResult } from '@/types';

export default function HistoryPage() {
  const { history, clearHistory, removeFromHistory } = useHistory();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Date (newest)');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      clearHistory();
    }
  };

  const handleExport = () => {
    if (history.length === 0) {
      alert('No history records available to export.');
      return;
    }
    const jsonStr = JSON.stringify(history, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trustnetra-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredHistory = useMemo(() => {
    return history.filter((item: AnalysisResult) => {
      const inputStr = item.input || item.url || '';
      const matchesSearch = inputStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.threatLabel && item.threatLabel.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchesFilter = true;
      if (filter === 'Safe') matchesFilter = item.riskScore <= 20;
      else if (filter === 'Low Risk') matchesFilter = item.riskScore > 20 && item.riskScore <= 50;
      else if (filter === 'Suspicious') matchesFilter = item.riskScore > 50 && item.riskScore <= 75;
      else if (filter === 'High Risk') matchesFilter = item.riskScore > 75;

      return matchesSearch && matchesFilter;
    }).sort((a: AnalysisResult, b: AnalysisResult) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();

      if (sortBy === 'Date (newest)') return dateB - dateA;
      if (sortBy === 'Date (oldest)') return dateA - dateB;
      if (sortBy === 'Risk Score (highest)') return b.riskScore - a.riskScore;
      if (sortBy === 'Risk Score (lowest)') return a.riskScore - b.riskScore;
      return 0;
    });
  }, [history, searchQuery, filter, sortBy]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: history.length,
    safe: history.filter((i) => i.riskScore <= 20).length,
    suspicious: history.filter((i) => i.riskScore > 50 && i.riskScore <= 75).length,
    highRisk: history.filter((i) => i.riskScore > 75).length,
  };

  const getRiskBadge = (score: number) => {
    if (score <= 20) {
      return { label: 'SAFE', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: ShieldCheck };
    }
    if (score <= 50) {
      return { label: 'LOW RISK', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', icon: ShieldCheck };
    }
    if (score <= 75) {
      return { label: 'SUSPICIOUS', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: AlertCircle };
    }
    return { label: 'HIGH RISK', color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: AlertTriangle };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
            <History className="w-8 h-8 text-cyan-400" />
            Analysis History
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time record of your threat analyses and security scans.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            disabled={history.length === 0}
            className="px-4 py-2 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button 
            onClick={handleClearHistory}
            disabled={history.length === 0}
            className="px-4 py-2 flex items-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-red-500/20"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>
      </div>

      {/* Dynamic Real Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Analyses', value: stats.total, color: 'text-cyan-400' },
          { label: 'Safe Checks', value: stats.safe, color: 'text-emerald-400' },
          { label: 'Suspicious Detections', value: stats.suspicious, color: 'text-amber-400' },
          { label: 'High Risk Threats', value: stats.highRisk, color: 'text-red-400' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.05 }} 
            className="bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm"
          >
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.label}</div>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search scans, URLs, or threat types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none text-sm text-gray-900 dark:text-white"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-gray-400 mr-1 hidden sm:inline-block" />
          {['All', 'Safe', 'Low Risk', 'Suspicious', 'High Risk'].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filter === f ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              {f}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
             <select
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value)}
               className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 outline-none"
             >
               <option>Date (newest)</option>
               <option>Date (oldest)</option>
               <option>Risk Score (highest)</option>
               <option>Risk Score (lowest)</option>
             </select>
          </div>
        </div>
      </div>

      {/* History Table or Clean Empty State */}
      <div className="bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        {filteredHistory.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 uppercase">
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Content / Input</th>
                    <th className="p-4">Risk Score</th>
                    <th className="p-4">Threat Classification</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {paginatedHistory.map((item: AnalysisResult, i: number) => {
                    const badge = getRiskBadge(item.riskScore);
                    const BadgeIcon = badge.icon;
                    return (
                      <motion.tr 
                        key={item.id} 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group"
                      >
                        <td className="p-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {new Date(item.timestamp).toLocaleString()}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 capitalize">
                            {item.type}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-gray-800 dark:text-gray-200 max-w-xs truncate font-mono">
                          {item.input}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-max ${badge.color}`}>
                            <BadgeIcon className="w-3.5 h-3.5" />
                            {item.riskScore}/100 — {badge.label}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-gray-600 dark:text-gray-300 font-medium">
                          {item.threatLabel || item.threatCategory || 'Safe Content'}
                        </td>
                        <td className="p-4 text-right whitespace-nowrap space-x-2">
                          <Link 
                            href={`/report/${item.id}`} 
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Report
                          </Link>
                          <button
                            onClick={() => removeFromHistory(item.id)}
                            className="inline-flex items-center p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredHistory.length)} of {filteredHistory.length} records
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-4 text-cyan-400">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {searchQuery ? 'No Matching Records Found' : 'No Security Scans Recorded Yet'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
              {searchQuery 
                ? 'No analysis records match your search query or selected risk filter.' 
                : 'All your threat detection checks will be saved here automatically. Perform your first scan to generate real security reports.'}
            </p>
            {!searchQuery && (
              <Link 
                href="/analyze/url" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" /> Perform First Scan
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
