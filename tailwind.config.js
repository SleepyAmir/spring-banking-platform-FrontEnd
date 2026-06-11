/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        slate: {
          50: 'rgb(var(--c-slate-50) / <alpha-value>)',
          100: 'rgb(var(--c-slate-100) / <alpha-value>)',
          200: 'rgb(var(--c-slate-200) / <alpha-value>)',
          300: 'rgb(var(--c-slate-300) / <alpha-value>)',
          400: 'rgb(var(--c-slate-400) / <alpha-value>)',
          500: 'rgb(var(--c-slate-500) / <alpha-value>)',
          600: 'rgb(var(--c-slate-600) / <alpha-value>)',
          700: 'rgb(var(--c-slate-700) / <alpha-value>)',
          800: 'rgb(var(--c-slate-800) / <alpha-value>)',
          900: 'rgb(var(--c-slate-900) / <alpha-value>)',
          950: 'rgb(var(--c-slate-950) / <alpha-value>)',
        },
        white: 'rgb(var(--c-white) / <alpha-value>)',
        black: 'rgb(var(--c-black) / <alpha-value>)',
        // پالت سبز برگرفته از لوگوی اژدها 🐉
        brand: {
          50: '#f0fbeb',
          100: '#ddf6d3',
          200: '#bdedab',
          300: '#92de79',
          400: '#82db60',
          500: '#4cc25d',
          600: '#30aa5a',
          700: '#1a9558',
          800: '#088357',
          900: '#076647',
        },
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(48, 170, 90, 0.18)',
        glow: '0 0 0 1px rgb(var(--c-white) / 0.08), 0 8px 32px -8px rgba(48,170,90,0.40)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};