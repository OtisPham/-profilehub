import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Target, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Lightbulb, 
  Briefcase, 
  FileText, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Code2, 
  ChevronRight, 
  ExternalLink, 
  Layers, 
  BarChart3, 
  Cpu, 
  BookOpen, 
  AlertCircle, 
  Clock, 
  UserCheck, 
  UploadCloud, 
  FileCode2, 
  Check, 
  Eye, 
  ArrowRight, 
  SlidersHorizontal,
  FolderKanban,
  CheckCircle,
  HelpCircle,
  FileSpreadsheet,
  RotateCcw,
  Brain
} from 'lucide-react';
import { 
  analyzePortfolioMatch,
  saveCompatibilityMatchHistory,
  getCompatibilityMatchHistory,
  clearCompatibilityMatchHistory,
  type CompatibilityAnalysisHistoryItem
} from '../../services/portfolioMatchService';
import type { PortfolioMatchResult, AiProjectInput, AiCertificateInput, AiCandidateProfile } from '../../types/portfolioMatch';
import { useAuth } from '../../context/AuthProvider';
import { cvService, type ManagedCVItem } from '../../services/cvService';

export interface CandidateCvProfile {
  id: string;
  name: string;
  avatarBadge: string;
  targetRole: string;
  level: 'intern' | 'fresher' | 'junior' | 'mid';
  headline: string;
  skills: string[];
  projects: AiProjectInput[];
  certificates: AiCertificateInput[];
}

/**
 * Trích xuất toàn bộ văn bản từ file PDF thuần túy trên trình duyệt
 */
async function extractTextFromPdfFile(file: File): Promise<string> {
  if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json')) {
    return await file.text();
  }

  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // Đọc byte stream
    const rawLatin = new TextDecoder('latin1').decode(bytes);
    const textChunks: string[] = [];

    // 1. Quét chuỗi PDF literal: (text) Tj
    const tjRegex = /\(((?:[^()\\]|\\.)*)\)\s*Tj/g;
    let m;
    while ((m = tjRegex.exec(rawLatin)) !== null) {
      const clean = m[1].replace(/\\([()\\])/g, '$1').replace(/\\r|\\n/g, ' ').trim();
      if (clean.length > 0) textChunks.push(clean);
    }

    // 2. Quét chuỗi PDF array: [(text1) 20 (text2)] TJ
    const tjArrayRegex = /\[((?:[^[\]]|\\[[\]])*)\]\s*TJ/g;
    while ((m = tjArrayRegex.exec(rawLatin)) !== null) {
      const inner = m[1];
      const subParts = inner.match(/\(((?:[^()\\]|\\.)*)\)/g);
      if (subParts) {
        const combined = subParts
          .map(p => p.slice(1, -1).replace(/\\([()\\])/g, '$1'))
          .join(' ')
          .trim();
        if (combined.length > 0) textChunks.push(combined);
      }
    }

    // 3. Fallback: Nếu stream bị nén, quét các đoạn văn bản có nghĩa (UTF-8)
    if (textChunks.length < 5) {
      const utf8Decoder = new TextDecoder('utf-8', { fatal: false });
      const utf8Text = utf8Decoder.decode(bytes);
      const readableRegex = /[a-zA-Z0-9À-ỹà-ỹ.,:;()\-_/&%#@\s]{4,}/g;
      const matches = utf8Text.match(readableRegex) || [];
      const filtered = (matches as string[]).filter((w: string) => {
        const trimmed = w.trim();
        if (trimmed.startsWith('/') || trimmed.startsWith('obj') || trimmed.startsWith('endobj') || trimmed.startsWith('stream')) return false;
        return trimmed.length > 5 && !/^[0-9\s]+$/.test(trimmed);
      });
      if (filtered.length > 0) {
        return filtered.slice(0, 100).join('\n');
      }
    }

    return textChunks.length > 0 ? textChunks.join(' ') : await file.text();
  } catch (err) {
    console.warn('Lỗi khi đọc file PDF:', err);
    return await file.text();
  }
}

export const PortfolioMatchPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload State
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [isParsingFile, setIsParsingFile] = useState<boolean>(false);

  // Selected CV Source Mode: 'my_cv' | 'upload_pdf'
  const [cvSourceMode, setCvSourceMode] = useState<'my_cv' | 'upload_pdf'>('my_cv');

  // All Available CVs from cvService (including all 100 bulk CVs if loaded)
  const [availableCvs, setAvailableCvs] = useState<ManagedCVItem[]>(() => {
    return cvService.getAllCVs(user?.id);
  });

  // Selected CV ID
  const [selectedCvId, setSelectedCvId] = useState<string>(() => {
    if (location.state?.selectedCvId) return location.state.selectedCvId;
    if (location.state?.activeCvData?.id) return location.state.activeCvData.id;
    const activeId = cvService.getActiveCVId(user?.id);
    if (activeId) return activeId;
    const list = cvService.getAllCVs(user?.id);
    return list.length > 0 ? list[0].id : 'user-my-cv';
  });

  // Build Candidate Profile from current selection or location state
  const buildCandidateProfile = useCallback((): CandidateCvProfile => {
    // 1. If explicit state was passed via navigation and matches
    if (location.state?.activeCvData) {
      const d = location.state.activeCvData;
      if (!selectedCvId || selectedCvId === d.id) {
        const skills = d.skills || [];
        const projects = (d.projects || []).map((p: any) => ({
          id: p.id || `p-${Math.random()}`,
          title: p.projectName || p.title || 'Dự án trong CV',
          description: p.description || '',
          technologies: p.technologies || [],
          tags: p.technologies || [],
          is_verified: p.is_verified ?? true,
          metrics: p.bullets || p.metrics || [],
          demo_url: p.projectUrl || p.demo_url,
          github_url: p.githubUrl || p.github_url,
        }));

        return {
          id: d.id || 'state-cv',
          name: d.name || 'Ứng Viên Đã Chọn',
          avatarBadge: '📌 CV TỪ QUẢN LÝ',
          targetRole: d.targetRole || 'Software Engineer',
          level: 'fresher',
          headline: `Bản CV chuyên biệt cho vị trí ${d.targetRole || 'Công nghệ'}.`,
          skills: skills.length > 0 ? skills : ['React', 'TypeScript', 'Node.js', 'Git'],
          projects: projects,
          certificates: d.certificates || []
        };
      }
    }

    // 2. Lookup in available managed CVs
    const cv = availableCvs.find(c => c.id === selectedCvId) || cvService.getCVById(selectedCvId, user?.id);
    if (cv && cv.data) {
      const parsed = cv.data;
      const skills = (parsed.sections || []).find((s: any) => s.type === 'skills')?.items?.flatMap((g: any) => g.skills || []) || [];
      const projects = (parsed.sections || []).find((s: any) => s.type === 'projects')?.items?.map((p: any) => ({
        id: p.id || `p-${Math.random()}`,
        title: p.projectName || p.title || 'Dự án trong CV',
        description: p.description || '',
        technologies: p.technologies || [],
        tags: p.technologies || [],
        is_verified: p.is_verified ?? true,
        metrics: p.bullets || p.metrics || [],
        demo_url: p.projectUrl || p.demo_url,
        github_url: p.githubUrl || p.github_url,
      })) || [];
      const certs = (parsed.sections || []).find((s: any) => s.type === 'certifications')?.items?.map((c: any) => ({
        id: c.id || `cert-${Math.random()}`,
        title: c.certificateName || c.title || 'Chứng chỉ chuyên môn',
        issuer: c.organization || c.issuer || 'Đơn vị cấp',
        issue_date: c.issueDate || c.issue_date
      })) || [];

      return {
        id: cv.id,
        name: parsed.personalInfo?.fullName || cv.title,
        avatarBadge: '📄 BẢN CV QUẢN LÝ',
        targetRole: cv.targetRole || parsed.personalInfo?.jobTitle || 'Software Engineer',
        level: 'fresher',
        headline: (parsed.sections || []).find((s: any) => s.type === 'objective')?.content || `Hồ sơ CV: ${cv.title} (${cv.targetRole})`,
        skills: skills.length > 0 ? skills : ['React', 'TypeScript', 'Node.js', 'Git'],
        projects: projects,
        certificates: certs
      };
    }

    // 3. Fallback to default
    return {
      id: 'user-my-cv',
      name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Nguyễn Văn Ứng Viên',
      avatarBadge: '👤 HỒ SƠ MẶC ĐỊNH',
      targetRole: 'Frontend Developer',
      level: 'fresher',
      headline: 'Hồ sơ năng lực cá nhân đồng bộ từ hệ thống ProfileHub.',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'REST API', 'JavaScript', 'Git'],
      projects: [],
      certificates: []
    };
  }, [selectedCvId, availableCvs, location.state, user]);

  const [myCvCandidate, setMyCvCandidate] = useState<CandidateCvProfile>(buildCandidateProfile);

  // Keep myCvCandidate synced with selected CV
  useEffect(() => {
    setMyCvCandidate(buildCandidateProfile());
  }, [buildCandidateProfile]);

  // Custom / Uploaded CV text input
  const [customCvText, setCustomCvText] = useState<string>(`Họ và tên: ${user?.user_metadata?.full_name || 'Nguyễn Hoàng Anh'}
Vị trí mục tiêu: Frontend ReactJS Developer
Kỹ năng: React, TypeScript, HTML/CSS, Tailwind CSS, REST API, Git, Next.js
Dự án:
1. Website Quản lý kho hàng (React, TypeScript): Tối ưu hóa render giảm 25% thời gian phản hồi, đạt điểm đồ án 9.0/10. Link demo: https://demo-kho.dev
2. Ứng dụng chat trực tuyến (React, Firebase): Phục vụ 100+ người dùng.`);

  // Job Description (JD) Input State
  const [jdText, setJdText] = useState<string>(
    location.state?.jobDescription ||
    `Vị trí: Frontend Developer (React/TypeScript)
Yêu cầu:
- Thành thạo React, TypeScript, HTML/CSS, Tailwind CSS.
- Kinh nghiệm làm việc với REST API, Git, Agile/Scrum.
- Ưu tiên ứng viên có sản phẩm thực tế, đồ án có chỉ số đo lường kết quả rõ ràng.`
  );

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<PortfolioMatchResult | null>(null);
  const [historyList, setHistoryList] = useState<CompatibilityAnalysisHistoryItem[]>(() => {
    return getCompatibilityMatchHistory('user-my-cv');
  });

  // Helper to extract job title from JD text
  const getDetectedJobTitle = (text: string): string => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (/^(vị trí|tuyển dụng|job title|position|role):?/i.test(line)) {
        const parts = line.split(':');
        if (parts.length > 1 && parts[1].trim()) return parts[1].trim();
        return line;
      }
    }
    const firstLine = lines[0] || 'Vị trí chuyên môn';
    return firstLine.length > 50 ? `${firstLine.substring(0, 47)}...` : firstLine;
  };

  // Parse custom CV text into structured candidate profile
  const parseCustomCvTextToProfile = (text: string, customName?: string): CandidateCvProfile => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let name = customName || 'Ứng viên Tải Lên';
    
    const nameLine = lines.find(l => /^(họ và tên|họ tên|họ tên ứng viên|full name|name):?/i.test(l));
    if (nameLine) {
      name = nameLine.split(':')[1]?.trim() || name;
    }

    const techKeywords = [
      'react', 'next.js', 'vue', 'angular', 'svelte', 'typescript', 'javascript',
      'node.js', 'express', 'nestjs', 'python', 'django', 'fastapi', 'flask',
      'java', 'spring', 'spring boot', 'c#', '.net', 'c++', 'golang', 'go', 'rust',
      'sql', 'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'supabase', 'firebase',
      'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'git', 'ci/cd', 'rest api', 'graphql',
      'tailwind', 'css', 'html', 'figma', 'ui/ux', 'agile', 'scrum', 'testing', 'jest',
      'microservices', 'kafka', 'rabbitmq', 'prisma', 'linux', 'flutter', 'react native', 'swift', 'kotlin',
      'marketing', 'seo', 'sem', 'content', 'sales', 'kế toán', 'nhân sự'
    ];

    const detectedSkills = techKeywords.filter(k => {
      const reg = new RegExp(`(^|[^a-z0-9_])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9_]|$)`, 'i');
      return reg.test(text);
    }).map(k => k.charAt(0).toUpperCase() + k.slice(1));

    const skills = detectedSkills.length > 0 ? Array.from(new Set(detectedSkills)) : ['React', 'TypeScript', 'Tailwind CSS', 'REST API'];
    const metricMatches = text.match(/\d+[\d,.]*\s*(%|x|ms|s|giây|phút|user|người dùng|sinh viên|\/10|điểm)/gi) || [];

    return {
      id: 'custom-cv-uploaded',
      name: name,
      avatarBadge: uploadedFileName ? '📄 PDF UPLOADED' : '📝 VĂN BẢN CV',
      targetRole: 'Software Developer',
      level: 'fresher',
      headline: uploadedFileName ? `Trích xuất từ file [${uploadedFileName}] với ${skills.length} kỹ năng nhận diện.` : 'Hồ sơ tự nhập từ văn bản trực tiếp.',
      skills: skills,
      projects: [
        {
          id: 'p-uploaded-1',
          title: 'Đồ án / Dự án thực chiến trích xuất từ CV',
          description: text.slice(0, 300),
          technologies: skills.slice(0, 5),
          tags: skills.slice(0, 5),
          is_verified: text.toLowerCase().includes('verified') || text.toLowerCase().includes('xác thực') || text.toLowerCase().includes('giảng viên'),
          metrics: Array.from(new Set(metricMatches)).slice(0, 4),
        }
      ],
      certificates: []
    };
  };

  // Active CV being evaluated
  const activeCandidate: CandidateCvProfile = cvSourceMode === 'my_cv'
    ? myCvCandidate
    : parseCustomCvTextToProfile(customCvText, uploadedFileName ? uploadedFileName.replace(/\.[^/.]+$/, '') : undefined);

  // Handle PDF/Document File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingFile(true);
    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    try {
      const extracted = await extractTextFromPdfFile(file);
      if (extracted && extracted.trim().length > 0) {
        setCustomCvText(extracted);
        setCvSourceMode('upload_pdf');
      }
    } catch (err) {
      console.error('Lỗi phân tích file CV:', err);
    } finally {
      setIsParsingFile(false);
      if (e.target) e.target.value = '';
    }
  };

  // Toggle verification badge on project
  const handleToggleVerified = (projId: string) => {
    if (cvSourceMode === 'my_cv') {
      setMyCvCandidate(prev => ({
        ...prev,
        projects: prev.projects.map(p => {
          if (p.id === projId) {
            return { ...p, is_verified: !p.is_verified };
          }
          return p;
        })
      }));
    }
  };

  // Run AI Matching Analysis
  const handleRunAnalysis = async () => {
    if (!jdText.trim()) return;
    setIsAnalyzing(true);
    try {
      console.log('🤖 [AI Matching] Đang đánh giá tương thích giữa JD và CV bằng AI Engine: AI Evidence-Based Matching Engine v2.0 (Google Gemini / OpenRouter / Rulebook V6.1)');
      await new Promise(res => setTimeout(res, 400));
      
      const candidateData = activeCandidate;

      const result = await analyzePortfolioMatch(
        jdText,
        candidateData.skills,
        candidateData.projects,
        candidateData.certificates
      );
      setAnalysisResult(result);

      const aiObj = result.aiResult || result.jevResult;
      if (aiObj) {
        saveCompatibilityMatchHistory({
          candidateId: candidateData.id,
          candidateName: candidateData.name,
          targetRole: getDetectedJobTitle(jdText),
          overallScore: aiObj.overall_score,
          pillars: {
            skillFit: aiObj.pillars.skill_fit.score,
            evidenceDepth: aiObj.pillars.evidence_depth.score,
            impactComplexity: aiObj.pillars.impact_complexity.score,
            alignmentLevel: aiObj.pillars.alignment_level.score,
          },
          trustTier: aiObj.trust_index.trust_tier,
          matchedSkillsCount: result.matchedSkills.length,
          missingSkillsCount: result.missingSkills.length,
        });
        setHistoryList(getCompatibilityMatchHistory(candidateData.id));
      }
    } catch (err) {
      console.error('Lỗi khi phân tích portfolio:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto run initial analysis when candidate or CV source mode changes
  useEffect(() => {
    if (jdText.trim()) {
      handleRunAnalysis();
    }
  }, [activeCandidate.id, cvSourceMode, customCvText, myCvCandidate]);

  const aiMatch = analysisResult?.aiResult || analysisResult?.jevResult;
  const jev = aiMatch; // Alias for backward compatibility in component JSX
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Sinh Viên';

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      
      {/* 1. TOP HEADER BAR (SYNCHRONIZED WITH DASHBOARD & CV BUILDER) */}
      <header className="h-[70px] bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500">
          <span 
            onClick={() => navigate('/dashboard')}
            className="hover:text-blue-700 cursor-pointer transition-colors"
          >
            Bảng Điều Khiển
          </span> 
          <span className="text-slate-300">/</span> 
          <span className="text-[#0f172a] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Đánh Giá Tương Thích CV & JD (AI Matching)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/cv-builder')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1e3a8a] border border-blue-200 text-xs font-bold transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>AI CV Builder</span>
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <span className="text-xs font-semibold text-slate-700 hidden md:inline">👨‍🎓 {displayName}</span>
            <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto p-4 md:p-8 space-y-6">
        
        {/* 2. HERO INTRO BANNER (LIGHT THEME) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1e3a8a] text-xs font-mono font-bold w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>AI EVIDENCE-BASED MATCH ENGINE v2.0</span>
            </div>
            <div className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 w-fit">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đo Lường Chuẩn 4 Trụ Cột Minh Chứng</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] tracking-tight">
            💼 So Khớp & Đánh Giá Tương Thích CV Với Vị Trí Tuyển Dụng
          </h1>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed max-w-3xl">
            Đánh giá độ phù hợp thực tế của ứng viên thông qua <strong>4 Trụ Cột Minh Chứng</strong>: Hard Skills (30%), Evidence Depth (40%), Quantified Impact (20%) và Alignment Level (10%). Hệ thống tích hợp thuật toán chống spam từ khóa (<strong>Anti-Keyword Stuffing</strong>) và chỉ tính điểm trên các đồ án liên quan có <strong>Verified Badge 🛡️</strong>.
          </p>
        </div>

        {/* 3. WORKSPACE: SIDE-BY-SIDE SELECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN: CANDIDATE CV SELECTION */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Header & Segmented Tabs */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0f172a]">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>1. Hồ Sơ CV Đánh Giá</span>
                </div>
                {/* Segmented Control */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
                  <button
                    onClick={() => setCvSourceMode('my_cv')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      cvSourceMode === 'my_cv' 
                        ? 'bg-white text-[#1e3a8a] font-bold shadow-xs border border-slate-200' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>👤 CV Của Tôi</span>
                  </button>
                  <button
                    onClick={() => setCvSourceMode('upload_pdf')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      cvSourceMode === 'upload_pdf' 
                        ? 'bg-white text-[#1e3a8a] font-bold shadow-xs border border-slate-200' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>📄 Tải File PDF CV</span>
                  </button>
                </div>
              </div>

              {/* Mode 1: Real User's CV from CV Builder */}
              {cvSourceMode === 'my_cv' ? (
                <div className="space-y-3">
                  {/* CV Selector Bar */}
                  {availableCvs.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <FolderKanban className="w-4 h-4 text-blue-700 shrink-0" />
                        <span className="text-xs font-bold text-blue-900">Bản CV đang so khớp:</span>
                      </div>
                      <div className="flex items-center gap-2 flex-1 max-w-md">
                        <select
                          value={selectedCvId}
                          onChange={(e) => {
                            setSelectedCvId(e.target.value);
                            cvService.setActiveCVId(e.target.value, user?.id);
                          }}
                          className="w-full bg-white border border-blue-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                          {availableCvs.map((cv) => (
                            <option key={cv.id} value={cv.id}>
                              {cv.title} — {cv.targetRole} ({cv.data?.personalInfo?.fullName || 'Ứng viên'})
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => navigate('/cv-manager')}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold whitespace-nowrap shadow-2xs cursor-pointer"
                          title="Mở kho quản lý tất cả CV"
                        >
                          Kho CV
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-4">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base text-[#0f172a]">{activeCandidate.name}</h3>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                            {activeCandidate.avatarBadge}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {activeCandidate.level.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-blue-700 mt-0.5">{activeCandidate.targetRole}</div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {activeCandidate.headline}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/cv-builder')}
                        className="text-[11px] text-[#1e3a8a] hover:text-blue-700 font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-blue-200 shadow-2xs shrink-0 cursor-pointer transition-colors"
                        title="Đến AI CV Builder để chỉnh sửa hồ sơ"
                      >
                        <span>Sửa CV</span>
                        <ExternalLink className="w-3 h-3 text-blue-600" />
                      </button>
                    </div>

                    {/* Skills list */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                        <span>Kỹ năng trong CV ({activeCandidate.skills.length}):</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeCandidate.skills.map(s => (
                          <span key={s} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Projects & Verification Badges */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                        <span>Đồ án minh chứng ({activeCandidate.projects.length}):</span>
                        <span className="text-slate-400 text-[10px]">Bấm badge để đổi trạng thái verify</span>
                      </div>
                      
                      {activeCandidate.projects.map(proj => (
                        <div 
                          key={proj.id}
                          className={`p-3 rounded-xl border text-xs space-y-2 transition-colors ${
                            proj.is_verified 
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-[#0f172a] truncate">{proj.title}</span>
                            <button
                              onClick={() => handleToggleVerified(proj.id)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold cursor-pointer transition-colors shrink-0 ${
                                proj.is_verified 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                              }`}
                            >
                              {proj.is_verified ? '🛡️ Verified Badge' : '⚠️ Chưa Verify'}
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">{proj.description}</p>
                          {proj.metrics && proj.metrics.length > 0 && (
                            <div className="text-[10px] font-mono text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                              📊 Số liệu: {proj.metrics.join(' • ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Mode 2: Upload PDF/Docx or Direct Text */
                <div className="space-y-3">
                  {/* File Upload Drop Area */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.docx,.doc,.txt,.json,.md"
                    className="hidden"
                  />
                  
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-slate-50 rounded-xl p-5 text-center cursor-pointer transition-all group"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 text-blue-700 flex items-center justify-center transition-colors">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#0f172a] group-hover:text-blue-700 transition-colors">
                          {isParsingFile ? 'Đang trích xuất nội dung file...' : 'Tải lên File CV (PDF / DOCX / TXT)'}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Hỗ trợ định dạng PDF, DOCX, TXT. Tự động quét kỹ năng & số liệu.
                        </p>
                      </div>
                      {uploadedFileName && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-medium mt-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{uploadedFileName}</span>
                          {uploadedFileSize && <span className="text-slate-500">({uploadedFileSize})</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Extracted / Editable Text */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                      <span>Nội dung trích xuất / Tự chỉnh sửa:</span>
                      <span>{customCvText.length} ký tự</span>
                    </div>
                    <textarea
                      rows={9}
                      value={customCvText}
                      onChange={(e) => setCustomCvText(e.target.value)}
                      placeholder="Nội dung file CV sau khi trích xuất sẽ hiển thị ở đây. Bạn cũng có thể dán hoặc bổ sung thêm thông tin..."
                      className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-slate-800 text-xs focus:outline-none focus:border-blue-600 font-mono leading-relaxed"
                    />
                  </div>

                  {/* Preview of auto-extracted skills */}
                  {activeCandidate.skills.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-[10px] text-slate-500 font-semibold">
                        Kỹ năng tự động nhận diện từ file ({activeCandidate.skills.length}):
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {activeCandidate.skills.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 text-[11px] font-mono text-slate-500 text-center">
              ✓ Đã đồng bộ hồ sơ vào AI Matching Pipeline
            </div>
          </div>

          {/* RIGHT COLUMN: JOB DESCRIPTION (JD) INPUT */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0f172a]">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>2. Nhập Nội Dung Mô Tả Công Việc (JD)</span>
                </div>
                {jdText.trim() && (
                  <button
                    onClick={() => setJdText('')}
                    className="text-[11px] text-slate-500 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
                  >
                    Xóa nội dung
                  </button>
                )}
              </div>

              {/* JD Text Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> Dán nội dung JD tuyển dụng:
                  </span>
                  <span>{jdText.length} ký tự</span>
                </div>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  rows={15}
                  placeholder={`Dán toàn bộ nội dung Mô tả công việc (JD) vào đây...

Ví dụ:
Tuyển dụng Frontend Developer (ReactJS / TypeScript)
Yêu cầu công việc:
- Có ít nhất 1 năm kinh nghiệm hoặc hoàn thành các đồ án thực tế với React, TypeScript.
- Nắm vững State Management (Redux, Zustand), React Hooks, Component Architecture.
- Sử dụng thành thạo HTML5, CSS3, Tailwind CSS.
- Tối ưu hiệu năng render và Web Vitals.
- Có kinh nghiệm tích hợp RESTful APIs, Next.js và làm việc với Git.`}
                  className="w-full bg-slate-50/40 border border-slate-300 rounded-xl p-4 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white font-mono leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Run Match Action Button */}
            <div className="pt-2">
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !jdText.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] active:scale-[0.99] text-white font-bold text-sm shadow-sm hover:shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>AI Engine Đang So Khớp CV vs JD...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>So Khớp Trực Quan CV vs JD (Run AI Analysis)</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* SECTION 2: AI EVALUATION RESULTS DASHBOARD */}
        {analysisResult && (
          <div className="space-y-6 pt-2">
            
            {/* Score & Executive Summary Hero Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                {/* Score Gauge Ring */}
                <div className={`w-28 h-28 flex-shrink-0 flex flex-col items-center justify-center rounded-2xl border-2 shadow-xs transition-all ${
                  analysisResult.overallScore < 50
                    ? 'bg-rose-50 border-rose-300 shadow-rose-100'
                    : analysisResult.overallScore >= 80
                    ? 'bg-emerald-50 border-emerald-300 shadow-emerald-50'
                    : analysisResult.overallScore >= 60
                    ? 'bg-blue-50 border-blue-200 shadow-blue-50'
                    : 'bg-amber-50 border-amber-200 shadow-amber-50'
                }`}>
                  <span className={`text-3xl font-black tracking-tight ${
                    analysisResult.overallScore < 50
                      ? 'text-rose-600 font-black'
                      : analysisResult.overallScore >= 80
                      ? 'text-emerald-700'
                      : analysisResult.overallScore >= 60
                      ? 'text-[#1e3a8a]'
                      : 'text-amber-700'
                  }`}>
                    {analysisResult.overallScore}%
                  </span>
                  <span className={`block text-[10px] uppercase font-bold tracking-wider mt-0.5 ${
                    analysisResult.overallScore < 50
                      ? 'text-rose-600 font-extrabold'
                      : analysisResult.overallScore >= 80
                      ? 'text-emerald-700'
                      : analysisResult.overallScore >= 60
                      ? 'text-blue-700'
                      : 'text-amber-700'
                  }`}>
                    Overall Match
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                    <span className={`text-xs font-bold font-mono px-3 py-1 rounded-full border ${
                      analysisResult.overallScore >= 90 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : analysisResult.overallScore >= 80 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : analysisResult.overallScore >= 70
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : analysisResult.overallScore >= 50
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-300 font-black shadow-xs'
                    }`}>
                      {analysisResult.rulebookLevel || `${analysisResult.matchRating.toUpperCase()} MATCH`}
                    </span>

                    {/* Detected Level Badge */}
                    {jev?.framework_variables && (
                      <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        LEVEL: {jev.framework_variables.detected_level.toUpperCase()}
                      </span>
                    )}

                    {/* Gate Check Badge */}
                    {jev?.gate_check && (
                      <span className={`text-xs font-bold font-mono px-3 py-1 rounded-full border flex items-center gap-1 ${
                        jev.gate_check.passed 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {jev.gate_check.passed ? '✓ Gate Check: PASSED' : '✕ Gate Check: REJECTED (Score: 0)'}
                      </span>
                    )}

                    {jev?.trust_index && (
                      <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        TIER: {jev.trust_index.trust_tier} (x{jev.trust_index.multiplier})
                      </span>
                    )}

                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      CV-JD Matching Framework v2.0 (Skill-Gated)
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-[#0f172a] mb-2">
                    Kết Quả Đánh Giá Tương Thích (Framework v2.0): {activeCandidate.name} ➔ {getDetectedJobTitle(jdText)}
                  </h3>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed max-w-2xl">
                    {analysisResult.summary}
                  </p>
                  
                  {/* Applied Formula Info */}
                  {jev?.framework_variables?.applied_formula && (
                    <div className="mt-2.5 text-[11px] font-mono text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200 max-w-2xl space-y-1">
                      <div><strong>📐 Công thức tính điểm (Framework v2.0):</strong> {jev.framework_variables.applied_formula}</div>
                      {jev.framework_variables.raw_score !== undefined && (
                        <div className="text-slate-500 text-[10px]">
                          Raw Score: <strong>{jev.framework_variables.raw_score}</strong> | Critical Skill Modifier: <strong>x{jev.framework_variables.skill_modifier ?? 1.0}</strong> ({jev.framework_variables.css_status || 'Matched'}) ➔ Final Score: <strong>{analysisResult.overallScore}</strong>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* GATE CHECK STATUS BANNER (IF REJECTED OR NOTED) */}
            {jev?.gate_check && !jev.gate_check.passed && (
              <div className="bg-rose-50/90 border-2 border-rose-300 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>CẢNH BÁO STEP 1 (GATE CHECK): Hồ sơ bị từ chối (Status: Reject ➔ Final Score = 0)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-rose-800 list-disc pl-5">
                  {jev.gate_check.failedReasons.map((reason, idx) => (
                    <li key={idx}><strong>{reason}</strong></li>
                  ))}
                </ul>
              </div>
            )}

            {/* CORE VARIABLES BREAKDOWN (FRAMEWORK v2.0) */}
            {jev?.framework_variables && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-bold text-base text-[#0f172a] flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      Ma Trận Biến Số Cốt Lõi (Framework v2.0 - Skill-Gated Matching)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">Hệ số kỹ năng cốt lõi (CSS) đóng vai trò cổng chặn & điều chỉnh điểm số tổng hợp</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {jev.framework_variables.css !== undefined && (
                      <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                        jev.framework_variables.css >= 80
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : jev.framework_variables.css >= 60
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : jev.framework_variables.css >= 40
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        CSS: {jev.framework_variables.css}% (Mod: x{jev.framework_variables.skill_modifier ?? 1.0})
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 w-fit">
                      Level: {jev.framework_variables.detected_level.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {/* SMS */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="text-[11px] font-mono font-bold text-blue-800 uppercase">1. SMS (Skill)</div>
                    <div className="text-xl font-black text-blue-700">{jev.framework_variables.sms}%</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${jev.framework_variables.sms}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500">Khớp kỹ năng yêu cầu</p>
                  </div>

                  {/* ERS */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="text-[11px] font-mono font-bold text-indigo-800 uppercase">2. ERS (Experience)</div>
                    <div className="text-xl font-black text-indigo-700">{jev.framework_variables.ers}%</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${jev.framework_variables.ers}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500">Ngành, Vai trò, Domain</p>
                  </div>

                  {/* IS */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="text-[11px] font-mono font-bold text-amber-800 uppercase">3. IS (Impact)</div>
                    <div className="text-xl font-black text-amber-700">{jev.framework_variables.is}%</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${jev.framework_variables.is}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500">Kết quả định lượng số liệu</p>
                  </div>

                  {/* CS */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="text-[11px] font-mono font-bold text-emerald-800 uppercase">4. CS (Credibility)</div>
                    <div className="text-xl font-black text-emerald-700">{jev.framework_variables.cs}% <span className="text-xs font-bold text-slate-400">L{jev.framework_variables.cs_level}</span></div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${jev.framework_variables.cs}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500">Mức độ tin cậy minh chứng</p>
                  </div>

                  {/* GPS */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="text-[11px] font-mono font-bold text-purple-800 uppercase">5. GPS (Growth)</div>
                    <div className="text-xl font-black text-purple-700">{jev.framework_variables.gps}%</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: `${jev.framework_variables.gps}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500">Tiềm năng & chứng chỉ</p>
                  </div>

                  {/* CMS */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="text-[11px] font-mono font-bold text-cyan-800 uppercase">6. CMS (Complexity)</div>
                    <div className="text-xl font-black text-cyan-700">{jev.framework_variables.cms}%</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-600 h-full rounded-full" style={{ width: `${jev.framework_variables.cms}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500">Quy mô & độ khó kỹ thuật</p>
                  </div>
                </div>
              </div>
            )}

            {/* CRITICAL GAPS WARNING BANNER */}
            {jev?.rulebook_gap_analysis?.criticalGaps && jev.rulebook_gap_analysis.criticalGaps.length > 0 && (
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Cảnh Báo Lỗ Hổng Năng Lực Cần Bổ Sung (Critical Gaps - {jev.rulebook_gap_analysis.criticalGaps.length}):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {jev.rulebook_gap_analysis.criticalGaps.map((gap, idx) => (
                    <div key={idx} className="bg-white border border-rose-200/80 rounded-xl p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-rose-900 truncate">{gap.requirement}</span>
                        <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                          {gap.severity}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{gap.candidateValue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4-Pillar Breakdown Matrix */}
            {jev && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Pillar 1 */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-700">
                      <Target className="w-4 h-4" /> 1. HARD SKILLS (SMS)
                    </div>
                    <span className="text-sm font-black text-[#0f172a]">{jev.pillars.skill_fit.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${jev.pillars.skill_fit.score}%` }} />
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="text-slate-500 font-semibold">Khớp cốt lõi:</div>
                    <div className="flex flex-wrap gap-1">
                      {jev.pillars.skill_fit.matched_core.length > 0 ? (
                        jev.pillars.skill_fit.matched_core.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">
                            ✓ {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-[10px] italic">Chưa khớp kỹ năng cốt lõi</span>
                      )}
                    </div>
                    {jev.pillars.skill_fit.missing_core.length > 0 && (
                      <>
                        <div className="text-slate-500 font-semibold pt-1">Thiếu cốt lõi:</div>
                        <div className="flex flex-wrap gap-1">
                          {jev.pillars.skill_fit.missing_core.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-medium">
                              ✗ {s}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-700">
                      <ShieldCheck className="w-4 h-4" /> 2. CREDIBILITY (CS)
                    </div>
                    <span className="text-sm font-black text-[#0f172a]">{jev.pillars.evidence_depth.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${jev.pillars.evidence_depth.score}%` }} />
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    {jev.pillars.evidence_depth.top_contributing_projects && jev.pillars.evidence_depth.top_contributing_projects.length > 0 ? (
                      <>
                        <p>• <strong className="text-indigo-700">{jev.pillars.evidence_depth.verified_relevant_count ?? jev.pillars.evidence_depth.top_contributing_projects.filter(p => p.is_verified).length}</strong> / {jev.pillars.evidence_depth.top_contributing_projects.length} đồ án có Verified Badge.</p>
                        <p>• Khối lượng minh chứng: <span className="font-mono font-bold text-[#0f172a]">{jev.pillars.evidence_depth.total_evidence_mass}</span></p>
                      </>
                    ) : (
                      <p className="text-rose-600 italic">
                        ⚠️ Không có đồ án nào phù hợp với yêu cầu của JD này (0 đồ án liên quan).
                      </p>
                    )}
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700">
                      <BarChart3 className="w-4 h-4" /> 3. QUANTIFIED IMPACT (IS)
                    </div>
                    <span className="text-sm font-black text-[#0f172a]">{jev.pillars.impact_complexity.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${jev.pillars.impact_complexity.score}%` }} />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {jev.pillars.impact_complexity.feedback}
                  </p>
                </div>

                {/* Pillar 4 */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-700">
                      <Cpu className="w-4 h-4" /> 4. RELEVANCE & LEVEL (ERS)
                    </div>
                    <span className="text-sm font-black text-[#0f172a]">{jev.pillars.alignment_level.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${jev.pillars.alignment_level.score}%` }} />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {jev.pillars.alignment_level.note}
                  </p>
                </div>
              </div>
            )}

            {/* MBTI Cultural & Workplace Style Fit Card */}
            {(jev?.mbti_compatibility || analysisResult?.mbtiCompatibility) && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-200/70 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-600 text-white shadow-xs">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-purple-200 text-purple-800 text-xs font-mono font-black">
                          {jev?.mbti_compatibility?.mbti_type || analysisResult?.mbtiCompatibility?.mbtiType}
                        </span>
                        <h3 className="font-bold text-lg text-[#0f172a]">
                          {jev?.mbti_compatibility?.role_alignment_title || analysisResult?.mbtiCompatibility?.roleAlignmentTitle}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Đánh giá mức độ hòa nhập văn hóa và phong cách làm việc của nhóm tính cách với vị trí này
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-purple-200 w-fit">
                    <span className="text-xs text-slate-500 font-semibold">Độ tương thích văn hóa:</span>
                    <span className="text-lg font-black text-purple-700 font-mono">
                      {jev?.mbti_compatibility?.cultural_fit_score || analysisResult?.mbtiCompatibility?.culturalFitScore}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="bg-white/80 border border-purple-100 rounded-xl p-4 space-y-2">
                    <div className="text-xs font-bold text-purple-900 uppercase tracking-wide">✨ Điểm mạnh phong cách làm việc:</div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {(jev?.mbti_compatibility?.cultural_strengths || analysisResult?.mbtiCompatibility?.culturalStrengths || []).map((st, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/80 border border-purple-100 rounded-xl p-4 space-y-2">
                    <div className="text-xs font-bold text-purple-900 uppercase tracking-wide">🤝 Tác động đội ngũ & Hợp tác:</div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {jev?.mbti_compatibility?.workplace_synergy || analysisResult?.mbtiCompatibility?.workplaceSynergy}
                    </p>
                    <div className="pt-2">
                      <a
                        href="/mbti-test"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors"
                      >
                        Xem chi tiết bài trắc nghiệm MBTI của bạn →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Relevant Contributing Projects Section */}
            {jev && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#0f172a]">Đồ Án Minh Chứng Khớp Với Vị Trí (Relevant Projects)</h3>
                      <p className="text-xs text-slate-500">Chỉ chọn lọc các đồ án có công nghệ và nội dung liên quan trực tiếp đến JD (loại bỏ đồ án không liên quan)</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 w-fit">
                    {jev.pillars.evidence_depth.top_contributing_projects.length} đồ án phù hợp
                  </span>
                </div>

                {jev.pillars.evidence_depth.top_contributing_projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jev.pillars.evidence_depth.top_contributing_projects.map((proj) => (
                      <div
                        key={proj.id}
                        className={`p-4 rounded-xl border space-y-3 transition-all ${
                          proj.is_verified
                            ? 'bg-emerald-50/40 border-emerald-300'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-[#0f172a] line-clamp-1">{proj.title}</h4>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            proj.is_verified
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {proj.is_verified ? '🛡️ Verified Badge' : 'Tự khai'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 text-[11px]">Mức độ minh chứng:</span>
                          <span className="font-mono text-blue-700 font-bold text-[11px]">
                            {proj.evidence_level === 'institutional_verified' ? 'Cấp 3 (Giảng viên/Mentor)' :
                             proj.evidence_level === 'live_artifact' ? 'Cấp 2 (Live Demo/GitHub)' :
                             proj.evidence_level === 'self_documented' ? 'Cấp 1 (Mô tả chi tiết)' : 'Cấp 0 (Tự khai)'}
                          </span>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-slate-200">
                          <div className="text-[11px] text-slate-500 font-semibold">Kỹ năng khớp với JD ({proj.matched_jd_requirements.length}):</div>
                          <div className="flex flex-wrap gap-1">
                            {proj.matched_jd_requirements.map((req) => (
                              <span key={req} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-medium border border-emerald-200">
                                ✓ {req}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                          <span className="text-slate-500 text-[11px]">Đóng góp bằng chứng:</span>
                          <span className="font-black text-emerald-700 font-mono text-xs">{proj.relevance_score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Không tìm thấy đồ án nào trong hồ sơ khớp với yêu cầu vị trí này</p>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Hệ thống AI Matching đã tự động loại bỏ các đồ án không liên quan để đảm bảo điểm số minh chứng chính xác 100%. Hãy bổ sung dự án thực tế liên quan đến JD.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Gap Analysis & Actionable Remediation Roadmap */}
            {jev && jev.gap_analysis && jev.gap_analysis.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#0f172a]">Lỗ Hổng Năng Lực & Đề Xuất Đồ Án Bù Đắp (Gap Remediation)</h3>
                      <p className="text-xs text-slate-500">Lộ trình thực chiến giúp bạn bù đắp đúng các kỹ năng JD yêu cầu</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jev.gap_analysis.map((gap, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-rose-700 uppercase tracking-wide">
                          {gap.importance} GAP: {gap.skill_or_topic}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> ~{gap.remediation_roadmap.estimated_effort_weeks} tuần
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-[#0f172a]">
                        {gap.remediation_roadmap.suggested_project_title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {gap.remediation_roadmap.project_objective}
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-slate-200">
                        <div className="text-[11px] text-slate-500 font-semibold">Tech Stack đề xuất:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {gap.remediation_roadmap.recommended_tech_stack.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                        🎯 Mục tiêu đầu ra: {gap.remediation_roadmap.target_metrics}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coaching Tips */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Hướng Dẫn Tối Ưu Hóa CV Theo Chuẩn Rubrics</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                {analysisResult.optimizationTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <ChevronRight className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Version Progression & Score Improvement History */}
            {historyList.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0f172a]">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>Lịch Sử Tiến Trình Tương Thích Theo Phiên Bản (Version History)</span>
                  </div>
                  <button
                    onClick={() => {
                      clearCompatibilityMatchHistory();
                      setHistoryList([]);
                    }}
                    className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
                  >
                    Xóa lịch sử
                  </button>
                </div>

                <div className="space-y-2 overflow-x-auto">
                  <div className="grid grid-cols-5 text-[11px] font-mono text-slate-500 px-3 py-1 min-w-[500px]">
                    <span>PHIÊN BẢN</span>
                    <span>VỊ TRÍ</span>
                    <span>ĐIỂM SỐ</span>
                    <span>TRUST TIER</span>
                    <span>THỜI ĐIỂM</span>
                  </div>
                  {historyList.map((hist, idx) => (
                    <div
                      key={hist.id || idx}
                      className="grid grid-cols-5 items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 font-mono min-w-[500px]"
                    >
                      <span className="font-bold text-blue-700">{hist.versionLabel || `v${historyList.length - idx}`}</span>
                      <span className="truncate text-slate-900 font-medium">{hist.targetRole}</span>
                      <span className="font-black text-slate-900 flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          hist.overallScore >= 80 ? 'bg-emerald-100 text-emerald-800' : hist.overallScore >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {hist.overallScore}%
                        </span>
                      </span>
                      <span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                          {hist.trustTier}
                        </span>
                      </span>
                      <span className="text-[10.5px] text-slate-500">
                        {new Date(hist.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(hist.timestamp).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Closed-Loop Navigation: CV Builder Integration Card */}
            <div className="bg-[#1e3a8a] text-white rounded-2xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center sm:text-left">
                <h4 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  Sẵn sàng cải thiện điểm số tương thích của CV?
                </h4>
                <p className="text-blue-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  Chuyển thẳng sang <strong>AI CV Builder</strong> với ngữ cảnh vị trí <em>{getDetectedJobTitle(jdText)}</em> để chỉnh sửa CV và đánh giá lại (Re-Match) ngay tức thì.
                </p>
              </div>
              <button
                onClick={() => navigate('/cv-builder', {
                  state: {
                    targetJd: jdText,
                    targetRole: getDetectedJobTitle(jdText),
                    coachingTips: analysisResult.optimizationTips,
                    gapAnalysis: jev?.gap_analysis
                  }
                })}
                className="px-6 py-3.5 bg-white hover:bg-slate-100 text-[#1e3a8a] font-bold text-sm rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer"
              >
                ✏️ Cải Thiện CV Trong Builder →
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default PortfolioMatchPage;
