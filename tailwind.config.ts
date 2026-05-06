import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9ecff",
          200: "#bcdeff",
          300: "#8ec8ff",
          400: "#59a9ff",
          500: "#2f89ff",
          600: "#1b6cf5",
          700: "#1757db",
          800: "#1848af",
          900: "#19408a",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(27, 108, 245, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
