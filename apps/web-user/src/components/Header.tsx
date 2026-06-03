'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const navLinks = [
  { label: '番剧', href: '//www.bilibili.com/anime/' },
  { label: '直播', href: '//live.bilibili.com' },
  { label: '游戏中心', href: '//game.bilibili.com/platform' },
  { label: '会员购', href: '//show.bilibili.com/platform/home.html' },
  { label: '漫画', href: '//manga.bilibili.com' },
  { label: '赛事', href: '//www.bilibili.com/match/home/' },
];

const channelLinks = [
  { label: '番剧', href: '/category/anime' },
  { label: '电影', href: '/category/movie' },
  { label: '国创', href: '/category/guochuang' },
  { label: '电视剧', href: '/category/tv' },
  { label: '综艺', href: '/category/variety' },
  { label: '纪录片', href: '/category/documentary' },
  { label: '动画', href: '/category/douga' },
  { label: '游戏', href: '/category/game' },
  { label: '鬼畜', href: '/category/kichiku' },
  { label: '音乐', href: '/category/music' },
  { label: '舞蹈', href: '/category/dance' },
  { label: '影视', href: '/category/cinephile' },
  { label: '娱乐', href: '/category/ent' },
  { label: '知识', href: '/category/knowledge' },
  { label: '科技数码', href: '/category/tech', spacing: '0px' },
  { label: '资讯', href: '/category/information' },
  { label: '美食', href: '/category/food' },
  { label: '小剧场', href: '/category/shortplay' },
  { label: '汽车', href: '/category/car' },
  { label: '时尚美妆', href: '/category/fashion', spacing: '0px' },
  { label: '体育运动', href: '/category/sports', spacing: '0px' },
  { label: '动物', href: '/category/animal' },
  { label: 'vlog', href: '/category/vlog', spacing: '0px' },
  { label: '绘画', href: '/category/painting' },
  { label: '人工智能', href: '/category/ai', spacing: '0px' },
  { label: '家装房产', href: '/category/home', spacing: '0px' },
  { label: '户外潮流', href: '/category/outdoors', spacing: '0px' },
  { label: '健身', href: '/category/gym' },
  { label: '手工', href: '/category/handmake' },
  { label: '旅游出行', href: '/category/travel', spacing: '0px' },
  { label: '三农', href: '/category/rural' },
  { label: '亲子', href: '/category/parenting' },
  { label: '健康', href: '/category/health' },
  { label: '情感', href: '/category/emotion' },
  { label: '生活兴趣', href: '/category/life_joy', spacing: '0px' },
  { label: '生活经验', href: '/category/life_experience', spacing: '0px' },
  { label: '公益', href: '/category/love' },
  { label: '超高清', href: '/category/uhd' },
  { label: '视频播客', href: '/category/podcast', spacing: '0px' },
];

const channelRightLinks = [
  { label: '专栏', href: '//www.bilibili.com/read/home/' },
  { label: '直播', href: '//live.bilibili.com' },
  { label: '活动', href: '//www.bilibili.com/blackboard/era/reward-activity-list-page.html' },
  { label: '课堂', href: '//www.bilibili.com/cheese/' },
  { label: '社区中心', href: '//www.bilibili.com/blackboard/activity-5zJxM3spoS.html' },
  { label: '新歌热榜', href: '//music.bilibili.com/pc/music-center/' },
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
    <header className="bili-header large-header">
      <div className="bili-header__bar">
        {/* 左侧: Logo + 导航 */}
        <ul className="left-entry">
          <li>
            <Link href="/" className="entry-title">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="zhuzhan-icon">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.73252 2.67094C3.33229 2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 15.2087 16.2091 16.9996 14 16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 14.1748 2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 7 9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 11.4477 11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z" fill="currentColor" />
              </svg>
              <span>首页</span>
            </Link>
          </li>
          {navLinks.map((link) => (
            <li key={link.label} className="v-popover-wrap">
              <a href={link.href} target="_blank" className="default-entry">
                <span>{link.label}</span>
              </a>
            </li>
          ))}
          <li className="v-popover-wrap">
            <a href="//app.bilibili.com" target="_blank" className="download-entry download-client-trigger">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="download-client-trigger__icon">
                <path d="M7.23181 8.65895V1.75796C7.23181 1.33935 7.57582 1 8.00018 1C8.42453 1 8.76854 1.33935 8.76854 1.75796V8.67097L9.98589 7.47009C10.286 7.17409 10.7725 7.17409 11.0725 7.47009C11.3726 7.7661 11.3726 8.24601 11.0725 8.54201L8.54958 11.0308C8.24952 11.3268 7.76302 11.3268 7.46295 11.0308L4.94002 8.54201C4.63995 8.24601 4.63995 7.7661 4.94002 7.47009C5.24008 7.17409 5.72658 7.17409 6.02665 7.47009L7.23181 8.65895Z" fill="currentColor" />
                <path d="M3.48023 4.29936C2.40686 4.29936 1.53672 5.15772 1.53672 6.21656V11.5669C1.53672 12.6257 2.40686 13.4841 3.48023 13.4841H12.5198C13.5931 13.4841 14.4633 12.6257 14.4633 11.5669V6.21656C14.4633 5.15772 13.5931 4.29936 12.5198 4.29936H11.6158C11.1915 4.29936 10.8475 3.96001 10.8475 3.5414C10.8475 3.12279 11.1915 2.78344 11.6158 2.78344H12.5198C14.4418 2.78344 16 4.3205 16 6.21656V11.5669C16 13.4629 14.4418 15 12.5198 15H3.48023C1.55815 15 0 13.4629 0 11.5669V6.21656C0 4.3205 1.55815 2.78344 3.48023 2.78344H4.38418C4.80853 2.78344 5.15254 3.12279 5.15254 3.5414C5.15254 3.96001 4.80853 4.29936 4.38418 4.29936H3.48023Z" fill="currentColor" />
              </svg>
              <span>下载客户端</span>
            </a>
          </li>
        </ul>

        {/* 中间: 搜索框 */}
        <div className="center-search-container offset-center-search" ref={searchRef}>
          <div className="center-search__bar">
            <form
              id="nav-searchform"
              style={{ borderRadius: '8px' }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <div className="nav-search-content">
                <input
                  className="nav-search-input"
                  type="text"
                  autoComplete="off"
                  accessKey="s"
                  maxLength={100}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setSearchFocused(true);
                    setShowSearchHistory(true);
                  }}
                  onBlur={() => {
                    setSearchFocused(false);
                  }}
                  placeholder=""
                  title=""
                />
                {searchQuery && (
                  <div className="nav-search-clean" onClick={() => setSearchQuery('')}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 14.75C11.7279 14.75 14.75 11.7279 14.75 8C14.75 4.27208 11.7279 1.25 8 1.25C4.27208 1.25 1.25 4.27208 1.25 8C1.25 11.7279 4.27208 14.75 8 14.75ZM9.64999 5.64303C9.84525 5.44777 10.1618 5.44777 10.3571 5.64303C10.5524 5.83829 10.5524 6.15487 10.3571 6.35014L8.70718 8.00005L10.3571 9.64997C10.5524 9.84523 10.5524 10.1618 10.3571 10.3571C10.1618 10.5523 9.84525 10.5523 9.64999 10.3571L8.00007 8.70716L6.35016 10.3571C6.15489 10.5523 5.83831 10.5523 5.64305 10.3571C5.44779 10.1618 5.44779 9.84523 5.64305 9.64997L7.29296 8.00005L5.64305 6.35014C5.44779 6.15487 5.44779 5.83829 5.64305 5.64303C5.83831 5.44777 6.15489 5.44777 6.35016 5.64303L8.00007 7.29294L9.64999 5.64303Z" fill="#C9CCD0" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="nav-search-btn" onClick={handleSearch}>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M16.3451 15.2003C16.6377 15.4915 16.4752 15.772 16.1934 16.0632C16.15 16.1279 16.0958 16.1818 16.0525 16.2249C15.7707 16.473 15.4456 16.624 15.1854 16.3652L11.6848 12.8815C10.4709 13.8198 8.97529 14.3267 7.44714 14.3267C3.62134 14.3267 0.5 11.2314 0.5 7.41337C0.5 3.60616 3.6105 0.5 7.44714 0.5C11.2729 0.5 14.3943 3.59538 14.3943 7.41337C14.3943 8.98802 13.8524 10.5087 12.8661 11.7383L16.3451 15.2003ZM2.13647 7.4026C2.13647 10.3146 4.52083 12.6766 7.43624 12.6766C10.3517 12.6766 12.736 10.3146 12.736 7.4026C12.736 4.49058 10.3517 2.1286 7.43624 2.1286C4.50999 2.1286 2.13647 4.50136 2.13647 7.4026Z" fill="currentColor" />
                </svg>
              </div>
            </form>
            <div className="search-panel" style={{ display: 'none' }}></div>
          </div>
        </div>

        {/* 右侧: 占位符 (B站SSR时为空) */}
        <div className="mini-header-right-loading"></div>
      </div>

      {/* Banner横幅 */}
      <div className="bili-header__banner">
        <div className="header-banner__inner"></div>
        <div className="taper-line"></div>
      </div>

      {/* 频道区域 */}
      <div className="bili-header__channel">
        <div className="bili-header__channel-inner">
          <div className="channel-icons">
            <Link href="/dynamic" className="channel-icons__item">
              <div className="icon-bg icon-bg__dynamic">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 2C6.03 2 2 6.03 2 11s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" fill="var(--text2)" />
                  <path d="M11 6v5l4.28 2.54.72-1.21-3.5-2.08V6H11z" fill="var(--text2)" />
                </svg>
              </div>
              <span className="icon-title">动态</span>
            </Link>
            <Link href="/popular" className="channel-icons__item">
              <div className="icon-bg icon-bg__popular">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.89054 17.272L4.89277 17.2742C6.49674 18.8782 8.66472 19.7888 10.9624 19.7888C13.2503 19.7888 15.2113 19.0539 16.6107 17.6108C18.0002 16.1345 18.7835 14.182 18.7421 12.1819C18.7852 11.3835 18.6916 9.36321 17.4088 6.75488C17.209 6.35523 16.8163 6.06598 16.3391 5.96993C15.8904 5.87103 15.4021 6.01997 15.061 6.35741C14.9094 6.48781 14.7796 6.61755 14.6655 6.7317C14.2107 3.35588 12.6083 1.7368 11.1654 1.00465C11.0775 0.931205 11.0311 0.900467 10.9694 0.888912C10.2276 0.608301 9.41043 1.01168 9.1237 1.77629C8.50566 3.46558 7.35287 4.62281 6.16627 5.76704C4.51756 7.33121 2.75938 9.03623 2.80163 12.093C2.75906 14.055 3.54464 15.8826 4.89054 17.272Z" fill="white" />
                </svg>
              </div>
              <span className="icon-title">热门</span>
            </Link>
          </div>

          <div className="right-channel-container">
            <div className="channel-items__left">
              {channelLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="channel-link"
                  style={{ letterSpacing: link.spacing || '2px' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="channel-items__right">
              {channelRightLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="channel-link__right"
                  target="_blank"
                >
                  <svg className="side-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
