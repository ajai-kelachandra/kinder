import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: number;
  type: string;
  title: string;
  time: string;
  status: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-premium overflow-hidden">
      <div className="divide-y divide-slate-100">
        {activities.map((activity) => (
          <div key={activity.id} className="group flex items-center gap-3 p-2.5 transition-colors hover:bg-slate-50">
            <div className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
              activity.type === "Lesson" ? "bg-indigo-50 text-indigo-600" :
              activity.type === "Student" ? "bg-pink-50 text-pink-600" :
              activity.type === "Event" ? "bg-purple-50 text-purple-600" :
              "bg-emerald-50 text-emerald-600"
            )}>
              <CheckCircle2 size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{activity.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{activity.type}</span>
                <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                <span className="text-[10px] text-slate-500">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full py-3 text-[10px] font-bold text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all border-t border-slate-100 uppercase tracking-widest">
        VIEW FULL HISTORY
      </button>
    </div>
  );
}
