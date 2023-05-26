/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        "4xl": "32px",
        "5xl": "40px",
        "6xl": "48px",
        "7xl": "56px",
        "8xl": "88px",
      },
      colors: {
        current: "currentColor",
        primary: "#2F2E41",
        darkBlue: "#111A2C",
        darkGray: "#525C67",
        darkGray2: "#757D85",
        gray: "#898B9A",
        gray2: "#BBBDC1",
        gray3: "#CFD0D7",
        lightGray1: "#DDDDDD",
        lightGray2: "#F5F5F8",
        white2: "#FBFBFB",
        white: "#FFFFFF",
        black: "#000000",

        transparent: "transparent",
        transparentPrimary: "rgba(227, 120, 75, 0.4)",
        transparentBlack1: "rgba(0, 0, 0, 0.1)",
        transparentBlack7: "rgba(0, 0, 0, 0.7)",
      },
      lineHeight: {
        1: 22,
        2: 30,
        3: 36,
      },
      // fontSize: {
      //   xs: 12,
      //   sm: 14,
      //   base: 16,
      //   lg: 20,
      //   xl: 22,
      //   "2xl": 30,
      //   "6xl":50,
      // },
    },
  },

  plugins: [],
};
