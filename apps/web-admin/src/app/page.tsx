'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface DashboardStats {
  newUsers: number;
  newVideos: number;
  totalViews: number;
  totalComments: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/statistics/dashboard')
      .then((res: any) => {
        setStats(res.data || res);
      })
      .catch(() => {
        setStats({ newUsers: 0, newVideos: 0, totalViews: 0, totalComments: 0 });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-admin-text-secondary">加载中...</div>;
  }

  const cards = [
    { label: '新增用户', value: stats?.newUsers ?? 0, color: 'bg-blue-500' },
    { label: '新增视频', value: stats?.newVideos ?? 0, color: 'bg-green-500' },
    { label: '总播放量', value: stats?.totalViews ?? 0, color: 'bg-orange-500' },
    { label: '总评论数', value: stats?.totalComments ?? 0, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-lg shadow-sm p-6 border border-admin-border"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                {card.label.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-admin-text-secondary">{card.label}</p>
                <p className="text-2xl font-bold text-admin-text">
                  {card.value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
