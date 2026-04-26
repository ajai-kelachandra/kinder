import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  categories: any[];
  onMove: (newCategory: string) => void;
}

export function StudentMoveModal({ isOpen, onClose, student, categories, onMove }: StudentMoveModalProps) {
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl border border-slate-100"
          >
            <div className="text-center mb-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
                <ArrowRightCircle size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">Promote Student</h2>
              <p className="text-xs text-slate-500 mt-1">Move <span className="font-bold text-slate-900">{student?.name}</span> to which class?</p>
            </div>

            <div className="grid gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onMove(cat.id)}
                  disabled={student?.category === cat.id}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-2.5 transition-all hover:scale-[1.01] active:scale-[0.99]",
                    student?.category === cat.id 
                      ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed" 
                      : "border-slate-100 bg-white hover:border-emerald-200 hover:shadow-md"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
                      {cat.icon && <cat.icon size={16} className="text-slate-400" />}
                    </span>
                    <span className="text-sm font-bold text-slate-700">{cat.label}</span>
                  </div>
                  {student?.category === cat.id && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Current</span>
                  )}
                </button>
              ))}
            </div>

            <button 
              onClick={onClose}
              className="mt-4 w-full rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-200"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
