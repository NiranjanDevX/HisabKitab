"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/authService";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/features/auth/AuthLayout";
import { AuthCard } from "@/components/features/auth/AuthCard";

const stagger = { show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await authService.login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { signInWithPopup } = await import("firebase/auth");
      const { auth, googleProvider } = await import("@/lib/firebase");
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await authService.googleLogin(idToken);
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Google Login Error:", err);
      const ax = err as { response?: { data?: { detail?: string } }; message?: string };
      const detail = ax?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : ax?.message || "Social login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Access your account" subtitle="Sign in to sync your finances and continue.">
      <AuthCard>
        <motion.form onSubmit={handleLogin} className="space-y-5" variants={stagger} initial="hidden" animate="show">
          {error && (
            <motion.div
              variants={item}
              className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest text-center animate-shake"
            >
              {error}
            </motion.div>
          )}

          <motion.div variants={item}>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/[0.04] border-white/10 focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/20"
            />
          </motion.div>

          <motion.div variants={item} className="space-y-2">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/[0.04] border-white/10 focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/20"
            />
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-[10px] font-bold uppercase tracking-widest text-primary-400 hover:text-primary-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <Button type="submit" className="w-full py-4 text-sm" isLoading={isLoading}>
              Sign in
            </Button>
          </motion.div>

          <motion.div variants={item} className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0a0a0a] px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                or continue with
              </span>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-3 py-4 border-white/15 hover:border-white/25 hover:bg-white/[0.06]"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>
          </motion.div>

          <motion.p variants={item} className="text-center text-xs text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Sign up
            </Link>
          </motion.p>
        </motion.form>
      </AuthCard>
    </AuthLayout>
  );
}
