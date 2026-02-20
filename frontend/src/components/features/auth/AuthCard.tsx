"use client";

import React from "react";
import { motion } from "framer-motion";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative rounded-3xl overflow-hidden ${className}`}
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-3xl p-[1px] opacity-90 bg-flow animate-border-flow"
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(11,132,227,0.6), rgba(99,102,241,0.5), rgba(11,132,227,0.4), rgba(11,132,227,0.6))",
        }}
      >
        <div className="absolute inset-[1px] rounded-[22px] bg-dark-950" />
      </div>

      {/* Glass card */}
      <div className="relative rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/40">
        <div className="p-6 sm:p-8">{children}</div>
      </div>
    </motion.div>
  );
}
