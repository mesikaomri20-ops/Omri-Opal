import QuizGame from "@/components/games/QuizGame";
import DateGenerator from "@/components/games/DateGenerator";
import DecisionMaker from "@/components/games/DecisionMaker";
import DeepConnection from "@/components/games/DeepConnection";

export const metadata = {
  title: "Games · Our Journey",
  description: "Interactive games and date generators.",
};

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center pb-24 overflow-hidden">
      {/* Hero Section */}
      <div className="w-full text-center pt-32 pb-12 px-4 md:px-8 relative">
        <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-brand-gold font-medium mb-6">
          זמן איכות זוגי
        </p>
        <h1 className="text-5xl md:text-7xl font-light tracking-wide text-foreground mb-4">
          משחקים
        </h1>
        <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto font-light leading-relaxed">
          גלו כמה טוב אתם מכירים אחד את השנייה, בחרו דייט לסופ"ש, ותנו למערכת להחליט במקומכם.
        </p>
        
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[600px] h-[300px] bg-brand-gold/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      </div>

      <div className="w-full px-4 max-w-6xl mx-auto flex flex-col gap-16 md:gap-24 relative z-10">
        
        {/* Quiz Game Area */}
        <section>
          <QuizGame />
        </section>

        {/* Date Night Generator */}
        <section>
          <DateGenerator />
        </section>

        {/* Decision Maker */}
        <section>
          <DecisionMaker />
        </section>

        {/* Deep Connection */}
        <section>
          <DeepConnection />
        </section>

      </div>
    </div>
  );
}
