"use client";

import Link from "next/link";
import { Cookie, Sparkles } from "lucide-react";

export function Footer() {
  const openCookieSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-cookie-settings"));
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-10 mt-auto text-slate-300 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/60">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="font-black text-xl tracking-tight text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                TechBETA <span className="text-blue-500">2026 2.0</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Department of Information Technology &bull; St. Xavier&apos;s Catholic College of Engineering
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-300">
            <Link href="#events" className="hover:text-cyan-400 transition-colors">
              Events
            </Link>
            <Link href="#schedule" className="hover:text-cyan-400 transition-colors">
              Schedule
            </Link>
            <Link href="#venue" className="hover:text-cyan-400 transition-colors">
              Venue
            </Link>
            <Link href="#faq" className="hover:text-cyan-400 transition-colors">
              FAQ
            </Link>
            <Link href="#contact" className="hover:text-cyan-400 transition-colors">
              Contact
            </Link>
            <button
              onClick={openCookieSettings}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-400 transition-colors cursor-pointer border-l border-slate-800 pl-4"
            >
              <Cookie className="h-3.5 w-3.5" />
              Cookie Choices
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-slate-400 text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} TechBETA 2026 2.0. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
