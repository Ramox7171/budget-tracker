/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise 0.25s ease-out',
      },
      colors: {
        paper: '#FAF9F5',
        ink: '#1C1B19',
        stone: {
          150: '#EDEAE1',
        },
        ledger: {
          green: '#1F5C4D',
          greendark: '#164338',
          red: '#B23A2E',
          reddark: '#8E2E24',
        },
      },
    },
  },
  plugins: [],
}
