"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Wallet,
    Receipt,
    Target,
    Settings,
    LogOut,
    ChevronRight,
    Activity,
    Menu,
    X,
    Search,
    Bell
} from "lucide-react";
import { cn } from "../../lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Receipt, label: "Expenses", href: "/expenses" },
    { icon: Wallet, label: "Budgets", href: "/budgets" },
    { icon: Target, label: "Goals", href: "/goals" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);

    // Don't show sidebar on landing page or auth pages
    const noSidebarPages = ["/", "/login", "/register", "/about-us", "/terms-and-conditions", "/privacy-policy"];
    const isNoSidebarPage = noSidebarPages.includes(pathname);
    if (isNoSidebarPage) return null;

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-[60] p-2 bg-dark-800 border border-white/10 rounded-xl md:hidden"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <motion.aside
                initial={false}
                animate={{ width: isOpen ? 280 : 80 }}
                className={cn(
                    "fixed left-0 top-0 h-screen z-50 flex flex-col glass-dark border-r border-white/10 transition-all duration-300",
                    !isOpen && "items-center"
                )}
            >
                {/* Logo Section */}
                <div className={cn(
                    "p-6 mb-8 flex items-center",
                    !isOpen && "justify-center p-4",
                    isOpen && "justify-center"
                )}>
                    <img
                        src="/logos/hisabkitab.png"
                        alt="Logo"
                        className={cn(
                            "object-contain transition-all duration-300 brightness-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]",
                            isOpen ? "h-20 w-20" : "h-10 w-10"
                        )}
                    />
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block"
                            >
                                <div className={cn(
                                    "relative group flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300",
                                    isActive
                                        ? "bg-primary-500/10 text-primary-400"
                                        : "text-gray-400 hover:text-white hover:bg-white/5",
                                    !isOpen && "justify-center"
                                )}>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute left-0 w-1 h-6 bg-primary-500 rounded-full"
                                        />
                                    )}
                                    <item.icon size={22} className={cn(
                                        "transition-colors",
                                        isActive ? "text-primary-500" : "group-hover:text-white"
                                    )} />
                                    {isOpen && (
                                        <span className="font-medium">{item.label}</span>
                                    )}
                                    {isOpen && isActive && (
                                        <ChevronRight size={16} className="ml-auto opacity-50" />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section (Profile/Logout) */}
                <div className={cn(
                    "p-4 border-t border-white/10 mt-auto",
                    !isOpen && "flex flex-col items-center"
                )}>
                    {isOpen ? (
                        <div className="flex items-center gap-3 p-2 mb-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 p-[2px]">
                                <div className="h-full w-full rounded-full bg-dark-900 flex items-center justify-center overflow-hidden">
                                    <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">Adam R.</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Well-Spent</p>
                            </div>
                            <Bell size={16} className="text-gray-500 hover:text-white cursor-pointer" />
                        </div>
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-white/5 mb-4 flex items-center justify-center border border-white/10">
                            <Bell size={18} className="text-gray-400" />
                        </div>
                    )}

                    <button className={cn(
                        "w-full flex items-center gap-3 p-3.5 rounded-2xl text-gray-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all duration-300",
                        !isOpen && "justify-center"
                    )}>
                        <LogOut size={22} />
                        {isOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Backdrop for mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>
        </>
    );
};
