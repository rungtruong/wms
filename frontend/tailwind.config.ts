import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Original color scheme from the warranty system
        cream: {
          50: 'rgba(252, 252, 249, 1)',
          100: 'rgba(255, 255, 253, 1)',
        },
        teal: {
          300: 'rgba(50, 184, 198, 1)',
          400: 'rgba(45, 166, 178, 1)',
          500: 'rgba(33, 128, 141, 1)',
          600: 'rgba(29, 116, 128, 1)',
          700: 'rgba(26, 104, 115, 1)',
          800: 'rgba(41, 150, 161, 1)',
        },
        slate: {
          500: 'rgba(98, 108, 113, 1)',
          900: 'rgba(19, 52, 59, 1)',
        },
        brown: {
          600: 'rgba(94, 82, 64, 1)',
        },
        primary: {
          50: 'rgba(252, 252, 249, 1)',
          100: 'rgba(255, 255, 253, 1)',
          500: 'rgba(33, 128, 141, 1)',
          600: 'rgba(29, 116, 128, 1)',
          700: 'rgba(26, 104, 115, 1)',
        },
        gray: {
          50: 'rgba(252, 252, 249, 1)',
          100: 'rgba(255, 255, 253, 1)',
          200: 'rgba(245, 245, 245, 1)',
          300: 'rgba(167, 169, 169, 1)',
          400: 'rgba(119, 124, 124, 1)',
          500: 'rgba(98, 108, 113, 1)',
          600: 'rgba(94, 82, 64, 1)',
          700: 'rgba(31, 33, 33, 1)',
          800: 'rgba(38, 40, 40, 1)',
          900: 'rgba(19, 52, 59, 1)',
        },
        red: {
          400: 'rgba(255, 84, 89, 1)',
          500: 'rgba(192, 21, 47, 1)',
        },
        orange: {
          400: 'rgba(230, 129, 97, 1)',
          500: 'rgba(168, 75, 47, 1)',
        },
        // Background colors for stat cards
        bg: {
          1: 'rgba(59, 130, 246, 0.08)',
          2: 'rgba(245, 158, 11, 0.08)',
          3: 'rgba(34, 197, 94, 0.08)',
          4: 'rgba(239, 68, 68, 0.08)',
          5: 'rgba(147, 51, 234, 0.08)',
          6: 'rgba(249, 115, 22, 0.08)',
          7: 'rgba(236, 72, 153, 0.08)',
          8: 'rgba(6, 182, 212, 0.08)',
        }
      },
      backgroundColor: {
        'surface': 'rgba(255, 255, 253, 1)',
        'background': 'rgba(252, 252, 249, 1)',
      },
      borderColor: {
        'card': 'rgba(94, 82, 64, 0.12)',
        'default': 'rgba(94, 82, 64, 0.2)',
      },
      textColor: {
        'primary': 'rgba(19, 52, 59, 1)',
        'secondary': 'rgba(98, 108, 113, 1)',
      }
    },
  },
  plugins: [],
}
export default config
