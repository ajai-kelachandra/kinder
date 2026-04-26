import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: any;
}

export function LessonDetailModal({ isOpen, onClose, lesson }: LessonDetailModalProps) {
  if (!lesson) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-[40px] bg-white shadow-2xl border border-slate-100 overflow-hidden"
          >
            {/* Panoramic Header */}
            <div className="relative h-48 w-full overflow-hidden shrink-0">
              {lesson.image ? (
                <img src={lesson.image} className="h-full w-full object-cover" alt="" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-indigo-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-6 left-8">
                <span className="rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-600/20">
                  {lesson.Category || lesson.category}
                </span>
                <h2 className="mt-2 text-3xl font-black text-slate-900 tracking-tight">{lesson.Title || lesson.title}</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Target Class</div>
                  <div className="text-sm font-bold text-slate-900">{lesson.classGroup}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Scheduled Date</div>
                  <div className="text-sm font-bold text-slate-900">{lesson.Date || lesson.date}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</div>
                  <div className={cn(
                    "text-sm font-bold",
                    lesson.status === "Published" ? "text-emerald-600" : "text-amber-600"
                  )}>{lesson.status}</div>
                </div>
              </div>

              <div className="space-y-8">
                <section>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" /> Lesson Overview
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {lesson.Description || lesson.description} This curriculum focuses on deep spiritual understanding through interactive storytelling and group activities.
                  </p>
                </section>

                <section className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-4">Learning Objectives</h4>
                    <ul className="space-y-3">
                      {["Understand historical context", "Identify core moral themes", "Apply to modern life"].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-700">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-300" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-4">Teaching Notes</h4>
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4 text-[11px] font-bold text-indigo-700 leading-relaxed italic">
                      "Encourage students to share personal experiences related to the themes of obedience and trust during the middle of the session."
                    </div>
                  </div>
                </section>

                {lesson.files && lesson.files.length > 0 && (
                  <section>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-4">Curriculum Materials</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {lesson.files.map((file: any, i: number) => (
                        <a 
                          key={i}
                          href={file.data} 
                          download={file.name}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-200 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white border border-slate-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <Upload size={14} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-700 line-clamp-1">{file.name}</span>
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{file.type.split('/')[1]} file</span>
                            </div>
                          </div>
                          <div className="text-[8px] font-black uppercase tracking-widest text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">Download</div>
                        </a>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-between bg-white px-8 py-6 border-t border-slate-50">
              <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                <Upload size={14} /> Update Media
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={onClose}
                  className="rounded-2xl bg-slate-100 px-6 py-3 text-xs font-bold text-slate-500 hover:bg-slate-200 transition-all"
                >
                  Close Preview
                </button>
                <button className="rounded-2xl bg-slate-900 px-8 py-3 text-xs font-bold text-white shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Print Curriculum
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
