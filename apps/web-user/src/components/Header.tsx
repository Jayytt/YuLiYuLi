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
  { label: '番剧', href: '//www.bilibili.com/anime/' },
  { label: '电影', href: '//www.bilibili.com/movie/' },
  { label: '国创', href: '//www.bilibili.com/guochuang/' },
  { label: '电视剧', href: '//www.bilibili.com/tv/' },
  { label: '综艺', href: '//www.bilibili.com/variety/' },
  { label: '纪录片', href: '//www.bilibili.com/documentary/' },
  { label: '动画', href: '//www.bilibili.com/v/douga/' },
  { label: '游戏', href: '//www.bilibili.com/v/game/' },
  { label: '鬼畜', href: '//www.bilibili.com/v/kichiku/' },
  { label: '音乐', href: '//www.bilibili.com/v/music' },
  { label: '舞蹈', href: '//www.bilibili.com/v/dance/' },
  { label: '影视', href: '//www.bilibili.com/v/cinephile' },
  { label: '娱乐', href: '//www.bilibili.com/v/ent/' },
  { label: '知识', href: '//www.bilibili.com/v/knowledge/' },
  { label: '科技', href: '//www.bilibili.com/v/tech/' },
  { label: '资讯', href: '//www.bilibili.com/v/information/' },
  { label: '美食', href: '//www.bilibili.com/v/food' },
  { label: '生活', href: '//www.bilibili.com/v/life' },
  { label: '汽车', href: '//www.bilibili.com/v/car' },
  { label: '时尚', href: '//www.bilibili.com/v/fashion' },
  { label: '运动', href: '//www.bilibili.com/v/sports' },
  { label: '动物圈', href: '//www.bilibili.com/v/animal' },
  { label: 'VLOG', href: '//www.bilibili.com/v/life/daily/?tag=530003', spacing: '0px' },
  { label: '搞笑', href: '//www.bilibili.com/v/life/funny' },
  { label: '单机游戏', href: '//www.bilibili.com/v/game/stand_alone', spacing: '0px' },
  { label: '虚拟UP主', href: '//www.bilibili.com/v/virtual', spacing: '0px' },
  { label: '公益', href: '//love.bilibili.com' },
  { label: '公开课', href: '//www.bilibili.com/mooc' },
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
          <li className="right-entry-item v-popover-wrap">
              <div className="right-entry__outside go-login-btn">
                <div className="header-login-entry">
                  <span>登录</span>
                </div>
              </div>
          </li>
          <li className="right-entry-item v-popover-wrap">
              <a href="//account.bilibili.com/big" target="_blank" className="right-entry__outside right-entry--vip">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="right-entry-icon">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10 1C5.02955 1 1 5.02955 1 10C1 14.9705 5.02955 19 10 19C14.9705 19 19 14.9705 19 10C19 5.02955 14.9705 1 10 1ZM10.0006 2.63614C14.0612 2.63614 17.3642 5.93996 17.3642 9.99977C17.3642 14.0604 14.0612 17.3634 10.0006 17.3634C5.93996 17.3634 2.63696 14.0604 2.63696 9.99977C2.63696 5.93996 5.93996 2.63614 10.0006 2.63614Z" fill="currentColor"/>
                  <path d="M13.1381 8.05573V8.05331H10.7706C10.7859 7.8643 10.7948 7.67286 10.7948 7.47981C10.7948 7.26414 10.7843 7.05008 10.7649 6.83926C10.7658 6.82552 10.7674 6.81179 10.7674 6.79725V6.79483C10.7674 6.35541 10.4111 6 9.97254 6C9.53312 6 9.17771 6.35622 9.17771 6.79483V6.79725C9.17771 6.85137 9.18336 6.90468 9.19386 6.95557L9.18255 6.95719C9.19871 7.12924 9.20759 7.30291 9.20759 7.479C9.20759 7.67286 9.19709 7.8643 9.17771 8.0525H6.74313V8.05573C6.32876 8.08239 6 8.42649 6 8.84814V8.85057C6 9.28998 6.33683 9.64216 6.77544 9.64216C6.80937 9.64216 6.8441 9.64378 6.89903 9.64297L8.7601 9.63893C8.28837 10.7294 7.47011 11.6341 6.44507 12.2149C6.44023 12.2173 6.43619 12.2197 6.43134 12.2229C6.42003 12.2294 6.40953 12.2359 6.39822 12.2423L6.39903 12.2431C6.17528 12.3837 6.02585 12.6325 6.02585 12.916V12.9184C6.02585 13.3578 6.38207 13.7132 6.82068 13.7132C6.99111 13.7132 7.14782 13.6591 7.27706 13.5687C8.7706 12.706 9.9168 11.3094 10.4556 9.64055H13.0105C13.0517 9.64136 13.1131 9.63893 13.1131 9.63893C13.5905 9.62924 13.9039 9.2916 13.9039 8.85299V8.85057C13.9047 8.42003 13.5638 8.07108 13.1381 8.05573Z" fill="currentColor"/>
                  <path d="M13.7731 12.5388C13.7715 12.5356 13.7691 12.5331 13.7674 12.5307C13.74 12.4814 13.7077 12.4362 13.6713 12.3942C13.1584 11.6672 12.513 11.0412 11.7674 10.5541L11.7666 10.555C11.6366 10.4613 11.4766 10.4055 11.3046 10.4055C10.8652 10.4055 10.5098 10.7617 10.5098 11.2003V11.2028C10.5098 11.5033 10.677 11.765 10.9233 11.8999C11.5615 12.3215 12.0825 12.8045 12.4944 13.4499L12.5372 13.5041C12.6786 13.6333 12.866 13.7133 13.0728 13.7133C13.5122 13.7133 13.8676 13.3571 13.8676 12.9184V12.916C13.8668 12.7795 13.8329 12.6511 13.7731 12.5388Z" fill="currentColor"/>
                </svg>
                <span className="right-entry-text">大会员</span>
              </a>
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
          <li className="right-entry-item right-entry-item--upload v-popover-wrap">
              <div className="header-upload-entry">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="header-upload-entry__icon">
                  <path d="M12.0824 10H14.1412C15.0508 10 15.7882 10.7374 15.7882 11.6471V12.8824C15.7882 13.792 15.0508 14.5294 14.1412 14.5294H3.84707C2.93743 14.5294 2.20001 13.792 2.20001 12.8824V11.6471C2.20001 10.7374 2.93743 10 3.84707 10H5.90589" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.99413 11.2353L8.99413 3.82353" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.0823 6.29413L8.9941 3.20589L5.90587 6.29413" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="header-upload-entry__text">投稿</span>
              </div>
          </li>
        </ul>
      </div>

      {/* Banner横幅 */}
      <div className="bili-header__banner">
        <div className="header-banner__inner">
          <a href="//www.bilibili.com" className="inner-logo">
            <img
              className="logo-img"
              alt="B站 b站"
              width={162}
              height={78}
              src="//i0.hdslb.com/bfs/archive/c8fd97a40bf79f03e7b76cbc87236f612caef7b2.png"
            />
          </a>
        </div>
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
                <a
                  key={link.label}
                  href={link.href}
                  className="channel-link"
                  style={{ letterSpacing: link.spacing || '2px' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="channel-items__right">
              {/* 专栏 */}
              <a className="channel-link__right" href="//www.bilibili.com/read/home" style={{letterSpacing:'2px'}} target="_blank">
                <svg t="1642646834655" className="side-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                  <path d="M810.6496 153.6C843.6736 153.6 870.4 180.3264 870.4 213.3504v597.2992c0 33.024-26.7264 59.7504-59.7504 59.7504H213.3504A59.7504 59.7504 0 0 1 153.6 810.6496V213.3504C153.6 180.3264 180.3264 153.6 213.3504 153.6z m-332.8 460.8H341.3504a34.1504 34.1504 0 0 0 0 68.2496h136.4992a34.1504 34.1504 0 1 0 0-68.2496z m204.8-136.6016H341.3504a34.1504 34.1504 0 0 0 0 68.2496h341.2992a34.1504 34.1504 0 0 0 0-68.2496z m0-136.3968H341.3504a34.1504 34.1504 0 0 0 0 68.2496h341.2992a34.1504 34.1504 0 1 0 0-68.2496z" />
                </svg>
                <span>专栏</span>
              </a>
              {/* 直播 */}
              <a className="channel-link__right" href="//live.bilibili.com" style={{letterSpacing:'2px'}} target="_blank">
                <svg t="1642646710703" className="side-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                  <path d="M682.6496 204.8512c35.4816 0 64.6656 27.136 67.9424 61.696l0.3072 6.6048V358.4l81.92-61.44a34.2016 34.2016 0 0 1 53.248 17.408l1.024 4.7616 0.3584 5.12v392.5504a34.1504 34.1504 0 0 1-50.2784 30.1056l-4.352-2.7648-81.92-61.4912v68.3008c0 33.1264-23.552 60.7232-54.8352 66.9696l-6.8608 1.024-6.5536 0.256H204.8a68.2496 68.2496 0 0 1-67.9936-61.696l-0.3072-6.5536V273.152c0-35.4816 27.136-64.6656 61.696-67.9936L204.8 204.8512h477.8496zM385.3824 389.12a34.1504 34.1504 0 0 0-34.0992 34.1504v179.6096a34.1504 34.1504 0 0 0 53.0432 28.416l134.7584-89.8048a34.1504 34.1504 0 0 0 0-56.832L404.3264 394.8544a34.1504 34.1504 0 0 0-18.944-5.7344z" />
                </svg>
                <span>直播</span>
              </a>
              {/* 活动 */}
              <a className="channel-link__right" href="//www.bilibili.com/blackboard/activity-list.html?" style={{letterSpacing:'2px'}} target="_blank">
                <svg t="1642646844599" className="side-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                  <path d="M772.4544 229.2736l2.048 6.4512 87.2448 283.136c8.8576 33.1264-10.24 66.56-41.984 78.4384l-6.5536 2.048-118.1696 31.744a32.768 32.768 0 0 1-8.192 1.0752l-4.096-0.2048-124.672-14.6432-193.3824 51.8144 36.6592 136.704a49.152 49.152 0 0 1-93.184 30.8736l-1.792-5.4272L155.2896 267.264a49.152 49.152 0 0 1 93.184-30.8736l1.792 5.4272 4.096 15.36 188.928-50.6368a32.768 32.768 0 0 1 8.1408-1.0752l4.096 0.2048 124.5184 14.592 112.1792-30.0544c33.4336-8.96 68.1984 7.7824 80.2304 39.0144z" />
                </svg>
                <span>活动</span>
              </a>
              {/* 课堂 */}
              <a className="channel-link__right" href="//www.bilibili.com/cheese/?csource=common_hp_channelclass_icon" style={{letterSpacing:'2px'}} target="_blank">
                <svg className="side-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 20 20" xmlSpace="preserve">
                  <g>
                    <path d="M16,3.7h-2.7c-1.6,0-2.5,1-3,1.8c-0.1,0.2-0.5,0.2-0.6,0c-0.4-0.7-1.3-1.8-3-1.8H4c-0.7,0-1.3,0.6-1.3,1.3v8.5c0,0.7,0.6,1.3,1.3,1.3h2.7c1.6,0,2.5,1.1,3,1.8c0.1,0.2,0.5,0.2,0.6,0c0.4-0.7,1.3-1.8,3-1.8H16c0.7,0,1.3-0.6,1.3-1.3V4.9C17.3,4.2,16.8,3.7,16,3.7z M9.2,10.5l-1.1,2l-1.1-2L5,9.4l2-1.1l1.1-2l1.1,2l2,1.1L9.2,10.5z M13.4,12l-0.6,1.1L12.1,12L11,11.4l1.1-0.6l0.6-1.1l0.6,1.1l1.1,0.6L13.4,12z" />
                  </g>
                </svg>
                <span>课堂</span>
              </a>
              {/* 社区中心 */}
              <a className="channel-link__right" href="https://www.bilibili.com/blackboard/activity-5zJxM3spoS.html" style={{letterSpacing:'0px'}} target="_blank">
                <svg t="1642670011510" className="side-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                  <path d="M836.3008 170.6496c17.1008 0 31.2832 12.6464 33.7408 29.0816L870.4 204.8v316.16a34.1504 34.1504 0 0 1-29.0816 33.792l-5.0176 0.3584h-102.4v195.7888a34.1504 34.1504 0 0 1-29.1328 33.792l-5.0176 0.3584H386.7648l-127.3344 95.5392a34.2016 34.2016 0 0 1-53.248-17.3568l-1.024-4.8128-0.3584-5.12-0.0512-68.3008H153.6a34.1504 34.1504 0 0 1-32.6656-24.2176l-1.0752-4.8128-0.4096-5.0688v-409.6c0-17.152 12.6464-31.3344 29.0816-33.792L153.6 307.2h174.2336V204.8c0-17.152 12.6464-31.3344 29.1328-33.792l5.0176-0.3584h474.3168z m-477.9008 409.6H256l-5.0688 0.4096a34.1504 34.1504 0 0 0 0 67.4816l5.0688 0.4096h102.4l5.0688-0.4096A34.1504 34.1504 0 0 0 358.4 580.2496z m102.4-136.4992H256l-5.0688 0.4096a34.1504 34.1504 0 0 0 0 67.4816l5.0688 0.4096h204.8l5.0688-0.4096A34.1504 34.1504 0 0 0 460.8 443.7504z m341.2992-204.8512h-406.016v68.2496h303.616c17.152 0 31.3856 12.6464 33.792 29.1328l0.3584 5.0176v145.4592l68.2496 0.0512V238.8992z" />
                </svg>
                <span>社区中心</span>
              </a>
              {/* 新歌热榜 */}
              <a className="channel-link__right" href="https://music.bilibili.com/pc/music-center/" style={{letterSpacing:'0px'}} target="_blank">
                <svg t="1642669999866" className="side-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                  <path d="M783.36 221.8496a102.4 102.4 0 0 1 102.0928 94.7712l0.3072 7.68v409.6a102.4 102.4 0 0 1-94.72 102.0928l-7.68 0.256H237.2096a102.4 102.4 0 0 1-102.0928-94.72l-0.3072-7.68v-409.6A102.4 102.4 0 0 1 229.5808 222.208l7.68-0.3072H783.36z m-155.5968 81.408a34.1504 34.1504 0 0 0-50.7904 23.6032l-54.1696 203.3152a128 128 0 1 0-108.288 220.8256l6.7584 1.024a128 128 0 0 0 141.5168-104.8576l71.7824-253.7984 47.4624 35.4816 3.2768 2.2016a34.1504 34.1504 0 0 0 37.5808-56.832l-91.8528-68.7616z" />
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
