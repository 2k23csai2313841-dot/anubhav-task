/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef3ff",
          100: "#dce6ff",
          200: "#c3d5ff",
          300: "#a4bfff",
          400: "#7fa3ff",
          500: "#4c8bff",
          600: "#2b47ff",
          700: "#1e37db",
          800: "#1530b8",
          900: "#1a2a8f",
        },
        success: {
          50: "#f0fdf4",
          500: "#7bf07b",
          600: "#4ad763",
        },
        danger: {
          50: "#fef2f2",
          500: "#ff5b5b",
          600: "#e03b3b",
        },
      },
      animation: {
        fadeIn: "fadeIn 0.6s ease",
        slideIn: "slideIn 0.35s ease",
        shimmer: "shimmer 1.3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(25px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "200px 0" },
        },
      },
    },
  },
  plugins: [],
};
