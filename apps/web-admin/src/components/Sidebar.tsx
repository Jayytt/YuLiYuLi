'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: '数据概览', href: '/', icon: '📊' },
  { label: '视频管理', href: '/video', icon: '🎬' },
  { label: '用户管理', href: '/user', icon: '👥' },
  { label: '评论管理', href: '/comment', icon: '💬' },
  { label: '分类管理', href: '/category', icon: '📁' },
  { label: 'Banner管理', href: '/banner', icon: '🖼' },
  { label: '举报处理', href: '/report', icon: '⚠' },
  { label: '站点配置', href: '/settings', icon: '⚙' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-admin-sidebar min-h-screen flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-white/10">
        <h1 className="text-white text-lg font-bold">YuLiYuLi Admin</h1>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-admin-primary text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
