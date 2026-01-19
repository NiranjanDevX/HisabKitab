"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { ExpenseList } from '@/components/features/expenses/ExpenseList';
import { AddExpenseModal } from '@/components/features/expenses/AddExpenseModal';
import { Button } from '@/components/ui/Button';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function ExpensesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <main className="min-h-screen bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Expenses</h1>
                        <p className="text-gray-400 mt-1">Manage and track your daily spending</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            className="flex items-center space-x-2"
                            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/analytics/export`}
                        >
                            <Download size={18} />
                            <span>Export</span>
                        </Button>
                        <Button
                            variant="secondary"
                            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                            onClick={() => document.getElementById('receipt-upload')?.click()}
                        >
                            <Search size={18} />
                            <span>Scan Receipt</span>
                        </Button>
                        <input
                            type="file"
                            id="receipt-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const formData = new FormData();
                                formData.append('file', file);

                                try {
                                    // Normally we would show a loader and then open the modal pre-filled
                                    // For now, I'll just alert the result to prove it works, or you'd pass it to the modal
                                    const token = localStorage.getItem('token');
                                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ocr/scan`, {
                                        method: 'POST',
                                        headers: { 'Authorization': `Bearer ${token}` },
                                        body: formData
                                    });
                                    const data = await res.json();
                                    if (data.success) {
                                        alert(`Scanned: Total ${data.data.amount} on ${data.data.date}\nMerchant: ${data.data.merchant}`);
                                        // Ideally: open AddExpenseModal with data
                                    }
                                } catch (err) {
                                    console.error(err);
                                    alert("Scan failed");
                                }
                            }}
                        />
                        <Button
                            variant="primary"
                            className="flex items-center space-x-2 shadow-lg shadow-primary-900/20"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Plus size={18} />
                            <span>Add Expense</span>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1 space-y-6">
                        <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                            <h3 className="text-white font-semibold mb-4 flex items-center">
                                <Filter size={18} className="mr-2 text-primary-500" />
                                Filters
                            </h3>

                            <div className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search description..."
                                        className="w-full bg-gray-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Category</label>
                                    <select className="w-full bg-gray-950/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none">
                                        <option value="">All Categories</option>
                                        <option value="Food">Food & Dining</option>
                                        <option value="Transport">Transportation</option>
                                        <option value="Shopping">Shopping</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Time Period</label>
                                    <select className="w-full bg-gray-950/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none">
                                        <option value="7">Last 7 Days</option>
                                        <option value="30">Last 30 Days</option>
                                        <option value="90">Last 3 months</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <ExpenseList key={refreshKey} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <AddExpenseModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleSuccess}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
