"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Calendar, 
  Settings, 
  ChevronRight,
  School,
  CheckCircle2,
  CalendarDays,
  Trophy,
  Newspaper,
  LogOut,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: BookOpen, label: "Lessons", href: "/lessons" },
  { icon: Users, label: "Students", href: "/students" },
  { icon: Briefcase, label: "Teachers", href: "/teachers" },
  { icon: CheckCircle2, label: "Attendance", href: "/attendance" },
  { icon: Trophy, label: "Results", href: "/results" },
  { icon: CalendarDays, label: "Calendar", href: "/calendar" },
  { icon: Calendar, label: "Events", href: "/events" },
  { icon: Newspaper, label: "Diocese News", href: "/news" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-[#f8fafc] transition-all duration-300 shadow-sm">
      <div className="flex h-full flex-col px-4 py-4">
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
            <School size={20} />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
          Kingdom Kids
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3 py-2 text-[13px] font-bold transition-all duration-200",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={cn(
                    "transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"
                  )} />
                  {item.label}
                </div>
                {isActive && <ChevronRight size={12} />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-bold text-rose-600 transition-all hover:bg-rose-50"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
