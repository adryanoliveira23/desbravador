/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
        roboto: ["var(--font-roboto)", "Roboto", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#D92D20", // Vermelho Desbravadores
          dark: "#B22218",
        },
        secondary: {
          DEFAULT: "#FDB022", // Amarelo/Dourado Aventureiros
          dark: "#DC940D",
        },
        navy: {
          50: "#f2f4f7",
          100: "#e4e7ec",
          200: "#d0d5dd",
          300: "#98a2b3",
          400: "#667085",
          500: "#344054",
          600: "#1d2939",
          700: "#101828",
          800: "#0c111d",
          900: "#000000",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
      },
    },
  },
  plugins: [],
};
