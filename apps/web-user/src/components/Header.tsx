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
  { label: '活动', href: '//www.bilibili.com/blackboard/era/reward-activity-list-page.html#/list' },
  { label: '课堂', href: '//www.bilibili.com/cheese/?csource=common_hp_channelclass_icon' },
  { label: '社区中心', href: '//www.bilibili.com/blackboard/activity-5zJxM3spoS.html' },
  { label: '新歌热榜', href: '//music.bilibili.com/pc/music-center/' },
];

const searchPlaceholders = [
  '搜索你感兴趣的内容',
  '原神 4.5 新角色',
  '周杰伦演唱会',
  'Python 教程',
  '猫咪日常',
  'Minecraft 建筑',
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [isLoggedIn] = useState(false);
  const [showChannelExpand, setShowChannelExpand] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const channelExpandRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderVisible(false);
      setTimeout(() => {
        setPlaceholderIndex((i) => (i + 1) % searchPlaceholders.length);
        setPlaceholderVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
                {!searchQuery && !searchFocused && (
                  <div className="nav-search-input-placeholder">
                    <span
                      className="placeholder-text"
                      style={{ opacity: placeholderVisible ? 1 : 0, transition: 'opacity 0.3s ease' }}
                    >
                      {searchPlaceholders[placeholderIndex]}
                    </span>
                  </div>
                )}
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

        {/* 右侧导航 */}
        <ul className="right-entry">
          <li className="right-entry-item">
            <li className="v-popover-wrap">
              <div className="right-entry__outside go-login-btn">
                <div className="header-login-entry">
                  <span>登录</span>
                </div>
              </div>
            </li>
          </li>
          <li className="right-entry-item">
            <li className="v-popover-wrap">
              <a href="//account.bilibili.com/big" target="_blank" className="right-entry__outside right-entry--vip">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="right-entry-icon">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10 1C5.02955 1 1 5.02955 1 10C1 14.9705 5.02955 19 10 19C14.9705 19 19 14.9705 19 10C19 5.02955 14.9705 1 10 1ZM10.0006 2.63614C14.0612 2.63614 17.3642 5.93996 17.3642 9.99977C17.3642 14.0604 14.0612 17.3634 10.0006 17.3634C5.93996 17.3634 2.63696 14.0604 2.63696 9.99977C2.63696 5.93996 5.93996 2.63614 10.0006 2.63614Z" fill="currentColor"/>
                  <path d="M13.1381 8.05573V8.05331H10.7706C10.7859 7.8643 10.7948 7.67286 10.7948 7.47981C10.7948 7.26414 10.7843 7.05008 10.7649 6.83926C10.7658 6.82552 10.7674 6.81179 10.7674 6.79725V6.79483C10.7674 6.35541 10.4111 6 9.97254 6C9.53312 6 9.17771 6.35622 9.17771 6.79483V6.79725C9.17771 6.85137 9.18336 6.90468 9.19386 6.95557L9.18255 6.95719C9.19871 7.12924 9.20759 7.30291 9.20759 7.479C9.20759 7.67286 9.19709 7.8643 9.17771 8.0525H6.74313V8.05573C6.32876 8.08239 6 8.42649 6 8.84814V8.85057C6 9.28998 6.33683 9.64216 6.77544 9.64216C6.80937 9.64216 6.8441 9.64378 6.89903 9.64297L8.7601 9.63893C8.28837 10.7294 7.47011 11.6341 6.44507 12.2149C6.44023 12.2173 6.43619 12.2197 6.43134 12.2229C6.42003 12.2294 6.40953 12.2359 6.39822 12.2423L6.39903 12.2431C6.17528 12.3837 6.02585 12.6325 6.02585 12.916V12.9184C6.02585 13.3578 6.38207 13.7132 6.82068 13.7132C6.99111 13.7132 7.14782 13.6591 7.27706 13.5687C8.7706 12.706 9.9168 11.3094 10.4556 9.64055H13.0105C13.0517 9.64136 13.1131 9.63893 13.1131 9.63893C13.5905 9.62924 13.9039 9.2916 13.9039 8.85299V8.85057C13.9047 8.42003 13.5638 8.07108 13.1381 8.05573Z" fill="currentColor"/>
                  <path d="M13.7731 12.5388C13.7715 12.5356 13.7691 12.5331 13.7674 12.5307C13.74 12.4814 13.7077 12.4362 13.6713 12.3942C13.1584 11.6672 12.513 11.0412 11.7674 10.5541L11.7666 10.555C11.6366 10.4613 11.4766 10.4055 11.3046 10.4055C10.8652 10.4055 10.5098 10.7617 10.5098 11.2003V11.2028C10.5098 11.5033 10.677 11.765 10.9233 11.8999C11.5615 12.3215 12.0825 12.8045 12.4944 13.4499L12.5372 13.5041C12.6786 13.6333 12.866 13.7133 13.0728 13.7133C13.5122 13.7133 13.8676 13.3571 13.8676 12.9184V12.916C13.8668 12.7795 13.8329 12.6511 13.7731 12.5388Z" fill="currentColor"/>
                </svg>
                <span className="right-entry-text">大会员</span>
              </a>
            </li>
          </li>
          <li className="v-popover-wrap right-entry-item">
            <div className="right-entry__outside">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="right-entry-icon">
                <path d="M15.435 17.7717H4.567C2.60143 17.7717 1 16.1723 1 14.2047V5.76702C1 3.80144 2.59942 2.20001 4.567 2.20001H15.433C17.3986 2.20001 19 3.79943 19 5.76702V14.2047C19.002 16.1703 17.4006 17.7717 15.435 17.7717ZM4.567 4.00062C3.59327 4.00062 2.8006 4.79328 2.8006 5.76702V14.2047C2.8006 15.1784 3.59327 15.9711 4.567 15.9711H15.433C16.4067 15.9711 17.1994 15.1784 17.1994 14.2047V5.76702C17.1994 4.79328 16.4067 4.00062 15.433 4.00062H4.567Z" fill="currentColor"/>
                <path d="M9.99943 11.2C9.51188 11.2 9.02238 11.0667 8.59748 10.8019L8.5407 10.7635L4.3329 7.65675C3.95304 7.37731 3.88842 6.86226 4.18996 6.50976C4.48954 6.15544 5.0417 6.09699 5.4196 6.37643L9.59412 9.45943C9.84279 9.60189 10.1561 9.60189 10.4067 9.45943L14.5812 6.37643C14.9591 6.09699 15.5113 6.15544 15.8109 6.50976C16.1104 6.86409 16.0478 7.37731 15.6679 7.65675L11.4014 10.8019C10.9765 11.0667 10.487 11.2 9.99943 11.2Z" fill="currentColor"/>
              </svg>
              <span className="right-entry-text">消息</span>
            </div>
          </li>
          <li className="v-popover-wrap right-entry-item">
            <div className="right-entry__outside">
              <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="right-entry-icon">
                <path d="M10 10.743C7.69883 10.743 5.83333 8.87747 5.83333 6.5763C5.83333 4.27512 7.69883 2.40964 10 2.40964V10.743Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M10 10.743C10 13.0441 8.1345 14.9096 5.83333 14.9096C3.53217 14.9096 1.66667 13.0441 1.66667 10.743H10Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M10 10.743C10 8.44182 11.8655 6.57632 14.1667 6.57632C16.4679 6.57632 18.3333 8.44182 18.3333 10.743H10Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M9.99999 10.743C12.3012 10.743 14.1667 12.6085 14.1667 14.9096C14.1667 17.2108 12.3012 19.0763 9.99999 19.0763V10.743Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              </svg>
              <span className="right-entry-text">动态</span>
            </div>
          </li>
          <li className="v-popover-wrap right-entry-item">
            <div className="right-entry__outside">
              <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="right-entry-icon">
                <path fillRule="evenodd" clipRule="evenodd" d="M11.0505 3.16759L12.7915 6.69573C12.954 7.02647 13.2702 7.25612 13.6349 7.30949L17.5294 7.87474C18.448 8.00817 18.8159 9.13785 18.1504 9.78639L15.3331 12.5334C15.0686 12.7905 14.9481 13.1609 15.0104 13.5256L15.6759 17.4031C15.8328 18.3184 14.8721 19.0171 14.0497 18.5845L10.5661 16.7537C10.2402 16.5823 9.85042 16.5823 9.52373 16.7537L6.04087 18.5845C5.21848 19.0171 4.2578 18.3184 4.41468 17.4031L5.07939 13.5256C5.14166 13.1609 5.02198 12.7905 4.75755 12.5334L1.9394 9.78639C1.27469 9.13785 1.64182 8.00817 2.56126 7.87474L6.4549 7.30949C6.82041 7.25612 7.13578 7.02647 7.29832 6.69573L9.04015 3.16759C9.45095 2.33468 10.6389 2.33468 11.0505 3.16759Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.603 11.8739C11.413 12.5556 10.7871 13.0554 10.0447 13.0554C9.29592 13.0554 8.66679 12.5467 8.48242 11.8569" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="right-entry-text">收藏</span>
            </div>
          </li>
          <li className="v-popover-wrap right-entry-item">
            <div className="right-entry__outside">
              <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="right-entry-icon">
                <path fillRule="evenodd" clipRule="evenodd" d="M10 1.74286C5.02955 1.74286 1 5.7724 1 10.7429C1 15.7133 5.02955 19.7429 10 19.7429C14.9705 19.7429 19 15.7133 19 10.7429C19 5.7724 14.9705 1.74286 10 1.74286ZM10.0006 3.379C14.0612 3.379 17.3642 6.68282 17.3642 10.7426C17.3642 14.8033 14.0612 18.1063 10.0006 18.1063C5.93996 18.1063 2.63696 14.8033 2.63696 10.7426C2.63696 6.68282 5.93996 3.379 10.0006 3.379Z" fill="currentColor"/>
                <path d="M9.99985 6.6521V10.743" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                <path d="M12.4545 10.7427H10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
              </svg>
              <span className="right-entry-text">历史</span>
            </div>
          </li>
          <li className="right-entry-item">
            <div className="right-entry__outside">
              <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="right-entry-icon">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.99999 1.74286C9.92916 1.74286 9.85916 1.74369 9.78833 1.74536C5.85416 1.85453 2.58416 5.14869 2.50166 9.08286C2.44999 11.5404 3.58666 13.7304 5.36999 15.1337C5.52166 15.2529 5.63166 15.4162 5.67333 15.6045L6.30416 18.447C6.51583 19.3987 7.36083 20.0762 8.33583 20.0762H11.6617C12.6383 20.0762 13.4842 19.3987 13.6958 18.4445L14.3275 15.602C14.3692 15.4154 14.4775 15.2537 14.6275 15.1354C16.3733 13.7629 17.5 11.637 17.5 9.24286C17.5 5.10036 14.1425 1.74286 9.99999 1.74286ZM10.0003 3.40939C13.2161 3.40939 15.8336 6.02606 15.8336 9.24273C15.8336 11.0386 15.0186 12.7086 13.5978 13.8252C13.1428 14.1827 12.8244 14.6852 12.7011 15.2402L12.0686 18.0827C12.0269 18.2752 11.8586 18.4094 11.6619 18.4094H8.33609C8.14109 18.4094 7.97359 18.2761 7.93192 18.0852L7.30025 15.2427C7.17609 14.6869 6.85775 14.1827 6.40109 13.8236C4.94359 12.6769 4.12942 10.9619 4.16859 9.11773C4.23192 6.05523 6.77442 3.49606 9.83442 3.41189C9.88942 3.41023 9.94525 3.40939 10.0003 3.40939Z" fill="currentColor"/>
                <path d="M10 6.81299L8.81253 9.18726H11.1875L9.99952 11.561" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.66656 15.9095H13.3332" stroke="currentColor" strokeWidth="1.7"/>
              </svg>
              <span className="right-entry-text">创作中心</span>
            </div>
          </li>
          <li className="right-entry-item right-entry-item--upload">
            <li className="v-popover-wrap">
              <div className="header-upload-entry">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="header-upload-entry__icon">
                  <path d="M12.0824 10H14.1412C15.0508 10 15.7882 10.7374 15.7882 11.6471V12.8824C15.7882 13.792 15.0508 14.5294 14.1412 14.5294H3.84707C2.93743 14.5294 2.20001 13.792 2.20001 12.8824V11.6471C2.20001 10.7374 2.93743 10 3.84707 10H5.90589" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.99413 11.2353L8.99413 3.82353" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.0823 6.29413L8.9941 3.20589L5.90587 6.29413" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="header-upload-entry__text">投稿</span>
              </div>
            </li>
          </li>
        </ul>
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
            {/* 动态 - 使用B站原版四叶草SVG */}
            <a className="channel-icons__item" href="//t.bilibili.com" target="_blank">
              <div className="icon-bg icon-bg__dynamic">
                <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-bg--icon">
                  <path d="M6.41659 15.625C3.88528 15.625 1.83325 13.7782 1.83325 11.5H10.9999C10.9999 13.7782 8.94789 15.625 6.41659 15.625Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.125 16.0827C15.125 18.614 13.2782 20.666 11 20.666L11 11.4993C13.2782 11.4993 15.125 13.5514 15.125 16.0827Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.875 6.91667C6.875 9.44797 8.72183 11.5 11 11.5L11 2.33333C8.72182 2.33333 6.875 4.38536 6.875 6.91667Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.5833 7.375C13.052 7.375 11 9.22183 11 11.5H20.1667C20.1667 9.22183 18.1146 7.375 15.5833 7.375Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="icon-title">动态</span>
            </a>
            {/* 热门 - 使用B站原版火焰SVG */}
            <a href="//www.bilibili.com/v/popular/all" target="_blank" className="channel-icons__item">
              <div className="icon-bg icon-bg__popular">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-bg--icon">
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.89054 17.272L4.89277 17.2742C6.49674 18.8782 8.66472 19.7888 10.9624 19.7888C13.2503 19.7888 15.2113 19.0539 16.6107 17.6108L16.6108 17.6108L16.6128 17.6086C18.0002 16.1345 18.7835 14.182 18.7421 12.1819C18.7852 11.3835 18.6916 9.36321 17.4088 6.75488L17.4082 6.7537C17.209 6.35523 16.8163 6.06598 16.3391 5.96993C15.8904 5.87103 15.4021 6.01997 15.061 6.35741C14.9094 6.48781 14.7796 6.61755 14.6655 6.7317L14.6637 6.73348L14.6329 6.76426C14.2107 3.35588 12.6083 1.7368 11.1654 1.00465C11.148 0.987812 11.1265 0.967972 11.1036 0.950782C11.0775 0.931205 11.0311 0.900467 10.9694 0.888912C10.2276 0.608301 9.41043 1.01168 9.1237 1.77629L9.12314 1.7778C8.50566 3.46558 7.35287 4.62281 6.16627 5.76704C4.51756 7.33121 2.75938 9.03623 2.80163 12.093C2.75906 14.055 3.54464 15.8826 4.89054 17.272ZM10.9306 17.7376C12.4802 17.8192 13.9509 17.2497 15.0989 16.1856C16.1154 15.1261 16.6483 13.655 16.6483 12.1785V12.1362C16.6483 10.8624 16.3969 9.6266 15.8955 8.49474C15.2436 9.11663 14.7845 9.49093 14.4179 9.68717C14.2122 9.79725 14.0268 9.85633 13.846 9.86789C13.6644 9.8795 13.5028 9.84219 13.3473 9.78249C12.9207 9.62211 12.6679 9.20129 12.6679 8.74864V8.74464L12.6679 8.74464C12.6889 7.69735 12.6046 6.55594 12.2954 5.53554C12.01 4.59379 11.5372 3.76766 10.7904 3.20655C9.96581 4.94926 8.72521 6.18561 7.58695 7.28323L7.50836 7.35967C5.97191 8.85397 4.81321 9.98087 4.85306 12.1325L4.85313 12.1362H4.85309C4.85309 13.5239 5.38326 14.8277 6.36125 15.8057L6.36365 15.8081L6.36363 15.8082C7.55387 17.0394 9.19573 17.7374 10.9201 17.7374H10.9306L10.9306 17.7376Z" fill="#ffffff"/>
                </svg>
              </div>
              <span className="icon-title">热门</span>
            </a>
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
              <div id="channel-entry-more" className="channel-entry-more__link">
                <span>更多</span>
                <svg width="10" height="10" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg" className="channel-entry-more__link--arrow">
                  <path fillRule="evenodd" clipRule="evenodd" d="M7.50588 3.40623C7.40825 3.3086 7.24996 3.3086 7.15232 3.40623L4.41244 6.14612L1.67255 3.40623C1.57491 3.3086 1.41662 3.3086 1.31899 3.40623C1.22136 3.50386 1.22136 3.66215 1.31899 3.75978L4.11781 6.5586C4.28053 6.72132 4.54434 6.72132 4.70706 6.5586L7.50588 3.75978C7.60351 3.66215 7.60351 3.50386 7.50588 3.40623Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <div className="channel-items__right">
              {/* 专栏 */}
              <a className="channel-link__right" href="//www.bilibili.com/read/home/" style={{letterSpacing:'2px'}} target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="side-icon">
                  <path d="M0 0L24 0L24 24L0 24L0 0z" fill="#F7F7F703"/>
                  <path d="M18 4.8L6 4.8C5.33726 4.8 4.8 5.33726 4.8 6L4.8 18C4.8 18.66276 5.33726 19.2 6 19.2L18 19.2C18.66276 19.2 19.2 18.66276 19.2 18L19.2 6C19.2 5.33726 18.66276 4.8 18 4.8z" fill="#61666D"/>
                  <path d="M4 5.99998C4 4.89541 4.89544 3.99997 6 3.99997L18 3.99997C19.1046 3.99997 20.00004 4.89541 20.00004 5.99998L20.00004 18C20.00004 19.1046 19.1046 19.99992 18 19.99992L6 19.99992C4.89544 19.99992 4 19.1046 4 18L4 5.99998zM6 5.59998C5.77909 5.59998 5.6 5.77907 5.6 5.99998L5.6 18C5.6 18.22092 5.77908 18.39996 6 18.39996L18 18.39996C18.22092 18.39996 18.39996 18.22092 18.39996 18L18.39996 5.99998C18.39996 5.77906 18.22092 5.59998 18 5.59998L6 5.59998z" fill="#61666D"/>
                  <path d="M15.99996 11.19931L8 11.19931C7.55818 11.19931 7.2 11.55749 7.2 11.99932C7.2 12.44112 7.55818 12.79932 8 12.79932L15.99996 12.79932C16.4418 12.79932 16.8 12.44112 16.8 11.99932C16.8 11.55749 16.4418 11.19931 15.99996 11.19931z" fill="#ffffff"/>
                  <path d="M15.99996 8.00062L8 8.00062C7.55818 8.00062 7.2 8.35878 7.2 8.80061C7.2 9.24244 7.55818 9.60061 8 9.60061L15.99996 9.60061C16.4418 9.60061 16.8 9.24244 16.8 8.80061C16.8 8.35878 16.4418 8.00062 15.99996 8.00062z" fill="#ffffff"/>
                  <path d="M11.2 14.4L8 14.4C7.55818 14.4 7.2 14.7582 7.2 15.20004C7.2 15.64188 7.55818 15.99996 8 15.99996L11.2 15.99996C11.64182 15.99996 12 15.64188 12 15.20004C12 14.7582 11.64182 14.4 11.2 14.4z" fill="#ffffff"/>
                </svg>
                <span>专栏</span>
              </a>
              {/* 直播 */}
              <a className="channel-link__right" href="//live.bilibili.com" style={{letterSpacing:'2px'}} target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="side-icon">
                  <path d="M0 0L24 0L24 24L0 24L0 0z" fill="#F7F7F703"/>
                  <path d="M3.99984 6.40068C3.99984 5.95885 4.35802 5.60069 4.79984 5.60069L15.99984 5.60069C16.44168 5.60069 16.79988 5.95885 16.79988 6.40068L16.79988 10.00068L19.9998 7.60068L19.9998 16.80072L16.79988 14.40072L16.79988 17.60064C16.79988 18.04248 16.44168 18.40068 15.99984 18.40068L4.79984 18.40068C4.35802 18.40068 3.99984 18.04248 3.99984 17.60064L3.99984 6.40068z" fill="#61666D"/>
                  <path d="M3.19985 6.40066C3.19985 5.517 3.91619 4.80066 4.79984 4.80066L15.99984 4.80066C16.88352 4.80066 17.5998 5.51701 17.5998 6.40066L17.5998 8.40066L19.5198 6.96066C19.7622 6.77885 20.08656 6.7496 20.35764 6.88512C20.6286 7.02064 20.79984 7.29764 20.79984 7.60066L20.79984 16.8006C20.79984 17.10372 20.6286 17.38068 20.35764 17.51616C20.08656 17.65176 19.7622 17.62248 19.5198 17.44068L17.5998 16.00068L17.5998 17.60064C17.5998 18.48432 16.88352 19.2006 15.99984 19.2006L4.79984 19.2006C3.9162 19.2006 3.19985 18.48432 3.19985 17.60064L3.19985 6.40066zM15.99984 6.40066L4.79984 6.40066L4.79984 17.60064L15.99984 17.60064L15.99984 14.4006C15.99984 14.0976 16.17108 13.82064 16.44204 13.68516C16.71312 13.54956 17.03748 13.57884 17.27988 13.76064L19.19988 15.20064L19.19988 9.20066L17.27988 10.64066C17.03748 10.82246 16.71312 10.85172 16.44204 10.7162C16.17108 10.58069 15.99984 10.30368 15.99984 10.00066L15.99984 6.40066z" fill="#61666D"/>
                  <path d="M12.63456 12.93084L9.47683 15.03612C9.10921 15.28116 8.61252 15.1818 8.36743 14.81424C8.27982 14.68272 8.23307 14.5284 8.23307 14.37048L8.23307 10.16006C8.23307 9.71824 8.59124 9.36006 9.03307 9.36006C9.19102 9.36006 9.34542 9.40681 9.47683 9.49442L12.63456 11.59961C13.00224 11.84468 13.1016 12.3414 12.85644 12.70896C12.79788 12.79692 12.72252 12.87228 12.63456 12.93084z" fill="#ffffff"/>
                </svg>
                <span>直播</span>
              </a>
              {/* 活动 */}
              <a className="channel-link__right" href="//www.bilibili.com/blackboard/era/reward-activity-list-page.html#/list" style={{letterSpacing:'2px'}} target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="side-icon">
                  <path d="M0.89371 0.57143L23.75086 0.57143L23.75086 23.42857L0.89371 23.42857L0.89371 0.57143z" fill="#F7F7F703"/>
                  <path d="M4.70841 5.19295C5.2937 5.03613 5.8953 5.38346 6.05213 5.96874L9.42514 18.55703C9.58198 19.14229 9.23464 19.74389 8.64935 19.90069C8.06406 20.0576 7.46246 19.71029 7.30563 19.12491L3.93262 6.53667C3.77578 5.95138 4.12312 5.34978 4.70841 5.19295z" fill="#61666D"/>
                  <path d="M5.27351 7.30093L10.54989 5.88712L13.46914 6.22925L16.10731 5.52234C16.52366 5.4108 16.94503 5.63347 17.04846 6.01973L18.99543 12.34011C19.09886 12.7264 18.84526 13.12994 18.42903 13.24149L15.79086 13.94834L12.87154 13.60629L7.59518 15.02011L5.27351 7.30093z" fill="#61666D"/>
                  <path d="M4.63459 6.94483C4.7309 6.77202 4.89311 6.64559 5.08421 6.59439L10.36057 5.18058C10.44997 5.15663 10.5431 5.14986 10.63502 5.16063L13.4152 5.48645L15.91806 4.81581C16.66903 4.61457 17.5232 5.00021 17.75086 5.81514L19.6944 12.1248C19.92309 12.97623 19.37406 13.74549 18.61829 13.948L15.98011 14.65486C15.89074 14.67886 15.7976 14.6856 15.70571 14.67486L12.92549 14.34903L7.78448 15.72651C7.40264 15.8288 7.00859 15.60926 6.89474 15.23074L4.57307 7.51155C4.51609 7.3221 4.53829 7.11765 4.63459 6.94483zM6.19111 7.81225L8.09123 14.12983L12.68229 12.89977C12.77166 12.87577 12.8648 12.86903 12.95669 12.87977L15.7368 13.2056L18.23966 12.53497C18.26217 12.52891 18.27554 12.51874 18.28274 12.51109L16.34949 6.23501C16.3488 6.23285 16.34811 6.23067 16.34754 6.22849C16.33783 6.2252 16.32046 6.22243 16.29669 6.22882L13.65851 6.93571C13.56903 6.95967 13.47589 6.96645 13.384 6.95567L10.60387 6.62985L6.19111 7.81225z" fill="#61666D"/>
                </svg>
                <span>活动</span>
              </a>
              {/* 课堂 */}
              <a className="channel-link__right" href="//www.bilibili.com/cheese/?csource=common_hp_channelclass_icon" style={{letterSpacing:'2px'}} target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="side-icon">
                  <path d="M19.33943 4.80001L16.25371 4.80001C14.42514 4.80001 13.39657 5.94287 12.82514 6.85715C12.71086 7.08573 12.25371 7.08573 12.13943 6.85715C11.68229 6.05715 10.65371 4.80001 8.71086 4.80001L5.62514 4.80001C4.82514 4.80001 4.13943 5.48573 4.13943 6.28573L4.13943 16C4.13943 16.8 4.82514 17.48571 5.62514 17.48571L8.71086 17.48571C10.53943 17.48571 11.568 18.74286 12.13943 19.54286C12.25371 19.77143 12.71086 19.77143 12.82514 19.54286C13.28229 18.74286 14.31086 17.48571 16.25371 17.48571L19.33943 17.48571C20.13943 17.48571 20.82514 16.8 20.82514 16L20.82514 6.17144C20.82514 5.37144 20.25371 4.80001 19.33943 4.80001zM11.568 12.57143L10.31086 14.85714L9.05371 12.57143L6.768 11.3143L9.05371 10.05715L10.31086 7.77144L11.568 10.05715L13.85371 11.3143L11.568 12.57143zM16.368 14.28571L15.68229 15.54286L14.88229 14.28571L13.62514 13.6L14.88229 12.91429L15.568 11.65715L16.25371 12.91429L17.51086 13.6L16.368 14.28571z" fill="#61666D"/>
                </svg>
                <span>课堂</span>
              </a>
              {/* 社区中心 */}
              <a className="channel-link__right" href="//www.bilibili.com/blackboard/activity-5zJxM3spoS.html" style={{letterSpacing:'0px'}} target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="side-icon">
                  <path d="M16.07166 7.42781C16.45417 7.42781 16.77086 7.70971 16.82526 8.07712L16.8336 8.1897L16.8336 17.33257C16.8336 17.71509 16.55166 18.03177 16.18423 18.08617L16.07166 18.0944L9.0857 18.09406L6.24303 20.22777C5.80353 20.55737 5.19983 20.32423 5.05576 19.84011L5.03216 19.73269L5.02398 19.61829L5.02285 18.09406L3.88113 18.0944C3.53685 18.0944 3.24591 17.86606 3.15149 17.55257L3.12749 17.44514L3.11922 17.33257L3.11922 8.1897C3.11922 7.80718 3.40114 7.49048 3.76854 7.43607L3.88113 7.42781L16.07166 7.42781zM8.45256 13.52377L6.16685 13.52377L6.05425 13.532C5.68686 13.58651 5.40494 13.9032 5.40494 14.28571C5.40494 14.70651 5.74606 15.04754 6.16685 15.04754L8.45256 15.04754L8.56514 15.03931C8.93255 14.98491 9.21446 14.66823 9.21446 14.28571C9.21446 13.86491 8.87335 13.52377 8.45256 13.52377zM10.73827 10.4769L6.16685 10.4769L6.05425 10.48517C5.68686 10.53958 5.40494 10.85627 5.40494 11.2388C5.40494 11.65959 5.74606 12.00069 6.16685 12.00069L10.73827 12.00069L10.85086 11.99245C11.21826 11.93802 11.50023 11.62134 11.50023 11.2388C11.50023 10.81801 11.15906 10.4769 10.73827 10.4769z" fill="#61666D"/>
                  <path d="M19.11943 4.38093L8.53291 4.38093C8.11213 4.38093 7.77102 4.72205 7.77102 5.14283L7.77102 6.62781L16.07166 6.62781C16.95534 6.62781 17.6716 7.34415 17.6716 8.22781L17.6716 16.27406L19.11943 16.27406C19.54023 16.27406 19.88137 15.93292 19.88137 15.51212L19.88137 5.14283C19.88137 4.72205 19.54023 4.38093 19.11943 4.38093z" fill="#61666D"/>
                </svg>
                <span>社区中心</span>
              </a>
              {/* 新歌热榜 */}
              <a className="channel-link__right" href="//music.bilibili.com/pc/music-center/" style={{letterSpacing:'0px'}} target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="side-icon">
                  <path d="M18.16229 5.52378C19.36731 5.52378 20.3544 6.45621 20.44171 7.63891L20.44789 7.8095L20.44789 16.95234C20.44789 18.15737 19.51554 19.14446 18.33291 19.23177L18.16229 19.23806L5.97181 19.23806C4.7668 19.23806 3.77961 18.3056 3.69235 17.12297L3.68609 16.95234L3.68609 7.8095C3.68609 6.60451 4.61851 5.61731 5.80121 5.53006L5.97181 5.52378L18.16229 5.52378zM14.68914 7.34128C14.24057 7.07799 13.64914 7.33809 13.55577 7.86781L12.34663 12.40594C11.96057 12.05474 11.47371 11.80491 10.92165 11.70758C9.36766 11.43357 7.88577 12.4712 7.61177 14.02514C7.33776 15.5792 8.37538 17.06103 9.92936 17.33509L10.07949 17.35749C11.57771 17.5416 12.97406 16.52126 13.2392 15.01749L14.84069 9.35157L15.90011 10.14427L15.97429 10.19341C16.30411 10.38517 16.73257 10.30351 16.96663 9.99065C17.21863 9.65373 17.14994 9.17624 16.81303 8.92416L14.76251 7.39006L14.68914 7.34128z" fill="#61666D"/>
                </svg>
                <span>新歌热榜</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
