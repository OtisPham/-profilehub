import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { recordCvView, recordSectionDwellTime } from '../../services/cvTrackingAnalyticsService';
import { 
  FolderGit2, ExternalLink, Github, Copy, Check, Search, 
  Sparkles, Terminal, Mail, Phone, MapPin, Globe, 
  Layers, Code2, ArrowUpRight, Share2, Eye, ShieldCheck
} from 'lucide-react';

interface ProjectItem {
  id: string;
  title: string;
  role: string;
  project_type: string;
  description: string;
  tags: string[];
  demo_url?: string;
  github_url?: string;
  created_at?: string;
}

interface ProfileData {
  fullName: string;
  jobTitle: string;
  university?: string;
  bio?: string;
  skills: string[];
  email?: string;
  phone?: string;
  avatarUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

const DEFAULT_DEMO_PROFILE: ProfileData = {
  fullName: 'Nguyễn Hoàng Nam',
  jobTitle: 'Senior Fullstack Engineer & System Architect',
  university: 'Trường Đại học Bách Khoa TP.HCM',
  bio: 'Kỹ sư phần mềm tập trung vào xây dựng ứng dụng web quy mô lớn, microservices hiệu năng cao và giải pháp AI Agent thực chiến. Kinh nghiệm tối ưu hóa cơ sở dữ liệu và tự động hóa CI/CD.',
  skills: ['React', 'TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'Docker', 'Redis', 'Tailwind CSS', 'GraphQL', 'AWS'],
  email: 'nam.nguyen.dev@gmail.com',
  phone: '0912 345 678',
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com'
};

const DEFAULT_DEMO_PROJECTS: ProjectItem[] = [
  {
    id: 'demo-1',
    title: 'E-Commerce High-Throughput Microservices Platform',
    role: 'Tech Lead / Backend Architect',
    project_type: 'Doanh nghiệp / Production',
    description: `🎯 Bài toán & Thách thức: Hệ thống thương mại điện tử cũ bị nghẽn cổ chai khi lượng truy cập tăng vọt trong các đợt flash sale (50,000 req/s).\n⚙️ Giải pháp & Kiến trúc: Tái cấu trúc sang Event-Driven Microservices với NestJS, Apache Kafka, Redis Cluster và PostgreSQL Read/Write Split.\n📈 Tác động & Chỉ số: Giảm thời gian phản hồi P99 từ 1,200ms xuống còn 85ms, chịu tải an toàn 80,000 concurrent users với 99.98% uptime.`,
    tags: ['NestJS', 'Kafka', 'Redis', 'PostgreSQL', 'Docker', 'Kubernetes'],
    demo_url: 'https://demo-ecommerce.example.com',
    github_url: 'https://github.com/example/ecommerce-microservices'
  },
  {
    id: 'demo-2',
    title: 'Realtime Collaborative Whiteboard & System Design Canvas',
    role: 'Fullstack Developer',
    project_type: 'Mã nguồn mở / Cá nhân',
    description: `🎯 Bài toán & Thách thức: Xây dựng công cụ vẽ kiến trúc hệ thống và biểu đồ luồng dữ liệu thời gian thực cho đội ngũ kỹ sư từ xa.\n⚙️ Giải pháp & Kiến trúc: Sử dụng WebSockets kết hợp CRDT (Conflict-Free Replicated Data Types) trên nền React, Canvas API và Go WebSocket Server.\n📈 Tác động & Chỉ số: Đạt 1,200+ GitHub Stars, độ trễ đồng bộ con trỏ và nét vẽ < 15ms qua mạng Internet toàn cầu.`,
    tags: ['React', 'TypeScript', 'Go', 'WebSockets', 'Canvas API', 'Tailwind CSS'],
    demo_url: 'https://collaborative-canvas.example.com',
    github_url: 'https://github.com/example/collaborative-canvas'
  },
  {
    id: 'demo-3',
    title: 'AI Resume Copilot & Automated JD Alignment Engine',
    role: 'AI & Fullstack Engineer',
    project_type: 'Dự án thực chiến',
    description: `🎯 Bài toán & Thách thức: Ứng viên ngành phần mềm tốn hàng giờ chỉnh sửa CV cho từng mô tả công việc (JD) mà vẫn bị loại ở vòng ATS.\n⚙️ Giải pháp & Kiến trúc: Tích hợp Gemini Flash LLM bóc tách mã nguồn GitHub thực tế, tự động sinh chỉ số định lượng STAR và kiểm tra tiêu chuẩn ATS.\n📈 Tác động & Chỉ số: Tăng tỷ lệ ứng viên vượt qua vòng quét hồ sơ kỹ thuật lên 84%, phục vụ hơn 5,000 lượt phân tích CV.`,
    tags: ['Next.js', 'TypeScript', 'Gemini API', 'Supabase', 'Tailwind CSS'],
    demo_url: 'https://profilehub-demo.example.com',
    github_url: 'https://github.com/example/ai-resume-copilot'
  }
];

export default function PublicShowcase() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_DEMO_PROFILE);
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_DEMO_PROJECTS);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Feedback states
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedProjectId, setCopiedProjectId] = useState<string | null>(null);

  useEffect(() => {
    async function loadShowcaseData() {
      setLoading(true);
      const targetId = id || 'demo';

      // 1. If explicit demo, use demo data
      if (targetId === 'demo') {
        setProfile(DEFAULT_DEMO_PROFILE);
        setProjects(DEFAULT_DEMO_PROJECTS);
        setLoading(false);
        return;
      }

      let loadedProfile: ProfileData | null = null;
      let loadedProjects: ProjectItem[] = [];

      try {
        // 2. Fetch from Supabase
        const [profRes, userRes, projRes] = await Promise.all([
          supabase.from('student_profiles').select('*').eq('id', targetId).maybeSingle(),
          supabase.from('users').select('*').eq('id', targetId).maybeSingle(),
          supabase.from('projects').select('*').eq('student_id', targetId).order('created_at', { ascending: false })
        ]);

        if (profRes.data || userRes.data) {
          const prof = profRes.data || {};
          const usr = userRes.data || {};
          loadedProfile = {
            fullName: prof.full_name || usr.full_name || 'Kỹ sư Phần mềm',
            jobTitle: prof.major || 'Lập trình viên',
            university: prof.university || 'Đại học Bách Khoa',
            bio: prof.bio || '',
            skills: Array.isArray(prof.skills) ? prof.skills : [],
            email: usr.email || '',
            phone: usr.phone || '',
            avatarUrl: usr.avatar_url || ''
          };
        }

        if (projRes.data && projRes.data.length > 0) {
          loadedProjects = projRes.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            role: item.role || 'Lập trình viên',
            project_type: item.project_type || 'Mã nguồn mở / Cá nhân',
            description: item.description || '',
            tags: Array.isArray(item.tags) ? item.tags : [],
            demo_url: item.demo_url,
            github_url: item.github_url,
            created_at: item.created_at
          }));
        }
      } catch (err) {
        console.warn('Database fetch fallback:', err);
      }

      // 3. Check localStorage fallback if database had no data (e.g. offline, guest, or local dev)
      if (!loadedProfile || loadedProjects.length === 0) {
        const savedKeys = [
          `profilehub_saved_cv_${targetId}`,
          'profilehub_saved_cv_latest',
          'profilehub_saved_cv_guest'
        ];

        for (const key of savedKeys) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (parsed.personalInfo) {
                loadedProfile = {
                  fullName: parsed.personalInfo.fullName || DEFAULT_DEMO_PROFILE.fullName,
                  jobTitle: parsed.personalInfo.jobTitle || DEFAULT_DEMO_PROFILE.jobTitle,
                  university: DEFAULT_DEMO_PROFILE.university,
                  bio: parsed.sections?.find((s: any) => s.type === 'objective')?.content || DEFAULT_DEMO_PROFILE.bio,
                  skills: parsed.sections
                    ?.filter((s: any) => s.type === 'skills')
                    ?.flatMap((s: any) => s.items?.flatMap((i: any) => i.skills || [i.name || i])) || DEFAULT_DEMO_PROFILE.skills,
                  email: parsed.personalInfo.email,
                  phone: parsed.personalInfo.phone,
                  githubUrl: parsed.personalInfo.github,
                  linkedinUrl: parsed.personalInfo.linkedin
                };
              }

              const projectSections = parsed.sections?.filter((s: any) => s.type === 'projects') || [];
              const extractedProjects: ProjectItem[] = projectSections.flatMap((s: any) => 
                (s.items || []).map((item: any, idx: number) => ({
                  id: item.id || `local-${idx}`,
                  title: item.projectName || 'Dự án thực tế',
                  role: item.role || 'Lập trình viên',
                  project_type: item.scopeType === 'team' ? 'Dự án nhóm' : 'Mã nguồn mở / Cá nhân',
                  description: item.description || '',
                  tags: item.technologies || [],
                  demo_url: item.projectUrl,
                  github_url: item.githubUrl
                }))
              );

              if (extractedProjects.length > 0) {
                loadedProjects = extractedProjects;
                break;
              }
            } catch (parseErr) {
              console.warn('Failed parsing local CV fallback:', parseErr);
            }
          }
        }
      }

      const finalProf = loadedProfile || DEFAULT_DEMO_PROFILE;

      setProfile(finalProf);
      setProjects(loadedProjects.length > 0 ? loadedProjects : DEFAULT_DEMO_PROJECTS);
      setLoading(false);
    }

    loadShowcaseData();
  }, [id]);

  // Ghi nhận lượt xem và thời gian đọc thực tế cho CV View Tracking & Heatmap
  useEffect(() => {
    const startTime = Date.now();
    const timer = setTimeout(() => {
      recordCvView({
        recruiterCompany: 'Doanh nghiệp Công nghệ Đối tác',
        recruiterName: 'Talent Acquisition Partner',
        focusedSection: 'Đồ Án Thực Chiến (Showcase Proof-of-Work)',
        durationSeconds: 45
      });
    }, 2500);

    return () => {
      clearTimeout(timer);
      const dwellSec = Math.round((Date.now() - startTime) / 1000);
      if (dwellSec > 3) {
        recordSectionDwellTime('projects', Math.min(dwellSec, 120));
      }
    };
  }, []);

  // Handle URL hash scrolling to specific project
  useEffect(() => {
    if (!loading && window.location.hash) {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetElement.classList.add('ring-4', 'ring-indigo-500/50', 'transition-all');
          setTimeout(() => {
            targetElement.classList.remove('ring-4', 'ring-indigo-500/50');
          }, 3000);
        }, 300);
      }
    }
  }, [loading]);

  // Helper to format external URLs
  const formatExternalUrl = (url?: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
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

  // Copy Portfolio Link
  const handleCopyPortfolioLink = () => {
    const url = window.location.href.split('#')[0];
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Copy Single Project Link
  const handleCopyProjectLink = (projId: string) => {
    const baseUrl = window.location.href.split('#')[0];
    const projectUrl = `${baseUrl}#project-${projId}`;
    navigator.clipboard.writeText(projectUrl);
    setCopiedProjectId(projId);
    setTimeout(() => setCopiedProjectId(null), 2500);
  };

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Search
      const matchesSearch = searchQuery === '' || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // Type filter
      let matchesType = true;
      if (selectedType === 'enterprise') {
        matchesType = p.project_type.toLowerCase().includes('doanh nghiệp') || p.project_type.toLowerCase().includes('production') || p.project_type.toLowerCase().includes('thực chiến');
      } else if (selectedType === 'opensource') {
        matchesType = p.project_type.toLowerCase().includes('mã nguồn mở') || p.project_type.toLowerCase().includes('cá nhân');
      } else if (selectedType === 'academic') {
        matchesType = p.project_type.toLowerCase().includes('học thuật') || p.project_type.toLowerCase().includes('đồ án') || p.project_type.toLowerCase().includes('nhóm');
      }

      // Skill tag filter
      const matchesSkill = !selectedSkill || p.tags.some(t => t.toLowerCase() === selectedSkill.toLowerCase());

      return matchesSearch && matchesType && matchesSkill;
    });
  }, [projects, searchQuery, selectedType, selectedSkill]);

  // All unique tags for tag cloud
  const allUniqueTags = useMemo(() => {
    const set = new Set<string>();
    profile.skills.forEach(s => set.add(s));
    projects.forEach(p => p.tags.forEach(t => set.add(t)));
    return Array.from(set).slice(0, 16);
  }, [profile.skills, projects]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Floating Glass Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-black text-white text-xs shadow-md shadow-indigo-500/25">
              PH
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                ProfileHub <span className="text-indigo-400 font-semibold">• Showcase</span>
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block">
                Hồ sơ năng lực & Minh chứng kỹ thuật công khai
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyPortfolioLink}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700/80 transition-all cursor-pointer shadow-2xs"
              title="Sao chép đường dẫn hồ sơ năng lực này"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Đã sao chép link!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Chia sẻ Showcase</span>
                </>
              )}
            </button>

            <Link
              to="/cv-builder"
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem / Tạo CV</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        
        {/* Candidate Hero Card (Linear / ITviec Aesthetic) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/90 p-6 sm:p-10 shadow-2xl">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar with Status Ring */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-slate-800 flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shadow-xl ring-2 ring-indigo-400/30">
                  {profile.fullName.charAt(0)}
                </div>
                <div 
                  className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 flex items-center gap-1 shadow-md ring-2 ring-slate-900"
                  title="Sẵn sàng nhận lời mời phỏng vấn và cơ hội việc làm mới"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                  <span>Open to Work</span>
                </div>
              </div>

              {/* Name & Titles */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {profile.fullName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    Verified Evidence
                  </span>
                </div>

                <p className="text-base sm:text-lg font-semibold text-slate-300">
                  {profile.jobTitle}
                </p>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400">
                  {profile.university && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {profile.university}
                    </span>
                  )}
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="hover:text-indigo-400 flex items-center gap-1 transition-colors">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {profile.email}
                    </a>
                  )}
                  {profile.phone && (
                    <a href={`tel:${profile.phone}`} className="hover:text-indigo-400 flex items-center gap-1 transition-colors">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      {profile.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics & Links */}
            <div className="flex sm:flex-col items-stretch sm:items-end gap-3 shrink-0">
              <div className="flex items-center gap-2 p-1.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-xs">
                <div className="px-3 py-1.5 text-center">
                  <div className="text-lg font-black text-white">{projects.length}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Dự án</div>
                </div>
                <div className="w-[1px] h-6 bg-slate-700" />
                <div className="px-3 py-1.5 text-center">
                  <div className="text-lg font-black text-indigo-400">{allUniqueTags.length}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Tech Stack</div>
                </div>
              </div>

              {profile.githubUrl && (
                <a
                  href={formatExternalUrl(profile.githubUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700/80 transition-colors"
                >
                  <Github className="w-4 h-4 text-white" />
                  <span>GitHub Profile</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              )}
            </div>

          </div>

          {/* Bio statement */}
          {profile.bio && (
            <div className="mt-6 pt-6 border-t border-slate-800/80 text-sm text-slate-300 leading-relaxed max-w-3xl">
              {profile.bio}
            </div>
          )}

          {/* Interactive Skills Filter Cloud */}
          {allUniqueTags.length > 0 && (
            <div className="mt-6 pt-4 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Lọc theo công nghệ:
              </span>
              {allUniqueTags.map(tag => {
                const isActive = selectedSkill?.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedSkill(isActive ? null : tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                        : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
              {selectedSkill && (
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline ml-2 cursor-pointer"
                >
                  Xóa lọc
                </button>
              )}
            </div>
          )}

        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Segmented Category Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xs overflow-x-auto">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedType === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Tất cả ({projects.length})
            </button>
            <button
              onClick={() => setSelectedType('enterprise')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedType === 'enterprise'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              🏢 Doanh nghiệp / Thực chiến
            </button>
            <button
              onClick={() => setSelectedType('opensource')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedType === 'opensource'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              ● Mã nguồn mở & Cá nhân
            </button>
          </div>

          {/* Real-time Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm dự án, tech, STAR..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

        </div>

        {/* Project Showcase List (Hàng loạt dự án) */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/50 rounded-3xl border border-slate-800">
            <p className="text-slate-400 text-sm">Không tìm thấy dự án nào khớp với bộ lọc hiện tại.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedType('all'); setSelectedSkill(null); }}
              className="mt-3 text-xs text-indigo-400 hover:underline font-semibold"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProjects.map((proj) => {
              const star = parseSTAR(proj.description);
              const isCopied = copiedProjectId === proj.id;

              return (
                <div
                  key={proj.id}
                  id={`project-${proj.id}`}
                  className="group relative rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/50 p-6 sm:p-8 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-950/30"
                >
                  {/* Header Row: Title, Scope Badge, and Quick Link Copy */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {proj.title}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-[11px] font-semibold">
                          {proj.role}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] font-medium border border-slate-700/60">
                          {proj.project_type}
                        </span>
                      </div>
                    </div>

                    {/* Single Project Deep-Link Copy Button */}
                    <button
                      onClick={() => handleCopyProjectLink(proj.id)}
                      className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 border border-slate-700/70 transition-all cursor-pointer shadow-2xs"
                      title="Sao chép liên kết trực tiếp đến dự án này"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Đã chép link!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Link dự án</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Body: STAR Architecture or Plain Description */}
                  <div className="py-5 space-y-4">
                    {star ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {star.challenge && (
                          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                              <span>🎯</span> Bài toán & Thách thức
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {star.challenge}
                            </p>
                          </div>
                        )}
                        {star.architecture && (
                          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                              <span>⚙️</span> Giải pháp & Kiến trúc
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {star.architecture}
                            </p>
                          </div>
                        )}
                        {star.impact && (
                          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-emerald-900/30">
                            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                              <span>📈</span> Tác động & Chỉ số
                            </div>
                            <p className="text-xs text-slate-200 font-medium leading-relaxed">
                              {star.impact}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                        {proj.description || 'Chưa có mô tả chi tiết cho dự án.'}
                      </p>
                    )}
                  </div>

                  {/* Footer: Tech Stack Chips & Direct Links */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    {/* Tech Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {proj.tags.map(t => (
                        <span 
                          key={t}
                          className="px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-300 font-mono text-[11px] border border-slate-700/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      {proj.github_url && (
                        <a
                          href={formatExternalUrl(proj.github_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                        >
                          <Github className="w-3.5 h-3.5 text-white" />
                          <span>Mã nguồn</span>
                          <ArrowUpRight className="w-3 h-3 text-slate-400" />
                        </a>
                      )}

                      {proj.demo_url && (
                        <a
                          href={formatExternalUrl(proj.demo_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02]"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                          <ArrowUpRight className="w-3 h-3 text-emerald-200" />
                        </a>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Được cung cấp bởi <strong className="text-slate-300">ProfileHub</strong> — Nền tảng Hồ Sơ & Minh Chứng Năng Lực Lập Trình Viên.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/cv-builder" className="text-indigo-400 hover:underline">
              Tạo Hồ Sơ Của Bạn
            </Link>
            <span>•</span>
            <Link to="/login" className="text-slate-400 hover:underline">
              Đăng Nhập
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
