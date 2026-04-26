import React from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonCardProps {
  lesson: any;
  index: number;
  onView: (lesson: any) => void;
}

export function LessonCard({ lesson, index, onView }: LessonCardProps) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="group relative flex flex-col rounded-2xl border border-slate-100 bg-white p-1.5 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer"
    >
      {/* Top Info */}
      <div className="flex items-center justify-between px-1.5 pt-1.5">
        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
          {lesson.Category || lesson.category}
        </span>
        <span className={cn(
          "rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider",
          lesson.status === "Published" 
            ? "bg-emerald-50 text-emerald-600" 
            : "bg-amber-50 text-amber-600"
        )}>
          {lesson.status}
        </span>
      </div>

      {/* Panoramic Thumbnail */}
      <div className="mt-2 aspect-[3.2/1] w-full overflow-hidden rounded-md bg-slate-50">
        {lesson.image ? (
          <img 
            src={lesson.image} 
            alt={lesson.Title || lesson.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <FileText size={16} strokeWidth={1.5} />
          </div>
        )}
      </div>
      
      {/* Content Area */}
      <div className="flex-1 px-1.5 py-2">
        <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{lesson.Title || lesson.title}</h3>
        <p className="mt-0.5 text-[10px] text-slate-500 line-clamp-1 leading-relaxed">{lesson.Description || lesson.description}</p>
        
        <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-2">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
            <Calendar size={10} className="text-indigo-500" /> {lesson.Date || lesson.date}
          </div>
          <div className="flex items-center gap-1">
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: "#f8fafc" }}
              whileTap={{ scale: 0.9 }}
              className="rounded-lg p-1 text-slate-400 transition-colors"
            >
              <MoreVertical size={14} />
            </motion.button>
            <motion.button 
              onClick={(e) => {
                e.stopPropagation();
                onView(lesson);
              }}
              whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-slate-900 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white transition-all"
            >
              View
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
