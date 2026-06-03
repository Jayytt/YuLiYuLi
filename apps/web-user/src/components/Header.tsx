'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
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
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchHistory(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 bg-white"
      style={{ boxShadow: 'var(--shadow-header)', height: 'var(--header-height)' }}
    >
      <div className="container-bili h-full flex items-center justify-between gap-3">
        {/* 左侧: Logo + 导航 */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center mr-4" title="bilibili">
            <svg width="50" height="28" viewBox="0 0 50 28" fill="none">
              <path
                d="M13.2 3.6c-.4-.8-1.2-1.2-2-1.2H8c-.8 0-1.6.4-2 1.2L3.6 8H1.6C.8 8 0 8.8 0 9.6v12.8C0 23.2.8 24 1.6 24h16.8c.8 0 1.6-.8 1.6-1.6V9.6c0-.8-.8-1.6-1.6-1.6h-2L13.2 3.6zM6 11.2c.8 0 1.6.8 1.6 1.6s-.8 1.6-1.6 1.6-1.6-.8-1.6-1.6.8-1.6 1.6-1.6zm8 0c.8 0 1.6.8 1.6 1.6s-.8 1.6-1.6 1.6-1.6-.8-1.6-1.6.8-1.6 1.6-1.6zM36.8 3.6c-.4-.8-1.2-1.2-2-1.2h-3.2c-.8 0-1.6.4-2 1.2L27.2 8h-2c-.8 0-1.6.8-1.6 1.6v12.8c0 .8.8 1.6 1.6 1.6h16.8c.8 0 1.6-.8 1.6-1.6V9.6c0-.8-.8-1.6-1.6-1.6h-2l-2.4-4.4zM30 11.2c.8 0 1.6.8 1.6 1.6s-.8 1.6-1.6 1.6-1.6-.8-1.6-1.6.8-1.6 1.6-1.6zm8 0c.8 0 1.6.8 1.6 1.6s-.8 1.6-1.6 1.6-1.6-.8-1.6-1.6.8-1.6 1.6-1.6z"
                fill="#FB7299"
              />
              <path
                d="M46.4 8h-2.8c-.4 0-.8.4-.8.8v1.6c0 .4.4.8.8.8h2.8c.4 0 .8-.4.8-.8V8.8c0-.4-.4-.8-.8-.8z"
                fill="#FB7299"
              />
            </svg>
          </Link>
          <nav className="flex items-center gap-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 text-[14px] transition-colors whitespace-nowrap rounded-md ${
                  i === 0
                    ? 'text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-active)]'
                }`}
              >
                {link.label}
                {i === 0 && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[3px] bg-[var(--brand-pink)] rounded-full" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* 中间: 搜索框 */}
        <div className="flex-1 max-w-[420px] relative" ref={searchRef}>
          <div
            className={`flex items-center rounded-full transition-all ${
              searchFocused
                ? 'border-[var(--brand-blue)] shadow-[0_0_0_1px_var(--brand-blue)] bg-white'
                : 'border-[var(--border-color)] hover:border-[var(--border-hover)] bg-[var(--bg-active)]'
            }`}
            style={{ border: searchFocused ? '1px solid var(--brand-blue)' : '1px solid var(--border-color)' }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setSearchFocused(true);
                setShowSearchHistory(true);
              }}
              onBlur={() => {
                setSearchFocused(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索视频、番剧、UP主"
              className="flex-1 bg-transparent text-[14px] text-[var(--text-primary)] pl-4 pr-2 py-[8px] outline-none placeholder:text-[var(--text-tertiary)]"
            />
            <button
              onClick={handleSearch}
              className="flex items-center justify-center w-10 h-[36px] rounded-full hover:bg-[var(--bg-hover)] transition-colors mr-[2px]"
              aria-label="搜索"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="7.5" cy="7.5" r="6" stroke="var(--text-tertiary)" strokeWidth="1.5" />
                <line x1="12" y1="12" x2="16" y2="16" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* 搜索下拉 */}
          {showSearchHistory && (
            <div
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg py-2 animate-bili-fade-in"
              style={{ boxShadow: 'var(--shadow-dropdown)' }}
            >
              <div className="px-4 py-2 text-[12px] text-[var(--text-tertiary)]">热门搜索</div>
              {['热门视频', '新番推荐', '游戏实况', '音乐现场'].map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-4 py-2 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-active)] hover:text-[var(--text-primary)] transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSearchQuery(item);
                    setShowSearchHistory(false);
                    router.push(`/search?q=${encodeURIComponent(item)}`);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 右侧: 用户操作区 */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {/* 投稿按钮 */}
          <Link
            href="/upload"
            className="flex items-center gap-1 px-4 py-[7px] bg-[var(--brand-pink)] text-white text-[14px] rounded-full hover:bg-[var(--brand-pink-hover)] transition-colors mr-1"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            投稿
          </Link>

          {/* 消息 */}
          <button
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--bg-active)] transition-colors"
            title="消息"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1z" stroke="var(--text-secondary)" strokeWidth="1.2" />
              <path d="M2 5l8 5 8-5" stroke="var(--text-secondary)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>

          {/* 历史 */}
          <button
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--bg-active)] transition-colors"
            title="历史"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="var(--text-secondary)" strokeWidth="1.2" />
              <path d="M10 5v5l3.5 3.5" stroke="var(--text-secondary)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>

          {/* 收藏 */}
          <button
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--bg-active)] transition-colors"
            title="收藏"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3l2.47 5.01L18 8.85l-4 3.9.94 5.5L10 15.77 5.06 18.25 6 12.75l-4-3.9 5.53-.84L10 3z" stroke="var(--text-secondary)" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </button>

          {/* 头像/登录 */}
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full overflow-hidden ml-1.5 hover:opacity-80 transition-opacity"
            title="登录"
          >
            <div className="w-full h-full bg-gradient-to-br from-[var(--brand-pink)] to-[var(--brand-blue)] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6.5" r="3" stroke="white" strokeWidth="1.2" />
                <path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
