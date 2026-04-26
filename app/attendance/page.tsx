"use client";

import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  Save,
  CheckCircle,
  User,
  Eye,
  X,
  FileText,
  Upload,
  Mail,
  Phone,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { AttendanceSidebar } from "@/components/attendance/AttendanceSidebar";
import { AttendanceRegister } from "@/components/attendance/AttendanceRegister";
import { AttendanceSummaryModal } from "@/components/attendance/AttendanceSummaryModal";

const categories = [
  { id: "Nursery", label: "Nursery", icon: "👶" },
  { id: "Balavakup", label: "Balavakup", icon: "🎨" },
  { id: "Kumaravakuppu", label: "Kumaravakuppu", icon: "📚" },
  { id: "Jesttavakuppu", label: "Jesttavakuppu", icon: "⚓" },
  { id: "Youvavakuppu", label: "Youvavakuppu", icon: "⚡" },
];

const mockStudents = [
  { id: 1, name: "Sarah Jenkins", category: "Kumaravakuppu", parent: "Michael Jenkins" },
  { id: 2, name: "Noah Williams", category: "Jesttavakuppu", parent: "Sarah Williams" },
  { id: 3, name: "Emma Thompson", category: "Balavakup", parent: "David Thompson" },
  { id: 4, name: "Lucas Garcia", category: "Kumaravakuppu", parent: "Maria Garcia" },
  { id: 5, name: "Chloe Miller", category: "Balavakup", parent: "Robert Miller" },
  { id: 6, name: "James Wilson", category: "Jesttavakuppu", parent: "Linda Wilson" },
  { id: 7, name: "Lily Brown", category: "Nursery", parent: "Susan Brown" },
  { id: 8, name: "Ethan Davis", category: "Youvavakuppu", parent: "John Davis" },
];

type AttendanceStatus = "present" | "absent" | "late";

import { collection, onSnapshot, query, where, doc, setDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { toast } from "sonner";

export default function AttendancePage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCategory, setSelectedCategory] = useState("Nursery");
  const [searchTerm, setSearchTerm] = useState("");
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [assignedTeacher, setAssignedTeacher] = useState<any>(null);

  // Fetch all students
  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "students"), (snapshot) => {
      const studentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentsData);
    });

    // Fetch all teachers
    const unsubTeachers = onSnapshot(collection(db, "teachers"), (snapshot) => {
      setTeachers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribe();
      unsubTeachers();
    };
  }, []);

  // Update assigned teacher when category changes
  React.useEffect(() => {
    const teacher = teachers.find(t => t.category === selectedCategory);
    setAssignedTeacher(teacher || null);
  }, [selectedCategory, teachers]);

  const [notifiedStudents, setNotifiedStudents] = useState<Record<string, boolean>>({});

  // Fetch attendance for the selected date and category
  React.useEffect(() => {
    const attendanceDocId = `${selectedDate}_${selectedCategory}`;
    const attendanceRef = doc(db, "attendance", attendanceDocId);
    
    setLoading(true);
    const unsubscribe = onSnapshot(attendanceRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAttendance(data.attendance || {});
        setNotifiedStudents(data.notifiedStudents || {});
      } else {
        setAttendance({});
        setNotifiedStudents({});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedDate, selectedCategory]);

  const filteredStudents = students.filter(s => {
    const cat = s.Category || s.category;
    const name = s.Name || s.name || "";
    return cat === selectedCategory && 
           name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const saveAttendance = async (newAttendance: Record<string, AttendanceStatus>, newNotified?: Record<string, boolean>) => {
    try {
      const attendanceDocId = `${selectedDate}_${selectedCategory}`;
      const attendanceData = {
        date: selectedDate,
        category: selectedCategory,
        attendance: newAttendance,
        notifiedStudents: newNotified || notifiedStudents,
        updatedAt: serverTimestamp(),
        totalStudents: filteredStudents.length,
        presentCount: Object.values(newAttendance).filter(v => v === "present").length
      };

      await setDoc(doc(db, "attendance", attendanceDocId), attendanceData);
    } catch (error) {
      console.error("Auto-save error:", error);
      toast.error("Auto-save failed. Check connection.");
    }
  };

  const handleStatusChange = async (studentId: string, status: AttendanceStatus) => {
    const newAttendance = { ...attendance, [studentId]: status };
    setAttendance(newAttendance);
    await saveAttendance(newAttendance);
  };

  const handleNotifyParent = async (student: any) => {
    const parentName = student.ParentName || student.parent || "Parent";
    const studentName = student.Name || student.name;
    const phone = student.Contact || student.contact;

    if (!phone) {
      toast.error(`No contact number found for ${studentName}'s parent.`);
      return;
    }

    const message = `Hi ${parentName}, ${studentName} was missed at Sunday School today (${selectedDate}). We hope everything is okay! - Sunday School Team`;
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');

    const newNotified = { ...notifiedStudents, [student.id]: true };
    setNotifiedStudents(newNotified);
    await saveAttendance(attendance, newNotified);
    toast.success(`Notification sent for ${studentName}`);
  };

  const markAllAs = async (status: AttendanceStatus) => {
    const newAttendance = { ...attendance };
    filteredStudents.forEach(s => {
      newAttendance[s.id] = status;
    });
    setAttendance(newAttendance);
    await saveAttendance(newAttendance);
  };

  const handleSubmitRegister = async () => {
    if (filteredStudents.length === 0) {
      toast.error("No students in this class to mark attendance.");
      return;
    }

    const loadingToast = toast.loading("Saving attendance register...");
    setIsSubmitting(true);
    try {
      const attendanceDocId = `${selectedDate}_${selectedCategory}`;
      const attendanceData = {
        date: selectedDate,
        category: selectedCategory,
        attendance: attendance,
        updatedAt: serverTimestamp(),
        totalStudents: filteredStudents.length,
        presentCount: Object.values(attendance).filter(v => v === "present").length
      };

      await setDoc(doc(db, "attendance", attendanceDocId), attendanceData);
      toast.success("Attendance saved successfully!", { id: loadingToast });
    } catch (error: any) {
      console.error("Error saving attendance:", error);
      toast.error(`Error: ${error.message}`, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const presentCount = Object.values(attendance).filter(v => v === "present").length;
  const absentCount = Object.values(attendance).filter(v => v === "absent").length;
  const lateCount = Object.values(attendance).filter(v => v === "late").length;

  const studentCounts = categories.reduce((acc, cat) => {
    acc[cat.id] = students.filter(s => (s.Category || s.category) === cat.id).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 pb-10">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Attendance Register</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage participation for <span className="font-bold text-indigo-600">{selectedDate}</span></p>
        </div>
        <div className="flex items-center gap-2.5">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDetailsModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50"
          >
            <Eye size={16} /> View Summary
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmitRegister}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            <Save size={16} /> {isSubmitting ? "Saving..." : "Submit Register"}
          </motion.button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar: Class Groups */}
        <AttendanceSidebar 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
          studentCounts={studentCounts} 
        />

        {/* Right Main Area: Student List */}
        <main className="flex-1 min-w-0 space-y-4">
      {/* Controls Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 rounded-2xl bg-white p-1.5 shadow-sm border border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-xs font-bold transition-all",
                  selectedCategory === cat.id 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                    : "text-slate-500 hover:bg-slate-50"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-sm border border-slate-100">
            <Calendar size={16} className="text-slate-400" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold text-slate-600 outline-none bg-transparent"
            />
          </div>

          {/* Assigned Teacher Display */}
          {assignedTeacher && (
            <div className={cn(
              "flex items-center gap-2 rounded-2xl px-4 py-2.5 shadow-sm border transition-all",
              assignedTeacher.isAvailable 
                ? "bg-white border-slate-100" 
                : "bg-rose-50 border-rose-200"
            )}>
              <User size={16} className={assignedTeacher.isAvailable ? "text-indigo-600" : "text-rose-600"} />
              <span className="text-xs font-bold text-slate-600">
                Teacher: <span className="text-slate-900">{assignedTeacher.name}</span>
              </span>
              <div className={cn(
                "h-2 w-2 rounded-full",
                assignedTeacher.isAvailable ? "bg-emerald-500" : "bg-rose-500 animate-pulse"
              )} />
            </div>
          )}
        </div>
      </div>
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder={`Search ${selectedCategory}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 w-full rounded-xl border border-slate-100 bg-white pl-9 pr-4 text-xs outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-9 flex-1 md:w-36 rounded-xl border border-slate-100 bg-white px-3 text-[11px] font-bold text-slate-700 outline-none focus:border-indigo-600 transition-all shadow-sm"
              />
              <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
                <button 
                  onClick={() => markAllAs("present")}
                  className="rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-tight text-emerald-600 hover:bg-white hover:shadow-sm transition-all"
                >
                  All P
                </button>
                <button 
                  onClick={() => markAllAs("absent")}
                  className="rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-tight text-rose-600 hover:bg-white hover:shadow-sm transition-all"
                >
                  All A
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 mb-4" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Register...</p>
            </div>
          ) : (
            <AttendanceRegister 
              students={filteredStudents} 
              attendance={attendance} 
              notifiedStudents={notifiedStudents}
              onStatusChange={handleStatusChange} 
              onNotifyParent={handleNotifyParent}
              selectedCategory={selectedCategory} 
            />
          )}
        </main>
      </div>

      {/* Attendance Summary Modal */}
      <AttendanceSummaryModal 
        isOpen={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)} 
        selectedDate={selectedDate} 
        presentCount={presentCount} 
        absentCount={absentCount} 
        lateCount={lateCount} 
        categories={categories} 
        students={students} 
        attendance={attendance} 
      />
    </div>
  );
}
