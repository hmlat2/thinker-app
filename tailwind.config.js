/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand': {
          'light': '#F3E8EE',
          'sage': '#BACDB0', 
          'green': '#729B79',
          'slate': '#475B63',
          'navy': '#102542'
        }
      },
      fontFamily: {
        'header': ['Crimson Text', 'serif'],
        'body': ['Source Sans Pro', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
