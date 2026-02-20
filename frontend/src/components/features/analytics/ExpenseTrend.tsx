"use client";

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { DashboardCard, DashboardCardHeader, DashboardCardTitle } from '@/components/ui/DashboardCard';

interface TrendData {
    date: string;
    amount: number;
}

interface ExpenseTrendProps {
    data: TrendData[];
}

export function ExpenseTrend({ data }: ExpenseTrendProps) {
    return (
        <DashboardCard className="h-[420px] flex flex-col">
            <DashboardCardHeader>
                <DashboardCardTitle>Spending Overview</DashboardCardTitle>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-500/10 rounded-full border border-primary-500/10">
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                        <span className="text-[10px] font-bold text-primary-400 uppercase tracking-wider">Expenses</span>
                    </div>
                </div>
            </DashboardCardHeader>
            <div className="flex-1 w-full -ml-4">
                <ResponsiveContainer width="105%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0b84e3" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0b84e3" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis
                            dataKey="date"
                            stroke="#4b5563"
                            fontSize={10}
                            fontWeight={600}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value: string) => {
                                const date = new Date(value);
                                return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                            }}
                        />
                        <YAxis
                            stroke="#4b5563"
                            fontSize={10}
                            fontWeight={600}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value: number) => `₹${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(10, 10, 10, 0.8)',
                                backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#0b84e3', fontSize: '12px', fontWeight: 'bold' }}
                            labelStyle={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#0b84e3"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorAmount)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </DashboardCard>
    );
}
