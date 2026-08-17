import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#faf6ee",
        ink: "#241c14",
        sketchy: {
          coral: "#ff6b5b",
          amber: "#ffb020",
          teal: "#1fb6a8",
          plum: "#8b5cf6",
          sky: "#3ea6ff",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "cursive"],
        body: ["var(--font-body)", "sans-serif"],
      },
      keyframes: {
        "pop-in": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pencil-float": {
          "0%, 100%": { transform: "translateY(0) rotate(-3deg)" },
          "50%": { transform: "translateY(-8px) rotate(2deg)" },
        },
        "draw-in": {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "pencil-float": "pencil-float 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
