import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bili-pink': '#fb7299',
        'bili-pink-hover': '#f6688e',
        'bili-blue': '#00a1d6',
        'bili-blue-hover': '#00b5e5',
        'bili-bg': '#f1f2f3',
        'bili-card': '#ffffff',
        'bili-text': '#18191c',
        'bili-text-secondary': '#9499a0',
        'bili-text-tertiary': '#61666d',
        'bili-border': '#e3e5e7',
        'bili-hover': '#e3e5e7',
        'bili-link': '#00a1d6',
        'bili-red': '#f45c5c',
        'bili-orange': '#ff6633',
        'bili-yellow': '#ffb027',
        'bili-green': '#4caf50',
      },
      fontFamily: {
        'harmony': ['-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'Helvetica', 'Arial', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
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
    },
  },
  plugins: [],
};

export default config;
