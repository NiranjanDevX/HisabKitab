"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Clock,
    AlertTriangle,
    Zap,
    LogIn,
    ShieldAlert,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { adminService, AdminLog } from '@/services/adminService';
import AdminLayout from '@/components/AdminLayout';

export default function AdminEventsPage() {
    const [logs, setLogs] = useState<AdminLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);

    const fetchLogs = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await adminService.getLogs(page);
            setLogs(Array.isArray(data) ? data : (data as { items: AdminLog[] }).items || []);
        } catch (error) {
            console.error('Failed to fetch logs', error);
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const getEventIcon = (type: string) => {
        switch (type.toUpperCase()) {
            case 'AI_FEATURE_USED': return <Zap className="text-yellow-500" size={16} />;
            case 'LOGIN': return <LogIn className="text-green-500" size={16} />;
            case 'ERROR': return <AlertTriangle className="text-red-500" size={16} />;
            case 'ADMIN_ACTION': return <ShieldAlert className="text-primary-500" size={16} />;
            default: return <Activity className="text-gray-400" size={16} />;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Audit Trail</h1>
                        <p className="text-gray-400 mt-1 font-medium">Real-time system events and security logs.</p>
                    </div>

                    <div className="flex items-center space-x-2 bg-gray-900 border border-white/5 p-1 rounded-2xl">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="p-2 text-gray-500 hover:text-white disabled:opacity-30"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-xs font-bold text-white px-2">Page {page}</span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={logs.length < 50}
                            className="p-2 text-gray-500 hover:text-white disabled:opacity-30"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </header>

                <div className="space-y-4">
                    {isLoading ? (
                        [1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-20 bg-gray-900/50 rounded-3xl animate-pulse border border-white/5" />
                        ))
                    ) : logs.length === 0 ? (
                        <div className="text-center py-20 bg-gray-900/40 rounded-[2.5rem] border border-white/5 glass">
                            <Activity className="mx-auto text-gray-700 mb-4" size={48} />
                            <h3 className="text-lg font-bold text-white">No logs found</h3>
                            <p className="text-gray-500 mt-1">System is quiet...</p>
                        </div>
                    ) : (
                        logs.map((log, index) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-gray-900/60 border border-white/5 p-5 rounded-3xl hover:bg-gray-900 transition-all group flex items-start space-x-4"
                            >
                                <div className={`h-12 w-12 rounded-2xl bg-gray-800 flex items-center justify-center p-3 group-hover:scale-110 transition-transform`}>
                                    {getEventIcon(log.event_type)}
                                </div>

                                <div className="grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-sm font-bold text-white tracking-tight">{log.description}</h4>
                                            <p className="text-[10px] text-gray-500 font-medium uppercase mt-1 tracking-widest">{log.event_type}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                <Clock size={10} className="mr-1" />
                                                {new Date(log.timestamp).toLocaleString()}
                                            </div>
                                            <p className="text-[10px] text-primary-500 font-medium mt-1 uppercase">User ID: #{log.user_id}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
