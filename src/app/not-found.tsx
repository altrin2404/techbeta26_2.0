import Link from "next/link";
import { ArrowLeft, Home, Calendar, Sparkles, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cyberpunk grid background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container max-w-2xl mx-auto text-center relative z-10 py-16">
        {/* Terminal / Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-wider mb-6">
          <Terminal className="h-3.5 w-3.5 text-red-400" />
          Status Code 404 &bull; Coordinates Lost
        </div>

        {/* 404 Glitch Title */}
        <h1
          className="text-7xl sm:text-9xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 mb-4 drop-shadow-[0_10px_35px_rgba(59,130,246,0.3)]"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          404
        </h1>

        <h2
          className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          SECTOR NOT FOUND
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto mb-8 leading-relaxed">
          The symposium terminal could not locate the requested coordinates. The page may have been relocated, or never existed in this dimension.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Home className="h-4 w-4" />
            Return to Main Stage
          </Link>

          <Link
            href="/#events"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm sm:text-base transition-all"
          >
            <Sparkles className="h-4 w-4 text-teal-400" />
            Explore Events
          </Link>

          <Link
            href="/#schedule"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm sm:text-base transition-all"
          >
            <Calendar className="h-4 w-4 text-blue-400" />
            Timeline &amp; Agenda
          </Link>
        </div>

        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-400 transition-colors group font-mono"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to TechBETA 2026 2.0
        </Link>
      </div>
    </div>
  );
}
