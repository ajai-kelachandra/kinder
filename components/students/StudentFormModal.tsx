import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  mode: "add" | "edit";
  studentForm: any;
  setStudentForm: (form: any) => void;
  categories: any[];
}

export function StudentFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  mode, 
  studentForm, 
  setStudentForm, 
  categories 
}: StudentFormModalProps) {
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
            className="relative flex flex-col w-full max-w-lg max-h-[90vh] rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 shrink-0">
              <h2 className="text-2xl font-bold text-slate-900">{mode === "add" ? "Add New Student" : "Edit Student Profile"}</h2>
              <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
              <form id="student-form" onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 uppercase tracking-widest text-[10px]">Full Name</label>
                  <input required value={studentForm.name} onChange={(e) => setStudentForm({...studentForm, name: e.target.value})} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition-all focus:border-indigo-600 focus:bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 uppercase tracking-widest text-[10px]">Email Address</label>
                  <input required type="email" value={studentForm.email} onChange={(e) => setStudentForm({...studentForm, email: e.target.value})} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition-all focus:border-indigo-600 focus:bg-white" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 uppercase tracking-widest text-[10px]">Class Level</label>
                    <select value={studentForm.category} onChange={(e) => setStudentForm({...studentForm, category: e.target.value})} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-600 focus:bg-white">
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 uppercase tracking-widest text-[10px]">Age</label>
                    <input type="number" value={studentForm.age} onChange={(e) => setStudentForm({...studentForm, age: e.target.value})} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-600 focus:bg-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 uppercase tracking-widest text-[10px]">Date of Birth</label>
                    <input type="date" value={studentForm.birthday} onChange={(e) => setStudentForm({...studentForm, birthday: e.target.value})} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-600 focus:bg-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 uppercase tracking-widest text-[10px]">Grade / Level</label>
                  <input value={studentForm.grade} onChange={(e) => setStudentForm({...studentForm, grade: e.target.value})} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-600 focus:bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 uppercase tracking-widest text-[10px]">Parent / Guardian</label>
                  <input required value={studentForm.parent} onChange={(e) => setStudentForm({...studentForm, parent: e.target.value})} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-600 focus:bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 uppercase tracking-widest text-[10px]">Contact Number</label>
                  <input required value={studentForm.contact} onChange={(e) => setStudentForm({...studentForm, contact: e.target.value})} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-600 focus:bg-white" />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-4 bg-white p-8 border-t border-slate-50 shrink-0">
              <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-slate-100 py-4 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-200">Cancel</button>
              <button type="submit" form="student-form" className="flex-1 rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-95">
                {mode === "add" ? "Add Student" : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
