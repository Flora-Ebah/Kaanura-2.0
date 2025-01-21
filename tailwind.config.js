/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        'primary': '#8B5E34',
        'primary-dark': '#4A2B0F',
      },
      fontFamily: {
        alexBrush: ['Alex Brush', 'cursive'],
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        base: ['16px', '24px'], // Taille de police et hauteur de ligne
      },
      height: {
        '112': '28rem',
        '128': '32rem',
      },
      animation: {
        marquee: 'marquee var(--duration, 30s) linear infinite',
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        scroll: 'scroll 20s linear infinite'
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap, 1rem)))' },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        scroll: {
          to: { transform: 'translateX(calc(-50%))' }
        }
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  variants: {
    extend: {
      // ... existing variants
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}