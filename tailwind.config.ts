import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--bg-canvas)",
        surface: "var(--bg-surface)",
        subtle: "var(--bg-subtle)",
        "border-dim": "var(--border-dim)",
        "border-focus": "var(--border-focus)",
        fg: {
          DEFAULT: "var(--fg-default)",
          muted: "var(--fg-muted)",
        },
        telemetry: "var(--accent-telemetry)",
        success: "var(--accent-success)",
        warn: "var(--accent-warn)",
        crit: "var(--accent-crit)",
        purple: "var(--accent-purple)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      maxWidth: {
        prose: "72ch",
      },
      boxShadow: {
        "glow-telemetry": "0 0 20px -3px rgba(56, 189, 248, 0.35)",
        "glow-success": "0 0 20px -3px rgba(16, 185, 129, 0.35)",
        "glow-crit": "0 0 20px -3px rgba(239, 68, 68, 0.35)",
        "hud-card": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "radar-sweep": "radar 4s linear infinite",
        "laser-draw": "laser 2s ease-out forwards",
      },
      keyframes: {
        radar: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
