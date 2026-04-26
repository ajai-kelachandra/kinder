"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  User, 
  Users,
  MoreVertical, 
  Mail, 
  Phone, 
  Filter,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  X,
  Edit,
  Trash2,
  ArrowRightCircle,
  Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { StudentStats } from "@/components/students/StudentStats";
import { StudentTable } from "@/components/students/StudentTable";
import { StudentFormModal } from "@/components/students/StudentFormModal";
import { StudentMoveModal } from "@/components/students/StudentMoveModal";
import { StudentDeleteModal } from "@/components/students/StudentDeleteModal";

// Mock data for students
const initialStudents = [
  { id: 1, name: "Sarah Jenkins", age: 8, grade: "3rd Grade", category: "Kumaravakuppu", parent: "Michael Jenkins", contact: "555-0101", status: "Active", email: "sarah.j@example.com", attendance: 95 },
  { id: 2, name: "Noah Williams", age: 10, grade: "5th Grade", category: "Jesttavakuppu", parent: "Sarah Williams", contact: "555-0102", status: "Active", email: "noah.w@example.com", attendance: 88 },
  { id: 3, name: "Emma Thompson", age: 6, grade: "1st Grade", category: "Balavakup", parent: "David Thompson", contact: "555-0103", status: "Inactive", email: "emma.t@example.com", attendance: 45 },
  { id: 4, name: "Lucas Garcia", age: 9, grade: "4th Grade", category: "Kumaravakuppu", parent: "Maria Garcia", contact: "555-0104", status: "Active", email: "lucas.g@example.com", attendance: 92 },
  { id: 5, name: "Chloe Miller", age: 7, grade: "2nd Grade", category: "Balavakup", parent: "Robert Miller", contact: "555-0105", status: "Active", email: "chloe.m@example.com", attendance: 78 },
  { id: 6, name: "James Wilson", age: 11, grade: "6th Grade", category: "Jesttavakuppu", parent: "Linda Wilson", contact: "555-0106", status: "Active", email: "james.w@example.com", attendance: 85 },
  { id: 7, name: "Lily Brown", age: 5, grade: "Kindergarten", category: "Nursery", parent: "Susan Brown", contact: "555-0107", status: "Active", email: "lily.b@example.com", attendance: 98 },
  { id: 8, name: "Ethan Davis", age: 16, grade: "11th Grade", category: "Youvavakuppu", parent: "John Davis", contact: "555-0108", status: "Inactive", email: "ethan.d@example.com", attendance: 55 },
];

import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { toast } from "sonner";

const categories = [
  { id: "Nursery", label: "Nursery", icon: GraduationCap, color: "bg-pink-50 text-pink-600" },
  { id: "Balavakup", label: "Balavakup", icon: User, color: "bg-indigo-50 text-indigo-600" },
  { id: "Kumaravakuppu", label: "Kumaravakuppu", icon: Users, color: "bg-emerald-50 text-emerald-600" },
  { id: "Jesttavakuppu", label: "Jesttavakuppu", icon: Users, color: "bg-amber-50 text-amber-600" },
  { id: "Youvavakuppu", label: "Youvavakuppu", icon: GraduationCap, color: "bg-purple-50 text-purple-600" },
];

import * as XLSX from 'xlsx';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loadingToast = toast.loading(`Importing students from ${file.name}...`);
    
    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);

          if (data.length === 0) {
            toast.error("The file is empty.", { id: loadingToast });
            return;
          }

          let successCount = 0;
          for (const row of data as any[]) {
            const studentData = {
              Name: row.Name || row.name || row.StudentName || "Unknown",
              Email: row.Email || row.email || "",
              Category: row.Category || row.category || "Nursery",
              Grade: row.Grade || row.grade || "",
              ParentName: row.ParentName || row.parent || row.Guardian || "",
              Contact: row.Contact || row.contact || row.Phone || "",
              Age: row.Age || row.age || "",
              Attendance: 100,
              createdAt: serverTimestamp()
            };
            await addDoc(collection(db, "students"), studentData);
            successCount++;
          }

          toast.success(`Successfully imported ${successCount} students!`, { id: loadingToast });
          if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err: any) {
          console.error("Parse error:", err);
          toast.error(`Failed to parse file: ${err.message}`, { id: loadingToast });
        }
      };
      reader.readAsBinaryString(file);
    } catch (error: any) {
      console.error("Import error:", error);
      toast.error(`Import failed: ${error.message}`, { id: loadingToast });
    }
  };
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingStudent, setEditingStudent] = useState<any>(null);
  
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [studentToMove, setStudentToMove] = useState<any>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  // Fetch students and attendance records
  React.useEffect(() => {
    let unsubscribeStudents: () => void;
    let unsubscribeAttendance: () => void;
    let unsubscribeTeachers: () => void;

    const setupListeners = () => {
      // Students Listener
      const qStudents = query(collection(db, "students"), orderBy("createdAt", "desc"));
      unsubscribeStudents = onSnapshot(qStudents, (snapshot) => {
        setStudents(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data({ serverTimestamps: 'estimate' })
        })));
        setLoading(false);
      }, (error) => {
        if (error.message.includes("index")) {
          onSnapshot(query(collection(db, "students")), (snap) => {
            setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
          });
        }
      });

      // Attendance Records Listener (for dynamic percentage)
      const qAttendance = query(collection(db, "attendance"));
      unsubscribeAttendance = onSnapshot(qAttendance, (snapshot) => {
        setAttendanceRecords(snapshot.docs.map(doc => doc.data()));
      });

      // Teachers Listener
      const qTeachers = query(collection(db, "teachers"));
      unsubscribeTeachers = onSnapshot(qTeachers, (snapshot) => {
        setTeachers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      return () => {
        unsubscribeStudents?.();
        unsubscribeAttendance?.();
        unsubscribeTeachers?.();
      };
    };

    const cleanup = setupListeners();
    return () => cleanup();
  }, []);

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    category: "Nursery",
    grade: "",
    parent: "",
    contact: "",
    age: "",
    birthday: ""
  });

  // Calculate dynamic attendance and map teachers for each student
  const studentsWithDynamicStats = React.useMemo(() => {
    return students.map(student => {
      const studentId = student.id;
      const category = student.Category || student.category;
      let presentCount = 0;
      let totalSessions = 0;

      attendanceRecords.forEach(record => {
        const status = record.attendance?.[studentId];
        if (status) {
          totalSessions++;
          if (status === "present") presentCount++;
        }
      });

      const attendancePercentage = totalSessions > 0 
        ? Math.round((presentCount / totalSessions) * 100) 
        : 100;

      // Find assigned teacher
      const teacher = teachers.find(t => t.category === category);

      return {
        ...student,
        Attendance: attendancePercentage,
        assignedTeacher: teacher?.name || "Unassigned"
      };
    });
  }, [students, attendanceRecords, teachers]);

  const dynamicCategories = React.useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      count: students.filter(s => (s.Category || s.category) === cat.id).length,
      teacher: teachers.find(t => t.category === cat.id)?.name
    }));
  }, [students, teachers]);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setEditingStudent(null);
    setStudentForm({ name: "", email: "", category: "Nursery", grade: "", parent: "", contact: "", age: "", birthday: "" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student: any) => {
    setModalMode("edit");
    setEditingStudent(student);
    setStudentForm({
      name: student.Name || student.name,
      email: student.Email || student.email,
      category: student.Category || student.category,
      grade: student.Grade || student.grade,
      parent: student.ParentName || student.parent,
      contact: student.Contact || student.contact,
      age: (student.Age || student.age || "").toString(),
      birthday: student.Birthday || student.birthday || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(modalMode === "add" ? "Adding student..." : "Updating student...");
    
    try {
      const studentData = {
        Name: studentForm.name,
        Email: studentForm.email,
        Category: studentForm.category,
        Grade: studentForm.grade,
        ParentName: studentForm.parent,
        Contact: studentForm.contact,
        Age: parseInt(studentForm.age) || 0,
        Birthday: studentForm.birthday,
        Status: "Active",
        Attendance: editingStudent?.Attendance || 100,
        updatedAt: serverTimestamp(),
        createdAt: editingStudent?.createdAt || serverTimestamp()
      };

      if (modalMode === "add") {
        await addDoc(collection(db, "students"), studentData);
        toast.success("Student added successfully!", { id: loadingToast });
      } else {
        await updateDoc(doc(db, "students", editingStudent.id), studentData);
        toast.success("Student updated successfully!", { id: loadingToast });
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving student:", error);
      toast.error(`Error: ${error.message}`, { id: loadingToast });
    }
  };

  const handleDeleteStudent = (student: any) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      const loadingToast = toast.loading("Deleting student...");
      try {
        await deleteDoc(doc(db, "students", studentToDelete.id));
        toast.success("Student deleted successfully!", { id: loadingToast });
        setIsDeleteModalOpen(false);
        setStudentToDelete(null);
      } catch (error: any) {
        toast.error(`Error: ${error.message}`, { id: loadingToast });
      }
    }
  };

  const handleMoveStudent = (student: any) => {
    setStudentToMove(student);
    setIsMoveModalOpen(true);
  };

  const confirmMove = async (newCategory: string) => {
    if (studentToMove) {
      const loadingToast = toast.loading("Moving student...");
      try {
        await updateDoc(doc(db, "students", studentToMove.id), {
          Category: newCategory,
          updatedAt: serverTimestamp()
        });
        toast.success("Student moved to new class!", { id: loadingToast });
        setIsMoveModalOpen(false);
        setStudentToMove(null);
      } catch (error: any) {
        toast.error(`Error: ${error.message}`, { id: loadingToast });
      }
    }
  };

  const filteredStudents = studentsWithDynamicStats.filter(s => {
    const name = (s.Name || s.name || "").toLowerCase();
    const parent = (s.ParentName || s.parent || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = name.includes(search) || parent.includes(search);
    const matchesCategory = activeCategory ? (s.Category || s.category) === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const currentStudents = filteredStudents; // Simplifying for this view

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Students Directory</h1>
          <p className="text-slate-500 mt-1">Manage student profiles and enrollment levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
          />
          <button 
            onClick={handleImportClick}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
          >
            <Upload size={18} /> Bulk Import
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={18} /> Add Student
          </button>
        </div>
      </div>

      {/* Category Tiles */}
      <StudentStats 
        categories={dynamicCategories} 
        activeCategory={activeCategory} 
        onSelectCategory={(id) => {
          setActiveCategory(id === activeCategory ? null : id); // Allow deselecting
          setCurrentPage(1);
        }} 
      />

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Quick search student or parent..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
          />
        </div>
        <button 
          onClick={() => {
            setActiveCategory(null);
            setSearchTerm("");
          }}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Students Table */}
      <StudentTable 
        students={currentStudents} 
        onEdit={handleOpenEditModal} 
        onMove={handleMoveStudent} 
        onDelete={handleDeleteStudent} 
      />

      {/* Add/Edit Student Modal */}
      <StudentFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmitForm} 
        mode={modalMode} 
        studentForm={studentForm} 
        setStudentForm={setStudentForm} 
        categories={categories} 
      />

      {/* Move to Next Class Modal */}
      <StudentMoveModal 
        isOpen={isMoveModalOpen} 
        onClose={() => setIsMoveModalOpen(false)} 
        student={studentToMove} 
        categories={categories} 
        onMove={confirmMove} 
      />

      {/* Delete Confirmation Modal */}
      <StudentDeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        student={studentToDelete} 
        onConfirm={confirmDelete} 
      />
    </div>
  );
}
