'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface User {
  id: number;
  username: string;
  nickname: string;
  level: number;
  status: number;
  createdAt: string;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);

  const fetchUsers = () => {
    setLoading(true);
    const params: any = { page, size: 10 };
    if (keyword) params.keyword = keyword;
    api
      .get('/admin/user/list', { params })
      .then((res: any) => {
        setUsers(res.data?.content || res.content || []);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    fetchUsers();
  };

  const handleToggleStatus = (id: number) => {
    api
      .post('/admin/user/toggle-status', { id })
      .then(() => fetchUsers())
      .catch(() => alert('操作失败'));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-admin-border">
      <div className="p-4 border-b border-admin-border flex gap-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="搜索用户名/昵称"
          className="px-3 py-1.5 text-sm border border-admin-border rounded focus:outline-none focus:border-admin-primary w-64"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-1.5 text-sm bg-admin-primary text-white rounded hover:bg-blue-600"
        >
          搜索
        </button>
      </div>
      {loading ? (
        <div className="p-8 text-center text-admin-text-secondary">加载中...</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-admin-border text-left text-sm text-admin-text-secondary">
              <th className="px-4 py-3">用户名</th>
              <th className="px-4 py-3">昵称</th>
              <th className="px-4 py-3">等级</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">注册时间</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-admin-border last:border-b-0">
                <td className="px-4 py-3 text-sm">{user.username}</td>
                <td className="px-4 py-3 text-sm">{user.nickname}</td>
                <td className="px-4 py-3 text-sm">Lv.{user.level}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs rounded ${
                      user.status === 1
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.status === 1 ? '正常' : '封禁'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-admin-text-secondary">
                  {user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className={`px-3 py-1 text-xs rounded text-white ${
                      user.status === 1
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {user.status === 1 ? '封禁' : '解封'}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
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
