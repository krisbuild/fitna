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
        display: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 2px 20px -4px rgba(32, 26, 22, 0.12)",
        lift: "0 8px 30px -6px rgba(32, 26, 22, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
