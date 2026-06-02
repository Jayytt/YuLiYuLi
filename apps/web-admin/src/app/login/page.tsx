'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res: any = await api.post('/admin/login', { username, password });
      const token = res.data?.token || res.token;
      if (token) {
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_username', username);
        router.push('/');
      } else {
        setError('登录失败：未获取到token');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-bg">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-admin-text mb-8">
          YuLiYuLi Admin
        </h1>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-admin-text mb-1">
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-admin-border rounded focus:outline-none focus:border-admin-primary"
              placeholder="请输入用户名"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-admin-text mb-1">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-admin-border rounded focus:outline-none focus:border-admin-primary"
              placeholder="请输入密码"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-admin-primary text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
}
