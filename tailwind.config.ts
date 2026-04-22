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
        background: "#0a0a0a",
        foreground: "#e5e5e5",
        brand: {
          neon: "#39ff14",
          crimson: "#ff0033",
          dark: "#121212",
          border: "#333333"
        }
      },
    },
  },
  plugins: [],
};
export default config;
