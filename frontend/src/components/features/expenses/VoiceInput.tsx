"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2, Sparkles, X } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';

interface VoiceInputProps {
    onResult: (data: any) => void;
    onClose: () => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onResult, onClose }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { showNotification } = useNotification();

    // Initialize Speech Recognition
    const startListening = useCallback(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            showNotification('Speech recognition is not supported in this browser.', 'error');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('');
        };

        recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const result = event.results[current][0].transcript;
            setTranscript(result);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
            showNotification('Error recognizing speech. Please try again.', 'error');
        };

        recognition.start();
    }, [showNotification]);

    const processVoice = async () => {
        if (!transcript) return;
        setIsProcessing(true);
        try {
            const result = await aiService.parseVoice(transcript);
            if (result.success) {
                onResult(result.data);
                showNotification('Voice command parsed!', 'success');
            } else {
                const errorMsg = typeof result.error === 'string' ? result.error : 'Could not parse expense detail.';
                showNotification(errorMsg, 'error');
            }
        } catch (error) {
            showNotification('Failed to process voice command.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        startListening();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-secondary-600"></div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <Sparkles className="text-primary-500" size={18} />
                    <span className="text-sm font-bold text-white uppercase tracking-widest">AI Voice Assistant</span>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    {isListening && (
                        <>
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 bg-primary-500 rounded-full blur-xl"
                            />
                        </>
                    )}
                    <button
                        onClick={isListening ? () => { } : startListening}
                        className={`h-20 w-20 rounded-full flex items-center justify-center relative z-10 transition-all ${isListening ? 'bg-primary-600 shadow-primary-900/50' : 'bg-gray-800'
                            }`}
                    >
                        {isListening ? (
                            <Mic size={32} className="text-white animate-pulse" />
                        ) : isProcessing ? (
                            <Loader2 size={32} className="text-primary-500 animate-spin" />
                        ) : (
                            <Mic size={32} className="text-gray-400" />
                        )}
                    </button>
                </div>

                <div className="w-full space-y-4">
                    <textarea
                        className="w-full bg-gray-950/50 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 min-h-[80px]"
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder='Tap mic and say: "Spent 500 on dinner at McDonalds"'
                    />

                    <Button
                        onClick={processVoice}
                        disabled={!transcript || isProcessing}
                        className="w-full py-3 flex items-center justify-center space-x-2"
                    >
                        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                        <span>{isProcessing ? 'AI Parsing...' : 'Parse Expense'}</span>
                    </Button>
                </div>

                {!isListening && !isProcessing && !transcript && (
                    <p className="text-xs text-gray-500 text-center">
                        Try: "Spent 500 on dinner at McDonalds"
                    </p>
                )}
            </div>
        </motion.div>
    );
};
