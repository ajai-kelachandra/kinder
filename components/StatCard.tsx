import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-premium transition-all hover:shadow-xl",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-[10px]">{title}</p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
          
          {trend && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className={cn(
                "flex h-4 items-center rounded-full px-1.5 text-[9px] font-black",
                trend.isPositive 
                  ? "bg-emerald-100 text-emerald-700" 
                  : "bg-rose-100 text-rose-700"
              )}>
                {trend.isPositive ? "+" : "-"}{trend.value}
              </span>
              <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">vs last week</span>
            </div>
          )}
        </div>
        
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
          <Icon size={20} strokeWidth={1.5} />
        </div>
      </div>
      
      {/* Decorative gradient background */}
      <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl transition-all group-hover:bg-indigo-500/10" />
    </div>
  );
}
