import Timeline from "@/components/Timeline";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0; // Don't cache rigidly as auth state varies

export default async function OurJourneyPage() {
  const supabase = createClient();
  
  // Fetch timeline events from Supabase
  const { data: events, error } = await supabase
    .from('timeline_events')
    .select('*')
    .order('year', { ascending: true });

  const timelineEvents = events || [];

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <div className="text-center mt-16 mb-8 max-w-2xl px-4" dir="rtl">
        <h1 className="text-3xl md:text-5xl font-light tracking-wide text-foreground mb-4">המסע שלנו</h1>
        <p className="text-sm md:text-base text-foreground/60 font-light italic leading-relaxed">
          שרשרת הרגעים, גדולים וקטנים, ששוזרים יחד את חיינו. גללו כדי לחקור את ציר הזמן.
        </p>
      </div>
      
      <Timeline events={timelineEvents} />
    </div>
  );
}
