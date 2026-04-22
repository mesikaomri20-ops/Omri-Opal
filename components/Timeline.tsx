"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

export default function Timeline() {
  const [photos, setPhotos] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploadingYear, setUploadingYear] = useState<number | null>(null);
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
      .select("*");

    if (error) {
      console.error("Error fetching photos:", error);
    } else if (data) {
      const initialPhotos: Record<number, string> = {};
      data.forEach((photo: TimelinePhoto) => {
        initialPhotos[photo.year] = photo.image_url;
      });
      setPhotos(initialPhotos);
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
      const fileName = `${selectedYearForUpload}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
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

      // Determine if insert or update is needed since we only want 1 per year
      const existingUrl = photos[selectedYearForUpload];
      
      if (existingUrl) {
         // Update existing
         const { error: dbError } = await supabase
          .from('timeline_photos')
          .update({ image_url: publicUrl })
          .eq('year', selectedYearForUpload);

         if (dbError) throw dbError;
      } else {
         // Insert new
         const { error: dbError } = await supabase
          .from('timeline_photos')
          .insert({ year: selectedYearForUpload, image_url: publicUrl });

         if (dbError) throw dbError;
      }

      // Optimistic update
      setPhotos(prev => ({ ...prev, [selectedYearForUpload]: publicUrl }));
    } catch (error: any) {
      console.error("Error uploading image:", error);
      alert(`Failed to upload image. Error: ${error.message} - Make sure your 'journey-images' bucket is created and Public, and RLS allows inserts/updates on 'timeline_photos'.`);
    } finally {
      setUploadingYear(null);
      setSelectedYearForUpload(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 relative flex flex-col items-center">
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
        return (
          <TimelineCard 
            key={year} 
            year={year} 
            index={index} 
            imageUrl={photos[year]} 
            isUploading={uploadingYear === year}
            onUpload={() => initUpload(year)}
          />
        );
      })}
    </div>
  );
}

function TimelineCard({ year, index, imageUrl, isUploading, onUpload }: { year: number, index: number, imageUrl?: string, isUploading: boolean, onUpload: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Use scroll progress roughly tracking when the card enters the viewport
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["0 1.1", "1.2 1"] 
  });

  // Animates from scale 0.8 to 1 as you scroll past it
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  // Animates opacity
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      ref={cardRef}
      style={{ scale: scaleProgress, opacity: opacityProgress }}
      className={`relative w-full flex items-center justify-between mb-24 md:mb-32 z-10 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* The glowing dot on the timeline axis */}
      <div className="absolute left-1/2 top-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full bg-brand-gold border-[4px] border-background -translate-x-1/2 -translate-y-1/2 z-20 shadow-[0_0_15px_rgba(212,175,55,0.4)]" />

      {/* Year Display */}
      <div className={`w-[45%] flex ${isEven ? 'justify-end pr-8 md:pr-24' : 'justify-start pl-8 md:pl-24'}`}>
        <h2 className="text-5xl md:text-8xl font-light text-brand-gold/20 tracking-tighter select-none">
          {year}
        </h2>
      </div>

      {/* Image Card UI */}
      <div className={`w-[45%] flex ${isEven ? 'justify-start' : 'justify-end'}`}>
        <div 
          onClick={onUpload}
          className="group relative w-full aspect-[3/4] max-w-[300px] cursor-pointer rounded-2xl md:rounded-3xl overflow-hidden backdrop-blur-md bg-white/40 border border-brand-border/40 shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:shadow-[0_30px_60px_rgb(0,0,0,0.12)] transition-all duration-700 ease-out flex items-center justify-center transform hover:-translate-y-2"
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-4 z-10 p-6">
              <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-light text-foreground/60 tracking-[0.2em] uppercase">Uploading</span>
            </div>
          ) : imageUrl ? (
            <>
              <Image 
                src={imageUrl} 
                alt={`Memory from ${year}`} 
                fill 
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Dim overlay that appears strictly on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                <span className="text-white font-light uppercase tracking-[0.2em] text-xs md:text-sm drop-shadow-md">Change Memory</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4 text-brand-gold/50 group-hover:text-brand-gold transition-colors duration-500 p-6 text-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 md:w-10 md:h-10">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span className="text-xs tracking-[0.2em] font-medium uppercase">Add Memory</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
