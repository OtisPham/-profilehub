import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Briefcase, 
  FolderGit2, 
  MessageSquare, 
  Layers,
  Search,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import { socialFeedService } from '../../services/socialFeedService';
import type { PostType, SocialPost, FeedFilter } from '../../types/database';

interface FeedControlCardProps {
  currentFilter: FeedFilter;
  onSelectFilter: (filter: FeedFilter) => void;
  searchKeyword: string;
  onSearchChange: (kw: string) => void;
  onPostCreated?: (post: SocialPost) => void;
}

export default function FeedControlCard({
  currentFilter,
  onSelectFilter,
  searchKeyword,
  onSearchChange,
  onPostCreated
}: FeedControlCardProps) {
  const { user, userRole } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [postType, setPostType] = useState<PostType>(userRole === 'recruiter' ? 'job_hiring' : 'project_showcase');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  // Specific fields
  const [salaryRange, setSalaryRange] = useState('');
  const [jobLocation, setJobLocation] = useState('TP. Hồ Chí Minh (Hybrid)');
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newPost = socialFeedService.createPost({
      authorId: user?.id || `user_${Date.now()}`,
      authorName: user?.user_metadata?.full_name || (userRole === 'recruiter' ? 'Nhà Tuyển Dụng' : 'Lập Trình Viên'),
      authorRole: userRole || 'student',
      authorHeadline: userRole === 'recruiter' 
        ? (user?.user_metadata?.company_name || 'Doanh Nghiệp Tuyển Dụng')
        : 'Sinh Viên / Lập Trình Viên IT',
      isAuthorVerified: true,
      postType,
      title: title.trim(),
      content: content.trim(),
      tags: tags.length > 0 ? tags : ['CongNghe', 'ProfileHub'],
      jobSalaryRange: postType === 'job_hiring' ? (salaryRange || 'Thỏa Thuận') : undefined,
      jobLocation: postType === 'job_hiring' ? jobLocation : undefined,
      companyName: user?.user_metadata?.company_name,
      projectDemoUrl: postType === 'project_showcase' ? demoUrl : undefined,
      projectGithubUrl: postType === 'project_showcase' ? githubUrl : undefined,
      projectScore: postType === 'project_showcase' ? 'Proof-of-Work' : undefined
    });

    setTitle('');
    setContent('');
    setTagsInput('');
    setSalaryRange('');
    setDemoUrl('');
    setGithubUrl('');
    setIsExpanded(false);
    setIsSubmitting(false);

    if (onPostCreated) onPostCreated(newPost);
  };

  const FILTER_TABS = [
    { id: 'all' as FeedFilter, label: 'Tất Cả', icon: Layers },
    { id: 'job_hiring' as FeedFilter, label: 'Việc Làm', icon: Briefcase },
    { id: 'project_showcase' as FeedFilter, label: 'Đồ Án', icon: FolderGit2 },
    { id: 'tech_discussion' as FeedFilter, label: 'Thảo Luận', icon: MessageSquare }
  ];

  return (
    <div className="bg-white dark:bg-[#111728] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs text-left transition-all">
      
      {/* 1. KHU VỰC SOẠN BÀI (TRÊN CÙNG TRONG THẺ) */}
      {!isExpanded ? (
        <div className="flex items-center gap-3 pb-3.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
            {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0) : 'P'}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-[#161f36] hover:bg-slate-100 dark:hover:bg-[#1c2642] border border-slate-200/70 dark:border-slate-700/70 rounded-xl text-xs text-slate-400 dark:text-slate-400 font-medium text-left transition-colors cursor-pointer"
          >
            {userRole === 'recruiter' 
              ? 'Đăng tin tuyển dụng mới hoặc chia sẻ câu chuyện công ty...' 
              : 'Chia sẻ đồ án thực chiến, đặt câu hỏi hoặc kinh nghiệm...'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5 pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-3.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Tạo Bài Viết Mới</span>
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Post Type Selector */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setPostType('job_hiring')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                postType === 'job_hiring' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-slate-50 dark:bg-[#161f36] text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Tin Tuyển Dụng</span>
            </button>

            <button
              type="button"
              onClick={() => setPostType('project_showcase')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                postType === 'project_showcase' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'bg-slate-50 dark:bg-[#161f36] text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Khoe Đồ Án</span>
            </button>

            <button
              type="button"
              onClick={() => setPostType('tech_discussion')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                postType === 'tech_discussion' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-slate-50 dark:bg-[#161f36] text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Thảo Luận IT</span>
            </button>
          </div>

          {/* Title Input */}
          <div>
            <input
              type="text"
              required
              placeholder="Tiêu đề bài viết..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#161f36] border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white"
            />
          </div>

          {/* Context Fields */}
          {postType === 'job_hiring' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 bg-slate-50 dark:bg-[#161f36]/70 border border-slate-200/80 dark:border-slate-700 rounded-xl">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Dải Lương (VND):</label>
                <input
                  type="text"
                  placeholder="VD: 15,000,000 - 20,000,000 VND"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-[#111728] border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Địa Điểm / Hình Thức:</label>
                <input
                  type="text"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-[#111728] border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {postType === 'project_showcase' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 bg-slate-50 dark:bg-[#161f36]/70 border border-slate-200/80 dark:border-slate-700 rounded-xl">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Link Live Demo:</label>
                <input
                  type="url"
                  placeholder="https://my-app.vercel.app"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-[#111728] border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Link GitHub Code:</label>
                <input
                  type="url"
                  placeholder="https://github.com/user/repo"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-[#111728] border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Content Body */}
          <div>
            <textarea
              required
              rows={3}
              placeholder="Chia sẻ nội dung, bài toán giải quyết, kinh nghiệm thực chiến..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm bg-slate-50 dark:bg-[#161f36] border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-slate-200 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <input
              type="text"
              placeholder="Tags (VD: React, TypeScript, Fresher)..."
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-[#161f36] border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Đăng Bài</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. KHU VỰC BỘ LỌC VÀ TÌM KIẾM (TRONG CÙNG 1 THẺ NÀY) */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Tabs Filter */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto scrollbar-none">
          {FILTER_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectFilter(tab.id)}
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

        {/* Search Input In-Card */}
        <div className="w-full sm:w-56 flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-[#161f36] rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Tìm bài viết, kỹ năng..."
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent outline-none font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 text-xs"
          />
          {searchKeyword && (
            <button 
              onClick={() => onSearchChange('')} 
              className="text-xs text-slate-400 hover:text-slate-600 px-1 font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
