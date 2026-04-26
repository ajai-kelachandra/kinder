import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Save, Calendar as CalendarIcon, Users, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { exportToCSV } from "@/lib/export";

interface AttendanceSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  categories: any[];
  students: any[];
  attendance: Record<string, string>;
}

export function AttendanceSummaryModal({
  isOpen,
  onClose,
  selectedDate,
  presentCount,
  absentCount,
  lateCount,
  categories,
  students,
  attendance
}: AttendanceSummaryModalProps) {
  const handleDailyExport = () => {
    const data = students.map(s => ({
      date: selectedDate,
      student_name: s.Name || s.name,
      class_category: s.Category || s.category,
      parent_guardian: s.ParentName || s.parent,
      status: attendance[s.id] || "Not Marked"
    }));
    exportToCSV(data, `Attendance_Daily_${selectedDate}`);
  };

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 leading-none">Register Summary</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{selectedDate}</p>
                </div>
              </div>
              <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 text-slate-400 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
              {/* Overall Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 mb-3">Total Participation</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Present", count: presentCount, color: "emerald" },
                    { label: "Absent", count: absentCount, color: "rose" },
                    { label: "Late", count: lateCount, color: "amber" }
                  ].map((stat, i) => (
                    <motion.div 
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                      className={`rounded-2xl bg-${stat.color}-50 p-4 text-center border border-${stat.color}-100 shadow-sm shadow-${stat.color}-600/5`}
                    >
                      <div className={`text-2xl font-black text-${stat.color === 'amber' ? 'amber-500' : stat.color + '-600'} leading-none`}>{stat.count}</div>
                      <div className={`text-[9px] font-black uppercase tracking-widest text-${stat.color === 'amber' ? 'amber-500' : stat.color + '-600'}/60 mt-1`}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Grouped Breakdown */}
              <div className="space-y-6">
                {categories.map((cat, catIdx) => {
                  const classStudents = students.filter(s => (s.Category || s.category) === cat.id);
                  const classPresent = classStudents.filter(s => attendance[s.id] === "present").length;
                  const classAbsent = classStudents.filter(s => attendance[s.id] === "absent").length;
                  
                  return (
                    <motion.div 
                      key={cat.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (catIdx * 0.05) }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 px-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{cat.icon}</span>
                          <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">{cat.label}</h3>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] font-bold">
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{classPresent} Present</span>
                          <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{classAbsent} Absent</span>
                        </div>
                      </div>

                      <div className="grid gap-1.5">
                        {classStudents.map((s) => {
                          const status = attendance[s.id];
                          return (
                            <div key={s.id} className="flex items-center justify-between rounded-xl border border-slate-50 bg-slate-50/50 p-2.5 transition-all hover:bg-white hover:shadow-sm">
                              <div className="flex items-center gap-2.5">
                                <div className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  status === "present" ? "bg-emerald-500" : status === "absent" ? "bg-rose-500" : status === "late" ? "bg-amber-500" : "bg-slate-200"
                                )} />
                                <span className="font-bold text-slate-900 text-xs">{s.Name || s.name}</span>
                              </div>
                              <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest",
                                status === "present" ? "text-emerald-600" : status === "absent" ? "text-rose-600" : status === "late" ? "text-amber-500" : "text-slate-300"
                              )}>
                                {status || "Not Marked"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-50 bg-white shrink-0">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                <motion.button 
                  whileHover={{ y: -2, backgroundColor: "#4f46e5", color: "#fff" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDailyExport}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl bg-indigo-50 p-2 text-[9px] font-black uppercase tracking-wider text-indigo-600 transition-all"
                >
                  <Save size={12} /> Class Daily
                </motion.button>
                <motion.button 
                  whileHover={{ y: -2, backgroundColor: "#4f46e5", color: "#fff" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => alert("Monthly report logic integration pending historical data mapping.")}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl bg-slate-100 p-2 text-[9px] font-black uppercase tracking-wider text-slate-600 transition-all"
                >
                  <CalendarIcon size={12} /> Monthly CSV
                </motion.button>
                <motion.button 
                  whileHover={{ y: -2, backgroundColor: "#4f46e5", color: "#fff" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => alert("Yearly report logic integration pending historical data mapping.")}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl bg-slate-100 p-2 text-[9px] font-black uppercase tracking-wider text-slate-600 transition-all"
                >
                  <Users size={12} /> Yearly CSV
                </motion.button>
                <motion.button 
                  whileHover={{ y: -2, backgroundColor: "#4f46e5", color: "#fff" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDailyExport}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl bg-slate-900 p-2 text-[9px] font-black uppercase tracking-wider text-white transition-all"
                >
                  <FileText size={12} /> Full Export
                </motion.button>
              </div>
              <div className="flex gap-3 mt-1">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-600 transition-all hover:bg-slate-200"
                >
                  Close
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-[2] rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Upload size={16} className="rotate-180" /> Download PDF Report
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
