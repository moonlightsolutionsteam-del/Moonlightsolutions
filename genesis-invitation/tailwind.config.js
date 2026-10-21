/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: 'var(--wine)', ruby: 'var(--ruby)', velvet: 'var(--velvet)', gold: 'var(--gold)',
        'gold-hi': 'var(--gold-hi)', champagne: 'var(--champagne)', ivory: 'var(--ivory)', ink: 'var(--ink)',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'Trajan Pro', 'Georgia', 'serif'],
        garamond: ['"Cormorant Garamond"', 'Garamond', '"Times New Roman"', 'serif'],
      },
    },
  },
  plugins: [],
};
