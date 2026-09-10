/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Courier', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        butter: {
          50: '#FFFCF0',
          100: '#FFF8DE',
          200: '#FFF2C4',
          DEFAULT: '#FFEFB3',
          400: '#F5DE8C',
          500: '#E8D072',
          600: '#C7AC46',
        },
        forest: {
          50: '#E6F0EE',
          100: '#BFDAD5',
          200: '#8FBDB4',
          300: '#5F9F93',
          400: '#2A7165',
          500: '#0A524A',
          DEFAULT: '#013E37',
          700: '#00332D',
          800: '#002823',
          900: '#001D19',
          950: '#001411',
        }
      }
    },
  },
  plugins: [],
}
