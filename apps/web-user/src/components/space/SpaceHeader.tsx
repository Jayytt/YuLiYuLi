'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SpaceHeaderProps {
  userId: number;
  nickname: string;
  avatar: string;
  bio: string;
  level: number;
  following: number;
  follower: number;
  likeCount?: number;
  playCount?: number;
  isFollowing?: boolean;
}

function formatCount(count: number): string {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
}

export default function SpaceHeader({
  userId,
  nickname,
  avatar,
  bio,
  level,
  following,
  follower,
  likeCount = 0,
  playCount = 0,
  isFollowing = false,
}: SpaceHeaderProps) {
  const [following_state, setFollowing] = useState(isFollowing);
  const [followerCount, setFollowerCount] = useState(follower);

  const handleFollow = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const endpoint = following_state ? '/api/follow/remove' : '/api/follow/add';
      const res = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ followUserId: userId }),
      });
      const data = await res.json();
      if (data.code === 0) {
        setFollowing(!following_state);
        setFollowerCount((prev) => (following_state ? prev - 1 : prev + 1));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-header">
      {/* toutu 横幅 */}
      <div className="space-header__toutu">
        <div className="space-header__toutu-inner" />
      </div>

      {/* 用户信息区 */}
      <div className="space-header__upinfo">
        <div className="space-header__upinfo-inner">
          {/* 头像 */}
          <div className="space-header__avatar">
            <div className="space-header__avatar-inner">
              {avatar ? (
                <img src={avatar} alt={nickname} className="space-header__avatar-img" />
              ) : (
                <div className="space-header__avatar-placeholder">
                  <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                    <circle cx="36" cy="28" r="14" fill="#fff" opacity="0.8" />
                    <ellipse cx="36" cy="58" rx="22" ry="14" fill="#fff" opacity="0.8" />
                  </svg>
                </div>
              )}
            </div>
            {/* 等级徽章 */}
            <div className="space-header__level">
              <span className="space-header__level-tag">LV{level}</span>
            </div>
          </div>

          {/* 用户信息 */}
          <div className="space-header__info">
            <div className="space-header__name-row">
              <h1 className="space-header__name">{nickname}</h1>
              <span className="space-header__gender">
                {/* 性别图标占位 */}
              </span>
            </div>
            <div className="space-header__meta">
              <span className="space-header__uid">UID: {userId}</span>
            </div>
            {bio && (
              <div className="space-header__bio">
                <span>{bio}</span>
              </div>
            )}

            {/* 统计数据 */}
            <div className="space-header__stats">
              <Link href={`/space/${userId}/follow`} className="space-header__stat-item">
                <span className="space-header__stat-num">{formatCount(following)}</span>
                <span className="space-header__stat-label">关注</span>
              </Link>
              <Link href={`/space/${userId}/fans`} className="space-header__stat-item">
                <span className="space-header__stat-num">{formatCount(followerCount)}</span>
                <span className="space-header__stat-label">粉丝</span>
              </Link>
              <div className="space-header__stat-item">
                <span className="space-header__stat-num">{formatCount(likeCount)}</span>
                <span className="space-header__stat-label">获赞</span>
              </div>
              <div className="space-header__stat-item">
                <span className="space-header__stat-num">{formatCount(playCount)}</span>
                <span className="space-header__stat-label">播放</span>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="space-header__actions">
            <button
              className={`space-header__follow-btn ${following_state ? 'space-header__follow-btn--followed' : ''}`}
              onClick={handleFollow}
            >
              {following_state ? '已关注' : '+ 关注'}
            </button>
            <button className="space-header__message-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12v8H4l-2-2V4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M6 7h4M6 9.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              发私信
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
