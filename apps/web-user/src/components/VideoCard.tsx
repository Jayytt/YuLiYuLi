import Link from 'next/link';

interface VideoCardProps {
  id: number;
  title: string;
  coverUrl: string;
  userName: string;
  viewCount: number;
  danmakuCount: number;
  duration: number;
}

function formatCount(count: number): string {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
}

function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

export default function VideoCard({ id, title, coverUrl, userName, viewCount, danmakuCount, duration }: VideoCardProps) {
  return (
    <Link href={`/video/${id}`} className="card-bili group cursor-pointer">
      <div className="relative aspect-video bg-gray-200 overflow-hidden">
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-bili-text-secondary">
            暂无封面
          </div>
        )}
        {duration > 0 && (
          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
            {formatDuration(duration)}
          </span>
        )}
      </div>
      <div className="p-2">
        <h3 className="text-sm line-clamp-2 text-bili-text group-hover:text-bili-blue transition-colors">
          {title}
        </h3>
        <div className="mt-1.5 flex items-center justify-between text-xs text-bili-text-secondary">
          <span>{userName}</span>
          <span>{formatCount(viewCount)}播放 · {formatCount(danmakuCount)}弹幕</span>
        </div>
      </div>
    </Link>
  );
}
