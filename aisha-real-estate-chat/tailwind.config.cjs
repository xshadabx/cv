/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: { 1: '#0a0a0a', 2: '#1a1a1a' },
        border: { 1: '#1a1a1a', 2: '#808080' },
        textc: { primary: '#FFFFFF', secondary: '#9CA3AF' },
        cyan: { 500: '#06B6D4' },
        blue: { 600: '#2563EB' },
        success: '#10B981',
        danger: '#EF4444'
      }
    }
  },
  plugins: []
};
