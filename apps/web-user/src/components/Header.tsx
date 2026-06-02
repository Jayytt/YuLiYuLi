'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1140px] mx-auto px-[10px] h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-bili-pink text-xl font-bold whitespace-nowrap">
            YuLiYuLi
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/" className="hover:text-bili-pink transition-colors">首页</Link>
            <Link href="/category/1" className="hover:text-bili-pink transition-colors">动画</Link>
            <Link href="/category/2" className="hover:text-bili-pink transition-colors">番剧</Link>
            <Link href="/category/3" className="hover:text-bili-pink transition-colors">游戏</Link>
            <Link href="/category/4" className="hover:text-bili-pink transition-colors">音乐</Link>
            <Link href="/category/5" className="hover:text-bili-pink transition-colors">舞蹈</Link>
            <Link href="/category/6" className="hover:text-bili-pink transition-colors">科技</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索视频"
              className="input-bili w-64 rounded-r-none"
            />
            <button
              onClick={handleSearch}
              className="btn-bili btn-bili-secondary rounded-l-none px-4"
            >
              搜索
            </button>
          </div>
          <button className="btn-bili btn-bili-primary">登录</button>
        </div>
      </div>
    </header>
  );
}
