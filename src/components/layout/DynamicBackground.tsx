'use client';

import React from 'react';

export default function DynamicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050A0F]">
      {/* Subtle Cyber Grid Pattern */}
      <div className="absolute inset-0 soc-cyber-grid opacity-60" />

      {/* Subtle Dot Matrix Layer */}
      <div className="absolute inset-0 soc-dot-matrix opacity-40" />

      {/* Subtle Scanline Overlay */}
      <div className="absolute inset-0 soc-scanline opacity-30" />

      {/* Deep SOC Ambient Glows (Very Dark & Clean) */}
      <div className="absolute -top-40 left-1/4 w-[700px] h-[500px] bg-cyan-950/20 rounded-full blur-[160px]" />
      <div className="absolute -bottom-40 right-1/4 w-[700px] h-[500px] bg-slate-950/40 rounded-full blur-[160px]" />
    </div>
  );
}
