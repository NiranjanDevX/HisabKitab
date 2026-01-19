"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationContextType {
    showNotification: (message: string, type?: Notification['type']) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = useCallback((message: string, type: Notification['type'] = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 5000);
    }, []);

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col space-y-4 pointer-events-none">
                <AnimatePresence>
                    {notifications.map((n: Notification) => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: 20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            className="pointer-events-auto"
                        >
                            <div className={`
                flex items-center space-x-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[320px] max-w-md
                ${n.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                    n.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                        n.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                            'bg-primary-500/10 border-primary-500/20 text-primary-500'}
              `}>
                                <div className="shrink-0">
                                    {n.type === 'success' && <CheckCircle size={20} />}
                                    {n.type === 'error' && <AlertCircle size={20} />}
                                    {n.type === 'warning' && <AlertCircle size={20} />}
                                    {n.type === 'info' && <Info size={20} />}
                                </div>
                                <div className="flex-1 text-sm font-bold tracking-tight">
                                    {n.message}
                                </div>
                                <button
                                    onClick={() => removeNotification(n.id)}
                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
