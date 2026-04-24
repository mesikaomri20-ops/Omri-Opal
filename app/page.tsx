import CountdownTimer from "@/components/CountdownTimer";
import Aspirations from "@/components/Aspirations";

export const revalidate = 0;

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-6xl mx-auto">

      {/* Radial Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-gold/5 blur-[120px] rounded-full" />
      </div>

      {/* Intro text */}
      <div className="relative z-10 text-center space-y-6 mb-10 md:mb-20 mt-8 px-4" dir="rtl">
        <p className="text-xs md:text-sm uppercase tracking-[0.5em] text-brand-gold font-medium opacity-80">
          קפסולת החיים
        </p>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-wide text-foreground leading-[1.5] md:leading-[1.6]">
          <span className="block text-foreground/70 text-2xl md:text-3xl mb-1">הזמן שנותר לרגע</span>
          <span className="block text-foreground/70 text-2xl md:text-3xl mb-2">שאופל אביסרור הופכת ל</span>
          <span className="font-handwriting text-4xl md:text-6xl lg:text-7xl block mt-1">
            אופל מסיקה
          </span>
        </h1>

        <h2 className="text-base md:text-lg font-light tracking-[0.2em] text-foreground/50 mt-4">
          מסע אל הנצח.
        </h2>
      </div>

      <div className="relative z-10 w-full">
        <CountdownTimer />
      </div>

      <div className="relative z-10 w-full px-4 md:px-8 mt-8">
        <Aspirations />
      </div>

    </div>
  );
}
