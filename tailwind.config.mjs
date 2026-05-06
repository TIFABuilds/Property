/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2b3c',
          deep: '#0f1d2e',
          light: '#243a52',
        },
        teal: {
          DEFAULT: '#3a8a7e',
          deep: '#2c6e64',
          light: '#5aa89c',
        },
        cream: '#fafaf7',
        ink: '#0a1420',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};
