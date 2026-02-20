"use client";

import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import { DashboardCard, DashboardCardHeader, DashboardCardTitle } from '@/components/ui/DashboardCard';

interface CategoryData {
    category_name: string;
    total: number;
}

interface CategoryBreakdownProps {
    data: CategoryData[];
}

const COLORS = ['#0b84e3', '#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6'];

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
    return (
        <DashboardCard className="h-[420px] flex flex-col">
            <DashboardCardHeader>
                <DashboardCardTitle>Categorical Distribution</DashboardCardTitle>
            </DashboardCardHeader>
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="total"
                            nameKey="category_name"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(10, 10, 10, 0.8)',
                                backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                color: '#fff'
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            formatter={(value: string) => <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </DashboardCard>
    );
}
