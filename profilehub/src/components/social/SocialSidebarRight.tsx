import React from 'react';
import { 
  Flame, 
  Award, 
  ExternalLink, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Bookmark,
  Layers,
  Briefcase,
  FolderGit2,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import type { FeedFilter } from '../../types/database';

interface SocialSidebarCompactProps {
  currentFilter?: FeedFilter;
  onSelectFilter?: (filter: FeedFilter) => void;
}

export default function SocialSidebarRight({
  currentFilter = 'all',
  onSelectFilter
}: SocialSidebarCompactProps) {
  const { user, userRole } = useAuth();

  const HOT_JOBS = [
    {
      id: 'job_vng_1',
      title: 'Frontend ReactJS Fresher',
      company: 'VNG Corporation',
      salary: '14 - 18 Triệu',
      location: 'TP.HCM (Hybrid)',
    },
    {
      id: 'job_momo_2',
      title: 'Backend Golang / Node.js',
      company: 'MoMo Fintech',
      salary: '15 - 22 Triệu',
      location: 'TP.HCM',
    },
    {
      id: 'job_fpt_3',
      title: 'Fullstack AI Web Engineer',
      company: 'FPT Software',
      salary: '16 - 25 Triệu',
      location: 'Đà Nẵng / Remote',
    }
  ];

  const TOP_PROJECTS = [
    {
      id: 'p1',
      title: 'Web 3D Medical AI Viewer',
      author: 'Lê Quỳnh Nga',
      tag: 'Three.js & AI'
    },
    {
      id: 'p2',
      title: 'E-commerce Microservices',
      author: 'Nguyễn Văn An',
      tag: 'Go & Docker'
    }
  ];

  return (
    <aside className="w-full space-y-4 text-left sticky top-20">
      
      {/* 1. Mini Profile Panel (Tối giản, trang nhã, không màu mè) */}
      <div className="bg-white dark:bg-[#111728] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
            {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0) : 'P'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.user_metadata?.full_name || 'Khách Ghé Thăm'}
              </h4>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {userRole === 'recruiter' 
                ? (user?.user_metadata?.company_name || 'Nhà Tuyển Dụng') 
                : 'Lập trình viên IT'}
            </p>
          </div>
        </div>

        {user ? (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-center text-[11px]">
            <div className="bg-slate-50 dark:bg-[#161f36] p-2 rounded-xl">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">3</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Đồ án thực tế</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#161f36] p-2 rounded-xl">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 block">95%</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Điểm chuẩn ATS</span>
            </div>
          </div>
        ) : (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <Link
              to="/login"
              className="w-full py-1.5 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl flex items-center justify-center transition-colors"
            >
              Đăng nhập để tương tác
            </Link>
          </div>
        )}
      </div>

      {/* 2. Hot Jobs Spotlight Widget (Sạch sẽ, danh sách phẳng) */}
      <div className="bg-white dark:bg-[#111728] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Việc Làm Nổi Bật
            </h3>
          </div>
          <Link
            to="/jobs"
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
          >
            <span>Tất cả</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {HOT_JOBS.map((job) => (
            <div 
              key={job.id} 
              className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#161f36] transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                  {job.title}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                  {job.salary}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="truncate max-w-[130px] flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" /> {job.company}
                </span>
                <span>{job.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Top Verified Projects Widget */}
      <div className="bg-white dark:bg-[#111728] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Đồ Án Tiêu Biểu
            </h3>
          </div>
          <Link
            to="/showcase"
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
          >
            <span>Showcase</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {TOP_PROJECTS.map((proj) => (
            <div 
              key={proj.id} 
              className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#161f36] transition-colors"
            >
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{proj.title}</h4>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <span>{proj.author}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
                  {proj.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Footer Mini */}
      <div className="text-[11px] text-slate-400 dark:text-slate-500 px-2 space-y-1">
        <p className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Bằng chứng năng lực thực tế & chuẩn hóa ATS</span>
        </p>
        <p className="text-[10px]">© 2026 ProfileHub SaaS Platform</p>
      </div>

    </aside>
  );
}
