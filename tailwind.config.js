/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: '#0F172A',
        brand: '#2563EB',
        cyan: '#06B6D4',
        positive: '#16A34A',
        warning: '#D97706',
        negative: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 24px 80px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};
