"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { aiService } from '@/services/aiService';

export const AIChatAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{ role: 'ai' | 'user', content: string }[]>([
        { role: 'ai', content: 'Hello! I am your HisabKitab AI assistant. How can I help you with your finances today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMsg = message;
        setMessage('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const response = await aiService.chat(userMsg);
            setChatHistory(prev => [...prev, { role: 'ai', content: response.response }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Bubble */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 h-14 w-14 bg-primary-600 rounded-full flex items-center justify-center shadow-xl shadow-primary-900/40 z-50 text-white border border-primary-400/50"
            >
                {isOpen ? <X size={24} /> : <div className="relative"><MessageSquare size={24} /><Sparkles className="absolute -top-3 -right-3 text-yellow-300 h-4 w-4" /></div>}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 w-96 max-h-[600px] flex flex-col z-50"
                    >
                        <Card className="flex-1 flex flex-col p-0 overflow-hidden border-white/10 shadow-2xl glass-dark">
                            <div className="p-4 border-b border-white/5 bg-primary-600 flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Bot className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold leading-none">HisabKitab AI</h3>
                                    <span className="text-white/60 text-xs mt-1 block">Powered by Gemini</span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px]">
                                {chatHistory.map((chat, i) => (
                                    <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`
                                            max-w-[80%] p-3 rounded-2xl text-sm
                                            ${chat.role === 'user'
                                                ? 'bg-primary-600 text-white rounded-tr-none'
                                                : 'bg-gray-900 text-gray-100 rounded-tl-none border border-white/5'}
                                        `}>
                                            {chat.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-900 text-gray-100 p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center space-x-2">
                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-white/5">
                                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
                                    <input
                                        type="text"
                                        placeholder="Ask about your spending..."
                                        className="w-full bg-gray-950/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-2 p-1.5 bg-primary-600 rounded-lg text-white hover:bg-primary-500 transition-colors"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
