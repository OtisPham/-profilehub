import React from 'react';
import { 
  User, 
  Briefcase, 
  FolderGit2, 
  Sparkles, 
  Bookmark, 
  TrendingUp, 
  ShieldCheck, 
  Award,
  Layers,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import type { FeedFilter } from '../../types/database';

interface SocialSidebarLeftProps {
  currentFilter: FeedFilter;
  onSelectFilter: (filter: FeedFilter) => void;
  postsCountByFilter?: Record<string, number>;
}

export default function SocialSidebarLeft({
  currentFilter,
  onSelectFilter,
  postsCountByFilter = {}
}: SocialSidebarLeftProps) {
  const { user, userRole } = useAuth();

  const FILTER_MENU_ITEMS: { id: FeedFilter; label: string; icon: any; countKey?: string }[] = [
    { id: 'all', label: 'Dòng Tin Tất Cả', icon: Layers },
    { id: 'job_hiring', label: 'Cơ Hội Việc Làm IT', icon: Briefcase },
    { id: 'project_showcase', label: 'Đồ Án Bảo Chứng', icon: FolderGit2 },
    { id: 'tech_discussion', label: 'Thảo Luận & Tips', icon: MessageSquare },
    { id: 'saved', label: 'Bài Viết Đã Lưu', icon: Bookmark },
  ];

  return (
    <aside className="w-full space-y-4 text-left">
      
      {/* Mini Profile Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs overflow-hidden relative">
        <div className="h-16 -mx-5 -mt-5 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 relative">
          <div className="absolute top-2 right-3">
            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold backdrop-blur-xs">
              {userRole === 'recruiter' ? '🏢 Doanh Nghiệp' : '👨‍💻 Ứng Viên'}
            </span>
          </div>
        </div>

        <div className="relative -mt-8 mb-3 flex items-end justify-between">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 border-4 border-white text-white font-black text-xl flex items-center justify-center shadow-md">
            {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0) : 'P'}
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Đã Xác Thực
          </span>
        </div>

        <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight truncate">
          {user?.user_metadata?.full_name || 'Khách Ghé Thăm ProfileHub'}
        </h3>
        
        <p className="text-xs text-slate-500 mb-4 line-clamp-1">
          {userRole === 'recruiter' 
            ? (user?.user_metadata?.company_name || 'Nhà Tuyển Dụng Công Nghệ')
            : 'Lập Trình Viên Đam Mê Sản Phẩm Thực Chiến'}
        </p>

        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-50 p-2 rounded-xl">
            <span className="text-xs font-bold text-slate-800 block">3</span>
            <span className="text-[10px] text-slate-500">Đồ án thực chiến</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl">
            <span className="text-xs font-bold text-indigo-600 block">95/100</span>
            <span className="text-[10px] text-slate-500">Điểm ATS CV</span>
          </div>
        </div>
      </div>

      {/* Navigation Filter Menu */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-3 shadow-xs space-y-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 block">
          Khám Phá Dòng Tin
        </span>

        {FILTER_MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentFilter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectFilter(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Career Growth Widget */}
      <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-100 rounded-3xl p-4.5 text-left">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs mb-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Điểm Sáng Nghề Nghiệp</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Ứng viên có đồ án thực chiến kèm Live Demo & GitHub tăng <strong className="text-indigo-700">3.8 lần</strong> cơ hội được Tech Lead mời phỏng vấn trực tiếp.
        </p>
      </div>

    </aside>
  );
}
