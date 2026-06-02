'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface SiteConfig {
  site_name: string;
  site_description: string;
  upload_max_size: number;
  upload_allowed_formats: string;
}

export default function SettingsPage() {
  const [config, setConfig] = useState<SiteConfig>({
    site_name: '',
    site_description: '',
    upload_max_size: 0,
    upload_allowed_formats: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api
      .get('/config/site')
      .then((res: any) => {
        const data = res.data || res;
        setConfig({
          site_name: data.site_name || '',
          site_description: data.site_description || '',
          upload_max_size: data.upload_max_size || 0,
          upload_allowed_formats: data.upload_allowed_formats || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = () => {
    setSaving(true);
    setMessage('');
    api
      .put('/config/site', config)
      .then(() => setMessage('保存成功'))
      .catch(() => setMessage('保存失败'))
      .finally(() => setSaving(false));
  };

  if (loading) {
    return <div className="text-center py-20 text-admin-text-secondary">加载中...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-admin-border p-6 max-w-2xl">
      <h3 className="text-lg font-semibold text-admin-text mb-6">站点配置</h3>
      {message && (
        <div
          className={`mb-4 p-3 text-sm rounded ${
            message.includes('成功') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {message}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-admin-text mb-1">站点名称</label>
          <input
            type="text"
            value={config.site_name}
            onChange={(e) => setConfig({ ...config, site_name: e.target.value })}
            className="w-full px-3 py-2 border border-admin-border rounded focus:outline-none focus:border-admin-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-admin-text mb-1">站点描述</label>
          <textarea
            value={config.site_description}
            onChange={(e) => setConfig({ ...config, site_description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-admin-border rounded focus:outline-none focus:border-admin-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-admin-text mb-1">上传大小限制 (MB)</label>
          <input
            type="number"
            value={config.upload_max_size}
            onChange={(e) => setConfig({ ...config, upload_max_size: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-admin-border rounded focus:outline-none focus:border-admin-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-admin-text mb-1">允许的上传格式</label>
          <input
            type="text"
            value={config.upload_allowed_formats}
            onChange={(e) => setConfig({ ...config, upload_allowed_formats: e.target.value })}
            placeholder="mp4,avi,mov"
            className="w-full px-3 py-2 border border-admin-border rounded focus:outline-none focus:border-admin-primary"
          />
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-admin-primary text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  );
}
