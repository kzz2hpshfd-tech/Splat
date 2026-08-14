import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0714",
        void: "#120a22",
        splat: {
          pink: "#ff2ea6",
          magenta: "#c026d3",
          purple: "#7c3aed",
          violet: "#5b21b6",
          cyan: "#22d3ee",
          lime: "#a3e635",
          orange: "#fb923c",
          yellow: "#fde047",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      keyframes: {
        "spin-slow": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        "splat-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "55%": { transform: "scale(1.15)", opacity: "1" },
          "75%": { transform: "scale(0.92)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        wobble: {
          "0%, 100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
        drip: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
        blob: {
          "0%, 100%": { borderRadius: "42% 58% 65% 35% / 45% 40% 60% 55%" },
          "50%": { borderRadius: "60% 40% 30% 70% / 55% 65% 35% 45%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pin-drop": {
          "0%": { transform: "translateY(-120px) scale(0.6)", opacity: "0" },
          "70%": { transform: "translateY(0) scale(1.1)", opacity: "1" },
          "85%": { transform: "translateY(-8px) scale(0.96)" },
          "100%": { transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 2.2s cubic-bezier(0.6,0,0.3,1)",
        "splat-in": "splat-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
        wobble: "wobble 3.2s ease-in-out infinite",
        drip: "drip 4s ease-in-out infinite",
        blob: "blob 8s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
        "pin-drop": "pin-drop 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
