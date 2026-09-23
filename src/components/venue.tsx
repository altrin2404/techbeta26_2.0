"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Copy,
  Check,
  ExternalLink,
  Building2,
  Sparkles,
  Clock
} from "lucide-react";

export function Venue() {
  const [copiedCoords, setCopiedCoords] = useState(false);

  const LATITUDE = 8.193995;
  const LONGITUDE = 77.385018;
  const COORDS_STRING = `${LATITUDE}, ${LONGITUDE}`;
  const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${LATITUDE},${LONGITUDE}`;
  const EMBED_URL = `https://maps.google.com/maps?q=${LATITUDE},${LONGITUDE}&hl=en&z=16&output=embed`;

  const handleCopyCoordinates = () => {
    navigator.clipboard.writeText(COORDS_STRING);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  return (
    <section id="venue" className="w-full py-16 md:py-24 bg-white relative overflow-hidden scroll-mt-20">
      {/* Subtle background glow */}
      <div className="hidden md:block absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-[450px] h-[450px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute bottom-0 right-0 translate-x-1/4 w-[450px] h-[450px] bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            Symposium Location
          </div>
          <h2
            className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Event Venue
          </h2>
          <div className="text-slate-600 leading-relaxed">
            <p className="text-lg md:text-2xl font-bold text-slate-900">
              Conference Hall
            </p>
            <p className="text-sm md:text-base font-medium text-slate-600 mt-1">
              St. Xavier&apos;s Catholic College of Engineering, Nagercoil
            </p>
          </div>
        </motion.div>

        {/* Main Grid: Map & Venue Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive Google Map Embed */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col"
          >
            <div className="relative w-full h-[360px] sm:h-[420px] lg:h-full min-h-[360px] rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-100 group">
              <iframe
                title="Event Venue - Conference Hall, St. Xavier's Catholic College of Engineering, Nagercoil"
                src={EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[15%] contrast-[105%] group-hover:grayscale-0 transition-all duration-500"
              />

              {/* Floating quick action on map */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-200/80 flex items-center justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-slate-800">Campus GPS Active</span>
                </div>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Get Directions
                  <Navigation className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Venue Card Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div>
              <div className="flex items-center gap-3 text-blue-600 mb-3">
                <div className="p-2.5 bg-blue-100/80 text-blue-700 rounded-xl">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Event Venue &amp; Institution</span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                    Conference Hall
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700">
                    St. Xavier&apos;s Catholic College of Engineering, Nagercoil
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                {/* Time & Date Badge */}
                <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200/70 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                      Date &amp; Reporting Time
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 block">
                      October 13, 2026
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-600 block mt-0.5">
                      9:00 AM Onwards
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Address:</p>
                    <p className="text-slate-700 font-medium">Conference Hall,</p>
                    <p className="text-slate-600">St. Xavier&apos;s Catholic College of Engineering,</p>
                    <p className="text-slate-600">Chunkankadai, Nagercoil, Kanyakumari District,</p>
                    <p className="text-slate-600">Tamil Nadu, India — 629003</p>
                  </div>
                </div>

                {/* GPS Coordinates with copy */}
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                      GPS Coordinates
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-800">
                      {COORDS_STRING}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCoordinates}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                    title="Copy coordinates"
                  >
                    {copiedCoords ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Navigation className="h-4 w-4" />
                Navigate in Maps
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${LATITUDE},${LONGITUDE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-sm"
              >
                <ExternalLink className="h-4 w-4" />
                Open Map
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
