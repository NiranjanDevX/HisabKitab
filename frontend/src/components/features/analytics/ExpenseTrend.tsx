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
import { Card } from '@/components/ui/Card';

interface TrendData {
    date: string;
    amount: number;
}

interface ExpenseTrendProps {
    data: TrendData[];
}

export function ExpenseTrend({ data }: ExpenseTrendProps) {
    return (
        <Card className="h-[400px] flex flex-col" title="Spending Trend">
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                        <XAxis
                            dataKey="date"
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value: string) => {
                                const date = new Date(value);
                                return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                            }}
                        />
                        <YAxis
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value: number) => `₹${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#111827',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#8b5cf6' }}
                            labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorAmount)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
