import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  label: string;
  icon: any;
  color: string;
  count: number;
  teacher?: string;
}

interface StudentStatsProps {
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export function StudentStats({ categories, activeCategory, onSelectCategory }: StudentStatsProps) {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.05 } }
      }}
      className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5"
    >
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 }
          }}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectCategory(activeCategory === cat.id ? null : cat.id)}
          className={cn(
            "group relative flex flex-col items-center justify-center rounded-3xl border p-5 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5",
            activeCategory === cat.id 
              ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
              : "border-slate-100 bg-white hover:border-indigo-200"
          )}
        >
          <div className={cn(
            "mb-3 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110",
            activeCategory === cat.id ? "bg-white/20 text-white" : cat.color
          )}>
            <cat.icon size={24} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-bold tracking-tight">{cat.label}</span>
          
          <div className="mt-2 flex flex-col items-center gap-0.5">
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
              activeCategory === cat.id 
                ? "text-indigo-100 border-indigo-500/50" 
                : "text-slate-400 border-slate-50 bg-slate-50/50"
            )}>
              {cat.count} Enrolled
            </span>
            {cat.teacher && (
              <span className={cn(
                "text-[9px] font-medium italic",
                activeCategory === cat.id ? "text-indigo-200" : "text-slate-400"
              )}>
                T: {cat.teacher}
              </span>
            )}
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}
