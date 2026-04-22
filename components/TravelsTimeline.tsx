"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface Travel {
  id: string;
  year: number;
  destination: string;
  created_at: string;
}

const START_YEAR = 2017;
const END_YEAR = 2026;
const YEARS = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i);

export default function TravelsTimeline() {
  const [travels, setTravels] = useState<Record<number, Travel[]>>({});
  const [loading, setLoading] = useState(true);

  // Add Trip modal state
  const [showModal, setShowModal] = useState(false);
  const [newYear, setNewYear] = useState(START_YEAR);
  const [newDestination, setNewDestination] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchTravels();
  }, []);

  const fetchTravels = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("travels")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching travels:", error);
    } else if (data) {
      const grouped: Record<number, Travel[]> = {};
      data.forEach((t: Travel) => {
        if (!grouped[t.year]) grouped[t.year] = [];
        grouped[t.year].push(t);
      });
      setTravels(grouped);
    }
    setLoading(false);
  };

  const handleAddTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDestination.trim()) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("travels")
        .insert({ year: newYear, destination: newDestination.trim() })
        .select()
        .single();

      if (error) throw error;

      setTravels((prev) => {
        const existing = prev[newYear] || [];
        return { ...prev, [newYear]: [...existing, data] };
      });

      setNewDestination("");
      setShowModal(false);
    } catch (error: any) {
      console.error("Error adding trip:", error);
      alert(`Failed to add trip. Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTrip = async (trip: Travel) => {
    if (!window.confirm(`Delete "${trip.destination}" from ${trip.year}?`)) return;

    // Optimistic removal
    setTravels((prev) => {
      const yearTrips = prev[trip.year] || [];
      return { ...prev, [trip.year]: yearTrips.filter((t) => t.id !== trip.id) };
    });

    try {
      const { error } = await supabase.from("travels").delete().eq("id", trip.id);
      if (error) throw error;
    } catch (error: any) {
      console.error("Error deleting trip:", error);
      alert(`Failed to delete. Error: ${error.message}`);
      fetchTravels(); // revert
    }
  };

  return (
    <>
      {/* Add Trip Button */}
      <div className="flex justify-center mb-16">
        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center gap-3 px-8 py-4 rounded-full border border-brand-border/60 hover:border-brand-gold/60 bg-white/40 backdrop-blur-md shadow-sm hover:shadow-[0_10px_30px_rgba(212,175,55,0.08)] transition-all duration-500 text-foreground/70 hover:text-foreground"
        >
          <span className="w-8 h-8 rounded-full border border-current flex items-center justify-center group-hover:border-brand-gold group-hover:text-brand-gold transition-colors duration-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </span>
          <span className="text-sm tracking-[0.15em] uppercase font-medium">Add a Trip</span>
        </button>
      </div>

      {/* Timeline */}
      <div className="w-full max-w-4xl mx-auto px-4 relative flex flex-col items-center">
        {/* Center vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-brand-border/80 to-transparent -translate-x-1/2 z-0" />

        {YEARS.map((year, index) => (
          <YearNode
            key={year}
            year={year}
            index={index}
            trips={travels[year] || []}
            onDelete={handleDeleteTrip}
          />
        ))}
      </div>

      {/* Add Trip Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => !submitting && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="bg-background border border-brand-border/50 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] p-10 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-light text-foreground mb-2 tracking-wide">Add a Trip</h3>
              <p className="text-sm text-foreground/50 mb-8 font-light">Where did your adventure take you?</p>

              <form onSubmit={handleAddTrip} className="space-y-6">
                {/* Year Selector */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-foreground/50 mb-2 font-medium">Year</label>
                  <select
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full bg-transparent border border-brand-border/60 rounded-xl px-4 py-3 text-foreground text-lg font-light outline-none focus:border-brand-gold transition-colors appearance-none cursor-pointer"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* Destination Input */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-foreground/50 mb-2 font-medium">Destination</label>
                  <input
                    type="text"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    placeholder="e.g. Paris, France"
                    className="w-full bg-transparent border border-brand-border/60 rounded-xl px-4 py-3 text-foreground text-lg font-light outline-none placeholder:text-foreground/25 focus:border-brand-gold transition-colors"
                    autoFocus
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl border border-brand-border/60 text-foreground/60 text-sm uppercase tracking-[0.15em] font-medium hover:border-foreground/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !newDestination.trim()}
                    className="flex-1 py-3 rounded-xl bg-brand-gold text-white text-sm uppercase tracking-[0.15em] font-medium hover:bg-brand-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                        Saving
                      </span>
                    ) : "Save Trip"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function YearNode({ year, index, trips, onDelete }: { year: number; index: number; trips: Travel[]; onDelete: (t: Travel) => void }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: nodeRef,
    offset: ["0 1.1", "1.2 1"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={nodeRef}
      style={{ scale, opacity }}
      className={`relative w-full flex items-start mb-20 md:mb-28 z-10 ${isEven ? "flex-row" : "flex-row-reverse"}`}
    >
      {/* Gold dot */}
      <div className="absolute left-1/2 top-2 w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-brand-gold border-[3px] border-background -translate-x-1/2 z-20 shadow-[0_0_12px_rgba(212,175,55,0.35)]" />

      {/* Year Label */}
      <div className={`w-[45%] flex ${isEven ? "justify-end pr-8 md:pr-16" : "justify-start pl-8 md:pl-16"}`}>
        <h2 className="text-4xl md:text-7xl font-light text-brand-gold/20 tracking-tighter select-none">{year}</h2>
      </div>

      {/* Trips List */}
      <div className={`w-[45%] ${isEven ? "pl-8 md:pl-16" : "pr-8 md:pr-16"}`}>
        {trips.length === 0 ? (
          <p className="text-sm text-foreground/25 font-light italic pt-2">No trips yet</p>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, x: isEven ? -12 : 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="group flex items-center gap-3"
              >
                {/* Plane icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold/60 flex-shrink-0">
                  <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                </svg>
                <span className="text-base md:text-lg text-foreground font-light tracking-wide">{trip.destination}</span>
                {/* Delete icon */}
                <button
                  onClick={() => onDelete(trip)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-foreground/20 hover:text-red-400 flex-shrink-0"
                  title="Delete trip"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
