import Header from '@/components/Header';
import VideoPlayer from '@/components/VideoPlayer';
import DanmakuOverlay from '@/components/DanmakuOverlay';
import CommentSection from '@/components/CommentSection';
import Link from 'next/link';

async function getVideo(id: string) {
  try {
    const res = await fetch(`http://localhost:8080/api/video/detail/${id}`, { cache: 'no-store' });
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

function formatCount(count: number): string {
  if (!count) return '0';
  if (count >= 10000) return (count / 10000).toFixed(1) + '万';
  return count.toString();
}

export default async function VideoPage({ params }: { params: { id: string } }) {
  const video = await getVideo(params.id);

  if (!video) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <Header />
        <div className="text-center py-24">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-4">
            <circle cx="40" cy="40" r="36" stroke="var(--border-color)" strokeWidth="2" />
            <path d="M28 28l24 24M52 28L28 52" stroke="var(--text-disabled)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-[15px] text-[var(--text-tertiary)]">视频不存在或加载失败</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg3)' }}>
      <Header />
      <main className="container-bili py-4">
        <div className="flex gap-x-4">
          {/* 左侧: 播放器 + 视频信息 */}
          <div className="flex-1 min-w-0">
            {/* 播放器 */}
            <div className="relative rounded-[var(--v_radius)] overflow-hidden bg-black">
              <VideoPlayer videoUrl={video.videoUrl} poster={video.coverUrl} />
              <DanmakuOverlay videoId={video.id} currentTime={0} />
            </div>

            {/* 视频信息 - matching Bilibili's video-info-container */}
            <div className="bg-[var(--bg1)] rounded-[var(--v_radius)] mt-3 px-6 py-4">
              {/* 标题 */}
              <h1 className="text-[var(--v_fs_3)] font-medium text-[var(--text1)] leading-[var(--v_lh_xl)]">
                {video.title}
              </h1>

              {/* 播放信息 */}
              <div className="flex items-center gap-4 mt-2 text-[var(--v_fs_6)] text-[var(--text3)]">
                <span>{formatCount(video.viewCount)}播放</span>
                <span>{formatCount(video.danmakuCount)}弹幕</span>
                <span>{new Date(video.createdAt).toLocaleDateString('zh-CN')}</span>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-1 mt-4">
                <ActionButton icon="like" label={formatCount(video.likeCount || 0)} />
                <ActionButton icon="coin" label={formatCount(video.coinCount || 0)} />
                <ActionButton icon="star" label={formatCount(video.favoriteCount || 0)} />
                <ActionButton icon="share" label="分享" />
                <div className="flex-1" />
                <button className="bili-action-btn text-[var(--v_fs_6)]">
                  举报
                </button>
              </div>
            </div>

            {/* UP主卡片 - matching Bilibili's up-card */}
            <div className="bg-[var(--bg1)] rounded-[var(--v_radius)] mt-3 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: 'var(--bg-active)' }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 14C17.3137 14 20 11.3137 20 8C20 4.68629 17.3137 2 14 2C10.6863 2 8 4.68629 8 8C8 11.3137 10.6863 14 14 14Z" fill="var(--Ga3)" />
                    <path d="M24 25C24 20.5817 19.5228 17 14 17C8.47715 17 4 20.5817 4 25V27H24V25Z" fill="var(--Ga3)" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--v_fs_4)] text-[var(--text1)] font-medium">{video.userName}</span>
                    <span className="bili-badge bili-badge-pink">UP主</span>
                  </div>
                  <p className="text-[var(--v_fs_6)] text-[var(--text3)] mt-0.5">0粉丝 0视频</p>
                </div>
              </div>
              <button className="flex items-center gap-1 px-5 py-[7px] text-white text-[var(--v_fs_4)] rounded-full hover:opacity-90 transition-opacity" style={{ background: 'var(--brand-pink)' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                关注
              </button>
            </div>

            {/* 视频简介 */}
            {video.description && (
              <div className="bg-[var(--bg1)] rounded-[var(--v_radius)] mt-3 px-6 py-4">
                <p className="text-[var(--v_fs_4)] text-[var(--text2)] leading-[var(--v_lh_lg)] whitespace-pre-wrap">
                  {video.description}
                </p>
              </div>
            )}

            {/* 评论区 */}
            <CommentSection videoId={video.id} />
          </div>

          {/* 右侧: 推荐 */}
          <div className="w-[320px] flex-shrink-0">
            <div className="bg-[var(--bg1)] rounded-[var(--v_radius)] px-4 py-3">
              <h3 className="text-[var(--v_fs_4)] font-medium text-[var(--text1)] mb-3">相关推荐</h3>
              <div className="text-center py-10">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto mb-2">
                  <rect x="4" y="8" width="40" height="32" rx="3" stroke="var(--border-color)" strokeWidth="1.5" />
                  <path d="M20 18l10 6-10 6V18z" fill="var(--border-color)" />
                </svg>
                <p className="text-[var(--v_fs_5)] text-[var(--text4)]">暂无推荐</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* 操作按钮组件 */
function ActionButton({ icon, label }: { icon: string; label: string }) {
  const icons: Record<string, JSX.Element> = {
    like: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M5 7v8H3.5a.5.5 0 01-.5-.5v-5a.5.5 0 01.5-.5H5zm2.5-1L9.5 1a1.5 1.5 0 011.45 1.14l.53 2.86h3.02a1.5 1.5 0 011.48 1.74l-1 6A1.5 1.5 0 0113.5 14H7.5V7z" stroke="var(--text2)" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
    coin: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="var(--text2)" strokeWidth="1.2" />
        <path d="M9 4.5v9M6.5 7.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5" stroke="var(--text2)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    star: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2l2.47 5.01L17 7.85l-4 3.9.94 5.5L9 14.77l-4.94 2.48.94-5.5-4-3.9 5.53-.84L9 2z" stroke="var(--text2)" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    share: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="14" cy="4" r="2.5" stroke="var(--text2)" strokeWidth="1.2" />
        <circle cx="4" cy="9" r="2.5" stroke="var(--text2)" strokeWidth="1.2" />
        <circle cx="14" cy="14" r="2.5" stroke="var(--text2)" strokeWidth="1.2" />
        <path d="M6.3 7.8l5.4-2.6M6.3 10.2l5.4 2.6" stroke="var(--text2)" strokeWidth="1.2" />
      </svg>
    ),
  };

  return (
    <button className="bili-action-btn">
      {icons[icon]}
      <span>{label}</span>
    </button>
  );
}
