"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal, PenTool, Cpu, Lightbulb, Megaphone, Search, Users, MapPin, Sparkles, Clock, Info } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

const technicalEvents = [
  {
    title: "GENBUILD",
    description: "Build working prototypes from real-world problem statements using Generative AI tools.",
    icon: Terminal,
    color: "from-blue-500 to-indigo-600",
    format: "Individual",
    time: "9:00 AM to 11:00 AM",
  },
  {
    title: "UI-VERSE",
    description: "Craft attractive, responsive, and user-friendly interfaces for a real-time design challenge.",
    icon: PenTool,
    color: "from-purple-500 to-pink-500",
    format: "Individual",
    time: "11:00 AM to 12:00 PM",
  },
  {
    title: "LOGIC TRAP",
    description: "Detect hidden contradictions, debug flawed logic, and architect robust technical solutions.",
    icon: Cpu,
    color: "from-emerald-500 to-teal-600",
    format: "Individual / Team of 2",
    time: "9:00 AM to 12:00 PM",
  },
  {
    title: "IDEA FORGE",
    description: "Pitch groundbreaking tech solutions and defend their architecture, feasibility, and impact.",
    icon: Lightbulb,
    color: "from-amber-400 to-orange-500",
    format: "Individual / Team of 2",
    time: "9:00 AM to 12:15 PM",
    info: "Participants can complete their presentation and compete in any other technical event, provided the timings don't clash.",
  }
];

const nonTechnicalEvents = [
  {
    title: "BRAND BLITZ",
    description: "Create brand identity, catchy taglines, and deliver an engaging live advertising pitch.",
    icon: Megaphone,
    color: "from-rose-500 to-red-600",
    format: "Individual / Team of 2",
    time: "1:00 PM to 1:45 PM",
  },
  {
    title: "BID & BUILD",
    description: "Bid in a ₹100 auction for mystery items and combine them into an innovative new product.",
    icon: Search,
    color: "from-cyan-500 to-blue-500",
    format: "Individual / Team of 2",
    time: "1:45 PM to 2:30 PM",
  }
];

export function Events() {
  const [activeTab, setActiveTab] = useState<"technical" | "non-technical">("technical");
  const activeEvents = activeTab === "technical" ? technicalEvents : nonTechnicalEvents;

  return (
    <section id="events" className="w-full py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Subtle background ambient blur (Hidden on mobile for performance) */}
      <div className="hidden md:block absolute top-1/3 -left-32 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute bottom-10 -right-32 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <MapPin className="h-3.5 w-3.5 text-blue-600" />
            Venue: Conference Hall, St. Xavier&apos;s Catholic College of Engineering, Nagercoil &bull; Starts 9:00 AM
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight" style={{ fontFamily: "var(--font-orbitron)" }}>
            Symposium Events
          </h2>
          <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto mb-6 md:mb-8 px-2">
            Compete, showcase your skills, and win exciting prizes across our technical and non-technical events.
          </p>

          <div className="flex justify-center w-full px-2">
            <div className="relative inline-flex flex-col sm:flex-row bg-slate-900/90 p-1.5 sm:p-2 rounded-2xl sm:rounded-full border-2 border-slate-700/80 shadow-2xl backdrop-blur-md gap-2 sm:gap-2 max-w-xl w-full sm:w-auto">
              {/* Technical Events Tab */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("technical");
                  trackEvent("events_tab_switch", { tab: "technical" });
                }}
                className={`relative px-5 sm:px-7 py-3 rounded-xl sm:rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer ${activeTab === "technical"
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg shadow-blue-500/35 ring-2 ring-blue-400/50 scale-[1.02]"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  }`}
              >
                <Terminal className={`h-4 w-4 ${activeTab === "technical" ? "text-cyan-300" : "text-blue-400"}`} />
                <span>Technical Events</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-extrabold ${activeTab === "technical"
                  ? "bg-white/20 text-white"
                  : "bg-slate-800 text-cyan-300 border border-slate-700"
                  }`}>
                  4
                </span>
              </button>

              {/* Non-Technical Events Tab - HIGH-VISIBILITY HIGHLIGHTED */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("non-technical");
                  trackEvent("events_tab_switch", { tab: "non-technical" });
                }}
                className={`relative px-5 sm:px-7 py-3 rounded-xl sm:rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer ${activeTab === "non-technical"
                  ? "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white shadow-lg shadow-purple-500/35 ring-2 ring-pink-400/50 scale-[1.02]"
                  : "text-white bg-gradient-to-r from-purple-900/60 to-pink-900/50 border-2 border-pink-500/60 shadow-md shadow-purple-500/20 hover:border-pink-400 hover:scale-[1.02]"
                  }`}
              >
                <Sparkles className={`h-4 w-4 ${activeTab === "non-technical" ? "text-yellow-200" : "text-pink-300 animate-pulse"}`} />
                <span>Non-Technical Events</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-extrabold ${activeTab === "non-technical"
                  ? "bg-white/20 text-white"
                  : "bg-pink-500/30 text-pink-200 border border-pink-400/50"
                  }`}>
                  2
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6"
          >
            {activeEvents.map((event, index) => {
              const Icon = event.icon;
              return (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group relative bg-white border border-slate-200/80 hover:border-blue-300/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all overflow-hidden"
                >
                  <div
                    className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${event.color} opacity-5 rounded-bl-full group-hover:scale-150 group-hover:opacity-10 transition-all duration-500`}
                  />

                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${event.color} mb-5 sm:mb-6 shadow-lg shadow-blue-500/15 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                  >
                    <Icon className="text-white h-5 w-5 sm:h-6 sm:w-6" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 relative z-10 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed relative z-10">
                    {event.description}
                  </p>

                  {/* @ts-ignore */}
                  {event.info && (
                    <div className="mb-6 bg-blue-50/80 border border-blue-200 p-3 rounded-xl flex items-start gap-2 relative z-10">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-blue-800 font-medium leading-relaxed">
                        {/* @ts-ignore */}
                        {event.info}
                      </p>
                    </div>
                  )}

                    <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-slate-100 relative z-10">
                      <div className="flex items-center text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 group-hover:bg-blue-50/50 px-3 py-1.5 rounded-lg border border-slate-100 transition-colors">
                        <Users className="h-4 w-4 mr-1.5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                        {event.format}
                      </div>
                      <div className="flex items-center text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 group-hover:bg-blue-50/50 px-3 py-1.5 rounded-lg border border-slate-100 transition-colors">
                        <Clock className="h-4 w-4 mr-1.5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                        {event.time}
                      </div>
                    </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
