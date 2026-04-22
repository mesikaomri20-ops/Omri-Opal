import Timeline from "@/components/Timeline";

export default function OurJourneyPage() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <div className="text-center mt-16 mb-8 max-w-2xl px-4">
        <h1 className="text-3xl md:text-5xl font-light tracking-wide text-foreground mb-4">Our Journey</h1>
        <p className="text-sm md:text-base text-foreground/60 font-light italic leading-relaxed">
          The string of moments, big and small, that seamlessly weave our lives together. Scroll to explore the timeline.
        </p>
      </div>
      
      <Timeline />
    </div>
  );
}
