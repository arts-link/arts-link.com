/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./hugo_stats.json",
    "./layouts/**/*.html",
    "./themes/ryder/layouts/**/*.html",
    "./themes/ryder-dev/layouts/**/*.html"],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'hidden-home': " url('/images/maui-sunset.webp')",
      },
      screens: {
        'xs': '475px',
        ...defaultTheme.screens,
        '3xl': '1600px',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}

