/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f0',
          100: '#faefd9',
          200: '#f4dba3',
          300: '#eec26d',
          400: '#e7a43f',
          500: '#d4872a',
          600: '#b96e22',
          700: '#95531e',
          800: '#79431f',
          900: '#63381d',
        },
      },
    },
  },
  plugins: [],
};
