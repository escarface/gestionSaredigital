/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#f9f506",
        'background-light': "#f8f8f5",
        'background-dark': "#23220f",
        'surface-light': "#ffffff",
        'surface-dark': "#2d2c1b",
        'text-main': "#1c1c0d",
        'text-muted': "#9e9d47",
        'border-color': "#e9e8ce",
      },
      fontFamily: {
        display: ["Spline Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
}
