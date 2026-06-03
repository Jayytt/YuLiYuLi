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
      <div className="bili-thumbnail">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--bg-active)' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="4" y="8" width="32" height="24" rx="2" stroke="var(--text-disabled)" strokeWidth="1.5" />
              <circle cx="14" cy="16" r="2" fill="var(--text-disabled)" />
              <path d="M4 26l8-6 4 3 8-8 12 10" stroke="var(--text-disabled)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {/* 时长 */}
        {duration > 0 && (
          <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[12px] px-1.5 py-[1px] rounded-sm leading-[18px] backdrop-blur-sm">
            {formatDuration(duration)}
          </span>
        )}
        {/* 底部渐变遮罩 */}
        <div className="absolute bottom-0 left-0 right-0 h-[40px] bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* 播放按钮 hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 3l12 7-12 7V3z" fill="white" />
            </svg>
          </div>
        </div>
      </div>

      {/* 信息区 */}
      <div className="mt-2 px-[2px]">
        {/* 标题 */}
        <h3 className="text-[14px] leading-[20px] text-[var(--text-primary)] bili-line-clamp-2 group-hover:text-[var(--brand-blue)] transition-colors font-medium">
          {title}
        </h3>
        {/* 底部信息: UP主 + 播放量 */}
        <div className="mt-[6px] flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            {/* UP主头像 */}
            <div className="w-[18px] h-[18px] rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg-active)' }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="3.5" r="1.8" stroke="var(--text-disabled)" strokeWidth="0.6" />
                <path d="M1.5 9c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5" stroke="var(--text-disabled)" strokeWidth="0.6" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[12px] text-[var(--text-tertiary)] truncate">{userName}</span>
          </div>
          <div className="flex items-center gap-1 text-[12px] text-[var(--text-tertiary)] flex-shrink-0">
            {/* 播放图标 */}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 2.5l7 3.5-7 3.5V2.5z" fill="var(--text-disabled)" />
            </svg>
            <span>{formatCount(viewCount)}</span>
            {danmakuCount > 0 && (
              <>
                <span className="text-[var(--border-color)] mx-0.5">·</span>
                <span>{formatCount(danmakuCount)}弹幕</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
