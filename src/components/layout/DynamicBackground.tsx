'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Color themes with 3 distinct vibrant background gradient colors each
const COLOR_THEMES = [
  {
    blob1: 'from-cyan-500 via-blue-600 to-indigo-700',
    blob2: 'from-purple-600 via-fuchsia-500 to-pink-500',
    blob3: 'from-teal-400 via-emerald-500 to-cyan-600',
  },
  {
    blob1: 'from-emerald-500 via-teal-600 to-cyan-700',
    blob2: 'from-amber-500 via-orange-500 to-red-600',
    blob3: 'from-blue-600 via-indigo-600 to-purple-700',
  },
  {
    blob1: 'from-rose-500 via-pink-600 to-purple-600',
    blob2: 'from-violet-600 via-indigo-500 to-cyan-500',
    blob3: 'from-amber-400 via-yellow-500 to-emerald-500',
  },
  {
    blob1: 'from-indigo-600 via-purple-600 to-pink-600',
    blob2: 'from-cyan-400 via-teal-500 to-blue-600',
    blob3: 'from-fuchsia-500 via-rose-500 to-amber-500',
  },
  {
    blob1: 'from-blue-500 via-cyan-400 to-teal-500',
    blob2: 'from-purple-500 via-violet-600 to-indigo-700',
    blob3: 'from-rose-600 via-crimson-500 to-orange-500',
  },
];

export default function DynamicBackground() {
  const [themeIndex, setThemeIndex] = useState(0);
  const pathname = usePathname();

  // Cycle colors automatically every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setThemeIndex((prev) => (prev + 1) % COLOR_THEMES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Change color immediately when user clicks on a tool / changes route
  useEffect(() => {
    setThemeIndex((prev) => (prev + 1) % COLOR_THEMES.length);
  }, [pathname]);

  const currentTheme = COLOR_THEMES[themeIndex];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950/80">
      {/* Blob 1 - Top Left */}
      <div
        className={`absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br ${currentTheme.blob1} opacity-60 blur-[130px] transition-all duration-[3000ms] ease-in-out transform hover:scale-110`}
      />

      {/* Blob 2 - Bottom Right */}
      <div
        className={`absolute -bottom-32 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br ${currentTheme.blob2} opacity-60 blur-[140px] transition-all duration-[3000ms] ease-in-out transform hover:scale-110`}
      />

      {/* Blob 3 - Center Staggered */}
      <div
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-br ${currentTheme.blob3} opacity-50 blur-[150px] transition-all duration-[3000ms] ease-in-out transform hover:scale-110`}
      />

      {/* Subtle overlay grid for tech vibe */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
    </div>
  );
}
