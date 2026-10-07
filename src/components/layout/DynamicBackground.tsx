'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Color themes array (Each item has 3 distinct complementary gradient colors)
const COLOR_THEMES = [
  // 1. Cybersecurity Cyber Cyan & Electric Purple & Emerald Teal
  {
    glow1: 'from-cyan-500/50 to-blue-600/50',
    glow2: 'from-purple-600/50 to-pink-500/50',
    glow3: 'from-emerald-500/40 to-teal-400/40',
  },
  // 2. Neon Emerald & Golden Amber & Crimson Red
  {
    glow1: 'from-emerald-500/50 to-teal-500/50',
    glow2: 'from-amber-500/50 to-yellow-400/50',
    glow3: 'from-red-500/40 to-rose-600/40',
  },
  // 3. Royal Indigo & Electric Blue & Bright Magenta
  {
    glow1: 'from-indigo-600/50 to-blue-500/50',
    glow2: 'from-fuchsia-600/50 to-purple-500/50',
    glow3: 'from-cyan-400/40 to-sky-500/40',
  },
  // 4. Sunset Crimson & Solar Orange & Violet Purple
  {
    glow1: 'from-rose-500/50 to-red-600/50',
    glow2: 'from-orange-500/50 to-amber-500/50',
    glow3: 'from-indigo-500/40 to-purple-600/40',
  },
  // 5. Deep Aqua & Bright Lime & Electric Sapphire
  {
    glow1: 'from-teal-400/50 to-cyan-500/50',
    glow2: 'from-lime-500/40 to-emerald-500/50',
    glow3: 'from-blue-600/50 to-violet-500/40',
  },
];

export default function DynamicBackground() {
  const [themeIndex, setThemeIndex] = useState(0);
  const pathname = usePathname();

  // 1. Shift color theme every 4 seconds (between 3 to 5 seconds as requested)
  useEffect(() => {
    const timer = setInterval(() => {
      setThemeIndex((prev) => (prev + 1) % COLOR_THEMES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // 2. Change color theme immediately when user navigates or clicks a tool
  useEffect(() => {
    setThemeIndex((prev) => (prev + 1) % COLOR_THEMES.length);
  }, [pathname]);

  const currentTheme = COLOR_THEMES[themeIndex];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Animated Gradient Blob 1 (Top Left) */}
      <div
        className={`absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br ${currentTheme.glow1} blur-[120px] transition-all duration-[3000ms] ease-in-out transform animate-pulse`}
      />

      {/* Dynamic Animated Gradient Blob 2 (Bottom Right) */}
      <div
        className={`absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tl ${currentTheme.glow2} blur-[130px] transition-all duration-[3000ms] ease-in-out transform`}
      />

      {/* Dynamic Animated Gradient Blob 3 (Center Ambient) */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-gradient-to-r ${currentTheme.glow3} blur-[140px] transition-all duration-[3000ms] ease-in-out opacity-80`}
      />

      {/* Subdued Grid Mesh Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  );
}
