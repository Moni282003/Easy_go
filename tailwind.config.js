/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  present:[require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}

