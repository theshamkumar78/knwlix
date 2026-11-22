import type { Config } from "tailwindcss";
export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#050b24",
        brand: "#2563eb",
        electric: "#0ea5e9",
        violet: "#7c5cff",
      },
    },
  },
  plugins: [],
} satisfies Config;
