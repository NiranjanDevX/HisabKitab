"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { expenseService, ExpenseCreate } from '@/services/expenseService';
import { categoryService, Category } from '@/services/categoryService';
import { X, Plus, Mic, Sparkles, Loader2 } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { VoiceInput } from './VoiceInput';

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<ExpenseCreate>({
        amount: 0,
        description: '',
        category_id: 0,
        date: new Date().toISOString().split('T')[0],
        payment_method: 'Cash'
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isVoiceInputOpen, setIsVoiceInputOpen] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
            if (data.length > 0 && formData.category_id === 0) {
                setFormData(prev => ({ ...prev, category_id: data[0].id }));
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await expenseService.createExpense({
                ...formData,
                amount: Number(formData.amount)
            });
            showNotification('Expense added successfully!', 'success');
            onSuccess();
            onClose();
        } catch (error) {
            showNotification('Failed to add expense', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-lg z-[70]"
            >
                <Card className="p-0 overflow-hidden border-white/10 shadow-2xl">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-primary-900/5">
                        <div className="flex items-center space-x-2">
                            <Plus className="text-primary-500" size={24} />
                            <h2 className="text-xl font-bold text-white">Add New Expense</h2>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Input
                                    label="Amount (₹)"
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.amount || ''}
                                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <div className="flex items-end space-x-2">
                                    <div className="grow">
                                        <Input
                                            label="Description"
                                            placeholder="What did you spend on?"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={`mb-1 p-3 transition-colors ${isVoiceInputOpen ? 'bg-primary-600 text-white border-primary-500' : ''}`}
                                        onClick={() => setIsVoiceInputOpen(!isVoiceInputOpen)}
                                    >
                                        <Mic size={20} />
                                    </Button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isVoiceInputOpen && (
                                    <div className="col-span-2">
                                        <VoiceInput
                                            onResult={(data) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    ...data,
                                                    date: data.date ? data.date.split('T')[0] : prev.date
                                                }));
                                                setIsVoiceInputOpen(false);
                                            }}
                                            onClose={() => setIsVoiceInputOpen(false)}
                                        />
                                    </div>
                                )}
                            </AnimatePresence>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                <select
                                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none"
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                                    required
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Payment Method</label>
                                <select
                                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none"
                                    value={formData.payment_method}
                                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                    required
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Card">Card</option>
                                    <option value="UPI">UPI / Digital</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <Input
                                    label="Date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full py-3 flex items-center justify-center space-x-2"
                                isLoading={isLoading}
                            >
                                <Sparkles size={18} />
                                <span>Add Expense</span>
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};
