"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Hero3D } from "@/components/layout/Hero3D";
import { Shield, Zap, BarChart3, ChevronRight, Activity, ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <div className="relative min-h-screen bg-gray-950 overflow-hidden text-white selection:bg-primary-500/30">
            {/* Background 3D Scene */}
            <Hero3D />

            {/* Navigation Overlay */}
            <nav className="fixed top-0 w-full z-50 px-6 py-6 md:px-12 flex items-center justify-between backdrop-blur-md bg-gray-900/10 border-b border-white/5">
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-primary-600 rounded-lg shadow-lg shadow-primary-900/50 flex items-center justify-center">
                        <Activity size={18} className="text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter">Hisab<span className="text-primary-500">Kitab</span></span>
                </div>
                <div className="flex items-center space-x-8">
                    <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Sign In</Link>
                    <Link href="/register" className="px-6 py-2.5 bg-white text-gray-950 rounded-full text-xs font-black hover:bg-primary-500 hover:text-white transition-all">
                        Get Early Access
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto z-10">
                <div className="flex flex-col items-center text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center space-x-2"
                    >
                        <Zap size={14} className="text-primary-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary-200">The Future of Personal Finance is AI</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] max-w-4xl"
                    >
                        Your Wealth, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-600">Simulated by AI.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg md:text-xl max-w-2xl font-medium"
                    >
                        Precision expense tracking with real-time neural insights, voice commands, and predictive budgeting. Master your capital with elegance.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-6"
                    >
                        <Link
                            href="/register"
                            className="group relative px-8 py-4 bg-primary-600 rounded-2xl flex items-center space-x-3 hover:bg-primary-500 transition-all shadow-2xl shadow-primary-900/40"
                        >
                            <span className="font-bold tracking-tight">Begin Implementation</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="flex items-center space-x-2 text-gray-400 font-bold hover:text-white transition-colors">
                            <span>Watch Technical Demo</span>
                            <ChevronRight size={16} />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Features Preview */}
            <section className="relative py-20 px-6 z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Zap, title: "Neural Analytics", desc: "Automated categorization and spending patterns via Gemini AI." },
                        { icon: Shield, title: "Iron-clad Security", desc: "Enterprise-grade encryption for all your financial documentation." },
                        { icon: BarChart3, title: "Predictive Engines", desc: "Anticipate your monthly spending before it happens with 98% accuracy." }
                    ].map((feature, idx) => (
                        <div key={idx} className="p-8 rounded-[2rem] bg-gray-900/40 border border-white/5 backdrop-blur-md hover:bg-gray-900/60 transition-all hover:border-primary-500/20 group">
                            <div className="h-12 w-12 rounded-xl bg-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-500/10 transition-all">
                                <feature.icon size={24} className="text-primary-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Subtle Gradient Fog */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/10 blur-[150px] -z-10 rounded-full" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] -z-10 rounded-full" />
        </div>
    );
}
