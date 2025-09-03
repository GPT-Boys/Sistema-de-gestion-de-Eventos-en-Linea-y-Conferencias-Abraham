// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0d",
        muted: "#6b7280",
        purple: {
          900: "#4c1d95",
          700: "#6d28d9",
          600: "#7c3aed",
          500: "#8b5cf6",
        },
      },
      boxShadow: {
        ring: "0 0 0 3px rgba(109, 40, 217, 0.25)",
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      spacing: {
        header: "80px", // equivalente a --header-h
      },
    },
  },
  plugins: [],
}
