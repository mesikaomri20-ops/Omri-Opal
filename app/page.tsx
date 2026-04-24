import CountdownTimer from "@/components/CountdownTimer";
import Aspirations from "@/components/Aspirations";

export const revalidate = 0;

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-6xl mx-auto">

      {/* Subtle warm radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-gold/8 blur-[140px] rounded-full" />
      </div>

      {/* Hero heading */}
      <div className="relative z-10 text-center space-y-4 mb-10 md:mb-20 mt-8 px-4" dir="rtl">
        <p className="text-xs md:text-sm uppercase tracking-[0.5em] text-brand-gold font-medium">
          קפסולת החיים
        </p>

        <h1 className="font-light tracking-wide text-foreground leading-[1.6]">
          <span className="block text-foreground/60 text-xl md:text-2xl">הזמן שנותר לרגע</span>
          <span className="block text-foreground/60 text-xl md:text-2xl mb-2">שאופל אביסרור הופכת ל</span>
          {/* Gold handwriting accent — visible on light bg */}
          <span className="font-handwriting text-5xl md:text-7xl block mt-2 drop-shadow-[0_2px_8px_rgba(197,160,89,0.3)]">
            אופל מסיקה
          </span>
        </h1>

        <p className="text-sm md:text-base font-light tracking-[0.25em] text-foreground/40 mt-4">
          מסע אל הנצח.
        </p>
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
