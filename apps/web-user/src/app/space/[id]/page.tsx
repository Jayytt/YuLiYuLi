import Header from '@/components/Header';
import SpaceHeader from '@/components/space/SpaceHeader';
import SpaceNavBar from '@/components/space/SpaceNavBar';
import SpaceVideoCard from '@/components/space/SpaceVideoCard';
import SpaceSidebar from '@/components/space/SpaceSidebar';

// 模拟数据（后端未启动时使用）
const MOCK_USER = {
  id: 1,
  nickname: 'YuLiYuLi',
  avatar: '',
  bio: '这个人很懒，什么都没有留下~',
  level: 5,
  following: 128,
  follower: 2580,
  gender: 0,
  createdAt: '2024-01-15T00:00:00Z',
};

const MOCK_VIDEOS = [
  { id: 1, title: '【4K】超治愈！日本京都樱花季漫步旅拍 | 春日限定', coverUrl: '', viewCount: 125800, danmakuCount: 3200, duration: 485, createdAt: '2024-12-01T10:00:00Z' },
  { id: 2, title: '手把手教你从零搭建React项目，前端入门必看！', coverUrl: '', viewCount: 89200, danmakuCount: 1500, duration: 1200, createdAt: '2024-11-28T08:00:00Z' },
  { id: 3, title: '挑战一周只吃食堂！大学生省钱美食合集', coverUrl: '', viewCount: 56700, danmakuCount: 890, duration: 620, createdAt: '2024-11-20T14:00:00Z' },
  { id: 4, title: '【钢琴】用钢琴弹奏你最爱的动漫OST合集', coverUrl: '', viewCount: 234000, danmakuCount: 5600, duration: 900, createdAt: '2024-11-15T16:00:00Z' },
  { id: 5, title: '深圳打工人的一天 | Vlog记录真实生活', coverUrl: '', viewCount: 45300, danmakuCount: 720, duration: 540, createdAt: '2024-11-10T12:00:00Z' },
  { id: 6, title: 'AI绘画到底有多强？Midjourney vs Stable Diffusion实测对比', coverUrl: '', viewCount: 198000, danmakuCount: 4100, duration: 780, createdAt: '2024-11-05T09:00:00Z' },
  { id: 7, title: '零基础学Python Day1 - 环境搭建与第一个程序', coverUrl: '', viewCount: 312000, danmakuCount: 8900, duration: 1500, createdAt: '2024-10-28T10:00:00Z' },
  { id: 8, title: '【猫片】我家橘猫的日常，太可爱了！', coverUrl: '', viewCount: 67800, danmakuCount: 2300, duration: 300, createdAt: '2024-10-20T18:00:00Z' },
];

async function getUserInfo(userId: string) {
  try {
    const res = await fetch(`http://localhost:8080/api/user/info/${userId}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

async function getUserVideos(userId: string) {
  try {
    const res = await fetch(`http://localhost:8080/api/video/list?userId=${userId}&page=1&size=30`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function SpacePage({ params }: { params: { id: string } }) {
  const userId = params.id;
  let [user, videos] = await Promise.all([
    getUserInfo(userId),
    getUserVideos(userId),
  ]);

  // 后端未启动时使用模拟数据
  if (!user) {
    user = { ...MOCK_USER, id: Number(userId) || 1 };
  }
  if (!videos || videos.length === 0) {
    videos = MOCK_VIDEOS;
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg3)' }}>
      <Header />

      {/* 空间头部 */}
      <SpaceHeader
        userId={user.id}
        nickname={user.nickname}
        avatar={user.avatar}
        bio={user.bio}
        level={user.level}
        following={user.following || 0}
        follower={user.follower || 0}
        likeCount={0}
        playCount={0}
      />

      {/* 导航栏 */}
      <SpaceNavBar userId={user.id} activeTab="home" />

      {/* 主内容区 */}
      <main className="space-main">
        <div className="space-main__inner">
          {/* 左侧内容 */}
          <div className="space-main__content">
            {/* 投稿视频区 */}
            <section className="space-section">
              <div className="space-section__header">
                <h2 className="space-section__title">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="space-section__icon">
                    <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 7v6l5-3-5-3z" fill="currentColor" />
                  </svg>
                  投稿
                  <span className="space-section__count">{videos.length}</span>
                </h2>
                <div className="space-section__tabs">
                  <button className="space-section__tab space-section__tab--active">最新发布</button>
                  <button className="space-section__tab">最多播放</button>
                  <button className="space-section__tab">最多收藏</button>
                </div>
              </div>

              {videos.length > 0 ? (
                <div className="space-video-grid">
                  {videos.map((video: any) => (
                    <SpaceVideoCard
                      key={video.id}
                      id={video.id}
                      title={video.title}
                      coverUrl={video.coverUrl}
                      viewCount={video.viewCount}
                      danmakuCount={video.danmakuCount}
                      duration={video.duration}
                      createdAt={video.createdAt}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-section__empty">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto mb-3">
                    <rect x="8" y="12" width="48" height="40" rx="4" stroke="var(--text-disabled)" strokeWidth="1.5" />
                    <path d="M24 24v16l14-8-14-8z" stroke="var(--text-disabled)" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                  <p className="text-[14px] text-[var(--text-tertiary)]">还没有投稿视频</p>
                </div>
              )}
            </section>
          </div>

          {/* 右侧边栏 */}
          <div className="space-main__aside">
            <SpaceSidebar
              nickname={user.nickname}
              bio={user.bio}
              level={user.level}
              createdAt={user.createdAt}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
