"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/authService';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.login(email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid email or password');
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
            router.push('/dashboard');
        } catch (err: any) {
            console.error("Google Login Error:", err);
            setError(err?.response?.data?.detail || err.message || 'Social login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
                        <div className="h-12 w-12 rounded-xl bg-gray-900 flex items-center justify-center shadow-lg border border-white/5 group-hover:border-primary-500/50 transition-all p-2">
                            <img src="/logos/favicon.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="text-left">
                            <span className="block text-2xl font-bold text-white tracking-tight">Hisab<span className="text-primary-500">Kitab</span></span>
                            <span className="block text-[10px] text-gray-500 font-medium tracking-widest uppercase">Smart Finance</span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Enter your details to access your account</p>
                </div>

                <Card className="shadow-primary-900/10 border-white/5">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <div className="space-y-1">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="flex justify-end">
                                <Link href="/forgot-password" title="Forgot Password?" className="text-xs text-primary-400 hover:text-primary-300">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-3"
                            isLoading={isLoading}
                        >
                            Sign In
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-800"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-gray-950 px-2 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full py-3 flex items-center justify-center gap-2"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                            Continue with Google
                        </Button>

                        <div className="text-center text-sm text-gray-400">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-primary-400 font-medium hover:text-primary-300">
                                Register now
                            </Link>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
