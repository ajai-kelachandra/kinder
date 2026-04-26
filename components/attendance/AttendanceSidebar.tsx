import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface AttendanceSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  studentCounts: Record<string, number>;
}

export function AttendanceSidebar({ categories, selectedCategory, onSelectCategory, studentCounts }: AttendanceSidebarProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <aside className="w-full lg:w-52 shrink-0 space-y-3">
      <div className="flex items-center gap-2 px-2 pb-1">
        <div className="h-3 w-1 rounded-full bg-indigo-600" />
        <h2 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Class Groups</h2>
      </div>
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
        {categories.map((cat, idx) => (
          <motion.button
            key={cat.id}
            variants={itemVariants}
            custom={idx}
            whileHover={{ x: 4 }}
            onClick={() => onSelectCategory(cat.id)}
            className={cn(
              "flex items-center gap-2.5 shrink-0 lg:w-full rounded-xl p-2.5 text-left transition-all duration-300",
              selectedCategory === cat.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "bg-white border border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30"
            )}
          >
            <span className="text-lg">{cat.icon}</span>
            <div className="flex flex-col">
              <span className="font-bold text-xs leading-none">{cat.label}</span>
              <span className={cn(
                "text-[9px] mt-0.5",
                selectedCategory === cat.id ? "text-indigo-100" : "text-slate-400"
              )}>
                {studentCounts[cat.id] || 0} Students
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </aside>
  );
}
