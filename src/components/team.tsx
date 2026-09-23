"use client";

import { motion } from "framer-motion";
import { Users, PhoneCall, Bus } from "lucide-react";

export function TeamAndContact() {
  return (
    <section id="contact" className="w-full py-16 md:py-24 bg-slate-900 text-slate-100 relative overflow-hidden">
      {/* Self-contained procedural background texture (zero external network requests) */}
      <div 
        className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />

      {/* Ambient background glows */}
      <div className="hidden md:block absolute top-1/3 -left-32 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute bottom-10 -right-32 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">

          {/* Team Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6 sm:mb-8"
            >
              <Users className="h-7 w-7 sm:h-8 sm:w-8 text-blue-400 shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-orbitron)" }}>
                Meet the Team
              </h2>
            </motion.div>

            <div className="space-y-4 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -4, borderColor: "rgba(59, 130, 246, 0.6)" }}
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 p-5 sm:p-6 rounded-2xl shadow-lg transition-all"
              >
                <p className="text-blue-400 font-semibold mb-1 text-xs sm:text-sm uppercase tracking-wider">Convener</p>
                <p className="text-lg sm:text-xl font-bold text-white">Dr. Suja A. Alex</p>
                <p className="text-slate-300 text-sm sm:text-base">Associate Professor &amp; Hod-IT</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: 0.08 }}
                whileHover={{ y: -4, borderColor: "rgba(20, 184, 166, 0.6)" }}
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 p-5 sm:p-6 rounded-2xl shadow-lg transition-all"
              >
                <p className="text-teal-400 font-semibold mb-1 text-xs sm:text-sm uppercase tracking-wider">Faculty Advisor-BRIGITZ</p>
                <p className="text-lg sm:text-xl font-bold text-white">Er. P. Agnes Alex Rathy</p>
                <p className="text-slate-300 text-sm sm:text-base">Assistant Professor-IT</p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: 0.12 }}
                  whileHover={{ y: -4, borderColor: "rgba(168, 85, 247, 0.6)" }}
                  className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 p-5 sm:p-6 rounded-2xl shadow-lg transition-all"
                >
                  <p className="text-purple-400 font-semibold mb-1 text-xs sm:text-sm uppercase tracking-wider">Secretary</p>
                  <p className="text-base sm:text-lg font-bold text-white">Mr. A. Altrin Benser</p>
                  <p className="text-slate-300 text-xs sm:text-sm">Final Year-IT</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: 0.16 }}
                  whileHover={{ y: -4, borderColor: "rgba(244, 63, 94, 0.6)" }}
                  className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 p-5 sm:p-6 rounded-2xl shadow-lg transition-all"
                >
                  <p className="text-rose-400 font-semibold mb-1 text-xs sm:text-sm uppercase tracking-wider">Treasurer</p>
                  <p className="text-base sm:text-lg font-bold text-white">Ms. C. S. Absara</p>
                  <p className="text-slate-300 text-xs sm:text-sm">Final Year-IT</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{ y: -4, borderColor: "rgba(99, 102, 241, 0.6)" }}
                  className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 p-5 sm:p-6 rounded-2xl shadow-lg transition-all"
                >
                  <p className="text-indigo-400 font-semibold mb-1 text-xs sm:text-sm uppercase tracking-wider">Joint Secretary</p>
                  <p className="text-base sm:text-lg font-bold text-white">Mr. P. K. Haris Aniruth</p>
                  <p className="text-slate-300 text-xs sm:text-sm">Third Year - IT</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: 0.24 }}
                  whileHover={{ y: -4, borderColor: "rgba(236, 72, 153, 0.6)" }}
                  className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 p-5 sm:p-6 rounded-2xl shadow-lg transition-all"
                >
                  <p className="text-pink-400 font-semibold mb-1 text-xs sm:text-sm uppercase tracking-wider">Joint Treasurer</p>
                  <p className="text-base sm:text-lg font-bold text-white">Ms. S. S. Shernika</p>
                  <p className="text-slate-300 text-xs sm:text-sm">Third Year - IT</p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Contact & Bus */}
          <div className="space-y-8 sm:space-y-12">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-6 sm:mb-8"
              >
                <Bus className="h-7 w-7 sm:h-8 sm:w-8 text-blue-400 shrink-0" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-orbitron)" }}>
                  Routes &amp; Bus Numbers
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { place: "Nagercoil", buses: "17, 22" },
                  { place: "Kanyakumari", buses: "1" },
                  { place: "Marthandam", buses: "3, 4, 6, 11, 14" },
                  { place: "Kulasekharam", buses: "8, 12" },
                ].map((item, idx) => (
                  <motion.div
                    key={item.place}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.06 }}
                    whileHover={{ y: -3, borderColor: "rgba(59, 130, 246, 0.4)" }}
                    className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl flex items-center justify-between transition-colors shadow-sm"
                  >
                    <span className="font-semibold text-sm sm:text-base text-white">{item.place}</span>
                    <span className="bg-slate-700/80 text-cyan-300 font-mono px-2.5 py-1 rounded text-xs sm:text-sm font-bold">
                      {item.buses}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-6 sm:mb-8"
              >
                <PhoneCall className="h-7 w-7 sm:h-8 sm:w-8 text-teal-400 shrink-0" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-orbitron)" }}>
                  Contact Us
                </h2>
              </motion.div>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base">
                <p className="flex items-center gap-3">
                  <span className="font-semibold text-white w-16 sm:w-20 shrink-0">Email:</span>
                  <a
                    href="mailto:techbeta2k26@gmail.com"
                    className="hover:text-cyan-400 underline-offset-4 hover:underline transition-colors break-all"
                  >
                    techbeta2k26@gmail.com
                  </a>
                </p>
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-white w-16 sm:w-20 shrink-0 pt-1">Phone:</span>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
                    {["8667645067", "9385675451", "8300870670"].map((phone) => (
                      <motion.a
                        key={phone}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        href={`tel:${phone}`}
                        className="inline-block py-1.5 px-3 rounded-lg bg-slate-800/80 border border-slate-700 text-cyan-300 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all font-mono text-xs sm:text-sm font-medium shadow-sm"
                      >
                        {phone.slice(0, 5)} {phone.slice(5)}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
