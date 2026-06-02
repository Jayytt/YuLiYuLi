import Header from '@/components/Header';
import VideoPlayer from '@/components/VideoPlayer';
import DanmakuOverlay from '@/components/DanmakuOverlay';
import CommentSection from '@/components/CommentSection';

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
      <div className="min-h-screen bg-[#f1f2f3]">
        <Header />
        <div className="text-center py-24">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-4">
            <circle cx="40" cy="40" r="36" stroke="#e3e5e7" strokeWidth="2" />
            <path d="M28 28l24 24M52 28L28 52" stroke="#c9ccd0" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-[15px] text-[#9499a0]">视频不存在或加载失败</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f2f3]">
      <Header />
      <main className="max-w-[1400px] mx-auto px-5 py-4">
        <div className="flex gap-4">
          {/* 左侧: 播放器 + 视频信息 */}
          <div className="flex-1 min-w-0">
            {/* 播放器 */}
            <div className="relative rounded-lg overflow-hidden bg-black">
              <VideoPlayer videoUrl={video.videoUrl} poster={video.coverUrl} />
              <DanmakuOverlay videoId={video.id} currentTime={0} />
            </div>

            {/* 视频信息 */}
            <div className="bg-white rounded-lg mt-3 px-6 py-4">
              {/* 标题 */}
              <h1 className="text-[20px] font-medium text-[#18191c] leading-[28px]">{video.title}</h1>

              {/* 播放信息 */}
              <div className="flex items-center gap-4 mt-2 text-[12px] text-[#9499a0]">
                <span>{formatCount(video.viewCount)}播放</span>
                <span>{formatCount(video.danmakuCount)}弹幕</span>
                <span>{new Date(video.createdAt).toLocaleDateString('zh-CN')}</span>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-2 mt-4">
                <ActionButton icon="like" label={formatCount(video.likeCount || 0)} />
                <ActionButton icon="coin" label={formatCount(video.coinCount || 0)} />
                <ActionButton icon="star" label={formatCount(video.favoriteCount || 0)} />
                <ActionButton icon="share" label="分享" />
                <div className="flex-1" />
                <button className="text-[12px] text-[#9499a0] hover:text-[#00a1d6] transition-colors">
                  举报
                </button>
              </div>
            </div>

            {/* UP主卡片 */}
            <div className="bg-white rounded-lg mt-3 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#e3e5e7] flex items-center justify-center flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="9" r="4" stroke="#c9ccd0" strokeWidth="1.2" />
                    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#c9ccd0" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] text-[#18191c] font-medium">{video.userName}</span>
                    <span className="text-[11px] text-white bg-[#fb7299] px-1.5 py-[1px] rounded">UP主</span>
                  </div>
                  <p className="text-[12px] text-[#9499a0] mt-0.5">0粉丝 0视频</p>
                </div>
              </div>
              <button className="flex items-center gap-1 px-5 py-[7px] bg-[#00a1d6] text-white text-[14px] rounded-full hover:bg-[#00b5e5] transition-colors">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                关注
              </button>
            </div>

            {/* 视频简介 */}
            {video.description && (
              <div className="bg-white rounded-lg mt-3 px-6 py-4">
                <p className="text-[14px] text-[#61666d] leading-[22px] whitespace-pre-wrap">{video.description}</p>
              </div>
            )}

            {/* 评论区 */}
            <CommentSection videoId={video.id} />
          </div>

          {/* 右侧: 推荐 */}
          <div className="w-[320px] flex-shrink-0">
            <div className="bg-white rounded-lg px-4 py-3">
              <h3 className="text-[14px] font-medium text-[#18191c] mb-3">相关推荐</h3>
              <div className="text-center py-10">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto mb-2">
                  <rect x="4" y="8" width="40" height="32" rx="3" stroke="#e3e5e7" strokeWidth="1.5" />
                  <path d="M20 18l10 6-10 6V18z" fill="#e3e5e7" />
                </svg>
                <p className="text-[13px] text-[#c9ccd0]">暂无推荐</p>
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
        <path d="M5 8V16H3a1 1 0 01-1-1v-4a1 1 0 011-1h2zm3-1l2-6a1.5 1.5 0 011.45-1.12L11.5 0h.05a1.5 1.5 0 011.45 1.88L12 5h3.5a1.5 1.5 0 011.48 1.74l-1 6A1.5 1.5 0 0114.5 14H8V8z" stroke="#61666d" strokeWidth="1" />
      </svg>
    ),
    coin: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="#61666d" strokeWidth="1" />
        <text x="9" y="12" textAnchor="middle" fontSize="9" fill="#61666d" fontWeight="600">B</text>
      </svg>
    ),
    star: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2l2 4.5 5 .5-3.8 3.5 1 5L9 13l-4.2 2.5 1-5L2 7l5-.5L9 2z" stroke="#61666d" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    ),
    share: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M14 6l-4-3v2.5C5 5.5 2 8 2 13c1.5-2 3.5-2.5 6-2.5V13l4-3.5L14 6z" stroke="#61666d" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    ),
  };

  return (
    <button className="flex items-center gap-1.5 px-3 py-[6px] rounded-lg text-[12px] text-[#61666d] hover:bg-[#f1f2f3] transition-colors">
      {icons[icon]}
      <span>{label}</span>
    </button>
  );
}
