import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Group {
  id: string;
  label: string;
  icon: string;
}

interface GroupSelectorProps {
  groups: Group[];
  selectedGroup: string;
  onSelect: (id: string) => void;
  lessons: any[];
}

export function GroupSelector({ groups, selectedGroup, onSelect, lessons }: GroupSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {groups.map((group) => (
        <motion.button
          key={group.id}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(group.id)}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl border p-4 transition-all duration-300",
            selectedGroup === group.id
              ? "border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
              : "border-slate-100 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30"
          )}
        >
          <span className="text-2xl mb-2">{group.icon}</span>
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">{group.label}</span>
          <span className={cn(
            "text-[9px] mt-1.5 font-bold",
            selectedGroup === group.id ? "text-indigo-100" : "text-slate-400"
          )}>
            {lessons.filter(l => l.classGroup === group.id).length} Lessons
          </span>
        </motion.button>
      ))}
    </div>
  );
}
