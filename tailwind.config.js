/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./config/**/*.{ts,tsx}"],
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
        serif: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
      },
      boxShadow: {
        warm: "0 4px 20px -4px rgba(27, 42, 61, 0.12)",
        card: "0 2px 12px -2px rgba(27, 42, 61, 0.08)",
      },
    },
  },
  plugins: [],
};
