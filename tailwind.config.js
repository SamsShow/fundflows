/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Switzer", "sans-serif"],
      },
      colors: {
        // Primary colors from style guide
        primary: {
          DEFAULT: "#CEFF03", // The vibrant green/yellow
          50: "#F5FFCD",
          100: "#EFFFAB",
          200: "#CEFF03",
          300: "#ACD402",
          400: "#678002",
        },
        // Neutral colors from style guide
        neutral: {
          50: "#FFFFFF",
          100: "#D6D6D6",
          200: "#C2C2C2",
          300: "#8A8A8A",
          400: "#383838",
          500: "#1D1D21",
          600: "#101010",
          700: "#000000",
        },
        // Semantic colors
        success: "#ACD402",
        error: "#FF4A4A",
        warning: "#FFAA3B",
        info: "#3BA5FF",
      },
      boxShadow: {
        card: "0 4px 20px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#CEFF03",
          secondary: "#ACD402",
          accent: "#678002",
          neutral: "#1D1D21",
          "base-100": "#FFFFFF",
          info: "#3BA5FF",
          success: "#ACD402",
          warning: "#FFAA3B",
          error: "#FF4A4A",
        },
        dark: {
          primary: "#CEFF03",
          secondary: "#ACD402",
          accent: "#678002",
          neutral: "#1D1D21",
          "base-100": "#101010",
          "base-content": "#D6D6D6",
          info: "#3BA5FF",
          success: "#ACD402",
          warning: "#FFAA3B",
          error: "#FF4A4A",
        },
      },
    ],
    darkTheme: "dark",
  },
};
