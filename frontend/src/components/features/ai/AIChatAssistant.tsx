"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { MessageSquare, Send, X, Bot, User, Sparkles, Minus } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

interface ChatMessage {
    role: 'ai' | 'user';
    content: string;
    timestamp: string;
}

export const AIChatAssistant: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        {
            role: 'ai',
            content: 'Hello! I am your HisabKitab AI assistant. How can I help you with your finances today?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isLandingPage = pathname === '/';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isLoading]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMsg = message;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setMessage('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg, timestamp }]);
        setIsLoading(true);

        try {
            const response = await aiService.chat(userMsg);
            setChatHistory(prev => [...prev, {
                role: 'ai',
                content: response.response,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (error) {
            setChatHistory(prev => [...prev, {
                role: 'ai',
                content: 'Sorry, I encountered an error. Please try again later.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Only show if authenticated AND NOT on landing page
    if (!isAuthenticated || isLandingPage) return null;

    return (
        <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 w-[380px] sm:w-[420px] max-h-[650px] flex flex-col pointer-events-auto"
                    >
                        <Card className="flex-1 flex flex-col p-0 overflow-hidden border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] glass-dark rounded-3xl">
                            {/* Header */}
                            <div className="p-5 bg-gradient-to-r from-primary-600/80 to-primary-500/80 backdrop-blur-md flex items-center justify-between border-b border-white/10">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                                            <Bot className="text-white" size={24} />
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-primary-600 rounded-full"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold tracking-tight">Financial Assistant</h3>
                                        <div className="flex items-center space-x-1.5">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                            <span className="text-white/70 text-[10px] uppercase tracking-wider font-semibold">Online</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white"
                                >
                                    <Minus size={20} />
                                </button>
                            </div>

                            {/* Messages Container */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[400px] max-h-[450px] scroll-smooth no-scrollbar">
                                {chatHistory.map((chat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: chat.role === 'user' ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`
                                            max-w-[85%] group relative
                                            ${chat.role === 'user' ? 'flex flex-row-reverse items-end space-x-reverse' : 'flex items-end'}
                                            space-x-2
                                        `}>
                                            <div className={`
                                                px-4 py-3 rounded-2xl text-sm leading-relaxed
                                                ${chat.role === 'user'
                                                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-br-none shadow-lg shadow-primary-900/20'
                                                    : 'bg-white/[0.03] text-gray-100 rounded-bl-none border border-white/5'}
                                            `}>
                                                {chat.content}
                                                <div className={`
                                                    text-[9px] mt-1 opacity-50
                                                    ${chat.role === 'user' ? 'text-right text-white' : 'text-left text-gray-400'}
                                                `}>
                                                    {chat.timestamp}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-white/5 text-gray-100 px-4 py-3 rounded-2xl rounded-bl-none border border-white/5 flex items-center space-x-2">
                                            <div className="flex space-x-1">
                                                <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-5 border-t border-white/5 bg-black/20">
                                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center space-x-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-4 pr-12 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20">
                                            <Sparkles size={16} />
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={!message.trim() || isLoading}
                                        type="submit"
                                        className="p-3.5 bg-primary-500 rounded-2xl text-white hover:bg-primary-400 transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={20} />
                                    </motion.button>
                                </form>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    relative h-16 w-16 rounded-3xl flex items-center justify-center shadow-2xl z-50 transition-all duration-500
                    ${isOpen
                        ? 'bg-dark-800 rotate-90 border border-white/10'
                        : 'bg-gradient-to-tr from-primary-600 to-primary-400 text-white shadow-primary-900/40'}
                `}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ opacity: 0, rotate: -45 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 45 }}
                        >
                            <X size={28} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.2 }}
                            className="relative"
                        >
                            <MessageSquare size={28} />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -top-3 -right-3 text-yellow-400"
                            >
                                <Sparkles size={16} fill="currentColor" />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};
