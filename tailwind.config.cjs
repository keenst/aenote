/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,vue}"],
  theme: {
    extend: {},
    colors: {
      'transparent': 'transparent',
      'ae-white': '#E8E8E8',
      'ae-grey': {
        '100': '#CDE0EB',
        '300': '#768089',
        '500': '#3D4149',
        '700': '#292C33',
        '900': '#1E2026',
      }
    }
  },
  plugins: [],
}
