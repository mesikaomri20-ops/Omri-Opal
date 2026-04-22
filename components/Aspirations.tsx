"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Aspiration {
  id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
}

export default function Aspirations() {
  const [aspirations, setAspirations] = useState<Aspiration[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchAspirations();
  }, []);

  const fetchAspirations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("aspirations")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching aspirations:", error);
    } else {
      setAspirations(data || []);
    }
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Optimistic UI update
    const tempId = crypto.randomUUID();
    const newAspiration: Aspiration = {
      id: tempId,
      title: newTitle.trim(),
      is_completed: false,
      created_at: new Date().toISOString()
    };

    setAspirations(prev => [...prev, newAspiration]);
    setNewTitle("");

    const { data, error } = await supabase
      .from("aspirations")
      .insert([{ title: newAspiration.title }])
      .select()
      .single();

    if (error) {
      console.error("Error inserting aspiration:", error);
      alert(`Failed to save! Check Supabase SQL/RLS policies. Error: ${error.message}`);
      setAspirations(prev => prev.filter(a => a.id !== tempId)); // Rollback
    } else if (data) {
      // Replace temporary ID with real DB ID
      setAspirations(prev => prev.map(a => a.id === tempId ? data : a));
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    // Optimistic UI update
    setAspirations(prev => prev.map(a => a.id === id ? { ...a, is_completed: !currentStatus } : a));

    const { error } = await supabase
      .from("aspirations")
      .update({ is_completed: !currentStatus })
      .eq("id", id);

    if (error) {
      console.error("Error toggling aspiration:", error);
      // Rollback
      setAspirations(prev => prev.map(a => a.id === id ? { ...a, is_completed: currentStatus } : a));
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistic UI update
    const previous = [...aspirations];
    setAspirations(prev => prev.filter(a => a.id !== id));

    const { error } = await supabase
      .from("aspirations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting aspiration:", error);
      // Rollback
      setAspirations(previous);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-12 backdrop-blur-md bg-white/60 border border-brand-border/40 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <h2 className="text-2xl md:text-3xl font-light text-center tracking-wide mb-8 text-foreground" dir="rtl">
        השאיפות שלנו
      </h2>

      <div className="space-y-4" dir="rtl">
        <form onSubmit={handleAdd} className="relative mb-8">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="מה השאיפה הבאה שלכם?"
            className="w-full bg-transparent border-b border-brand-border/60 pb-3 outline-none text-foreground text-lg md:text-xl placeholder:text-foreground/30 transition-colors focus:border-brand-gold pr-2"
          />
        </form>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-brand-border/30 rounded w-full"></div>
            <div className="h-6 bg-brand-border/30 rounded w-3/4"></div>
            <div className="h-6 bg-brand-border/30 rounded w-5/6"></div>
          </div>
        ) : aspirations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-foreground/40 text-lg font-light">אין עדיין שאיפות ברשימה, תתחילו לחלום!</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {aspirations.map((aspiration) => (
              <li 
                key={aspiration.id}
                className="group flex items-center justify-between py-4 hover:bg-white/50 px-4 -mx-4 rounded-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-5 cursor-pointer flex-1" onClick={() => toggleStatus(aspiration.id, aspiration.is_completed)}>
                  <button 
                    className={`w-6 h-6 rounded-full border flex flex-shrink-0 items-center justify-center transition-all duration-300 ${aspiration.is_completed ? 'bg-brand-gold border-brand-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 'border-brand-border/80 hover:border-brand-gold'}`}
                  >
                    {aspiration.is_completed && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                  <span className={`text-lg md:text-xl font-light transition-all duration-300 relative ${aspiration.is_completed ? 'text-foreground/40' : 'text-foreground'}`}>
                    {aspiration.title}
                    {/* Strikethrough line animation */}
                    <span className={`absolute right-0 top-1/2 h-[1.5px] bg-foreground/40 transition-all duration-500 ease-out ${aspiration.is_completed ? 'w-full' : 'w-0'}`}></span>
                  </span>
                </div>
                
                <button 
                  onClick={() => handleDelete(aspiration.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-foreground/30 hover:text-red-400"
                  aria-label="Delete"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
