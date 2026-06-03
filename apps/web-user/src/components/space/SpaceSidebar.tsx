interface SpaceSidebarProps {
  nickname: string;
  bio: string;
  level: number;
  createdAt?: string;
}

export default function SpaceSidebar({ nickname, bio, level, createdAt }: SpaceSidebarProps) {
  const formatJoinDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-sidebar">
      {/* 个人资料简介 */}
      <div className="space-sidebar__card">
        <h3 className="space-sidebar__title">个人资料</h3>
        <div className="space-sidebar__info">
          <div className="space-sidebar__info-item">
            <span className="space-sidebar__info-label">昵称</span>
            <span className="space-sidebar__info-value">{nickname}</span>
          </div>
          <div className="space-sidebar__info-item">
            <span className="space-sidebar__info-label">等级</span>
            <span className="space-sidebar__info-value">LV{level}</span>
          </div>
          {createdAt && (
            <div className="space-sidebar__info-item">
              <span className="space-sidebar__info-label">加入时间</span>
              <span className="space-sidebar__info-value">{formatJoinDate(createdAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* 公告 */}
      <div className="space-sidebar__card">
        <h3 className="space-sidebar__title">公告</h3>
        <div className="space-sidebar__announcement">
          <p className="space-sidebar__announcement-text">
            {bio || '这个人很懒，什么都没有留下~'}
          </p>
        </div>
      </div>
    </div>
  );
}
