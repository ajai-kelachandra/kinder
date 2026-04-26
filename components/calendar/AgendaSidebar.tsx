import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  Plus, 
  Clock, 
  MapPin, 
  MoreVertical, 
  Calendar as CalendarIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AgendaSidebarProps {
  selectedDate: Date;
  mockEvents: any[];
  itemVariants: Variants;
}

export function AgendaSidebar({ selectedDate, mockEvents, itemVariants }: AgendaSidebarProps) {
  return (
    <motion.aside variants={itemVariants} className="w-full xl:w-80 shrink-0 space-y-6">
      {/* Selected Date Summary */}
      <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Selected Date</div>
        <div className="text-4xl font-black mb-1">{selectedDate.getDate()}</div>
        <div className="text-lg font-bold text-indigo-400 mb-6">{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus size={16} /> Add Event
        </motion.button>
      </div>

      {/* Daily Agenda */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 px-2 flex items-center justify-between">
          Schedule for Today
          <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black">2 EVENTS</span>
        </h3>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {mockEvents.filter(e => e.day === selectedDate.getDate()).length > 0 ? (
              mockEvents.filter(e => e.day === selectedDate.getDate()).map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative flex flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={cn(
                      "rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider",
                      `bg-${event.color}-50 text-${event.color}-600`
                    )}>
                      {event.type}
                    </span>
                    <button className="text-slate-300 hover:text-slate-600">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{event.title}</h4>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <Clock size={12} className="text-indigo-500" /> 09:30 AM - 11:00 AM
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <MapPin size={12} className="text-indigo-500" /> Youth Hall, Wing B
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 px-6 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/50"
              >
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-slate-300 shadow-sm mb-4">
                  <CalendarIcon size={24} />
                </div>
                <p className="text-xs font-bold text-slate-400">No events scheduled for this date.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
