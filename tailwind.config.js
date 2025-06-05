const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        'burnt-orange': {
          '50': '#fff7ed',
          '100': '#ffedd5',
          '200': '#fed7aa',
          '300': '#fdba74',
          '400': '#fb923c',
          '500': '#f97316',
          '600': '#ea580c',
          '700': '#c2410c',
          '800': '#9a3412',
          '900': '#7c2d12',
          '950': '#431407',
        },
      },
      dropShadow: {
        cta: ["0 10px 15px rgba(219, 227, 248, 0.2)"],
        orange: ["0 10px 15px rgba(249, 115, 22, 0.25)"],
      },
      borderColor: {
        'burnt-orange': {
          DEFAULT: '#f97316',
        }
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
};