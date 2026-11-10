import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Briefcase, 
  FolderGit2, 
  MessageSquare, 
  DollarSign, 
  Tag, 
  Link2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import { socialFeedService } from '../../services/socialFeedService';
import type { PostType, SocialPost } from '../../types/database';

interface CreatePostBoxProps {
  onPostCreated?: (post: SocialPost) => void;
}

export default function CreatePostBox({ onPostCreated }: CreatePostBoxProps) {
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
        : 'Sinh Viên / Lập Trình Viên Tài Năng',
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
      projectScore: postType === 'project_showcase' ? '9.5/10 (Demo-Ready)' : undefined
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

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs text-left mb-6 transition-all">
      {!isExpanded ? (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center shrink-0">
            {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0) : 'P'}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex-1 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs text-slate-500 font-medium text-left transition-colors cursor-pointer"
          >
            {userRole === 'recruiter' 
              ? 'Đăng tin tuyển dụng mới hoặc chia sẻ câu chuyện văn hóa công ty...' 
              : 'Chia sẻ đồ án thực chiến mới, đặt câu hỏi hoặc trao đổi kinh nghiệm...'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Tạo Bài Viết Mới Trên Dòng Tin
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Post Type Selector */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPostType('job_hiring')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                postType === 'job_hiring' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> 💼 Tin Tuyển Dụng
            </button>

            <button
              type="button"
              onClick={() => setPostType('project_showcase')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                postType === 'project_showcase' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" /> 🚀 Khoe Đồ Án
            </button>

            <button
              type="button"
              onClick={() => setPostType('tech_discussion')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                postType === 'tech_discussion' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> 💡 Thảo Luận & Tips
            </button>
          </div>

          {/* Title Input */}
          <div>
            <input
              type="text"
              required
              placeholder="Tiêu đề bài viết (VD: Tuyển dụng React Fresher / Khoe đồ án Web 3D...)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-900"
            />
          </div>

          {/* Context-Specific Inputs */}
          {postType === 'job_hiring' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl">
              <div>
                <label className="text-[11px] font-bold text-indigo-900 block mb-1">Dải Lương (VND):</label>
                <input
                  type="text"
                  placeholder="VD: 15,000,000 - 20,000,000 VND"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg outline-none font-medium"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-indigo-900 block mb-1">Địa Điểm / Hình Thức:</label>
                <input
                  type="text"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg outline-none font-medium"
                />
              </div>
            </div>
          )}

          {postType === 'project_showcase' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-purple-50/60 border border-purple-100 rounded-2xl">
              <div>
                <label className="text-[11px] font-bold text-purple-900 block mb-1">Link Live Demo:</label>
                <input
                  type="url"
                  placeholder="https://my-app.vercel.app"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-purple-200 rounded-lg outline-none font-medium"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-purple-900 block mb-1">Link GitHub Code:</label>
                <input
                  type="url"
                  placeholder="https://github.com/user/repo"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-purple-200 rounded-lg outline-none font-medium"
                />
              </div>
            </div>
          )}

          {/* Content Body */}
          <div>
            <textarea
              required
              rows={4}
              placeholder="Chia sẻ chi tiết nội dung, bài toán giải quyết, kinh nghiệm thực chiến..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-normal resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <input
              type="text"
              placeholder="Gắn tags cách nhau bằng dấu phẩy (VD: ReactJS, TypeScript, TuyểnDụng, Lương15M)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Đăng Lên Dòng Tin
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
