'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

interface BannerItem {
  id: number;
  title: string;
  desc: string;
  btnText: string;
  btnLink: string;
  gradient: string;
}

const banners: BannerItem[] = [
  {
    id: 1,
    title: 'YuLiYuLi',
    desc: '你感兴趣的视频都在这里',
    btnText: '立即体验',
    btnLink: '/',
    gradient: 'linear-gradient(135deg, #FF6699 0%, #FF9DB5 30%, #66DEFF 70%, #00AEEC 100%)',
  },
  {
    id: 2,
    title: '新番热播',
    desc: '一月新番开播，追番不迷路',
    btnText: '去看看',
    btnLink: '/category/anime',
    gradient: 'linear-gradient(135deg, #AC6DFF 0%, #DA8FFF 30%, #FF8FBC 70%, #FF6699 100%)',
  },
  {
    id: 3,
    title: '创作激励',
    desc: '分享你的创意，赢取丰厚奖励',
    btnText: '了解详情',
    btnLink: '/',
    gradient: 'linear-gradient(135deg, #0EB350 0%, #88CC24 30%, #FFCC00 70%, #FA9600 100%)',
  },
  {
    id: 4,
    title: '音乐专区',
    desc: '聆听好音乐，发现新世界',
    btnText: '进入专区',
    btnLink: '/category/music',
    gradient: 'linear-gradient(135deg, #6188FF 0%, #8FA8FF 30%, #FFB6C1 70%, #FF6699 100%)',
  },
  {
    id: 5,
    title: '游戏中心',
    desc: '热门游戏实况，等你来围观',
    btnText: '马上看看',
    btnLink: '/category/game',
    gradient: 'linear-gradient(135deg, #14C4BF 0%, #5FD9D6 30%, #87CEEB 70%, #6188FF 100%)',
  },
];

export default function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + banners.length) % banners.length);
  }, []);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (isHovering) return;
    const timer = setInterval(goNext, 4000);
    return () => clearInterval(timer);
  }, [isHovering, goNext]);

  return (
    <div
      className="carousel"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="carousel-container">
        <div className="vui_carousel vui_carousel--bottom vui_carousel--show-arrow" style={{ '--duration--time': '0.3s' } as React.CSSProperties}>
          <div
            className="vui_carousel__slides"
            style={{
              '--translate-x-slides': `${-activeIndex * 100}%`,
            } as React.CSSProperties}
            ref={containerRef}
          >
            {banners.map((banner, index) => {
              const isActive = index === activeIndex;
              const isPrev = index === (activeIndex - 1 + banners.length) % banners.length;
              const isNext = index === (activeIndex + 1) % banners.length;
              return (
                <div
                  key={banner.id}
                  className={`vui_carousel__slide${isActive ? ' vui_carousel__slide--active' : ''}${isPrev ? ' vui_carousel__slide--prev' : ''}${isNext ? ' vui_carousel__slide--next' : ''}`}
                >
                  <div className="carousel-area">
                    <div className="carousel-area-img" style={{ background: banner.gradient }}>
                      <Link href={banner.btnLink} className="carousel-item">
                        <h2 className="carousel-item__title">{banner.title}</h2>
                        <p className="carousel-item__desc">{banner.desc}</p>
                        <span className="carousel-item__btn">{banner.btnText}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer: mask + title + dots */}
        <div className="carousel-footer">
          <div className="carousel-footer-mask"></div>
          <div className="carousel-footer-text">
            <div className="carousel-footer-title">
              <Link href={banners[activeIndex].btnLink}>
                <span>{banners[activeIndex].title}</span>
              </Link>
            </div>
          </div>
          <div className="carousel-dots">
            <ul className="carousel-dots-list">
              {banners.map((_, i) => (
                <li
                  key={i}
                  className={`carousel-dots-dot${i === activeIndex ? ' is-active' : ''}`}
                  onClick={() => goTo(i)}
                >
                  <div className="before"></div>
                  <div className="after"></div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Arrows */}
        <div className="carousel-arrows">
          <button onClick={goPrev}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={goNext}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
              <path d="M9 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
