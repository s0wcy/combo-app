/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
    colors: {
      red: "#E84142",
      green: "#5CBD6E",
      blue: "#757BF0",
      purple: "#AF5CBD",
      orange: "#F88512",
      white: "#F0F0F0",
      cream: "#DFDFDF",
      grey: "#444444",
      dark: "#222222",
      black: "#141414",
      transparent: "transparent",
    },
  },
  plugins: [],
}
