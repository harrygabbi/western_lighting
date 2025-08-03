/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // Adjust if your files are elsewhere
  theme: {
    extend: {
      colors: {
        'custom-red':#110c0c, // or whatever shade of red you want
      },
    },
  },
  plugins: [],
};
