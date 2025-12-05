/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vtv-dark': '#0f172a',  
        'vtv-card': '#1e293b',
        'vtv-green': '#22c55e',
        'vtv-red': '#ef4444',
      }
    },
  },
  plugins: [],
}