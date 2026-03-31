/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-gilroy)', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#ffffff',
          dark: '#0f172a', // slate-900
          subtle: '#f8fafc', // slate-50
        },
        border: {
          DEFAULT: '#e2e8f0', // slate-200
          subtle: '#f1f5f9', // slate-100
        },
        brand: {
          DEFAULT: '#006bff', // blue-600
          hover: '#004eba', // blue-700
          light: '#e6f0ff', // blue-50
        },
        blue: {
          DEFAULT: '#2563eb', // blue-600
          dark: '#1e40af', // blue-800
          light: '#eff6ff', // blue-50
        },
        ink: {
          DEFAULT: '#0f172a', // slate-900
          body: '#475569', // slate-600
          muted: '#94a3b8', // slate-400
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
