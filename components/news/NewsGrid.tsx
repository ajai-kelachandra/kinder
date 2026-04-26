import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Share2, Clock, ChevronRight, Newspaper } from "lucide-react";

interface NewsGridProps {
  newsItems: any[];
  itemVariants: any;
}

export function NewsGrid({ newsItems, itemVariants }: NewsGridProps) {
  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {newsItems.map((news, idx) => (
          <motion.article
            key={news.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -8 }}
            className="group flex flex-col overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-sm transition-shadow hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
          >
            <div className="aspect-[16/10] overflow-hidden shrink-0">
              <img 
                src={news.image} 
                alt={news.title} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            </div>
            
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  {news.category}
                </span>
                <div className="flex gap-2">
                  <button className="text-slate-300 hover:text-indigo-600 transition-colors"><Bookmark size={14} /></button>
                  <button className="text-slate-300 hover:text-indigo-600 transition-colors"><Share2 size={14} /></button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                {news.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                {news.excerpt}
              </p>
              
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <Clock size={12} /> {news.date}
                </span>
                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </AnimatePresence>

      {newsItems.length === 0 && (
        <div className="col-span-full py-20 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
            <Newspaper size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No news found</h3>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search or category filter.</p>
        </div>
      )}
    </motion.div>
  );
}
