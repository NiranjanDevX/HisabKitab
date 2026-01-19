"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService, User } from "@/services/authService";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const checkAuth = useCallback(async () => {
        try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
        } catch (error) {
            setUser(null);
            if (pathname !== '/login') {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [pathname, router]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (email: string, pass: string) => {
        const response = await authService.login(email, pass);
        // Correcting the login logic to handle typical FastAPI OAuth2 response
        const userData = await authService.getCurrentUser();
        setUser(userData);
        router.push('/');
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
