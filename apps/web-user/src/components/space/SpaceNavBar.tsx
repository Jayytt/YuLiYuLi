'use client';

import Link from 'next/link';

interface SpaceNavBarProps {
  userId: number;
  activeTab?: string;
}

const tabs = [
  { key: 'home', label: '主页', path: '' },
  { key: 'dynamic', label: '动态', path: '/dynamic' },
  { key: 'video', label: '投稿', path: '/video' },
  { key: 'collection', label: '合集和系列', path: '/collection' },
  { key: 'fav', label: '收藏', path: '/fav' },
  { key: 'bangumi', label: '追番追剧', path: '/bangumi' },
  { key: 'setting', label: '设置', path: '/setting' },
];

export default function SpaceNavBar({ userId, activeTab = 'home' }: SpaceNavBarProps) {
  return (
    <div className="space-nav-bar">
      <div className="space-nav-bar__inner">
        {tabs.map((tab) => {
          const href = tab.path ? `/space/${userId}${tab.path}` : `/space/${userId}`;
          const isActive = tab.key === activeTab;
          return (
            <Link
              key={tab.key}
              href={href}
              className={`space-nav-bar__item ${isActive ? 'space-nav-bar__item--active' : ''}`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
