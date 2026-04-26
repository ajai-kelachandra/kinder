"use client";

import React, { useState } from "react";
import { 
  Trophy, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Download, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  X,
  ChevronDown,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "framer-motion";

const initialResults = [
  { id: 1, student: "Sarah Jenkins", class: "Kumaravakuppu", exam: "Mid-Term 2026", marks: 88, grade: "A", status: "Pass" },
  { id: 2, student: "Michael Chen", class: "Jesttavakuppu", exam: "Mid-Term 2026", marks: 94, grade: "A+", status: "Pass" },
  { id: 3, student: "Emma Wilson", class: "Balavakup", exam: "Unit Test 1", marks: 72, grade: "B", status: "Pass" },
  { id: 4, student: "James Rodger", class: "Kumaravakuppu", exam: "Mid-Term 2026", marks: 45, grade: "D", status: "Fail" },
  { id: 5, student: "Sophia Lee", class: "Youvavakuppu", exam: "Mid-Term 2026", marks: 91, grade: "A", status: "Pass" },
  { id: 6, student: "Daniel Park", class: "Nursery", exam: "Oral Test", marks: 100, grade: "O", status: "Pass" },
  { id: 7, student: "Olivia Brown", class: "Kumaravakuppu", exam: "Mid-Term 2026", marks: 0, grade: "-", status: "Pending" },
];

const classGroups = ["All Classes", "Nursery", "Balavakup", "Kumaravakuppu", "Jesttavakuppu", "Youvavakuppu"];
const examTypes = ["All Exams", "Final Exam", "Mid-Term 2026", "Unit Test 1", "Oral Test"];

import { ResultsStats } from "@/components/results/ResultsStats";
import { ResultsTable } from "@/components/results/ResultsTable";
import { ResultModal } from "@/components/results/ResultModal";
import { exportToCSV } from "@/lib/export";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
} as const;

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
} as const;

export default function ResultsPage() {
  const [results, setResults] = useState(initialResults);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedExam, setSelectedExam] = useState("All Exams");

  const filteredResults = results.filter(r => {
    const matchesSearch = r.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "All Classes" || r.class === selectedClass;
    const matchesExam = selectedExam === "All Exams" || r.exam === selectedExam;
    return matchesSearch && matchesClass && matchesExam;
  });

  const handleExport = () => {
    const exportData = filteredResults.map(({ id, ...rest }) => ({
      ...rest,
      student_name: rest.student,
      class_group: rest.class,
      exam_title: rest.exam,
      percentage: rest.marks,
      letter_grade: rest.grade
    }));
    exportToCSV(exportData, `SundaySchool_Results_${selectedClass}_${selectedExam}`);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Academic Results</h1>
          <p className="text-slate-500 mt-1">Manage and track student performance records.</p>
        </div>
        <div className="flex gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 shadow-sm"
          >
            <Download size={16} /> Export CSV
          </motion.button>
          <motion.button 
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus size={16} /> Add Result
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <ResultsStats itemVariants={itemVariants} />

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" 
            placeholder="Search student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 shadow-sm"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white pl-4 pr-10 text-xs font-bold text-slate-700 outline-none focus:border-indigo-600 appearance-none shadow-sm cursor-pointer min-w-[140px]"
            >
              {classGroups.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
          <div className="relative">
            <select 
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white pl-4 pr-10 text-xs font-bold text-slate-700 outline-none focus:border-indigo-600 appearance-none shadow-sm cursor-pointer min-w-[160px]"
            >
              {examTypes.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
        </div>
      </motion.div>

      {/* Results Table */}
      <ResultsTable results={filteredResults} itemVariants={itemVariants} />

      {/* Add Result Modal */}
      <ResultModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        examTypes={examTypes} 
      />
    </motion.div>
  );
}
