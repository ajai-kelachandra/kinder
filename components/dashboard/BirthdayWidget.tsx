"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cake, ChevronRight, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

interface BirthdayWidgetProps {
  students: any[];
}

export function BirthdayWidget({ students }: BirthdayWidgetProps) {
  const getBirthdaysThisWeek = () => {
    const today = new Date();
    const endOfWeek = new Date();
    endOfWeek.setDate(today.getDate() + 7);

    return students.filter(student => {
      if (!student.Birthday && !student.birthday) return false;
      const bdayStr = student.Birthday || student.birthday;
      const bdayDate = new Date(bdayStr);
      
      // Check if month and day fall within the next 7 days (ignoring year)
      const currentYearBday = new Date(today.getFullYear(), bdayDate.getMonth(), bdayDate.getDate());
      
      // If bday already passed this year, check if it's next year (relevant for December)
      if (currentYearBday < today) {
        currentYearBday.setFullYear(today.getFullYear() + 1);
      }

      return currentYearBday >= today && currentYearBday <= endOfWeek;
    }).sort((a, b) => {
      const dateA = new Date(a.Birthday || a.birthday);
      const dateB = new Date(b.Birthday || b.birthday);
      return dateA.getDate() - dateB.getDate();
    });
  };

  const upcomingBirthdays = getBirthdaysThisWeek();

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <Cake size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Birthdays This Week</h3>
            <p className="text-[10px] font-bold text-slate-400">Celebrate our students</p>
          </div>
        </div>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <Gift size={12} />
        </div>
      </div>

      <div className="space-y-3">
        {upcomingBirthdays.length > 0 ? (
          upcomingBirthdays.map((student, idx) => {
            const bday = new Date(student.Birthday || student.birthday);
            const dateStr = bday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            return (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={student.id}
                className="group flex items-center justify-between rounded-2xl bg-slate-50/50 p-3 transition-all hover:bg-rose-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-rose-500 shadow-sm transition-colors group-hover:bg-rose-500 group-hover:text-white">
                    <span className="text-[10px] font-black">{dateStr.split(' ')[1]}</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{student.Name || student.name}</div>
                    <div className="text-[9px] font-bold text-slate-400">{student.Category || student.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                    {dateStr.split(' ')[0]}
                  </span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-2 rounded-full bg-slate-50 p-3 text-slate-300">
              <Cake size={24} strokeWidth={1.5} />
            </div>
            <p className="text-xs font-bold text-slate-400">No birthdays this week</p>
          </div>
        )}
      </div>

      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-100 py-3 text-[11px] font-black text-slate-500 transition-all hover:bg-slate-50 hover:text-rose-600">
        View Birthday Calendar <ChevronRight size={14} />
      </button>
    </div>
  );
}
