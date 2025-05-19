/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          100: '#FDF6E3',
          200: '#FAEBD7',
        },
        teal: {
          500: '#2C7A7B',
          600: '#285E61',
        },
        warmGray: {
          700: '#4A3F35',
          800: '#3C3226',
        },
      },
      fontFamily: {
        merriweather: ['Merriweather', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};