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
        bento: {
          background: "#FAFAF8",
          dark: "#1C1C16",
          white: "#FFFFFF",
          lime: "#D1E67C",
          olive: "#5D621E",
          peach: "#FFDBCB",
          lavender: "#D0BCFF",
          skyblue: "#C2E7FF",
          warm: "#E7E9D9",
          orange: "#FF5400",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        bento: "28px",
      },
    },
  },
  plugins: [],
};

export default config;
