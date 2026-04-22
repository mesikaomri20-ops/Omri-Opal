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
        background: "#FAF9F6", // Off-white
        foreground: "#2A2A2A", // Deep Charcoal
        brand: {
          gold: "#D4AF37", // Muted Gold
          sage: "#9AAB89", // Sage Green
          light: "#F5F3EC",
          dark: "#1A1A1A",
          border: "#E8E6E1"
        }
      },
    },
  },
  plugins: [],
};
export default config;
