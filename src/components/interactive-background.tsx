"use client";

import React, { memo } from "react";

export const InteractiveBackground = memo(function InteractiveBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
      style={{ willChange: "transform", contain: "strict" }}
    >
      {/* 1. Subtle High-Tech Dot Matrix Pattern (Hardware-accelerated) */}
      <div
        className="absolute inset-0 opacity-[0.14] sm:opacity-[0.2]"
        style={{
          backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* 2. Static Ambient Gradient Mesh (Zero JS overhead, painted once by GPU) */}
      <div
        className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-blue-400/10 via-indigo-300/5 to-transparent blur-3xl pointer-events-none"
        style={{ transform: "translateZ(0)" }}
      />
      <div
        className="absolute top-[35%] -left-28 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-cyan-400/10 via-teal-300/5 to-transparent blur-3xl pointer-events-none"
        style={{ transform: "translateZ(0)" }}
      />
      <div
        className="absolute top-[68%] -right-28 w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-purple-400/10 via-blue-400/5 to-transparent blur-3xl pointer-events-none"
        style={{ transform: "translateZ(0)" }}
      />

      {/* 3. Lightweight Decorative Tech Accents */}
      <div
        className="hidden md:block absolute top-[14%] left-[4%] w-20 h-20 rounded-full border border-blue-400/15 border-dashed pointer-events-none"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500/60" />
      </div>

      <div
        className="hidden md:block absolute top-[62%] left-[3%] w-24 h-24 rounded-2xl border border-teal-400/15 border-dotted pointer-events-none"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-teal-400/60" />
      </div>

      <div className="hidden md:block absolute top-[22%] left-[12%] text-blue-400/25 text-xs font-mono font-bold select-none pointer-events-none">
        +
      </div>
      <div className="hidden md:block absolute top-[48%] right-[10%] text-purple-400/25 text-xs font-mono font-bold select-none pointer-events-none">
        +
      </div>
    </div>
  );
});
