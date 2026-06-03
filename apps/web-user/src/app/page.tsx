import Header from '@/components/Header';
import VideoCard from '@/components/VideoCard';

async function getVideos() {
  try {
    const res = await fetch('http://localhost:8080/api/video/list?page=1&size=20', {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

const categories = [
  { label: '推荐', active: true },
  { label: '热门' },
  { label: '追番' },
  { label: '直播' },
  { label: '动画' },
  { label: '游戏' },
  { label: '鬼畜' },
  { label: '音乐' },
  { label: '舞蹈' },
  { label: '影视' },
  { label: '娱乐' },
  { label: '知识' },
  { label: '科技' },
  { label: '资讯' },
  { label: '美食' },
  { label: '生活' },
  { label: '汽车' },
  { label: '时尚' },
  { label: '运动' },
  { label: '动物圈' },
  { label: '国创' },
  { label: 'VLOG' },
];

export default async function Home() {
  const videos = await getVideos();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <Header />
      <main className="container-bili pt-4 pb-10">
        {/* Banner 轮播区域 */}
        <div className="mb-4 rounded-[var(--radius-lg)] overflow-hidden relative" style={{ height: '220px' }}>
          <div className="w-full h-full relative">
            {/* Banner 背景 */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #FB7299 0%, #FF9DB5 30%, #66DEFF 70%, #00A1D6 100%)',
              }}
            />
            {/* Banner 内容 */}
            <div className="relative z-10 flex items-center h-full px-10">
              <div>
                <h2 className="text-[28px] font-bold text-white mb-2 drop-shadow-md">
                  YuLiYuLi
                </h2>
                <p className="text-white/90 text-[15px] drop-shadow-sm">
                  你感兴趣的视频都在这里
                </p>
                <button className="mt-4 px-5 py-2 bg-white/20 backdrop-blur-sm text-white text-[13px] rounded-full hover:bg-white/30 transition-colors border border-white/30">
                  立即体验
                </button>
              </div>
            </div>
            {/* Banner 遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
          </div>
          {/* Banner 底部指示器 */}
          <div className="absolute bottom-3 right-4 flex gap-1.5 z-20">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`block rounded-full transition-all cursor-pointer ${
                  i === 0
                    ? 'w-5 h-[6px] bg-white'
                    : 'w-[6px] h-[6px] bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
          {/* Banner 左右箭头 */}
          <button className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* 分区 Tab 栏 */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.label}
                className={`px-4 py-[7px] rounded-full text-[13px] whitespace-nowrap transition-all font-medium ${
                  cat.active
                    ? 'bg-[var(--brand-blue)] text-white shadow-sm'
                    : 'bg-white text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-active)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 视频网格 */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-5 gap-x-4 gap-y-6">
            {videos.map((video: any) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                coverUrl={video.coverUrl}
                userName={video.userName}
                viewCount={video.viewCount}
                danmakuCount={video.danmakuCount}
                duration={video.duration}
                createdAt={video.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="mb-4">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto">
                <circle cx="40" cy="40" r="36" stroke="var(--border-color)" strokeWidth="2" />
                <path
                  d="M30 35c0-2 1.5-3.5 3.5-3.5h13c2 0 3.5 1.5 3.5 3.5v10c0 2-1.5 3.5-3.5 3.5h-13c-2 0-3.5-1.5-3.5-3.5V35z"
                  stroke="var(--text-disabled)"
                  strokeWidth="1.5"
                />
                <path d="M36 32v-4c0-1 .5-1.5 1-1.5h6c.5 0 1 .5 1 1.5v4" stroke="var(--text-disabled)" strokeWidth="1.5" />
                <circle cx="40" cy="40" r="3" fill="var(--text-disabled)" />
              </svg>
            </div>
            <p className="text-[15px] text-[var(--text-tertiary)] mb-1">还没有视频内容</p>
            <p className="text-[13px] text-[var(--text-disabled)]">启动后端服务并上传视频后，这里将显示视频列表</p>
          </div>
        )}
      </main>

      {/* 回到顶部 */}
      <button
        className="fixed bottom-8 right-8 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:shadow-lg transition-all z-40"
        style={{ boxShadow: 'var(--shadow-card)' }}
        title="回到顶部"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 13V3M3 7l5-5 5 5" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
