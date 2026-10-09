'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/providers';
import { motion } from 'framer-motion';
import {
  Shield,
  LayoutDashboard,
  Link as LinkIcon,
  MessageSquare,
  Mail,
  Camera,
  QrCode,
  Globe,
  PhoneOff,
  History,
  Bot,
  GraduationCap,
  HelpCircle,
  Flag,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Key,
  FileX,
  Lock,
  ShieldAlert,
  Wifi,
  Eye,
  ShieldOff,
  MessageSquareX
} from 'lucide-react';

const navGroups = [
  {
    title: 'Command Center',
    links: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Threat Detection Tools',
    links: [
      { name: 'Phishing Link Detection', href: '/analyze/url', icon: LinkIcon },
      { name: 'Fake QR Code Scanner', href: '/analyze/qr', icon: QrCode },
      { name: 'Password Security Checker', href: '/analyze/password', icon: Key },
      { name: 'Malicious File Detection', href: '/analyze/file', icon: FileX },
      { name: 'Secure File Sharing', href: '/analyze/share', icon: Lock },
      { name: 'Browser Permission Analyzer', href: '/analyze/browser', icon: ShieldAlert },
      { name: 'Public Wi-Fi Risk Detector', href: '/analyze/network', icon: Wifi },
      { name: 'Deepfake Detection System', href: '/analyze/deepfake', icon: Eye },
      { name: 'Ransomware Behavior Shield', href: '/analyze/ransomware', icon: ShieldOff },
      { name: 'Cyberbullying Detection', href: '/analyze/cyberbullying', icon: MessageSquareX },
      { name: 'SMS & Message Scanner', href: '/analyze/message', icon: MessageSquare },
      { name: 'Phishing Email Scanner', href: '/analyze/email', icon: Mail },
      { name: 'Screenshot Security Check', href: '/analyze/screenshot', icon: Camera },
      { name: 'Website Vulnerability Check', href: '/analyze/website', icon: Globe },
      { name: 'Spam Call Protection', href: '/analyze/call', icon: PhoneOff },
    ]
  },
  {
    title: 'SOC Intelligence',
    links: [
      { name: 'Threat History Logs', href: '/history', icon: History },
      { name: 'AI Security Assistant', href: '/assistant', icon: Bot },
      { name: 'Cyber Training & Learn', href: '/learn', icon: GraduationCap },
      { name: 'Security Quizzes', href: '/quiz', icon: HelpCircle },
      { name: 'Report Security Incident', href: '/report-scam', icon: Flag },
      { name: 'Threat Intelligence Matrix', href: '/threats', icon: BarChart3 },
    ]
  },
  {
    title: 'System Settings',
    links: [
      { name: 'Alerts & Notifications', href: '/notifications', icon: Bell },
      { name: 'Security Preferences', href: '/settings', icon: Settings },
    ]
  }
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps = {}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: collapsed ? 80 : 260 }}
      className="h-screen sticky top-0 bg-[#081118] border-r border-[#1D3038] flex flex-col z-30 select-none shadow-2xl"
    >
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#1D3038] h-16 bg-[#0B1218]">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="bg-[#00E5FF]/10 p-2 rounded-lg border border-[#00E5FF]/30 group-hover:bg-[#00E5FF]/20 transition-colors">
              <Shield className="w-5 h-5 text-[#00E5FF]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-wide text-slate-100 flex items-center gap-1.5">
                TRUSTNETRA <span className="text-[#00E5FF] text-xs font-semibold px-1.5 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30">SOC</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Threat Detection</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="bg-[#00E5FF]/10 p-2 rounded-lg border border-[#00E5FF]/30">
              <Shield className="w-5 h-5 text-[#00E5FF]" />
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#111C24] border border-[#1D3038] absolute -right-3.5 top-5 bg-[#081118] hidden md:block z-20 shadow-md"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Group Links */}
      <div className="flex-1 overflow-y-auto py-3 scrollbar-thin space-y-5 px-2">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
                {group.title}
              </h3>
            )}
            <div className="space-y-0.5">
              {group.links.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(`${link.href}`));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => onClose?.()}
                    className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-all duration-150 ${
                      isActive
                        ? 'bg-[#00E5FF]/10 text-white border-l-2 border-[#00E5FF] font-semibold shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-[#0E171F]'
                    }`}
                    title={collapsed ? link.name : undefined}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#00E5FF]' : 'text-slate-400'}`} />
                    {!collapsed && <span className="truncate">{link.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* System Status & Profile Footer */}
      <div className="p-3 border-t border-[#1D3038] bg-[#060D13] space-y-3">
        {!collapsed && (
          <div className="flex items-center justify-between px-2 py-1.5 rounded bg-[#0E171F] border border-[#1D3038]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[11px] font-mono text-slate-300">SYSTEM STATUS</span>
            </div>
            <span className="text-[10px] text-[#22C55E] font-mono uppercase font-semibold">Operational</span>
          </div>
        )}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} pt-1`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded bg-[#111C24] border border-[#263943] flex items-center justify-center text-[#00E5FF] font-mono font-bold text-xs flex-shrink-0">
              {user?.name?.charAt(0) || 'S'}
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-medium text-slate-200 truncate">
                  {user?.name || 'SOC Operator'}
                </span>
                <span className="text-[10px] font-mono text-slate-500 truncate">
                  {user?.email || 'operator@trustnetra.ai'}
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-[#FF3B3B] hover:bg-[#FF3B3B]/10 rounded transition-colors flex-shrink-0"
              title="Logout Operator Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
