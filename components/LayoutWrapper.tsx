"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64 min-w-0 transition-all duration-300 overflow-hidden">
        <Navbar />
        <main className="min-h-[calc(100vh-56px)] p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
