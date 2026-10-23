/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // "Command center" palette: deep alpine slate + terrain-slope amber accent
        // + risk-level semantic colors. Chosen to evoke topography/terrain rather
        // than a generic SaaS dashboard.
        slate: {
          950: "#0B1615",
          900: "#0F211F",
          800: "#16302D",
          700: "#1F433E",
        },
        terrain: {
          400: "#C98A3E",
          500: "#B5762C",
          600: "#95611F",
        },
        risk: {
          low: "#3F9142",
          moderate: "#D6A428",
          high: "#D97A2E",
          critical: "#C2432E",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
