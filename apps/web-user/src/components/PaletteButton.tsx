'use client';

import { useState, useEffect } from 'react';

export default function PaletteButton() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWatchLaterPanel, setShowWatchLaterPanel] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="palette-btn-wrap">
      {/* 稍后再看入口 */}
      <div className="palette-btn__item" onClick={() => setShowWatchLaterPanel(!showWatchLaterPanel)} title="稍后再看">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM10.75 6C10.75 5.58579 10.4142 5.25 10 5.25C9.58579 5.25 9.25 5.58579 9.25 6V10C9.25 10.1989 9.32902 10.3897 9.46967 10.5303L11.7197 12.7803C12.0126 13.0732 12.4874 13.0732 12.7803 12.7803C13.0732 12.4874 13.0732 12.0126 12.7803 11.7197L10.75 9.68934V6Z" fill="currentColor"/>
        </svg>
        {showWatchLaterPanel && (
          <div className="palette-btn__watch-later-panel">
            <div className="watch-later-panel__header">
              <span>稍后再看</span>
            </div>
            <div className="watch-later-panel__empty">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="var(--line_regular)" strokeWidth="1.5" />
                <path d="M24 16v8l4 4" stroke="var(--text4)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p>还没有稍后再看的内容</p>
            </div>
          </div>
        )}
      </div>

      {/* 回到顶部 */}
      <div
        className={`palette-btn__item palette-btn__scroll-top${showScrollTop ? ' visible' : ''}`}
        onClick={scrollToTop}
        title="回到顶部"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 16V4M5 8l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
