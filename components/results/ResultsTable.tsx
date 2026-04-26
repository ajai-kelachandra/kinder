import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FileText, MoreVertical, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsTableProps {
  results: any[];
  itemVariants: Variants;
}

export function ResultsTable({ results, itemVariants }: ResultsTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pass": return <CheckCircle2 size={14} className="text-emerald-500" />;
      case "Fail": return <XCircle size={14} className="text-rose-500" />;
      default: return <AlertCircle size={14} className="text-amber-500" />;
    }
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="rounded-[2rem] border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/50 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Name</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Class Group</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Exam Title</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Score</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Grade</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
              <th className="sticky right-0 bg-slate-50/50 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {results.map((row, idx) => (
                <motion.tr 
                  key={row.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 text-xs font-black">
                        {row.student.charAt(0)}
                      </div>
                      <span className="text-[13px] font-bold text-slate-900">{row.student}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{row.class}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-medium text-slate-600">{row.exam}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${row.marks}%` }}
                          transition={{ duration: 1, delay: 0.5 + idx * 0.1, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full",
                            row.marks > 80 ? "bg-emerald-500" : row.marks > 50 ? "bg-amber-500" : "bg-rose-500"
                          )} 
                        />
                      </div>
                      <span className="text-xs font-black text-slate-900">{row.marks}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-black text-slate-900">{row.grade}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest",
                      row.status === "Pass" ? "bg-emerald-50 text-emerald-600" : row.status === "Fail" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {getStatusIcon(row.status)}
                      {row.status}
                    </div>
                  </td>
                  <td className="sticky right-0 bg-white group-hover:bg-slate-50/50 px-6 py-4 text-center shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)] transition-colors">
                    <div className="flex items-center justify-center gap-2">
                      <motion.button whileHover={{ scale: 1.1 }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all"><FileText size={16} /></motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all"><MoreVertical size={16} /></motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
