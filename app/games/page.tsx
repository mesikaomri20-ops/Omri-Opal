import QuizGame from "@/components/games/QuizGame";
import DateGenerator from "@/components/games/DateGenerator";

export const metadata = {
  title: "משחקים | קפסולת החיים",
  description: "משחקים אינטראקטיביים לעומרי ואופל.",
};

export default function GamesPage() {
  return (
    <div className="min-h-screen flex flex-col items-center w-full max-w-7xl mx-auto space-y-24 py-12 md:py-20 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-4 px-4">
        <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-brand-gold font-medium">הפינה הזוגית</p>
        <h1 className="text-4xl md:text-5xl font-light tracking-wider text-foreground">לשחק ולתכנן</h1>
        <p className="max-w-xl mx-auto text-foreground/60 mt-4 leading-relaxed">
          בואו נבדוק כמה אתם מכירים אחד את השניה, ונמצא דרכים חדשות לבלות יחד.
        </p>
      </div>

      {/* Part 1: Quiz Game */}
      <section className="w-full px-4">
        <QuizGame />
      </section>

      {/* Divider */}
      <div className="w-[1px] h-24 md:h-32 bg-gradient-to-b from-brand-border to-transparent"></div>

      {/* Part 2: Date Generator */}
      <section className="w-full rounded-3xl overflow-hidden bg-[#FaFaFa]">
        <DateGenerator />
      </section>

    </div>
  );
}
