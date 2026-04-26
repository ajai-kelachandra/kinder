import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Edit, ArrowRightCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentTableProps {
  students: any[];
  onEdit: (student: any) => void;
  onMove: (student: any) => void;
  onDelete: (student: any) => void;
}

export function StudentTable({ students, onEdit, onMove, onDelete }: StudentTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest sticky left-0 bg-slate-50 z-20 border-r border-slate-100 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">Student</th>
              <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Class</th>
              <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Teacher</th>
              <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Parent</th>
              <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact</th>
              <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Attendance</th>
              <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest sticky right-0 bg-slate-50 z-20 border-l border-slate-100 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout" initial={false}>
              {students.map((student) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={student.id} 
                  className="group transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-5 py-2.5 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-100 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm leading-tight">{student.Name || student.name}</div>
                        <div className="text-[10px] text-slate-400">{student.Email || student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{student.Category || student.category}</span>
                      <span className="text-[10px] text-slate-400">{student.Grade || student.grade}</span>
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <span className="text-xs font-medium text-slate-600 italic">
                      {student.assignedTeacher || "Not Assigned"}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-xs font-medium text-slate-600">
                    {student.ParentName || student.parent}
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                      <Phone size={10} className="text-slate-400" /> {student.Contact || student.contact}
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <div className={cn(
                      "flex items-center gap-2 text-xs font-black",
                      (student.Attendance || student.attendance) >= 80 ? "text-emerald-600" :
                      (student.Attendance || student.attendance) >= 60 ? "text-amber-600" : "text-rose-600"
                    )}>
                      {student.Attendance || student.attendance}%
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <span className={cn(
                      "inline-flex items-center rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-wider",
                      (student.Status || student.status) === "Active" 
                        ? "bg-emerald-50 text-emerald-600" 
                        : "bg-slate-50 text-slate-400"
                    )}>
                      {student.Status || student.status}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-right sticky right-0 bg-white group-hover:bg-slate-50/50 z-10 transition-colors border-l border-slate-100 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-end gap-1">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(student)}
                        title="Edit Student"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                      >
                        <Edit size={14} />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onMove(student)}
                        title="Move to Next Class"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                      >
                        <ArrowRightCircle size={14} />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(student)}
                        title="Delete Student"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
