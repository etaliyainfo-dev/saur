import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f7f7f7",
          100: "#ececec",
          200: "#d5d5d5",
          300: "#b9b9b9",
          400: "#9b9b9b",
          500: "#7c7c7c",
          600: "#5e5e5e",
          700: "#424242",
          800: "#2a2a2a",
          900: "#121212",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
