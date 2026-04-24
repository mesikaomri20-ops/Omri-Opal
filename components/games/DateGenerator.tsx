"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, MapPin, DollarSign, Heart } from "lucide-react";

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

  const supabase = createClient();

  const fallbackIdeas: DateIdea[] = [
    { id: "1", title: "מרתון סרטים בבית", description: "תעשו פופקורן, תבנו אוהל שמיכות ותראו 3 סרטים ברצף.", vibe: "צ'יל", budget: "זול", location_type: "בפנים" },
    { id: "2", title: "ארוחת ערב יוקרתית וקוקטיילים", description: "תתלבשו יפה ותלכו למסעדה החדשה והשווה בעיר.", vibe: "רומנטי", budget: "יקר", location_type: "בפנים" },
    { id: "3", title: "טיול שקיעה ופיקניק", description: "תארזו סל עם גבינות ויין, ותטפסו להר כדי לראות את השקיעה.", vibe: "אקטיבי", budget: "בינוני", location_type: "בחוץ" },
    { id: "4", title: "נסיעה ותצפית כוכבים", description: "סעו מחוץ לעיר, תשכבו על מכסה המנוע ותסתכלו על כוכבים נופלים.", vibe: "צ'יל", budget: "זול", location_type: "בחוץ" },
    { id: "5", title: "סדנת בישול זוגית", description: "תלמדו להכין פסטה בעבודת יד או סושי ביחד.", vibe: "רומנטי", budget: "בינוני", location_type: "בפנים" },
    { id: "6", title: "קיר טיפוס", description: "לכו למכון טיפוס ותאתגרו אחד את השנייה על הקירות.", vibe: "אקטיבי", budget: "בינוני", location_type: "בפנים" },
  ];

  const handleGenerate = async () => {
    if (!vibe || !budget || !locationType) return;
    
    setLoading(true);
    setSearched(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase
        .from('date_ideas')
        .select('*')
        .eq('vibe', vibe)
        .eq('budget', budget)
        .eq('location_type', locationType)
        .limit(10);

      let finalIdeas = data || [];

      if (error || finalIdeas.length === 0) {
        finalIdeas = fallbackIdeas.filter(idea => 
          idea.vibe === vibe && idea.budget === budget && idea.location_type === locationType
        );
      }

      const shuffled = finalIdeas.sort(() => 0.5 - Math.random());
      setIdeas(shuffled.slice(0, 3));
    } catch (err) {
      setErrorMsg("שגיאה במשיכת הנתונים. נשתמש בגיבוי.");
      setIdeas(fallbackIdeas.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  const getVibeIcon = (v: string) => {
    switch (v) {
      case "צ'יל": return <span className="text-xl">☕</span>;
      case "אקטיבי": return <span className="text-xl">🧗</span>;
      case "רומנטי": return <span className="text-xl">🍷</span>;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-6 bg-[#FaFaFa]" dir="rtl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-light tracking-wide text-foreground mb-4">מחולל דייטים</h2>
        <p className="text-foreground/60 max-w-xl mx-auto">לא יכולים להחליט מה לעשות? תנו ליקום (ולמסד הנתונים שלנו) להחליט בשבילכם. ענו על 3 שאלות קצרות וקבלו רעיונות לדייט מושלם.</p>
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
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${vibe === v ? "bg-brand-gold text-white border-brand-gold shadow-md" : "border-brand-border/50 hover:border-brand-gold text-foreground/80 hover:bg-brand-gold/5"}`}
                >
                  {getVibeIcon(v)} <span className="mr-2">{v}</span>
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
            className="w-full py-4 mt-4 bg-brand-gold text-white rounded-lg flex items-center justify-center gap-2 tracking-widest text-sm font-semibold hover:bg-brand-gold/90 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">מתייעץ עם הכוכבים...</span>
            ) : (
              <>
                מצא רעיונות <Sparkles size={16} />
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
                <Sparkles size={40} className="mb-4 opacity-50" />
                <p>ממתין לבחירות שלכם...</p>
              </motion.div>
            )}

            {searched && !loading && ideas.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h3 className="text-xs tracking-widest text-brand-gold mb-6">הרעיונות הנבחרים שלכם</h3>
                {ideas.map((idea, index) => (
                  <motion.div
                    key={idea.id || index}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                    className="p-6 bg-white border border-brand-border/30 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-1 h-full bg-brand-gold transform translate-x-full group-hover:translate-x-0 transition-transform"/>
                    <h4 className="text-xl font-medium mb-2">{idea.title}</h4>
                    <p className="text-foreground/70 text-sm leading-relaxed">{idea.description}</p>
                    <div className="mt-4 flex gap-2">
                       <span className="text-[10px] tracking-wider px-2 py-1 bg-brand-gold/10 text-brand-gold rounded">{idea.vibe}</span>
                       <span className="text-[10px] tracking-wider px-2 py-1 bg-brand-gold/10 text-brand-gold rounded">{idea.budget}</span>
                       <span className="text-[10px] tracking-wider px-2 py-1 bg-brand-gold/10 text-brand-gold rounded">{idea.location_type}</span>
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
                <p>לא מצאנו רעיון שמתאים בדיוק לכל הפילטרים, אולי ננסה להגמיש קצת את הדרישות?</p>
                <button onClick={() => { setVibe(""); setBudget(""); setLocationType(""); setSearched(false); }} className="mt-4 text-brand-gold text-sm underline">אפס ונסה שוב</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
