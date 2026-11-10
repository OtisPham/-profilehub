import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  ShieldCheck, 
  Send, 
  ExternalLink, 
  Sparkles, 
  DollarSign, 
  MapPin, 
  Check,
  UserCheck
} from 'lucide-react';
import type { SocialPost } from '../../types/database';
import { socialFeedService } from '../../services/socialFeedService';
import { useAuth } from '../../context/AuthProvider';

interface PostCardProps {
  post: SocialPost;
  onQuickApply?: (post: SocialPost) => void;
  onInviteCandidate?: (post: SocialPost) => void;
  onUpdated?: () => void;
}

export default function PostCard({
  post,
  onQuickApply,
  onInviteCandidate,
  onUpdated
}: PostCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(Boolean(post.is_liked));
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isSaved, setIsSaved] = useState(Boolean(post.is_saved));
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState(post.comments || []);
  const [shareFeedback, setShareFeedback] = useState(false);

  // Xử lý thích bài viết
  const handleLike = () => {
    const res = socialFeedService.toggleLikePost(post.id);
    if (res.success) {
      setIsLiked(res.isLiked);
      setLikesCount(res.likesCount);
      if (onUpdated) onUpdated();
    }
  };

  // Xử lý lưu bài viết
  const handleBookmark = () => {
    const res = socialFeedService.toggleBookmarkPost(post.id);
    if (res.success) {
      setIsSaved(res.isSaved);
      if (onUpdated) onUpdated();
    }
  };

  // Xử lý gửi bình luận
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newCmt = socialFeedService.addComment(post.id, {
      authorId: user?.id || 'guest_user',
      authorName: user?.user_metadata?.full_name || 'Khách Ghé Thăm',
      authorRole: 'student',
      content: commentText.trim()
    });

    if (newCmt) {
      setCommentsList([...commentsList, newCmt]);
      setCommentText('');
      if (onUpdated) onUpdated();
    }
  };

  // Chia sẻ link bài viết
  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/feed#${post.id}`);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 2000);
  };

  const isJob = post.post_type === 'job_hiring';
  const isProject = post.post_type === 'project_showcase';
  const isCelebration = post.post_type === 'offer_celebration';

  return (
    <article 
      id={post.id}
      className="bg-white dark:bg-[#111728] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs text-left transition-all hover:border-slate-300 dark:hover:border-slate-700"
    >
      {/* Celebration Ribbon (Liền khối, không viền hộp phụ) */}
      {isCelebration && (
        <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 text-xs font-bold mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Vinh Danh Trúng Tuyển Chính Thức</span>
        </div>
      )}

      {/* Author Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'}
            alt={post.author_name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {post.author_name}
              </h4>
              {post.is_author_verified && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>{post.author_headline || 'Thành viên'}</span>
              <span>•</span>
              <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleBookmark}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isSaved 
              ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/70' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
          title={isSaved ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
        </button>
      </div>

      {/* Post Title */}
      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
        {post.title}
      </h3>

      {/* Post Text Content */}
      <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed mb-3">
        {post.content}
      </p>

      {/* 1 THẺ LIỀN MẠCH: Thông tin việc làm (Trực tiếp, không lồng thẻ con thứ 2) */}
      {isJob && (
        <div className="mb-3.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>{post.job_salary_range || 'Thỏa thuận'}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.job_location || 'Hybrid'}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => onQuickApply ? onQuickApply(post) : null}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <Sparkles className="w-3 h-3 text-indigo-200" />
            <span>Ứng Tuyển 1-Click</span>
          </button>
        </div>
      )}

      {/* 1 THẺ LIỀN MẠCH: Thông tin đồ án (Trực tiếp, không lồng thẻ con thứ 2) */}
      {isProject && (
        <div className="mb-3.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 border border-purple-200/60 dark:border-purple-800/60 px-2 py-0.5 rounded-md">
              Proof-of-Work Verified
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {post.project_demo_url && (
              <a
                href={post.project_demo_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-slate-100 dark:bg-[#161f36] hover:bg-slate-200 dark:hover:bg-[#1f2b4a] text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3 text-slate-400" />
                <span>Live Demo</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => onInviteCandidate ? onInviteCandidate(post) : null}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <UserCheck className="w-3 h-3" />
              <span>Mời Phỏng Vấn</span>
            </button>
          </div>
        </div>
      )}

      {/* Tags List */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag, i) => (
            <span 
              key={i} 
              className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-[#161f36] px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Engagement Stats Bar */}
      <div className="py-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span>{likesCount} lượt thích</span>
        <span>{commentsList.length} bình luận</span>
      </div>

      {/* Action Buttons Bar */}
      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={handleLike}
          className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            isLiked 
              ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' 
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
          <span>{isLiked ? 'Đã thích' : 'Thích'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="px-3 py-1.5 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-slate-400" />
          <span>Bình luận ({commentsList.length})</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="px-3 py-1.5 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {shareFeedback ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Đã chép link!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-slate-400" />
              <span>Chia sẻ</span>
            </>
          )}
        </button>
      </div>

      {/* Collapsible Comments Section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
          {/* New Comment Input */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Viết bình luận hoặc đặt câu hỏi chuyên môn..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-[#161f36] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 placeholder-slate-400"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Gửi</span>
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-1.5">
            {commentsList.map((cmt) => (
              <div 
                key={cmt.id} 
                className="p-2 bg-slate-50 dark:bg-[#161f36]/60 rounded-xl text-xs space-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                    {cmt.author_name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(cmt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">{cmt.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </article>
  );
}
