'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Category {
  id: number;
  name: string;
  parentId: number | null;
  sortOrder: number;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', parentId: null as number | null, sortOrder: 0 });

  const fetchCategories = () => {
    setLoading(true);
    api
      .get('/video/category/list')
      .then((res: any) => {
        setCategories(res.data || res || []);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: '', parentId: null, sortOrder: 0 });
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, parentId: cat.parentId, sortOrder: cat.sortOrder });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingId) {
      api
        .put(`/video/category/${editingId}`, form)
        .then(() => {
          setShowModal(false);
          fetchCategories();
        })
        .catch(() => alert('更新失败'));
    } else {
      api
        .post('/video/category', form)
        .then(() => {
          setShowModal(false);
          fetchCategories();
        })
        .catch(() => alert('创建失败'));
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('确定删除此分类？')) return;
    api
      .delete(`/video/category/${id}`)
      .then(() => fetchCategories())
      .catch(() => alert('删除失败'));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-admin-border">
      <div className="p-4 border-b border-admin-border flex justify-between items-center">
        <h3 className="font-semibold text-admin-text">分类列表</h3>
        <button
          onClick={openAdd}
          className="px-4 py-1.5 text-sm bg-admin-primary text-white rounded hover:bg-blue-600"
        >
          添加分类
        </button>
      </div>
      {loading ? (
        <div className="p-8 text-center text-admin-text-secondary">加载中...</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-admin-border text-left text-sm text-admin-text-secondary">
              <th className="px-4 py-3">名称</th>
              <th className="px-4 py-3">父分类ID</th>
              <th className="px-4 py-3">排序</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-admin-border last:border-b-0">
                <td className="px-4 py-3 text-sm">{cat.name}</td>
                <td className="px-4 py-3 text-sm">{cat.parentId ?? '-'}</td>
                <td className="px-4 py-3 text-sm">{cat.sortOrder}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(cat)}
                      className="px-3 py-1 text-xs bg-admin-primary text-white rounded hover:bg-blue-600"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-admin-text-secondary">
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
            <h3 className="text-lg font-semibold mb-4">{editingId ? '编辑分类' : '添加分类'}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-admin-text mb-1">名称</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-admin-border rounded focus:outline-none focus:border-admin-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-admin-text mb-1">父分类ID（留空为顶级）</label>
                <input
                  type="number"
                  value={form.parentId ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, parentId: e.target.value ? Number(e.target.value) : null })
                  }
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
