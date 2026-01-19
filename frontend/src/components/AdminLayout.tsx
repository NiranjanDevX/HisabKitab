"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    History,
    Settings,
    ShieldCheck,
    LogOut,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && (!user || !user.is_admin)) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user || !user.is_admin) {
        if (pathname === '/login') return <main>{children}</main>;
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    const navItems = [
        { name: 'Overview', href: '/', icon: LayoutDashboard },
        { name: 'User Management', href: '/users', icon: Users },
        { name: 'System Logs', href: '/events', icon: History },
        { name: 'Global Settings', href: '/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-950 flex overflow-hidden">
            {/* Admin Sidebar */}
            <aside className="w-72 bg-gray-900 border-r border-white/5 flex flex-col glass-dark z-20">
                <div className="p-8">
                    <div className="flex items-center space-x-3 mb-10">
                        <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/40">
                            <ShieldCheck size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tighter">Admin<span className="text-primary-500">Panel</span></h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Master Control</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <Icon size={20} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-400 transition-colors'} />
                                    <span className="font-bold text-sm tracking-tight">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-8 space-y-4">
                    <button
                        onClick={logout}
                        className="flex items-center justify-center space-x-2 w-full py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs font-bold group"
                    >
                        <LogOut size={14} className="group-hover:rotate-12 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                    <Link
                        href="http://localhost:3000" // Assuming main app is on 3000
                        className="flex items-center justify-center space-x-2 w-full py-3 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 hover:text-white transition-all text-xs font-bold"
                    >
                        <ArrowLeft size={14} />
                        <span>Return to App</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-primary-900/10 via-gray-950 to-gray-950">
                <div className="p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
