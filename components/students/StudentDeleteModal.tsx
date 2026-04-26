import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

interface StudentDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  onConfirm: () => void;
}

export function StudentDeleteModal({ isOpen, onClose, student, onConfirm }: StudentDeleteModalProps) {
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
            className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100"
          >
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4">
                <Trash2 size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Confirm Deletion</h2>
              <p className="text-sm text-slate-500 mt-2">
                Are you sure you want to delete <span className="font-bold text-slate-900">{student?.name}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-200"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white shadow-lg shadow-rose-600/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
