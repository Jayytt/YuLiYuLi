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

export default async function Home() {
  const videos = await getVideos();

  return (
    <div className="min-h-screen bg-bili-bg">
      <Header />
      <main className="max-w-[1140px] mx-auto px-[10px] py-4">
        {/* Category tabs */}
        <div className="bg-white rounded-lg p-3 mb-4 flex gap-4 text-sm overflow-x-auto">
          <span className="text-bili-pink font-medium whitespace-nowrap">推荐</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">动画</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">番剧</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">游戏</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">音乐</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">舞蹈</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">科技</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">生活</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">美食</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">鬼畜</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">时尚</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">娱乐</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">影视</span>
        </div>

        {/* Video grid */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-5 gap-4">
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
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-bili-text-secondary">
            <p className="text-lg">暂无视频</p>
            <p className="mt-2 text-sm">启动后端服务并上传视频后，这里将显示视频列表</p>
          </div>
        )}
      </main>
    </div>
  );
}
