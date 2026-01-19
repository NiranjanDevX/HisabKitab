"use client";

import { useEffect, useState } from "react";
import { Plus, Target, Trash2, Edit2 } from "lucide-react";
import api from "@/lib/api";
import { motion } from "framer-motion";

interface Goal {
    id: number;
    name: string;
    description?: string;
    target_amount: number;
    current_amount: number;
    target_date?: string;
    is_completed: boolean;
    color?: string;
}

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // New Goal Form State
    const [newItem, setNewItem] = useState({
        name: "",
        target_amount: "",
        target_date: "",
        description: ""
    });

    const fetchGoals = async () => {
        try {
            const res = await api.get("/api/v1/goals/");
            setGoals(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/api/v1/goals/", {
                ...newItem,
                target_amount: parseFloat(newItem.target_amount)
            });
            setShowModal(false);
            setNewItem({ name: "", target_amount: "", target_date: "", description: "" });
            fetchGoals();
        } catch (err) {
            console.error(err);
            alert("Failed to create goal");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/api/v1/goals/${id}`);
            setGoals(goals.filter(g => g.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Loading goals...</div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 pb-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Financial Goals
                        </h1>
                        <p className="text-zinc-400 mt-1">Track your savings targets</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={20} />
                        Add Goal
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map((goal) => {
                        const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
                        return (
                            <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button onClick={() => handleDelete(goal.id)} className="text-red-400 hover:text-red-300">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`p-3 rounded-lg bg-indigo-500/10 text-indigo-400`}>
                                        <Target size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{goal.name}</h3>
                                        <p className="text-sm text-zinc-400">{goal.description || "No description"}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-400">Progress</span>
                                        <span className="font-medium">{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm mt-1">
                                        <span className="text-zinc-500">
                                            {goal.current_amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                        </span>
                                        <span className="text-white font-medium">
                                            {goal.target_amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                        </span>
                                    </div>
                                    {goal.target_date && (
                                        <div className="text-xs text-zinc-500 text-right mt-2">
                                            Target: {new Date(goal.target_date).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Create Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full"
                        >
                            <h2 className="text-xl font-bold mb-4">New Financial Goal</h2>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Goal Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={newItem.name}
                                        onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="e.g. New Laptop"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Target Amount (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        value={newItem.target_amount}
                                        onChange={e => setNewItem({ ...newItem, target_amount: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="50000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Target Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={newItem.target_date}
                                        onChange={e => setNewItem({ ...newItem, target_date: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Description</label>
                                    <textarea
                                        value={newItem.description}
                                        onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium"
                                    >
                                        Create Goal
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
