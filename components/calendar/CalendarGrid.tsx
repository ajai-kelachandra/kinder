import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  days: Date[];
  blanks: number[];
  weekDays: string[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  mockEvents: any[];
}

export function CalendarGrid({ 
  days, 
  blanks, 
  weekDays, 
  selectedDate, 
  onSelectDate,
  mockEvents 
}: CalendarGridProps) {
  return (
    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/50 overflow-hidden">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-slate-50">
        {weekDays.map((day) => (
          <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[1fr]">
        {blanks.map((i) => (
          <div key={`blank-${i}`} className="aspect-square border-r border-b border-slate-50 last:border-r-0" />
        ))}
        
        <AnimatePresence mode="wait">
          {days.map((date, idx) => {
            const day = date.getDate();
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate.toDateString() === date.toDateString();
            const dayEvents = mockEvents.filter(e => e.day === day);

            return (
              <motion.button
                key={date.toISOString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.01 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectDate(date)}
                className={cn(
                  "group relative aspect-square border-r border-b border-slate-50 p-2 transition-all hover:bg-indigo-50/30 last:border-r-0",
                  isSelected && "bg-indigo-50/50"
                )}
              >
                <span className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-all",
                  isToday ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "text-slate-600 group-hover:text-indigo-600",
                  isSelected && !isToday && "bg-white border border-indigo-200 text-indigo-600 shadow-sm"
                )}>
                  {day}
                </span>

                {/* Event Dots */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
                  {dayEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className={cn("h-1 w-1 rounded-full", `bg-${event.color}-500`)} 
                    />
                  ))}
                </div>

                {/* Active Indicator */}
                {isSelected && (
                  <motion.div 
                    layoutId="active-day"
                    className="absolute inset-0 border-2 border-indigo-600/20 pointer-events-none rounded-xl m-1"
                  />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
