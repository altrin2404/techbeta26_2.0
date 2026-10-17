"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Trophy, Award, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function Countdown() {
  const scrollToRegister = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-registration"));
    const target = document.getElementById("register");
    if (target) {
      const navOffset = 85;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      window.history.pushState(null, "", "#register");
      setTimeout(() => {
        document.getElementById("first-participant-name")?.focus({ preventScroll: true });
      }, 450);
    }
  };

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-[#f8fafe] via-white to-[#f8fafe] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="hidden md:block absolute top-1/2 -left-28 -translate-y-1/2 w-80 h-80 bg-blue-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute top-1/2 -right-28 -translate-y-1/2 w-80 h-80 bg-purple-200/15 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Side: Event Completed Message (Timer Clock Closed) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold tracking-wider text-xs sm:text-sm mb-4 uppercase">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Event Successfully Concluded
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 sm:mb-6 leading-tight" style={{ fontFamily: "var(--font-orbitron)" }}>
              TechBETA 2026 2.0 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500">Event Completed</span>
            </h2>



            {/* Event Highlights & Open Registration Notice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">6 Grand Events</div>
                  <div className="text-[11px] text-slate-500">Technical &amp; Non-Technical</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Certificates &amp; Awards</div>
                  <div className="text-[11px] text-slate-500">Distributed to Winners</div>
                </div>
              </div>
            </div>


          </motion.div>

          {/* Right Side: Date & Active Registration Card */}
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

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl py-3 px-6 flex items-center justify-center gap-3 mb-6 text-emerald-800 font-bold uppercase text-xs sm:text-sm tracking-wide mx-auto shadow-sm">
                  <Calendar className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-center leading-tight">
                    EVENT<br />COMPLETED
                  </span>
                </div>

                <div className="text-center text-slate-500 font-semibold mb-6 uppercase tracking-wider text-sm">
                  Tuesday | SXCCE, Nagercoil
                </div>

                {/* Claim Certificates Call to Action */}
                <Link
                  href="#claim-certificates"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("claim-certificates")?.scrollIntoView({ behavior: "smooth" });
                    setTimeout(() => {
                      document.getElementById("claim-email-input")?.focus();
                    }, 400);
                  }}
                  className="flex items-center justify-center gap-2 w-full h-14 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 hover:from-blue-600 hover:to-teal-500 text-white font-bold tracking-wider uppercase transition-all shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Award className="h-5 w-5" />
                  <span>Claim Certificates</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
