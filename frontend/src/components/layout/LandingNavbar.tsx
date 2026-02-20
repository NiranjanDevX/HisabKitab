"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export const LandingNavbar: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 right-0 z-[100] border-b border-white/[0.03] bg-[#050505]/60 backdrop-blur-xl">
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-between px-8 max-w-7xl mx-auto h-20"
            >
                <Link href="/" className="group flex items-center h-full w-32">
                    <img
                        src="/logos/hisabkitab.png"
                        alt="Logo"
                        className="h-full w-full object-contain scale-[1.0] transition-all duration-500 group-hover:scale-[1.1] brightness-125 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                    />
                </Link>

                <nav className="hidden lg:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">
                    <Link href="/#features" className="hover:text-white transition-all hover:tracking-[0.4em]">Service</Link>
                    <Link href="/#how-it-works" className="hover:text-white transition-all hover:tracking-[0.4em]">Features</Link>
                    <Link href="/about-us" className="hover:text-white transition-all hover:tracking-[0.4em]">About Us</Link>
                </nav>

                <div className="flex items-center gap-8">
                    <Link href="/login" className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors">Log In</Link>
                    <Link href="/register">
                        <Button variant="outline" className="px-8 py-2.5 rounded-lg text-[12px] font-black uppercase tracking-widest border-primary-500/50 text-primary-400 hover:bg-primary-500 hover:text-white transition-all">
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </motion.header>
        </div>
    );
};
