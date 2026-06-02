'use client';

import { useEffect, useState } from 'react';

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
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {visibleDanmakus.map((danmaku, index) => (
        <div
          key={danmaku.id}
          className="absolute whitespace-nowrap text-lg font-bold"
          style={{
            color: getColorHex(danmaku.color),
            top: `${(index * 30) % 300}px`,
            animation: 'danmaku-scroll 8s linear forwards',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {danmaku.content}
        </div>
      ))}
      <style jsx>{`
        @keyframes danmaku-scroll {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
