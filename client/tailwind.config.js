/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f0ff',
          100: '#e5e5ff',
          200: '#d0d0ff',
          300: '#b0adff',
          400: '#9080ff',
          500: '#7c5af0',
          600: '#6c3fe5',
          700: '#5c2fcb',
          800: '#4c27a7',
          900: '#3f2386',
        },
        accent: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea6c0e',
        },
        surface: {
          light: '#ffffff',
          dark: '#0f0f1a',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6c3fe5 0%, #9080ff 50%, #fb923c 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(108,63,229,0.1) 0%, rgba(144,128,255,0.05) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient-x': 'gradient-x 15s ease infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(108,63,229,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(108,63,229,0.6)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'glow-primary': '0 0 30px rgba(108,63,229,0.4)',
        'glow-accent': '0 0 30px rgba(249,115,22,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.08)',
        'card-dark': '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
