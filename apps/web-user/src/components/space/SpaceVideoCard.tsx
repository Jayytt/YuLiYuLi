import Link from 'next/link';

interface SpaceVideoCardProps {
  id: number;
  title: string;
  coverUrl: string;
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

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function SpaceVideoCard({ id, title, coverUrl, viewCount, danmakuCount, duration, createdAt }: SpaceVideoCardProps) {
  return (
    <div className="bili-cover-card">
      <Link href={`/video/${id}`} className="bili-cover-card__wrap">
        {/* 封面 */}
        <div className="bili-cover-card__thumbnail">
          {coverUrl ? (
            <img src={coverUrl} alt={title} className="bili-cover-card__img" loading="lazy" />
          ) : (
            <div className="bili-cover-card__placeholder">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.5">
                <rect x="6" y="10" width="36" height="28" rx="3" stroke="#fff" strokeWidth="1.5" />
                <path d="M20 20v8l7-4-7-4z" fill="#fff" />
              </svg>
            </div>
          )}

          {/* 统计覆盖层 */}
          <div className="bili-cover-card__stats">
            <div className="bili-cover-card__stats-item">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2C4.5 2 1.5 5.5 1.5 8s3 6 6.5 6 6.5-3.5 6.5-6-3-6-6.5-6z" stroke="#fff" strokeWidth="1" />
                <circle cx="8" cy="8" r="2" stroke="#fff" strokeWidth="1" />
              </svg>
              <span>{formatCount(viewCount)}</span>
            </div>
            <div className="bili-cover-card__stats-item">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1.5 4h8M1.5 8h11M1.5 12h5" stroke="#fff" strokeWidth="1" strokeLinecap="round" />
                <circle cx="13" cy="12" r="1.5" fill="#fff" />
              </svg>
              <span>{formatCount(danmakuCount)}</span>
            </div>
          </div>

          {/* 时长 */}
          {duration > 0 && (
            <div className="bili-cover-card__duration">
              {formatDuration(duration)}
            </div>
          )}
        </div>

        {/* 详情 */}
        <div className="bili-cover-card__details">
          <h3 className="bili-cover-card__title bili-line-clamp-2">{title}</h3>
          <div className="bili-cover-card__meta">
            {createdAt && (
              <span className="bili-cover-card__date">{formatDate(createdAt)}</span>
            )}
            <span className="bili-cover-card__play">{formatCount(viewCount)}播放</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
