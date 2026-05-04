/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'spin-slow': 'spin 6s linear infinite',
      },
    },
  },
  plugins: [],
}