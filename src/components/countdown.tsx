"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar } from "lucide-react";
import Link from "next/link";

export function Countdown() {
  const eventDate = new Date("2026-10-13T09:00:00").getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mountTimer = setTimeout(() => setMounted(true), 0);
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setIsCompleted(true);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => {
      clearTimeout(mountTimer);
      clearInterval(interval);
    };
  }, [eventDate]);

  const timeBlocks = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  if (!mounted) return null;

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-[#f8fafe] via-white to-[#f8fafe] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="hidden md:block absolute top-1/2 -left-28 -translate-y-1/2 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="hidden md:block absolute top-1/2 -right-28 -translate-y-1/2 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Countdown */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 text-blue-600 font-bold tracking-wider text-xs sm:text-sm mb-4 uppercase">
              <Clock className="h-4 w-4 text-blue-600 animate-spin" style={{ animationDuration: "12s" }} />
              Live Countdown
            </div>
            
            {isCompleted ? (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 sm:mb-8 leading-tight" style={{ fontFamily: "var(--font-orbitron)" }}>
                Event Successfully <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Completed</span>
              </h2>
            ) : (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 sm:mb-8 leading-tight" style={{ fontFamily: "var(--font-orbitron)" }}>
                TechBETA 2026 2.0 Commences <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500">In</span>
              </h2>
            )}

            <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 w-full">
              {timeBlocks.map((block, idx) => (
                <motion.div
                  key={block.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -5, scale: 1.04 }}
                  className="flex flex-col gap-1 sm:gap-2 w-full cursor-default"
                >
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/5 border border-slate-200/80 hover:border-blue-400 aspect-square sm:aspect-auto sm:w-20 sm:h-24 md:w-24 md:h-28 flex items-center justify-center p-1 sm:p-2 transition-colors">
                    <span className="text-xl xs:text-2xl sm:text-3xl md:text-5xl font-black text-blue-600 font-[family-name:var(--font-jetbrains-mono)] tracking-wide sm:tracking-widest">
                      {isCompleted ? "00" : block.value.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-xs font-bold text-slate-700 tracking-wider text-center">{block.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Date Card */}
          <div className="flex justify-center lg:justify-end">
            <motion.div 
              initial={{ opacity: 0, x: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              whileHover={{ y: -6 }}
              className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-blue-500/10 border border-slate-200/80 hover:border-blue-300 w-full max-w-sm relative overflow-hidden transition-all duration-300"
            >
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-5 sm:py-6 px-4 text-center relative">
                <div className="absolute top-4 left-6 sm:left-8 w-3 h-3 rounded-full bg-white/30 shadow-inner"></div>
                <div className="absolute top-4 right-6 sm:right-8 w-3 h-3 rounded-full bg-white/30 shadow-inner"></div>
                <h3 className="text-white font-black tracking-[0.2em] uppercase text-base sm:text-xl drop-shadow-md">
                  OCTOBER 2026
                </h3>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="text-center mb-6 sm:mb-8 relative">
                  <div className="text-[5.5rem] sm:text-[7rem] md:text-[8rem] leading-none font-black text-slate-800 font-[family-name:var(--font-jetbrains-mono)] tracking-tighter hover:text-blue-600 transition-colors">
                    13
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl py-3 px-6 flex items-center justify-center gap-3 mb-8 text-slate-700 font-bold uppercase text-xs sm:text-sm tracking-wide mx-auto shadow-sm">
                  <Calendar className="h-5 w-5 text-purple-600 shrink-0" />
                  <span className="text-center leading-tight">
                    {isCompleted ? (
                      <>EVENT<br/>COMPLETED</>
                    ) : (
                      <>EVENT<br/>UPCOMING</>
                    )}
                  </span>
                </div>

                <div className="text-center text-slate-500 font-semibold mb-8 uppercase tracking-wider text-sm">
                  Tuesday | SXCCE, Nagercoil
                </div>

                {isCompleted ? (
                  <button disabled className="w-full h-14 rounded-xl bg-slate-200 text-slate-400 font-bold tracking-wide uppercase transition-all cursor-not-allowed">
                    Completed
                  </button>
                ) : (
                  <Link href="#register" className="flex items-center justify-center w-full h-14 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold tracking-wider uppercase transition-all shadow-lg shadow-slate-900/20 hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]">
                    Register Now
                  </Link>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
