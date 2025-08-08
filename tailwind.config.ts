import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(50px) translateZ(0)" },
          "100%": { opacity: "1", transform: "translateY(0) translateZ(0)" },
        },
        floatComplex: {
          "0%, 100%": { transform: "translateY(0px) rotate(45deg) scale(1)" },
          "33%": { transform: "translateY(-15px) rotate(48deg) scale(1.05)" },
          "66%": { transform: "translateY(-8px) rotate(42deg) scale(0.95)" },
        },
        floatReverseComplex: {
          "0%, 100%": { transform: "translateY(0px) rotate(-12deg) scale(1)" },
          "50%": { transform: "translateY(-20px) rotate(-15deg) scale(1.1)" },
        },
        pulseComplex: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.2)", opacity: "0.9" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 1s ease-out forwards",
        floatComplex: "floatComplex 6s ease-in-out infinite",
        floatReverseComplex: "floatReverseComplex 5s ease-in-out infinite",
        pulseComplex: "pulseComplex 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config; 