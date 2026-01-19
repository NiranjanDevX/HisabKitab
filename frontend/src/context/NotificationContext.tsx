"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

interface NotificationContextType {
    showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = useCallback((message: string, type: NotificationType) => {
        const id = Math.random().toString(36).substr(2, 9);
        setNotifications((prev: Notification[]) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications((prev: Notification[]) => prev.filter((n: Notification) => n.id !== id));
        }, 5000);
    }, []);

    const removeNotification = (id: string) => {
        setNotifications((prev: Notification[]) => prev.filter((n: Notification) => n.id !== id));
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-5 w-5 text-green-400" />;
            case 'error': return <AlertCircle className="h-5 w-5 text-red-400" />;
            case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-400" />;
            case 'info': return <Info className="h-5 w-5 text-blue-400" />;
        }
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[9999] space-y-2 pointer-events-none">
                <AnimatePresence>
                    {notifications.map((n: Notification) => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            className="pointer-events-auto"
                        >
                            <div className={`
                flex items-center p-4 rounded-xl border glass shadow-2xl min-w-[300px]
                ${n.type === 'error' ? 'border-red-500/20' : 'border-white/10'}
              `}>
                                <div className="mr-3">{getIcon(n.type)}</div>
                                <p className="text-sm font-medium text-white flex-1">{n.message}</p>
                                <button
                                    onClick={() => removeNotification(n.id)}
                                    className="ml-3 text-gray-500 hover:text-white transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotification must be used within NotificationProvider');
    return context;
};
