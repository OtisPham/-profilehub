import React from 'react';
import { 
  Flame, 
  Award, 
  ExternalLink, 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SocialSidebarRight() {
  const HOT_JOBS = [
    {
      id: 'job_vng_1',
      title: 'Frontend ReactJS Fresher',
      company: 'VNG Corporation',
      salary: '14 - 18 Triệu',
      location: 'TP.HCM (Hybrid)',
      verified: true
    },
    {
      id: 'job_momo_2',
      title: 'Backend Golang / Node.js',
      company: 'MoMo Fintech',
      salary: '15 - 22 Triệu',
      location: 'TP.HCM',
      verified: true
    },
    {
      id: 'job_fpt_3',
      title: 'Fullstack AI Web Engineer',
      company: 'FPT Software',
      salary: '16 - 25 Triệu',
      location: 'Đà Nẵng / Remote',
      verified: true
    }
  ];

  const TOP_PROJECTS = [
    {
      id: 'p1',
      title: 'Web 3D Medical AI Viewer',
      author: 'Lê Quỳnh Nga',
      score: '9.6/10',
      tag: 'Three.js'
    },
    {
      id: 'p2',
      title: 'E-commerce Microservices',
      author: 'Nguyễn Văn An',
      score: '9.4/10',
      tag: 'Go & Docker'
    },
    {
      id: 'p3',
      title: 'Real-time Collaborative Canvas',
      author: 'Trần Minh Hoàng',
      score: '9.2/10',
      tag: 'WebRTC'
    }
  ];

  return (
    <aside className="w-full space-y-4 text-left">
      
      {/* Hot Jobs Spotlight Widget */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">Việc Làm IT Hot Nhất</h3>
          </div>
          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
            Top Tuần
          </span>
        </div>

        <div className="space-y-3">
          {HOT_JOBS.map((job) => (
            <div 
              key={job.id} 
              className="p-3 bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-200 rounded-2xl transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-[170px]">
                  {job.title}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 shrink-0">
                  {job.salary}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate max-w-[130px] flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" /> {job.company}
                </span>
                <span>{job.location}</span>
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/jobs"
          className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
        >
          <span>Xem tất cả tin tuyển dụng</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Top Verified Projects Widget */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">Đồ Án Điểm Cao</h3>
          </div>
          <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
            Bảo Chứng
          </span>
        </div>

        <div className="space-y-3">
          {TOP_PROJECTS.map((proj) => (
            <div 
              key={proj.id} 
              className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{proj.title}</h4>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <span>{proj.author}</span> • <span className="text-indigo-600 font-semibold">{proj.tag}</span>
                </p>
              </div>
              <span className="text-xs font-black text-purple-600 bg-purple-50 border border-purple-200/60 px-2 py-1 rounded-xl">
                {proj.score}
              </span>
            </div>
          ))}
        </div>

        <Link
          to="/showcase"
          className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
        >
          <span>Khám phá Cổng Showcase</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Platform Guarantee Pill */}
      <div className="text-[11px] text-slate-600 px-3 text-center space-y-1">
        <p className="flex items-center justify-center gap-1 text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>100% việc làm & đồ án có thẩm định</span>
        </p>
        <p className="text-[10px] text-slate-500">© 2026 ProfileHub SaaS Platform</p>
      </div>

    </aside>
  );
}
