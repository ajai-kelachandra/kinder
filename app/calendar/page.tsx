"use client";

import React, { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  MoreVertical,
  ChevronDown,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "framer-motion";

import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { AgendaSidebar } from "@/components/calendar/AgendaSidebar";

// Helper to generate calendar days
const getDaysInMonth = (month: number, year: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const mockEvents = [
  { id: 1, day: 15, title: "Bible Study", type: "academic", color: "indigo" },
  { id: 2, day: 18, title: "Youth Camp", type: "event", color: "emerald" },
  { id: 3, day: 22, title: "Teacher Meet", type: "admin", color: "amber" },
  { id: 4, day: 15, title: "Choir Practice", type: "event", color: "rose" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
} as const;

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
} as const;

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const days = getDaysInMonth(month, year);
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col xl:flex-row gap-6 pb-10"
    >
      {/* Main Calendar View */}
      <motion.div variants={itemVariants} className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Academic Calendar</h1>
            <p className="text-slate-500 mt-1">Schedule and manage school-wide events and classes.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
              <ChevronLeft size={20} />
            </button>
            <div className="px-4 text-sm font-black uppercase tracking-widest text-slate-900 min-w-[140px] text-center">
              {monthName} {year}
            </div>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <CalendarGrid 
          days={days}
          blanks={blanks}
          weekDays={weekDays}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          mockEvents={mockEvents}
        />
      </motion.div>

      <AgendaSidebar 
        selectedDate={selectedDate}
        mockEvents={mockEvents}
        itemVariants={itemVariants}
      />
    </motion.div>
  );
}
