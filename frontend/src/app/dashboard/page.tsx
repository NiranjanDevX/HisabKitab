
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Download,
    Plus,
    Sparkles,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw
} from 'lucide-react';
import { exportService } from '@/services/exportService';
import { useNotification } from '@/context/NotificationContext';
import { SummaryCards } from '@/components/features/analytics/SummaryCards';
import { ExpenseTrend } from '@/components/features/analytics/ExpenseTrend';
import { CategoryBreakdown } from '@/components/features/analytics/CategoryBreakdown';
import { RecentTransactions } from '@/components/features/analytics/RecentTransactions';
import { AddExpenseModal } from '@/components/features/expenses/AddExpenseModal';
import { analyticsService, AnalyticsResponse } from '@/services/analyticsService';
import { expenseService, Expense } from '@/services/expenseService';
import { aiService } from '@/services/aiService';

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
                expenseService.getExpenses(5), // Fix: Pass number directly as per existing service method
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
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                    <p className="text-gray-500 text-sm font-medium animate-pulse">Syncing with Gemini AI...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-20 flex flex-col items-center">
                <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                    <RefreshCw className="text-red-500" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Sync Error</h2>
                <p className="text-gray-400 max-w-sm mx-auto mb-8">Could not load dashboard data from the neural engine. Please check your connection.</p>
                <button
                    onClick={fetchData}
                    className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all font-bold"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-900/40 p-8 rounded-[2.5rem] border border-white/5 glass">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">System Stats</h1>
                    <p className="text-gray-400 mt-1 font-medium italic">"Financial freedom is learned, not inherited."</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => exportService.exportToCSV()}
                        className="flex items-center space-x-2 px-5 py-3 bg-gray-800/50 border border-white/5 rounded-2xl text-sm font-bold text-white hover:bg-gray-800 transition-all"
                    >
                        <Download size={18} className="text-gray-400" />
                        <span>Export CSV</span>
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center space-x-2 px-6 py-3 bg-primary-600 rounded-2xl text-sm font-bold text-white hover:bg-primary-500 transition-all shadow-xl shadow-primary-900/30"
                    >
                        <Plus size={18} />
                        <span>Log Expense</span>
                    </button>
                </div>
            </header>

            {insights.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    {insights.map((insight: string, idx: number) => (
                        <div key={idx} className="bg-primary-600/10 border border-primary-500/20 rounded-2xl p-4 flex items-start space-x-3">
                            <Sparkles className="text-primary-500 mt-1 flex-shrink-0" size={16} />
                            <p className="text-xs text-primary-200 leading-relaxed font-medium">{insight}</p>
                        </div>
                    ))}
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <SummaryCards
                    summary={data.summary}
                    topCategory={data.category_breakdown[0]?.category_name}
                    hasAIInsight={insights.length > 0}
                />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <ExpenseTrend data={data.recent_trends} />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <CategoryBreakdown data={data.category_breakdown} />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <RecentTransactions transactions={transactions} />
            </motion.div>

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
