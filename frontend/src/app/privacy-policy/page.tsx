"use client";

import React from "react";
import { InfoPageLayout } from "@/components/layout";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Trash2 } from "lucide-react";

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

export default function PrivacyPage() {
    return (
        <InfoPageLayout>
            <motion.div
                initial="initial"
                animate="animate"
                variants={stagger}
                className="space-y-12"
            >
                <motion.section variants={fadeInUp}>
                    <p className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em] mb-4">Your Trust, Our Priority</p>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">Privacy Policy</h1>
                    <p className="text-gray-500 text-sm italic">Last updated: 2026</p>
                </motion.section>

                <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-8 pt-12">
                    {[
                        {
                            icon: <Shield className="text-emerald-400" />,
                            title: "Data Security",
                            desc: "Data is stored securely using industry-standard practices. Passwords are hashed and never stored in plain text."
                        },
                        {
                            icon: <Lock className="text-primary-400" />,
                            title: "Privacy by Design",
                            desc: "We collect only what's necessary: account info, expense data, and required metadata."
                        },
                        {
                            icon: <Eye className="text-indigo-400" />,
                            title: "Transparency",
                            desc: "As an open-source project, our system behavior is transparent and auditable by everyone."
                        },
                        {
                            icon: <Trash2 className="text-rose-400" />,
                            title: "Right to Deletion",
                            desc: "You may delete your account and data at any time. Deleted data is permanently removed."
                        }
                    ].map((item, i) => (
                        <div key={i} className="glass-card p-8 rounded-3xl">
                            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </motion.div>

                <div className="space-y-12 pt-12">
                    <motion.section variants={fadeInUp}>
                        <h2 className="text-3xl font-bold mb-6">How We Use Your Information</h2>
                        <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
                            <p>We use your information to provide core expense tracking functionality, generate analytics, improve system performance, and maintain platform security.</p>
                            <p>Sensitive personal data is never shared with third parties. AI providers process limited text data only when requested by you.</p>
                        </div>
                    </motion.section>

                    <motion.section variants={fadeInUp} className="bg-emerald-500/5 border border-emerald-500/10 p-10 rounded-[2.5rem]">
                        <h2 className="text-2xl font-bold mb-4 text-emerald-400 uppercase tracking-tight">No Cookies, No Tracking</h2>
                        <p className="text-gray-400 mb-0">
                            HisabKitab does not use third-party tracking or advertising cookies. We respect your digital space.
                        </p>
                    </motion.section>
                </div>
            </motion.div>
        </InfoPageLayout>
    );
}
