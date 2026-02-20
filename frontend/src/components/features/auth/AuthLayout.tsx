"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuthScene3D } from "./AuthScene3D";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
}

export function AuthLayout({ title, subtitle, children, maxWidth = "sm" }: AuthLayoutProps) {
  const maxWidthClass = maxWidth === "lg" ? "max-w-[560px]" : maxWidth === "md" ? "max-w-[480px]" : "max-w-[440px]";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-dark-950">
      <AuthScene3D />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-dark-950/40 via-transparent to-dark-950/60" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-500/10 blur-[120px] rounded-full animate-glow-pulse" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-accent-indigo/8 blur-[100px] rounded-full animate-glow-pulse" style={{ animationDelay: "1s" }} />

      <motion.div
        className={`w-full ${maxWidthClass} relative z-10`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div
          className="text-center mb-8 sm:mb-10 flex flex-col items-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <Link href="/" className="group inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl">
              <img
                src="/logos/hisabkitab.png"
                alt="HisabKitab"
                className="h-20 w-20 sm:h-24 sm:w-24 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 brightness-110 drop-shadow-[0_0_20px_rgba(11,132,227,0.25)]"
              />
            </Link>
          </motion.div>
          <motion.h1
            variants={item}
            className="text-2xl sm:text-3xl font-black text-white mt-6 mb-2 tracking-tight bg-clip-text"
          >
            {title}
          </motion.h1>
          <motion.p variants={item} className="text-gray-500 font-medium text-xs sm:text-sm max-w-xs">
            {subtitle}
          </motion.p>
        </motion.div>

        {children}
      </motion.div>
    </div>
  );
}
