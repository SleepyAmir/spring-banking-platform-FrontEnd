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
        // پالت سبز برگرفته از لوگوی اژدها 🐉
        brand: {
          50: '#f0fbeb',
          100: '#ddf6d3',
          200: '#bdedab',
          300: '#92de79',
          400: '#82db60', // سبز روشن لوگو
          500: '#4cc25d',
          600: '#30aa5a', // سبز متوسط لوگو
          700: '#1a9558',
          800: '#088357', // سبز تیره لوگو
          900: '#076647',
        },
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(48, 170, 90, 0.18)',
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px -8px rgba(48,170,90,0.40)',
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
