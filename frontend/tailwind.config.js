/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#e8f8fb",
          100: "#c6eff7",
          200: "#9be3f0",
          300: "#6ed7ea",
          400: "#46cce5",
          500: "#22b3cc",
          600: "#1690a5",
          700: "#0d6b7a",
          800: "#06434e",
          900: "#012024",
        },
      },
    },
  },
  plugins: [],
};
