"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const scheduleItems = [
  { time: "09:00 AM", title: "Inauguration", desc: "Official opening ceremony of TECHBETA 2026 2.0 at Conference Hall, St. Xavier's Catholic College of Engineering, Nagercoil.", emoji: "🎙️" },
  { time: "10:30 AM", title: "Technical Events Commence", desc: "Commencement of all technical competitions and challenges across designated labs & halls.", emoji: "⚡" },
  { time: "12:15 PM", title: "Lunch Break", desc: "Lunch will be provided at the food court.", emoji: "🍽️" },
  { time: "01:00 PM", title: "Non-Technical Events", desc: "Commencement of exciting non-technical competitions and interactive sessions.", emoji: "🎯" },
  { time: "03:00 PM", title: "Valedictory Events", desc: "Closing ceremony, prize distribution, and awarding the winners at the Conference Hall.", emoji: "🏆" },
  { time: "04:15 PM", title: "Departure", desc: "Make use of College Buses.", emoji: "🚌" },
];

export function Schedule() {
  return (
    <section id="schedule" className="w-full py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="hidden md:block absolute top-1/4 -right-40 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 -left-40 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            Timeline &amp; Agenda
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight" style={{ fontFamily: "var(--font-orbitron)" }}>
            Event Schedule
          </h2>
          <p className="text-base sm:text-lg text-slate-700">
            Plan your day ahead. Arrive by 9:00 AM at the Conference Hall, St. Xavier&apos;s Catholic College of Engineering, Nagercoil.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative border-l-2 border-blue-200/70 ml-4 sm:ml-6 md:ml-0 pl-6 sm:pl-8 md:pl-0 md:border-l-0">
            {/* Center line with gradient for desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-teal-300 to-indigo-300 -translate-x-1/2"></div>

            <div className="space-y-8 md:space-y-12">
              {scheduleItems.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      x: isEven ? 35 : -35,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                    }}
                    viewport={{ once: true, margin: "-70px" }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                      ease: "easeOut",
                    }}
                    className={`relative flex flex-col md:flex-row items-start md:items-center ${isEven ? "md:flex-row-reverse" : ""}`}
                  >
                    {/* Node Emoji Badge */}
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 6 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className="absolute left-0 -translate-x-1/2 top-2 md:top-auto md:left-1/2 md:-translate-x-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white shadow-lg shadow-blue-500/15 ring-4 ring-blue-100/80 z-10 cursor-pointer"
                    >
                      <span className="text-xl sm:text-2xl leading-none select-none">{item.emoji}</span>
                    </motion.div>

                    {/* Schedule Content Card */}
                    <div className={`w-full md:w-1/2 ${isEven ? "md:pl-12" : "md:pr-12 md:text-right"}`}>
                      <motion.div
                        whileHover={{ y: -4, scale: 1.015 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white hover:bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group"
                      >
                        <div className={`flex items-center gap-2 mb-2 ${!isEven ? "md:justify-end" : ""}`}>
                          <Clock className="h-4 w-4 text-blue-600 shrink-0 group-hover:rotate-45 transition-transform duration-300" />
                          <span className="font-bold text-xs sm:text-sm text-blue-600 tracking-wide font-[family-name:var(--font-jetbrains-mono)]">
                            {item.time}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
