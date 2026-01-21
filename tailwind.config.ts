import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        primary: "#0f172a",
        muted: "#64748b",
        accent: "#22c55e",
        danger: "#ef4444"
      }
    }
  },
  plugins: []
};

export default config;
