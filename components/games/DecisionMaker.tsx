"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function DecisionMaker() {
  const [input, setInput] = useState("");
  const [decision, setDecision] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const fallbackAnswers = [
    "בטוח שכן!",
    "ממש לא.",
    "הייתי הולך על זה.",
    "עדיף לוותר הפעם.",
    "תלוי כמה אתם עייפים...",
    "לכו על זה בלי לחשוב פעמיים!",
    "אין התלבטות בכלל, כן."
  ];

  const handleDecide = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    
    setIsThinking(true);
    setDecision(null);

    // Artificial suspense delay for premium feel
    setTimeout(() => {
      let finalDecision = "";
      const text = input.trim();

      if (text.includes(" או ")) {
        const parts = text.split(" או ");
        finalDecision = parts[Math.floor(Math.random() * parts.length)].trim();
      } else if (text.startsWith("מי ")) {
        const couples = ["עומרי 😉", "אופל ✨"];
        finalDecision = couples[Math.floor(Math.random() * couples.length)];
      } else {
        finalDecision = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
      }

      setDecision(finalDecision);
      setIsThinking(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-brand-border/50 rounded-2xl p-6 md:p-10 shadow-lg relative overflow-hidden" dir="rtl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light text-foreground mb-3">מי מחליט?</h2>
        <p className="text-foreground/60 text-sm">קשה לבחור? כתבו לי פיצה או סושי, מי מוריד את הכלב, או כל התלבטות אחרת... ה-AI יכריע!</p>
      </div>

      <form onSubmit={handleDecide} className="flex flex-col gap-4 max-w-md mx-auto relative z-10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="לדוגמה: המבורגר או סושי?"
          className="w-full text-center bg-transparent border-b border-brand-border pb-3 outline-none focus:border-brand-gold transition-colors text-lg font-light"
          disabled={isThinking}
        />
        
        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          className="w-full py-4 mt-2 bg-brand-dark text-white rounded-xl tracking-widest text-sm font-semibold hover:bg-brand-dark/90 transition-all shadow-md items-center justify-center flex gap-2 disabled:opacity-50"
        >
          {isThinking ? (
            <span className="animate-pulse tracking-widest uppercase text-xs">מחשב מסלול מחדש...</span>
          ) : (
            <>
              תחליט בשבילי <Sparkles size={16} className="text-brand-gold"/>
            </>
          )}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {decision && !isThinking && (
          <motion.div
            key={decision}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mt-10 text-center"
          >
            <span className="text-xs tracking-[0.3em] font-medium text-brand-gold uppercase block mb-3">החלטת המערכת</span>
            <div className="inline-block px-8 py-4 bg-brand-gold/10 rounded-2xl border border-brand-gold/30">
              <h3 className="text-2xl md:text-4xl font-light text-brand-dark">{decision}</h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
