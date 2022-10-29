/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/index.html",
    "./src/**/*.{js,ts,jsx,tsx,svelte}",
  ],
  theme: {
    screens: {
      md: "720px"
    },
    extend: {
      colors: {
        'primary': '#ff9800',
        'card': '#fff7ed',
        'background': '#fedcae',
      }
    },
  },
  plugins: [],
}
