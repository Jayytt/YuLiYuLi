'use client';

import Link from 'next/link';
import { useState } from 'react';

interface VideoCardProps {
  id: number;
  title: string;
  coverUrl: string;
  userName: string;
  viewCount: number;
  danmakuCount: number;
  duration: number;
  createdAt?: string;
  likeCount?: number;
}

function formatCount(count: number): string {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
}

function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return '· 今天';
  if (days === 1) return '· 昨天';
  if (days < 7) return `· ${days}天前`;
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `· ${month}-${day}`;
}

export default function VideoCard({ id, title, coverUrl, userName, viewCount, danmakuCount, duration, createdAt }: VideoCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [watchLaterAdded, setWatchLaterAdded] = useState(false);
  const [showNoInterest, setShowNoInterest] = useState(false);

  const handleWatchLater = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWatchLaterAdded(true);
    setTimeout(() => setWatchLaterAdded(false), 2000);
  };

  const handleNoInterest = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowNoInterest(true);
  };

  if (showNoInterest) {
    return (
      <div className="bili-video-card is-rcmd" style={{ '--cover-radio': '56.25%' } as React.CSSProperties}>
        <div className="bili-video-card__wrap">
          <div className="bili-video-card__no-interest">
            <div className="no-interest-panel">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="no-interest-panel__icon">
                <circle cx="18" cy="18" r="16" stroke="var(--line_regular)" strokeWidth="1.5" />
                <path d="M12 18h12" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="no-interest-panel__title">将减少此类内容推荐</p>
              <button className="no-interest-panel__undo" onClick={() => setShowNoInterest(false)}>
                撤销
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bili-video-card is-rcmd enable-no-interest"
      style={{ '--cover-radio': '56.25%' } as React.CSSProperties}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="bili-video-card__wrap">
        <Link href={`/video/${id}`} className="bili-video-card__image--link">
          <div className="bili-video-card__image">
            <div className="bili-video-card__image--wrap">
              {coverUrl ? (
                <picture className="v-img bili-video-card__cover">
                  <img src={coverUrl} alt={title} loading="lazy" className="bili-video-card__img" />
                </picture>
              ) : (
                <div className="bili-video-card__cover--placeholder">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="4" y="8" width="40" height="32" rx="3" stroke="var(--graph_weak)" strokeWidth="1.5" />
                    <circle cx="16" cy="18" r="3" fill="var(--graph_weak)" />
                    <path d="M4 32l10-8 5 4 10-10 15 12" stroke="var(--graph_weak)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>

            {/* 稍后再看按钮 - hover时显示 */}
            <div className={`bili-video-card__watch-later${isHovering ? ' visible' : ''}`} onClick={handleWatchLater}>
              {watchLaterAdded ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3.75 9l3.75 3.75 7.5-7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5ZM9.75 5.25C9.75 4.83579 9.41421 4.5 9 4.5C8.58579 4.5 8.25 4.83579 8.25 5.25V9C8.25 9.19891 8.32902 9.38968 8.46967 9.53033L10.7197 11.7803C11.0126 12.0732 11.4874 12.0732 11.7803 11.7803C12.0732 11.4874 12.0732 11.0126 11.7803 10.7197L9.75 8.68934V5.25Z" fill="white" />
                </svg>
              )}
              <span>{watchLaterAdded ? '已添加' : '稍后再看'}</span>
            </div>

            <div className="bili-video-card__mask">
              <div className="bili-video-card__stats">
                <div className="bili-video-card__stats--left">
                  <span className="bili-video-card__stats--item">
                    <svg className="bili-video-card__stats--icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12ZM12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" fill="#ffffff" />
                      <circle cx="12" cy="12" r="2" fill="#ffffff" />
                    </svg>
                    <span className="bili-video-card__stats--text">{formatCount(viewCount)}</span>
                  </span>
                  <span className="bili-video-card__stats--item">
                    <svg className="bili-video-card__stats--icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M2 6H13M2 12H16M2 18H10M18 18C18 19.1046 17.1046 20 16 20C14.8954 20 14 19.1046 14 18C14 16.8954 14.8954 16 16 16C17.1046 16 18 16.8954 18 18Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="bili-video-card__stats--text">{formatCount(danmakuCount)}</span>
                  </span>
                </div>
                {duration > 0 && (
                  <span className="bili-video-card__stats__duration">{formatDuration(duration)}</span>
                )}
              </div>
            </div>
          </div>
        </Link>

        <div className="bili-video-card__info">
          <div className="bili-video-card__info--right">
            {/* 不感兴趣按钮 - hover时显示 */}
            <div
              className={`bili-video-card__info--no-interest${isHovering ? ' visible' : ''}`}
              onClick={handleNoInterest}
              title="不感兴趣"
            >
              <svg className="bili-video-card__info--no-interest--icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" stroke="var(--text3)" strokeWidth="1.2" />
                <path d="M6 9h6" stroke="var(--text3)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="bili-video-card__info--tit" title={title}>
              <Link href={`/video/${id}`}>{title}</Link>
            </h3>
            <div className="bili-video-card__info--bottom">
              <Link href={`/space/${id}`} className="bili-video-card__info--owner">
                <svg className="bili-video-card__info--owner__up" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 4a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm0 14.5a7.5 7.5 0 01-6-2.94c.03-1.98 4-3.06 6-3.06s5.97 1.08 6 3.06A7.5 7.5 0 0112 20.5z" fill="var(--text4)" />
                </svg>
                <span className="bili-video-card__info--author" title={userName}>{userName}</span>
                {createdAt && (
                  <span className="bili-video-card__info--date">{formatDate(createdAt)}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
