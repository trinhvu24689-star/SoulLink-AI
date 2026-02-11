/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",           // <--- QUAN TRỌNG: Quét file ngay thư mục gốc (App.tsx, index.tsx)
    "./components/**/*.{js,ts,jsx,tsx}", // Quét thư mục components
    "./contexts/**/*.{js,ts,jsx,tsx}",   // Quét thư mục contexts
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}