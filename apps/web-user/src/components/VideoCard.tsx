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
  likeCount?: number;
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
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}-${day}`;
}

export default function VideoCard({ id, title, coverUrl, userName, viewCount, danmakuCount, duration, createdAt, likeCount }: VideoCardProps) {
  return (
    <div className="bili-video-card is-rcmd enable-no-interest">
      <div className="bili-video-card__wrap">
        {/* 不感兴趣按钮 - 匹配B站实际结构 */}
        <div className="bili-video-card__no-interest">
          <div className="bili-video-card__no-interest--inner">
            <div className="bili-video-card__no-interest--left">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
                <path d="M5 8h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="bili-video-card__no-interest--right">
              <span>不感兴趣</span>
            </div>
          </div>
        </div>

        {/* 缩略图区域 */}
        <Link href={`/video/${id}`} className="bili-video-card__image--link">
          <div className="bili-video-card__image">
            <div className="bili-video-card__image--wrap">
              {/* 稍后再看按钮 */}
              <div className="bili-watch-later--wrap">
                <span className="bili-watch-later">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM9 15a6 6 0 110-12 6 6 0 010 12z" fill="white" />
                    <path d="M9 4.5v4.5l3 1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>

              {/* 封面图 */}
              {coverUrl ? (
                <picture className="bili-video-card__cover">
                  <img
                    src={coverUrl}
                    alt={title}
                    className="bili-video-card__img"
                    loading="lazy"
                  />
                </picture>
              ) : (
                <picture className="bili-video-card__cover">
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--bg-active)' }}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <rect x="4" y="8" width="40" height="32" rx="3" stroke="var(--text-disabled)" strokeWidth="1.5" />
                      <circle cx="16" cy="18" r="3" fill="var(--text-disabled)" />
                      <path d="M4 32l10-8 5 4 10-10 15 12" stroke="var(--text-disabled)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </picture>
              )}

              {/* 遮罩层 + 统计信息 - 匹配B站实际结构 */}
              <div className="bili-video-card__mask">
                <div className="bili-video-card__stats">
                  <div className="bili-video-card__stats--left">
                    {/* 播放量 - B站实际eye/play组合图标 */}
                    <div className="bili-video-card__stats--item">
                      <svg className="bili-video-card__stats--icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none">
                        <path d="M15.75 8.475c0 .15-.075.337-.075.45a5.1 5.1 0 0 1-4.35 4.688c-.45.075-.975.112-1.5.112s-1.05-.037-1.5-.112a5.1 5.1 0 0 1-4.35-4.688c0-.112-.075-.3-.075-.45s.075-.337.075-.45A5.1 5.1 0 0 1 8.325 3.375c.45-.075.975-.112 1.5-.112s1.05.037 1.5.112a5.1 5.1 0 0 1 4.35 4.688c0 .112.075.3.075.45" stroke="#fff" strokeWidth="1.1" />
                        <circle cx="10.5" cy="8.55" r="2.025" stroke="#fff" strokeWidth="1.1" />
                      </svg>
                      <span>{formatCount(viewCount)}</span>
                    </div>
                    {/* 弹幕量 - B站实际线条+圆点图标 */}
                    <div className="bili-video-card__stats--item">
                      <svg className="bili-video-card__stats--icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none">
                        <path d="M1.5 4.5h9M1.5 9h12M1.5 13.5h6" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" />
                        <circle cx="15" cy="13.5" r="1.5" fill="#fff" />
                      </svg>
                      <span>{formatCount(danmakuCount)}</span>
                    </div>
                  </div>
                  {/* 时长 - 右下角 */}
                  <div className="bili-video-card__stats__duration">
                    {duration > 0 && formatDuration(duration)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* 信息区 */}
        <div className="bili-video-card__info">
          <div className="bili-video-card__info--right">
            {/* 不感兴趣按钮 (信息区) */}
            <div className="bili-video-card__info--no-interest">
              <svg className="bili-video-card__info--no-interest--icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="4" cy="8" r="1.5" fill="var(--text3)" />
                <circle cx="8" cy="8" r="1.5" fill="var(--text3)" />
                <circle cx="12" cy="8" r="1.5" fill="var(--text3)" />
              </svg>
            </div>

            <Link href={`/video/${id}`} className="bili-video-card__info--tit">
              <h3 className="bili-video-card__info--title bili-line-clamp-2">
                {title}
              </h3>
            </Link>

            <div className="bili-video-card__info--bottom">
              {/* 点赞数 - 匹配B站实际 */}
              {likeCount !== undefined && likeCount > 0 && (
                <div className="bili-video-card__info--icon-text">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.5v5H2a.5.5 0 01-.5-.5v-3a.5.5 0 01.5-.5h1.5zm2-.5L7 1.5A1.5 1.5 0 018.5 2.5l.5 2.5h2.5a1.5 1.5 0 011.5 1.75l-.75 5A1.5 1.5 0 0111 13H5V5.5z" stroke="var(--text3)" strokeWidth="1" strokeLinejoin="round" />
                  </svg>
                  <span>{formatCount(likeCount)}</span>
                </div>
              )}

              <div className="bili-video-card__info--owner">
                {/* UP主图标 - B站实际麦克风/音符SVG */}
                <svg className="bili-video-card__info--owner__up" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 1C5.477 1 1 5.477 1 11s4.477 10 10 10 10-4.477 10-10S16.523 1 11 1zm0 3a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm0 14.5a7.5 7.5 0 01-6-2.94c.03-1.98 4-3.06 6-3.06s5.97 1.08 6 3.06A7.5 7.5 0 0111 18.5z" fill="var(--text4)" />
                </svg>
                <Link href="#" className="bili-video-card__info--owner-link">
                  <span className="bili-video-card__info--author">{userName}</span>
                </Link>
                {createdAt && (
                  <span className="bili-video-card__info--date">· {formatDate(createdAt)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
