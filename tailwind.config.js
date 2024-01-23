/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./hugo_stats.json", "./layouts/**/*.html", "./themes/benstraw/layouts/**/*.html"],
  theme: {
    extend: {
      backgroundImage: {
        'hidden-home': " url('/images/maui-sunset.webp')",
      },},
  },
  plugins: [require("@tailwindcss/typography")],
}

