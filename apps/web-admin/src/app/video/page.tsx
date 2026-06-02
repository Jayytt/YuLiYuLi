'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Video {
  id: number;
  title: string;
  username: string;
  status: number;
  createdAt: string;
}

const statusLabels: Record<number, { text: string; color: string }> = {
  0: { text: '待审核', color: 'bg-yellow-100 text-yellow-700' },
  1: { text: '已发布', color: 'bg-green-100 text-green-700' },
  2: { text: '已拒绝', color: 'bg-red-100 text-red-700' },
};

const tabs = [
  { label: '全部', value: undefined },
  { label: '待审核', value: 0 },
  { label: '已发布', value: 1 },
  { label: '已拒绝', value: 2 },
];

export default function VideoPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(0);

  const fetchVideos = () => {
    setLoading(true);
    const params: any = { page, size: 10 };
    if (statusFilter !== undefined) params.status = statusFilter;
    api
      .get('/admin/video/list', { params })
      .then((res: any) => {
        setVideos(res.data?.content || res.content || []);
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVideos();
  }, [statusFilter, page]);

  const handleAudit = (id: number, status: number) => {
    api
      .post('/admin/video/audit', { id, status })
      .then(() => fetchVideos())
      .catch(() => alert('操作失败'));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-admin-border">
      <div className="p-4 border-b border-admin-border">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(0);
              }}
              className={`px-4 py-1.5 text-sm rounded transition-colors ${
                statusFilter === tab.value
                  ? 'bg-admin-primary text-white'
                  : 'bg-gray-100 text-admin-text-secondary hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="p-8 text-center text-admin-text-secondary">加载中...</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-admin-border text-left text-sm text-admin-text-secondary">
              <th className="px-4 py-3">标题</th>
              <th className="px-4 py-3">UP主</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">上传时间</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id} className="border-b border-admin-border last:border-b-0">
                <td className="px-4 py-3 text-sm">{video.title}</td>
                <td className="px-4 py-3 text-sm">{video.username}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs rounded ${
                      statusLabels[video.status]?.color || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {statusLabels[video.status]?.text || '未知'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-admin-text-secondary">
                  {video.createdAt ? new Date(video.createdAt).toLocaleString() : '-'}
                </td>
                <td className="px-4 py-3">
                  {video.status === 0 && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAudit(video.id, 1)}
                        className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        通过
                      </button>
                      <button
                        onClick={() => handleAudit(video.id, 2)}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        拒绝
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {videos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-admin-text-secondary">
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <div className="p-4 flex justify-end gap-2">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 text-sm border border-admin-border rounded disabled:opacity-50"
        >
          上一页
        </button>
        <span className="px-3 py-1 text-sm text-admin-text-secondary">第 {page + 1} 页</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 text-sm border border-admin-border rounded"
        >
          下一页
        </button>
      </div>
    </div>
  );
}
