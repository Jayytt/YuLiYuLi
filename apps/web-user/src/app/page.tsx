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
  { label: '推荐', icon: '🔥', active: true },
  { label: '热门', icon: '📺' },
  { label: '追番', icon: '🌸' },
  { label: '直播', icon: '📡' },
  { label: '动画', icon: '🎨' },
  { label: '游戏', icon: '🎮' },
  { label: '鬼畜', icon: '👻' },
  { label: '音乐', icon: '🎵' },
  { label: '舞蹈', icon: '💃' },
  { label: '影视', icon: '🎬' },
  { label: '娱乐', icon: '🎪' },
  { label: '知识', icon: '📚' },
  { label: '科技', icon: '💻' },
  { label: '资讯', icon: '📰' },
  { label: '美食', icon: '🍜' },
  { label: '生活', icon: '🏠' },
  { label: '汽车', icon: '🚗' },
  { label: '时尚', icon: '👗' },
  { label: '运动', icon: '⚽' },
  { label: '动物圈', icon: '🐱' },
];

export default async function Home() {
  const videos = await getVideos();

  return (
    <div className="min-h-screen bg-[#f1f2f3]">
      <Header />
      <main className="max-w-[1400px] mx-auto px-5 pt-4 pb-10">
        {/* Banner 区域 */}
        <div className="mb-4 rounded-lg overflow-hidden relative" style={{ height: '220px' }}>
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f7797d 100%)',
            }}
          >
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-2">YuLiYuLi</h2>
              <p className="text-white/80 text-sm">你感兴趣的视频都在这里</p>
            </div>
          </div>
          {/* Banner 底部指示器 */}
          <div className="absolute bottom-3 right-4 flex gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`block rounded-full transition-all ${
                  i === 0
                    ? 'w-4 h-2 bg-white'
                    : 'w-2 h-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 分区 Tab 栏 */}
        <div className="mb-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.label}
                className={`flex items-center gap-1.5 px-4 py-[7px] rounded-full text-[13px] whitespace-nowrap transition-all ${
                  cat.active
                    ? 'bg-[#00a1d6] text-white'
                    : 'bg-white text-[#61666d] hover:text-[#00a1d6] hover:bg-[#e3f6fd]'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 视频网格 */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-5 gap-x-4 gap-y-8">
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
                <circle cx="40" cy="40" r="36" stroke="#e3e5e7" strokeWidth="2" />
                <path d="M30 35c0-2 1.5-3.5 3.5-3.5h13c2 0 3.5 1.5 3.5 3.5v10c0 2-1.5 3.5-3.5 3.5h-13c-2 0-3.5-1.5-3.5-3.5V35z" stroke="#c9ccd0" strokeWidth="1.5" />
                <path d="M36 32v-4c0-1 .5-1.5 1-1.5h6c.5 0 1 .5 1 1.5v4" stroke="#c9ccd0" strokeWidth="1.5" />
                <circle cx="40" cy="40" r="3" fill="#c9ccd0" />
              </svg>
            </div>
            <p className="text-[15px] text-[#9499a0] mb-1">还没有视频内容</p>
            <p className="text-[13px] text-[#c9ccd0]">启动后端服务并上传视频后，这里将显示视频列表</p>
          </div>
        )}
      </main>

      {/* 回到顶部 */}
      <button
        className="fixed bottom-8 right-8 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
        title="回到顶部"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 13V3M3 7l5-5 5 5" stroke="#61666d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
