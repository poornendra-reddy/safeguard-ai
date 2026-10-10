'use client';

import React from 'react';

export default function DynamicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#070D12]">
      {/* Full-screen Cyber Grid Pattern */}
      <div className="absolute inset-0 bg-cyber-grid opacity-80" />

      {/* Central Radial Cyan Spotlight Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(0,213,232,0.12)_0%,rgba(56,189,248,0.03)_45%,transparent_70%)] blur-[20px]" />

      {/* Secondary Bottom Ambient Glow */}
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(0,213,232,0.06)_0%,transparent_70%)] blur-[30px]" />
    </div>
  );
}
