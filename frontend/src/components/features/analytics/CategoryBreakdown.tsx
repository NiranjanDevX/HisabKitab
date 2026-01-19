"use client";

import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Card } from '@/components/ui';
import { CategoryBreakdown as CategoryData } from '@/services/analyticsService';

interface CategoryBreakdownProps {
    data: CategoryData[];
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ data }) => {
    const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <Card className="h-[400px] flex flex-col" title="Category Distribution">
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="total"
                            nameKey="category_name"
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.category_color || COLORS[index % COLORS.length]}
                                    stroke="rgba(0,0,0,0)"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#111827',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            wrapperStyle={{ paddingTop: '20px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
