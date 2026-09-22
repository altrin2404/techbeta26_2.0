"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

export function InteractiveBackground() {
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  
  // Use Framer Motion values instead of React state for 60fps animations without re-renders
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  // Scroll parallax transforms (lightweight and GPU accelerated)
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25, restDelta: 0.001 });

  const yOrb1 = useTransform(smoothProgress, [0, 1], [0, 600]);
  const yOrb2 = useTransform(smoothProgress, [0, 1], [0, -500]);
  const yOrb3 = useTransform(smoothProgress, [0, 1], [0, 800]);

  const rotateShape1 = useTransform(smoothProgress, [0, 1], [0, 260]);
  const rotateShape2 = useTransform(smoothProgress, [0, 1], [0, -320]);
  const scaleShape = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.25, 0.95]);

  useEffect(() => {
    // Only enable mouse spotlight on desktop pointer devices
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    setIsPointerDevice(isFinePointer);

    if (!isFinePointer) return;

    const handlePointerMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Subtle High-Tech Dot Matrix Pattern */}
      <div
        className="absolute inset-0 opacity-[0.14] sm:opacity-[0.22]"
        style={{
          backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* 2. Interactive Cursor Spotlight (Desktop only, 0 cost on mobile) */}
      {isPointerDevice && (
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-35 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
          style={{
            x: smoothMouseX,
            y: smoothMouseY,
            left: 0,
            top: 0,
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(147, 51, 234, 0.15) 45%, transparent 70%)",
            willChange: "transform",
          }}
        />
      )}

      {/* 3. Parallax Floating Gradient Mesh Orbs */}
      {/* Top Right Orb */}
      <motion.div
        style={{ y: yOrb1 }}
        className="hidden md:block absolute -top-20 -right-20 w-72 h-72 sm:w-[480px] sm:h-[480px] rounded-full bg-gradient-to-br from-blue-400/20 via-indigo-300/15 to-transparent blur-3xl"
      />

      {/* Mid Left Orb */}
      <motion.div
        style={{ y: yOrb2 }}
        className="hidden md:block absolute top-[35%] -left-24 w-64 h-64 sm:w-[420px] sm:h-[420px] rounded-full bg-gradient-to-tr from-cyan-400/15 via-teal-300/15 to-transparent blur-3xl"
      />

      {/* Lower Right Orb */}
      <motion.div
        style={{ y: yOrb3 }}
        className="hidden md:block absolute top-[65%] -right-24 w-72 h-72 sm:w-[450px] sm:h-[450px] rounded-full bg-gradient-to-tl from-purple-400/15 via-blue-400/10 to-transparent blur-3xl"
      />

      {/* 4. Geometric Floating Tech Shapes (Hidden or lightweight on mobile) */}
      {/* Tech Ring 1 (Top Left) */}
      <motion.div
        style={{ rotate: rotateShape1, scale: scaleShape }}
        className="hidden md:block absolute top-[12%] left-[4%] w-24 h-24 rounded-full border border-blue-400/20 border-dashed"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-400" />
      </motion.div>

      {/* Cyber Crosshair 1 (Right Mid) */}
      <motion.div
        style={{ rotate: rotateShape2 }}
        className="hidden sm:flex absolute top-[28%] right-[5%] items-center justify-center w-12 h-12 opacity-35"
      >
        <div className="w-8 h-px bg-indigo-500" />
        <div className="h-8 w-px bg-indigo-500 absolute" />
        <div className="w-4 h-4 rounded-full border border-indigo-500/50 absolute" />
      </motion.div>

      {/* Tech Polygon Ring 2 (Bottom Left) */}
      <motion.div
        style={{ rotate: rotateShape1 }}
        className="hidden lg:block absolute top-[62%] left-[3%] w-28 h-28 rounded-2xl border border-teal-400/20 border-dotted"
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-teal-400 shadow-sm" />
      </motion.div>

      {/* Cyber Crosshair 2 (Bottom Right) */}
      <motion.div
        style={{ rotate: rotateShape2 }}
        className="hidden md:flex absolute top-[80%] right-[6%] items-center justify-center w-10 h-10 opacity-30"
      >
        <div className="w-6 h-px bg-blue-500" />
        <div className="h-6 w-px bg-blue-500 absolute" />
      </motion.div>

      {/* Floating Cyber Plus Elements (Subtle micro-details) */}
      <div className="hidden sm:block absolute top-[22%] left-[15%] text-blue-400/30 text-xs font-mono font-bold animate-float">
        +
      </div>
      <div className="hidden sm:block absolute top-[48%] right-[12%] text-purple-400/30 text-xs font-mono font-bold animate-float-reverse">
        +
      </div>
      <div className="hidden sm:block absolute top-[72%] left-[10%] text-cyan-400/30 text-xs font-mono font-bold animate-float">
        +
      </div>
    </div>
  );
}
