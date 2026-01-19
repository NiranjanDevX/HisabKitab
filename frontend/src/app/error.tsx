"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </motion.div>

                <div>
                    <h1 className="text-2xl font-bold mb-2">Something went wrong!</h1>
                    <p className="text-zinc-400">
                        {error.message || "An unexpected error occurred."}
                    </p>
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors font-medium"
                    >
                        Try again
                    </button>
                    <button
                        onClick={() => window.location.href = "/"}
                        className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors font-medium"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}
