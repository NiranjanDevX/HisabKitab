"use strict";

import { MainHero } from "@/components/three/HeroScene";
import { FeatureSection } from "@/components/layout/FeatureSection";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <MainHero />
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    Welcome to&nbsp;
                    <code className="font-bold">HisabKitab</code>
                </p>
            </div>

            <FeatureSection />

            <footer className="mt-20 py-10 border-t border-white/10 w-full text-center text-gray-400">
                <p>© 2026 HisabKitab - Modern Expense Management</p>
            </footer>
        </main>
    );
}
