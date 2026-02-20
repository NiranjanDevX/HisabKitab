"use client";

import React from "react";
import { motion, useScroll } from "framer-motion";
import { LandingNavbar } from "./LandingNavbar";
import { LandingFooter } from "./LandingFooter";

interface InfoPageLayoutProps {
    children: React.ReactNode;
}

export const InfoPageLayout: React.FC<InfoPageLayoutProps> = ({ children }) => {
    const { scrollYProgress } = useScroll();

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary-500/30 overflow-x-hidden">
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary-500 origin-left z-[110]"
                style={{ scaleX: scrollYProgress }}
            />

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-900/10 blur-[180px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-indigo/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[30%] left-[40%] w-[20%] h-[20%] bg-primary-500/5 blur-[120px] rounded-full" />
            </div>

            <LandingNavbar />

            <main className="relative z-10 pt-44 pb-40 px-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    {children}
                </motion.div>
            </main>

            <LandingFooter />
        </div>
    );
};
