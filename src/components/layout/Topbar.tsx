'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Search, Bell, ShieldCheck, Settings, LogOut, Activity } from 'lucide-react';
import { useAuth, useNotifications } from '@/lib/context/providers';
import { motion, AnimatePresence } from 'framer-motion';

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps = {}) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <header className="h-16 sticky top-0 z-20 bg-[#081118]/90 backdrop-blur-md border-b border-[#1D3038] select-none">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        
        {/* Left side: Mobile Toggle & Search */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-[#111C24] rounded-md border border-[#1D3038] transition-colors"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden md:flex items-center relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search threat IPs, URLs, hashes, logs..."
              className="bg-[#050A0F] border border-[#1D3038] focus:border-[#00E5FF] text-xs text-slate-200 placeholder:text-slate-500 rounded-md pl-8 pr-4 py-2 w-72 focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/30 font-mono transition-all"
            />
          </div>
        </div>

        {/* Right side: Security Status Indicator & Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Security Status Tag */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0E171F] border border-[#1D3038] font-mono text-[11px]">
            <div className="flex items-center gap-1.5 text-[#22C55E]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase tracking-wider">PROTECTED</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#00E5FF] animate-pulse" />
              Live Scan
            </span>
          </div>

          <Link
            href="/notifications"
            className="p-2 text-slate-400 hover:text-[#00E5FF] hover:bg-[#0E171F] rounded-md border border-[#1D3038] transition-colors relative"
            title="Security Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF1744] rounded-full animate-ping" />
            )}
          </Link>

          {/* Operator Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-md bg-[#0E171F] border border-[#1D3038] hover:border-[#263943] transition-colors"
            >
              <div className="w-6 h-6 rounded bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 flex items-center justify-center font-mono font-bold text-xs">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <span className="text-xs font-medium hidden sm:block text-slate-200">
                {user?.name?.split(' ')[0] || 'Operator'}
              </span>
            </button>

            <AnimatePresence>
              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 mt-2 w-56 bg-[#0E171F] rounded-md shadow-2xl border border-[#1D3038] py-1 z-20 font-sans"
                  >
                    <div className="px-4 py-2.5 border-b border-[#1D3038] mb-1">
                      <p className="text-xs font-semibold text-slate-100 truncate">{user?.name || 'SOC Operator'}</p>
                      <p className="text-[10px] font-mono text-[#00E5FF] truncate">{user?.email || 'operator@safeguard.ai'}</p>
                    </div>
                    
                    <Link
                      href="/settings"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-[#111C24] hover:text-[#00E5FF] transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Security Preferences
                    </Link>
                    
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#FF3B3B] hover:bg-[#FF3B3B]/10 w-full text-left transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Terminate Session
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
