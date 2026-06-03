import Header from '@/components/Header';
import VideoCard from '@/components/VideoCard';
import VideoCardSkeleton from '@/components/VideoCardSkeleton';
import Link from 'next/link';

async function getVideos() {
  try {
    const res = await fetch('http://localhost:8080/api/video/list?page=1&size=20', {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.data || [];
  } catch {
    return null;
  }
}

const channelLinks = [
  { label: '番剧', href: '/category/anime' },
  { label: '国创', href: '/category/guochuang' },
  { label: '电视剧', href: '/category/tv' },
  { label: '综艺', href: '/category/variety' },
  { label: '纪录片', href: '/category/documentary' },
  { label: '动画', href: '/category/douga' },
  { label: '游戏', href: '/category/game' },
  { label: '鬼畜', href: '/category/kichiku' },
  { label: '音乐', href: '/category/music' },
  { label: '舞蹈', href: '/category/dance' },
  { label: '影视', href: '/category/cinephile' },
  { label: '娱乐', href: '/category/ent' },
  { label: '知识', href: '/category/knowledge' },
  { label: '科技数码', href: '/category/tech', spacing: '0px' },
  { label: '资讯', href: '/category/information' },
  { label: '美食', href: '/category/food' },
  { label: '汽车', href: '/category/car' },
  { label: '时尚美妆', href: '/category/fashion', spacing: '0px' },
  { label: '体育运动', href: '/category/sports', spacing: '0px' },
  { label: '动物', href: '/category/animal' },
  { label: 'vlog', href: '/category/vlog', spacing: '0px' },
  { label: '绘画', href: '/category/painting' },
  { label: '人工智能', href: '/category/ai', spacing: '0px' },
];

export default async function Home() {
  const videos = await getVideos();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg3)' }}>
      <Header />

      {/* 频道区域 */}
      <div className="bili-header__channel">
        <div className="bili-header__channel-inner">
          <div className="channel-icons">
            <Link href="/dynamic" className="channel-icons__item">
              <div className="icon-bg icon-bg__dynamic">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 2C6.03 2 2 6.03 2 11s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" fill="var(--text2)" />
                  <path d="M11 6v5l4.28 2.54.72-1.21-3.5-2.08V6H11z" fill="var(--text2)" />
                </svg>
              </div>
              <span className="icon-title">动态</span>
            </Link>
            <Link href="/popular" className="channel-icons__item">
              <div className="icon-bg icon-bg__popular">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.89054 17.272L4.89277 17.2742C6.49674 18.8782 8.66472 19.7888 10.9624 19.7888C13.2503 19.7888 15.2113 19.0539 16.6107 17.6108C18.0002 16.1345 18.7835 14.182 18.7421 12.1819C18.7852 11.3835 18.6916 9.36321 17.4088 6.75488C17.209 6.35523 16.8163 6.06598 16.3391 5.96993C15.8904 5.87103 15.4021 6.01997 15.061 6.35741C14.9094 6.48781 14.7796 6.61755 14.6655 6.7317C14.2107 3.35588 12.6083 1.7368 11.1654 1.00465C11.0775 0.931205 11.0311 0.900467 10.9694 0.888912C10.2276 0.608301 9.41043 1.01168 9.1237 1.77629C8.50566 3.46558 7.35287 4.62281 6.16627 5.76704C4.51756 7.33121 2.75938 9.03623 2.80163 12.093C2.75906 14.055 3.54464 15.8826 4.89054 17.272Z" fill="white" />
                </svg>
              </div>
              <span className="icon-title">热门</span>
            </Link>
          </div>

          <div className="right-channel-container">
            <div className="channel-items__left">
              {channelLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="channel-link"
                  style={{ letterSpacing: link.spacing || '2px' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 - 匹配B站实际结构 */}
      <main className="bili-feed4-layout">
        {/* Banner 轮播区域 */}
        <div className="bili-feed4-banner">
          <div className="banner-card">
            <div
              className="banner-card__bg"
              style={{
                background: 'linear-gradient(135deg, var(--Pi5) 0%, #FF9DB5 30%, #66DEFF 70%, var(--Lb5) 100%)',
              }}
            />
            <div className="banner-card__content">
              <h2 className="banner-card__title">YuLiYuLi</h2>
              <p className="banner-card__desc">你感兴趣的视频都在这里</p>
              <button className="banner-card__btn">立即体验</button>
            </div>
            <div className="banner-card__dots">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`banner-card__dot ${i === 0 ? 'banner-card__dot--active' : ''}`}
                />
              ))}
            </div>
            <button className="banner-card__arrow banner-card__arrow--left">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="banner-card__arrow banner-card__arrow--right">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* 视频网格 - 匹配B站实际结构 */}
        <div className="recommended-container_floor-aside">
          <div className="feed-card">
            {videos && videos.length > 0 ? (
              <>
                <div className="feed-card__content">
                  <div className="bili-video-card__grid">
                    {videos.map((video: any) => (
                      <div key={video.id} className="bili-feed-card">
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
                    ))}
                  </div>
                </div>
                {/* 换一换按钮 - 匹配B站实际 */}
                <div className="feed-roll-btn">
                  <button className="roll-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8a6 6 0 0110.89-3.48M14 8a6 6 0 01-10.89 3.48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M14 2v4h-4M2 14v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    换一换
                  </button>
                </div>
              </>
            ) : videos === null ? (
              <div className="feed-card__content">
                <div className="bili-video-card__grid">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <VideoCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            ) : (
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
            )}
          </div>
        </div>
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
