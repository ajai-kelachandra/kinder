import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newLesson: any;
  setNewLesson: (lesson: any) => void;
  classGroups: any[];
}

export function LessonUploadModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  newLesson, 
  setNewLesson, 
  classGroups 
}: LessonUploadModalProps) {
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
            <div className="flex items-center justify-between bg-white px-8 py-6 border-b border-slate-50">
              <h2 className="text-2xl font-bold text-slate-900">Upload Lesson</h2>
              <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
              <form id="upload-lesson-form" onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Class Group</label>
                  <select 
                    value={newLesson.classGroup}
                    onChange={(e) => setNewLesson({...newLesson, classGroup: e.target.value})}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  >
                    {classGroups.map(group => (
                      <option key={group.id} value={group.id}>{group.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lesson Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. The Story of David"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                  <textarea 
                    required
                    rows={2}
                    placeholder="Brief description..."
                    value={newLesson.description}
                    onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                    <select 
                      value={newLesson.category}
                      onChange={(e) => setNewLesson({...newLesson, category: e.target.value})}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                    >
                      <option>Old Testament</option>
                      <option>New Testament</option>
                      <option>Life Skills</option>
                      <option>Stories</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</label>
                    <input 
                      type="date" 
                      value={newLesson.date}
                      onChange={(e) => setNewLesson({...newLesson, date: e.target.value})}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div 
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className={cn(
                    "rounded-2xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer",
                    newLesson.tempFiles?.length > 0 
                      ? "border-emerald-200 bg-emerald-50/50" 
                      : "border-slate-200 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200"
                  )}
                >
                  <input 
                    id="file-upload"
                    type="file" 
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setNewLesson({ ...newLesson, tempFiles: files });
                    }}
                  />
                  <Upload className={cn("mx-auto mb-2", newLesson.tempFiles?.length > 0 ? "text-emerald-600" : "text-indigo-600")} size={24} />
                  <p className="text-[11px] font-bold text-slate-900">
                    {newLesson.tempFiles?.length > 0 
                      ? `${newLesson.tempFiles.length} files selected` 
                      : "Upload curriculum files"}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider">
                    {newLesson.tempFiles?.length > 0 
                      ? newLesson.tempFiles.map((f: any) => f.name).join(', ')
                      : "PDF, DOCX, or Images"}
                  </p>
                </div>
              </form>
            </div>

            <div className="flex gap-4 bg-white p-8 border-t border-slate-50">
              <button onClick={onClose} className="flex-1 rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-500 hover:bg-slate-200">Cancel</button>
              <button type="submit" form="upload-lesson-form" className="flex-1 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Confirm Upload</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
