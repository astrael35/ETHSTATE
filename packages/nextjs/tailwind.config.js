// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}"
  ],
  plugins: [require("daisyui")],
  darkMode: ["class", "[data-theme='dark']"], // Manual dark mode toggling
  daisyui: {
    themes: [
      {
        light: {
          primary: "#FFD700", // Gold for a luxurious feel
          "primary-content": "#000000", // Black text for contrast
          secondary: "#C0C0C0", // Silver
          "secondary-content": "#000000",
          accent: "#FFFAF0", // Ivory
          "accent-content": "#000000",
          neutral: "#F5F5F5", // Light gray
          "neutral-content": "#000000",
          "base-100": "#FFFFFF", // White background
          "base-200": "#F5F5F5",
          "base-300": "#E0E0E0",
          "base-content": "#000000",
          info: "#00BFFF", // Deep Sky Blue
          success: "#00FF00", // Lime Green
          warning: "#FFD700", // Gold
          error: "#FF4500", // Orange Red
          "--rounded-btn": "9999rem",
          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#FFD700", // Gold
          "primary-content": "#000000",
          secondary: "#B8860B", // Dark Golden Rod
          "secondary-content": "#FFFFFF",
          accent: "#C0C0C0", // Silver
          "accent-content": "#000000",
          neutral: "#333333", // Dark gray
          "neutral-content": "#FFFFFF",
          "base-100": "#111111", // Almost black background
          "base-200": "#1a1a1a",
          "base-300": "#333333",
          "base-content": "#FFFFFF",
          info: "#87CEEB", // Sky Blue
          success: "#00FF00",
          warning: "#FFD700",
          error: "#FF4500",
          "--rounded-btn": "9999rem",
          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        "space-grotesk": ["Space Grotesk", "sans-serif"],
        "luxury": ["Garamond", "serif"], // Luxury font example
      },
      boxShadow: {
        luxury: "0 4px 8px rgba(0, 0, 0, 0.2)",
        luxuryIn: "inset 0 4px 8px rgba(0, 0, 0, 0.2)",
      },
      animation: {
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
