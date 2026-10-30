import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabase';
import AddProjectModal from '../../components/projects/AddProjectModal';
import VerifiedBadge from '../../components/common/VerifiedBadge';
import ProjectFilePreviewHeader from '../../components/projects/ProjectFilePreviewHeader';
import ProjectQRCodeModal from '../../components/student/ProjectQRCodeModal';
import type { VerificationStatus } from '../../types/database';
import { 
  Building2, Code2, GraduationCap, Shield, Search, Plus, 
  ExternalLink, Github, Figma, FileText, Sparkles, QrCode, 
  Edit3, Trash2, Target, Layers, TrendingUp, Users, ArrowUpRight,
  FolderGit2, CheckCircle2, Terminal, Copy, Check, Share2
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  project_type: string;
  score?: string;
  description: string;
  is_verified?: boolean;
  role: string;
  team_size: string;
  instructor?: string;
  tags: string[];
  image_url: string;
  demo_url?: string;
  github_url?: string;
  figma_url?: string;
  doc_url?: string;
  verification_status?: VerificationStatus;
  teacher_feedback?: string;
}

export default function MyProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'enterprise' | 'opensource' | 'academic'>('all');
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [qrModalProject, setQrModalProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopiedShowcase, setIsCopiedShowcase] = useState(false);
  const [copiedProjectId, setCopiedProjectId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopyShowcaseLink = () => {
    const showcaseUrl = `${window.location.origin}/showcase/${user?.id || 'demo'}`;
    navigator.clipboard.writeText(showcaseUrl);
    setIsCopiedShowcase(true);
    setToastMessage('Đã sao chép link Showcase toàn bộ dự án! Người nhận truy cập là xem được ngay mà không cần đăng nhập.');
    setTimeout(() => {
      setIsCopiedShowcase(false);
      setToastMessage(null);
    }, 4000);
  };

  const handleCopySingleProjectLink = (projId: string) => {
    const projectUrl = `${window.location.origin}/showcase/${user?.id || 'demo'}#project-${projId}`;
    navigator.clipboard.writeText(projectUrl);
    setCopiedProjectId(projId);
    setToastMessage('Đã sao chép liên kết trực tiếp tới dự án này!');
    setTimeout(() => {
      setCopiedProjectId(null);
      setToastMessage(null);
    }, 3000);
  };

  // Fetch Projects from Supabase
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('student_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const formattedData = data.map(item => ({
        ...item,
        tags: item.tags || []
      }));
      setProjects(formattedData);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, fetchProjects]);

  const handleDelete = async (projectId: string) => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa Case Study dự án này không?");
    if (!isConfirm) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      alert("Lỗi khi xóa: " + error.message);
    } else {
      fetchProjects();
    }
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (proj: Project) => {
    setEditingProject(proj);
    setIsModalOpen(true);
  };

  // Helper to parse STAR framework from description
  const parseSTAR = (desc: string) => {
    if (!desc) return null;
    const challenge = desc.match(/🎯\s*Bài toán & Thách thức:\s*([\s\S]*?)(?=⚙️\s*Giải pháp & Kiến trúc:|$)/i);
    const architecture = desc.match(/⚙️\s*Giải pháp & Kiến trúc:\s*([\s\S]*?)(?=📈\s*Tác động & Chỉ số:|$)/i);
    const impact = desc.match(/📈\s*Tác động & Chỉ số:\s*([\s\S]*?)$/i);

    if (challenge || architecture || impact) {
      return {
        challenge: challenge ? challenge[1].trim() : '',
        architecture: architecture ? architecture[1].trim() : '',
        impact: impact ? impact[1].trim() : ''
      };
    }
    return null;
  };

  // Metrics
  const stats = useMemo(() => {
    const enterprise = projects.filter(p => (p.project_type || '').toLowerCase().includes('doanh nghiệp') || (p.project_type || '').toLowerCase().includes('khách hàng')).length;
    const opensource = projects.filter(p => (p.project_type || '').toLowerCase().includes('mã nguồn mở') || (p.project_type || '').toLowerCase().includes('cá nhân')).length;
    const academic = projects.filter(p => (p.project_type || '').toLowerCase().includes('học thuật') || (p.project_type || '').toLowerCase().includes('tốt nghiệp')).length;
    return { enterprise, opensource, academic, total: projects.length };
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(proj => {
      const pType = (proj.project_type || '').toLowerCase();
      const matchSearch = (
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (proj.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (proj.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      if (!matchSearch) return false;

      if (selectedFilter === 'enterprise') {
        return pType.includes('doanh nghiệp') || pType.includes('khách hàng') || pType.includes('production');
      }
      if (selectedFilter === 'opensource') {
        return pType.includes('mã nguồn mở') || pType.includes('cá nhân') || pType.includes('open source');
      }
      if (selectedFilter === 'academic') {
        return pType.includes('học thuật') || pType.includes('tốt nghiệp') || pType.includes('nckh') || pType.includes('môn học');
      }
      return true;
    });
  }, [projects, searchQuery, selectedFilter]);

  const formatExternalUrl = (url?: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Sub-Header / Breadcrumbs bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-20 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-slate-900 font-bold flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4 text-indigo-600" />
              Technical Portfolio
            </span>
            <span>/</span>
            <span className="text-slate-600">Architecture Case Studies</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">{user?.email}</span>
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-100">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 text-xs animate-in slide-in-from-top-3 duration-200">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="font-medium text-slate-200">{toastMessage}</span>
          </div>
        )}
        
        {/* ITviec-Inspired Hero Metric Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl border border-slate-800">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                Evidence-Based Engineering Portfolio
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Hồ Sơ Năng Lực & Minh Chứng Kỹ Thuật
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed">
                Được chuẩn hóa theo tiêu chuẩn tuyển dụng của các công ty công nghệ lớn: 
                tập trung vào <strong className="text-white">Kiến trúc hệ thống (System Design)</strong>, 
                <strong className="text-white"> Mã nguồn GitHub</strong> và <strong className="text-white">Tác động đo lường được (STAR)</strong>.
              </p>

              {/* Quick Metrics */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-200 font-medium flex items-center gap-1.5">
                  📦 <strong>{stats.total}</strong> Dự án
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300 font-medium flex items-center gap-1.5">
                  ● <strong>{stats.opensource}</strong> Open Source
                </span>
                <span className="px-3 py-1 rounded-lg bg-blue-950/60 border border-blue-800/60 text-xs text-blue-300 font-medium flex items-center gap-1.5">
                  🏢 <strong>{stats.enterprise}</strong> Production
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyShowcaseLink}
                  className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700/80 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  title="Sao chép link Showcase toàn bộ dự án để gửi nhà tuyển dụng"
                >
                  {isCopiedShowcase ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Đã chép link!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Sao Chép Link Showcase</span>
                    </>
                  )}
                </button>

                <a
                  href={`/showcase/${user?.id || 'demo'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  title="Mở xem trước trang Showcase công khai như nhà tuyển dụng thấy"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Xem Công Khai</span>
                </a>

                <button
                  onClick={handleAddNew}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Đăng Tải Dự Án</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400 hidden sm:block">
                💡 Bất kỳ ai có link đều xem được danh sách dự án mà không cần đăng nhập
              </span>
            </div>
          </div>
        </div>

        {/* Control Toolbar: Filter Pills + Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          
          {/* Segmented Filter Pills (ITviec Style) */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-x-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Tất cả ({projects.length})
            </button>
            <button
              onClick={() => setSelectedFilter('enterprise')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedFilter === 'enterprise'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Production & Doanh nghiệp ({stats.enterprise})</span>
            </button>
            <button
              onClick={() => setSelectedFilter('opensource')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedFilter === 'opensource'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Open Source ({stats.opensource})</span>
            </button>
            <button
              onClick={() => setSelectedFilter('academic')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedFilter === 'academic'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Học thuật & Đồ án ({stats.academic})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Tìm theo tên repo, vai trò, công nghệ..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
            />
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {loading ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-sm">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Đang tải danh sách Case Studies...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full py-16 px-4 text-center bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Chưa có dự án nào trong mục này</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                Hãy bổ sung các dự án cá nhân, đồ án tốt nghiệp hoặc ứng dụng thực tế để làm bằng chứng thuyết phục nhà tuyển dụng.
              </p>
              <button 
                onClick={handleAddNew} 
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
              >
                + Thêm dự án ngay
              </button>
            </div>
          ) : (
            filteredProjects.map((proj) => {
              const isNDA = (proj.title || '').includes('[NDA]') || (proj.description || '').includes('[Confidential]');
              const cleanTitle = (proj.title || '').replace('[NDA]', '').trim();
              const starData = parseSTAR(proj.description);

              const isEnterpriseType = (proj.project_type || '').toLowerCase().includes('doanh nghiệp') || (proj.project_type || '').toLowerCase().includes('khách hàng');
              const isOpenSourceType = (proj.project_type || '').toLowerCase().includes('mã nguồn mở');

              return (
                <div 
                  key={proj.id} 
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 overflow-hidden flex flex-col shadow-xs hover:shadow-lg transition-all duration-200 group"
                >
                  
                  {/* Thumbnail / Architecture Preview Header */}
                  <ProjectFilePreviewHeader project={proj} />

                  <div className="p-5 flex-1 flex flex-col">
                    
                    {/* Header Badges Row */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isEnterpriseType ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                            <Building2 className="w-3 h-3" /> Production
                          </span>
                        ) : isOpenSourceType ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            <Code2 className="w-3 h-3" /> Open Source
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">
                            <GraduationCap className="w-3 h-3" /> Học Thuật
                          </span>
                        )}

                        {isNDA && (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                            <Shield className="w-2.5 h-2.5 text-amber-600" /> NDA
                          </span>
                        )}
                      </div>

                      {(proj.verification_status === 'verified' || proj.is_verified) && (
                        <VerifiedBadge size="sm" />
                      )}
                    </div>

                    {/* Project Title */}
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug mb-2 group-hover:text-indigo-600 transition-colors">
                      {cleanTitle}
                    </h3>

                    {/* Role & Team Metadata Pill */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-700">{proj.role || 'Kỹ sư phát triển'}</span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-[11.5px]">
                        <Users className="w-3 h-3 text-slate-400" />
                        {proj.team_size || 'Cá nhân'}
                      </span>
                    </div>

                    {/* STAR Framework Content Callouts */}
                    {starData ? (
                      <div className="space-y-2 mb-4 text-xs">
                        {starData.challenge && (
                          <div className="bg-amber-50/70 border-l-2 border-amber-500 p-2 rounded-r-lg">
                            <div className="font-bold text-amber-900 text-[11px] flex items-center gap-1 mb-0.5">
                              <Target className="w-3 h-3 text-amber-600" /> Bài toán:
                            </div>
                            <p className="text-amber-950/80 leading-relaxed line-clamp-2">
                              {starData.challenge}
                            </p>
                          </div>
                        )}

                        {starData.architecture && (
                          <div className="bg-blue-50/70 border-l-2 border-blue-500 p-2 rounded-r-lg">
                            <div className="font-bold text-blue-900 text-[11px] flex items-center gap-1 mb-0.5">
                              <Layers className="w-3 h-3 text-blue-600" /> Giải pháp:
                            </div>
                            <p className="text-blue-950/80 leading-relaxed line-clamp-2">
                              {starData.architecture}
                            </p>
                          </div>
                        )}

                        {starData.impact && (
                          <div className="bg-emerald-50/70 border-l-2 border-emerald-500 p-2 rounded-r-lg">
                            <div className="font-bold text-emerald-900 text-[11px] flex items-center gap-1 mb-0.5">
                              <TrendingUp className="w-3 h-3 text-emerald-600" /> Tác động:
                            </div>
                            <p className="text-emerald-950/80 leading-relaxed line-clamp-2">
                              {starData.impact}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                        {proj.description ? proj.description.replace('[Confidential / NDA Protected]', '').trim() : 'Chưa có mô tả chi tiết.'}
                      </p>
                    )}

                    {/* Tech Stack Pills (Signature ITviec Tag Style) */}
                    <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                      {proj.tags && proj.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60 hover:bg-slate-200 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* External Evidence Links */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 text-xs">
                      {proj.github_url && (
                        <a 
                          href={formatExternalUrl(proj.github_url)} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-white font-medium text-[11px] transition shadow-2xs"
                        >
                          <Github className="w-3 h-3" />
                          <span>Code</span>
                          <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      )}

                      {proj.demo_url && (
                        <a 
                          href={formatExternalUrl(proj.demo_url)} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-[11px] border border-blue-200/60 transition"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Live Demo</span>
                        </a>
                      )}

                      {proj.figma_url && (
                        <a 
                          href={formatExternalUrl(proj.figma_url)} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium text-[11px] border border-purple-200/60 transition"
                        >
                          <Figma className="w-3 h-3" />
                          <span>Figma</span>
                        </a>
                      )}

                      {proj.doc_url && (
                        <a 
                          href={formatExternalUrl(proj.doc_url)} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-[11px] border border-emerald-200/60 transition"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Spec</span>
                        </a>
                      )}

                      {/* Management Action Buttons */}
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          onClick={() => handleCopySingleProjectLink(proj.id)}
                          title="Sao chép link chia sẻ dự án này cho nhà tuyển dụng"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          {copiedProjectId === proj.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => setQrModalProject(proj)}
                          title="Tạo Smart QR Code"
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(proj)}
                          title="Chỉnh sửa Case Study"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id)}
                          title="Xóa Case Study"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}

        </div>

      </div>

      {/* Modals */}
      {isModalOpen && (
        <AddProjectModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchProjects();
            setIsModalOpen(false);
          }}
          editData={editingProject}
        />
      )}

      {qrModalProject && (
        <ProjectQRCodeModal
          onClose={() => setQrModalProject(null)}
          project={{
            ...qrModalProject,
            student_id: user?.id || ''
          } as any}
        />
      )}

    </div>
  );
}
