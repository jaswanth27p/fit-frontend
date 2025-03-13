import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        teal: "#2EC4B6", // Base teal color
        tealLight: "#A8E6CF", // Soft Mint (lighter shade)
        tealDark: "#1B7F76", // Deep Teal (darker shade)
        orange: "#FF6B00", // Bright Orange (for accents)
        grayLight: "#F4F4F4", // Light Gray (for backgrounds)
        grayDark: "#2B2D42", // Dark Gray (for text/contrast)
      },
    },
  },
  plugins: [],
} satisfies Config;
