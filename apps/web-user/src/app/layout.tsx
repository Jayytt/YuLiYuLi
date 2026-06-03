import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YuLiYuLi - 你感兴趣的视频都在这里',
  description: 'YuLiYuLi - bilibili style video platform',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FB7299" />
      </head>
      <body>{children}</body>
    </html>
  );
}
