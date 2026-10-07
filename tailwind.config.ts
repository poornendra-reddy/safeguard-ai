import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        soc: {
          bg: "#050A0F",
          dark: "#081118",
          card: "#0E171F",
          hover: "#111C24",
          border: "#1D3038",
          "border-light": "#263943",
          cyan: "#00E5FF",
          "cyan-dark": "#00C9D7",
          green: "#22C55E",
          amber: "#F59E0B",
          red: "#FF3B3B",
          critical: "#FF1744",
          text: "#F1F5F9",
          muted: "#94A3B8",
          subtle: "#64748B",
        },
      },
    },
  },
  plugins: [],
};
export default config;
