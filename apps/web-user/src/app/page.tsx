import Header from '@/components/Header';
import VideoCard from '@/components/VideoCard';
import VideoCardSkeleton from '@/components/VideoCardSkeleton';
import BannerCarousel from '@/components/BannerCarousel';
import PaletteButton from '@/components/PaletteButton';
import FloorCard from '@/components/FloorCard';

const MOCK_VIDEOS = [
  { id: 1, title: '【4K】超治愈！日本京都樱花季漫步旅拍 | 春日限定', coverUrl: '', userName: '旅行小记', viewCount: 125800, danmakuCount: 3200, duration: 485, createdAt: '2024-12-01T10:00:00Z', likeCount: 8900 },
  { id: 2, title: '手把手教你从零搭建React项目，前端入门必看！', coverUrl: '', userName: 'CodeMaster', viewCount: 89200, danmakuCount: 1500, duration: 1200, createdAt: '2024-11-28T08:00:00Z', likeCount: 5600 },
  { id: 3, title: '挑战一周只吃食堂！大学生省钱美食合集', coverUrl: '', userName: '吃货小王', viewCount: 56700, danmakuCount: 890, duration: 620, createdAt: '2024-11-20T14:00:00Z', likeCount: 3200 },
  { id: 4, title: '【钢琴】用钢琴弹奏你最爱的动漫OST合集', coverUrl: '', userName: '钢琴少女', viewCount: 234000, danmakuCount: 5600, duration: 900, createdAt: '2024-11-15T16:00:00Z', likeCount: 18000 },
  { id: 5, title: '深圳打工人的一天 | Vlog记录真实生活', coverUrl: '', userName: '深漂日记', viewCount: 45300, danmakuCount: 720, duration: 540, createdAt: '2024-11-10T12:00:00Z', likeCount: 2100 },
  { id: 6, title: 'AI绘画到底有多强？Midjourney vs Stable Diffusion实测对比', coverUrl: '', userName: '科技探索', viewCount: 198000, danmakuCount: 4100, duration: 780, createdAt: '2024-11-05T09:00:00Z', likeCount: 12000 },
  { id: 7, title: '零基础学Python Day1 - 环境搭建与第一个程序', coverUrl: '', userName: '编程入门', viewCount: 312000, danmakuCount: 8900, duration: 1500, createdAt: '2024-10-28T10:00:00Z', likeCount: 25000 },
  { id: 8, title: '【猫片】我家橘猫的日常，太可爱了！', coverUrl: '', userName: '喵星人', viewCount: 67800, danmakuCount: 2300, duration: 300, createdAt: '2024-10-20T18:00:00Z', likeCount: 4500 },
  { id: 9, title: '原神4.5版本全角色强度排行，谁才是真正的T0？', coverUrl: '', userName: '游戏攻略组', viewCount: 456000, danmakuCount: 12000, duration: 960, createdAt: '2024-10-15T11:00:00Z', likeCount: 32000 },
  { id: 10, title: '一个人的深夜电台 | 那些年我们听过的歌', coverUrl: '', userName: '夜听FM', viewCount: 78900, danmakuCount: 1800, duration: 2400, createdAt: '2024-10-10T22:00:00Z', likeCount: 6700 },
  { id: 11, title: '健身小白30天蜕变记录，从120斤到105斤', coverUrl: '', userName: '健身打卡', viewCount: 156000, danmakuCount: 3400, duration: 720, createdAt: '2024-10-05T07:00:00Z', likeCount: 11000 },
  { id: 12, title: '【手工】用废纸板做了一个等比例高达模型！', coverUrl: '', userName: '手工耿', viewCount: 890000, danmakuCount: 21000, duration: 1080, createdAt: '2024-09-28T15:00:00Z', likeCount: 67000 },
  { id: 13, title: '成都美食探店｜本地人推荐的10家宝藏小店', coverUrl: '', userName: '美食侦探', viewCount: 234000, danmakuCount: 5100, duration: 660, createdAt: '2024-09-20T12:00:00Z', likeCount: 15000 },
  { id: 14, title: '考研数学满分经验分享｜这些方法让我从学渣变学霸', coverUrl: '', userName: '学习博主', viewCount: 178000, danmakuCount: 4200, duration: 1320, createdAt: '2024-09-15T09:00:00Z', likeCount: 13000 },
  { id: 15, title: '雨天的东京街头 | 氛围感旅拍', coverUrl: '', userName: '胶片日记', viewCount: 345000, danmakuCount: 7800, duration: 420, createdAt: '2024-09-10T16:00:00Z', likeCount: 28000 },
  { id: 16, title: '学会了这5道菜，你就是厨房里最靓的仔', coverUrl: '', userName: '家常美食', viewCount: 112000, danmakuCount: 2600, duration: 540, createdAt: '2024-09-05T11:00:00Z', likeCount: 7800 },
  { id: 17, title: '【Minecraft】耗时3个月，还原了一座中国古城！', coverUrl: '', userName: 'MC建筑师', viewCount: 567000, danmakuCount: 15000, duration: 900, createdAt: '2024-08-28T14:00:00Z', likeCount: 45000 },
  { id: 18, title: '吉他弹唱《晴天》周杰伦｜完整版教学', coverUrl: '', userName: '吉他教室', viewCount: 289000, danmakuCount: 6700, duration: 780, createdAt: '2024-08-20T10:00:00Z', likeCount: 21000 },
  { id: 19, title: '养猫新手必看！这10个错误99%的人都犯过', coverUrl: '', userName: '宠物医生', viewCount: 198000, danmakuCount: 4500, duration: 600, createdAt: '2024-08-15T08:00:00Z', likeCount: 14000 },
  { id: 20, title: '【ASMR】雨声+翻书声，帮你快速入睡', coverUrl: '', userName: '助眠频道', viewCount: 423000, danmakuCount: 9200, duration: 3600, createdAt: '2024-08-10T23:00:00Z', likeCount: 35000 },
];

const FLOOR_SECTIONS = [
  {
    id: 1,
    title: '番剧推荐',
    icon: 'anime',
    color: '#FB7299',
    videos: MOCK_VIDEOS.slice(0, 5),
  },
  {
    id: 2,
    title: '国创推荐',
    icon: 'guochuang',
    color: '#00AEEC',
    videos: MOCK_VIDEOS.slice(5, 10),
  },
  {
    id: 3,
    title: '综艺推荐',
    icon: 'variety',
    color: '#FF6699',
    videos: MOCK_VIDEOS.slice(10, 15),
  },
];

async function getVideos() {
  try {
    const res = await fetch('http://localhost:8080/api/video/list?page=1&size=20', {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.data || [];
  } catch {
    return MOCK_VIDEOS;
  }
}

export default async function Home() {
  const videos = await getVideos();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg3)' }}>
      <Header />

      {/* 主内容区域 - 匹配B站 bili-feed4 结构 */}
      <main className="bili-feed4">
        <div className="bili-feed4-layout">
          <div className="feed2">
            {/* 轮播区域 - 匹配B站 recommended-swipe 结构 */}
            <div className="recommended-swipe" style={{ '--cover-radio': '72%' } as React.CSSProperties}>
              <div className="recommended-swipe-core">
                <div className="recommended-swipe-shim">
                  <div className="shim-card" />
                  <div className="shim-card" />
                  <div className="shim-card" />
                  <div className="shim-card" />
                </div>
                <div className="recommended-swipe-body">
                  <div className="recommended-swipe-body-normal">
                    <BannerCarousel />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 视频卡片 - 每个视频一个feed-card，与feed2同级 */}
          {videos && videos.length > 0 ? (
            videos.map((video: any, index: number) => (
              <>
                <div key={video.id} className="feed-card">
                  <div className="bili-feed-card">
                    <VideoCard
                      id={video.id}
                      title={video.title}
                      coverUrl={video.coverUrl}
                      userName={video.userName}
                      viewCount={video.viewCount}
                      danmakuCount={video.danmakuCount}
                      duration={video.duration}
                      createdAt={video.createdAt}
                      likeCount={video.likeCount}
                    />
                  </div>
                </div>
                {/* floor-single-card 是独立的grid item，与feed-card同级，横跨全部列 */}
                {index === 4 && FLOOR_SECTIONS[0] && (
                  <div key={`floor-0`} className="floor-single-card">
                    <FloorCard
                      title={FLOOR_SECTIONS[0].title}
                      icon={FLOOR_SECTIONS[0].icon}
                      color={FLOOR_SECTIONS[0].color}
                      videos={FLOOR_SECTIONS[0].videos}
                    />
                  </div>
                )}
                {index === 9 && FLOOR_SECTIONS[1] && (
                  <div key={`floor-1`} className="floor-single-card">
                    <FloorCard
                      title={FLOOR_SECTIONS[1].title}
                      icon={FLOOR_SECTIONS[1].icon}
                      color={FLOOR_SECTIONS[1].color}
                      videos={FLOOR_SECTIONS[1].videos}
                    />
                  </div>
                )}
                {index === 14 && FLOOR_SECTIONS[2] && (
                  <div key={`floor-2`} className="floor-single-card">
                    <FloorCard
                      title={FLOOR_SECTIONS[2].title}
                      icon={FLOOR_SECTIONS[2].icon}
                      color={FLOOR_SECTIONS[2].color}
                      videos={FLOOR_SECTIONS[2].videos}
                    />
                  </div>
                )}
              </>
            ))
          ) : videos === null ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="feed-card">
                <VideoCardSkeleton />
              </div>
            ))
          ) : (
            <div className="feed-card">
              <div className="feed-card__empty">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-4">
                  <circle cx="40" cy="40" r="36" stroke="var(--border-color)" strokeWidth="2" />
                  <path d="M30 35c0-2 1.5-3.5 3.5-3.5h13c2 0 3.5 1.5 3.5 3.5v10c0 2-1.5 3.5-3.5 3.5h-13c-2 0-3.5-1.5-3.5-3.5V35z" stroke="var(--text-disabled)" strokeWidth="1.5" />
                  <path d="M36 32v-4c0-1 .5-1.5 1-1.5h6c.5 0 1 .5 1 1.5v4" stroke="var(--text-disabled)" strokeWidth="1.5" />
                  <circle cx="40" cy="40" r="3" fill="var(--text-disabled)" />
                </svg>
                <p className="text-[15px] text-[var(--text-tertiary)] mb-1">还没有视频内容</p>
                <p className="text-[13px] text-[var(--text-disabled)]">启动后端服务并上传视频后，这里将显示视频列表</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 右下角悬浮按钮区域 */}
      <PaletteButton />

      {/* 页脚 */}
      <footer className="bg-[var(--bg1)] py-6 mt-8">
        <div className="container-bili text-center">
          <p className="text-[var(--v_fs_6)] text-[var(--text3)]">© 2024 YuLiYuLi. All rights reserved.</p>
          <p className="text-[var(--v_fs_6)] text-[var(--text4)] mt-1">仿B站前端演示项目</p>
        </div>
      </footer>
    </div>
  );
}
