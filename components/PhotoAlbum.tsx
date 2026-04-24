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
    rotateY: dir > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.98,
    transformOrigin: dir > 0 ? "left center" : "right center",
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transformOrigin: "center",
  },
  exit: (dir: number) => ({
    rotateY: dir > 0 ? -90 : 90,
    opacity: 0,
    scale: 0.98,
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
  const isVideo = current?.fileType === "video";
  const isDeleting = current && deletingId === current.id;

  // With no photos yet, show the add-photo prompt only
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full flex flex-col items-center gap-4 select-none" style={{ perspective: "1200px" }}>
      {/* Page counter */}
      <p className="text-xs tracking-widest text-brand-gold/60">{page + 1} / {images.length}</p>

      {/* Book page area */}
      <div className="relative w-full max-w-sm md:max-w-md aspect-[4/5]">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={PAGE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.12)] bg-white border border-brand-border/30 cursor-pointer"
            onClick={() => !isDeleting && onImageClick(current.url, current.fileType)}
          >
            {/* Paper texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10" />

            {isVideo ? (
              <video
                src={current.url}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <Image
                src={current.url}
                alt={`${year} memory`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}

            {/* Delete button */}
            {!isDeleting && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(current.id); }}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-red-400 transition-all"
                title="מחיקה"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"/><path d="M19 6v14H5V6"/><path d="M8 6V4h8v2"/>
                </svg>
              </button>
            )}

            {isDeleting && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="w-8 h-8 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <div className="flex items-center gap-6 mt-2">
        <button
          onClick={() => paginate(-1)}
          disabled={page === 0}
          className="w-10 h-10 rounded-full border border-brand-border/50 flex items-center justify-center text-foreground/50 hover:border-brand-gold hover:text-brand-gold transition-all disabled:opacity-20"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage([i, i > page ? 1 : -1])}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === page ? "bg-brand-gold w-4" : "bg-brand-border"}`}
            />
          ))}
        </div>

        <button
          onClick={() => paginate(1)}
          disabled={page === images.length - 1}
          className="w-10 h-10 rounded-full border border-brand-border/50 flex items-center justify-center text-foreground/50 hover:border-brand-gold hover:text-brand-gold transition-all disabled:opacity-20"
        >
          <ChevronLeft size={18} />
        </button>
      </div>
    </div>
  );
}
