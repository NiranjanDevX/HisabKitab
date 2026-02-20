"use client";

import React from 'react';
import { ShoppingBag, Coffee, Car, Home, Smartphone, Plus, ArrowRight } from 'lucide-react';
import { DashboardCard, DashboardCardHeader, DashboardCardTitle } from '@/components/ui/DashboardCard';
import { cn } from '@/lib/utils';

interface Transaction {
    id: number;
    description: string;
    amount: number;
    category_name: string;
    date: string;
}

interface RecentTransactionsProps {
    transactions: Transaction[];
}

export const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
    const getIcon = (category: string) => {
        const iconClass = "h-5 w-5";
        switch (category.toLowerCase()) {
            case 'food': return <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500"><Coffee className={iconClass} /></div>;
            case 'transport': return <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500"><Car className={iconClass} /></div>;
            case 'shopping': return <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-500"><ShoppingBag className={iconClass} /></div>;
            case 'home': return <div className="p-2.5 rounded-xl bg-accent-indigo/10 text-accent-indigo"><Home className={iconClass} /></div>;
            case 'bills': return <div className="p-2.5 rounded-xl bg-accent-rose/10 text-accent-rose"><Smartphone className={iconClass} /></div>;
            default: return <div className="p-2.5 rounded-xl bg-gray-500/10 text-gray-400"><Plus className={iconClass} /></div>;
        }
    };

    return (
        <DashboardCard className="flex flex-col">
            <DashboardCardHeader>
                <DashboardCardTitle>Transaction History</DashboardCardTitle>
                <button className="text-[10px] font-black uppercase tracking-widest text-primary-500 hover:text-primary-400 flex items-center gap-2 transition-colors">
                    View All <ArrowRight size={14} />
                </button>
            </DashboardCardHeader>
            <div className="space-y-2">
                {transactions.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-600">
                            <Plus size={24} />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">No recent activity detected.</p>
                    </div>
                ) : (
                    transactions.map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all group">
                            <div className="flex items-center space-x-4">
                                {getIcon(t.category_name)}
                                <div>
                                    <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{t.description}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t.category_name} • {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-white">₹{t.amount.toLocaleString()}</p>
                                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Completed</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </DashboardCard>
    );
};
