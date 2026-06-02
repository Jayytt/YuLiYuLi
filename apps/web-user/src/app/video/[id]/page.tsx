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

export default async function VideoPage({ params }: { params: { id: string } }) {
  const video = await getVideo(params.id);

  if (!video) {
    return (
      <div className="min-h-screen bg-bili-bg">
        <Header />
        <div className="text-center py-20 text-bili-text-secondary">
          <p className="text-lg">视频不存在或加载失败</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bili-bg">
      <Header />
      <main className="max-w-[1140px] mx-auto px-[10px] py-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <VideoPlayer videoUrl={video.videoUrl} poster={video.coverUrl} />
            </div>

            <div className="bg-white rounded-lg p-4 mt-4">
              <h1 className="text-lg font-medium">{video.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-bili-text-secondary">
                <span>{video.viewCount}播放</span>
                <span>{video.danmakuCount}弹幕</span>
                <span>{new Date(video.createdAt).toLocaleDateString('zh-CN')}</span>
              </div>
              <div className="flex items-center gap-6 mt-4">
                <button className="flex flex-col items-center text-xs text-bili-text-secondary hover:text-bili-pink">
                  <span className="text-lg">👍</span>
                  <span>{video.likeCount}</span>
                </button>
                <button className="flex flex-col items-center text-xs text-bili-text-secondary hover:text-bili-pink">
                  <span className="text-lg">🪙</span>
                  <span>{video.coinCount}</span>
                </button>
                <button className="flex flex-col items-center text-xs text-bili-text-secondary hover:text-bili-pink">
                  <span className="text-lg">⭐</span>
                  <span>{video.favoriteCount}</span>
                </button>
                <button className="flex flex-col items-center text-xs text-bili-text-secondary hover:text-bili-pink">
                  <span className="text-lg">↗</span>
                  <span>{video.shareCount}</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bili-border flex items-center justify-center text-sm">
                  {video.userName?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-sm font-medium">{video.userName}</p>
                  <p className="text-xs text-bili-text-secondary">UP主</p>
                </div>
              </div>
              <button className="btn-bili btn-bili-primary text-sm">+ 关注</button>
            </div>

            {video.description && (
              <div className="bg-white rounded-lg p-4 mt-4">
                <p className="text-sm text-bili-text">{video.description}</p>
              </div>
            )}

            <CommentSection videoId={video.id} />
          </div>

          <div className="w-[300px] flex-shrink-0">
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">相关推荐</h3>
              <div className="text-sm text-bili-text-secondary text-center py-8">
                暂无推荐
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
