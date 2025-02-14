/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/views/**/**/*.{html,js,ejs}"],
  theme: {
    container: {
      center: true
    },
    extend: {
      colors: {
        "primary": "#16A34A", // Vibrant green
        "secondaryButton": "#E5E7EB", // Cool light gray
        "disabledButton": "#9CA3AF", // Muted gray
        "primaryBackground": "#F0FDF4", // Very light green
        "FFFFFF": "#FFFFFF", // Pure white
        "202020": "#1F2937", // Dark slate
        "404040": "#334155", // Deep grayish blue
        "606060": "#4B5563", // Medium grayish blue
        "868686": "#64748B", // Lighter slate gray
        "EDEDED": "#CBD5E1", // Soft gray-blue
        "CBCBCB": "#E2E8F0", // Very light gray-blue
        "ADADAD": "#F8FAFC", // Subtle off-white
        "DFDFDF": "#F9FAFB", // Extra light gray
        "error": "#EF4444", // Bold red
        "error-light-1": "#FEE2E2", // Soft red
        "error-light-2": "#FCA5A5", // Coral red
        "warning": "#D97706", // Burnt orange
        "warning-light-1": "#FDE68A", // Pale yellow
        "warning-light-2": "#FFF7ED", // Light beige
        "success": "#10B981", // Deep emerald
        "success-light-1": "#D1FAE5", // Pale mint
        "success-light-2": "#A7F3D0" // Light mint
      }      
    },
  },
  plugins: [],
}
