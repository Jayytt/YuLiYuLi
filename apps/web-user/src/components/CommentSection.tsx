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
    return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg p-4 mt-4">
      <h3 className="text-base font-medium mb-4">评论 ({comments.length})</h3>

      <div className="mb-6">
        {replyTo && (
          <div className="text-sm text-bili-text-secondary mb-2">
            回复 @{replyTo.userName}
            <button onClick={() => setReplyTo(null)} className="ml-2 text-bili-blue">取消</button>
          </div>
        )}
        <div className="flex gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="发一条友善的评论"
            className="input-bili flex-1 min-h-[60px] resize-none"
          />
          <button onClick={handleSubmit} className="btn-bili btn-bili-primary self-end">
            发布
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-bili-border flex-shrink-0 flex items-center justify-center text-xs text-bili-text-secondary">
              {comment.userName?.charAt(0) || '?'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-bili-blue">{comment.userName}</span>
                <span className="text-xs text-bili-text-secondary">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="text-sm mt-1">{comment.content}</p>
              <div className="flex items-center gap-4 mt-1 text-xs text-bili-text-secondary">
                <button className="hover:text-bili-pink">👍 {comment.likeCount || 0}</button>
                <button onClick={() => setReplyTo(comment)} className="hover:text-bili-blue">回复</button>
              </div>

              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 ml-4 space-y-3 border-l-2 border-bili-border pl-3">
                  {comment.replies.map(reply => (
                    <div key={reply.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-bili-blue">{reply.userName}</span>
                        {reply.replyUserName && (
                          <span className="text-xs text-bili-text-secondary">
                            回复 <span className="text-bili-blue">@{reply.userName}</span>
                          </span>
                        )}
                        <span className="text-xs text-bili-text-secondary">{formatDate(reply.createdAt)}</span>
                      </div>
                      <p className="text-sm mt-1">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-bili-text-secondary text-sm">
            暂无评论，快来抢沙发吧！
          </div>
        )}
      </div>
    </div>
  );
}
