import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Layers, 
  Briefcase, 
  FolderGit2, 
  MessageSquare, 
  TrendingUp, 
  Building2, 
  ShieldCheck, 
  Flame, 
  Users,
  Search,
  Filter
} from 'lucide-react';
import SocialSidebarLeft from '../../components/social/SocialSidebarLeft';
import SocialSidebarRight from '../../components/social/SocialSidebarRight';
import PostCard from '../../components/social/PostCard';
import CreatePostBox from '../../components/social/CreatePostBox';
import QuickApplyFromPostModal from '../../components/social/QuickApplyFromPostModal';
import { socialFeedService } from '../../services/socialFeedService';
import type { SocialPost, FeedFilter } from '../../types/database';

export default function HomePage() {
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
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-900 pb-20">
      
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-950 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>ProfileHub Career Network:</span>
        </span>
        <span className="text-slate-200">
          Mạng xã hội kết nối trực tiếp Sinh viên IT với Tech Lead & Nhà tuyển dụng qua đồ án bảo chứng!
        </span>
      </div>

      {/* Main 3-Column Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="mb-4 p-4 bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg animate-in fade-in flex items-center justify-between">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white font-bold ml-4">✕</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* CỘT TRÁI (LEFT RAIL - 3 Cols) */}
          <div className="lg:col-span-3 sticky top-20 hidden md:block">
            <SocialSidebarLeft
              currentFilter={currentFilter}
              onSelectFilter={(f) => setCurrentFilter(f)}
            />
          </div>

          {/* CỘT GIỮA (MAIN FEED - 6 Cols) */}
          <main className="lg:col-span-6 w-full space-y-4">
            
            {/* Search & Mobile Filter Bar */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-3 shadow-xs flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 ml-2" />
              <input
                type="text"
                placeholder="Tìm kiếm vị trí tuyển dụng, đồ án, công nghệ (React, Three.js, Node.js)..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full text-xs sm:text-sm bg-transparent outline-none font-medium text-slate-800 placeholder-slate-400"
              />
              {searchKeyword && (
                <button 
                  onClick={() => setSearchKeyword('')} 
                  className="text-xs text-slate-400 hover:text-slate-600 px-2 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
              <button
                onClick={() => setCurrentFilter('all')}
                className={`px-4 py-2 rounded-2xl shrink-0 transition-all cursor-pointer ${
                  currentFilter === 'all' 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🌐 Tất Cả ({socialFeedService.getAllPosts().length})
              </button>

              <button
                onClick={() => setCurrentFilter('job_hiring')}
                className={`px-4 py-2 rounded-2xl shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentFilter === 'job_hiring' 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" /> 💼 Việc Làm Hot
              </button>

              <button
                onClick={() => setCurrentFilter('project_showcase')}
                className={`px-4 py-2 rounded-2xl shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentFilter === 'project_showcase' 
                    ? 'bg-purple-600 text-white shadow-xs' 
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5" /> 🚀 Đồ Án Bảo Chứng
              </button>

              <button
                onClick={() => setCurrentFilter('tech_discussion')}
                className={`px-4 py-2 rounded-2xl shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentFilter === 'tech_discussion' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> 💡 Thảo Luận & Tips
              </button>
            </div>

            {/* Quick Composer Box */}
            <CreatePostBox onPostCreated={() => loadFeed()} />

            {/* Feed Posts Stream */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Filter className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base mb-1">Chưa có bài viết phù hợp</h4>
                  <p className="text-xs text-slate-500 mb-4">Hãy thử tìm từ khóa khác hoặc chuyển sang danh mục Tất Cả.</p>
                  <button
                    onClick={() => { setCurrentFilter('all'); setSearchKeyword(''); }}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
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

          {/* CỘT PHẢI (RIGHT RAIL - 3 Cols) */}
          <div className="lg:col-span-3 sticky top-20 hidden lg:block">
            <SocialSidebarRight />
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
