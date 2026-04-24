"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PhotoAlbumProps {
  images: { id: string; url: string; fileType: "image" | "video" }[];
  year: number;
  onImageClick: (url: string, fileType: "image" | "video") => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

const PAGE_VARIANTS = {
  enter: (dir: number) => ({
    rotateY: dir > 0 ? 85 : -85,
    opacity: 0,
    scale: 0.97,
    transformOrigin: dir > 0 ? "left center" : "right center",
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transformOrigin: "center",
  },
  exit: (dir: number) => ({
    rotateY: dir > 0 ? -85 : 85,
    opacity: 0,
    scale: 0.97,
    transformOrigin: dir > 0 ? "right center" : "left center",
  }),
};

export default function PhotoAlbum({ images, year, onImageClick, onDelete, deletingId }: PhotoAlbumProps) {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (dir: number) => {
    const newPage = page + dir;
    if (newPage < 0 || newPage >= images.length) return;
    setPage([newPage, dir]);
  };

  const current = images[page];
  const isDeleting = current && deletingId === current.id;

  if (images.length === 0) return null;

  return (
    <div
      className="relative w-full flex flex-col items-center gap-5 select-none"
      style={{ perspective: "1400px" }}
    >
      {/* Page counter */}
      <p className="text-[10px] tracking-[0.3em] text-brand-gold/50 uppercase">
        עמוד {page + 1} מתוך {images.length}
      </p>

      {/* Book page */}
      <div className="relative w-full max-w-xs md:max-w-sm aspect-[4/5]">
        {/* Paper shadow base */}
        <div className="absolute inset-0 rounded-2xl bg-brand-border/40 translate-y-2 translate-x-2 blur-sm" />

        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={PAGE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden cursor-pointer"
            style={{
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 2px 6px rgba(197,160,89,0.15)",
              border: "1px solid rgba(197,160,89,0.15)"
            }}
            onClick={() => !isDeleting && onImageClick(current.url, current.fileType)}
          >
            {/* Realistic paper edge gloss */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-black/10 pointer-events-none z-10" />

            {current.fileType === "video" ? (
              <video
                src={current.url}
                className="w-full h-full object-cover"
                muted playsInline preload="metadata"
              />
            ) : (
              <Image
                src={current.url}
                alt={`${year} memory`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 40vw"
              />
            )}

            {/* Delete button */}
            {!isDeleting && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(current.id); }}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-red-400 transition-all"
                title="מחיקה"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"/><path d="M19 6v14H5V6"/><path d="M8 6V4h8v2"/>
                </svg>
              </button>
            )}

            {isDeleting && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-5 mt-1">
        <button
          onClick={() => paginate(-1)}
          disabled={page === 0}
          className="w-9 h-9 rounded-full border border-brand-border hover:border-brand-gold flex items-center justify-center text-foreground/40 hover:text-brand-gold transition-all disabled:opacity-20"
        >
          <ChevronRight size={16} />
        </button>

        <div className="flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage([i, i > page ? 1 : -1])}
              className={`h-1 rounded-full transition-all duration-300 ${i === page ? "bg-brand-gold w-5" : "bg-brand-border w-1.5"}`}
            />
          ))}
        </div>

        <button
          onClick={() => paginate(1)}
          disabled={page === images.length - 1}
          className="w-9 h-9 rounded-full border border-brand-border hover:border-brand-gold flex items-center justify-center text-foreground/40 hover:text-brand-gold transition-all disabled:opacity-20"
        >
          <ChevronLeft size={16} />
        </button>
      </div>
    </div>
  );
}
