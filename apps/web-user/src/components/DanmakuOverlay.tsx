'use client';

import { useEffect, useState, useRef } from 'react';

interface Danmaku {
  id: string;
  content: string;
  color: number;
  type: number;
  time: number;
}

interface DanmakuOverlayProps {
  videoId: number;
  currentTime: number;
}

export default function DanmakuOverlay({ videoId, currentTime }: DanmakuOverlayProps) {
  const [danmakus, setDanmakus] = useState<Danmaku[]>([]);
  const [visibleDanmakus, setVisibleDanmakus] = useState<Danmaku[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/danmaku/list/${videoId}`)
      .then(res => res.json())
      .then(data => setDanmakus(data.data || []))
      .catch(() => {});
  }, [videoId]);

  useEffect(() => {
    const visible = danmakus.filter(d => {
      const diff = Math.abs(d.time - currentTime);
      return diff < 3;
    });
    setVisibleDanmakus(visible);
  }, [currentTime, danmakus]);

  const getColorHex = (color: number) => {
    return '#' + color.toString(16).padStart(6, '0');
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-10"
    >
      {visibleDanmakus.map((danmaku, index) => (
        <div
          key={danmaku.id}
          className="absolute whitespace-nowrap"
          style={{
            color: getColorHex(danmaku.color),
            top: `${(index * 32) % 280}px`,
            fontSize: '16px',
            fontWeight: '500',
            lineHeight: '1.4',
            textShadow: '1px 1px 2px rgba(0,0,0,0.6), -1px -1px 2px rgba(0,0,0,0.3)',
            animation: 'danmaku-scroll 8s linear forwards',
            willChange: 'transform',
          }}
        >
          {danmaku.content}
        </div>
      ))}
    </div>
  );
}
