"use client";

import React, { useState } from "react";
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Shield, 
  Palette, 
  Mail, 
  Building, 
  Camera, 
  Check, 
  Save,
  LogOut,
  ChevronRight,
  Database,
  Moon,
  Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const settingsTabs = [
  { id: "profile", label: "Account Profile", icon: User },
  { id: "school", label: "School Info", icon: Building },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Lock },
  { id: "data", label: "Data Management", icon: Database },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl space-y-8 pb-10"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account, school configuration, and preferences.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save size={16} /> Save Changes
            </>
          )}
        </motion.button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 shrink-0 rounded-xl px-4 py-3 text-left transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-white border border-slate-200 text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:bg-slate-100/50 hover:text-slate-900"
                )}
              >
                <tab.icon size={18} className={cn(
                  activeTab === tab.id ? "text-indigo-600" : "text-slate-400"
                )} />
                <span className="text-[13px] font-bold">{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-8 hidden lg:block border-t border-slate-100 pt-6 px-2">
            <div className="rounded-2xl bg-rose-50 p-4 border border-rose-100">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-1">Danger Zone</h4>
              <p className="text-[10px] text-rose-600/60 leading-tight mb-3">Permanent actions regarding your account data.</p>
              <button className="flex items-center gap-2 text-[10px] font-black text-rose-600 hover:underline">
                <LogOut size={12} /> Sign out of all sessions
              </button>
            </div>
          </div>
        </aside>

        {/* Settings Content Area */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
            >
              {activeTab === "profile" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Account Profile</h3>
                    <p className="text-xs text-slate-500 mt-1">Update your personal information and how others see you.</p>
                  </div>

                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="h-20 w-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center overflow-hidden border-2 border-indigo-100 group-hover:border-indigo-600 transition-colors">
                        <User size={32} className="text-indigo-600" />
                      </div>
                      <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform">
                        <Camera size={14} />
                      </button>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Profile Photo</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">JPG or PNG. Max size 2MB.</p>
                      <div className="flex gap-2 mt-2">
                        <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">Upload New</button>
                        <span className="text-slate-300">|</span>
                        <button className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:underline">Remove</button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                      <input 
                        type="text" 
                        defaultValue="Admin User"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                          type="email" 
                          defaultValue="admin@school.com"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Role</label>
                      <input 
                        type="text" 
                        disabled
                        value="Headmaster / System Admin"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-xs font-bold text-slate-400 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Timezone</label>
                      <select className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold outline-none focus:border-indigo-600 transition-all">
                        <option>(GMT+05:30) Mumbai, India</option>
                        <option>(GMT+00:00) London, UK</option>
                        <option>(GMT-05:00) New York, USA</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "school" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">School Information</h3>
                    <p className="text-xs text-slate-500 mt-1">Configure global details for your Sunday School institution.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Institution Name</label>
                      <input 
                        type="text" 
                        defaultValue="St. Thomas Sunday School"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Founded Year</label>
                        <input 
                          type="number" 
                          defaultValue="1984"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Capacity</label>
                        <input 
                          type="number" 
                          defaultValue="500"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mailing Address</label>
                      <textarea 
                        rows={3}
                        defaultValue="123 Church Road, Spiritual Center, City - 400001"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Notification Center</h3>
                    <p className="text-xs text-slate-500 mt-1">Control how and when you receive updates.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: "Attendance Alerts", desc: "Receive alerts when daily attendance is submitted.", enabled: true },
                      { title: "Event Reminders", desc: "Notification 24 hours before a scheduled event.", enabled: true },
                      { title: "System Updates", desc: "News about new features and software improvements.", enabled: false },
                      { title: "Student Inactivity", desc: "Alert when a student misses 3 consecutive weeks.", enabled: true },
                    ].map((item) => (
                      <div key={item.title} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/50">
                        <div className="flex items-center gap-4">
                          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", item.enabled ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400")}>
                            <Bell size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                            <p className="text-[10px] text-slate-500">{item.desc}</p>
                          </div>
                        </div>
                        <button className={cn(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          item.enabled ? "bg-indigo-600" : "bg-slate-200"
                        )}>
                          <span className={cn(
                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                            item.enabled ? "translate-x-4" : "translate-x-0"
                          )} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Visual Experience</h3>
                    <p className="text-xs text-slate-500 mt-1">Customize how the dashboard looks on your device.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interface Theme</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-3 rounded-2xl border-2 border-indigo-600 bg-white p-4 transition-all">
                          <Sun size={18} className="text-indigo-600" />
                          <span className="text-[11px] font-bold">Light Mode</span>
                        </button>
                        <button className="flex items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 opacity-50 grayscale hover:opacity-100 transition-all">
                          <Moon size={18} className="text-slate-400" />
                          <span className="text-[11px] font-bold">Dark Mode</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accent Color</h4>
                      <div className="flex gap-3">
                        {["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"].map((color) => (
                          <button 
                            key={color}
                            className="h-8 w-8 rounded-full shadow-sm hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
}
