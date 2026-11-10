import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Building2, 
  ShieldCheck, 
  Send, 
  ExternalLink, 
  Code, 
  Sparkles, 
  DollarSign, 
  MapPin, 
  Briefcase,
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
    navigator.clipboard.writeText(`${window.location.origin}/#${post.id}`);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 2000);
  };

  const isJob = post.post_type === 'job_hiring';
  const isProject = post.post_type === 'project_showcase';
  const isCelebration = post.post_type === 'offer_celebration';

  return (
    <article 
      id={post.id}
      className={`bg-white border rounded-3xl p-6 shadow-xs text-left transition-all relative overflow-hidden ${
        isCelebration 
          ? 'border-purple-300 bg-gradient-to-br from-purple-50/40 via-white to-indigo-50/40' 
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      {/* Celebration Header Ribbon */}
      {isCelebration && (
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 text-[11px] font-bold rounded-xl w-fit mb-3">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Vinh Danh Trúng Tuyển Chính Thức</span>
        </div>
      )}

      {/* Author Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={post.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'}
            alt={post.author_name}
            className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors cursor-pointer">
                {post.author_name}
              </h4>
              {post.is_author_verified && (
                <span title="Đã Xác Thực Doanh Nghiệp / Danh Tính">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-50 shrink-0" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">{post.author_headline || 'Thành viên ProfileHub'}</p>
            <span className="text-[10px] text-slate-400">
              {new Date(post.created_at).toLocaleDateString('vi-VN')} • Công khai
            </span>
          </div>
        </div>

        <button
          onClick={handleBookmark}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${
            isSaved ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
          title={isSaved ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
        </button>
      </div>

      {/* Post Title */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
        {post.title}
      </h3>

      {/* Post Text Content */}
      <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed mb-4">
        {post.content}
      </p>

      {/* SPECIAL CONTEXT 1: Job Hiring Card Details */}
      {isJob && (
        <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 border border-indigo-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-800 mb-1">
              <span className="text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> {post.job_salary_range || 'Lương Thỏa Thuận'}
              </span>
              <span className="text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {post.job_location || 'Linh hoạt (Hybrid)'}
              </span>
            </div>
            <p className="text-[11px] text-indigo-700 font-medium">
              Ứng tuyển trực tiếp bằng đồ án thực chiến và CV được chuẩn hóa ATS.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onQuickApply ? onQuickApply(post) : null}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> 🚀 Ứng Tuyển Nhanh 1-Click
          </button>
        </div>
      )}

      {/* SPECIAL CONTEXT 2: Project Showcase Details */}
      {isProject && (
        <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                ★ Đồ án thực chiến: {post.project_score || 'Demo-Ready Verified'}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Proof-of-Work</span>
            </div>
            <p className="text-xs text-slate-600">Đã kiểm thử code defense và sẵn sàng trình diễn trong phỏng vấn.</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {post.project_demo_url && (
              <a
                href={post.project_demo_url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Live Demo
              </a>
            )}
            <button
              type="button"
              onClick={() => onInviteCandidate ? onInviteCandidate(post) : null}
              className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" /> 🎯 Mời Phỏng Vấn
            </button>
          </div>
        </div>
      )}

      {/* Tags List */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag, i) => (
            <span 
              key={i} 
              className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Engagement Stats Bar */}
      <div className="py-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>❤️ {likesCount} lượt thích</span>
        <span>{commentsList.length} bình luận</span>
      </div>

      {/* Action Buttons Bar */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={handleLike}
          className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            isLiked ? 'text-rose-600 bg-rose-50' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
          <span>{isLiked ? 'Đã thích' : 'Thích'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Bình luận</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          {shareFeedback ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          <span>{shareFeedback ? 'Đã copy link' : 'Chia sẻ'}</span>
        </button>
      </div>

      {/* Comment Section (Collapsible) */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Viết bình luận hoặc đặt câu hỏi về bài đăng..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto pt-2">
            {commentsList.map((cmt) => (
              <div key={cmt.id} className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{cmt.author_name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {new Date(cmt.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 font-normal">{cmt.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </article>
  );
}
