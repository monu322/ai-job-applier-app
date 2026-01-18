/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        gold: "#F59E0B",
        "background-light": "#F8FAFC",
        "background-dark": "#020617",
        "midnight": "#0B1121",
        "card-dark": "rgba(30, 41, 59, 0.7)",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
