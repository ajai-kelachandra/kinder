"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  FileText, 
  MoreVertical, 
  Calendar, 
  Upload,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { GroupSelector } from "@/components/lessons/GroupSelector";
import { LessonCard } from "@/components/lessons/LessonCard";
import { LessonUploadModal } from "@/components/lessons/LessonUploadModal";
import { LessonDetailModal } from "@/components/lessons/LessonDetailModal";

const classGroups = [
  { id: "Nursery", label: "Nursery", icon: "👶" },
  { id: "Balavakup", label: "Balavakup", icon: "🎨" },
  { id: "Kumaravakuppu", label: "Kumaravakuppu", icon: "📚" },
  { id: "Jesttavakuppu", label: "Jesttavakuppu", icon: "⚓" },
  { id: "Youvavakuppu", label: "Youvavakuppu", icon: "⚡" },
];

const initialLessons = [
  { 
    id: 1, 
    title: "The Story of Joseph", 
    description: "Exploring the themes of faith and obedience through Joseph's journey.", 
    date: "2026-04-20", 
    category: "Old Testament", 
    classGroup: "Kumaravakuppu",
    status: "Published",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: 2, 
    title: "Noah's Ark & The Flood", 
    description: "God's promise, the importance of trust, and the symbol of the rainbow.", 
    date: "2026-04-27", 
    category: "Old Testament", 
    classGroup: "Jesttavakuppu",
    status: "Draft",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA48TiE1Knu4br9ZtlHfYxh2N9EE0PlfWtzQ&s"
  },
  { 
    id: 3, 
    title: "The Parable of the Sower", 
    description: "Understanding how the word of God takes root in different hearts.", 
    date: "2026-05-04", 
    category: "New Testament", 
    classGroup: "Balavakup",
    status: "Published",
    image: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: 4, 
    title: "David and Goliath", 
    description: "Courage and faith in the face of giant obstacles.", 
    date: "2026-05-11", 
    category: "Old Testament", 
    classGroup: "Kumaravakuppu",
    status: "Published",
    image: "https://images.unsplash.com/photo-1464692805480-a69dfaafdb0d?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: 5, 
    title: "The Good Samaritan", 
    description: "Learning the true meaning of loving your neighbor.", 
    date: "2026-05-18", 
    category: "New Testament", 
    classGroup: "Youvavakuppu",
    status: "Published",
    image: "https://images.unsplash.com/photo-1469571483333-f33f4174e302?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: 6, 
    title: "Daniel in the Lions' Den", 
    description: "Steadfast faith and God's protection in difficult times.", 
    date: "2026-05-25", 
    category: "Old Testament", 
    classGroup: "Kumaravakuppu",
    status: "Published",
    image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: 7, 
    title: "Jesus Feeds the 5000", 
    description: "A miracle of multiplication and God's provision.", 
    date: "2026-06-01", 
    category: "New Testament", 
    classGroup: "Nursery",
    status: "Draft",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400"
  },
];

import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { toast } from "sonner";

// Helper to compress image
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Max dimensions
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to 0.7 quality
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
    reader.onerror = error => reject(error);
  });
};

// Helper to convert file to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("Nursery");
  const [newLesson, setNewLesson] = useState<any>({
    title: "",
    description: "",
    category: "Old Testament",
    classGroup: "Kumaravakuppu",
    date: new Date().toISOString().split('T')[0],
    tempFiles: []
  });

  // Fetch lessons from Firestore
  React.useEffect(() => {
    let unsubscribe: () => void;

    const setupListener = () => {
      const q = query(collection(db, "lessons"), orderBy("createdAt", "desc"));
      
      return onSnapshot(q, (snapshot) => {
        const lessonsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data({ serverTimestamps: 'estimate' })
        }));
        setLessons(lessonsData);
        setLoading(false);
      }, (error) => {
        console.error("Firestore snapshot error:", error);
        // If index is missing, retry without ordering
        if (error.message.includes("index")) {
          const simpleQ = query(collection(db, "lessons"));
          unsubscribe = onSnapshot(simpleQ, (snap) => {
            setLessons(snap.docs.map(d => ({ 
              id: d.id, 
              ...d.data({ serverTimestamps: 'estimate' }) 
            })));
            setLoading(false);
          });
        }
      });
    };

    unsubscribe = setupListener();
    return () => unsubscribe && unsubscribe();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Processing and compressing files...");
    try {
      const processedFiles = [];
      
      if (newLesson.tempFiles && newLesson.tempFiles.length > 0) {
        for (const file of newLesson.tempFiles) {
          let data = "";
          
          if (file.type.startsWith('image/')) {
            // Compress images to save space in Firestore (Max 1MB per document)
            data = await compressImage(file);
          } else {
            // Standard Base64 for other files (PDF, etc)
            data = await fileToBase64(file);
          }

          // Firestore has a strict 1MB limit per document. 
          // Base64 adds ~33% size. We check if the resulting string is too long.
          if (data.length > 1000000) {
            toast.error(`File "${file.name}" is still too large (>1MB). Please use a smaller file or split it.`, { id: loadingToast, duration: 5000 });
            return;
          }

          processedFiles.push({
            name: file.name,
            data: data,
            type: file.type
          });
        }
      }

      const lessonData = {
        Title: newLesson.title,
        Description: newLesson.description,
        Category: newLesson.category,
        Date: newLesson.date,
        classGroup: newLesson.classGroup,
        files: processedFiles, 
        status: "Published",
        image: processedFiles.find(f => f.type.startsWith('image/'))?.data || "",
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "lessons"), lessonData);
      
      toast.success("Lesson uploaded successfully!", { id: loadingToast });
      setIsModalOpen(false);
      setNewLesson({ 
        title: "", 
        description: "", 
        category: "Old Testament", 
        classGroup: "Kumaravakuppu", 
        date: new Date().toISOString().split('T')[0],
        tempFiles: []
      });
    } catch (error: any) {
      console.error("Error adding lesson:", error);
      toast.error(`Upload failed: ${error.message}`, { id: loadingToast });
    }
  };

  const handleViewLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setIsViewModalOpen(true);
  };

  const filteredLessons = lessons.filter(l => 
    l.classGroup === selectedGroup &&
    ((l.Title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
     (l.Category?.toLowerCase() || "").includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Curriculum Library</h1>
          <p className="text-slate-500 mt-1">Manage and upload lessons for <span className="font-bold text-indigo-600">{selectedGroup}</span></p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Plus size={16} /> Upload Lesson
        </button>
      </div>

      {/* Group Selector Tiles */}
      <GroupSelector 
        groups={classGroups} 
        selectedGroup={selectedGroup} 
        onSelect={setSelectedGroup} 
        lessons={lessons} 
      />

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" 
            placeholder={`Search lessons in ${selectedGroup}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-xs outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
          />
        </div>
      </div>

      {/* Lessons Grid (Tiles) */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredLessons.map((lesson, index) => (
            <LessonCard 
              key={lesson.id} 
              lesson={lesson} 
              index={index} 
              onView={handleViewLesson} 
            />
          ))}
        </AnimatePresence>

        {filteredLessons.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-slate-50 p-6 text-slate-200">
              <FileText size={48} strokeWidth={1} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No lessons found</h3>
            <p className="text-slate-500 mt-1 text-xs">No curriculum uploaded for {selectedGroup} yet.</p>
          </div>
        )}
      </motion.div>

      {/* Upload Modal */}
      <LessonUploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleUpload} 
        newLesson={newLesson} 
        setNewLesson={setNewLesson} 
        classGroups={classGroups} 
      />

      {/* Detailed View Modal */}
      <LessonDetailModal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        lesson={selectedLesson} 
      />
    </div>
  );
}
