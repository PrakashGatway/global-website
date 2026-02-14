/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
  "animate-balloon",
],


  theme: {
    extend: {
      /* COLORS */
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
      },

      /* ================= ANIMATIONS ================= */
      animation: {
        slowRotate: "slowRotate 40s linear infinite",

        /* ✅ Balloon rise + float (single animation) */
        balloon: "balloon 6s ease-in-out infinite",
      },

      /* ================= KEYFRAMES ================= */
      keyframes: {
        /* Rotate animation */
        slowRotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },

        /* ✅ Balloon full motion */
        balloon: {
          /* start below */
          "0%": {
            transform: "translateY(120px)",
            opacity: "0",
          },

          /* reach position */
          "15%": {
            transform: "translateY(0px)",
            opacity: "1",
          },

          /* floating motion */
          "30%": {
            transform: "translate(-6px,-10px) rotate(-2deg)",
          },
          "50%": {
            transform: "translate(6px,-18px) rotate(2deg)",
          },
          "70%": {
            transform: "translate(-4px,-10px) rotate(-1deg)",
          },

          /* return */
          "100%": {
            transform: "translate(0px,0px) rotate(0deg)",
          },
        },
      },
    },
  },

  plugins: [],
};
