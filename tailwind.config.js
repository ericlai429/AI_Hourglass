/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gemini: {
          light: '#60a5fa',
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
          glow: '#93c5fd',
        },
        claude: {
          light: '#fb923c',
          DEFAULT: '#ea580c',
          dark: '#c2410c',
          glow: '#fed7aa',
        },
        openai: {
          light: '#34d399',
          DEFAULT: '#10b981',
          dark: '#047857',
          glow: '#a7f3d0',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
