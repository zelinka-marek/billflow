const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        "@font-face": {
          fontFamily: "Inter var",
          fontStyle: "normal",
          fontWeight: "100 900",
          fontDisplay: "swap",
          src: "url('/fonts/Inter-roman.var.woff2') format('woff2')",
          fontNamedInstance: "Regular",
        },
      });
    }),
    require("@tailwindcss/forms"),
  ],
};
