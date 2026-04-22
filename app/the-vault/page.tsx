import { LockKeyhole } from "lucide-react";

export default function TheVaultPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full text-center px-4">
      <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mb-8 shadow-sm">
        <LockKeyhole className="w-8 h-8 text-brand-gold" />
      </div>
      
      <h1 className="text-2xl md:text-4xl font-light tracking-wide text-foreground mb-4">The Vault</h1>
      <p className="text-foreground/60 text-sm md:text-base font-light max-w-md mx-auto leading-relaxed">
        This space is reserved for private memories, galleries, and stories yet to unfold. Check back later.
      </p>
    </div>
  );
}
