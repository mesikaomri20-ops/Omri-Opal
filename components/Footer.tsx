import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-12 mt-auto border-t border-brand-border/30 bg-brand-light/30">
      <div className="container mx-auto flex flex-col items-center justify-center text-foreground/60 space-y-4">
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="text-sm tracking-widest uppercase font-light">נוסד ב-2017</span>
        </div>
        <div className="flex items-center space-x-1 space-x-reverse text-xs opacity-50 font-light">
          <span>נבנה ב-</span>
          <Heart className="w-3 h-3 mx-1 text-brand-gold fill-brand-gold/20" />
          <span>עבור עומרי ואופל</span>
        </div>
      </div>
    </footer>
  );
}
