/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./hugo_stats.json",
    "./layouts/**/*.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          light: 'rgb(var(--color-ink-light) / <alpha-value>)',
        },
        cream: {
          DEFAULT: 'rgb(var(--color-cream) / <alpha-value>)',
        },
        ember: {
          DEFAULT: 'rgb(var(--color-ember) / <alpha-value>)',
          light: 'rgb(var(--color-ember-light) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '475px',
        ...defaultTheme.screens,
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
