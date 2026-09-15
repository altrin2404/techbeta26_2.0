"use client";

import { Users, PhoneCall, Bus } from "lucide-react";

export function TeamAndContact() {
  return (
    <section id="contact" className="w-full py-16 md:py-24 bg-slate-900 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">

          {/* Team Section */}
          <div>
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <Users className="h-7 w-7 sm:h-8 sm:w-8 text-blue-400 shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-orbitron)" }}>Meet the Team</h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-5 sm:p-6 rounded-2xl">
                <p className="text-blue-400 font-semibold mb-1 text-xs sm:text-sm uppercase tracking-wider">Convener</p>
                <p className="text-lg sm:text-xl font-bold text-white">Dr. Suja A. Alex</p>
                <p className="text-slate-400 text-sm sm:text-base">Associate Professor &amp; Hod-IT</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-5 sm:p-6 rounded-2xl">
                <p className="text-teal-400 font-semibold mb-1 text-xs sm:text-sm uppercase tracking-wider">Faculty Advisor-BRIGITZ</p>
                <p className="text-lg sm:text-xl font-bold text-white">Er. P. Agnes Alex Rathy</p>
                <p className="text-slate-400 text-sm sm:text-base">Assistant Professor-IT</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-5 sm:p-6 rounded-2xl">
                  <p className="text-purple-400 font-semibold mb-1 text-xs sm:text-sm uppercase tracking-wider">Secretary</p>
                  <p className="text-base sm:text-lg font-bold text-white">Mr. A. Altrin Benser</p>
                  <p className="text-slate-400 text-xs sm:text-sm">Final Year-IT</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-5 sm:p-6 rounded-2xl">
                  <p className="text-rose-400 font-semibold mb-1 text-xs sm:text-sm uppercase tracking-wider">Treasurer</p>
                  <p className="text-base sm:text-lg font-bold text-white">Ms. C. S. Absara</p>
                  <p className="text-slate-400 text-xs sm:text-sm">Final Year-IT</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Bus */}
          <div className="space-y-8 sm:space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <Bus className="h-7 w-7 sm:h-8 sm:w-8 text-blue-400 shrink-0" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-orbitron)" }}>Routes &amp; Bus Numbers</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-sm sm:text-base text-white">Nagercoil</span>
                  <span className="bg-slate-700 text-slate-300 px-2.5 py-1 rounded text-xs sm:text-sm font-medium">17, 22</span>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-sm sm:text-base text-white">Kanyakumari</span>
                  <span className="bg-slate-700 text-slate-300 px-2.5 py-1 rounded text-xs sm:text-sm font-medium">1</span>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-sm sm:text-base text-white">Marthandam</span>
                  <span className="bg-slate-700 text-slate-300 px-2.5 py-1 rounded text-xs sm:text-sm font-medium">3, 4, 6, 11, 14</span>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-sm sm:text-base text-white">Kulasekharam</span>
                  <span className="bg-slate-700 text-slate-300 px-2.5 py-1 rounded text-xs sm:text-sm font-medium">8, 12</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <PhoneCall className="h-7 w-7 sm:h-8 sm:w-8 text-teal-400 shrink-0" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-orbitron)" }}>Contact Us</h2>
              </div>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base">
                <p className="flex items-center gap-3">
                  <span className="font-semibold text-white w-16 sm:w-20 shrink-0">Email:</span>
                  <a href="mailto:techbeta2k26@gmail.com" className="hover:text-blue-400 transition-colors break-all">techbeta2k26@gmail.com</a>
                </p>
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-white w-16 sm:w-20 shrink-0 pt-1">Phone:</span>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
                    <a href="tel:8667645067" className="inline-block py-1 px-2.5 rounded-lg bg-slate-800/60 border border-slate-700 hover:text-blue-400 hover:border-blue-500/50 transition-colors">86676 45067</a>
                    <a href="tel:9385675451" className="inline-block py-1 px-2.5 rounded-lg bg-slate-800/60 border border-slate-700 hover:text-blue-400 hover:border-blue-500/50 transition-colors">93856 75451</a>
                    <a href="tel:8300870670" className="inline-block py-1 px-2.5 rounded-lg bg-slate-800/60 border border-slate-700 hover:text-blue-400 hover:border-blue-500/50 transition-colors">83008 70670</a>
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
