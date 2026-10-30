import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabase';
import RecruiterDashboard from '../recruiter/RecruiterDashboard';
import CvHeatmapWidget from '../../components/student/CvHeatmapWidget';
import SalaryBenchmarkModal from '../../components/student/SalaryBenchmarkModal';
import AiMockInterviewModal from '../../components/student/AiMockInterviewModal';
import CreateCvFlowModal from '../../components/cv/CreateCvFlowModal';
import InterviewWarRoomModal from '../../components/student/InterviewWarRoomModal';
import CvQuickViewModal from '../../components/cv/CvQuickViewModal';
import ProjectDefenseModal from '../../components/cv/ProjectDefenseModal';
import VerifiedBadge from '../../components/common/VerifiedBadge';
import SpotlightTour, { type SpotlightStep } from '../../components/common/SpotlightTour';
import ShowcaseQrModal from '../../components/student/ShowcaseQrModal';
import { selfInterviewService, type CandidateInterviewSession } from '../../services/selfInterviewService';
import { cvService, type ManagedCVItem } from '../../services/cvService';
import {
  FolderKanban,
  Award,
  Sparkles,
  ExternalLink,
  Code2,
  ArrowRight,
  UserCheck,
  Bell,
  Clock,
  MapPin,
  Video,
  CheckCircle2,
  Briefcase,
  FileText,
  Calendar,
  DollarSign,
  Mic,
  Copy,
  ChevronDown,
  ChevronUp,
  Share2,
  TrendingUp,
  Eye,
  Check,
  Building2,
  ShieldAlert,
  Trash2,
  Plus,
  Compass,
  QrCode
} from 'lucide-react';
import type { VerificationStatus } from '../../types/database';
import { getSharedPipeline, updateInterviewStatusByStudent, requestInterviewRescheduleByStudent } from '../../utils/pipelineSync';

interface Project {
  id: string;
  title: string;
  description: string;
  demo_url?: string;
  github_url?: string;
  is_verified?: boolean;
  verification_status?: VerificationStatus;
  instructor?: string;
  project_type?: string;
  tags?: string[];
  created_at: string;
}

interface StudentProfileData {
  full_name?: string;
  major?: string;
  university?: string;
  gpa?: string;
  bio?: string;
  skills?: string[];
  avatar_url?: string;
}

interface CertificateData {
  id: string;
  title: string;
  issuer: string;
}

interface AchievementData {
  id: string;
  title: string;
}

interface InterviewFeedbackData {
  id: string;
  technical_score: number;
  soft_skills_score: number;
}

interface StudentInterviewItem {
  id: string;
  student_id?: string;
  recruiter_name: string;
  job_title: string;
  interview_date: string;
  interview_time: string;
  meeting_link: string;
  interview_location: string;
  notes?: string;
  is_confirmed?: boolean;
}

export default function Dashboard() {
  const { user, userRole } = useAuth();
  
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [feedbacks, setFeedbacks] = useState<InterviewFeedbackData[]>([]);
  const [studentInterviews, setStudentInterviews] = useState<StudentInterviewItem[]>([]);
  const [pipelineTotal, setPipelineTotal] = useState(0);

  // War Room Sessions
  const [interviewSessions, setInterviewSessions] = useState<CandidateInterviewSession[]>(() => selfInterviewService.getAllSessions());
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);
  const [isWarRoomModalOpen, setIsWarRoomModalOpen] = useState(false);

  // Quick View CV modal
  const [quickViewCv, setQuickViewCv] = useState<ManagedCVItem | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Project Defense modal
  const [isDefenseModalOpen, setIsDefenseModalOpen] = useState(false);
  const [defenseProjects, setDefenseProjects] = useState<any[]>([]);

  // Targeted Mock Interview parameters
  const [mockInterviewTarget, setMockInterviewTarget] = useState<{
    companyName?: string;
    roleTitle?: string;
    projectName?: string;
    techStack?: string[];
  }>({});

  // Modals state
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [isMockInterviewModalOpen, setIsMockInterviewModalOpen] = useState(false);
  const [isCreateCvModalOpen, setIsCreateCvModalOpen] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSpotlightTourOpen, setIsSpotlightTourOpen] = useState(false);
  const [isShowcaseQrOpen, setIsShowcaseQrOpen] = useState(false);

  // Kịch bản 3 bước rọi đèn Spotlight phong cách Game Quest
  const tourSteps: SpotlightStep[] = [
    {
      targetId: 'tour-create-cv',
      title: 'Vũ Khí 1: May Đo CV Khớp JD Tự Động',
      description: 'Chỉ cần dán nội dung Job Description (JD), AI sẽ tự động tái cấu trúc hồ sơ, khớp chuẩn từ khóa công nghệ và lọc đồ án liên quan nhất để đạt điểm ATS tối đa!',
      badge: 'Nhiệm Vụ 1/3 • May Đo CV ATS',
      actionText: 'Mở Trình May Đo Thử Ngay',
      onAction: () => setIsCreateCvModalOpen(true)
    },
    {
      targetId: 'tour-salary-benchmark',
      title: 'Vũ Khí 2: Khảo Sát Dải Lương (AI Benchmark)',
      description: 'Nắm vững dải lương thị trường thực tế theo cấp bậc (Fresher/Junior/Middle) và vị trí của bạn. Giúp bạn định giá chuẩn xác và tự tin deal lương!',
      badge: 'Nhiệm Vụ 2/3 • Dải Lương Thực Tế',
      actionText: 'Tra Cứu Dải Lương Thử Ngay',
      onAction: () => setIsSalaryModalOpen(true)
    },
    {
      targetId: 'tour-showcase-qr',
      title: 'Vũ Khí 3: Bằng Chứng Showcase & Smart QR Code',
      description: 'Bảo chứng năng lực thực chiến (Proof-of-Work)! Tạo mã QR thông minh in lên CV giấy hoặc chép link Showcase để Nhà tuyển dụng kiểm định đồ án thực tế chỉ trong 1 chạm.',
      badge: 'Nhiệm Vụ 3/3 • Bằng Chứng Năng Lực',
      actionText: 'Xem Mã QR Showcase Của Bạn',
      onAction: () => setIsShowcaseQrOpen(true)
    }
  ];

  // Tự động kích hoạt Spotlight Tour cho người mới
  useEffect(() => {
    if (userRole === 'student') {
      try {
        const isCompleted = localStorage.getItem('profilehub_spotlight_tour_completed_v1');
        if (!isCompleted) {
          const tourTimer = setTimeout(() => {
            setIsSpotlightTourOpen(true);
          }, 800);
          return () => clearTimeout(tourTimer);
        }
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
    }
  }, [userRole]);

  // Lắng nghe sự kiện cập nhật danh sách phỏng vấn từ LocalStorage
  useEffect(() => {
    const handleSessionsChange = (e: any) => {
      if (e.detail) {
        setInterviewSessions(e.detail);
      } else {
        setInterviewSessions(selfInterviewService.getAllSessions());
      }
    };
    window.addEventListener('profilehub_interview_sessions_change', handleSessionsChange);
    return () => {
      window.removeEventListener('profilehub_interview_sessions_change', handleSessionsChange);
    };
  }, []);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [profileRes, projectsRes, certsRes, achsRes, fbsRes] = await Promise.all([
        supabase.from('student_profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('projects').select('*').eq('student_id', user.id).order('created_at', { ascending: false }),
        supabase.from('certificates').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('achievements').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('interview_feedbacks').select('*').eq('student_id', user.id)
      ]);

      if (profileRes.data) setProfile(profileRes.data as StudentProfileData);
      if (projectsRes.data) setProjects(projectsRes.data as Project[]);
      if (certsRes.data) setCertificates(certsRes.data as CertificateData[]);
      if (achsRes.data) setAchievements(achsRes.data as AchievementData[]);
      if (fbsRes.data) setFeedbacks(fbsRes.data as InterviewFeedbackData[]);
    } catch (err) {
      console.error('Error fetching student dashboard data:', err);
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        await fetchDashboardData();
      }

      if (userRole === 'student') {
        const localPipeline = getSharedPipeline(user?.id);
        setPipelineTotal(localPipeline.length || 6);

        const interviews = localPipeline.filter((p: any) => p.stage === 'interview' || p.interview_date).map((p: any) => ({
          id: p.id,
          student_id: p.student_id || user?.id || 's3',
          recruiter_name: 'Enterprise Tech Corp',
          job_title: p.student?.major || 'Thực tập sinh Công nghệ',
          interview_date: p.interview_date || '2026-09-26',
          interview_time: p.interview_time || '10:00 AM',
          meeting_link: p.meeting_link || 'https://meet.google.com/abc-defg-hij',
          interview_location: p.interview_location || 'Online (Google Meet)',
          notes: p.private_notes,
          is_confirmed: p.interview_status === 'confirmed'
        }));

        if (interviews.length > 0) {
          setStudentInterviews(interviews);
        } else {
          setStudentInterviews([]);
        }
      }
    };
    loadData();
  }, [user, userRole, fetchDashboardData]);

  // If recruiter role, render Recruiter Dashboard
  if (userRole === 'recruiter') {
    return <RecruiterDashboard />;
  }

  // Calculate Dynamic Metrics
  const totalProjects = projects.length;
  const verifiedProjects = projects.filter(p => p.is_verified || p.verification_status === 'verified');
  const verifiedCount = verifiedProjects.length;
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Sinh Viên';
  const targetMajor = profile?.major || 'Kỹ Sư Phần Mềm';

  const handleStartTargetedMockInterview = (session: CandidateInterviewSession) => {
    setMockInterviewTarget({
      companyName: session.company_name,
      roleTitle: session.role_title,
      projectName: session.primary_project_name || projects[0]?.title || 'E-Commerce Platform',
      techStack: session.target_tech_stack && session.target_tech_stack.length > 0 
        ? session.target_tech_stack 
        : (profile?.skills || ['React', 'TypeScript', 'Node.js', 'PostgreSQL'])
    });
    setIsMockInterviewModalOpen(true);
  };

  const handleOpenProjectDefense = (session: CandidateInterviewSession) => {
    let projList: any[] = [];
    if (session.linked_cv_id) {
      const cv = cvService.getCVById(session.linked_cv_id);
      const projectSec = cv?.data.sections?.find((s: any) => s.type === 'projects');
      if (projectSec?.items) {
        projList = projectSec.items;
      }
    }
    if (projList.length === 0) {
      projList = projects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        technologies: p.tags || ['React', 'Node.js'],
        highlights: [p.description]
      }));
    }
    setDefenseProjects(projList);
    setIsDefenseModalOpen(true);
  };

  const handleOpenLinkedCv = (session: CandidateInterviewSession) => {
    let cvToView: ManagedCVItem | null = null;
    if (session.linked_cv_id) {
      cvToView = cvService.getCVById(session.linked_cv_id);
    }
    if (!cvToView) {
      cvToView = cvService.getActiveCV();
    }
    if (!cvToView) {
      const all = cvService.getAllCVs();
      if (all.length > 0) cvToView = all[0];
    }

    if (cvToView) {
      setQuickViewCv(cvToView);
      setIsQuickViewOpen(true);
    } else {
      alert('Chưa tìm thấy bản CV liên kết trong kho!');
    }
  };

  const handleCopyShowcaseLink = () => {
    const link = `${window.location.origin}/showcase/${user?.id || 'demo'}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#090d16] pb-16 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. Header Bàn Làm Việc */}
      <div className="bg-white/90 dark:bg-[#0c101c]/90 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1e3a8a] to-[#2563eb] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                <span>{displayName}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {targetMajor}
                </span>

                {/* Danh Thiếp Số: Smart QR Code & Link Showcase */}
                <div id="tour-showcase-qr" className="flex items-center gap-1.5 ml-1">
                  <button
                    onClick={() => setIsShowcaseQrOpen(true)}
                    className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold rounded-md transition flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                    title="Xem mã Smart QR Code để in lên CV hoặc quét nhanh"
                  >
                    <QrCode size={12} className="text-indigo-600 dark:text-indigo-400" />
                    <span>Mã QR</span>
                  </button>
                  <button
                    onClick={handleCopyShowcaseLink}
                    className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded-md transition flex items-center gap-1 cursor-pointer"
                    title="Sao chép liên kết Showcase nộp bài tức thì"
                  >
                    {copiedLink ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    <span>{copiedLink ? 'Đã chép' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Trung Tâm Hành Động Ứng Viên</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút bật lại Spotlight Tour kiểu Game */}
            <button
              onClick={() => setIsSpotlightTourOpen(true)}
              className="px-2.5 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Khám phá nhanh tính năng cốt lõi (Game Spotlight Tour)"
            >
              <Compass size={14} className="text-amber-500 animate-spin-slow" />
              <span className="hidden sm:inline">Tour Game</span>
            </button>

            {/* Bước 1: Rọi đèn vào nút + Tạo CV Mới Khớp JD (Single Hero CTA) */}
            <button
              id="tour-create-cv"
              onClick={() => setIsCreateCvModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-indigo-950/20 cursor-pointer active:scale-95"
              title="May đo CV chuẩn ATS khớp JD"
            >
              <Sparkles size={15} className="text-amber-300" />
              <span>+ Tạo CV May Đo Theo JD</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">

        {/* =========================================================================
         * PHÂN VÙNG 1: TIÊU ĐIỂM HÔM NAY (ACTION REQUIRED)
         * ========================================================================= */}
        <section aria-label="Tiêu điểm hôm nay: Trạm tác chiến phỏng vấn">
          {interviewSessions.length > 0 ? (
            /* CASE A: CÓ LỊCH PHỎNG VẤN TRONG WAR ROOM */
            <div className="bg-gradient-to-br from-indigo-900 via-[#1e3a8a] to-[#1e40af] dark:from-[#0d162a] dark:via-[#16203d] dark:to-[#1a2c52] text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-blue-950/15 dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-indigo-700/50 dark:border-indigo-500/30 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white/5 blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                {/* Header bar of War Room */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-400" />
                      ⚡ Trạm Tác Chiến Phỏng Vấn (Interview War Room)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-200 font-semibold hidden sm:inline">
                      {interviewSessions.length} lịch hẹn mục tiêu
                    </span>
                    <button
                      onClick={() => setIsWarRoomModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/20 active:scale-95 cursor-pointer shadow-xs"
                    >
                      <Plus size={14} />
                      <span>+ Thêm Lịch Phỏng Vấn Mới</span>
                    </button>
                  </div>
                </div>

                {/* Multi-session selector chips if > 1 session */}
                {interviewSessions.length > 1 && (
                  <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-white/10">
                    <span className="text-[11px] font-bold text-blue-200">Chọn doanh nghiệp:</span>
                    {interviewSessions.map((s, idx) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSessionIndex(idx)}
                        className={`text-xs px-3 py-1 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                          selectedSessionIndex === idx
                            ? 'bg-white text-indigo-950 shadow-md font-black'
                            : 'bg-white/10 hover:bg-white/20 text-blue-100 border border-white/10'
                        }`}
                      >
                        <Building2 size={12} />
                        <span>{s.company_name}</span>
                        <span className="text-[10px] opacity-75">({s.interview_date})</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Active Session Content */}
                {(() => {
                  const currentSession = interviewSessions[selectedSessionIndex] || interviewSessions[0];
                  if (!currentSession) return null;

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                      <div className="lg:col-span-2 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1">
                            <Building2 size={14} />
                            {currentSession.company_name}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                            currentSession.source === 'recruiter_invited'
                              ? 'bg-purple-500/30 text-purple-200 border-purple-400/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                          }`}>
                            {currentSession.source === 'recruiter_invited' ? '🏷️ Doanh Nghiệp Mời' : '🏷️ Tự Lên Lịch'}
                          </span>
                          {currentSession.status === 'passed' && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black">
                              🎉 Đã Đậu Offer
                            </span>
                          )}
                        </div>

                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                          {currentSession.role_title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100 pt-0.5">
                          <span className="flex items-center gap-1.5 font-bold text-amber-300">
                            <Clock size={15} />
                            {currentSession.interview_date} lúc {currentSession.interview_time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            {currentSession.format === 'online' ? <Video size={15} /> : <MapPin size={15} />}
                            {currentSession.format === 'online' 
                              ? (currentSession.meeting_link ? 'Trực tuyến (Có link họp)' : 'Trực tuyến')
                              : (currentSession.location_address || 'Trực tiếp tại văn phòng')}
                          </span>
                          {currentSession.linked_cv_title && (
                            <span className="flex items-center gap-1.5 text-indigo-200 font-semibold">
                              <FileText size={14} />
                              Hồ sơ: {currentSession.linked_cv_title}
                            </span>
                          )}
                        </div>

                        {/* Tech Stack Chips from Linked CV */}
                        {currentSession.target_tech_stack && currentSession.target_tech_stack.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] font-bold text-blue-200">Trọng tâm kỹ thuật:</span>
                            {currentSession.target_tech_stack.slice(0, 5).map((tech, idx) => (
                              <span key={idx} className="text-[10px] font-semibold bg-white/15 px-2 py-0.5 rounded-md border border-white/10 text-white">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {currentSession.personal_notes && (
                          <p className="text-xs text-blue-200/90 italic pt-1 bg-black/20 p-2.5 rounded-xl border border-white/10">
                            💡 Ghi chú ôn tập: {currentSession.personal_notes}
                          </p>
                        )}
                      </div>

                      {/* 1-Touch Action Pod */}
                      <div className="flex flex-col gap-2.5 bg-white/10 dark:bg-black/20 p-4 rounded-2xl border border-white/15 backdrop-blur-md">
                        {/* KILLER ACTION 1: AI MOCK INTERVIEW */}
                        <button
                          onClick={() => handleStartTargetedMockInterview(currentSession)}
                          className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-950/40 transition-all active:scale-95 cursor-pointer"
                        >
                          <Mic size={17} className="text-amber-300 animate-pulse" />
                          <span>🎙️ Luyện Phỏng Vấn AI ({currentSession.company_name})</span>
                        </button>

                        {/* KILLER ACTION 2: PROJECT DEFENSE TRAPS */}
                        <button
                          onClick={() => handleOpenProjectDefense(currentSession)}
                          className="py-2.5 px-3 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                        >
                          <ShieldAlert size={15} className="text-amber-400" />
                          <span>🛡️ Ôn Bộ Câu Hỏi Bẫy Đồ Án</span>
                        </button>

                        {/* KILLER ACTION 3: REVIEW LINKED CV */}
                        <button
                          onClick={() => handleOpenLinkedCv(currentSession)}
                          className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-blue-100 border border-white/15 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                        >
                          <FileText size={15} className="text-indigo-300" />
                          <span>📄 Mở Đúng Bản CV Đã Gửi Để Ôn Bài</span>
                        </button>

                        {/* ACTION 4: DIRECT MEETING LINK IF AVAILABLE */}
                        {currentSession.meeting_link && (
                          <a
                            href={currentSession.meeting_link}
                            target="_blank"
                            rel="noreferrer"
                            className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
                          >
                            <Video size={15} className="fill-slate-950" />
                            <span>Vào Phòng Họp Online Ngay</span>
                          </a>
                        )}

                        {/* STATUS TOGGLE & DELETE */}
                        <div className="pt-1 flex items-center justify-between text-[11px] text-blue-200">
                          <button
                            onClick={() => {
                              const newStatus = currentSession.status === 'passed' ? 'completed' : 'passed';
                              selfInterviewService.updateStatus(currentSession.id, newStatus);
                              setInterviewSessions(selfInterviewService.getAllSessions());
                            }}
                            className="hover:underline font-bold text-emerald-300 cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 size={12} />
                            <span>{currentSession.status === 'passed' ? 'Hủy đánh dấu đậu' : 'Đánh dấu Đậu Offer!'}</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa lịch phỏng vấn tại ${currentSession.company_name}?`)) {
                                selfInterviewService.deleteSession(currentSession.id);
                                const remaining = selfInterviewService.getAllSessions();
                                setInterviewSessions(remaining);
                                setSelectedSessionIndex(0);
                              }
                            }}
                            className="hover:underline text-rose-300/80 hover:text-rose-200 cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            <span>Xóa lịch</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            /* CASE B: KHÔNG CÓ LỊCH PHỎNG VẤN -> SMART NEXT ACTION CARD */
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#1e3a8a] dark:from-[#0b1224] dark:via-[#141d38] dark:to-[#182649] text-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-blue-950/10 dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-blue-800/40 dark:border-indigo-500/20 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <Sparkles size={14} className="animate-pulse" />
                    <span>Hành Động Khuyên Dùng Hôm Nay (Smart Next Action)</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    Hồ sơ {targetMajor} của bạn đang sẵn sàng tiếp cận các cơ hội mới
                  </h2>
                  <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                    Đã có {verifiedCount} đồ án được bảo chứng (Proof-of-Work). Hãy thiết lập lịch phỏng vấn mục tiêu hoặc may đo 1 bản CV khớp trực tiếp JD tuyển dụng.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsWarRoomModalOpen(true)}
                    className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>+ Lên Lịch Phỏng Vấn Mới</span>
                  </button>
                  <button
                    onClick={() => setIsCreateCvModalOpen(true)}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs sm:text-sm font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Sparkles size={15} className="fill-slate-950" />
                    <span>May Đo CV Khớp JD (1-Chạm)</span>
                  </button>
                  <a
                    href="/student/jobs"
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl border border-white/20 transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Briefcase size={15} />
                    <span>Khám Phá Việc Làm</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
         * PHÂN VÙNG 2: NHỊP ĐẬP ỨNG TUYỂN (APPLICATION PULSE)
         * ========================================================================= */}
        <section aria-label="Nhịp đập ứng tuyển" className="bg-white dark:bg-[#111728] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600 dark:text-indigo-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">
                Nhịp Đập Ứng Tuyển & Trạng Thái Hồ Sơ
              </h3>
            </div>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className="text-xs font-semibold text-blue-600 dark:text-indigo-400 hover:text-blue-800 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>{showHeatmap ? 'Thu gọn Heatmap' : 'Chi tiết Heatmap lượt xem'}</span>
              {showHeatmap ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Thông báo trạng thái tương tác trực quan */}
          <div 
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="mb-3.5 px-3.5 py-2.5 bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100/70 dark:hover:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 rounded-xl flex items-center justify-between cursor-pointer transition text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🔥</span>
              <span className="font-semibold text-blue-950 dark:text-blue-200">
                18 lượt nhà tuyển dụng đã xem hồ sơ của bạn trong tuần này. Lần xem gần nhất: 2 giờ trước.
              </span>
            </div>
            <span className="text-[11px] font-bold text-blue-600 dark:text-indigo-400 underline">
              {showHeatmap ? 'Thu gọn' : 'Xem chi tiết'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {/* Metric 1: Đã nộp đơn */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161f36] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Đã nộp đơn</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{pipelineTotal}</span>
                <span className="text-[10.5px] font-bold text-blue-600 dark:text-indigo-400">Hồ sơ</span>
              </div>
            </div>

            {/* Metric 2: Lịch phỏng vấn */}
            <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300">Đang phỏng vấn</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-purple-900 dark:text-purple-200">{studentInterviews.length}</span>
                <span className="text-[10.5px] font-bold text-purple-700 dark:text-purple-400">Lịch hẹn</span>
              </div>
            </div>

            {/* Metric 3: Lượt xem HR (Heatmap) */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">HR đã xem hồ sơ</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-emerald-900 dark:text-emerald-200">18</span>
                <span className="text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400">Lượt xem</span>
              </div>
            </div>

            {/* Metric 4: Lời mời làm việc (Offer) */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">Lời mời (Offer)</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-amber-900 dark:text-amber-200">1</span>
                <span className="text-[10.5px] font-bold text-amber-700 dark:text-amber-400">Đã nhận</span>
              </div>
            </div>
          </div>

          {/* Hàng công cụ hỗ trợ ứng tuyển */}
          <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Công cụ hỗ trợ ứng viên:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="tour-salary-benchmark"
                onClick={() => setIsSalaryModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Khảo sát dải lương thị trường theo cấp bậc và vị trí"
              >
                <DollarSign size={14} />
                <span>Khảo Sát Lương Thị Trường</span>
              </button>

              <button
                onClick={() => setIsMockInterviewModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Luyện phỏng vấn thực chiến AI 4 chặng"
              >
                <Mic size={14} />
                <span>Luyện Phỏng Vấn AI</span>
              </button>
            </div>
          </div>

          {/* Collapsible CV Heatmap Section */}
          {showHeatmap && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
              <CvHeatmapWidget />
            </div>
          )}
        </section>

        {/* =========================================================================
         * PHÂN VÙNG 3: KHO BẰNG CHỨNG NĂNG LỰC (PROOF-OF-WORK QUICK ACCESS)
         * ========================================================================= */}
        <section aria-label="Bằng chứng năng lực" className="bg-white dark:bg-[#111728] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <FolderKanban size={18} className="text-[#1e3a8a] dark:text-indigo-400" />
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Kho Bằng Chứng Năng Lực (Proof-of-Work)
                </h3>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  {verifiedCount} Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Các dự án thực tế đã qua kiểm định mã nguồn, sẵn sàng chia sẻ ngay với Nhà tuyển dụng.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsShowcaseQrOpen(true)}
                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title="Xem mã Smart QR Code để in lên CV hoặc quét nhanh"
              >
                <QrCode size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span>Mã QR Showcase</span>
              </button>
              <button
                onClick={handleCopyShowcaseLink}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                title="Sao chép liên kết Showcase công khai"
              >
                {copiedLink ? <Check size={14} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedLink ? 'Đã sao chép link!' : 'Copy Link Showcase'}</span>
              </button>
              <a
                href="/projects"
                className="px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-indigo-400 hover:text-blue-800 dark:hover:text-indigo-300 hover:bg-blue-50 dark:hover:bg-indigo-950/50 rounded-lg transition flex items-center gap-1"
              >
                <span>Xem tất cả ({totalProjects})</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Top 3 Verified Projects Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-10 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <FolderKanban size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Bạn chưa cập nhật đồ án thực tế nào vào hồ sơ cá nhân.</p>
              <a
                href="/projects"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1e3a8a] hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition"
              >
                + Thêm Đồ Án Đầu Tiên
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.slice(0, 3).map(proj => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#161f36]/70 hover:bg-white dark:hover:bg-[#19243d] hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate" title={proj.title}>
                        {proj.title}
                      </h4>
                      {proj.is_verified || proj.verification_status === 'verified' ? (
                        <VerifiedBadge size="sm" />
                      ) : (
                        <span className="text-[9.5px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.2 rounded shrink-0">
                          Chờ duyệt
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {proj.description || 'Đồ án kỹ thuật đã triển khai thực tế.'}
                    </p>

                    {proj.tags && proj.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.tags.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-[10px] font-medium bg-white dark:bg-[#111728] text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {proj.demo_url && (
                        <a
                          href={proj.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-blue-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          Demo <ExternalLink size={11} />
                        </a>
                      )}
                      {proj.github_url && (
                        <a
                          href={proj.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                        >
                          GitHub <ExternalLink size={11} />
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => setIsCreateCvModalOpen(true)}
                      className="text-[11px] font-bold text-[#1e3a8a] dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      + Tạo CV từ đồ án này
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* MODALS */}
      <SalaryBenchmarkModal
        isOpen={isSalaryModalOpen}
        onClose={() => setIsSalaryModalOpen(false)}
        initialRole={targetMajor}
        techStack={profile?.skills || ['React', 'TypeScript', 'Node.js', 'PostgreSQL']}
        verifiedProjectsCount={verifiedCount}
      />

      <AiMockInterviewModal
        isOpen={isMockInterviewModalOpen}
        onClose={() => setIsMockInterviewModalOpen(false)}
        candidateName={displayName}
        companyName={mockInterviewTarget.companyName}
        roleTitle={mockInterviewTarget.roleTitle || targetMajor}
        projectName={mockInterviewTarget.projectName || projects[0]?.title || 'E-Commerce High-Throughput Platform'}
        techStack={mockInterviewTarget.techStack || profile?.skills || ['React', 'Node.js', 'PostgreSQL', 'Docker']}
      />

      <CreateCvFlowModal
        isOpen={isCreateCvModalOpen}
        onClose={() => setIsCreateCvModalOpen(false)}
        userId={user?.id}
        userEmail={user?.email}
        profileSourceData={null}
      />

      {/* INTERVIEW WAR ROOM MODAL */}
      <InterviewWarRoomModal
        isOpen={isWarRoomModalOpen}
        onClose={() => setIsWarRoomModalOpen(false)}
        onSessionCreated={() => {
          setInterviewSessions(selfInterviewService.getAllSessions());
          setSelectedSessionIndex(0);
        }}
      />

      {/* QUICK VIEW CV MODAL */}
      <CvQuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        cv={quickViewCv}
      />

      {/* PROJECT DEFENSE MODAL */}
      <ProjectDefenseModal
        isOpen={isDefenseModalOpen}
        onClose={() => setIsDefenseModalOpen(false)}
        project={defenseProjects[0] || null}
        projects={defenseProjects}
        targetRole={interviewSessions[selectedSessionIndex]?.role_title || targetMajor}
      />

      {/* GAME SPOTLIGHT TOUR HƯỚNG DẪN TƯƠNG TÁC */}
      <SpotlightTour
        isOpen={isSpotlightTourOpen}
        onClose={() => setIsSpotlightTourOpen(false)}
        onComplete={() => setIsSpotlightTourOpen(false)}
        steps={tourSteps}
      />

      {/* SMART QR CODE SHOWCASE MODAL */}
      <ShowcaseQrModal
        isOpen={isShowcaseQrOpen}
        onClose={() => setIsShowcaseQrOpen(false)}
        userId={user?.id}
        userName={displayName}
        major={targetMajor}
      />

    </div>
  );
}
