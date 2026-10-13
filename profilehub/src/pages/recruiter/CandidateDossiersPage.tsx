import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabase';
import { getSharedPipeline } from '../../utils/pipelineSync';
import {
  Folder,
  FolderOpen,
  FileText,
  Mail,
  Search,
  Filter,
  ShieldCheck,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Clock,
  Layers,
  ArrowUpRight,
  Eye,
  FileDown
} from 'lucide-react';
import CandidateDossierModal, { type DossierCandidate } from '../../components/recruiter/CandidateDossierModal';

const INITIAL_DOSSIERS: DossierCandidate[] = [
  {
    id: 'dossier-1',
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan.dev@gmail.com',
    phone: '0901 234 567',
    location: 'Quận 1, TP. Hồ Chí Minh',
    role: 'Frontend ReactJS Developer',
    major: 'Kỹ thuật Phần mềm',
    university: 'Đại Học Bách Khoa TP.HCM (HCMUT)',
    gpa: '3.82 / 4.0',
    skills: ['ReactJS', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Next.js', 'REST API'],
    bio: 'Lập trình viên Frontend đam mê xây dựng giao diện người dùng mượt mà, tối ưu hiệu năng và đạt chuẩn Accessibility.',
    appliedDate: '08/10/2026',
    stage: 'discovered',
    matchScore: 96,
    verifiedProjectsCount: 3,
    coverLetterTone: 'confident',
    projects: [
      {
        id: 'p1',
        title: 'Hệ Thống Quản Lý Giáo Dục Đại Học E-Learning',
        description: 'Phát triển Frontend ReactJS & TypeScript với hơn 15,000 người dùng hoạt động.',
        role: 'Frontend Lead',
        is_verified: true,
        score: '9.5 / 10',
        demo_url: 'https://elearning-demo.vn',
        github_url: 'https://github.com/nguyenvanan/elearning-react'
      },
      {
        id: 'p2',
        title: 'Ứng Dụng E-Commerce Micro-Frontend',
        description: 'Tối ưu Core Web Vitals và tích hợp cổng thanh toán trực tuyến bảo mật.',
        role: 'Frontend Developer',
        is_verified: true,
        score: '9.0 / 10'
      }
    ]
  },
  {
    id: 'dossier-2',
    name: 'Phạm Thái Bảo',
    email: 'thaibao.pham@gmail.com',
    phone: '0912 345 678',
    location: 'TP. Thủ Đức, TP. Hồ Chí Minh',
    role: 'Backend / Distributed Systems Fresher',
    major: 'Khoa học Máy tính',
    university: 'Đại Học Sư Phạm Kỹ Thuật (HCMUTE)',
    gpa: '3.85 / 4.0',
    skills: ['Node.js', 'NestJS', 'PostgreSQL', 'Redis', 'Docker', 'Microservices'],
    bio: 'Thế mạnh về thiết kế cơ sở dữ liệu quan hệ, tối ưu truy vấn SQL và xây dựng hệ thống phân tán chịu tải cao.',
    appliedDate: '06/10/2026',
    stage: 'shortlisted',
    matchScore: 94,
    verifiedProjectsCount: 3,
    coverLetterTone: 'passionate',
    projects: [
      {
        id: 'p3',
        title: 'High-Throughput Order Processing Engine',
        description: 'Xử lý 2,000 transactions/giây với Redis Queue và PostgreSQL partitioned tables.',
        role: 'Backend Architect',
        is_verified: true,
        score: '9.8 / 10',
        github_url: 'https://github.com/thaibao/order-engine'
      }
    ]
  },
  {
    id: 'dossier-3',
    name: 'Trần Thị Bích',
    email: 'bich.tran@gmail.com',
    phone: '0988 765 432',
    location: 'Quận 7, TP. Hồ Chí Minh',
    role: 'UI/UX & Product Designer',
    major: 'Thiết Kế Đồ Họa / Tương Tác',
    university: 'Đại Học Kiến Trúc TP.HCM',
    gpa: '3.75 / 4.0',
    skills: ['Figma Design System', 'User Research', 'Wireframing', 'Prototyping', 'Design Tokens'],
    bio: 'Chuyên gia thiết kế Design System chuẩn doanh nghiệp, tập trung vào trải nghiệm người dùng tinh tế và nghiên cứu hành vi khách hàng.',
    appliedDate: '04/10/2026',
    stage: 'interview',
    matchScore: 91,
    verifiedProjectsCount: 2,
    coverLetterTone: 'polite',
    projects: [
      {
        id: 'p4',
        title: 'Banking Mobile App Redesign & Design System',
        description: 'Thiết kế trọn bộ 120+ màn hình và hệ thống Design Token tương thích đa nền tảng.',
        role: 'Lead UI/UX Designer',
        is_verified: true,
        score: '9.2 / 10'
      }
    ]
  },
  {
    id: 'dossier-4',
    name: 'Lê Hoàng Cường',
    email: 'cuong.le@gmail.com',
    phone: '0933 222 111',
    location: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
    role: 'Fullstack Web Developer',
    major: 'Hệ thống Thông tin',
    university: 'ĐH Công Nghệ Thông Tin (UIT)',
    gpa: '3.68 / 4.0',
    skills: ['React', 'Next.js', 'Node.js', 'MongoDB', 'AWS', 'GraphQL'],
    bio: 'Kinh nghiệm triển khai dự án End-to-End từ kiến trúc máy chủ đến giao diện người dùng.',
    appliedDate: '01/10/2026',
    stage: 'hired',
    matchScore: 95,
    verifiedProjectsCount: 4,
    coverLetterTone: 'concise',
    projects: [
      {
        id: 'p5',
        title: 'AI Portfolio & Job Matching Platform',
        description: 'Ứng dụng AI phân tích CV và tự động khớp đồ án với yêu cầu công việc của nhà tuyển dụng.',
        role: 'Fullstack Lead',
        is_verified: true,
        score: '9.6 / 10'
      }
    ]
  }
];

export default function CandidateDossiersPage() {
  const { user } = useAuth();
  const [dossiers, setDossiers] = useState<DossierCandidate[]>(INITIAL_DOSSIERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selectedDossier, setSelectedDossier] = useState<DossierCandidate | null>(null);

  // Load pipeline candidates from storage if available
  useEffect(() => {
    const shared = getSharedPipeline(user?.id);
    if (shared && shared.length > 0) {
      const mappedFromPipeline: DossierCandidate[] = shared.map(item => {
        const student = item.student as any;
        return {
          id: item.id,
          name: student?.full_name || 'Ứng viên tiềm năng',
          email: student?.email || 'candidate@profilehub.edu.vn',
          phone: student?.phone || '0901 234 567',
          location: student?.location || 'TP. Hồ Chí Minh',
          role: student?.major || 'Chuyên viên Công Nghệ',
          major: student?.major || 'Công Nghệ Thông Tin',
          university: student?.university || 'Đại Học Đối Tác',
          gpa: student?.gpa || '3.7 / 4.0',
          skills: student?.skills || ['React', 'TypeScript', 'SQL', 'Git'],
          bio: student?.bio || 'Ứng viên có năng lực tốt và đồ án đã xác thực.',
          appliedDate: new Date(item.created_at || Date.now()).toLocaleDateString('vi-VN'),
          stage: item.stage || 'discovered',
          matchScore: 92,
          verifiedProjectsCount: student?.verified_projects_count || 2,
          projects: student?.projects || []
        };
      });

      // Combine with initial dossiers without duplicates
      const ids = new Set(mappedFromPipeline.map(m => m.id));
      const combined = [...mappedFromPipeline, ...INITIAL_DOSSIERS.filter(d => !ids.has(d.id))];
      setDossiers(combined);
    }
  }, [user]);

  const filteredDossiers = dossiers.filter(d => {
    const matchSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.role && d.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.major && d.major.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.skills && d.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchStage = stageFilter === 'all' || d.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const getStageBadge = (stage?: string) => {
    switch (stage) {
      case 'shortlisted':
        return { label: 'Đã Chọn (Shortlist)', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'interview':
        return { label: 'Phỏng Vấn', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'hired':
        return { label: 'Đã Tuyển Dụng', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'contacted':
        return { label: 'Đã Liên Hệ', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'discovered':
      default:
        return { label: 'Hồ Sơ Mới', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const handleMoveStage = (candidateId: string, newStage: string) => {
    setDossiers(prev =>
      prev.map(d => (d.id === candidateId ? { ...d, stage: newStage } : d))
    );
    if (selectedDossier && selectedDossier.id === candidateId) {
      setSelectedDossier(prev => (prev ? { ...prev, stage: newStage } : null));
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col bg-[#f8fafc] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased">
      
      {/* Top Header */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between shrink-0 z-20 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Portal Tuyển Dụng /</span>
              <h1 className="text-sm sm:text-base font-bold text-blue-950 dark:text-white">
                Thư Mục Cặp Hồ Sơ Ứng Tuyển (Candidate Dossiers)
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Quản lý trọn gói 2 trong 1: CV Năng Lực + Thư Giới Thiệu (Cover Letter) theo từng ứng viên
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
            <Folder className="w-3.5 h-3.5 text-amber-600" />
            <span>{filteredDossiers.length} Thư Mục Hồ Sơ</span>
          </span>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center justify-between flex-wrap gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên ứng viên, vị trí tuyển dụng, kỹ năng..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Lọc trạng thái:
            </span>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="all">Tất cả giai đoạn</option>
              <option value="discovered">Hồ sơ mới</option>
              <option value="shortlisted">Đã chọn (Shortlist)</option>
              <option value="interview">Phỏng vấn</option>
              <option value="hired">Đã tuyển dụng</option>
            </select>
          </div>
        </div>

        {/* Folders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDossiers.map((dossier) => {
            const stageBadge = getStageBadge(dossier.stage);
            return (
              <div
                key={dossier.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-xl hover:border-amber-400/80 transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Folder Tab Decorative Header */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

                <div>
                  {/* Folder Meta & Stage Badge */}
                  <div className="flex items-start justify-between gap-2 pt-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/70 flex items-center justify-center shrink-0">
                        <Folder className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10.5px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                          Thư Mục Hồ Sơ
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          Nộp ngày {dossier.appliedDate}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${stageBadge.color}`}>
                      {stageBadge.label}
                    </span>
                  </div>

                  {/* Candidate Name & Role */}
                  <div className="mb-4">
                    <h3 className="text-base sm:text-lg font-black text-blue-950 dark:text-white group-hover:text-blue-600 transition-colors">
                      {dossier.name}
                    </h3>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                      {dossier.role || dossier.major}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      🏫 {dossier.university}
                    </p>
                  </div>

                  {/* Inside Folder Preview: 2 Contained Documents */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3.5 border border-slate-200/70 dark:border-slate-700/60 space-y-2 mb-4">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>2 Tài Liệu Đính Kèm:</span>
                      <span className="text-emerald-600 font-bold">GPA: {dossier.gpa || '3.8'}</span>
                    </div>

                    {/* Doc 1: CV */}
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          1. Bản CV Năng Lực (ATS)
                        </span>
                      </div>
                      {dossier.verifiedProjectsCount !== undefined && dossier.verifiedProjectsCount > 0 && (
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100 flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          {dossier.verifiedProjectsCount} Verified
                        </span>
                      )}
                    </div>

                    {/* Doc 2: Cover Letter */}
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          2. Thư Giới Thiệu (Word A4)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-100">
                        .docx / PDF
                      </span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  {dossier.skills && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {dossier.skills.slice(0, 4).map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10.5px] font-medium rounded-md"
                        >
                          {sk}
                        </span>
                      ))}
                      {dossier.skills.length > 4 && (
                        <span className="px-1.5 py-0.5 text-slate-400 text-[10px]">
                          +{dossier.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Open Folder Button */}
                <button
                  onClick={() => setSelectedDossier(dossier)}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Mở Cặp Hồ Sơ (Xem CV & Thư)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

              </div>
            );
          })}
        </div>

      </main>

      {/* Candidate Dossier 2-in-1 Modal */}
      <CandidateDossierModal
        isOpen={Boolean(selectedDossier)}
        onClose={() => setSelectedDossier(null)}
        candidate={selectedDossier}
        onMoveStage={handleMoveStage}
      />

    </div>
  );
}
