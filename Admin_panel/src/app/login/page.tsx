"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ShieldCheck } from 'lucide-react';
import { authService } from '@/services/authService';

export default function AdminLoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(email, password);
        } catch (err: unknown) {
            const errorMessage = (err as any).response?.data?.detail || 'Login failed.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            const { signInWithPopup } = await import('firebase/auth');
            const { auth, googleProvider } = await import('@/lib/firebase');

            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            await authService.googleLogin(idToken);
            window.location.href = '/dashboard'; // Redirect on success
        } catch (err: any) {
            console.error("Google Login Error:", err);
            const errorMessage = err?.response?.data?.detail || err.message || 'Social login failed.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent opacity-50" />

            <Card className="w-full max-w-md relative z-10 border-white/5 glass-dark overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary-500 to-secondary-500" />

                <div className="flex flex-col items-center text-center space-y-2 mb-8 mt-4">
                    <div className="h-16 w-16 rounded-2xl bg-primary-600 flex items-center justify-center shadow-2xl shadow-primary-500/20 mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                        <ShieldCheck size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Admin<span className="text-primary-500">Access</span></h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed">Enter your credentials to manage<br />the HisabKitab ecosystem</p>
                </div>

                <div className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Work Email"
                            type="email"
                            placeholder="admin@hisabkitab.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-gray-800/50"
                        />

                        <Input
                            label="Security Key"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-gray-800/50"
                        />

                        <Button
                            type="submit"
                            className="w-full py-4 text-xs font-black uppercase tracking-[0.2em]"
                            isLoading={isLoading}
                        >
                            Initialize Session
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-gray-950 px-2 text-gray-500 font-bold">Or authenticate with</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google Workspace
                    </Button>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-tighter italic">
                        Secured by HisabKitab Neural Infrastructure
                    </p>
                </div>
            </Card>
        </div>
    );
}
