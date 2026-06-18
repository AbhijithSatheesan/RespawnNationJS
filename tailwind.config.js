/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'; 

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
  plugins: [
    // <-- ADD THE 3D PLUGIN HERE IN YOUR EXISTING ARRAY
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.backface-visible': { 'backface-visibility': 'visible' },
        '.backface-hidden': { 'backface-visibility': 'hidden' },
        '.rotate-y-180': { transform: 'rotateY(180deg)' },
        '.preserve-3d': { 'transform-style': 'preserve-3d' },
        '.perspective-1000': { perspective: '1000px' },
      });
    }),
  ],
}


// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {
//       keyframes: {
//         shimmer: {
//           '100%': { transform: 'translateX(100%)' },
//         },
//         'fade-in-down': {
//           '0%': { opacity: '0', transform: 'translateY(-10px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         }
//       },
//       animation: {
//         shimmer: 'shimmer 2s infinite',
//         'fade-in-down': 'fade-in-down 0.5s ease-out',
//         'spin-slow': 'spin 6s linear infinite',
//       },
//     },
//   },
//   plugins: [],
// }