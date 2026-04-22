"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface TimelinePhoto {
  id: string;
  year: number;
  image_url: string;
}

const START_YEAR = 2017;
const END_YEAR = 2026;
const YEARS = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i);

interface TimelineProps {
  events?: any[];
}

export default function Timeline({ events = [] }: TimelineProps) {
  const [photos, setPhotos] = useState<Record<number, TimelinePhoto[]>>({});
  const [loading, setLoading] = useState(true);
  const [uploadingYear, setUploadingYear] = useState<number | null>(null);
  
  // Lightbox state
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedYearForUpload, setSelectedYearForUpload] = useState<number | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("timeline_photos")
      .select("*")
      .order("created_at", { ascending: true }); // Display older uploads first

    if (error) {
      console.error("Error fetching photos:", error);
    } else if (data) {
      const groupedPhotos: Record<number, TimelinePhoto[]> = {};
      data.forEach((photo: TimelinePhoto) => {
        if (!groupedPhotos[photo.year]) {
          groupedPhotos[photo.year] = [];
        }
        groupedPhotos[photo.year].push(photo);
      });
      setPhotos(groupedPhotos);
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
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedYearForUpload}-${crypto.randomUUID()}.${fileExt}`;
      const filePath = `journey/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('journey-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('journey-images')
        .getPublicUrl(filePath);

      // We explicitly always insert since a year can have many photos
      const newEntry = { year: selectedYearForUpload, image_url: publicUrl };
      const { data, error: dbError } = await supabase
        .from('timeline_photos')
        .insert(newEntry)
        .select()
        .single();

      if (dbError) throw dbError;

      // Optimistic update
      setPhotos(prev => {
        const existing = prev[selectedYearForUpload] || [];
        return { ...prev, [selectedYearForUpload]: [...existing, data] };
      });
      
    } catch (error: any) {
      console.error("Error uploading image:", error);
      alert(`Failed to upload image. Error: ${error.message}`);
    } finally {
      setUploadingYear(null);
      setSelectedYearForUpload(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-4 relative flex flex-col items-center">
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {/* Center Line connecting the timeline */}
        <div className="absolute left-1/2 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-brand-border/80 to-transparent -translate-x-1/2 z-0" />

        {YEARS.map((year, index) => {
          const yearEvent = events?.find((e) => e.year === year);
          return (
            <TimelineCard 
              key={year} 
              year={year} 
              index={index} 
              album={photos[year] || []} 
              isUploading={uploadingYear === year}
              onUpload={() => initUpload(year)}
              eventData={yearEvent}
              onImageClick={(url) => setLightboxImage(url)}
            />
          );
        })}
      </div>

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-md"
            onClick={() => setLightboxImage(null)}
          >
            <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
              {/* Close Button */}
              <button 
                className="absolute top-4 right-4 md:top-8 md:right-8 z-[110] text-white/50 hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(null);
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative w-full h-full max-h-[90vh]"
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking the image wrapper itself
              >
                <Image 
                  src={lightboxImage} 
                  alt="Fullscreen Memory" 
                  fill 
                  className="object-contain"
                  sizes="100vw"
                  quality={100}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface TimelineCardProps {
  year: number;
  index: number;
  album: TimelinePhoto[];
  isUploading: boolean;
  onUpload: () => void;
  eventData?: any;
  onImageClick: (url: string) => void;
}

function TimelineCard({ year, index, album, isUploading, onUpload, eventData, onImageClick }: TimelineCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["0 1.1", "1.2 1"] 
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      ref={cardRef}
      style={{ scale: scaleProgress, opacity: opacityProgress }}
      className={`relative w-full flex items-center justify-between mb-24 md:mb-40 z-10 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className="absolute left-1/2 top-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full bg-brand-gold border-[4px] border-background -translate-x-1/2 -translate-y-1/2 z-20 shadow-[0_0_15px_rgba(212,175,55,0.4)]" />

      {/* Year and Event Display */}
      <div className={`w-[45%] flex flex-col ${isEven ? 'items-end pr-8 md:pr-16 text-right' : 'items-start pl-8 md:pl-16 text-left'}`}>
        <h2 className="text-5xl md:text-8xl font-light text-brand-gold/20 tracking-tighter select-none">
          {year}
        </h2>
        {eventData && (
          <div className="mt-4">
            {eventData.title && <h3 className="text-xl md:text-2xl font-light text-foreground">{eventData.title}</h3>}
            {eventData.description && <p className="text-sm md:text-base text-foreground/60 mt-2 max-w-xs">{eventData.description}</p>}
          </div>
        )}
      </div>

      {/* Frame holding the Horizontal Gallery */}
      <div className={`w-[50%] md:w-[45%] flex ${isEven ? 'justify-start' : 'justify-end'}`}>
        {/* Scroll Container */}
        <div className={`flex w-full overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbars ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
          
          {album.map((photo) => (
            <div 
              key={photo.id}
              onClick={() => onImageClick(photo.image_url)}
              className="flex-shrink-0 snap-center relative w-[240px] md:w-[280px] aspect-[4/5] cursor-pointer rounded-2xl overflow-hidden backdrop-blur-md bg-white/40 border border-brand-border/40 shadow-[0_15px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_25px_50px_rgb(0,0,0,0.12)] transition-all duration-500 transform hover:-translate-y-2 group"
            >
              <Image 
                src={photo.image_url} 
                alt={`Memory from ${year}`} 
                fill 
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md">
                  <path d="M15 3h6v6"></path>
                  <path d="M9 21H3v-6"></path>
                  <path d="M21 3l-7 7"></path>
                  <path d="M3 21l7-7"></path>
                </svg>
              </div>
            </div>
          ))}

          {/* Persistent "Add Memory" Card */}
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
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                <span className="text-xs tracking-[0.2em] font-medium uppercase">{album.length > 0 ? 'Add Another' : 'Add Memory'}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}
