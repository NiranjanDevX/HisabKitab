"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { ArrowRight, Terminal, PieChart, Shield, Instagram, Facebook, Twitter, Zap, CheckCircle, HelpCircle, MessageSquare, Send, Mail, User, TrendingDown, Target, Bell, XCircle, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import emailjs from '@emailjs/browser';
import { LandingNavbar, LandingFooter } from "@/components/layout";

export default function LandingPage() {
    const constraintsRef = useRef(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [isSending, setIsSending] = useState(false);
    const [sentStatus, setSentStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [showToast, setShowToast] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current) return;

        setIsSending(true);
        setSentStatus('idle');

        try {
            // Fetch all these from env file
            await emailjs.sendForm(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '', // Service ID
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '', // Template ID
                formRef.current,
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '' // Public Key
            );
            setSentStatus('success');
            setShowToast(true);
            formRef.current.reset();
            // Automatically hide toast after 5 seconds
            setTimeout(() => setShowToast(false), 5000);
        } catch (error) {
            console.error('EmailJS Error:', error);
            setSentStatus('error');
        } finally {
            setIsSending(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 40, opacity: 0, filter: "blur(10px)" },
        visible: {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
        },
    };

    const { scrollYProgress } = useScroll();

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary-500/30 overflow-x-hidden">
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary-500 origin-left z-[110]"
                style={{ scaleX: scrollYProgress }}
            />

            {/* Custom Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-10 right-10 z-[200] flex items-center gap-4 bg-[#0a0a0a] border border-emerald-500/20 rounded-2xl p-6 shadow-2xl backdrop-blur-xl"
                    >
                        <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm tracking-tight">Message Sent Successfully!</p>
                            <p className="text-gray-500 text-xs">We'll get back to you shortly.</p>
                        </div>
                        <button
                            onClick={() => setShowToast(false)}
                            className="ml-4 text-gray-600 hover:text-white transition-colors"
                        >
                            <XCircle size={18} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-900/10 blur-[180px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1.1, 1, 1.1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-indigo/10 blur-[150px] rounded-full"
                />
            </div>

            <LandingNavbar />

            {/* Hero Section */}
            <main className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={containerVariants}
                >
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-left"
                        >
                            <motion.h1
                                variants={itemVariants}
                                className="text-7xl md:text-[5.5rem] font-bold tracking-tight mb-8 leading-[0.9] text-white"
                            >
                                Manage Your <br />
                                <span className="text-white">Expenses Easily</span> <br />
                                With <span className="text-primary-500">HisabKi</span><span className="text-primary-400">tab</span>
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                className="text-gray-400 text-lg md:text-xl font-normal max-w-xl mb-12 leading-relaxed"
                            >
                                Hisab Kitab is an intuitive expense tracking application designed to simplify your financial management through advanced automation and predictive analytics.
                            </motion.p>

                            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6">
                                <Link href="/register" className="w-full sm:w-auto">
                                    <Button className="w-full sm:w-56 h-14 rounded-xl text-base font-bold shadow-2xl shadow-primary-600/30 bg-primary-500 hover:bg-primary-600">
                                        Let's Talk
                                    </Button>
                                </Link>
                                <Link href="#demo" className="w-full sm:w-auto">
                                    <span className="text-base font-bold text-white hover:text-primary-400 transition-colors cursor-pointer flex items-center gap-2">
                                        View Demo <ArrowRight size={20} />
                                    </span>
                                </Link>
                            </motion.div>


                        </motion.div>

                        {/* Sophisticated Mockup */}
                        <motion.div
                            ref={constraintsRef}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="relative"
                        >
                            {/* Background glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none" />

                            <div className="relative z-10 grid grid-cols-12 gap-4">
                                {/* Analytics Chart */}
                                <motion.div
                                    drag
                                    dragConstraints={constraintsRef}
                                    whileDrag={{ scale: 1.02, zIndex: 50 }}
                                    whileHover={{ y: -10, cursor: "grab" }}
                                    className="col-span-8 col-start-5 bg-white rounded-3xl p-6 shadow-2xl border border-black/5"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-black font-bold">Analytics</h4>
                                        <div className="flex gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary-400" />
                                            <div className="h-2 w-2 rounded-full bg-gray-200" />
                                        </div>
                                    </div>
                                    <div className="h-40 flex items-end justify-between gap-2">
                                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ delay: 1 + i * 0.1, duration: 1 }}
                                                className={`w-full rounded-t-md ${i % 2 === 0 ? 'bg-primary-500/80' : 'bg-primary-200'}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span>Jan</span>
                                        <span>Feb</span>
                                        <span>Mar</span>
                                        <span>Apr</span>
                                    </div>
                                </motion.div>

                                {/* Total Expenses Card */}
                                <motion.div
                                    drag
                                    dragConstraints={constraintsRef}
                                    whileDrag={{ scale: 1.05, zIndex: 50 }}
                                    whileHover={{ cursor: "grab" }}
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                    className="col-span-6 -mt-32 bg-[#b3c9b3] rounded-2xl p-6 shadow-xl"
                                >
                                    <p className="text-[#4a5d4a] text-xs font-bold mb-1">Total Expenses</p>
                                    <h3 className="text-[#1a2e1a] text-2xl font-black">Rs. 1,220.00</h3>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-black/5 rounded text-[10px] font-bold text-[#4a5d4a]">-10%</span>
                                        <span className="text-[10px] font-bold text-[#4a5d4a]/60 uppercase">This month</span>
                                    </div>
                                </motion.div>

                                {/* Credit Card Floating */}
                                <motion.div
                                    drag
                                    dragConstraints={constraintsRef}
                                    whileDrag={{ scale: 1.05, zIndex: 50 }}
                                    whileHover={{ cursor: "grab" }}
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="col-span-5 absolute -left-12 bottom-20 bg-gradient-to-br from-[#c4d7d1] to-[#a3b8b1] rounded-2xl p-5 shadow-2xl border border-white/20 w-64 backdrop-blur-md"
                                >
                                    <div className="flex justify-between items-start mb-10">
                                        <span className="text-[#3c4d47] font-black italic text-sm">VISA</span>
                                        <div className="h-4 w-6 bg-[#3c4d47]/20 rounded-sm" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="text-[#3c4d47] font-mono tracking-widest text-sm">**** **** **** 7602</div>
                                        <div className="flex justify-between">
                                            <div className="text-[8px] font-black text-[#3c4d47]/60 uppercase">
                                                Cardholder Name<br />
                                                <span className="text-[10px] text-[#3c4d47]">NIRANJAN SAH</span>
                                            </div>
                                            <div className="text-[8px] font-black text-[#3c4d47]/60 uppercase text-right">
                                                Expiry<br />
                                                <span className="text-[10px] text-[#3c4d47]">12/2026</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Total Revenue Card */}
                                <motion.div
                                    drag
                                    dragConstraints={constraintsRef}
                                    whileDrag={{ scale: 1.05, zIndex: 50 }}
                                    whileHover={{ cursor: "grab" }}
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 1.4 }}
                                    className="col-span-6 col-start-7 -mt-12 bg-[#ff9b71] rounded-2xl p-6 shadow-xl relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-150 transition-transform duration-700">
                                        <ArrowRight className="-rotate-45" size={48} />
                                    </div>
                                    <p className="text-[#5c3a2a] text-xs font-bold mb-1">Total Revenue</p>
                                    <h3 className="text-[#2e1d15] text-2xl font-black">Rs. 8,675.00</h3>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-black/5 rounded text-[10px] font-bold text-[#5c3a2a]">+36%</span>
                                        <span className="text-[10px] font-bold text-[#5c3a2a]/60 uppercase">This month</span>
                                    </div>
                                </motion.div>

                                {/* Transactions List */}
                                <motion.div
                                    drag
                                    dragConstraints={constraintsRef}
                                    whileDrag={{ scale: 1.02, zIndex: 50 }}
                                    whileHover={{ cursor: "grab" }}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.6 }}
                                    className="col-span-7 col-start-6 mt-4 bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10"
                                >
                                    <h4 className="text-white font-bold mb-4 flex items-center justify-between">
                                        Latest Transactions
                                        <span className="text-[10px] font-black text-primary-400 uppercase">View All</span>
                                    </h4>
                                    <div className="space-y-4">
                                        {[
                                            { title: "Income: Salary Oct", status: "Successfully", amount: "+Rs. 1200", color: "bg-emerald-500" },
                                            { title: "Electric Bill", status: "Successfully", amount: "-Rs. 480", color: "bg-orange-500" }
                                        ].map((tx, i) => (
                                            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-8 w-8 rounded-lg ${tx.color}/20 flex items-center justify-center text-xs text-white font-bold`}>
                                                        Rs
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-white">{tx.title}</p>
                                                        <p className="text-[10px] text-gray-500">{tx.status}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-xs font-black ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-white'}`}>
                                                    {tx.amount}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>

            {/* How It Works Section */}
            <section id="how-it-works" className="relative z-10 py-24 bg-[#050505]">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Simple Process. <br />Powerful Results.</h2>
                        <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">Get your finances in order in three simple steps. No complex spreadsheets needed.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent -translate-y-1/2 z-0" />

                        {[
                            { step: "01", title: "Record", desc: "Speak or type your daily expenses naturally.", icon: <MessageSquare size={32} /> },
                            { step: "02", title: "Analyze", desc: "Our AI brain categorizes and tags everything.", icon: <Zap size={32} /> },
                            { step: "03", title: "Refine", desc: "Get visual reports and save more money.", icon: <CheckCircle size={32} /> }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="relative z-10 text-center group"
                            >
                                <div className="h-20 w-20 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-8 group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-500 group-hover:rotate-[10deg] shadow-2xl">
                                    <div className="group-hover:text-white transition-colors text-primary-500">{item.icon}</div>
                                </div>
                                <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-4 text-4xl font-black text-white/5 select-none">{item.step}</div>
                                <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
                                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Smart Insights Section */}
            <section id="features" className="relative z-10 py-24 bg-[#050505]">
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] bg-primary-500/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-24 items-center mb-24">
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">Smarter Insights <br />For Better Future.</h2>
                            <div className="space-y-8">
                                {[
                                    { title: "Voice & Text AI", desc: "Record your expenses by just talking to the app.", icon: <Terminal className="text-primary-400" /> },
                                    { title: "Predictive Budgeting", desc: "Know how much you'll spend before the month starts.", icon: <PieChart className="text-indigo-400" /> },
                                    { title: "Secure & Encrypted", desc: "Your financial privacy is our top priority.", icon: <Shield className="text-emerald-400" /> }
                                ].map((feature, i) => (
                                    <div key={feature.title} className="flex gap-6 group">
                                        <div className="h-12 w-12 shrink-0 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white transition-colors duration-500">
                                            <div className="group-hover:text-black transition-colors">{feature.icon}</div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold mb-2 group-hover:text-primary-400 transition-colors">{feature.title}</h4>
                                            <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="relative h-[500px] w-full max-w-md mx-auto">
                                {/* Floating Insight Cards Replacement */}
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-0 right-0 w-64 p-6 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl z-20"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-10 w-10 rounded-2xl bg-primary-500/20 flex items-center justify-center text-primary-400">
                                            <TrendingDown size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Spending Trend</p>
                                            <p className="font-bold text-emerald-400">-12.5% this month</p>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "70%" }}
                                            className="h-full bg-primary-500"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 20, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute top-32 left-0 w-64 p-6 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl z-10"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                            <Target size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Savings Goal</p>
                                            <p className="font-bold text-white">Target Reached!</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400">You saved Rs. 5,000 more than last month. Keep it up!</p>
                                </motion.div>

                                <motion.div
                                    animate={{ x: [0, 15, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                                    className="absolute bottom-0 right-10 w-64 p-6 bg-[#0a0a0a] border border-primary-500/20 rounded-3xl shadow-2xl z-30"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-8 w-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                                            <Bell size={16} />
                                        </div>
                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Now</span>
                                    </div>
                                    <p className="text-xs font-bold text-white mb-1">Unusual Activity Detected</p>
                                    <p className="text-[10px] text-gray-500">You spent Rs. 2,500 on 'Dining' which is 2x your average.</p>
                                </motion.div>

                                {/* Background Glows */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/10 blur-3xl rounded-full -z-10" />
                                <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full -z-10" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Security & Trust Section */}
            <section className="relative z-10 pt-24 pb-16 bg-[#050505] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="order-2 lg:order-1"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative h-[400px] bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] flex items-center justify-center overflow-hidden">
                                    {/* Abstract Security Visual */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
                                    <motion.div
                                        animate={{
                                            rotate: [0, 360],
                                            scale: [0.8, 1, 0.8]
                                        }}
                                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                        className="w-64 h-64 border-2 border-primary-500/20 border-dashed rounded-full flex items-center justify-center"
                                    >
                                        <motion.div
                                            animate={{ rotate: [360, 0] }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                            className="w-48 h-48 border border-indigo-500/30 border-dashed rounded-full flex items-center justify-center text-primary-500"
                                        >
                                            <Shield size={64} className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                        </motion.div>
                                    </motion.div>

                                    {/* Scanning Line */}
                                    <motion.div
                                        animate={{ top: ['0%', '100%', '0%'] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute left-0 right-0 h-1 bg-primary-500/50 blur-[2px] z-20"
                                    />

                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        System Encrypted
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="order-1 lg:order-2"
                        >
                            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[0.9]">
                                Bulletproof Security. <br />
                                <span className="text-white/40">Total Privacy.</span>
                            </h2>
                            <p className="text-gray-500 text-lg mb-12 max-w-xl leading-relaxed">
                                We believe your financial data should be your secret. Our architecture is built from the ground up to ensure privacy, integrity, and total user control.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: "Military-Grade Encryption", desc: "AES-256 standards keep your data invisible to everyone but you.", icon: <Shield size={20} className="text-primary-400" /> },
                                    { title: "Zero Data Sharing", desc: "We never sell your behavioral data. Your habits are your own.", icon: <CheckCircle size={20} className="text-emerald-400" /> },
                                    { title: "Instant Portability", desc: "Export or delete your entire data history with a single tap.", icon: <Zap size={20} className="text-orange-400" /> }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 10 }}
                                        className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.04]"
                                    >
                                        <div className="shrink-0 mt-1">{item.icon}</div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section id="faq" className="relative z-10 py-24 bg-[#050505]">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Expertly Answered. <br /><span className="text-white/40">Still Curious?</span></h2>
                        <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto">Everything you need to know about your financial sidekick. If we missed something, just reach out below.</p>
                    </motion.div>

                    <div className="space-y-4">
                        {[
                            { q: "Is Hisab Kitab completely free?", a: "Yes! Currently, Hisab Kitab is free to use for all individuals. We believe financial clarity should be accessible to everyone without hidden costs." },
                            { q: "How secure is my financial data?", a: "Extremely. We follow military-grade AES-256 encryption. Your data is stored in isolated vaults and is never sold or shared with third parties. You are the sole owner of your financial habits." },
                            { q: "Can I export my data history?", a: "Absolutely. You can export your monthly and yearly reports in PDF or CSV formats anytime with a single tap. Your data remains portable, always." },
                            { q: "Do you provide automated insights?", a: "Yes! Our AI engine analyzes your spending patterns to provide predictive budgeting, unusual activity alerts, and personalized saving tips." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`group overflow-hidden rounded-[2rem] border transition-all duration-500 ${activeFaq === i ? 'bg-white/[0.04] border-primary-500/30' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                            >
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors duration-500 ${activeFaq === i ? 'bg-primary-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-white/5 text-primary-400 group-hover:bg-white/10'}`}>
                                            <HelpCircle size={22} />
                                        </div>
                                        <h4 className={`text-xl font-bold tracking-tight transition-colors ${activeFaq === i ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{item.q}</h4>
                                    </div>
                                    <div className={`h-8 w-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 ${activeFaq === i ? 'rotate-180 bg-white/10' : ''}`}>
                                        {activeFaq === i ? <Minus size={16} /> : <Plus size={16} />}
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {activeFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <div className="px-8 pb-8 pl-[6rem]">
                                                <p className="text-gray-500 leading-relaxed text-lg max-w-2xl">{item.a}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Contact Section */}
            <section id="about" className="mt-12 mb-24 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mb-8">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
                            Get In Touch
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[0.9]">
                            Have Questions? <br />
                            <span className="text-white/40">Let's Connect.</span>
                        </h2>
                        <p className="text-gray-500 text-lg mb-12 max-w-xl leading-relaxed">
                            Whether you need help with your account or want to suggest a new feature, our team is always ready to assist you. High-performance finance tracking at your fingertips.
                        </p>

                        <div className="flex flex-col gap-6">
                            {[
                                { icon: <Mail size={18} />, label: "Email Support", value: "support@hisabkitab.me", color: "primary" },
                                { icon: <Twitter size={18} />, label: "Twitter / X", value: "@hisabkitab_np", color: "indigo" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 10 }}
                                    className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-6 group cursor-pointer hover:bg-white/[0.04] transition-all max-w-sm"
                                >
                                    <div className={`h-12 w-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">{item.label}</p>
                                        <p className="text-sm font-bold text-white tracking-wide">{item.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Form Card Accent */}
                        <div className="absolute -inset-4 bg-primary-500/5 blur-3xl opacity-50 pointer-events-none" />

                        <div className="relative glass-dark rounded-[2.5rem] p-8 md:p-10 border border-white/10 shadow-2xl transition-all hover:border-white/20">
                            <form ref={formRef} className="space-y-6" onSubmit={handleSendEmail}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Full Name</label>
                                        <div className="relative group/input">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-primary-400 transition-colors" size={16} />
                                            <input name="from_name" required type="text" placeholder="John Doe" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-8 text-sm font-bold placeholder-gray-800 focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.05] transition-all" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email</label>
                                        <div className="relative group/input">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-primary-400 transition-colors" size={16} />
                                            <input name="from_email" required type="email" placeholder="john@example.com" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-8 text-sm font-bold placeholder-gray-800 focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.05] transition-all" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Message</label>
                                    <textarea name="message" required rows={3} placeholder="How can we help you?" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-8 text-sm font-bold placeholder-gray-800 focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.05] transition-all resize-none" />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSending}
                                    className="w-full h-16 rounded-2xl bg-primary-500 hover:bg-primary-600 shadow-xl shadow-primary-500/20 group/btn overflow-hidden relative"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3 text-sm font-black tracking-widest uppercase">
                                        {isSending ? 'Sending...' : 'Send Message'}
                                        <Send size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                </Button>

                                {sentStatus === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest pt-2"
                                    >
                                        <CheckCircle size={14} /> Message sent successfully!
                                    </motion.div>
                                )}
                                {sentStatus === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center text-rose-500 text-[10px] font-black uppercase tracking-widest pt-2"
                                    >
                                        Failed to send message. Please try again.
                                    </motion.div>
                                )}
                            </form>
                        </div>
                    </motion.div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
