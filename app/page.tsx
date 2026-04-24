import CountdownTimer from "@/components/CountdownTimer";
import Aspirations from "@/components/Aspirations";

export const revalidate = 0;

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-6xl mx-auto">
      
      {/* Intro text */}
      <div className="text-center space-y-4 mb-8 md:mb-16 mt-8" dir="rtl">
        <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-brand-gold font-medium">קפסולת החיים</p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-wide text-foreground mb-4 leading-relaxed">
          <span className="block">הזמן שנותר לרגע</span>
          <span className="block text-brand-gold">שאופל אביסרור</span>
          <span className="block">הופכת לאופל מסיקה</span>
        </h1>
        <h2 className="text-xl md:text-2xl font-light tracking-wide text-foreground/70">מסע אל הנצח.</h2>
      </div>

      <CountdownTimer />
      
      <div className="w-full px-4 md:px-8">
        <Aspirations />
      </div>
      
    </div>
  );
}
