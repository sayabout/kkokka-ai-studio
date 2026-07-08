import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    { pattern: /col-span-(1|2|3|4|5|6|7|8|9|10|11|12)/ },
    { pattern: /col-start-(1|2|3|4|5|6|7|8|9|10|11|12)/ },
    { pattern: /row-span-(1|2|3)/ },
    { pattern: /row-start-(1|2|3)/ },
    { pattern: /aspect-\[.+\]/ },
    "mt-0", "mt-4", "mt-10", "mt-14",
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
        display: ["Pretendard", "sans-serif"],
        sans: ["Pretendard", "-apple-system", "sans-serif"],
        mono: ["Pretendard", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;