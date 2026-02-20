"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    RefreshCw,
    Sparkles
} from 'lucide-react';
import { exportService } from '@/services/exportService';
import { SummaryCards } from '@/components/features/analytics/SummaryCards';
import { ExpenseTrend } from '@/components/features/analytics/ExpenseTrend';
import { CategoryBreakdown } from '@/components/features/analytics/CategoryBreakdown';
import { RecentTransactions } from '@/components/features/analytics/RecentTransactions';
import { AddExpenseModal } from '@/components/features/expenses/AddExpenseModal';
import { analyticsService, AnalyticsResponse } from '@/services/analyticsService';
import { expenseService, Expense } from '@/services/expenseService';
import { aiService } from '@/services/aiService';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

export default function DashboardPage() {
    const [data, setData] = useState<AnalyticsResponse | null>(null);
    const [transactions, setTransactions] = useState<Expense[]>([]);
    const [insights, setInsights] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [analytics, recent, ai] = await Promise.all([
                analyticsService.getDashboardData(),
                expenseService.getExpenses(5),
                aiService.getInsights()
            ]);
            setData(analytics);
            setTransactions(recent);
            setInsights(ai.insights || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 animate-pulse flex items-center justify-center">
                            <RefreshCw className="text-primary-500 animate-spin" size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] animate-pulse">Syncing Engine</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
                <div className="h-24 w-24 bg-rose-500/10 rounded-3xl flex items-center justify-center mb-8 border border-rose-500/20">
                    <RefreshCw className="text-rose-500" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Sync Failure</h2>
                <p className="text-gray-500 max-w-sm mx-auto mb-10 text-sm leading-relaxed">The neural engine could not retrieve your financial data at this time. Please re-establish connection.</p>
                <button
                    onClick={fetchData}
                    className="px-8 py-4 bg-white text-dark-950 rounded-2xl hover:bg-white/90 transition-all font-black uppercase text-xs tracking-widest shadow-xl shadow-white/5"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 lg:p-12 min-h-screen">
            <DashboardHeader
                title="System Overview"
                onAddLog={() => setIsAddModalOpen(true)}
                onExport={() => exportService.exportToCSV()}
            />

            <div className="space-y-10 max-w-[1600px] mx-auto">
                {insights.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {insights.map((insight: string, idx: number) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={idx}
                                className="glass bg-primary-500/5 border-primary-500/10 rounded-2xl p-4 flex items-start gap-4"
                            >
                                <div className="p-2 rounded-xl bg-primary-500/10 text-primary-500">
                                    <Sparkles size={16} />
                                </div>
                                <p className="text-[11px] text-primary-200/80 leading-relaxed font-bold italic">"{typeof insight === 'string' ? insight : 'Neural analysis incomplete'}"</p>
                            </motion.div>
                        ))}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <SummaryCards
                        summary={data.summary}
                        topCategory={data.category_breakdown[0]?.category_name}
                        hasAIInsight={insights.length > 0}
                    />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <ExpenseTrend data={data.recent_trends} />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <CategoryBreakdown data={data.category_breakdown} />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <RecentTransactions transactions={transactions} />
                </motion.div>
            </div>

            <AddExpenseModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    setIsAddModalOpen(false);
                    fetchData();
                }}
            />
        </div>
    );
}
