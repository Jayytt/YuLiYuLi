import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bili-pink': 'var(--brand-pink)',
        'bili-pink-hover': 'var(--brand-pink-hover)',
        'bili-blue': 'var(--brand-blue)',
        'bili-blue-hover': 'var(--brand-blue-hover)',
        'bili-bg': 'var(--bg-secondary)',
        'bili-card': 'var(--bg-card)',
        'bili-text': 'var(--text-primary)',
        'bili-text-secondary': 'var(--text-secondary)',
        'bili-text-tertiary': 'var(--text-tertiary)',
        'bili-border': 'var(--border-color)',
        'bili-hover': 'var(--bg-hover)',
        'bili-link': 'var(--brand-blue)',
      },
      fontFamily: {
        'harmony': [
          '-apple-system',
          'BlinkMacSystemFont',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'sans-serif',
        ],
      },
      maxWidth: {
        'bili': '1400px',
      },
      borderRadius: {
        'bili': '6px',
      },
      fontSize: {
        'bili-title': ['15px', '22px'],
        'bili-meta': ['12px', '18px'],
      },
      boxShadow: {
        'bili-card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'bili-card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'bili-header': '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
