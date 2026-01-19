"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Calendar, AlertCircle, Edit2, Trash2, PieChart } from 'lucide-react';
import { budgetService, Budget } from '@/services/budgetService';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AddBudgetModal } from '@/components/features/budgets/AddBudgetModal';

export default function BudgetPage() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { showNotification } = useNotification();

    const fetchBudgets = async () => {
        try {
            const data = await budgetService.getBudgets();
            setBudgets(data);
        } catch (error) {
            showNotification('Failed to fetch budgets', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this budget?')) return;
        try {
            await budgetService.deleteBudget(id);
            showNotification('Budget deleted successfully', 'success');
            fetchBudgets();
        } catch (error) {
            showNotification('Failed to delete budget', 'error');
        }
    };

    const getStatusColor = (percentage: number) => {
        if (percentage >= 100) return 'text-red-500 bg-red-500/10';
        if (percentage >= 80) return 'text-yellow-500 bg-yellow-500/10';
        return 'text-green-500 bg-green-500/10';
    };

    const getProgressBarColor = (percentage: number) => {
        if (percentage >= 100) return 'bg-red-500';
        if (percentage >= 80) return 'bg-yellow-500';
        return 'bg-primary-500';
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <div className="flex justify-between items-center bg-gray-900/40 p-6 rounded-3xl border border-white/5 glass">
                <div>
                    <h1 className="text-3xl font-bold text-white">Budgeting</h1>
                    <p className="text-gray-400 mt-1">Set limits and track your financial goals.</p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary-900/20"
                >
                    <Plus size={20} />
                    <span>Create Budget</span>
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-gray-900/50 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : budgets.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-16 text-center space-y-4">
                    <div className="h-20 w-20 rounded-full bg-gray-800 flex items-center justify-center">
                        <Target size={40} className="text-gray-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">No budgets set</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mt-2">
                            Take control of your spending by setting budgets for different categories.
                        </p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)} variant="outline">
                        Set Your First Budget
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map((budget, index) => (
                        <motion.div
                            key={budget.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="relative group overflow-hidden h-full flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start space-x-4">
                                            <div className="h-12 w-12 rounded-2xl bg-gray-800 flex items-center justify-center text-primary-500 shadow-inner">
                                                <PieChart size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg">{budget.name}</h3>
                                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                    <Calendar size={12} />
                                                    <span className="capitalize">{budget.period} Period</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(budget.percentage_used)}`}>
                                            {budget.percentage_used.toFixed(0)}% Used
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Spent: ₹{budget.spent.toLocaleString()}</span>
                                            <span className="text-white font-bold">Limit: ₹{budget.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(budget.percentage_used, 100)}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-full ${getProgressBarColor(budget.percentage_used)}`}
                                            />
                                        </div>
                                    </div>

                                    {budget.percentage_used >= 100 && (
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center space-x-3">
                                            <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                                            <span className="text-xs text-red-500 font-medium leading-tight">
                                                Budget exceeded! Consider reducing spending in this category.
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 mt-6 border-t border-white/5 flex justify-end space-x-2">
                                    <button
                                        onClick={() => handleDelete(budget.id)}
                                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            <AddBudgetModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    setIsAddModalOpen(false);
                    fetchBudgets();
                }}
            />
        </div>
    );
}
