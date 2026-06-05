'use client';

import Link from 'next/link';
import VideoCard from './VideoCard';

interface FloorVideo {
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

interface FloorCardProps {
  title: string;
  icon: string;
  color: string;
  videos: FloorVideo[];
}

export default function FloorCard({ title, icon, color, videos }: FloorCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'anime':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14.5c-3.58 0-6.5-2.92-6.5-6.5S6.42 3.5 10 3.5s6.5 2.92 6.5 6.5-2.92 6.5-6.5 6.5z" fill={color} />
            <path d="M8 7l5 3-5 3V7z" fill={color} />
          </svg>
        );
      case 'guochuang':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14.5c-3.58 0-6.5-2.92-6.5-6.5S6.42 3.5 10 3.5s6.5 2.92 6.5 6.5-2.92 6.5-6.5 6.5z" fill={color} />
            <path d="M7 8h6v4H7V8z" fill={color} />
          </svg>
        );
      case 'variety':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14.5c-3.58 0-6.5-2.92-6.5-6.5S6.42 3.5 10 3.5s6.5 2.92 6.5 6.5-2.92 6.5-6.5 6.5z" fill={color} />
            <circle cx="8" cy="9" r="1.5" fill={color} />
            <circle cx="12" cy="9" r="1.5" fill={color} />
            <path d="M7 13s1.5 2 3 2 3-2 3-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14.5c-3.58 0-6.5-2.92-6.5-6.5S6.42 3.5 10 3.5s6.5 2.92 6.5 6.5-2.92 6.5-6.5 6.5z" fill={color} />
          </svg>
        );
    }
  };

  return (
    <div className="recommended-container_floor-aside">
      <div className="floor-card">
        <div className="floor-card__header">
          <div className="floor-card__title-wrap">
            <span className="floor-card__icon" style={{ color }}>
              {getIcon()}
            </span>
            <h3 className="floor-card__title">{title}</h3>
          </div>
          <Link href={`/category/${icon}`} className="floor-card__more">
            更多
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
        <div className="floor-card__grid">
          {videos.map((video) => (
            <div key={video.id} className="floor-card__item">
              <VideoCard
                id={video.id}
                title={video.title}
                coverUrl={video.coverUrl}
                userName={video.userName}
                viewCount={video.viewCount}
                danmakuCount={video.danmakuCount}
                duration={video.duration}
                createdAt={video.createdAt}
                likeCount={video.likeCount}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
