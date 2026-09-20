"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Who can participate in TECHBETA 2026 2.0?",
    a: "TECHBETA 2026 2.0 is open to all college students across the country. Both undergraduate and postgraduate students can participate."
  },
  {
    q: "Is there a registration fee?",
    a: "The registration fee is ₹200 per participant, which includes lunch. This is available through online registration only."
  },
  {
    q: "Is lunch provided during the event?",
    a: "Yes! Lunch is included in the ₹200 registration fee for all registered participants. It will be served at the college food court during the scheduled break."
  },
  {
    q: "How do I register for the event?",
    a: "Please register using the official registration link provided on the website. Online registration is the only valid method for participation."
  },
  {
    q: "What should I bring to the event?",
    a: "Please bring your college ID card, your QR registration confirmation, and any specific equipment required for your events (e.g., laptops for coding/technical competitions)."
  },
  {
    q: "Will certificates be provided?",
    a: "Yes, all participants will receive participation certificates. Winners will receive merit certificates along with prizes."
  },
  {
    q: "Where is the event venue and what is the reporting time?",
    a: "The symposium is hosted at the Conference Hall, St. Xavier's Catholic College of Engineering, Chunkankadai, Nagercoil. Reporting and registration desk check-in commences at 9:00 AM on October 13, 2026."
  },
  {
    q: "How many events can a participant register for?",
    a: "A participant can register for any 2 Technical events, and any non-technical events."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight" style={{ fontFamily: "var(--font-orbitron)" }}>
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-700 px-2">Everything you need to know about TECHBETA 2026 2.0.</p>
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              whileHover={{ scale: 1.008, transition: { duration: 0.15 } }}
              className="border border-slate-200/90 hover:border-blue-300 rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex items-center justify-between w-full p-4 sm:p-6 text-left focus:outline-none focus-visible:bg-slate-50 hover:bg-slate-50 transition-colors gap-4 cursor-pointer"
              >
                <span className="font-semibold text-sm sm:text-base text-slate-900 leading-snug">{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-slate-700 shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0 text-sm sm:text-base text-slate-700 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
