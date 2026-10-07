/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          900: '#07080b',
          800: '#0d1017',
          700: '#161b26',
        },
        copper: {
          light: '#fbbf24',
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          deep: '#b45309',
        }
      },
      fontFamily: {
        orbitron: ['"Times New Roman"', 'Times', 'serif'],
        rajdhani: ['"Times New Roman"', 'Times', 'serif'],
        mono: ['"Times New Roman"', 'Times', 'serif'],
        sans: ['"Times New Roman"', 'Times', 'serif'],
        serif: ['"Times New Roman"', 'Times', 'serif'],
      }
    },
  },
  plugins: [],
}
