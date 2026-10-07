'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface Bubble {
  id: number;
  left: number; // 0 to 100%
  size: number; // width/height in px
  duration: number; // animation duration in seconds
  delay: number; // animation delay in seconds
  color: string; // gradient background color class
  shadow: string; // glow shadow box
}

const BUBBLE_COLORS = [
  { bg: 'bg-gradient-to-br from-cyan-400 to-blue-600', shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.6)]' },
  { bg: 'bg-gradient-to-br from-purple-500 to-pink-500', shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.6)]' },
  { bg: 'bg-gradient-to-br from-emerald-400 to-teal-500', shadow: 'shadow-[0_0_15px_rgba(52,211,153,0.6)]' },
  { bg: 'bg-gradient-to-br from-amber-400 to-orange-500', shadow: 'shadow-[0_0_15px_rgba(251,191,36,0.6)]' },
  { bg: 'bg-gradient-to-br from-rose-500 to-red-600', shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.6)]' },
  { bg: 'bg-gradient-to-br from-fuchsia-500 to-indigo-500', shadow: 'shadow-[0_0_15px_rgba(217,70,239,0.6)]' },
];

export default function DynamicBackground() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const pathname = usePathname();

  // Generate 25 persistent falling bubbles with different sizes, colors, positions, delays & speeds
  useEffect(() => {
    const generatedBubbles: Bubble[] = Array.from({ length: 25 }, (_, i) => {
      const colorObj = BUBBLE_COLORS[i % BUBBLE_COLORS.length];
      return {
        id: i,
        left: Math.floor(Math.random() * 96) + 2, // 2% to 98% horizontal position
        size: Math.floor(Math.random() * 24) + 14, // 14px to 38px bubble size
        duration: Math.floor(Math.random() * 3) + 3.5, // 3.5s to 6.5s falling speed
        delay: Number((Math.random() * 4).toFixed(2)), // 0s to 4s stagger delay
        color: colorObj.bg,
        shadow: colorObj.shadow,
      };
    });
    setBubbles(generatedBubbles);
  }, []);

  // When clicking a tool / changing routes, reshuffle bubble positions & colors dynamically
  useEffect(() => {
    setBubbles((prev) =>
      prev.map((b) => {
        const nextColor = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
        return {
          ...b,
          left: Math.floor(Math.random() * 96) + 2,
          color: nextColor.bg,
          shadow: nextColor.shadow,
        };
      })
    );
  }, [pathname]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Falling Bubbles Layer */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          className={`absolute rounded-full opacity-80 ${b.color} ${b.shadow} animate-bubble-fall`}
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        >
          {/* Inner highlight bubble sheen */}
          <div className="w-1.5 h-1.5 rounded-full bg-white/70 absolute top-1 left-1.5 blur-[0.5px]" />
        </div>
      ))}

      {/* Ambient Backlight Colors */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[140px]" />

      {/* Subdued Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  );
}
