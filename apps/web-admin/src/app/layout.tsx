import type { Metadata } from 'next';
import './globals.css';
import AdminShell from '@/components/AdminShell';

export const metadata: Metadata = {
  title: 'YuLiYuLi Admin',
  description: 'YuLiYuLi Admin Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
