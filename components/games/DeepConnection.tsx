"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { HeartPulse } from "lucide-react";

export default function DeepConnection() {
  const [question, setQuestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const fallbackQuestions = [
    "מהו הזיכרון האהוב עליך מהשנה האחרונה שלנו יחד?",
    "איזה חלום אישי היית רוצה שנגשים יחד?",
    "מה משהו קטן שעשיתי לאחרונה וגרם לך להרגיש נאהב/ת?",
    "מתי בפעם האחרונה הרגשת גאווה עצומה בי?",
    "אם הייתה לנו מכונת זמן, לאיזה רגע בזוגיות שלנו היית רוצה לחזור?",
    "איזו תכונה אצלי אתה/אני הכי כדאי שנאמץ יותר?",
    "מה המשמעות של הצלחה זוגית בעיניך בעוד 5 שנים?",
    "מה נותן לך הכי הרבה השראה בחיים שלנו כרגע?"
  ];

  const fetchQuestion = async () => {
    setIsLoading(true);
    setQuestion(null);

    // Minor artificial delay for emphasis
    await new Promise(r => setTimeout(r, 600));

    try {
      const { data, error } = await supabase.from("deep_talk_questions").select("*");
      if (!error && data && data.length > 0) {
        const randomItem = data[Math.floor(Math.random() * data.length)];
        // Adapt gracefully across different standard column text namings
        setQuestion(randomItem.question || randomItem.text || randomItem.content || fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)]);
      } else {
        setQuestion(fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)]);
      }
    } catch {
      setQuestion(fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)]);
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#1A1A1A] text-white border border-white/10 rounded-3xl p-8 md:p-14 shadow-2xl relative overflow-hidden text-center" dir="rtl">
      {/* Decorative Blur */}
      <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-full h-[150%] max-w-[600px] bg-brand-gold/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[220px]">
        <AnimatePresence mode="wait">
          {!question && !isLoading && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-6"
            >
               <HeartPulse className="w-12 h-12 text-brand-gold opacity-80 mx-auto" strokeWidth={1} />
               <div>
                 <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-2 text-white">זמן איכות - שאלות עמוקות</h2>
                 <p className="text-white/50 text-sm md:text-base font-light">קחו רגע להתחבר, לדבר על הכל, ולהכיר אחד את השנייה אפילו יותר.</p>
               </div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
               <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto" />
            </motion.div>
          )}

          {question && !isLoading && (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="py-6 px-4"
            >
               <h3 className="text-2xl md:text-4xl leading-relaxed md:leading-[1.4] font-light text-white text-balance">
                 "{question}"
               </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 mt-10 flex justify-center">
        <button
          onClick={fetchQuestion}
          disabled={isLoading}
          className="px-10 py-4 border border-brand-gold/50 bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 text-brand-gold rounded-full tracking-widest text-sm font-medium disabled:opacity-50"
        >
          {question ? "שלפי שאלה נוספת" : "שלפי שאלה"}
        </button>
      </div>
    </div>
  );
}
