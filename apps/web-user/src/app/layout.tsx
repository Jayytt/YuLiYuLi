import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YuLiYuLi - bilibili style video platform',
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
