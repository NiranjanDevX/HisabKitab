"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter } from "lucide-react";

export const LandingFooter: React.FC = () => {
    return (
        <footer className="relative z-10 py-6 px-8 border-t border-white/[0.03] bg-[#050505]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">
                    © 2026 HISABKITAB. ALL RIGHTS RESERVED.
                </p>

                <nav className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms</Link>
                    <Link href="/about-us" className="hover:text-white transition-colors">About Us</Link>
                </nav>

                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500">
                    <div className="flex items-center gap-2">
                        <span className="text-white/20">BY</span>
                        <Link
                            href="https://niranjansah87.com.np/"
                            target="_blank"
                            className="text-white hover:text-primary-400 transition-colors underline underline-offset-8 decoration-white/10 hover:decoration-primary-400"
                        >
                            NIRANJAN SAH
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {[
                            { icon: <Instagram size={14} />, href: "#" },
                            { icon: <Twitter size={14} />, href: "#" }
                        ].map((social, i) => (
                            <Link
                                key={i}
                                href={social.href}
                                className="text-gray-600 hover:text-white transition-all hover:scale-110"
                            >
                                {social.icon}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};
