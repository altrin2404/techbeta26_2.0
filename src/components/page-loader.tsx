"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done">("loading");

  useEffect(() => {
    const duration = 2200;
    const interval = 30;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      const t = current / steps;
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.min(Math.round(eased * 100), 100));

      if (current >= steps) {
        clearInterval(timer);
        setPhase("done");
        setTimeout(() => setVisible(false), 700);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 overflow-hidden"
        >
          {/* Background glowing blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)", animation: "blob-pulse 3s ease-in-out infinite" }}
            />
            <div
              className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
              style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)", animation: "blob-pulse 3s ease-in-out infinite 1.5s" }}
            />
          </div>

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-blue-400/60"
              style={{ left: `${10 + (i * 7.5) % 80}%`, top: `${15 + (i * 13) % 70}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.5, 1] }}
              transition={{ duration: 2 + (i % 3) * 0.5, repeat: Infinity, delay: (i * 0.2) % 1.5, ease: "easeInOut" }}
            />
          ))}

          {/* Main content */}
          <div className="relative flex flex-col items-center gap-8 px-8">

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              {/* Spinning ring with initials */}
              <div className="relative mb-6 w-36 h-36">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-500/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0 rounded-full border-t-2 border-blue-500" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-500/20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0 rounded-full border-b-2 border-purple-400" />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/img/brigitz-logo.png"
                    alt="Brigitz Logo"
                    className="w-24 h-24 object-contain rounded-full"
                  />
                </div>
              </div>

              {/* "Loading" label */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1] }}
                transition={{ delay: 0.2, duration: 1.5, repeat: Infinity }}
                className="text-blue-400/70 text-[10px] font-bold tracking-[0.5em] uppercase mb-4"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                Loading
              </motion.p>

              {/* TechBETA letter-by-letter reveal */}
              <div className="flex items-baseline flex-wrap justify-center">
                {"TechBETA".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.35 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-7xl font-black text-white leading-tight"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + 8 * 0.07 + 0.1, duration: 0.4 }}
                  className="text-3xl sm:text-5xl md:text-7xl font-black text-blue-500 leading-none ml-2"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  2026 2.0
                </motion.span>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="text-slate-500 text-[10px] tracking-widest uppercase mt-2 text-center"
              >
                National Level Technical Symposium
              </motion.p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-64 md:w-80"
            >
              <div className="flex justify-between mb-2">
                <span className="text-slate-500 text-[10px] tracking-widest uppercase">Initializing</span>
                <span className="text-blue-400 text-[10px] font-mono font-bold">{progress}%</span>
              </div>
              <div className="h-px w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-75"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)",
                    boxShadow: "0 0 6px #3b82f6",
                  }}
                />
              </div>
            </motion.div>

            {/* Done state */}
            <AnimatePresence>
              {phase === "done" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "backOut" }}
                  className="flex items-center gap-2 text-emerald-400 text-xs font-semibold tracking-wider"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Ready
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <style>{`
            @keyframes blob-pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
