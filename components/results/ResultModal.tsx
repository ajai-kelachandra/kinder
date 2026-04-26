import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, X } from "lucide-react";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  examTypes: string[];
}

export function ResultModal({ isOpen, onClose, examTypes }: ResultModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg rounded-[32px] bg-white shadow-2xl border border-slate-100 p-8 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <GraduationCap size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Record New Result</h2>
              </div>
              <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Student Name</label>
                <input type="text" placeholder="Select or type student name..." className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Exam Type</label>
                  <select className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none focus:border-indigo-600 transition-all shadow-sm">
                    {examTypes.slice(1).map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Marks (%)</label>
                  <input type="number" placeholder="0-100" className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={onClose} className="flex-1 rounded-2xl bg-slate-100 py-4 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all">Cancel</button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-2xl bg-indigo-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-600/20 transition-all"
                >
                  Submit Result
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
