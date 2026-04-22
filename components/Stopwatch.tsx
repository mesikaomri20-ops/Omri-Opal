"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// December 31, 2017 at 22:00 Israel Time (IST = UTC+2)
const ORIGIN_DATE = new Date("2017-12-31T22:00:00+02:00").getTime();

interface Elapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeElapsed(): Elapsed {
  const now = new Date();
  const origin = new Date(ORIGIN_DATE);

  let years = now.getFullYear() - origin.getFullYear();
  let months = now.getMonth() - origin.getMonth();
  let days = now.getDate() - origin.getDate();
  let hours = now.getHours() - origin.getHours();
  let minutes = now.getMinutes() - origin.getMinutes();
  let seconds = now.getSeconds() - origin.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days < 0) {
    // Get last day of previous month
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) { months += 12; years--; }

  return { years, months, days, hours, minutes, seconds };
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState<Elapsed>({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setElapsed(computeElapsed());
    const interval = setInterval(() => setElapsed(computeElapsed()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <div className="h-[220px] w-full flex items-center justify-center animate-pulse bg-brand-light/20 rounded-3xl" />;
  }

  const units = [
    { label: "Years", value: elapsed.years },
    { label: "Months", value: elapsed.months },
    { label: "Days", value: elapsed.days },
    { label: "Hours", value: String(elapsed.hours).padStart(2, "0") },
    { label: "Minutes", value: String(elapsed.minutes).padStart(2, "0") },
    { label: "Seconds", value: String(elapsed.seconds).padStart(2, "0") },
  ];

  return (
    <div className="flex flex-col items-center justify-center my-12 w-full relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-wrap justify-center gap-4 md:gap-8"
      >
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center min-w-[64px] md:min-w-[90px]">
            <span className="text-4xl md:text-7xl font-light tracking-tighter text-foreground tabular-nums">
              {unit.value}
            </span>
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-foreground/50 mt-3 md:mt-5 font-medium">
              {unit.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Soft glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"
      />
    </div>
  );
}
