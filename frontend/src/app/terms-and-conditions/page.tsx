"use client";

import React from "react";
import { InfoPageLayout } from "@/components/layout";
import { motion } from "framer-motion";

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

export default function TermsPage() {
    const sections = [
        {
            title: "1. About the Service",
            content: "HisabKitab is an open-source personal expense management platform that helps users track, analyze, and manage daily expenses. The platform may include optional AI-assisted features for categorization, summaries, and insights."
        },
        {
            title: "2. Eligibility",
            content: "You must be at least 16 years old to use HisabKitab. You are responsible for ensuring that your use of the service complies with local laws."
        },
        {
            title: "3. User Responsibilities",
            content: "You agree to provide accurate information, use the platform only for lawful purposes, and not misuse, abuse, or attempt to exploit the system. You are solely responsible for the data you enter."
        },
        {
            title: "4. AI-Assisted Features",
            content: "AI features are provided on a best-effort basis. Outputs may be inaccurate or incomplete. Users must review and confirm all AI-generated suggestions. HisabKitab is not responsible for financial decisions made based on AI outputs."
        },
        {
            title: "5. Data Ownership",
            content: "You retain full ownership of your data. HisabKitab does not claim ownership of user-entered financial data. You may export or delete your data at any time."
        },
        {
            title: "6. Limitation of Liability",
            content: "HisabKitab is provided 'as is' without warranties of any kind. The creators shall not be liable for any direct or indirect damages arising from the use of the platform."
        }
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
                    <p className="text-primary-500 font-black text-xs uppercase tracking-[0.3em] mb-4">Legal Framework</p>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">Terms & Conditions</h1>
                    <p className="text-gray-500 text-sm italic">Last updated: 2026</p>
                </motion.section>

                <div className="space-y-16 pt-12">
                    {sections.map((section, i) => (
                        <motion.div key={i} variants={fadeInUp} className="group">
                            <h2 className="text-2xl font-bold mb-6 group-hover:text-primary-400 transition-colors uppercase tracking-tight">{section.title}</h2>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div variants={fadeInUp} className="pt-20 border-t border-white/5">
                    <div className="glass-card p-10 rounded-[2.5rem] border-primary-500/10">
                        <h3 className="text-xl font-bold mb-4">Questions?</h3>
                        <p className="text-gray-400 mb-0">
                            For questions regarding these Terms, please refer to our project repository or contact support.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </InfoPageLayout>
    );
}
