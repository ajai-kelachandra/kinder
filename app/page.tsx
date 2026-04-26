"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  MoreVertical,
  Briefcase,
  User
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { RecentActivity } from "@/components/RecentActivity";
import { LessonPreview } from "@/components/LessonPreview";
import { BirthdayWidget } from "@/components/dashboard/BirthdayWidget";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase/config";
import { collection, onSnapshot, query, limit, orderBy } from "firebase/firestore";
import Link from "next/link";
import { auth } from "@/lib/firebase/config";

export default function Dashboard() {
  const [userName, setUserName] = useState("Admin");
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeLessons: 0,
    attendanceRate: 0,
    upcomingEvents: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [nextLesson, setNextLesson] = useState<any>(null);
  const [fullStudents, setFullStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const hasUpcomingBirthdays = React.useMemo(() => {
    const today = new Date();
    const endOfWeek = new Date();
    endOfWeek.setDate(today.getDate() + 7);

    return fullStudents.some(student => {
      if (!student.Birthday && !student.birthday) return false;
      const bdayStr = student.Birthday || student.birthday;
      const bdayDate = new Date(bdayStr);
      const currentYearBday = new Date(today.getFullYear(), bdayDate.getMonth(), bdayDate.getDate());
      if (currentYearBday < today) currentYearBday.setFullYear(today.getFullYear() + 1);
      return currentYearBday >= today && currentYearBday <= endOfWeek;
    });
  }, [fullStudents]);

  useEffect(() => {
    // Set user name from auth
    if (auth.currentUser) {
      const name = auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || "Admin";
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    }

    // 1. Listen to Students
    const unsubStudents = onSnapshot(collection(db, "students"), (snap) => {
      setStats(prev => ({ ...prev, totalStudents: snap.size }));
      const allStudents = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFullStudents(allStudents);
      
      // Recent students for activity
      const latestStudents = snap.docs
        .sort((a, b) => (b.data().createdAt?.seconds || 0) - (a.data().createdAt?.seconds || 0))
        .slice(0, 2)
        .map(doc => ({
          id: `student-${doc.id}`,
          type: "Student",
          title: `New student: ${doc.data().Name || doc.data().name}`,
          time: "Recently Added",
          status: "New"
        }));
      setRecentActivities(prev => [...prev.filter(a => a.type !== "Student"), ...latestStudents]);
    });

    // 2. Listen to Lessons
    const unsubLessons = onSnapshot(collection(db, "lessons"), (snap) => {
      setStats(prev => ({ ...prev, activeLessons: snap.size }));
      
      const latestLessons = snap.docs
        .sort((a, b) => (b.data().createdAt?.seconds || 0) - (a.data().createdAt?.seconds || 0))
        .slice(0, 1)
        .map(doc => {
          const data = doc.data();
          if (!nextLesson) setNextLesson({
            title: data.Title || data.title,
            time: data.Date || data.date,
            description: data.Description || data.description || "No description provided."
          });
          return {
            id: `lesson-${doc.id}`,
            type: "Lesson",
            title: `New lesson: ${data.Title || data.title}`,
            time: "Recently Added",
            status: "Latest"
          };
        });
      setRecentActivities(prev => [...prev.filter(a => a.type !== "Lesson"), ...latestLessons]);
    });

    // 3. Listen to Attendance
    const unsubAttendance = onSnapshot(collection(db, "attendance"), (snap) => {
      let totalRate = 0;
      if (snap.size > 0) {
        snap.docs.forEach(doc => {
          const data = doc.data();
          const total = data.totalStudents || 0;
          const present = data.presentCount || 0;
          if (total > 0) totalRate += (present / total);
        });
        setStats(prev => ({ ...prev, attendanceRate: Math.round((totalRate / snap.size) * 100) }));
      }
    });

    // 4. Listen to Teachers
    const unsubTeachers = onSnapshot(collection(db, "teachers"), (snap) => {
      setStats(prev => ({ ...prev, upcomingEvents: snap.size })); // Using events slot for teachers
    });

    setLoading(false);
    return () => {
      unsubStudents();
      unsubLessons();
      unsubAttendance();
      unsubTeachers();
    };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <section>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
            Welcome backk, <span className="text-gradient">{userName}</span> 👋
          </h1>
          <p className="text-sm text-primary-muted dark:text-secondary-pale/60">
            Here's what's happening in your Sunday School today.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents.toString()} 
          icon={Users} 
          trend={{ value: "Live", isPositive: true }} 
        />
        <StatCard 
          title="Active Lessons" 
          value={stats.activeLessons.toString()} 
          icon={BookOpen} 
          trend={{ value: "Live", isPositive: true }} 
        />
        <StatCard 
          title="Attendance Rate" 
          value={`${stats.attendanceRate}%`} 
          icon={TrendingUp} 
          trend={{ value: "Avg", isPositive: true }} 
        />
        <StatCard 
          title="Active Teachers" 
          value={stats.upcomingEvents.toString()} 
          icon={Briefcase} 
          trend={{ value: "Staff", isPositive: true }} 
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Area - Upcoming Lesson */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary-dark dark:text-white">Next Lesson Preview</h2>
            <Link href="/lessons" className="text-xs font-semibold text-primary hover:text-accent flex items-center gap-1 transition-colors">
              View all lessons <ArrowRight size={14} />
            </Link>
          </div>
          
          <LessonPreview 
            title={nextLesson?.title || "No lessons scheduled"}
            time={nextLesson?.time || "Schedule a new lesson"}
            description={nextLesson?.description || "Get started by adding your first curriculum material to the lessons library."}
          />
        </section>

        {/* Sidebar Widgets */}
        <section className="space-y-6">
          {hasUpcomingBirthdays && <BirthdayWidget students={fullStudents} />}
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
              <button className="text-xs font-semibold text-primary hover:text-accent transition-colors">View all</button>
            </div>
            <div className="space-y-3">
              <RecentActivity activities={recentActivities} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
