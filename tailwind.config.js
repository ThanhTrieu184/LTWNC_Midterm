const colors = require("tailwindcss/colors");

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        emerald: colors.emerald,
        rose: colors.rose,
      },
    },
  },
  variants: {
    extend: {
      display: ["focus", "group-focus"],
    },
  },
  plugins: [],
};
