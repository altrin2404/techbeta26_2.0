"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  PenTool,
  Cpu,
  Lightbulb,
  Megaphone,
  Search,
  Users,
  MapPin,
  Sparkles,
  Clock,
  Info,
  FileText,
  X,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  LucideIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface EventItem {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  format: string;
  time: string;
  info?: string;
  theme?: string;
  categorySubtitle?: string;
  rulesHeader?: string;
  instructions: string[];
}

const technicalEvents: EventItem[] = [
  {
    title: "GENBUILD",
    description: "Build working prototypes from real-world problem statements using Generative AI tools.",
    icon: Terminal,
    color: "from-blue-500 to-indigo-600",
    format: "Individual",
    time: "9:00 AM to 11:00 AM",
    rulesHeader: "EVENT RULES & GUIDELINES",
    instructions: [
      "The competition is strictly individual.",
      "Each participant will be given exactly one of the five scenarios.",
      "The official development period is 90 minutes. The submission deadline is final.",
      "The organizer will provide a computer and network connection for each participant.",
      "Participants may use approved AI tools such as ChatGPT, Gemini, Claude, GitHub Copilot and similar coding assistants.",
      "The core problem-specific functionality must be developed during the competition. Submitting a substantially pre-built solution is not permitted.",
      "Direct assistance from another person, code sharing, real-time collaboration or outsourcing any part of the solution is prohibited.",
      "Paid services or private API credentials are not guaranteed by the organizers. Participants should design solutions that can be demonstrated with the available environment or free resources.",
      "The prototype must be executable and demonstrable during evaluation. Static mock-ups alone do not qualify as a fully functional prototype.",
      "Any attempt to gain an unfair advantage, interfere with another participant, or violate organizer instructions may result in disqualification.",
      "The judges reserve the right to make final decisions regarding rule interpretation, technical feasibility and scoring disputes.",
    ],
  },
  {
    title: "UI-VERSE",
    description: "Craft attractive, responsive, and user-friendly interfaces for a real-time design challenge.",
    icon: PenTool,
    color: "from-purple-500 to-pink-500",
    format: "Individual",
    time: "11:00 AM to 12:00 PM",
    rulesHeader: "EVENT RULES & GUIDELINES",
    instructions: [
      "Time Limit: 1 Hour.",
      "Individual participation only.",
      "Participants must use HTML, CSS, and JavaScript for designing the webpage.",
      "Use of the internet is not allowed during the competition.",
      "The design must follow the given theme.",
      "Late submissions will not be accepted.",
      "The decision of the judges will be final.",
    ],
  },
  {
    title: "LOGIC TRAP",
    description: "Detect hidden contradictions, debug flawed logic, and architect robust technical solutions.",
    icon: Cpu,
    color: "from-emerald-500 to-teal-600",
    format: "Team of 2 or Individual",
    time: "9:00 AM to 12:00 PM",
    rulesHeader: "EVENT RULES & GUIDELINES",
    instructions: [
      "Individual participation or teams of 2.",
      "Each team or participant will receive a faulty problem statement which will be provided on spot.",
      "Participants must identify and justify the faults in the given statement.",
      "The corrected requirements must be clear, logical, and consistent.",
      "Participants must not take assistance from other teams.",
      "Participants must strictly follow the allotted time and maintain proper silence.",
      "The judges' decision will be final.",
    ],
  },
  {
    title: "IDEA FORGE",
    description: "Present your ideas, explore emerging technologies, and showcase your perspective on any technical topic.",
    icon: Lightbulb,
    color: "from-amber-400 to-orange-500",
    format: "Team of 2 or Individual",
    time: "9:00 AM to 12:15 PM",
    categorySubtitle: "Idea Presentation",
    info: "Participants can complete their presentation and compete in any other technical event, provided the timings don't clash.",
    rulesHeader: "IDEA PRESENTATION RULES",
    instructions: [
      "Any technical topic or innovative idea is accepted.",
      "Participants from any technical stream are encouraged to participate.",
      "Individual participation or teams of 2.",
      "Each team will get 5 minutes — 4 minutes for presentation and 1 minute for Q&A.",
      "The presentation must contain 8–12 slides.",
      "Submit the Problem Statement and Idea Presentation (PDF/PPT) to: techbeta2k26@gmail.com",
    ],
  }
];

const nonTechnicalEvents: EventItem[] = [
  {
    title: "BRAND BLITZ",
    description: "Create brand identity, catchy taglines, and deliver an engaging live advertising pitch.",
    icon: Megaphone,
    color: "from-rose-500 to-red-600",
    format: "Team of 2 or Individual",
    time: "1:00 PM to 1:45 PM",
    rulesHeader: "EVENT RULES & GUIDELINES",
    theme: "Think. Brand. Blitz.",
    categorySubtitle: "Advertising Competition",
    instructions: [
      "Individual participation / teams of 2.",
      "The product, service, or advertising theme will be revealed at the beginning of the event.",
      "Participants must create an original advertising concept based on the given topic.",
      "The advertisement may include a brand name, logo/concept, tagline, script, promotional idea, social-media campaign, or short skit.",
      "The advertisement must be relevant to the given product/theme and clearly communicate its USP.",
      "Copied, plagiarized, or previously prepared content will lead to disqualification.",
      "Offensive, discriminatory, defamatory, or inappropriate content is strictly prohibited.",
    ],
  },
  {
    title: "BID & BUILD",
    description: "Bid in a ₹100 auction for mystery items and combine them into an innovative new product.",
    icon: Search,
    color: "from-cyan-500 to-blue-500",
    format: "Team of 2 or Individual",
    time: "1:45 PM to 2:30 PM",
    rulesHeader: "EVENT RULES & GUIDELINES",
    instructions: [
      "Individual participation or teams of 2.",
      "Each team will receive a budget of ₹100. Teams must not spend more than this amount.",
      "About 25 everyday objects will be available in the auction. Each team must buy exactly two objects. Team with one object will not be allowed to present.",
      "Teams must use their two objects together to create one new product idea. Teams cannot exchange their objects with other teams.",
      "Each team will have a maximum of 3 minutes to present its product.",
      "Teams must not copy another team's idea.",
      "Participants must follow all instructions given by the event organizers during the auction and the event.",
      "The judges' decision will be final.",
    ],
  }
];

export function Events() {
  const [activeTab, setActiveTab] = useState<"technical" | "non-technical">("technical");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const activeEvents = activeTab === "technical" ? technicalEvents : nonTechnicalEvents;

  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSelectedEvent(null);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [selectedEvent]);

  return (
    <section id="events" className="w-full py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Subtle background ambient blur */}
      <div className="hidden md:block absolute top-1/3 -left-32 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" style={{ transform: "translateZ(0)" }} />
      <div className="hidden md:block absolute bottom-10 -right-32 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" style={{ transform: "translateZ(0)" }} />

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

              {/* Non-Technical Events Tab */}
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
                  onClick={() => {
                    setSelectedEvent(event);
                    trackEvent("event_instructions_view", { event: event.title, trigger: "card_click" });
                  }}
                  className="group relative bg-white border border-slate-200/80 hover:border-blue-400 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-2xl hover:shadow-blue-500/15 transition-all overflow-hidden flex flex-col justify-between cursor-pointer select-none"
                >
                  <div
                    className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${event.color} opacity-5 rounded-bl-full group-hover:scale-150 group-hover:opacity-10 transition-all duration-500`}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-5 sm:mb-6 relative z-10">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${event.color} shadow-lg shadow-blue-500/15 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                      >
                        <Icon className="text-white h-5 w-5 sm:h-6 sm:w-6" />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEvent(event);
                          trackEvent("event_instructions_view", { event: event.title });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100/90 hover:bg-blue-600 hover:text-white border border-slate-200/80 transition-all duration-200 cursor-pointer shadow-xs group/tag"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-600 group-hover/tag:text-yellow-300 group-hover/tag:rotate-12 transition-all duration-300" />
                        <span>Rules &amp; Guidelines</span>
                      </button>
                    </div>

                    <div className="flex items-center flex-wrap gap-2 mb-2 relative z-10">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h3>
                      {event.categorySubtitle && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200/80 uppercase tracking-wide">
                          {event.categorySubtitle}
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed relative z-10">
                      {event.description}
                    </p>

                    {event.info && (
                      <div className="mb-6 bg-blue-50/80 border border-blue-200 p-3 rounded-xl flex items-start gap-2 relative z-10">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-blue-800 font-medium leading-relaxed">
                          {event.info}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action & Info Footer */}
                  <div className="pt-4 border-t border-slate-100 relative z-10 flex flex-col gap-3 mt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center text-xs font-semibold text-slate-700 bg-slate-50 group-hover:bg-blue-50/60 px-3 py-1.5 rounded-lg border border-slate-100 transition-colors">
                        <Users className="h-3.5 w-3.5 mr-1.5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                        {event.format}
                      </div>
                      <div className="flex items-center text-xs font-semibold text-slate-700 bg-slate-50 group-hover:bg-blue-50/60 px-3 py-1.5 rounded-lg border border-slate-100 transition-colors">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                        {event.time}
                      </div>
                    </div>

                    {/* High-visibility animated interactive CTA button */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedEvent(event);
                        trackEvent("event_instructions_view", { event: event.title });
                      }}
                      className={`relative w-full overflow-hidden py-3 sm:py-3.5 px-4 sm:px-5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm text-white shadow-lg bg-gradient-to-r ${event.color} hover:brightness-110 active:brightness-95 transition-all duration-300 flex items-center justify-between group/btn cursor-pointer ring-2 ring-white/30`}
                    >
                      {/* Moving animated light streak */}
                      <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

                      <div className="flex items-center gap-2.5 relative z-10">
                        <span className="relative flex h-2 w-2">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_8px_#ffffff]" />
                        </span>
                        <BookOpen className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-120 group-hover/btn:-rotate-6" />
                        <span className="tracking-wide font-extrabold drop-shadow-xs">Click for Instructions</span>
                      </div>

                      <div className="flex items-center gap-1.5 relative z-10 text-[11px] font-bold bg-black/25 hover:bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-lg transition-colors border border-white/20">
                        <span>View Rules</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Instructions Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/65 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[88vh]"
            >
              {/* Modal Header */}
              <div className="relative p-5 sm:p-6 bg-slate-900 text-white overflow-hidden shrink-0">
                <div
                  className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${selectedEvent.color} opacity-20 rounded-full blur-2xl pointer-events-none`}
                />

                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${selectedEvent.color} shadow-lg shrink-0`}
                    >
                      <selectedEvent.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-cyan-300 font-bold border border-white/10">
                          {activeTab === "technical" ? "Technical Event" : "Non-Technical Event"}
                        </span>
                      </div>
                      <h3
                        className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center flex-wrap gap-2"
                        style={{ fontFamily: "var(--font-orbitron)" }}
                      >
                        <span>{selectedEvent.title}</span>
                        {selectedEvent.categorySubtitle && (
                          <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            {selectedEvent.categorySubtitle}
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Close instructions modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 text-xs font-medium text-slate-300 relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                    <Users className="w-3.5 h-3.5 text-blue-300" />
                    {selectedEvent.format}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    {selectedEvent.time}
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
                {/* Description */}
                <div className="text-xs sm:text-sm text-slate-600 bg-slate-50 border border-slate-100 p-3.5 sm:p-4 rounded-xl leading-relaxed">
                  {selectedEvent.description}
                </div>

                {/* Theme & Subtitle Banner */}
                {(selectedEvent.theme || selectedEvent.categorySubtitle) && (
                  <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 sm:p-4">
                    {selectedEvent.theme && (
                      <p className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                        <span className="text-rose-600 font-extrabold uppercase text-[10px] tracking-wider bg-rose-100 px-2 py-0.5 rounded">
                          Theme
                        </span>
                        <span>{selectedEvent.theme}</span>
                      </p>
                    )}
                    {selectedEvent.categorySubtitle && (
                      <p className={`text-xs font-semibold mt-1 flex items-center gap-2 ${selectedEvent.categorySubtitle.includes("Idea") ? "text-amber-800" : "text-rose-700"}`}>
                        <span className={`font-extrabold uppercase text-[10px] tracking-wider px-2 py-0.5 rounded ${selectedEvent.categorySubtitle.includes("Idea") ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-700"}`}>
                          Format
                        </span>
                        <span>{selectedEvent.categorySubtitle}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Rules & Guidelines Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-900 uppercase flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>{selectedEvent.rulesHeader || "EVENT RULES & GUIDELINES"}</span>
                  </h4>
                </div>

                {/* Instructions List or Empty State */}
                {selectedEvent.instructions.length > 0 ? (
                  <ul className="space-y-2.5 sm:space-y-3">
                    {selectedEvent.instructions.map((inst, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-blue-50/40 hover:border-blue-200/70 transition-colors text-xs sm:text-sm text-slate-700 leading-relaxed"
                      >
                        <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px] flex items-center justify-center mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="flex-1">
                          {inst.includes("techbeta2k26@gmail.com") ? (
                            <>
                              {inst.replace("techbeta2k26@gmail.com", "").trim()}{" "}
                              <a
                                href="mailto:techbeta2k26@gmail.com"
                                onClick={(e) => e.stopPropagation()}
                                className="font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 transition-colors"
                              >
                                <span>📧 techbeta2k26@gmail.com</span>
                              </a>
                            </>
                          ) : (
                            inst
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-10 text-center px-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">No instructions available yet</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Instructions and guidelines for this event will be announced prior to the event.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

