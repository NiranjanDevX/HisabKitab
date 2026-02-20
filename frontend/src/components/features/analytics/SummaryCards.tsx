"use client";

import React from 'react';
import { DashboardCard } from '@/components/ui/DashboardCard';
import {
    DollarSign,
    Activity,
    TrendingUp,
    PieChart,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { SpendingSummary } from '@/services/analyticsService';
import { cn } from '@/lib/utils';

interface SummaryCardsProps {
    summary: SpendingSummary;
    topCategory?: string;
    hasAIInsight?: boolean;
}

export function SummaryCards({ summary, topCategory, hasAIInsight }: SummaryCardsProps) {
    const cards = [
        {
            title: 'Monthly Spending',
            value: `₹${summary.total.toLocaleString()}`,
            icon: <DollarSign size={20} />,
            description: 'Total expenses this month',
            trend: '+12.5%',
            trendType: 'up',
            color: 'blue'
        },
        {
            title: 'Average Daily',
            value: `₹${summary.average.toLocaleString()}`,
            icon: <Activity size={20} />,
            description: 'Average daily spending',
            trend: '-2.4%',
            trendType: 'down',
            color: 'indigo'
        },
        {
            title: 'Transactions',
            value: summary.count.toString(),
            icon: <TrendingUp size={20} />,
            description: 'Total count this month',
            trend: '+5%',
            trendType: 'up',
            color: 'emerald'
        },
        {
            title: 'Top Category',
            value: topCategory || 'N/A',
            icon: <PieChart size={20} />,
            description: 'Most expensive category',
            color: 'rose'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, idx) => (
                <DashboardCard key={idx} className="relative overflow-hidden group">
                    <div className="flex items-start justify-between mb-4">
                        <div className={cn(
                            "p-3 rounded-2xl bg-white/5 border border-white/5 transition-colors group-hover:bg-white/10",
                            card.color === 'blue' && "text-primary-400",
                            card.color === 'indigo' && "text-accent-indigo",
                            card.color === 'emerald' && "text-accent-emerald",
                            card.color === 'rose' && "text-accent-rose",
                        )}>
                            {card.icon}
                        </div>
                        {card.trend && (
                            <div className={cn(
                                "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase",
                                card.trendType === 'up' ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                            )}>
                                {card.trendType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {card.trend}
                            </div>
                        )}
                    </div>

                    <div className="relative z-10">
                        <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-widest">{card.title}</p>
                        <h3 className="text-2xl font-bold text-white tracking-tight mb-1">{card.value}</h3>
                        <p className="text-[10px] text-gray-600 font-medium">{card.description}</p>
                    </div>

                    <div className={cn(
                        "absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none",
                        card.color === 'blue' && "bg-primary-500",
                        card.color === 'indigo' && "bg-accent-indigo",
                        card.color === 'emerald' && "bg-accent-emerald",
                        card.color === 'rose' && "bg-accent-rose",
                    )} />
                </DashboardCard>
            ))}
        </div>
    );
};
