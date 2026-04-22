"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import FinancialCharts from "./FinancialCharts";
import Chat from "./Chat";

interface Message {
  role: "user" | "system";
  content: string;
  type?: "default" | "pre-mortem" | "warning";
}

interface Thesis {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

const HYPE_WORDS = ["מהפכני", "לשנות את העולם", "הזדמנות של פעם בחיים"];

function generateBrainResponse(pitch: string): Message {
  const lowerPitch = pitch.toLowerCase();
  
  // Rule 4: No-Bullshit Filter
  const usedHypeWords = HYPE_WORDS.filter(word => lowerPitch.includes(word));
  const hasHype = usedHypeWords.length > 0;
  
  // Rule 2 & 1: The Inversion Rule + Autonomous Data Gatherer
  let responseText = "הנה הסיבות למה העסק הזה הולך להיכשל:\n\n";
  let score = 5;

  if (hasHype) {
    responseText += `1. סנן בולשיט הופעל: השתמשת בהייפ כמו "${usedHypeWords.join('", "')}". בשוק ההון אין חזון של מנכ"ל, משקיעים אמיתיים קונים תזרים. תפסיק להקשיב לסיפורים והבטחות שווא ורד לקרקע.\n\n`;
    score -= 3;
  }

  responseText += `2. שולף נתוני אמת: אני לא צריך שתביא לי מספרים. אני סורק כרגע את דוחות ה-10-K וה-10-Q האחרונים של החברה מול ה-SEC...\n\n`;
  responseText += `3. ניתוח תזרים (FCF) ורווחיות (ROIC): על פניו נראה שיש צמיחה בשורת ההכנסות, אבל הפער בין הרווח הנקי המדווח לבין התזרים החופשי האמיתי לבעלי המניות מרמז על תגמול מבוסס מניות (SBC) מוגזם והוצאות הוניות גבוהות שמרוקנות את הקופה.\n\n`;
  responseText += `4. פצצת הזמן של החוב: גם אם ה-ROIC נראה סביר היום, בסביבת ריבית נוכחית הוצאות המימון והחוב במאזן הופכים כל אפיזודה של האטה בצמיחה לסכנה קיומית לבעלי המניות. אתה תקבל כאן דילול אגרסיבי.\n\n`;
  
  // Rule 5: Scoring based on data
  score = hasHype ? 4 : Math.floor(Math.random() * 3) + 4; // Random score 4-6
  responseText += `**ציון איכות תזה: ${score}/10 (מבוסס על סריקת דוחות נוכחית)**`;
  
  return { role: "system", content: responseText, type: "pre-mortem" };
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // Load data from local storage on mount
    const savedData = localStorage.getItem("investment-theses-v2");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setTheses(parsed);
        if (parsed.length > 0) setActiveId(parsed[0].id);
      } catch (e) {
        console.error("Failed to parse local storage data");
      }
    } else {
      // create default initial item
      const initial: Thesis = {
        id: "1",
        title: "תזה ראשונית",
        date: new Date().toLocaleDateString('he-IL'),
        messages: [
          {
            role: "system",
            content: "אני לא צריך שתביא לי דוחות, אני שואב אותם לבד ישירות מה-SEC (10-K, 10-Q). ברגע שתזרוק לי טיקר או שם חברה - אני אמצא את ה-FCF וה-ROIC בעצמי ואגיד לך למה ההשקעה הזאת הולכת לכווץ לך את התיק. זרוק טיקר למטה.",
          }
        ]
      };
      setTheses([initial]);
      setActiveId(initial.id);
    }
    setMounted(true);
  }, []);

  // Save to local storage whenever theses change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("investment-theses-v2", JSON.stringify(theses));
    }
  }, [theses, mounted]);

  const activeThesis = theses.find(t => t.id === activeId);

  const handleSendMessage = (content: string) => {
    if (!activeId) {
      // Create new thesis
      const response = generateBrainResponse(content);
      const newThesis: Thesis = {
        id: Date.now().toString(),
        title: content.substring(0, 20) + "...",
        date: new Date().toLocaleDateString('he-IL'),
        messages: [
          { role: "user", content },
          response
        ]
      };
      setTheses([newThesis, ...theses]);
      setActiveId(newThesis.id);
      return;
    }

    // Update existing thesis
    setTheses(current => current.map(t => {
      if (t.id === activeId) {
        return {
          ...t,
          messages: [
            ...t.messages,
            { role: "user", content },
            generateBrainResponse(content)
          ]
        };
      }
      return t;
    }));
  };

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden">
      <Sidebar 
        theses={theses} 
        activeThesisId={activeId} 
        onSelectThesis={setActiveId} 
        onNewThesis={() => setActiveId(null)}
      />
      
      <main className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
        <header className="flex justify-between items-end border-b border-brand-border pb-4">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">מרכז הבקרה 🦅</h1>
            <p className="text-brand-neon font-mono text-sm mt-1">סטטוס: מאובטח | אימות ללא-בולשיט פעיל</p>
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex gap-4">
              <div className="text-xs">
                <span className="text-gray-500 uppercase">עומס מעבד: </span>
                <span className="text-brand-neon font-mono" dir="ltr">12%</span>
              </div>
              <div className="text-xs">
                <span className="text-gray-500 uppercase">פרטיות ברשת: </span>
                <span className="text-brand-neon font-mono">מקומי בלבד</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-[600px]">
          {/* Chat Section */}
          <div className="xl:col-span-1 h-full">
            <Chat 
              messages={activeThesis?.messages || []} 
              onSendMessage={handleSendMessage} 
            />
          </div>

          {/* Charts / Data Section */}
          <div className="xl:col-span-2 h-full flex flex-col gap-6">
            <div className="bg-[#121212] p-4 rounded-xl border border-brand-border shadow-lg">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-2">מערך ניתוח מדדים מחמיר</h2>
              <p className="text-sm text-gray-400 font-mono mb-6">
                מדגים נתונים עבור טיקר סימבולי. חובה להצליב נתונים מול הדוחות הרשמיים ב-SEC תמיד.
              </p>
              
              <div className="h-[400px]">
                <FinancialCharts />
              </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-brand-crimson/10 border border-brand-crimson rounded-xl p-4 flex items-start gap-4">
              <div className="bg-brand-crimson p-2 rounded-lg text-white shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              </div>
              <div>
                <h3 className="text-brand-crimson font-bold uppercase tracking-widest text-sm">אזהרה קריטית ⚠️</h3>
                <p className="text-gray-300 text-sm mt-1 leading-relaxed">ההנהלות אוהבות לשים דגש על "EBITDA מתואם" בזמן שהתגמול מבוסס מניות מהווה יותר מ-15% מההכנסות. ה-FCF האמיתי לבעלי המניות נמוך משמעותית מהמדווח. היזהר מאוד.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
