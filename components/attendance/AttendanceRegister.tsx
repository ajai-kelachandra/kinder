import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, CheckCircle2, XCircle, Clock, Search, MessageCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type AttendanceStatus = "present" | "absent" | "late";

interface AttendanceRegisterProps {
  students: any[];
  attendance: Record<string, AttendanceStatus>;
  notifiedStudents: Record<string, boolean>;
  onStatusChange: (id: string, status: AttendanceStatus) => void;
  onNotifyParent: (student: any) => void;
  selectedCategory: string;
}

export function AttendanceRegister({ 
  students, 
  attendance, 
  notifiedStudents,
  onStatusChange, 
  onNotifyParent,
  selectedCategory 
}: AttendanceRegisterProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Participation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout">
              {students.map((student) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, scale: 0.98, x: -4 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98, x: 4 }}
                  transition={{ duration: 0.2 }}
                  key={student.id} 
                  className="group transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-6 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{student.Name || student.name}</div>
                        <div className="text-[10px] text-slate-400 leading-none">Guardian: {student.ParentName || student.parent}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2.5">
                    <div className="flex items-center justify-center gap-1.5">
                      {(["present", "absent", "late"] as const).map((status) => {
                        const isActive = attendance[student.id] === status;
                        const Icon = status === "present" ? CheckCircle2 : status === "absent" ? XCircle : Clock;
                        const activeColor = status === "present" ? "bg-emerald-600 shadow-emerald-200" : status === "absent" ? "bg-rose-600 shadow-rose-200" : "bg-amber-500 shadow-amber-200";
                        const hoverColor = status === "present" ? "hover:bg-emerald-50 hover:text-emerald-600" : status === "absent" ? "hover:bg-rose-50 hover:text-rose-600" : "hover:bg-amber-50 hover:text-amber-500";
                        
                        return (
                          <motion.button
                            key={status}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onStatusChange(student.id, status)}
                            className={cn(
                              "flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-black transition-all",
                              isActive ? cn(activeColor, "text-white shadow-lg") : cn("bg-slate-50 text-slate-400", hoverColor)
                            )}
                          >
                            <Icon size={14} />
                            <span className="capitalize hidden sm:inline">{status}</span>
                          </motion.button>
                        );
                      })}

                      {/* Notify Parent Button */}
                      {(attendance[student.id] === "absent" || attendance[student.id] === "late") && (
                        <motion.button
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          onClick={() => onNotifyParent(student)}
                          className={cn(
                            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-black transition-all ml-2",
                            notifiedStudents[student.id] 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                              : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:scale-105"
                          )}
                        >
                          {notifiedStudents[student.id] ? (
                            <><Check size={14} /> <span className="hidden sm:inline">Notified</span></>
                          ) : (
                            <><MessageCircle size={14} /> <span className="hidden sm:inline">Notify Parent</span></>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {students.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="mb-6 rounded-full bg-slate-50 p-8">
            <Search size={48} className="text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No matching students</h3>
          <p className="text-slate-500 mt-2 max-w-xs">We couldn't find any students in {selectedCategory} matching your search.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
