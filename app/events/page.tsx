"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  MoreVertical, 
  Users, 
  X, 
  Upload,
  CheckCircle2,
  FileText,
  CalendarDays,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const initialEvents = [
  {
    id: 1,
    title: "Annual Vacation Bible School",
    description: "A week-long adventure for children to explore faith through games, crafts, and stories.",
    date: "2026-07-15",
    time: "09:00 AM - 12:30 PM",
    location: "Main Sanctuary & Youth Hall",
    attendees: 124,
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    title: "Youth Leadership Workshop",
    description: "Empowering our teenagers to become the next generation of spiritual leaders.",
    date: "2026-05-10",
    time: "02:00 PM - 05:00 PM",
    location: "Community Room B",
    attendees: 45,
    status: "Draft",
    image: "https://images.unsplash.com/photo-1524178232363-1fb28f74b0cd?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    title: "Sunday School Teachers' Training",
    description: "New teaching methods and curriculum review for the upcoming academic year.",
    date: "2026-06-05",
    time: "10:00 AM - 01:00 PM",
    location: "Grace Hall",
    attendees: 28,
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    title: "Christmas Pageant Rehearsal",
    description: "Preparing our hearts and performances for the annual nativity story.",
    date: "2026-11-20",
    time: "04:30 PM - 06:00 PM",
    location: "Main Stage",
    attendees: 62,
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1543589077-47d816067f70?auto=format&fit=crop&q=80&w=600"
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const event = {
      ...newEvent,
      id: events.length + 1,
      attendees: 0,
      status: "Upcoming",
      image: "https://images.unsplash.com/photo-1505373630103-821c7023230f?auto=format&fit=crop&q=80&w=600"
    };
    setEvents([event as any, ...events]);
    setIsModalOpen(false);
    setNewEvent({ title: "", description: "", date: "", time: "", location: "" });
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 pb-10"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Events Manager</h1>
          <p className="text-slate-500 mt-1">Organize and track upcoming school activities.</p>
        </motion.div>
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus size={16} /> Create Event
        </motion.button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Events", count: events.length, icon: CalendarDays, color: "indigo" },
          { label: "Upcoming", count: events.filter(e => e.status === "Upcoming").length, icon: Clock, color: "emerald" },
          { label: "Drafts", count: events.filter(e => e.status === "Draft").length, icon: FileText, color: "amber" },
          { label: "Attendees", count: events.reduce((acc, e) => acc + e.attendees, 0), icon: Users, color: "rose" },
        ].map((stat, i) => {
          const Icon = stat.icon || CalendarDays;
          return (
            <motion.div 
              key={stat.label}
              variants={itemVariants}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg mb-3", `bg-${stat.color}-50 text-${stat.color}-600`)}>
                <Icon size={16} />
              </div>
              <div className="text-2xl font-black text-slate-900 leading-none">{stat.count}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <motion.div variants={itemVariants} className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" 
            placeholder="Search events, locations, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-xs outline-none focus:border-indigo-600 transition-all shadow-sm"
          />
        </div>
        <button className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
          <Filter size={14} /> Filter
        </button>
      </motion.div>

      {/* Events Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -4 }}
              className="group relative flex flex-col rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-500/10"
            >
              {/* Event Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className={cn(
                    "rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-md",
                    event.status === "Upcoming" ? "bg-emerald-500/80" : "bg-amber-500/80"
                  )}>
                    {event.status}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                    {event.title}
                  </h3>
                  <button className="rounded-full p-1 text-slate-400 hover:bg-slate-50 transition-colors shrink-0">
                    <MoreVertical size={18} />
                  </button>
                </div>
                
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6">
                  {event.description}
                </p>

                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50">
                      <Calendar size={14} className="text-indigo-600" />
                    </div>
                    <span className="text-[11px] font-bold">{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50">
                      <Clock size={14} className="text-indigo-600" />
                    </div>
                    <span className="text-[11px] font-bold">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50">
                      <MapPin size={14} className="text-indigo-600" />
                    </div>
                    <span className="text-[11px] font-bold truncate">{event.location}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                  <div className="flex items-center -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                      </div>
                    ))}
                    <span className="pl-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      +{event.attendees - 3} JOINED
                    </span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all"
                  >
                    Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative flex flex-col w-full max-w-xl max-h-[90vh] rounded-[32px] bg-white shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Calendar size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Create New Event</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                <form id="create-event-form" onSubmit={handleCreateEvent} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Event Title</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Annual Vacation Bible School"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="What is this event about?"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</label>
                      <input 
                        required
                        type="date" 
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. 09:00 AM - 12:30 PM"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Main Sanctuary"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center transition-all hover:bg-indigo-50/50 hover:border-indigo-200 cursor-pointer">
                    <Upload className="mx-auto mb-3 text-indigo-600" size={32} />
                    <p className="text-sm font-bold text-slate-900">Upload Cover Image</p>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Recommended: 1600x1000px</p>
                  </div>
                </form>
              </div>

              <div className="flex gap-4 bg-white p-8 border-t border-slate-50 shrink-0">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 rounded-2xl bg-slate-100 py-4 text-sm font-bold text-slate-500 hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  form="create-event-form" 
                  className="flex-1 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Confirm & Publish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
