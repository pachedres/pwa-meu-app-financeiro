/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#10B981",
        "primary-light": "#d1fae5",
        "primary-soft": "#ecfdf5",
        success: "#22C55E",
        "success-light": "#f0fdf4",
        "success-border": "#bbf7d0",
        danger: "#EF4444",
        "danger-light": "#fef2f2",
        "danger-border": "#fecaca",
        warning: "#F59E0B",
        "warning-light": "#fffbeb",
        fundo: "#f0fdf4",
        cartao: "#ffffff",
        "text-main": "#1a1a2e",
        "text-secondary": "#555555",
        "text-soft": "#888888",
        "text-faint": "#bbbbbb",
        border: "#e8e8e8",
        "border-light": "#f0f0f0",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "14px",
        xl: "20px",
        full: "9999px",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      }
    }
  },
  plugins: []
};
