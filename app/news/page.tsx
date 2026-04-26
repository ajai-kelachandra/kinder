"use client";

import React, { useState } from "react";
import { 
  Newspaper, 
  Search, 
  Tag, 
  Clock, 
  ChevronRight, 
  ArrowUpRight,
  Filter,
  MoreHorizontal,
  Bookmark,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "framer-motion";

import { NewsHero } from "@/components/news/NewsHero";
import { NewsGrid } from "@/components/news/NewsGrid";
import { CategoryFilters } from "@/components/news/CategoryFilters";

const categories = ["All News", "Announcements", "Spiritual", "Diocese Events", "Youth Wing"];

const newsItems = [
  {
    id: 1,
    title: "Diocesan Annual Convention 2026: A Journey of Faith",
    excerpt: "Join us for a week of spiritual renewal and communal growth as we gather for the annual convention...",
    category: "Announcements",
    date: "2 hours ago",
    image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800",
    featured: true
  },
  {
    id: 2,
    title: "New Curriculum Guidelines for Sunday Schools",
    excerpt: "The Diocese Education Board has released updated guidelines for the 2026-27 academic year...",
    category: "Announcements",
    date: "Yesterday",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400",
    featured: false
  },
  {
    id: 3,
    title: "Youth Retreat: Reclaiming Our Identity in Christ",
    excerpt: "Registrations are now open for the upcoming youth retreat scheduled for the first week of June...",
    category: "Youth Wing",
    date: "2 days ago",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=400",
    featured: false
  },
  {
    id: 4,
    title: "Bishop's Message on Pentecost Sunday",
    excerpt: "Reflecting on the power of the Holy Spirit in our daily lives and mission as a church community...",
    category: "Spiritual",
    date: "4 days ago",
    image: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=400",
    featured: false
  },
  {
    id: 5,
    title: "Community Outreach Program Hits Milestone",
    excerpt: "Over 500 families supported through the latest diocesan-led food and health initiative...",
    category: "Diocese Events",
    date: "1 week ago",
    image: "https://images.unsplash.com/photo-1469571483333-f33f4174e302?auto=format&fit=crop&q=80&w=400",
    featured: false
  }
];

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

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("All News");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNews = newsItems.filter(item => {
    const matchesCategory = activeCategory === "All News" || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredNews = newsItems.find(n => n.featured);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Diocese News</h1>
          <p className="text-slate-500 mt-1">Updates and announcements from across the regional administration.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" 
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 shadow-sm"
          />
        </div>
      </motion.div>

      {/* Featured News Hero */}
      {!searchTerm && activeCategory === "All News" && featuredNews && (
        <NewsHero news={featuredNews} itemVariants={itemVariants} />
      )}

      {/* Category Pills */}
      <CategoryFilters 
        categories={categories} 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
        itemVariants={itemVariants} 
      />

      {/* News Grid */}
      <NewsGrid 
        newsItems={filteredNews.filter(n => !n.featured || searchTerm)} 
        itemVariants={itemVariants} 
      />
    </motion.div>
  );
}
