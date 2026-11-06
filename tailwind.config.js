/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E15A97',
        secondary: '#9B88ED',
        background: '#FFEBF3', // Very soft pinkish background
        surface: '#FFFFFF',
        text: '#333333',
        textMuted: '#666666',
        accent: '#FFB8D1'
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-soft': 'linear-gradient(to right bottom, #F9D4E5, #DCD3F6)',
      }
    },
  },
  plugins: [],
}
