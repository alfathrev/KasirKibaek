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
        coral: {
          50: '#fff1f3',
          100: '#ffe4e8',
          200: '#fecdd6',
          300: '#fea3b4',
          400: '#fc708c',
          500: '#ff3b5c', // Main brand coral pink/red matching reference
          600: '#e62446',
          700: '#c21534',
          800: '#a1152f',
          900: '#87162c',
        }
      }
    },
  },
  plugins: [],
}
