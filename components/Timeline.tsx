"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface TimelineMedia {
  id: string;
  year: number;
  image_url: string;
  file_type: "image" | "video";
}

const START_YEAR = 2017;
const END_YEAR = 2026;
const YEARS = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i);

const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "quicktime", "avi"];

function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/");
}

function isVideoUrl(url: string, fileType?: string): boolean {
  if (fileType === "video") return true;
  const ext = url.split(".").pop()?.toLowerCase()?.split("?")[0] || "";
  return VIDEO_EXTENSIONS.includes(ext);
}

interface TimelineProps {
  events?: any[];
}

export default function Timeline({ events = [] }: TimelineProps) {
  const [media, setMedia] = useState<Record<number, TimelineMedia[]>>({});
  const [loading, setLoading] = useState(true);
  const [uploadingYear, setUploadingYear] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Lightbox state
  const [lightboxItem, setLightboxItem] = useState<TimelineMedia | null>(null);

  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedYearForUpload, setSelectedYearForUpload] = useState<number | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("timeline_photos")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching media:", error);
    } else if (data) {
      const grouped: Record<number, TimelineMedia[]> = {};
      data.forEach((item: any) => {
        const entry: TimelineMedia = {
          id: item.id,
          year: item.year,
          image_url: item.image_url,
          file_type: item.file_type || (isVideoUrl(item.image_url) ? "video" : "image"),
        };
        if (!grouped[entry.year]) grouped[entry.year] = [];
        grouped[entry.year].push(entry);
      });
      setMedia(grouped);
    }
    setLoading(false);
  };

  const initUpload = (year: number) => {
    setSelectedYearForUpload(year);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedYearForUpload) return;

    setUploadingYear(selectedYearForUpload);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${selectedYearForUpload}-${crypto.randomUUID()}.${fileExt}`;
      const filePath = `journey/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("journey-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("journey-images").getPublicUrl(filePath);

      const detectedType: "image" | "video" = isVideoFile(file) ? "video" : "image";

      const newEntry = {
        year: selectedYearForUpload,
        image_url: publicUrl,
        file_type: detectedType,
      };

      const { data, error: dbError } = await supabase
        .from("timeline_photos")
        .insert(newEntry)
        .select()
        .single();

      if (dbError) throw dbError;

      setMedia((prev) => {
        const existing = prev[selectedYearForUpload] || [];
        return { ...prev, [selectedYearForUpload]: [...existing, data] };
      });
    } catch (error: any) {
      console.error("Error uploading file:", error);
      alert(`Failed to upload. Error: ${error.message}`);
    } finally {
      setUploadingYear(null);
      setSelectedYearForUpload(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (item: TimelineMedia) => {
    if (!window.confirm("Are you sure you want to delete this memory?")) return;

    setDeletingId(item.id);

    const urlParts = item.image_url.split("/journey-images/");
    const filePath = urlParts.length > 1 ? urlParts[1] : null;

    setMedia((prev) => {
      const yearItems = prev[item.year] || [];
      return { ...prev, [item.year]: yearItems.filter((m) => m.id !== item.id) };
    });

    try {
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("journey-images")
          .remove([filePath]);
        if (storageError) console.error("Error deleting from storage:", storageError);
      }

      const { error: dbError } = await supabase
        .from("timeline_photos")
        .delete()
        .eq("id", item.id);

      if (dbError) throw dbError;
    } catch (error: any) {
      console.error("Error deleting memory:", error);
      alert(`Failed to delete. Error: ${error.message}`);
      fetchMedia();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-4 relative flex flex-col items-center">
        {/* Hidden File Input — accepts images AND videos */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/mp4,video/webm,video/quicktime"
          className="hidden"
        />

        {/* Center Line */}
        <div className="absolute left-1/2 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-brand-border/80 to-transparent -translate-x-1/2 z-0" />

        {YEARS.map((year, index) => {
          const yearEvent = events?.find((e: any) => e.year === year);
          return (
            <TimelineCard
              key={year}
              year={year}
              index={index}
              album={media[year] || []}
              isUploading={uploadingYear === year}
              onUpload={() => initUpload(year)}
              eventData={yearEvent}
              onMediaClick={(item) => setLightboxItem(item)}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          );
        })}
      </div>

      {/* ─────────── Lightbox ─────────── */}
      <AnimatePresence>
        {lightboxItem && (
          <LightboxModal item={lightboxItem} onClose={() => setLightboxItem(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ════════════════════════════════════════════════════
   Lightbox Modal — image OR video with controls
   ════════════════════════════════════════════════════ */

function LightboxModal({ item, onClose }: { item: TimelineMedia; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const isVideo = item.file_type === "video" || isVideoUrl(item.image_url, item.file_type);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 md:top-8 md:right-8 z-[110] text-white/50 hover:text-white transition-colors"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full h-full max-h-[90vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {isVideo ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                src={item.image_url}
                className="max-w-full max-h-full rounded-xl object-contain"
                muted
                playsInline
                loop
                onClick={togglePlay}
              />

              {/* Video Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md rounded-full px-6 py-3 z-20">
                {/* Play / Pause */}
                <button onClick={togglePlay} className="text-white/80 hover:text-white transition-colors">
                  {isPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  )}
                </button>

                {/* Mute / Unmute */}
                <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors">
                  {isMuted ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Big Play overlay when paused */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Image
              src={item.image_url}
              alt="Fullscreen Memory"
              fill
              className="object-contain"
              sizes="100vw"
              quality={100}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════
   Timeline Card (per year)
   ════════════════════════════════════════════════════ */

interface TimelineCardProps {
  year: number;
  index: number;
  album: TimelineMedia[];
  isUploading: boolean;
  onUpload: () => void;
  eventData?: any;
  onMediaClick: (item: TimelineMedia) => void;
  onDelete: (item: TimelineMedia) => void;
  deletingId: string | null;
}

function TimelineCard({ year, index, album, isUploading, onUpload, eventData, onMediaClick, onDelete, deletingId }: TimelineCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["0 1.1", "1.2 1"],
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.4, 1]);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={cardRef}
      style={{ scale: scaleProgress, opacity: opacityProgress }}
      className={`relative w-full flex items-center justify-between mb-24 md:mb-40 z-10 ${isEven ? "flex-row" : "flex-row-reverse"}`}
    >
      <div className="absolute left-1/2 top-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full bg-brand-gold border-[4px] border-background -translate-x-1/2 -translate-y-1/2 z-20 shadow-[0_0_15px_rgba(212,175,55,0.4)]" />

      {/* Year and Event Display */}
      <div className={`w-[45%] flex flex-col ${isEven ? "items-end pr-8 md:pr-16 text-right" : "items-start pl-8 md:pl-16 text-left"}`}>
        <h2 className="text-5xl md:text-8xl font-light text-brand-gold/20 tracking-tighter select-none">{year}</h2>
        {eventData && (
          <div className="mt-4">
            {eventData.title && <h3 className="text-xl md:text-2xl font-light text-foreground">{eventData.title}</h3>}
            {eventData.description && <p className="text-sm md:text-base text-foreground/60 mt-2 max-w-xs">{eventData.description}</p>}
          </div>
        )}
      </div>

      {/* Gallery */}
      <div className={`w-[50%] md:w-[45%] flex ${isEven ? "justify-start" : "justify-end"}`}>
        <div className={`flex w-full overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbars ${isEven ? "flex-row" : "flex-row-reverse"}`}>
          {album.map((item) => {
            const isDeleting = deletingId === item.id;
            const isVideo = item.file_type === "video" || isVideoUrl(item.image_url, item.file_type);

            return (
              <div
                key={item.id}
                className="flex-shrink-0 snap-center relative w-[240px] md:w-[280px] aspect-[4/5] rounded-2xl overflow-hidden backdrop-blur-md bg-white/40 border border-brand-border/40 shadow-[0_15px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_25px_50px_rgb(0,0,0,0.12)] transition-all duration-500 transform hover:-translate-y-2 group"
              >
                <div
                  onClick={() => !isDeleting && onMediaClick(item)}
                  className={`w-full h-full cursor-pointer ${isDeleting ? "opacity-50" : ""}`}
                >
                  {isVideo ? (
                    <>
                      <video
                        src={item.image_url}
                        className="absolute inset-0 w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      {/* Play icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center shadow-lg">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Image
                        src={item.image_url}
                        alt={`Memory from ${year}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10 pointer-events-none">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md">
                          <path d="M15 3h6v6" />
                          <path d="M9 21H3v-6" />
                          <path d="M21 3l-7 7" />
                          <path d="M3 21l7-7" />
                        </svg>
                      </div>
                    </>
                  )}
                </div>

                {/* Delete Button */}
                {!isDeleting && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    title="Delete Memory"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                )}

                {/* Deleting Spinner */}
                {isDeleting && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-8 h-8 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Memory Card */}
          <div
            onClick={onUpload}
            className="flex-shrink-0 snap-center relative w-[240px] md:w-[280px] aspect-[4/5] cursor-pointer rounded-2xl overflow-hidden backdrop-blur-md bg-white/20 border border-brand-border/40 border-dashed hover:border-brand-gold/50 shadow-sm hover:shadow-[0_15px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-out flex items-center justify-center group"
          >
            {isUploading ? (
              <div className="flex flex-col items-center space-y-4 z-10">
                <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-light text-foreground/60 tracking-[0.2em] uppercase">Uploading</span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 text-brand-gold/60 group-hover:text-brand-gold transition-colors duration-500">
                <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center opacity-80">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <span className="text-xs tracking-[0.2em] font-medium uppercase">{album.length > 0 ? "Add Another" : "Add Memory"}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
