"use client";

import { motion } from "framer-motion";
import { PenLine } from "lucide-react";

export default function DailyNote() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="w-full max-w-2xl mx-auto my-12"
    >
      <div className="bg-white border border-brand-border/60 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold/40 transition-all duration-300 group-hover:bg-brand-gold"></div>
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-medium tracking-wide text-foreground">The Daily Note</h2>
          <PenLine className="w-4 h-4 text-brand-gold" />
        </div>
        
        <p className="text-sm md:text-base leading-relaxed text-foreground/80 font-light italic text-center mx-auto mb-8">
          "As we continue building this capsule, everyday moments turn into lasting memories."
        </p>
        
        <div className="border-t border-brand-border/40 pt-4 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-foreground/40">{currentDate}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
        </div>
      </div>
    </motion.div>
  );
}
