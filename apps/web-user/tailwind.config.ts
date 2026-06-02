import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bili-pink': '#fb7299',
        'bili-blue': '#00a1d6',
        'bili-bg': '#f4f4f4',
        'bili-card': '#ffffff',
        'bili-text': '#212121',
        'bili-text-secondary': '#999999',
        'bili-border': '#e3e5e7',
        'bili-hover': '#e3e5e7',
      },
      fontFamily: {
        'harmony': ['HarmonyOS Sans', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      maxWidth: {
        'bili': '1140px',
      },
    },
  },
  plugins: [],
};

export default config;
