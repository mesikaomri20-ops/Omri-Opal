"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";

export interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  image_url: string | null;
  align: string;
}

export default function Timeline({ events }: { events: TimelineEvent[] }) {
  if (!events || events.length === 0) {
    return <div className="text-center py-20 text-foreground/50">No memories recorded yet...</div>
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto py-20 px-4 md:px-0">
      
      {/* The Central Thread Line */}
      <div className="absolute left-[40px] md:left-1/2 top-0 bottom-0 w-[1px] bg-brand-border md:-translate-x-1/2 transform origin-top"></div>

      <div className="flex flex-col space-y-24">
        {events.map((event) => {
          const isLeft = event.align === "left";

          return (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`relative flex flex-col md:flex-row items-center md:justify-between w-full
                ${!isLeft ? "md:flex-row-reverse" : ""}
                pl-[80px] md:pl-0`}
            >
              
              {/* Event Marker Node */}
              <div className="absolute left-[40px] md:left-1/2 top-8 md:top-1/2 w-4 h-4 bg-background border-2 border-brand-gold rounded-full transform -translate-x-[7px] md:-translate-x-1/2 md:-translate-y-1/2 z-10 
              shadow-[0_0_0_4px_rgba(250,249,246,1)] transition-colors duration-300 hover:bg-brand-gold">
              </div>

              {/* Content Card */}
              <div className={`w-full md:w-[45%] flex flex-col pt-6 md:pt-0 mb-6 md:mb-0
                ${isLeft ? "md:items-end md:text-right" : "md:items-start md:text-left"}`}>
                
                <span className="text-brand-gold text-xs font-semibold tracking-widest mb-3 uppercase">
                  {event.year}
                </span>
                
                <h3 className="text-xl md:text-3xl font-light text-foreground mb-4 font-sans tracking-wide">
                  {event.title}
                </h3>
                
                <p className="text-foreground/70 font-light text-sm md:text-base leading-relaxed md:max-w-md">
                  {event.description}
                </p>

              </div>

              {/* Image Box */}
              <div className="w-full md:w-[45%] aspect-[4/3] bg-brand-light/40 border border-brand-border rounded-xl flex items-center justify-center relative overflow-hidden group">
                {event.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-brand-gold/30 transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/5 outline-none pointer-events-none"></div>
                  </>
                )}
              </div>

            </motion.div>
          );
        })}
      </div>
      
    </div>
  );
}
