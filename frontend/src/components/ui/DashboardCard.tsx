"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DashboardCardProps {
    children: React.ReactNode;
    className?: string;
}

export const DashboardCard = ({ children, className }: DashboardCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={cn(
                "glass-card p-6 rounded-4xl",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export const DashboardCardHeader = ({ children, className }: DashboardCardProps) => (
    <div className={cn("flex items-center justify-between mb-6", className)}>
        {children}
    </div>
);

export const DashboardCardTitle = ({ children, className }: DashboardCardProps) => (
    <h3 className={cn("text-lg font-bold tracking-tight text-white", className)}>
        {children}
    </h3>
);

export const DashboardCardContent = ({ children, className }: DashboardCardProps) => (
    <div className={cn("", className)}>
        {children}
    </div>
);
