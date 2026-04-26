"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Menu, School, Search } from "lucide-react";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        isCollapsed={isSidebarCollapsed}
      />
      
      <div className={cn(
        "flex-1 min-w-0 transition-all duration-300",
        isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-900 bg-slate-50 hover:bg-slate-100 transition-colors shadow-sm"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <School size={16} />
              </div>
              <span className="font-bold text-slate-900">Kingdom Kids</span>
            </div>
          </div>
          
          <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition-colors">
            <Search size={20} />
          </button>
        </header>

        <Navbar onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <main className="min-h-[calc(100vh-56px)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
