import CountdownTimer from "@/components/CountdownTimer";
import Aspirations from "@/components/Aspirations";

export const revalidate = 0;

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-6xl mx-auto">
      
      {/* Intro text */}
      <div className="text-center space-y-4 mb-8 md:mb-16 mt-8">
        <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-brand-gold font-medium">קפסולת החיים</p>
        <h1 className="text-4xl md:text-6xl font-light tracking-wider text-foreground mb-4" dir="rtl">החתונה של עומרי ואופל</h1>
        <h2 className="text-xl md:text-2xl font-light tracking-wide text-foreground/70">מסע אל הנצח.</h2>
      </div>

      <CountdownTimer />
      
      <div className="w-full px-4 md:px-8">
        <Aspirations />
      </div>
      
    </div>
  );
}
