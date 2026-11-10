import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  FolderGit2, 
  MessageSquare, 
  Users,
  Search,
  Filter,
  Layers
} from 'lucide-react';
import SocialSidebarRight from '../../components/social/SocialSidebarRight';
import PostCard from '../../components/social/PostCard';
import CreatePostBox from '../../components/social/CreatePostBox';
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

  const FILTER_TABS = [
    { id: 'all' as FeedFilter, label: 'Tất Cả', icon: Layers },
    { id: 'job_hiring' as FeedFilter, label: 'Việc Làm', icon: Briefcase },
    { id: 'project_showcase' as FeedFilter, label: 'Đồ Án', icon: FolderGit2 },
    { id: 'tech_discussion' as FeedFilter, label: 'Thảo Luận', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#090d16] font-sans text-slate-900 dark:text-slate-100 pb-20 transition-colors">
      
      {/* 1. Header Bar Tinh Giản (Clean Minimalist Banner) */}
      <div className="border-b border-slate-200/70 dark:border-slate-800/80 bg-white dark:bg-[#0d1222] py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold border border-indigo-200/60 dark:border-indigo-800/60">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Dòng Tin Nghề Nghiệp IT</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                  Proof-of-Work
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Chia sẻ đồ án thực chiến, cơ hội tuyển dụng và trao đổi kỹ thuật cùng Tech Lead.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Container (Bố cục 2 cột thoáng đãng) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="mb-4 p-3.5 bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg animate-in fade-in flex items-center justify-between">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white font-bold ml-4">✕</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT CHÍNH (MAIN FEED - 8 Cols ~ 67%) */}
          <main className="lg:col-span-8 w-full space-y-4">
            
            {/* Unified Search & Segment Filter Bar */}
            <div className="bg-white dark:bg-[#111728] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
              
              {/* Search Box */}
              <div className="w-full sm:w-auto flex-1 flex items-center gap-2 px-2.5 py-1 bg-slate-50 dark:bg-[#161f36] rounded-xl border border-slate-100 dark:border-slate-800">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Tìm vị trí, kỹ năng (React, Go, AI)..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full text-xs bg-transparent outline-none font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400"
                />
                {searchKeyword && (
                  <button 
                    onClick={() => setSearchKeyword('')} 
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1 font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Segmented Filter Pills */}
              <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto scrollbar-none">
                {FILTER_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = currentFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setCurrentFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#161f36]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Quick Composer Box */}
            <CreatePostBox onPostCreated={() => loadFeed()} />

            {/* Feed Posts Stream */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="bg-white dark:bg-[#111728] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center shadow-xs">
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

          </main>

          {/* CỘT PHỤ (SIDEBAR PHẢI - 4 Cols ~ 33%) */}
          <div className="lg:col-span-4 w-full">
            <SocialSidebarRight
              currentFilter={currentFilter}
              onSelectFilter={(f) => setCurrentFilter(f)}
            />
          </div>

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
