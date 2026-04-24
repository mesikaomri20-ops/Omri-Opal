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
        // ── Luxury Warm Light Palette ─────────────────
        background: "#FCFBF4",    // Broken White
        foreground: "#1A1614",    // Deep Espresso (high contrast on light)
        brand: {
          gold:   "#C5A059",      // Brushed Gold
          beige:  "#F5F5DC",      // Warm Beige
          light:  "#FAF8F2",      // Very light warm beige
          dark:   "#1A1614",      // Near-black espresso
          border: "#E8E1D4",      // Soft warm border (visible on white)
          muted:  "#8A7E72",      // Muted warm grey
          card:   "#FFFFFF",      // Pure white cards
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
        "gold-glow": "0 0 30px rgba(197,160,89,0.3)",
        "card": "0 2px 16px rgba(26,22,20,0.06), 0 1px 4px rgba(26,22,20,0.04)",
      },
      keyframes: {
        "fade-slide-up": {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-slide-up": "fade-slide-up 0.45s ease-out both",
      }
    },
  },
  plugins: [],
};
export default config;
