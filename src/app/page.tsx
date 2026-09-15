"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Schedule } from "@/components/schedule";
import { Events } from "@/components/events";
import { Registration } from "@/components/registration";
import { FAQ } from "@/components/faq";
import { TeamAndContact } from "@/components/team";
import { Countdown } from "@/components/countdown";
import { CollegeBanner } from "@/components/college-banner";
import { Venue } from "@/components/venue";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50 to-blue-50/50 pt-24 pb-16 md:pt-32 md:pb-20">
        {/* Subtle decorative blobs */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 transform">
          <div className="h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-200/40 to-purple-200/30 blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 transform">
          <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-cyan-200/30 to-teal-200/30 blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">

          <div className="mb-6 rounded-3xl overflow-hidden shadow-2xl">
            <CollegeBanner />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center mb-6 w-full font-orbitron"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            {/* Department Line */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-1 w-full max-w-4xl">
              <div className="hidden sm:block h-px bg-purple-500/30 flex-grow max-w-[100px] md:max-w-[200px]"></div>
              <h2
                className="text-purple-600/90 font-medium uppercase tracking-wider text-xs sm:text-sm md:text-xl lg:text-2xl text-center leading-snug"
                style={{ fontFamily: "var(--font-orbitron)", fontWeight: 500 }}
              >
                DEPARTMENT OF INFORMATION TECHNOLOGY
              </h2>
              <div className="hidden sm:block h-px bg-purple-500/30 flex-grow max-w-[100px] md:max-w-[200px]"></div>
            </div>

            {/* Organises */}
            <p
              className="text-purple-500/80 font-normal uppercase tracking-[0.3em] text-[10px] sm:text-xs md:text-sm mb-1"
              style={{ fontFamily: "var(--font-orbitron)", fontWeight: 400 }}
            >
              ORGANISES
            </p>

            {/* Symposium text */}
            <h3
              className="text-slate-600 font-bold uppercase tracking-[0.15em] text-[10px] sm:text-xs md:text-sm mb-2"
              style={{ fontFamily: "var(--font-orbitron)", fontWeight: 700 }}
            >
              A NATIONAL LEVEL TECHNICAL SYMPOSIUM
            </h3>

            {/* TechBETA 2026 2.0 */}
            <h1
              className="text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] xl:text-[8rem] leading-none font-black tracking-wider text-slate-900 mb-2 md:mb-4 md:whitespace-nowrap flex flex-col md:block items-center"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              <span style={{ fontFamily: "var(--font-orbitron)" }}>TechBETA</span>{" "}
              <span className="text-blue-600" style={{ fontFamily: "var(--font-orbitron)" }}>2026 2.0</span>
            </h1>

            {/* Brigitz Slogan */}
            <h3
              className="text-blue-600 font-bold tracking-widest text-xs sm:text-sm md:text-base lg:text-lg uppercase px-2"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              BRIGITZ Empowering Technical Aspects
            </h3>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-6 mb-10 md:mb-12 w-full max-w-2xl mx-auto px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 text-slate-700 bg-white px-4 sm:px-5 py-3 rounded-2xl shadow-md border border-slate-200/60 w-full sm:w-auto justify-center text-center">
              <CalendarDays className="h-5 w-5 text-blue-600 shrink-0" />
              <span className="font-semibold text-xs sm:text-sm md:text-base text-slate-800">October 13, 2026 &bull; 9:00 AM</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700 bg-white px-4 sm:px-5 py-3 rounded-2xl shadow-md border border-slate-200/60 w-full sm:w-auto justify-center text-center">
              <MapPin className="h-5 w-5 text-teal-600 shrink-0" />
              <span className="font-semibold text-xs sm:text-sm md:text-base text-slate-800">Conference Hall, St. Xavier&apos;s Catholic College of Engineering, Nagercoil</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="#register"
              onClick={(e) => {
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
              }}
              className="inline-flex h-12 sm:h-14 items-center justify-center rounded-full bg-slate-900 px-6 sm:px-8 text-sm sm:text-base font-semibold text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all group cursor-pointer"
            >
              Register Now
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Countdown />
      <Events />
      <Schedule />
      <Registration />
      <Venue />
      <FAQ />
      <TeamAndContact />
    </div>
  );
}
