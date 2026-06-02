import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YuLiYuLi - 你感兴趣的视频都在这里',
  description: 'YuLiYuLi - bilibili style video platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
