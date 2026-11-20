import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['var(--font-display)', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        bg: '#08090b',
        panel: '#0f1013',
        'panel-2': '#14161a',
        ink: '#f4f4f6',
        muted: '#8a8b93',
        dim: '#5c5e66',
        accent: '#7ff3d0',
        warm: '#ffb86b',
        line: 'rgba(255,255,255,0.13)',
        'line-2': 'rgba(255,255,255,0.28)',
      },
      letterSpacing: {
        orbit: '0.3em',
      },
      keyframes: {
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 48s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
