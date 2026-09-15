"use client";

import Link from "next/link";
import { Menu, Zap, X, Calendar, Star, HelpCircle, PhoneCall, ChevronRight, MapPin } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const navLinks = [
    { name: "Schedule", href: "#schedule", icon: Calendar },
    { name: "Events", href: "#events", icon: Star },
    { name: "Venue", href: "#venue", icon: MapPin },
    { name: "FAQ", href: "#faq", icon: HelpCircle },
    { name: "Contact", href: "#contact", icon: PhoneCall }
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setIsMobileMenuOpen(false);

      if (href === "#register") {
        window.dispatchEvent(new CustomEvent("open-registration"));
      }

      const targetId = href.replace("#", "");
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const navOffset = 85;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        window.history.pushState(null, "", href);

        if (href === "#register") {
          setTimeout(() => {
            const firstInput = document.getElementById("first-participant-name");
            firstInput?.focus({ preventScroll: true });
          }, 450);
        }
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center w-full pt-3 sm:pt-4 md:pt-6 transition-all duration-300 px-3 sm:px-4 ${isScrolled ? 'pb-3 sm:pb-4' : ''}`}
      >
        <div
          className={`w-full max-w-5xl flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border transition-all duration-300 ${isScrolled
              ? "bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
              : "bg-white/50 backdrop-blur-md border-white/40 shadow-sm"
            }`}
        >
          <Link href="/" className="flex items-center space-x-2 group relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
            <span className="relative inline-block font-black text-lg sm:text-xl md:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-500">
              TechBETA 2026 2.0
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className="px-4 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="#register"
              onClick={(e) => handleScroll(e, "#register")}
              className="hidden md:flex items-center gap-2 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-6 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="h-4 w-4 fill-white" />
              Register Now
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors bg-slate-50 border border-slate-200"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-2xl flex flex-col md:hidden overflow-hidden"
          >
            {/* Background glowing orbs */}
            <div className="absolute top-20 left-10 w-40 h-40 bg-blue-400/20 blur-[60px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-400/20 blur-[60px] rounded-full pointer-events-none"></div>

            <div className="flex justify-between items-center px-6 py-6 border-b border-slate-100 relative z-10">
              <span className="font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-500">
                TechBETA 2026 2.0
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col px-6 py-8 gap-4 overflow-y-auto relative z-10 h-full">
              <div className="flex flex-col gap-3 flex-grow">
                {navLinks.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={(e) => handleScroll(e, item.href)}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 active:scale-[0.98] transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors group-hover:translate-x-1" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-auto pb-4"
              >
                <Link
                  href="#register"
                  onClick={(e) => handleScroll(e, "#register")}
                  className="flex items-center justify-center gap-2 w-full h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 px-6 text-lg font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Zap className="h-6 w-6 fill-white" />
                  Register Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
