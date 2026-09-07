/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./config/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B2A3D",
        accent: "#C98A1D",
        accentDark: "#A66F12",
        paper: "#F7F5F0",
        line: "#E4E0D8",
      },
      fontFamily: {
        sans: ['"Work Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
