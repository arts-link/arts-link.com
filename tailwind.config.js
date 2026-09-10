/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

// The client hub (clients.arts-link.com) is built from this same repo with
// `--environment clients`. Its layouts live under layouts/hub/, and its classes
// have no business in the public stylesheet — so outside that build they are
// excluded, keeping the public site's CSS exactly what it was.
//
// Hugo passes HUGO_ENVIRONMENT through to the PostCSS process; it is
// "development" under `hugo server` and "production" for `hugo` builds.
const isClients = process.env.HUGO_ENVIRONMENT === "clients";

module.exports = {
  content: [
    "./hugo_stats.json",
    "./layouts/**/*.html",
    ...(isClients
      ? []
      : [
          "!./layouts/hub/**",
          "!./layouts/partials/hub/**",
          "!./layouts/shortcodes/hub/**",
        ]),
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
