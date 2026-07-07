/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Tell Tailwind exactly where your screens and components live
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}