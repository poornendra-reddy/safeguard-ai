'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShieldAlert, History, BookOpen, User } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

const BOTTOM_NAV_ITEMS = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Analyze', href: '/analyze/screenshot', icon: ShieldAlert },
  { name: 'History', href: '/history', icon: History },
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#050A0F] text-slate-100 flex flex-col md:flex-row relative z-10 font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop & Mobile Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full lg:ml-64 pb-16 md:pb-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-[#050A0F]">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around p-2.5 bg-[#081118] border-t border-[#1D3038] md:hidden">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full space-y-1 ${isActive ? 'text-[#00E5FF]' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-mono font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
