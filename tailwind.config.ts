import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        surface: {
          100: "#111111",
          200: "#1A1A1A",
        },
        primary: {
          DEFAULT: "#E8D5A3",
          hover: "#d9c490",
        },
        secondary: {
          DEFAULT: "#4A9B8E",
          hover: "#3d8276",
        },
        text: {
          primary: "#F5F0E8",
          secondary: "#8A8580",
        },
        border: {
          DEFAULT: "#2A2520",
          accent: "#E8D5A3",
        },
        destructive: "#C4614A",
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
        md: "4px",
        lg: "4px",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;

