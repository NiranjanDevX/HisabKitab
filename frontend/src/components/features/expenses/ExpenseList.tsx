"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { expenseService, Expense } from '@/services/expenseService';
import { Trash2, Edit2, Calendar, CreditCard, Tag } from 'lucide-react';

export const ExpenseList: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const data = await expenseService.getExpenses();
            setExpenses(data);
        } catch (error) {
            console.error('Failed to fetch expenses', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;
        try {
            await expenseService.deleteExpense(id);
            setExpenses(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            console.error('Failed to delete expense', error);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
    );

    return (
        <div className="space-y-4">
            {expenses.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-gray-800 bg-transparent">
                    <p className="text-gray-500">No expenses found. Add your first expense!</p>
                </Card>
            ) : (
                expenses.map((expense, index) => (
                    <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="hover:border-primary-500/30 transition-colors p-4 group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 rounded-full bg-gray-900 border border-white/5 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
                                        <Tag size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium">{expense.description}</h3>
                                        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                            <span className="flex items-center"><Calendar size={12} className="mr-1" /> {new Date(expense.date).toLocaleDateString()}</span>
                                            <span className="flex items-center"><Tag size={12} className="mr-1" /> {expense.category_name}</span>
                                            <span className="flex items-center text-primary-400/80"><CreditCard size={12} className="mr-1" /> {expense.payment_method}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right mr-4">
                                        <p className="text-lg font-bold text-white">₹{expense.amount.toLocaleString()}</p>
                                    </div>
                                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-primary-400">
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(expense.id)}
                                            className="p-2 text-gray-400 hover:text-red-400"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))
            )}
        </div>
    );
};
