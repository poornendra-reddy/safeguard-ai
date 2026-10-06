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
    title: 'Main',
    links: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Analysis Tools',
    links: [
      { name: 'Analyze URL', href: '/analyze/url', icon: LinkIcon },
      { name: 'Analyze Message', href: '/analyze/message', icon: MessageSquare },
      { name: 'Analyze Email', href: '/analyze/email', icon: Mail },
      { name: 'Screenshot', href: '/analyze/screenshot', icon: Camera },
      { name: 'QR Scanner', href: '/analyze/qr', icon: QrCode },
      { name: 'Website Check', href: '/analyze/website', icon: Globe },
      { name: 'Spam Call Check', href: '/analyze/call', icon: PhoneOff },
      { name: 'Password Security', href: '/analyze/password', icon: Key },
      { name: 'Malicious File Check', href: '/analyze/file', icon: FileX },
      { name: 'Secure File Share', href: '/analyze/share', icon: Lock },
      { name: 'Browser Permissions', href: '/analyze/browser', icon: ShieldAlert },
      { name: 'Public Wi-Fi Risk', href: '/analyze/network', icon: Wifi },
      { name: 'Deepfake Detector', href: '/analyze/deepfake', icon: Eye },
      { name: 'Ransomware Shield', href: '/analyze/ransomware', icon: ShieldOff },
      { name: 'Cyberbullying Check', href: '/analyze/cyberbullying', icon: MessageSquareX },
    ]
  },
  {
    title: 'Security',
    links: [
      { name: 'History', href: '/history', icon: History },
      { name: 'AI Assistant', href: '/assistant', icon: Bot },
      { name: 'Learn', href: '/learn', icon: GraduationCap },
      { name: 'Quizzes', href: '/quiz', icon: HelpCircle },
      { name: 'Report Scam', href: '/report-scam', icon: Flag },
      { name: 'Threat Intel', href: '/threats', icon: BarChart3 },
    ]
  },
  {
    title: 'Account',
    links: [
      { name: 'Notifications', href: '/notifications', icon: Bell },
      { name: 'Settings', href: '/settings', icon: Settings },
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
      initial={{ width: 256 }}
      animate={{ width: collapsed ? 80 : 256 }}
      className="h-screen sticky top-0 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800/50 flex flex-col transition-colors z-30"
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800/50 h-16">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="bg-cyan-500/10 p-1.5 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
              <Shield className="w-6 h-6 text-cyan-500" />
            </div>
            <span className="font-bold text-lg tracking-tight dark:text-white">SafeGuard AI</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="bg-cyan-500/10 p-1.5 rounded-lg">
              <Shield className="w-6 h-6 text-cyan-500" />
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors absolute -right-4 top-5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 hidden md:block z-10"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-6 px-3">
            {!collapsed && (
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
            )}
            <div className="space-y-1">
              {group.links.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => onClose?.()}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title={collapsed ? link.name : undefined}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-cyan-500' : 'group-hover:text-cyan-400 transition-colors'}`} />
                    {!collapsed && <span className="font-medium">{link.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800/50">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name || 'User'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'user@example.com'}
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors flex-shrink-0"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
