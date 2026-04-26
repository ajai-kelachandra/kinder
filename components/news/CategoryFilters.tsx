import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CategoryFiltersProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  itemVariants: any;
}

export function CategoryFilters({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  itemVariants 
}: CategoryFiltersProps) {
  return (
    <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={cn(
            "rounded-xl px-5 py-2 text-xs font-bold transition-all duration-300",
            activeCategory === cat
              ? "bg-slate-900 text-white shadow-lg"
              : "bg-white text-slate-500 border border-slate-100 hover:border-slate-300"
          )}
        >
          {cat}
        </button>
      ))}
    </motion.div>
  );
}
