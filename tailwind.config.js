/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './dist/*.html'],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}

