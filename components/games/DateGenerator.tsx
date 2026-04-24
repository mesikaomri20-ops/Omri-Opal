"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, DollarSign, Heart, Bot } from "lucide-react";

type Vibe = "צ'יל" | "אקטיבי" | "רומנטי" | "";
type Budget = "זול" | "בינוני" | "יקר" | "";
type LocationType = "בפנים" | "בחוץ" | "";

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

  const handleGenerate = async () => {
    if (!vibe || !budget || !locationType) return;
    
    setLoading(true);
    setSearched(true);
    setErrorMsg("");
    setIdeas([]);

    try {
      const res = await fetch("/api/generate-date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe, budget, locationType })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed AI fetch");
      if (!data.ideas || data.ideas.length === 0) throw new Error("Empty AI array");

      const generatedIdeas = data.ideas.map((idea: any, i: number) => ({ ...idea, id: i.toString() }));
      setIdeas(generatedIdeas);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("הבינה המלאכותית נתקלה בבעיה. אנא שימו לב ש-API KEY מוגדר כראוי או נסו שוב.");
    } finally {
      setLoading(false);
    }
  };

  const getVibeIcon = (v: string) => {
    switch (v) {
      case "צ'יל": return <span className="text-xl leading-none">☕</span>;
      case "אקטיבי": return <span className="text-xl leading-none">🧗</span>;
      case "רומנטי": return <span className="text-xl leading-none">🍷</span>;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-6 bg-[#FaFaFa]" dir="rtl">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 text-brand-gold mb-4">
          <Bot size={24} />
          <h2 className="text-3xl font-light tracking-wide text-foreground">מחולל דייטים (AI)</h2>
        </div>
        <p className="text-foreground/60 max-w-xl mx-auto">לא יכולים להחליט מה לעשות? תנו לבינה מלאכותית לייצר לכם רעיונות חדשים לחלוטין. ענו על 3 שאלות קצרות לחוויה מושלמת.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8 bg-white border border-brand-border/30 p-8 rounded-2xl shadow-sm">
          <div>
            <label className="text-sm font-semibold tracking-widest text-foreground flex items-center gap-2 mb-4">
              <Heart size={16} className="text-brand-gold"/> מה האווירה?
            </label>
            <div className="flex flex-wrap gap-3">
              {["צ'יל", "אקטיבי", "רומנטי"].map(v => (
                <button
                  key={v}
                  onClick={() => setVibe(v as Vibe)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all flex items-center gap-2 ${vibe === v ? "bg-brand-gold text-white border-brand-gold shadow-md" : "border-brand-border/50 hover:border-brand-gold text-foreground/80 hover:bg-brand-gold/5"}`}
                >
                  {getVibeIcon(v)} <span>{v}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold tracking-widest text-foreground flex items-center gap-2 mb-4">
              <DollarSign size={16} className="text-brand-gold"/> תקציב?
            </label>
            <div className="flex flex-wrap gap-3">
              {["זול", "בינוני", "יקר"].map(b => (
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

          <div>
            <label className="text-sm font-semibold tracking-widest text-foreground flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-brand-gold"/> בפנים או בחוץ?
            </label>
            <div className="flex flex-wrap gap-3">
              {["בפנים", "בחוץ"].map(l => (
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
            className="w-full py-4 mt-4 bg-brand-gold text-white rounded-lg flex items-center justify-center gap-2 tracking-widest text-sm font-semibold hover:bg-brand-gold/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse flex items-center gap-2"><Bot size={16}/> המערכת מחשבת רעיונות...</span>
            ) : (
              <>
                <Sparkles size={16} /> מחולל מבוסס AI
              </>
            )}
          </button>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {!searched && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-brand-border/50 rounded-2xl bg-white/50 text-foreground/40"
              >
                <Bot size={40} className="mb-4 opacity-50" />
                <p>ממתין לבחירות שלכם כדי לייצר קסם...</p>
              </motion.div>
            )}

            {searched && loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-foreground/50 text-sm tracking-wider animate-pulse">חוקר אפשרויות ל-{vibe} תחת התקציב {budget}...</p>
              </motion.div>
            )}

            {searched && !loading && ideas.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h3 className="text-xs tracking-widest text-brand-gold mb-6 flex items-center gap-2"><Bot size={14}/> תוצרי בינה מלאכותית</h3>
                {ideas.map((idea, index) => (
                  <motion.div
                    key={idea.id || index}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                    className="p-6 bg-white border border-brand-border/30 rounded-xl shadow-[0_10px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-1 h-full bg-brand-gold transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"/>
                    <h4 className="text-xl font-medium mb-3">{idea.title}</h4>
                    <p className="text-foreground/70 text-sm leading-relaxed">{idea.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                       <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-1 bg-brand-gold/10 text-brand-gold rounded">{idea.vibe}</span>
                       <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-1 bg-brand-gold/10 text-brand-gold rounded">{idea.budget}</span>
                       <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-1 bg-brand-gold/10 text-brand-gold rounded">{idea.location_type}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {searched && !loading && errorMsg && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-8 border border-red-200/50 rounded-2xl bg-red-50 text-red-500/80"
              >
                <p className="font-medium text-sm">{errorMsg}</p>
                <button onClick={() => { setSearched(false); setErrorMsg(""); }} className="mt-4 text-xs underline font-semibold text-red-400">אפסו ונסו שוב</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
