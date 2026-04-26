"use client";

import React from "react";
import { Search, Bell, User, LogOut, Settings, ChevronDown, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      await signOut(auth);
      toast.success("Signed out safely", {
        description: "Come back soon!"
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed", {
        description: "Please try again or refresh the page."
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 hidden lg:flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-xl">
      <div className="flex w-full max-w-xl items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search lessons, students, or events..."
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-pink-500 ring-2 ring-white"></span>
        </button>
        
        <div className="h-6 w-px bg-slate-200 mx-1"></div>
        
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 rounded-xl p-1 pr-2.5 hover:bg-slate-100 transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <User size={18} />
            </div>
            <div className="hidden text-left md:block">
              <div className="text-xs font-bold text-slate-900 leading-none">{user?.displayName || "Admin User"}</div>
              <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-black">Administration</div>
            </div>
            <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 z-50 w-56 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-200/50"
                >
                  <div className="px-3 py-2.5 border-b border-slate-50 mb-1">
                    <p className="text-xs font-bold text-slate-900 leading-none">{user?.displayName || "Admin User"}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{user?.email || "No email"}</p>
                  </div>
                  
                  <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    <User size={14} /> Your Profile
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    <Settings size={14} /> Settings
                  </button>
                  
                  <div className="my-1 border-t border-slate-50" />
                  
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
