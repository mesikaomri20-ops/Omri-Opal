"use client";

import { useState, useRef, useEffect } from "react";
import { Send, AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "system";
  content: string;
  type?: "default" | "pre-mortem" | "warning";
}

interface ChatProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export default function Chat({ messages, onSendMessage }: ChatProps) {
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-background border border-brand-border rounded-xl shadow-lg overflow-hidden">
      <div className="bg-[#1a1a1a] p-3 border-b border-brand-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-brand-neon w-5 h-5" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">המוח (אנליסט חסר רחמים)</h2>
        </div>
        <div className="text-[10px] font-mono text-brand-neon border border-brand-neon/30 px-2 py-0.5 rounded bg-brand-neon/10">
          MODE: NO BULLSHIT
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50 sepia-0">
            <AlertTriangle className="w-12 h-12 mb-4 text-brand-crimson opacity-80" />
            <h3 className="text-lg font-bold mb-2">מערכות מוכנות לסריקה</h3>
            <p className="max-w-xs text-sm font-mono text-gray-400">
              זרוק טיקר. מחשב מסלול ישירות לנתוני העומק ב-SEC. לא צריך שתביא לי מספרים, אני אביא אותם אליך.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col max-w-[85%]",
                msg.role === "user" ? "ml-auto items-start" : "mr-auto items-end"
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-lg text-sm sm:text-base whitespace-pre-wrap font-mono relative",
                  msg.role === "user"
                    ? "bg-[#2a2a2a] text-white border border-[#444]"
                    : msg.type === "pre-mortem"
                    ? "bg-brand-dark border border-brand-border text-brand-neon"
                    : "bg-brand-crimson/10 border border-brand-crimson text-brand-crimson font-bold"
                )}
              >
                {msg.role === "system" && (
                  <div className={cn(
                    "flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-widest px-2 py-1 rounded-sm w-fit",
                    msg.type === "warning" ? "bg-brand-crimson text-white" : "bg-brand-neon text-black"
                  )}>
                    <AlertTriangle className="w-3 h-3" /> ניתוח מוקדם (Pre-Mortem)
                  </div>
                )}
                {/* Formatting markdown bold in a simple way */}
                {msg.content.split('**').map((part, idx) => 
                  idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
                )}
              </div>
              <span className="text-[10px] text-gray-600 uppercase mt-1 px-1">
                {msg.role === "user" ? "אתה" : "המוח"}
              </span>
            </div>
          ))
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-4 bg-[#121212] border-t border-brand-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='לאיזה טיקר לשלוח עכשיו את כלבי הגישוש לתזרים מזומנים? (למשל: AAPL)'
            className="flex-1 bg-background border border-brand-border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-neon font-mono transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-brand-neon text-black px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2ed60f] transition-colors font-bold uppercase tracking-wider text-sm whitespace-nowrap"
          >
            נתח <Send className="w-4 h-4 mr-2" />
          </button>
        </form>
      </div>
    </div>
  );
}
