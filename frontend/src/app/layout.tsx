import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "HisabKitab - AI-Powered Financial Freedom",
    description: "Track, analyze and optimize your daily spending with Google Gemini AI. Experience the future of personal finance with 3D insights.",
    keywords: ["expense tracker", "budget manager", "AI finance", "Gemini AI", "personal finance", "HisabKitab"],
    authors: [{ name: "HisabKitab Team" }],
    icons: {
        icon: "/logos/favicon.png",
        shortcut: "/logos/favicon.png",
        apple: "/logos/favicon.png",
    },
    metadataBase: new URL("https://hisabkitab.vercel.app"),
    openGraph: {
        title: "HisabKitab - Smart Expense Management",
        description: "AI-powered insights and real-time tracking for your finances.",
        url: "https://hisabkitab.vercel.app",
        siteName: "HisabKitab",
        images: [
            {
                url: "/logos/hisabkitab.png",
                width: 1200,
                height: 630,
            },
        ],
        locale: "en-IN",
        type: "website",
    },
};

import { Navbar } from "@/components/layout";
import { AIChatAssistant } from "@/components/features/ai/AIChatAssistant";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <Navbar />
                    {children}
                    <AIChatAssistant />
                </Providers>
            </body>
        </html>
    );
}
