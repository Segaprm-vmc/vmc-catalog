/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'vmc-red': '#EC2834',
        'vmc-black': '#1E1E1E',
        'vmc-gray': '#CCCCCC',
      },
    },
  },
  plugins: [],
} 