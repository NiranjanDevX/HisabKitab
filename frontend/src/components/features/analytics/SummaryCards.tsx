import React from 'react';
import { Card } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, Sparkles } from 'lucide-react';
import { SpendingSummary } from '@/services/analyticsService';

interface SummaryCardsProps {
    summary: SpendingSummary;
    topCategory?: string;
    hasAIInsight?: boolean;
}

export function SummaryCards({ summary, topCategory, hasAIInsight }: SummaryCardsProps) {
    const cards = [
        {
            title: 'Total Spent',
            value: `₹${summary.total.toLocaleString()}`,
            icon: <DollarSign className="h-6 w-6 text-primary-500" />,
            description: 'Total expenses this month',
            trend: summary.total > 0 ? '+12%' : '0%', // Mock trend for now
            trendType: 'up'
        },
        {
            title: 'Daily Average',
            value: `₹${summary.average.toLocaleString()}`,
            icon: <Activity className="h-6 w-6 text-secondary-500" />,
            description: 'Average daily spending',
        },
        {
            title: 'Transactions',
            value: summary.count.toString(),
            icon: <TrendingUp className="h-6 w-6 text-green-500" />,
            description: 'Total count this month',
        },
        {
            title: 'Top Category',
            value: topCategory || 'N/A',
            icon: <PieChart className="h-6 w-6 text-purple-500" />,
            description: 'Most expensive category',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, idx) => (
                <Card key={idx} className="relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-gray-800/50 group-hover:bg-gray-800 transition-colors">
                            {card.icon}
                        </div>
                        <div className="flex items-center space-x-2">
                            {idx === 0 && hasAIInsight && (
                                <span className="flex items-center space-x-1 text-[10px] font-bold text-primary-500 bg-primary-500/10 px-2 py-1 rounded-full animate-pulse">
                                    <Sparkles size={10} />
                                    <span>AI Insight</span>
                                </span>
                            )}
                            {card.trend && (
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${card.trendType === 'up' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                                    }`}>
                                    {card.trend}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-400">{card.title}</h3>
                        <p className="text-2xl font-bold text-white tracking-tight">{card.value}</p>
                        <p className="text-xs text-gray-500">{card.description}</p>
                    </div>
                    {/* Subtle decoration */}
                    <div className="absolute -right-2 -bottom-2 h-16 w-16 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
                </Card>
            ))}
        </div>
    );
};
