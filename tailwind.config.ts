import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        text: 'var(--text)',
        dim: 'var(--dim)',
        border: 'var(--border)',
        amber: 'var(--amber)',
        teal: 'var(--teal)',
        danger: 'var(--red)',
        success: 'var(--green)',
      },
    },
  },
  plugins: [],
} satisfies Config;
