/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'esm': '500px'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        comic: ['Comic Relife'],
      },
    }
  },
  plugins: [],
}