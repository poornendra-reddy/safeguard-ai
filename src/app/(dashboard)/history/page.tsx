'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History, Search, Filter, Trash2, Download, AlertTriangle,
  ShieldCheck, AlertCircle, Eye, ChevronLeft, ChevronRight, FileText, PlusCircle,
  X, ExternalLink, Shield, Lock, Globe, MessageSquare, Camera, QrCode
} from 'lucide-react';
import Link from 'next/link';
import { useHistory } from '@/lib/context/providers';
import { AnalysisResult } from '@/types';
import { getRiskColor } from '@/lib/constants';

const FILTER_OPTIONS = ['All', 'Safe', 'Suspicious', 'High Risk', 'Phishing', 'Scam', 'Malware'];

export default function HistoryPage() {
  const { history, clearHistory, removeFromHistory } = useHistory();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest-risk'>('newest');
  const [selectedItem, setSelectedItem] = useState<AnalysisResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all threat history? This action cannot be undone.')) {
      clearHistory();
    }
  };

  const handleExportJSON = () => {
    if (history.length === 0) {
      alert('No history records available to export.');
      return;
    }
    const jsonStr = JSON.stringify(history, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safeguard-ai-threat-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (history.length === 0) {
      alert('No history records available to export.');
      return;
    }
    const headers = ['Date', 'Type', 'Target Content', 'Risk Score', 'Classification', 'Risk Level'];
    const rows = history.map(h => [
      `"${new Date(h.timestamp).toISOString()}"`,
      `"${h.type}"`,
      `"${(h.input || '').replace(/"/g, '""')}"`,
      h.riskScore,
      `"${h.threatLabel || h.classification || ''}"`,
      `"${h.riskLevel}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safeguard-ai-history-${new Date().toISOString().split('T')[0]}.csv`;
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
      else if (filter === 'Suspicious') matchesFilter = item.riskScore > 50 && item.riskScore <= 75;
      else if (filter === 'High Risk') matchesFilter = item.riskScore > 75;
      else if (filter === 'Phishing') matchesFilter = (item.threatLabel || '').toLowerCase().includes('phishing');
      else if (filter === 'Scam') matchesFilter = (item.threatLabel || '').toLowerCase().includes('scam');
      else if (filter === 'Malware') matchesFilter = (item.threatLabel || '').toLowerCase().includes('malware') || (item.threatCategory || '').includes('malware');

      return matchesSearch && matchesFilter;
    }).sort((a: AnalysisResult, b: AnalysisResult) => {
      if (sortBy === 'highest-risk') return b.riskScore - a.riskScore;
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      if (sortBy === 'oldest') return dateA - dateB;
      return dateB - dateA;
    });
  }, [history, searchQuery, filter, sortBy]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;
  const currentItems = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 font-sans text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1D3038] pb-5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            <History className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Threat History Logs</h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
              Audit log of all analyzed URLs, messages, emails, screenshots, and QR codes
            </p>
          </div>
        </div>

        {/* Action Controls: Export CSV/JSON & Clear */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0E171F] border border-[#1D3038] hover:border-cyan-400 text-xs font-mono text-slate-300 hover:text-white transition-all"
            title="Export to CSV Spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0E171F] border border-[#1D3038] hover:border-cyan-400 text-xs font-mono text-slate-300 hover:text-white transition-all"
            title="Export to JSON"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>JSON</span>
          </button>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-xs font-mono text-red-400 transition-all"
              title="Clear All History"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-5 rounded-2xl bg-[#0E171F] border border-[#1D3038] space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search content, threat names, or types..."
              className="w-full bg-[#050A0F] border border-[#1D3038] rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto font-mono text-xs">
            <span className="text-slate-400 text-[11px] uppercase">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#050A0F] border border-[#1D3038] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400"
            >
              <option value="newest">Date (Newest)</option>
              <option value="oldest">Date (Oldest)</option>
              <option value="highest-risk">Risk Score (Highest)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1D3038]">
          <span className="text-[10px] font-mono uppercase text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filters:
          </span>
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg font-mono text-xs transition-all ${
                filter === f
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                  : 'bg-[#050A0F] border border-[#1D3038] text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* History Table (Section 14: Date | Type | Content | Risk Score | Threat | Status) */}
      <div className="bg-[#0E171F] border border-[#1D3038] rounded-3xl overflow-hidden shadow-2xl">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-mono font-bold text-slate-300 uppercase">No Matching History Records</h3>
            <p className="text-xs text-slate-500 font-mono max-w-sm mx-auto">
              {history.length === 0 
                ? 'Your audit history is empty. Analyze suspicious URLs or messages to record threat logs.' 
                : 'Try adjusting your search query or active filter settings.'}
            </p>
            {history.length === 0 && (
              <div className="pt-2">
                <Link href="/analyze/url" className="px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-mono font-bold text-xs inline-block">
                  Launch Threat Scanner
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="text-[10px] text-slate-400 uppercase bg-[#081118] border-b border-[#1D3038]">
                <tr>
                  <th className="px-5 py-3.5">DATE & TIME</th>
                  <th className="px-5 py-3.5">TYPE</th>
                  <th className="px-5 py-3.5">CONTENT</th>
                  <th className="px-5 py-3.5">RISK SCORE</th>
                  <th className="px-5 py-3.5">THREAT CLASSIFICATION</th>
                  <th className="px-5 py-3.5">STATUS</th>
                  <th className="px-5 py-3.5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D3038]">
                {currentItems.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-[#111C24] transition-colors">
                    {/* Date */}
                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                      <span className="text-slate-500 text-[10px]">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#050A0F] border border-[#1D3038] text-cyan-400">
                        {item.type}
                      </span>
                    </td>

                    {/* Content */}
                    <td className="px-5 py-4 text-slate-200 truncate max-w-[220px]" title={item.input}>
                      {item.input}
                    </td>

                    {/* Risk Score */}
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                        item.riskScore > 75 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                          : item.riskScore > 50 
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {item.riskScore}/100
                      </span>
                    </td>

                    {/* Threat */}
                    <td className="px-5 py-4 font-bold text-slate-100">
                      {item.threatLabel || item.classification || 'Threat Analysis'}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`font-bold text-[10px] uppercase tracking-wider ${
                        item.riskScore > 50 ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {item.riskScore > 50 ? 'BLOCKED' : 'SAFE'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="p-1.5 rounded-lg bg-[#050A0F] border border-[#1D3038] hover:border-cyan-400 text-slate-400 hover:text-cyan-400 transition-colors"
                          title="Quick View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/report/${item.id}`}
                          className="p-1.5 rounded-lg bg-[#050A0F] border border-[#1D3038] hover:border-cyan-400 text-slate-400 hover:text-white transition-colors"
                          title="Full Security Report"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => removeFromHistory(item.id)}
                          className="p-1.5 rounded-lg bg-[#050A0F] border border-[#1D3038] hover:border-red-500 text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {filteredHistory.length > itemsPerPage && (
          <div className="p-4 border-t border-[#1D3038] flex items-center justify-between font-mono text-xs">
            <span className="text-slate-400 text-[11px]">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredHistory.length)} of {filteredHistory.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-[#1D3038] hover:border-slate-600 disabled:opacity-40 text-slate-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-cyan-400 font-bold px-2">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-[#1D3038] hover:border-slate-600 disabled:opacity-40 text-slate-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details View Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0E171F] border border-cyan-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-[#1D3038] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-mono text-base font-bold text-white uppercase">
                      Analysis Incident Record
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">ID: {selectedItem.id}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 rounded-lg hover:bg-[#111C24] text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Payload Preview */}
              <div className="space-y-1.5 font-mono text-xs">
                <span className="text-slate-400 uppercase text-[10px]">Submitted Content</span>
                <div className="p-3.5 bg-[#050A0F] rounded-xl border border-[#1D3038] text-slate-200 break-all max-h-32 overflow-y-auto">
                  {selectedItem.input}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 bg-[#050A0F] rounded-xl border border-[#1D3038]">
                  <span className="text-slate-500 text-[10px] uppercase block">Risk Score</span>
                  <span className="text-lg font-bold text-red-400 block mt-0.5">{selectedItem.riskScore}/100</span>
                </div>
                <div className="p-3 bg-[#050A0F] rounded-xl border border-[#1D3038]">
                  <span className="text-slate-500 text-[10px] uppercase block">Classification</span>
                  <span className="font-bold text-slate-200 block mt-0.5 truncate">{selectedItem.threatLabel}</span>
                </div>
                <div className="p-3 bg-[#050A0F] rounded-xl border border-[#1D3038]">
                  <span className="text-slate-500 text-[10px] uppercase block">Input Vector</span>
                  <span className="font-bold text-cyan-400 block mt-0.5 uppercase">{selectedItem.type}</span>
                </div>
              </div>

              {/* Explanation & Action */}
              <div className="space-y-2 font-mono text-xs">
                <span className="text-slate-400 uppercase text-[10px]">AI Plain Explanation</span>
                <p className="text-slate-300 leading-relaxed bg-[#050A0F] p-3.5 rounded-xl border border-[#1D3038]">
                  {selectedItem.simpleExplanation || selectedItem.technicalExplanation || 'Incident recorded with automated AI verdict.'}
                </p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#1D3038]">
                <Link
                  href={`/report/${selectedItem.id}`}
                  className="px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Full Security Report</span>
                </Link>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#1D3038] text-slate-400 hover:text-white font-mono text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
