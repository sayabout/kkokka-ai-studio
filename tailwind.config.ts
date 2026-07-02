import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#050505",
        char: "#0A0A0C",
        char2: "#111113",
        offwhite: "#F4F1EA",
        gray: {
          DEFAULT: "#A7A7A7",
          dark: "#6E6E70",
        },
        ice: "#8FB7FF",
      },
      fontFamily: {
        display: ["var(--font-space)", "Pretendard", "sans-serif"],
        sans: ["Pretendard", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
