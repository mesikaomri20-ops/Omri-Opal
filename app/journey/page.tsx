import Timeline from "@/components/Timeline";

export default function JourneyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center pb-24 overflow-hidden">
      {/* Hero / Header */}
      <div className="w-full text-center pt-32 pb-16 px-4 md:px-8 mb-4 relative">
        <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-brand-gold font-medium mb-6">A Decade of Love</p>
        <h1 className="text-5xl md:text-7xl font-light tracking-wide text-foreground mb-8">Our Journey.</h1>
        <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto font-light leading-relaxed">
          From 2017 to the moment we say "I do", every year holds a memory that brought us here.
        </p>

        {/* Decorative backdrop glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[600px] h-[300px] bg-brand-gold/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      </div>

      <Timeline />
    </div>
  );
}
