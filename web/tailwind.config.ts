import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1e40af",
          fg: "#eff6ff",
        },
      },
    },
  },
  plugins: [],
};

export default config;
