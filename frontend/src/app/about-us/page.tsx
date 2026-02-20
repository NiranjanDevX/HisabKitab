"use client";

import React, { useState } from "react";
import Link from "next/link";
import { InfoPageLayout } from "@/components/layout";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

import {
    Users,
    ShieldCheck,
    Code2,
    Accessibility,
    Globe,
    Coins
} from "lucide-react";

export default function AboutUsPage() {
    const [isImageOpen, setIsImageOpen] = useState(false);

    const principles = [
        { icon: <Users size={20} className="text-primary-400" />, label: "User-first design" },
        { icon: <ShieldCheck size={20} className="text-emerald-400" />, label: "Privacy by default" },
        { icon: <Code2 size={20} className="text-indigo-400" />, label: "Open source" },
        { icon: <Accessibility size={20} className="text-orange-400" />, label: "Accessible" },
        { icon: <Globe size={20} className="text-blue-400" />, label: "Inclusivity" },
        { icon: <Coins size={20} className="text-yellow-400" />, label: "Cost-aware" }
    ];

    return (
        <InfoPageLayout>
            <motion.div
                initial="initial"
                animate="animate"
                variants={stagger}
                className="space-y-12"
            >
                <motion.section variants={fadeInUp}>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">About Us</h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                        HisabKitab is a modern, open-source expense management platform designed to help individuals track, understand, and improve their spending habits.
                    </p>
                </motion.section>

                <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-12 pt-12">
                    <div className="glass-card p-8 rounded-3xl">
                        <h2 className="text-2xl font-bold mb-4 text-primary-400">What is HisabKitab?</h2>
                        <p className="text-gray-400 leading-relaxed">
                            Built with a strong focus on simplicity, privacy, and accessibility, HisabKitab works across web and mobile platforms. We believe that financial clarity should be accessible to everyone.
                        </p>
                    </div>

                    <div className="glass-card p-8 rounded-3xl">
                        <h2 className="text-2xl font-bold mb-4 text-primary-400">Why HisabKitab?</h2>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex gap-3">
                                <span className="text-primary-500">•</span>
                                Simplify daily expense tracking
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary-500">•</span>
                                Provide clear financial visibility
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary-500">•</span>
                                Support independent living
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary-500">•</span>
                                Privacy-first AI insights
                            </li>
                        </ul>
                    </div>
                </motion.div>

                <motion.section variants={fadeInUp} className="pt-12">
                    <h2 className="text-3xl font-bold mb-8">Our Principles</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {principles.map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                                className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 flex flex-col items-center gap-4 text-center transition-colors"
                            >
                                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">{item.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                <motion.section variants={fadeInUp} className="pt-12">
                    <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        To make personal finance tracking simple, transparent, and accessible to everyone. We're building a tool that doesn't just record numbers, but helps you build a better relationship with your money.
                    </p>
                </motion.section>

                <motion.section variants={fadeInUp} className="pt-12 border-t border-white/5">
                    <div className="flex items-center gap-6">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsImageOpen(true)}
                            className="h-24 w-24 rounded-3xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center overflow-hidden cursor-zoom-in shadow-2xl shadow-primary-500/10"
                        >
                            <img src="/niranjan.jpeg" alt="Niranjan Sah" className="h-full w-full object-cover" />
                        </motion.div>
                        <div>
                            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Founded By</p>
                            <Link
                                href="https://niranjansah87.com.np/"
                                target="_blank"
                                className="text-2xl font-bold hover:text-primary-400 transition-colors"
                            >
                                Niranjan Sah
                            </Link>
                            <p className="text-sm text-gray-400 font-medium">Full Stack Developer</p>
                        </div>
                    </div>
                </motion.section>
            </motion.div>

            {/* Full Screen Image Modal */}
            <AnimatePresence>
                {isImageOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsImageOpen(false)}
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-20 overflow-hidden cursor-zoom-out"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative max-w-5xl max-h-full aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            <img
                                src="/niranjan.jpeg"
                                alt="Niranjan Sah"
                                className="w-full h-full object-cover"
                            />

                            {/* Close Button */}
                            <button
                                onClick={() => setIsImageOpen(false)}
                                className="absolute top-8 right-8 h-12 w-12 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors group"
                            >
                                <span className="text-2xl font-light group-hover:rotate-90 transition-transform">×</span>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </InfoPageLayout>
    );
}
