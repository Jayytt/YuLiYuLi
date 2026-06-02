'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  likeCount: number;
  createdAt: string;
  replies: Comment[];
}

interface CommentSectionProps {
  videoId: number;
}

export default function CommentSection({ videoId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [sortBy, setSortBy] = useState<'hot' | 'time'>('hot');

  const fetchComments = () => {
    fetch(`/api/comment/list/${videoId}`)
      .then(res => res.json())
      .then(data => setComments(data.data || []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    const body: any = {
      videoId,
      content: newComment,
    };

    if (replyTo) {
      body.parentId = replyTo.id;
      body.replyUserId = replyTo.userId;
      body.replyUserName = replyTo.userName;
    }

    try {
      await fetch('/api/comment/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body),
      });
      setNewComment('');
      setReplyTo(null);
      fetchComments();
    } catch {}
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    return `${date.getMonth() + 1}-${date.getDate()}`;
  };

  return (
    <div className="bg-white rounded-lg mt-3 px-6 py-4">
      {/* 标题 + 排序 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-medium text-[#18191c]">
          评论 <span className="text-[#9499a0] font-normal">({comments.length})</span>
        </h3>
        <div className="flex items-center gap-3 text-[12px]">
          <button
            onClick={() => setSortBy('hot')}
            className={sortBy === 'hot' ? 'text-[#00a1d6]' : 'text-[#9499a0] hover:text-[#00a1d6]'}
          >
            最热
          </button>
          <span className="text-[#e3e5e7]">|</span>
          <button
            onClick={() => setSortBy('time')}
            className={sortBy === 'time' ? 'text-[#00a1d6]' : 'text-[#9499a0] hover:text-[#00a1d6]'}
          >
            最新
          </button>
        </div>
      </div>

      {/* 发评论 */}
      <div className="mb-6">
        {replyTo && (
          <div className="text-[12px] text-[#9499a0] mb-2 flex items-center gap-1">
            回复 <span className="text-[#00a1d6]">@{replyTo.userName}</span>
            <button onClick={() => setReplyTo(null)} className="text-[#00a1d6] ml-2 hover:underline">取消</button>
          </div>
        )}
        <div className="flex gap-3">
          {/* 用户头像占位 */}
          <div className="w-8 h-8 rounded-full bg-[#e3e5e7] flex-shrink-0 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="6" r="2.5" stroke="#c9ccd0" strokeWidth="0.8" />
              <path d="M3 15c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="#c9ccd0" strokeWidth="0.8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="发一条友善的评论"
              className="w-full min-h-[64px] p-3 text-[14px] text-[#18191c] bg-[#f1f2f3] rounded-lg border border-transparent focus:border-[#00a1d6] focus:bg-white outline-none resize-none transition-all placeholder:text-[#9499a0]"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSubmit}
                disabled={!newComment.trim()}
                className={`px-5 py-[6px] rounded-full text-[14px] transition-colors ${
                  newComment.trim()
                    ? 'bg-[#00a1d6] text-white hover:bg-[#00b5e5]'
                    : 'bg-[#e3e5e7] text-[#c9ccd0] cursor-not-allowed'
                }`}
              >
                发布
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="space-y-5">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-3">
            {/* 头像 */}
            <div className="w-8 h-8 rounded-full bg-[#e3e5e7] flex-shrink-0 flex items-center justify-center overflow-hidden">
              {comment.userAvatar ? (
                <img src={comment.userAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="6" r="2.5" stroke="#c9ccd0" strokeWidth="0.8" />
                  <path d="M3 15c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="#c9ccd0" strokeWidth="0.8" strokeLinecap="round" />
                </svg>
              )}
            </div>

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-[#00a1d6] font-medium">{comment.userName}</span>
                <span className="text-[11px] text-[#c9ccd0]">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="text-[14px] text-[#18191c] mt-1 leading-[22px] break-words">{comment.content}</p>
              <div className="flex items-center gap-4 mt-2">
                <button className="flex items-center gap-1 text-[12px] text-[#9499a0] hover:text-[#00a1d6] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 6V12H2a1 1 0 01-1-1V7a1 1 0 011-1h1zm2-1l1.5-4.5a1.2 1.2 0 011.16-.9h.04a1.2 1.2 0 011.16 1.5L8 6h3.5a1.2 1.2 0 011.18 1.4l-.8 4.8A1.2 1.2 0 0111.7 13.5H6V6z" stroke="currentColor" strokeWidth="0.8" />
                  </svg>
                  {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
                </button>
                <button
                  onClick={() => setReplyTo(comment)}
                  className="flex items-center gap-1 text-[12px] text-[#9499a0] hover:text-[#00a1d6] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 3.5A2.5 2.5 0 013.5 1h7A2.5 2.5 0 0113 3.5v4A2.5 2.5 0 0110.5 10H5l-3 3V10a2.5 2.5 0 01-1-2V3.5z" stroke="currentColor" strokeWidth="0.8" />
                  </svg>
                  回复
                </button>
              </div>

              {/* 楼中楼回复 */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 bg-[#f1f2f3] rounded-lg p-3 space-y-3">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#e3e5e7] flex-shrink-0 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="4.5" r="2" stroke="#c9ccd0" strokeWidth="0.6" />
                          <path d="M2 11c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#c9ccd0" strokeWidth="0.6" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-[12px] text-[#00a1d6]">{reply.userName}</span>
                          {reply.replyUserName && (
                            <span className="text-[12px] text-[#9499a0]">
                              回复 <span className="text-[#00a1d6]">@{reply.replyUserName}</span>
                            </span>
                          )}
                          <span className="text-[11px] text-[#c9ccd0]">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="text-[13px] text-[#18191c] mt-0.5 leading-[20px]">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-10">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto mb-2">
              <path d="M6 12A6 6 0 0112 6h24a6 6 0 016 6v18a6 6 0 01-6 6H22l-8 8v-8h-2a6 6 0 01-6-6V12z" stroke="#e3e5e7" strokeWidth="1.5" />
              <path d="M16 16h16M16 22h10" stroke="#e3e5e7" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-[13px] text-[#c9ccd0]">暂无评论，快来抢沙发吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
