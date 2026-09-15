"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const scheduleItems = [
  { time: "09:00 AM", title: "Inauguration", desc: "Official opening ceremony of TECHBETA 2026 2.0 at Conference Hall, St. Xavier's Catholic College of Engineering, Nagercoil.", emoji: "🎙️" },
  { time: "09:30 AM", title: "Events Commences", desc: "Commencement of all technical competitions and workshops across labs & halls.", emoji: "⚡" },
  { time: "01:00 PM", title: "Lunch Break", desc: "Lunch will be provided at the food court.", emoji: "🍽️" },
  { time: "02:00 PM", title: "Valedictory", desc: "Closing ceremony and awarding the winners at the Conference Hall.", emoji: "🏆" },
  { time: "04:15 PM", title: "Departure", desc: "Make use of College Buses.", emoji: "🚌" },
];

export function Schedule() {
  return (
    <section id="schedule" className="w-full py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight" style={{ fontFamily: "var(--font-orbitron)" }}>Event Schedule</h2>
          <p className="text-lg text-slate-500">Plan your day ahead. Arrive by 9:00 AM at the Conference Hall, St. Xavier&apos;s Catholic College of Engineering, Nagercoil.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative border-l-2 border-blue-100 ml-4 sm:ml-6 md:ml-0 pl-6 sm:pl-8 md:pl-0 md:border-l-0">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-100 -translate-x-1/2"></div>

            <div className="space-y-8 md:space-y-12">
              {scheduleItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="absolute left-0 -translate-x-1/2 top-2 md:top-auto md:left-1/2 md:-translate-x-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white shadow-md shadow-blue-200/60 ring-2 ring-blue-100 z-10">
                    <span className="text-xl sm:text-2xl leading-none">{item.emoji}</span>
                  </div>

                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                    <div className="bg-slate-50 hover:bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                      <div className={`flex items-center gap-2 mb-2 ${index % 2 !== 0 ? 'md:justify-end' : ''}`}>
                        <Clock className="h-4 w-4 text-blue-500 shrink-0" />
                        <span className="font-semibold text-xs sm:text-sm text-blue-600">{item.time}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">{item.title}</h3>
                      <p className="text-sm sm:text-base text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
