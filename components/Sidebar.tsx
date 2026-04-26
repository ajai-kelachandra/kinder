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
  Briefcase,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
}

export function Sidebar({ isOpen, onClose, isCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const SidebarContent = (
    <div className={cn("flex h-full flex-col py-4", isCollapsed ? "px-2" : "px-4")}>
      <div className={cn("mb-6 flex items-center justify-between px-2", isCollapsed && "justify-center")}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shrink-0">
            <School size={20} />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold tracking-tight text-slate-900 animate-in fade-in duration-500">
            Kingdom Kids
            </span>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-xl">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              title={isCollapsed ? item.label : ""}
              className={cn(
                "group flex items-center rounded-xl py-2 text-[13px] font-bold transition-all duration-200",
                isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "justify-between px-3",
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
                {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">{item.label}</span>}
              </div>
              {isActive && !isCollapsed && <ChevronRight size={12} />}
            </Link>
          );
        })}
      </nav>

      <div className={cn("mt-4 pt-4 border-t border-slate-100", isCollapsed && "flex justify-center")}>
        <button 
          onClick={handleLogout}
          title={isCollapsed ? "Sign Out" : ""}
          className={cn(
            "flex items-center gap-3 rounded-xl py-2 text-[13px] font-bold text-rose-600 transition-all hover:bg-rose-50",
            isCollapsed ? "h-10 w-10 justify-center px-0" : "w-full px-3"
          )}
        >
          <LogOut size={18} />
          {!isCollapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex fixed left-0 top-0 z-40 h-screen border-r border-slate-200 bg-[#f8fafc] shadow-sm transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}>
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-[60] h-screen w-72 border-r border-slate-200 bg-white shadow-2xl lg:hidden"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
