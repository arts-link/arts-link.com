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
      // Every template uses `prose-invert`, whose stock colours are fixed light
      // greys meant for a dark page. Point them all at the theme tokens instead,
      // so list items, bold, code, captions, counters and table text follow the
      // light theme too. (Before this, only elements a template re-coloured by
      // hand did; blog bullet lists rendered light grey on cream.) The text
      // values match the floor `npm run contrast` enforces.
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-invert-body': 'rgb(var(--color-cream) / 0.7)',
            '--tw-prose-invert-headings': 'rgb(var(--color-cream))',
            '--tw-prose-invert-lead': 'rgb(var(--color-cream) / 0.7)',
            '--tw-prose-invert-links': 'rgb(var(--color-ember))',
            '--tw-prose-invert-bold': 'rgb(var(--color-cream))',
            '--tw-prose-invert-counters': 'rgb(var(--color-cream) / 0.7)',
            '--tw-prose-invert-bullets': 'rgb(var(--color-cream) / 0.65)',
            '--tw-prose-invert-hr': 'rgb(var(--color-cream) / 0.1)',
            '--tw-prose-invert-quotes': 'rgb(var(--color-cream) / 0.7)',
            '--tw-prose-invert-quote-borders': 'rgb(var(--color-ember))',
            '--tw-prose-invert-captions': 'rgb(var(--color-cream) / 0.65)',
            '--tw-prose-invert-kbd': 'rgb(var(--color-cream))',
            '--tw-prose-invert-code': 'rgb(var(--color-ember))',
            '--tw-prose-invert-pre-code': 'rgb(var(--color-cream))',
            '--tw-prose-invert-pre-bg': 'rgb(var(--color-ink-light))',
            '--tw-prose-invert-th-borders': 'rgb(var(--color-cream) / 0.2)',
            '--tw-prose-invert-td-borders': 'rgb(var(--color-cream) / 0.1)',
          },
        },
      },
      screens: {
        xs: '475px',
        ...defaultTheme.screens,
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
