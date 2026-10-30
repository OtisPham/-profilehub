/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '88': '22rem',
      },
      colors: {
        // Tông màu Dark Mode cao cấp (Deep Obsidian & Twilight Palette)
        dark: {
          bg: '#090d16',          // Nền canvas sâu thẳm, chống mỏi mắt
          surface: '#0f1523',     // Nền container, header, side-panel
          card: '#131b2c',        // Nền thẻ card nội dung
          cardHover: '#182238',   // Nền thẻ khi hover
          elevated: '#1a2338',    // Nền popover, modal, dropdown
          border: '#1f293d',      // Đường viền tiêu chuẩn
          borderHover: '#33415c', // Đường viền khi hover
          muted: '#8b9bb4',       // Chữ ghi chú phụ
        }
      }
    },
  },
  plugins: [],
}
