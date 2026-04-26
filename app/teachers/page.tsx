"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  User, 
  Mail, 
  Phone, 
  MoreVertical, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Calendar,
  Briefcase,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase/config";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";
import { toast } from "sonner";

const categories = [
  { id: "Nursery", label: "Nursery" },
  { id: "Balavakup", label: "Balavakup" },
  { id: "Kumaravakuppu", label: "Kumaravakuppu" },
  { id: "Jesttavakuppu", label: "Jesttavakuppu" },
  { id: "Youvavakuppu", label: "Youvavakuppu" },
];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingTeacher, setEditingTeacher] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Nursery",
    isAvailable: true,
  });

  // Listen to Teachers Collection
  useEffect(() => {
    const q = query(collection(db, "teachers"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTeachers(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
      setLoading(false);
    }, (error) => {
      if (error.message.includes("index")) {
        onSnapshot(collection(db, "teachers"), (snap) => {
          setTeachers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          setLoading(false);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setEditingTeacher(null);
    setForm({ name: "", email: "", phone: "", category: "Nursery", isAvailable: true });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (teacher: any) => {
    setModalMode("edit");
    setEditingTeacher(teacher);
    setForm({
      name: teacher.name || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      category: teacher.category || "Nursery",
      isAvailable: teacher.isAvailable ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(modalMode === "add" ? "Adding teacher..." : "Updating teacher...");
    
    try {
      if (modalMode === "add") {
        await addDoc(collection(db, "teachers"), {
          ...form,
          createdAt: serverTimestamp(),
        });
        toast.success("Teacher added successfully!", { id: loadingToast });
      } else {
        await updateDoc(doc(db, "teachers", editingTeacher.id), {
          ...form,
          updatedAt: serverTimestamp(),
        });
        toast.success("Teacher updated successfully!", { id: loadingToast });
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    }
  };

  const toggleAvailability = async (teacher: any) => {
    const newStatus = !teacher.isAvailable;
    try {
      await updateDoc(doc(db, "teachers", teacher.id), {
        isAvailable: newStatus,
        updatedAt: serverTimestamp(),
      });
      toast.success(`${teacher.name} is now ${newStatus ? 'Available' : 'Unavailable'}`);
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this teacher?")) {
      const loadingToast = toast.loading("Removing teacher...");
      try {
        await deleteDoc(doc(db, "teachers", id));
        toast.success("Teacher removed", { id: loadingToast });
      } catch (error: any) {
        toast.error("Delete failed", { id: loadingToast });
      }
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Teacher Directory</h1>
          <p className="text-slate-500 mt-1">Manage staff profiles and class assignments.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
        >
          <UserPlus size={18} /> Add Teacher
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search teachers by name or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-sm outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all shadow-sm"
          />
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredTeachers.map((teacher) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={teacher.id}
                  className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg",
                        teacher.isAvailable ? "bg-indigo-600 shadow-indigo-200" : "bg-slate-400 shadow-slate-200"
                      )}>
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{teacher.name}</h3>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-1">
                          <Briefcase size={12} /> {teacher.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleOpenEditModal(teacher)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(teacher.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Mail size={14} className="text-slate-400" /> {teacher.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone size={14} className="text-slate-400" /> {teacher.phone}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-2 w-2 rounded-full animate-pulse",
                        teacher.isAvailable ? "bg-emerald-500" : "bg-rose-500"
                      )} />
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        teacher.isAvailable ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {teacher.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <button 
                      onClick={() => toggleAvailability(teacher)}
                      className={cn(
                        "rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                        teacher.isAvailable 
                          ? "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white" 
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                      )}
                    >
                      {teacher.isAvailable ? "Mark Away" : "Mark Present"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl overflow-hidden border border-slate-100"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{modalMode === "add" ? "Add Teacher" : "Edit Teacher"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    required
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Enter name"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      placeholder="email@church.com"
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-indigo-600 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      required
                      value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value})}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-indigo-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Class</label>
                  <select 
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  >
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-2xl bg-slate-100 py-4 text-sm font-bold text-slate-600 transition-all hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {modalMode === "add" ? "Create Profile" : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
