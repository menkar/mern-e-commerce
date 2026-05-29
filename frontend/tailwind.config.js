/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0f172a',
          teal: '#0d9488',
          'teal-dark': '#0f766e',
        },
      },
    },
  },
  plugins: [],
};
