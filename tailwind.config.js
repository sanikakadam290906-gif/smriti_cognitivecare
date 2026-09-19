/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EF',
          200: '#F4ECE0',
          300: '#EAE0D0',
        },
        sage: {
          50: '#F3F7F4',
          100: '#E4ECE6',
          200: '#CBDCD0',
          500: '#527961',
          600: '#43644F',
          700: '#344F3E',
          800: '#273C2F',
        },
        peach: {
          50: '#FDF7F2',
          100: '#F9EDE3',
          200: '#F1D8C6',
          600: '#C87449',
          700: '#A65A34',
        },
        sky: {
          50: '#F2F7F9',
          100: '#E1EDF2',
          200: '#C2DCE5',
          600: '#4B778B',
        },
        lavender: {
          50: '#F6F5F9',
          100: '#EBE9F2',
          200: '#D7D3E5',
          600: '#6C658A',
        },
        ink: {
          900: '#1D2420',
          800: '#2C3630',
          700: '#414E46',
          500: '#65746B',
          400: '#8A9990',
        },
        borderBase: '#E3DDD2',
      },
      fontFamily: {
        sans: ['Nunito', 'Atkinson Hyperlegible', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
        card: '0 2px 4px rgba(44, 54, 48, 0.06)',
      },
    },
  },
  plugins: [],
}
