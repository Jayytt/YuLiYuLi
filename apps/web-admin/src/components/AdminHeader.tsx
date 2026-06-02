'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const pageTitles: Record<string, string> = {
  '/': '数据概览',
  '/video': '视频管理',
  '/user': '用户管理',
  '/comment': '评论管理',
  '/category': '分类管理',
  '/banner': 'Banner管理',
  '/report': '举报处理',
  '/settings': '站点配置',
};

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState('Admin');

  useEffect(() => {
    const name = localStorage.getItem('admin_username');
    if (name) setUsername(name);
  }, []);

  const title = pageTitles[pathname] || '管理后台';

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-admin-border flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-admin-text">{title}</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-admin-text-secondary">{username}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          退出登录
        </button>
      </div>
    </header>
  );
}
