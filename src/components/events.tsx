"use client";

import { motion } from "framer-motion";
import { Terminal, PenTool, Cpu, Lightbulb, Megaphone, Search, Users, MapPin, Clock } from "lucide-react";
import { useState } from "react";

const technicalEvents = [
  {
    title: "GENBUILD",
    description: "Participants are given a real-world problem statement and must transform their idea into a working prototype using Generative AI and AI-assisted development tools. They may use AI for coding, UI generation, debugging, and documentation, but must clearly explain how their solution works.",
    icon: Terminal,
    color: "from-blue-500 to-indigo-600",
    format: "Individual",

  },
  {
    title: "UI-VERSE",
    description: "Participants are given a design challenge and must create an attractive, functional, and user-friendly interface. They compete based on visual design, usability, creativity, and how effectively their design addresses the given problem.",
    icon: PenTool,
    color: "from-purple-500 to-pink-500",
    format: "Individual",

  },
  {
    title: "LOGIC TRAP",
    description: "Participants are given a deliberately confusing or faulty problem statement containing hidden errors, missing information, or contradictions. They must identify the faults, correct the requirements, and present a practical technical solution.",
    icon: Cpu,
    color: "from-emerald-500 to-teal-600",
    format: "Individual / Team of 2",

  },
  {
    title: "IDEA FORGE",
    description: "Participants present an innovative technical idea or concept. They must clearly communicate the problem, proposed solution, novelty, technical approach, practical applications, and potential impact of their idea.",
    icon: Lightbulb,
    color: "from-amber-400 to-orange-500",
    format: "Individual / Team of 2",

  }
];

const nonTechnicalEvents = [
  {
    title: "BRAND BLITZ",
    description: "A creative advertising competition where participants are given a product or service and challenged to create and present an engaging advertisement. They develop the brand concept, tagline, promotional strategy, and advertisement while competing on creativity, persuasion, presentation, and marketing skills.",
    icon: Megaphone,
    color: "from-rose-500 to-red-600",
    format: "Individual / Team of 2",

  },
  {
    title: "BID & BUILD",
    description: "Teams receive a fixed budget of ₹100 and compete in an auction for around 25 everyday objects. Each team must strategically purchase exactly two items and combine them to create an innovative product. They then pitch its name, purpose, uniqueness, target customers, and market value.",
    icon: Search,
    color: "from-cyan-500 to-blue-500",
    format: "Individual / Team of 2",

  }
];

export function Events() {
  const [activeTab, setActiveTab] = useState<"technical" | "non-technical">("technical");
  const activeEvents = activeTab === "technical" ? technicalEvents : nonTechnicalEvents;

  return (
    <section id="events" className="w-full py-16 md:py-24 bg-white relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <MapPin className="h-3.5 w-3.5 text-blue-600" />
            Venue: Conference Hall, St. Xavier&apos;s Catholic College of Engineering, Nagercoil &bull; Starts 9:00 AM
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight" style={{ fontFamily: "var(--font-orbitron)" }}>Symposium Events</h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto mb-6 md:mb-8 px-2">
            Compete, showcase your skills, and win exciting prizes across our technical and non-technical events.
          </p>

          <div className="flex justify-center w-full px-2">
            <div className="flex flex-col sm:flex-row bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto gap-1">
              <button
                onClick={() => setActiveTab("technical")}
                className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all w-full sm:w-auto ${activeTab === "technical" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Technical Events
              </button>
              <button
                onClick={() => setActiveTab("non-technical")}
                className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all w-full sm:w-auto ${activeTab === "non-technical" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Non-Technical Events
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          {activeEvents.map((event, index) => {
            const Icon = event.icon;
            return (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${event.color} opacity-5 rounded-bl-full group-hover:scale-150 transition-transform duration-500`}></div>

                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${event.color} mb-5 sm:mb-6 shadow-lg relative z-10`}>
                  <Icon className="text-white h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3 relative z-10">{event.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-5 sm:mb-6 leading-relaxed relative z-10">
                  {event.description}
                </p>

                <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-slate-100 relative z-10">
                  <div className="flex items-center text-xs sm:text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Users className="h-4 w-4 mr-1.5 text-slate-500" />
                    {event.format}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
