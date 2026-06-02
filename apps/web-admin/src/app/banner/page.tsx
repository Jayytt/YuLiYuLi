'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
  status: number;
}

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', imageUrl: '', linkUrl: '', sortOrder: 0 });

  const fetchBanners = () => {
    setLoading(true);
    api
      .get('/config/banner')
      .then((res: any) => {
        setBanners(res.data || res || []);
      })
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ title: '', imageUrl: '', linkUrl: '', sortOrder: 0 });
    setShowModal(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setForm({
      title: banner.title,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      sortOrder: banner.sortOrder,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingId) {
      api
        .put(`/config/banner/${editingId}`, form)
        .then(() => {
          setShowModal(false);
          fetchBanners();
        })
        .catch(() => alert('更新失败'));
    } else {
      api
        .post('/config/banner', form)
        .then(() => {
          setShowModal(false);
          fetchBanners();
        })
        .catch(() => alert('创建失败'));
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('确定删除此Banner？')) return;
    api
      .delete(`/config/banner/${id}`)
      .then(() => fetchBanners())
      .catch(() => alert('删除失败'));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-admin-border">
      <div className="p-4 border-b border-admin-border flex justify-between items-center">
        <h3 className="font-semibold text-admin-text">Banner列表</h3>
        <button
          onClick={openAdd}
          className="px-4 py-1.5 text-sm bg-admin-primary text-white rounded hover:bg-blue-600"
        >
          添加Banner
        </button>
      </div>
      {loading ? (
        <div className="p-8 text-center text-admin-text-secondary">加载中...</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-admin-border text-left text-sm text-admin-text-secondary">
              <th className="px-4 py-3">标题</th>
              <th className="px-4 py-3">图片</th>
              <th className="px-4 py-3">排序</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id} className="border-b border-admin-border last:border-b-0">
                <td className="px-4 py-3 text-sm">{banner.title}</td>
                <td className="px-4 py-3">
                  {banner.imageUrl && (
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-20 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-3 text-sm">{banner.sortOrder}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs rounded ${
                      banner.status === 1
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {banner.status === 1 ? '启用' : '禁用'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(banner)}
                      className="px-3 py-1 text-xs bg-admin-primary text-white rounded hover:bg-blue-600"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-admin-text-secondary">
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editingId ? '编辑Banner' : '添加Banner'}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-admin-text mb-1">标题</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-admin-border rounded focus:outline-none focus:border-admin-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-admin-text mb-1">图片URL</label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-admin-border rounded focus:outline-none focus:border-admin-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-admin-text mb-1">链接URL</label>
                <input
                  type="text"
                  value={form.linkUrl}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-admin-border rounded focus:outline-none focus:border-admin-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-admin-text mb-1">排序</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-admin-border rounded focus:outline-none focus:border-admin-primary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border border-admin-border rounded hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-admin-primary text-white rounded hover:bg-blue-600"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
