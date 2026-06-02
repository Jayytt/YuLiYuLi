import Link from 'next/link';

interface VideoCardProps {
  id: number;
  title: string;
  coverUrl: string;
  userName: string;
  viewCount: number;
  danmakuCount: number;
  duration: number;
  createdAt?: string;
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

function formatTimeAgo(dateStr?: string): string {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  if (days < 365) return `${Math.floor(days / 30)}个月前`;
  return `${Math.floor(days / 365)}年前`;
}

export default function VideoCard({ id, title, coverUrl, userName, viewCount, danmakuCount, duration, createdAt }: VideoCardProps) {
  return (
    <Link href={`/video/${id}`} className="group block">
      {/* 缩略图 */}
      <div className="relative aspect-[10/6] bg-[#f1f2f3] rounded-[6px] overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#e3e5e7]">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="4" y="8" width="32" height="24" rx="2" stroke="#c9ccd0" strokeWidth="1.5" />
              <circle cx="14" cy="16" r="2" fill="#c9ccd0" />
              <path d="M4 26l8-6 4 3 8-8 12 10" stroke="#c9ccd0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {/* 时长 */}
        {duration > 0 && (
          <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[12px] px-1.5 py-[1px] rounded leading-[18px]">
            {formatDuration(duration)}
          </span>
        )}
        {/* hover 遮罩 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>

      {/* 信息区 */}
      <div className="mt-2 px-[2px]">
        {/* 标题 */}
        <h3 className="text-[15px] leading-[22px] text-[#18191c] line-clamp-2 group-hover:text-[#00a1d6] transition-colors font-medium">
          {title}
        </h3>
        {/* 底部信息: UP主 + 播放量 */}
        <div className="mt-[6px] flex items-center justify-between">
          <div className="flex items-center gap-1 min-w-0">
            {/* UP主头像占位 */}
            <div className="w-5 h-5 rounded-full bg-[#e3e5e7] flex-shrink-0 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="4.5" r="2" stroke="#c9ccd0" strokeWidth="0.8" />
                <path d="M2 11c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#c9ccd0" strokeWidth="0.8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[12px] text-[#9499a0] truncate">{userName}</span>
          </div>
          <div className="flex items-center gap-1 text-[12px] text-[#9499a0] flex-shrink-0">
            {/* 播放图标 */}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 2.5l7 3.5-7 3.5V2.5z" fill="#c9ccd0" />
            </svg>
            <span>{formatCount(viewCount)}</span>
            {danmakuCount > 0 && (
              <>
                <span className="text-[#e3e5e7] mx-0.5">·</span>
                <span>{formatCount(danmakuCount)}弹幕</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
