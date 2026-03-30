/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        surface: '#f8f9fb',
        border: '#d4e0ed',
        blue: {
          DEFAULT: '#006bff',
          dark: '#004eba',
          soft: '#e6f0ff',
          mid: '#b8dcff',
        },
        ink: {
          DEFAULT: '#0b3558',
          body: '#476788',
          muted: '#68819b',
        }
      },
      boxShadow: {
        'card': '0 4px 24px rgba(11, 53, 88, 0.06)',
        'dropdown': '0 8px 32px rgba(11, 53, 88, 0.1)',
      }
    },
  },
  plugins: [],
}
