"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRandomQuestions, Question } from "@/lib/games/data";
import { RefreshCw, CheckCircle } from "lucide-react";

type GamePhase = "select-target" | "target-answers" | "lock-screen" | "guesser-answers" | "results";

export default function QuizGame() {
  const [phase, setPhase] = useState<GamePhase>("select-target");
  const [targetName, setTargetName] = useState<string>("");
  const [guesserName, setGuesserName] = useState<string>("");
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  
  const [targetAnswers, setTargetAnswers] = useState<Record<string, string>>({});
  const [guesserAnswers, setGuesserAnswers] = useState<Record<string, string>>({});
  
  const [currentInput, setCurrentInput] = useState("");

  const startGame = (target: string, guesser: string) => {
    setTargetName(target);
    setGuesserName(guesser);
    setQuestions(getRandomQuestions(10));
    setCurrentQIndex(0);
    setTargetAnswers({});
    setGuesserAnswers({});
    setPhase("target-answers");
  };

  const handleAnswerSubmit = () => {
    if (!currentInput.trim()) return;

    const currentQ = questions[currentQIndex];
    if (phase === "target-answers") {
      setTargetAnswers({ ...targetAnswers, [currentQ.id]: currentInput });
    } else if (phase === "guesser-answers") {
      setGuesserAnswers({ ...guesserAnswers, [currentQ.id]: currentInput });
    }

    setCurrentInput("");

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      if (phase === "target-answers") {
        setPhase("lock-screen");
      } else {
        setPhase("results");
      }
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      const targetAns = targetAnswers[q.id]?.toLowerCase().trim();
      const guessAns = guesserAnswers[q.id]?.toLowerCase().trim();
      
      if (targetAns === guessAns) {
        score++;
      } else if (targetAns && guessAns && (targetAns.includes(guessAns) || guessAns.includes(targetAns))) {
        score++;
      }
    });
    return Math.round((score / questions.length) * 100);
  };

  const getResultMessage = (score: number) => {
    if (score === 100) return "נפשות תאומות! אתם יודעים הכל.";
    if (score >= 80) return "מרשים! אתם מכירים אחד את השנייה כל כך טוב.";
    if (score >= 50) return "לא רע, אבל אולי הגיע הזמן לשיחת עומק!";
    return "הגיע הזמן לדייט כדי להשלים פערים!";
  };

  const resetGame = () => {
    setPhase("select-target");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-background border border-brand-border/50 rounded-2xl p-6 md:p-10 shadow-lg relative overflow-hidden" dir="rtl">
      <AnimatePresence mode="wait">
        {phase === "select-target" && (
          <motion.div key="select" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="text-center space-y-8">
            <div>
              <h2 className="text-2xl font-light text-brand-gold mb-2 uppercase tracking-widest">עד כמה אתם מכירים עלי?</h2>
              <p className="text-foreground/70">בחרו מי בוחן את מי היום.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button 
                onClick={() => startGame("עומרי", "אופל")}
                className="px-6 py-4 rounded-lg bg-white/5 border border-brand-border hover:border-brand-gold hover:bg-brand-gold/10 transition-all text-sm tracking-wider group"
              >
                האם <span className="text-brand-gold font-medium">אופל</span> מכירה את עומרי?
              </button>
              <button 
                onClick={() => startGame("אופל", "עומרי")}
                className="px-6 py-4 rounded-lg bg-white/5 border border-brand-border hover:border-brand-gold hover:bg-brand-gold/10 transition-all text-sm tracking-wider"
              >
                האם <span className="text-brand-gold font-medium">עומרי</span> מכיר את אופל?
              </button>
            </div>
          </motion.div>
        )}

        {(phase === "target-answers" || phase === "guesser-answers") && (
          <motion.div key={`quiz-${phase}`} variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs tracking-widest text-brand-gold">
                {phase === "target-answers" ? `התור של ${targetName} (קביעת התשובות)` : `התור של ${guesserName} (ניחוש)`}
              </span>
              <span className="text-xs text-foreground/50">{currentQIndex + 1} / {questions.length}</span>
            </div>

            <div className="min-h-[150px] flex items-center justify-center text-center">
              <h3 className="text-xl md:text-2xl font-light leading-relaxed">
                {questions[currentQIndex]?.text}
              </h3>
            </div>

            <div className="space-y-4 max-w-md mx-auto mt-8">
              {questions[currentQIndex]?.type === "multiple-choice" ? (
                <div className="grid gap-3">
                  {questions[currentQIndex].options?.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setCurrentInput(opt)}
                      className={`p-4 rounded-lg border text-right transition-all ${currentInput === opt ? 'bg-brand-gold text-background border-brand-gold' : 'border-brand-border hover:border-brand-gold/50 bg-white/5'}`}
                    >
                      {opt}
                    </button>
                  ))}
                  {currentInput && (
                    <motion.button
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      onClick={handleAnswerSubmit}
                      className="mt-4 w-full py-3 bg-brand-gold text-background rounded-lg tracking-widest text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      אישור
                    </motion.button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder="הקלד/י את התשובה..."
                    className="w-full bg-transparent border-b border-brand-border focus:border-brand-gold py-2 px-1 outline-none text-center transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                  />
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={!currentInput.trim()}
                    className="w-full py-3 bg-white/5 border border-brand-border text-brand-gold rounded-lg tracking-widest text-xs font-semibold hover:bg-brand-gold hover:text-background transition-all disabled:opacity-50"
                  >
                    הבא
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {phase === "lock-screen" && (
          <motion.div key="lock" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="text-center space-y-8 py-10">
            <div className="w-20 h-20 mx-auto rounded-full bg-brand-gold/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-brand-gold" />
            </div>
            <div>
              <h2 className="text-3xl font-light text-foreground mb-4">כל הכבוד, {targetName}!</h2>
              <p className="text-xl text-foreground/70">עכשיו, תעביר/י את המחשב אל <span className="text-brand-gold font-medium">{guesserName}</span>.</p>
              <p className="text-sm mt-2 text-foreground/50">בלי להציץ בתשובות!</p>
            </div>
            
            <button 
              onClick={() => { setCurrentQIndex(0); setPhase("guesser-answers"); }}
              className="mt-8 px-8 py-3 bg-brand-gold text-background rounded-full tracking-widest text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              אני {guesserName}, בואו נתחיל!
            </button>
          </motion.div>
        )}

        {phase === "results" && (
          <motion.div key="results" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="text-center space-y-8 py-4">
            <h2 className="text-sm tracking-[0.3em] text-brand-gold">תוצאות</h2>
            
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" className="stroke-brand-border fill-transparent" strokeWidth="4" />
                <motion.circle 
                  cx="80" cy="80" r="70" 
                  className="stroke-brand-gold fill-transparent" strokeWidth="8" strokeDasharray={440}
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * calculateScore()) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-light">{calculateScore()}%</span>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-light mb-2">{getResultMessage(calculateScore())}</h3>
              <p className="text-foreground/60 text-sm">
                {guesserName} ענה/תה נכון על {(calculateScore() / 100) * questions.length} מתוך {questions.length} שאלות.
              </p>
            </div>

            <div className="pt-6">
              <button 
                onClick={resetGame}
                className="inline-flex items-center gap-2 text-sm tracking-widest text-foreground hover:text-brand-gold transition-colors"
              >
                <RefreshCw size={16} /> שחק/י שוב
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
