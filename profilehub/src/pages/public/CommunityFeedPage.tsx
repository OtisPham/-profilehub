import React, { useState, useEffect } from 'react';
import { 
  Users,
  Filter
} from 'lucide-react';
import FeedControlCard from '../../components/social/FeedControlCard';
import PostCard from '../../components/social/PostCard';
import QuickApplyFromPostModal from '../../components/social/QuickApplyFromPostModal';
import { socialFeedService } from '../../services/socialFeedService';
import type { SocialPost, FeedFilter } from '../../types/database';

export default function CommunityFeedPage() {
  const [currentFilter, setCurrentFilter] = useState<FeedFilter>('all');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // Quick Apply Modal State
  const [selectedJobPost, setSelectedJobPost] = useState<SocialPost | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadFeed = () => {
    const list = socialFeedService.getPosts(currentFilter);
    if (!searchKeyword.trim()) {
      setPosts(list);
    } else {
      const kw = searchKeyword.toLowerCase();
      setPosts(list.filter(p => 
        p.title.toLowerCase().includes(kw) || 
        p.content.toLowerCase().includes(kw) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(kw))) ||
        (p.author_name && p.author_name.toLowerCase().includes(kw))
      ));
    }
  };

  useEffect(() => {
    loadFeed();

    const handleSync = () => {
      loadFeed();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('profilehub_social_feed_updated', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('profilehub_social_feed_updated', handleSync);
    };
  }, [currentFilter, searchKeyword]);

  const handleApplySuccess = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#090d16] font-sans text-slate-900 dark:text-slate-100 pb-20 transition-colors">
      
      {/* 1. Header Bar Tinh Giản */}
      <div className="border-b border-slate-200/70 dark:border-slate-800/80 bg-white dark:bg-[#0d1222] py-3.5 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold border border-indigo-200/60 dark:border-indigo-800/60">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Dòng Tin Nghề Nghiệp IT</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                  Proof-of-Work
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Kết nối trực tiếp qua đồ án thực chiến, demo chạy thật và phản hồi từ Tech Lead.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BỐ CỤC 1 LUỒNG TRUNG TÂM DUY NHẤT (Single Centered Column - Max 680px) */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 space-y-4">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-2xl shadow-lg animate-in fade-in flex items-center justify-between">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white font-bold ml-4">✕</button>
          </div>
        )}

        {/* ĐÚNG 1 THẺ ĐIỀU KHIỂN DUY NHẤT: Soạn bài + Tabs lọc + Ô tìm kiếm */}
        <FeedControlCard
          currentFilter={currentFilter}
          onSelectFilter={(f) => setCurrentFilter(f)}
          searchKeyword={searchKeyword}
          onSearchChange={(kw) => setSearchKeyword(kw)}
          onPostCreated={() => loadFeed()}
        />

        {/* DÒNG BÀI VIẾT (Mỗi bài là 1 THẺ LIỀN MẠCH) */}
        <div className="space-y-3.5">
          {posts.length === 0 ? (
            <div className="bg-white dark:bg-[#111728] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-10 text-center shadow-xs">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-2 text-slate-400">
                <Filter className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">Chưa có bài viết phù hợp</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Hãy thử tìm từ khóa khác hoặc chuyển sang danh mục Tất Cả.</p>
              <button
                onClick={() => { setCurrentFilter('all'); setSearchKeyword(''); }}
                className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Xem tất cả bài viết
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onQuickApply={(p) => setSelectedJobPost(p)}
                onInviteCandidate={(p) => {
                  alert(`Đã gửi lời mời phỏng vấn đến bạn ${p.author_name} cho đồ án "${p.title}"!`);
                }}
                onUpdated={() => loadFeed()}
              />
            ))
          )}
        </div>

      </div>

      {/* Quick Apply Modal */}
      {selectedJobPost && (
        <QuickApplyFromPostModal
          post={selectedJobPost}
          onClose={() => setSelectedJobPost(null)}
          onAppliedSuccess={handleApplySuccess}
        />
      )}

    </div>
  );
}
