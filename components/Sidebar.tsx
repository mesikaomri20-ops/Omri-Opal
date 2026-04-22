"use client";

import { History, LayoutDashboard, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  theses: { id: string; title: string; date: string }[];
  activeThesisId: string | null;
  onSelectThesis: (id: string) => void;
  onNewThesis: () => void;
}

export default function Sidebar({ theses, activeThesisId, onSelectThesis, onNewThesis }: SidebarProps) {
  return (
    <div className="w-64 border-l border-brand-border bg-background flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-brand-border">
        <h1 className="text-xl font-black text-brand-neon tracking-tighter uppercase whitespace-nowrap truncate">מרכז השקעות</h1>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-mono truncate">מעקב פרי-מורטם</p>
      </div>

      <div className="p-4 border-b border-brand-border">
        <button 
          onClick={onNewThesis}
          className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-brand-border text-brand-neon transition-colors p-2 rounded-md font-bold text-sm"
        >
          <Plus className="w-4 h-4" /> תזה חדשה
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-2">
          <History className="w-4 h-4" />
          היסטוריית בדיקות
        </h2>
        
        {theses.length === 0 ? (
          <p className="text-xs text-gray-600 font-mono">אין מידע עדיין. הזן תזה.</p>
        ) : (
          theses.map((thesis) => (
            <button
              key={thesis.id}
              onClick={() => onSelectThesis(thesis.id)}
              className={cn(
                "text-right p-3 rounded-md transition-colors flex flex-col gap-1 border",
                activeThesisId === thesis.id
                  ? "bg-brand-dark border-brand-neon/50 text-brand-neon"
                  : "bg-transparent border-transparent hover:bg-brand-border/50 text-gray-300 hover:text-white"
              )}
            >
              <span className="font-medium text-sm truncate w-full">{thesis.title}</span>
              <span className="text-xs opacity-50 font-mono" dir="ltr">{thesis.date}</span>
            </button>
          ))
        )}
      </div>

      <div className="p-4 border-t border-brand-border flex flex-col gap-2">
        <button className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-brand-border/50">
          <LayoutDashboard className="w-4 h-4" /> לוח תצוגה
        </button>
        <button className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-brand-border/50">
          <Settings className="w-4 h-4" /> הגדרות מערכת
        </button>
      </div>
    </div>
  );
}
