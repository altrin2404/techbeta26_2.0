"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ShieldCheck, Check, X, ChevronRight } from "lucide-react";
import { getCookieConsent, setCookieConsent, trackEvent } from "@/lib/analytics";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if consent has already been made
    const consent = getCookieConsent();
    if (consent === "undecided") {
      // Small initial delay so it doesn't jarringly block the initial hero load
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Allow reopening banner from footer or settings
  useEffect(() => {
    const handleReopen = () => {
      setShowBanner(true);
    };
    window.addEventListener("open-cookie-settings", handleReopen);
    return () => window.removeEventListener("open-cookie-settings", handleReopen);
  }, []);

  const handleAcceptAll = () => {
    setCookieConsent("accepted");
    setShowBanner(false);
    trackEvent("cookie_consent_given", { type: "all" });
  };

  const handleDecline = () => {
    setCookieConsent("declined");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.aside
          role="region"
          aria-label="Cookie consent banner"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-lg z-50 pointer-events-auto"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-slate-100 relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
                  <Cookie className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-base sm:text-lg tracking-tight" style={{ fontFamily: "var(--font-orbitron)" }}>
                    Cookie &amp; Privacy Choices
                  </h2>
                  <span className="text-[11px] text-teal-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> TechBETA 2026 2.0 Security
                  </span>
                </div>
              </div>

              <button
                onClick={handleDecline}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Close and decline optional cookies"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 relative z-10">
              We use local storage and essential cookies to securely process symposium registrations, issue QR entry passes, and gather anonymous analytics to optimize attendee experiences.
            </p>

            {/* Expandable Details */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mb-4 text-xs text-slate-300 space-y-2.5 border-t border-slate-800 pt-3 relative z-10"
                >
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-teal-400 min-w-[75px]">Essential:</span>
                    <span>Registration tokens, form state, and entry pass generation. Always active.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-400 min-w-[75px]">Analytics:</span>
                    <span>Anonymous traffic metrics, symposium section engagement, and page speed statistics.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 relative z-10">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                <Check className="h-4 w-4" />
                Accept All
              </button>

              <button
                type="button"
                onClick={handleDecline}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Necessary Only
              </button>

              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-slate-400 hover:text-teal-400 underline underline-offset-4 px-2 py-1 transition-colors flex items-center gap-0.5 cursor-pointer"
              >
                {showDetails ? "Hide" : "Details"}
                <ChevronRight className={`h-3 w-3 transition-transform ${showDetails ? "rotate-90" : ""}`} />
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
