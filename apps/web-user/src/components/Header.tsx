'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const navLinks = [
  { label: '首页', href: '/' },
  { label: '番剧', href: '/category/anime' },
  { label: '直播', href: '/category/live' },
  { label: '游戏中心', href: '/category/game' },
  { label: '会员购', href: '/vip' },
  { label: '漫画', href: '/category/manga' },
  { label: '赛事', href: '/category/match' },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div className="max-w-[1400px] mx-auto px-5 h-16 flex items-center justify-between gap-4">
        {/* 左侧: Logo + 导航 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Link href="/" className="flex items-center mr-4" title="YuLiYuLi">
            <svg width="50" height="24" viewBox="0 0 50 24" fill="none">
              <text x="0" y="20" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="20" fill="#fb7299">
                Bili
              </text>
            </svg>
          </Link>
          <nav className="flex items-center">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1 text-[14px] hover:text-[#00a1d6] transition-colors whitespace-nowrap ${
                  i === 0 ? 'text-[#18191c] font-medium' : 'text-[#61666d]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 中间: 搜索框 */}
        <div className="flex-1 max-w-[400px] relative">
          <div
            className={`flex items-center rounded-full border transition-all ${
              searchFocused
                ? 'border-[#00a1d6] shadow-[0_0_0_1px_#00a1d6]'
                : 'border-[#e3e5e7] hover:border-[#c9ccd0]'
            }`}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索视频、番剧、UP主"
              className="flex-1 bg-transparent text-[14px] text-[#18191c] pl-4 pr-2 py-[7px] outline-none placeholder:text-[#9499a0]"
            />
            <button
              onClick={handleSearch}
              className="flex items-center justify-center w-10 h-[34px] rounded-full hover:bg-[#f1f2f3] transition-colors mr-[2px]"
              aria-label="搜索"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="7.5" cy="7.5" r="6" stroke="#9499a0" strokeWidth="1.5" />
                <line x1="12" y1="12" x2="16" y2="16" stroke="#9499a0" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* 右侧: 用户操作区 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* 投稿按钮 */}
          <Link
            href="/upload"
            className="flex items-center gap-1 px-4 py-[6px] bg-[#fb7299] text-white text-[14px] rounded-full hover:bg-[#f6688e] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            投稿
          </Link>

          {/* 消息 */}
          <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f1f2f3] transition-colors" title="消息">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1z" stroke="#61666d" strokeWidth="1.2" />
              <path d="M2 5l8 5 8-5" stroke="#61666d" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>

          {/* 历史 */}
          <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f1f2f3] transition-colors" title="历史">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#61666d" strokeWidth="1.2" />
              <path d="M10 5v5l3.5 3.5" stroke="#61666d" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>

          {/* 收藏 */}
          <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f1f2f3] transition-colors" title="收藏">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3l2.47 5.01L18 8.85l-4 3.9.94 5.5L10 15.77 5.06 18.25 6 12.75l-4-3.9 5.53-.84L10 3z" stroke="#61666d" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </button>

          {/* 头像/登录 */}
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f1f2f3] hover:bg-[#e3e5e7] transition-colors ml-1" title="登录">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="3.5" stroke="#9499a0" strokeWidth="1.2" />
              <path d="M3.5 17c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke="#9499a0" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
