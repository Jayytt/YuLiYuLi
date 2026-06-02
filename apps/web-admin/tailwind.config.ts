import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'admin-primary': '#1890ff',
        'admin-bg': '#f0f2f5',
        'admin-sidebar': '#001529',
        'admin-text': '#333333',
        'admin-text-secondary': '#666666',
        'admin-border': '#d9d9d9',
      },
    },
  },
  plugins: [],
};

export default config;
