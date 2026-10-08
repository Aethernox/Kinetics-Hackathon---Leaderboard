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
        nova: ['"Nova Mono"', 'monospace'],
        mono: ['"Nova Mono"', 'monospace'],
        sans: ['"Nova Mono"', 'monospace'],
        vt323: ['"VT323"', 'monospace'],
        terminal: ['"VT323"', 'monospace'],
        jetbrains: ['"JetBrains Mono"', 'monospace'],
        table: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
