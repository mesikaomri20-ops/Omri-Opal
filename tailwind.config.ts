import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Luxury Warm Palette ──────────────────────
        background: "#1A1614",    // Deep Espresso
        foreground: "#FCFBF4",    // Broken White
        brand: {
          gold:   "#C5A059",      // Brushed Gold
          beige:  "#F5F5DC",      // Warm Beige
          light:  "#FCFBF4",      // Broken White
          dark:   "#0F0D0C",      // Near-black espresso
          border: "#3A3330",      // Subtle warm border
          muted:  "#8A7E72",      // Muted warm grey
        }
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "warm-sm": "0 4px 20px rgba(197,160,89,0.06)",
        "warm-md": "0 8px 40px rgba(197,160,89,0.10)",
        "warm-lg": "0 20px 60px rgba(197,160,89,0.15)",
        "gold-glow": "0 0 30px rgba(197,160,89,0.25)",
      },
      keyframes: {
        "fade-slide-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(197,160,89,0.3)" },
          "50%":      { boxShadow: "0 0 0 8px rgba(197,160,89,0)" },
        }
      },
      animation: {
        "fade-slide-up": "fade-slide-up 0.5s ease-out both",
        "pulse-gold":    "pulse-gold 2s ease-in-out infinite",
      }
    },
  },
  plugins: [],
};
export default config;
