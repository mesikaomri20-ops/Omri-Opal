import Stopwatch from "@/components/Stopwatch";
import TravelsTimeline from "@/components/TravelsTimeline";

export default function AdventuresPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center pb-24 overflow-hidden">
      {/* Hero */}
      <div className="w-full text-center pt-32 pb-8 px-4 md:px-8 relative">
        <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-brand-gold font-medium mb-6">
          Together Since · December 31, 2017
        </p>
        <h1 className="text-5xl md:text-7xl font-light tracking-wide text-foreground mb-4">
          Our Adventures.
        </h1>
        <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto font-light leading-relaxed mb-4">
          Every second counts. Every destination tells a story.
        </p>

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[600px] h-[300px] bg-brand-gold/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      </div>

      {/* Live Stopwatch */}
      <Stopwatch />

      {/* Divider */}
      <div className="w-24 h-[1px] bg-brand-border/60 my-12" />

      {/* Section Header */}
      <div className="text-center px-4 mb-12">
        <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-brand-gold font-medium mb-4">Explore</p>
        <h2 className="text-3xl md:text-5xl font-light tracking-wide text-foreground">World Travels</h2>
      </div>

      {/* Travels Timeline */}
      <TravelsTimeline />
    </div>
  );
}
