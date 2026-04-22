"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const targetDate = new Date("2026-12-10T00:00:00").getTime();

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft(); // initial call
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isMounted) return <div className="h-[200px] w-full flex items-center justify-center animate-pulse bg-brand-light/20 rounded-3xl"></div>;

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours.toString().padStart(2, '0') },
    { label: "Minutes", value: timeLeft.minutes.toString().padStart(2, '0') },
    { label: "Seconds", value: timeLeft.seconds.toString().padStart(2, '0') },
  ];

  return (
    <div className="flex flex-col items-center justify-center my-16 w-full relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-wrap justify-center gap-6 md:gap-12"
      >
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="flex flex-col items-center">
            <span className="text-5xl md:text-8xl font-light tracking-tighter text-foreground">
              {unit.value}
            </span>
            <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-foreground/50 mt-4 md:mt-6 font-medium">
              {unit.label}
            </span>
          </div>
        ))}
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-gold/5 blur-[120px] rounded-full"
      />
    </div>
  );
}
