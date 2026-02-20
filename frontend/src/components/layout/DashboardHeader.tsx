"use client";

import React from "react";
import {
    Search,
    Plus,
    Download,
    Calendar,
    ChevronDown
} from "lucide-react";

interface DashboardHeaderProps {
    title: string;
    onAddLog: () => void;
    onExport: () => void;
}

export const DashboardHeader = ({ title, onAddLog, onExport }: DashboardHeaderProps) => {
    return (
        <div className="flex flex-col gap-8 mb-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">{title}</h1>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar size={14} />
                            <span>Monday, April 4th</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm w-[300px] outline-none focus:border-primary-500/50 transition-all"
                        />
                    </div>

                    <button
                        onClick={onExport}
                        className="p-3 bg-white/5 border border-white/5 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <Download size={20} />
                    </button>

                    <button
                        onClick={onAddLog}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-500/20"
                    >
                        <Plus size={18} />
                        <span>Add Record</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
