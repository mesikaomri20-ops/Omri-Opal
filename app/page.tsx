import CountdownTimer from "@/components/CountdownTimer";
import DailyNote from "@/components/DailyNote";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-6xl mx-auto">
      
      {/* Intro text */}
      <div className="text-center space-y-4 mb-8 md:mb-16 mt-8">
        <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-brand-gold font-medium">The Life Capsule</p>
        <h1 className="text-3xl md:text-5xl font-light tracking-wide text-foreground">A Journey to Forever.</h1>
      </div>

      <CountdownTimer />
      
      {/* Divider */}
      <div className="w-1px h-24 md:h-32 bg-gradient-to-b from-brand-border to-transparent my-8"></div>
      
      <DailyNote />
      
    </div>
  );
}
