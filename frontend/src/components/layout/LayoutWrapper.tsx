"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    // Synchronized with Sidebar.tsx exclusion list
    const noSidebarPages = ["/", "/login", "/register", "/about-us", "/terms-and-conditions", "/privacy-policy"];
    const isNoSidebarPage = noSidebarPages.includes(pathname);

    return (
        <div className="flex">
            <Sidebar />
            <main className={cn(
                "flex-1 transition-all duration-300",
                !isNoSidebarPage && "md:pl-[80px] lg:pl-[280px]"
            )}>
                {children}
            </main>
        </div>
    );
};
