import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#FDFAF5",
          100: "#FBF3E7",
          200: "#F4E5CC",
          300: "#EAD2A8",
        },
        ink: {
          DEFAULT: "#201A16",
          soft: "#4A3F37",
          muted: "#8A7C70",
        },
        clay: {
          50: "#FBEAE3",
          100: "#F2C6B4",
          300: "#DB8362",
          500: "#C1502E",
          600: "#A8432B",
          700: "#833522",
        },
        forest: {
          50: "#E7EDE9",
          200: "#9BB6A6",
          400: "#3E6650",
          500: "#274B39",
          600: "#1F3A2E",
          700: "#152A21",
        },
        gold: {
          50: "#FBF1DD",
          200: "#EEC97B",
          400: "#D8A13A",
          500: "#BE8825",
          600: "#946A1C",
        },
        // A vivid, youthful accent used sparingly for stickers/badges/highlights —
        // keeps the brand palette warm/earthy while adding Gen-Z pop. Doubles as
        // the primary interactive accent on the dark theme (Spotify-green role,
        // own hue).
        pop: {
          DEFAULT: "#C7E24C",
          soft: "#EAF6B8",
          ink: "#38430E",
        },
        // Dark, warm-black surface scale for the dark theme (landing, and later
        // the rest of the app) — never a cold/neutral black.
        night: {
          DEFAULT: "#110C09",
          100: "#170F0A",
          200: "#1F150E",
          300: "#2A1D13",
          400: "#3A2A1B",
        },
        cream: {
          DEFAULT: "#F6EFE4",
          soft: "#BBA997",
        },
        // Bright success/positive accent for the dark theme (protein bars,
        // "on track" / "saved" states) — forest-600 reads as near-black there.
        mint: {
          DEFAULT: "#5FCB8C",
          soft: "rgba(95, 203, 140, 0.15)",
        },
        // Season system colors
        season: {
          lean: "#A8432B",
          "lean-soft": "#F2C6B4",
          build: "#BE8825",
          "build-soft": "#EEC97B",
          balance: "#1F3A2E",
          "balance-soft": "#9BB6A6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 2px 20px -4px rgba(0, 0, 0, 0.4)",
        lift: "0 10px 34px -6px rgba(0, 0, 0, 0.55)",
      },
    },
  },
  plugins: [],
};

export default config;
