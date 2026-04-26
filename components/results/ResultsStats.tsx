import React from "react";
import { motion, Variants } from "framer-motion";
import { Trophy, GraduationCap, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsStatsProps {
  itemVariants: Variants;
}

export function ResultsStats({ itemVariants }: ResultsStatsProps) {
  const stats = [
    { label: "Class Average", value: "84.5%", icon: Trophy, color: "indigo" },
    { label: "Pass Percentage", value: "92.0%", icon: GraduationCap, color: "emerald" },
    { label: "Pending Evaluations", value: "12 Students", icon: AlertCircle, color: "amber" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <motion.div 
          key={i} 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer"
        >
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl mb-4", `bg-${stat.color}-50 text-${stat.color}-600`)}>
            <stat.icon size={20} />
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none">{stat.value}</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
