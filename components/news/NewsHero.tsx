import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";

interface NewsHeroProps {
  news: any;
  itemVariants: any;
}

export function NewsHero({ news, itemVariants }: NewsHeroProps) {
  if (!news) return null;

  return (
    <motion.section variants={itemVariants} className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={news.image} 
          alt={news.title} 
          className="h-full w-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
      </div>
      
      <div className="relative p-10 lg:p-16 max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-600/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-400 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Featured Announcement
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1]">
          {news.title}
        </h2>
        <p className="text-lg text-slate-300 font-medium leading-relaxed opacity-90">
          {news.excerpt}
        </p>
        <div className="pt-6 flex items-center gap-6">
          <button className="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-slate-900 shadow-lg shadow-white/5 transition-all hover:scale-[1.02] active:scale-95">
            Read Full Story <ArrowUpRight size={18} />
          </button>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <Clock size={14} /> {news.date}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
