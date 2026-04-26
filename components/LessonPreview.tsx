import React from "react";
import { Clock } from "lucide-react";

interface LessonPreviewProps {
  title: string;
  time: string;
  description: string;
}

export function LessonPreview({ title, time, description }: LessonPreviewProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-primary p-5 text-white shadow-xl shadow-primary-dark/20">
      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold backdrop-blur-md">
            COMING UP NEXT
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-secondary-pale">
            <Clock size={12} /> {time}
          </div>
        </div>
        
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-2 max-w-md text-xs text-secondary-pale/80 leading-relaxed">
          {description}
        </p>
        
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-primary transition-transform hover:scale-105 active:scale-95">
            Prepare Materials
          </button>
          <button className="rounded-lg bg-primary-dark/30 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition-colors hover:bg-primary-dark/50">
            Preview Slides
          </button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl transition-transform duration-700 group-hover:scale-125" />
      <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-indigo-300/10 blur-3xl" />
    </div>
  );
}
