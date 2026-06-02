'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Report {
  id: number;
  reporterId: number;
  targetType: string;
  targetId: number;
  reason: string;
  status: number;
  createdAt: string;
}

const statusLabels: Record<number, { text: string; color: string }> = {
  0: { text: '待处理', color: 'bg-yellow-100 text-yellow-700' },
  1: { text: '已忽略', color: 'bg-gray-100 text-gray-700' },
  2: { text: '已警告', color: 'bg-orange-100 text-orange-700' },
  3: { text: '已删除', color: 'bg-red-100 text-red-700' },
  4: { text: '已封禁', color: 'bg-red-100 text-red-700' },
};

const statusTabs = [
  { label: '全部', value: undefined },
  { label: '待处理', value: 0 },
  { label: '已忽略', value: 1 },
  { label: '已警告', value: 2 },
  { label: '已删除', value: 3 },
  { label: '已封禁', value: 4 },
];

export default function ReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(0);

  const fetchReports = () => {
    setLoading(true);
    const params: any = { page, size: 10 };
    if (statusFilter !== undefined) params.status = statusFilter;
    api
      .get('/admin/report', { params })
      .then((res: any) => {
        setReports(res.data?.content || res.content || []);
      })
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, page]);

  const handleAction = (id: number, action: number) => {
    api
      .post('/admin/report/handle', { id, action })
      .then(() => fetchReports())
      .catch(() => alert('操作失败'));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-admin-border">
      <div className="p-4 border-b border-admin-border">
        <div className="flex gap-2 flex-wrap">
          {statusTabs.map((tab) => (
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
              <th className="px-4 py-3">举报人ID</th>
              <th className="px-4 py-3">目标类型</th>
              <th className="px-4 py-3">原因</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">举报时间</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b border-admin-border last:border-b-0">
                <td className="px-4 py-3 text-sm">{report.reporterId}</td>
                <td className="px-4 py-3 text-sm">{report.targetType}</td>
                <td className="px-4 py-3 text-sm max-w-xs truncate">{report.reason}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs rounded ${
                      statusLabels[report.status]?.color || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {statusLabels[report.status]?.text || '未知'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-admin-text-secondary">
                  {report.createdAt ? new Date(report.createdAt).toLocaleString() : '-'}
                </td>
                <td className="px-4 py-3">
                  {report.status === 0 && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleAction(report.id, 1)}
                        className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        忽略
                      </button>
                      <button
                        onClick={() => handleAction(report.id, 2)}
                        className="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
                      >
                        警告
                      </button>
                      <button
                        onClick={() => handleAction(report.id, 3)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        删除
                      </button>
                      <button
                        onClick={() => handleAction(report.id, 4)}
                        className="px-2 py-1 text-xs bg-red-700 text-white rounded hover:bg-red-800"
                      >
                        封禁
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-admin-text-secondary">
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
