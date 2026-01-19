"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Hidden on auth pages
    if (['/login', '/register'].includes(pathname)) return null;

    const navLinks = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Expenses', href: '/expenses' },
        { name: 'Budgets', href: '/budgets' },
        { name: 'Analytics', href: '/analytics' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-gray-950/70 backdrop-blur-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gray-900 flex items-center justify-center p-1 border border-white/10 group-hover:border-primary-500/50 transition-colors shadow-lg">
                                <img
                                    src="/logos/hisabkitab.png"
                                    alt="HisabKitab"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-white tracking-tight leading-none">Hisab<span className="text-primary-500">Kitab</span></span>
                                <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">AI Assistant</span>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === link.href
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm">Profile</Button>
                            <Button variant="primary" size="sm">Logout</Button>
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-950 border-b border-gray-800">
                    <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:bg-gray-800 hover:text-white"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4 pb-1 border-t border-gray-800 mt-2">
                            <Button className="w-full mb-2" variant="ghost">Profile</Button>
                            <Button className="w-full" variant="primary">Logout</Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
