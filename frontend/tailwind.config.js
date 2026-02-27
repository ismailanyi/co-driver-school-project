/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Tell Tailwind exactly where your screens and components live
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}