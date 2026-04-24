"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, MapPin, DollarSign, Heart } from "lucide-react";

type Vibe = "Chill" | "Active" | "Romantic" | "";
type Budget = "Cheap" | "Moderate" | "Fancy" | "";
type LocationType = "Indoor" | "Outdoor" | "";

interface DateIdea {
  id: string;
  title: string;
  description: string;
  vibe: string;
  budget: string;
  location_type: string;
}

export default function DateGenerator() {
  const [vibe, setVibe] = useState<Vibe>("");
  const [budget, setBudget] = useState<Budget>("");
  const [locationType, setLocationType] = useState<LocationType>("");
  
  const [ideas, setIdeas] = useState<DateIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  // Very simple fallback data just in case the DB is missing or empty
  const fallbackIdeas: DateIdea[] = [
    { id: "1", title: "Indoor Movie Marathon", description: "Grab the popcorn, build a fort, and watch 3 movies back-to-back.", vibe: "Chill", budget: "Cheap", location_type: "Indoor" },
    { id: "2", title: "Fancy Dinner & Cocktails", description: "Dress up nice and go to that new upscale restaurant downtown.", vibe: "Romantic", budget: "Fancy", location_type: "Indoor" },
    { id: "3", title: "Sunset Hike & Picnic", description: "Pack a basket with cheese and wine, hike up a scenic trail to catch the sunset.", vibe: "Active", budget: "Moderate", location_type: "Outdoor" },
    { id: "4", title: "Stargazing Drive", description: "Drive out from the city lights, lie on the car hood, and watch the stars.", vibe: "Chill", budget: "Cheap", location_type: "Outdoor" },
    { id: "5", title: "Couples Cooking Class", description: "Learn to make handmade pasta or sushi together.", vibe: "Romantic", budget: "Moderate", location_type: "Indoor" },
    { id: "6", title: "Rock Climbing", description: "Hit the local bouldering gym and challenge each other on the walls.", vibe: "Active", budget: "Moderate", location_type: "Indoor" },
  ];

  const handleGenerate = async () => {
    if (!vibe || !budget || !locationType) return;
    
    setLoading(true);
    setSearched(true);
    setErrorMsg("");

    try {
      // Trying to fetch from Supabase table 'date_ideas'
      const { data, error } = await supabase
        .from('date_ideas')
        .select('*')
        .eq('vibe', vibe)
        .eq('budget', budget)
        .eq('location_type', locationType)
        .limit(10); // get a few

      let finalIdeas = data || [];

      // If missing table or empty, use fallback simulation
      if (error || finalIdeas.length === 0) {
        if (error) console.error("Supabase query error:", error.message);
        
        finalIdeas = fallbackIdeas.filter(idea => 
          idea.vibe === vibe && idea.budget === budget && idea.location_type === locationType
        );
        
        if (finalIdeas.length === 0) {
           // If fallbacks don't match exactly, just return some random generic fallbacks to ensure there is always a result
           finalIdeas = [...fallbackIdeas].sort(() => 0.5 - Math.random()).slice(0, 3);
        }
      }

      // Randomize and take up to 3
      const shuffled = finalIdeas.sort(() => 0.5 - Math.random());
      setIdeas(shuffled.slice(0, 3));
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to fetch date ideas. Using fallbacks.");
      setIdeas(fallbackIdeas.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  const getVibeIcon = (v: string) => {
    switch (v) {
      case "Chill": return <span className="text-xl">☕</span>;
      case "Active": return <span className="text-xl">🧗</span>;
      case "Romantic": return <span className="text-xl">🍷</span>;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-6 bg-[#FaFaFa]">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-light tracking-wide text-foreground mb-4">Date Night Generator</h2>
        <p className="text-foreground/60 max-w-xl mx-auto">Can't decide what to do? Let the universe (and our database) decide for you. Answer 3 quick questions and get your perfect date.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Form Selection */}
        <div className="space-y-8 bg-white border border-brand-border/30 p-8 rounded-2xl shadow-sm">
          {/* Vibe */}
          <div>
            <label className="text-sm font-semibold tracking-widest text-foreground uppercase flex items-center gap-2 mb-4">
              <Heart size={16} className="text-brand-gold"/> What's the vibe?
            </label>
            <div className="flex flex-wrap gap-3">
              {["Chill", "Active", "Romantic"].map(v => (
                <button
                  key={v}
                  onClick={() => setVibe(v as Vibe)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${vibe === v ? "bg-brand-gold text-white border-brand-gold shadow-md" : "border-brand-border/50 hover:border-brand-gold text-foreground/80 hover:bg-brand-gold/5"}`}
                >
                  {getVibeIcon(v)} <span className="ml-2">{v}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="text-sm font-semibold tracking-widest text-foreground uppercase flex items-center gap-2 mb-4">
              <DollarSign size={16} className="text-brand-gold"/> Budget?
            </label>
            <div className="flex flex-wrap gap-3">
              {["Cheap", "Moderate", "Fancy"].map(b => (
                <button
                  key={b}
                  onClick={() => setBudget(b as Budget)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${budget === b ? "bg-brand-gold text-white border-brand-gold shadow-md" : "border-brand-border/50 hover:border-brand-gold text-foreground/80 hover:bg-brand-gold/5"}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-semibold tracking-widest text-foreground uppercase flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-brand-gold"/> Indoor or Outdoor?
            </label>
            <div className="flex flex-wrap gap-3">
              {["Indoor", "Outdoor"].map(l => (
                <button
                  key={l}
                  onClick={() => setLocationType(l as LocationType)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${locationType === l ? "bg-brand-gold text-white border-brand-gold shadow-md" : "border-brand-border/50 hover:border-brand-gold text-foreground/80 hover:bg-brand-gold/5"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!vibe || !budget || !locationType || loading}
            className="w-full py-4 mt-4 bg-brand-gold text-white rounded-lg flex items-center justify-center gap-2 uppercase tracking-widest text-sm font-semibold hover:bg-brand-gold/90 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Consulting the oracle...</span>
            ) : (
              <>
                Generate IDEAS <Sparkles size={16} />
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {!searched && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-brand-border/50 rounded-2xl bg-white/50 text-foreground/40"
              >
                <Sparkles size={40} className="mb-4 opacity-50" />
                <p>Awaiting your selections...</p>
              </motion.div>
            )}

            {searched && !loading && ideas.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h3 className="text-xs uppercase tracking-widest text-brand-gold mb-6">Your Curated Ideas</h3>
                {ideas.map((idea, index) => (
                  <motion.div
                    key={idea.id || index}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                    className="p-6 bg-white border border-brand-border/30 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform"/>
                    <h4 className="text-xl font-medium mb-2">{idea.title}</h4>
                    <p className="text-foreground/70 text-sm leading-relaxed">{idea.description}</p>
                    <div className="mt-4 flex gap-2">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-brand-gold/10 text-brand-gold rounded">{idea.vibe}</span>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-brand-gold/10 text-brand-gold rounded">{idea.budget}</span>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-brand-gold/10 text-brand-gold rounded">{idea.location_type}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {searched && !loading && ideas.length === 0 && (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-8 border border-brand-border/50 rounded-2xl bg-white text-foreground/60"
              >
                <p>Oops, we couldn't find a perfect match for that combination.</p>
                <button onClick={() => { setVibe(""); setBudget(""); setLocationType(""); setSearched(false); }} className="mt-4 text-brand-gold text-sm underline">Reset and try again</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
