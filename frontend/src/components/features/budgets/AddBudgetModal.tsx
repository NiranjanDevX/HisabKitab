"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Save, Loader2 } from 'lucide-react';
import { budgetService, BudgetCreate } from '@/services/budgetService';
import { categoryService, Category } from '@/services/categoryService';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AddBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddBudgetModal: React.FC<AddBudgetModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<BudgetCreate>({
        name: '',
        amount: 0,
        period: 'monthly',
        category_id: undefined
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories");
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.amount <= 0) {
            showNotification('Amount must be greater than 0', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await budgetService.createBudget(formData);
            showNotification('Budget created successfully!', 'success');
            onSuccess();
            setFormData({
                name: '',
                amount: 0,
                period: 'monthly',
                category_id: undefined
            });
        } catch (error: any) {
            showNotification(error.response?.data?.detail || 'Failed to create budget', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden glass"
                >
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-500">
                                <Target size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Create Budget</h2>
                                <p className="text-xs text-gray-500">Set spending limits for categories</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-4">
                            <Input
                                label="Budget Name"
                                placeholder="e.g. Monthly Grocery Bill"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Budget Limit (₹)"
                                    type="number"
                                    placeholder="0"
                                    value={formData.amount || ''}
                                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                    required
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Period</label>
                                    <select
                                        className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all appearance-none"
                                        value={formData.period}
                                        onChange={(e) => setFormData({ ...formData, period: e.target.value as any })}
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Category (Optional)</label>
                                <select
                                    className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all appearance-none"
                                    value={formData.category_id || ''}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? parseInt(e.target.value) : undefined })}
                                >
                                    <option value="">AII Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-gray-500 mt-1.5 ml-1">
                                    Leaving this blank will track total spending across all categories.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 flex space-x-3">
                            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-primary-600 hover:bg-primary-500 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Save size={18} />
                                        <span>Save Budget</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
