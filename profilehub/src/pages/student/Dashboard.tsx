import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabase';
import RecruiterDashboard from '../recruiter/RecruiterDashboard';
import { 
  getTrackingAnalytics, 
  TRACKING_EVENT_NAME, 
  type CvTrackingAnalyticsData 
} from '../../services/cvTrackingAnalyticsService';
import CreateCvFlowModal from '../../components/cv/CreateCvFlowModal';
import InterviewWarRoomModal from '../../components/student/InterviewWarRoomModal';
import CvQuickViewModal from '../../components/cv/CvQuickViewModal';
import ProjectDefenseModal from '../../components/cv/ProjectDefenseModal';
import VerifiedBadge from '../../components/common/VerifiedBadge';
import { getProjectBadgeVariant } from '../../services/projectBadgeService';
import SpotlightTour, { type SpotlightStep } from '../../components/common/SpotlightTour';
import ShowcaseQrModal from '../../components/student/ShowcaseQrModal';
import ImportCvToProfileModal from '../../components/student/ImportCvToProfileModal';
import { selfInterviewService, type CandidateInterviewSession } from '../../services/selfInterviewService';
import { cvService, type ManagedCVItem } from '../../services/cvService';
import { CalendarSyncDropdown } from '../../components/student/CalendarSyncDropdown';
import { ChallengeCountdownWidget } from '../../components/student/ChallengeCountdownWidget';
import { PreInterviewCheatSheetModal } from '../../components/student/PreInterviewCheatSheetModal';
import { CandidateSlotBookingModal } from '../../components/student/CandidateSlotBookingModal';
import {
  FolderKanban,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Clock,
  MapPin,
  Video,
  FileText,
  Copy,
  TrendingUp,
  Eye,
  Check,
  Building2,
  ShieldAlert,
  Trash2,
  Plus,
  Compass,
  QrCode,
  CalendarCheck2,
  Zap,
  Flame,
} from 'lucide-react';
import type { VerificationStatus } from '../../types/database';
import { getSharedPipeline, subscribeToPipelineEvents } from '../../utils/pipelineSync';

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
  meeting_link?: string;
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
  const [trackingData, setTrackingData] = useState<CvTrackingAnalyticsData>(() => getTrackingAnalytics());

  // Lắng nghe cập nhật lượt xem và tracking thời gian thực
  useEffect(() => {
    const handleTrackingUpdate = (e: any) => {
      if (e.detail) {
        setTrackingData(e.detail);
      } else {
        setTrackingData(getTrackingAnalytics());
      }
    };
    window.addEventListener(TRACKING_EVENT_NAME, handleTrackingUpdate);
    return () => {
      window.removeEventListener(TRACKING_EVENT_NAME, handleTrackingUpdate);
    };
  }, []);

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

  // Modals state
  const [isCreateCvModalOpen, setIsCreateCvModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSpotlightTourOpen, setIsSpotlightTourOpen] = useState(false);
  const [isShowcaseQrOpen, setIsShowcaseQrOpen] = useState(false);
  const [isImportCvModalOpen, setIsImportCvModalOpen] = useState(false);

  // Velocity Suite Modals (Cheat-Sheet & Slot Booking)
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [slotBookingItem, setSlotBookingItem] = useState<any>(null);

  // Kịch bản 3 bước rọi đèn Spotlight phong cách Game Quest (Giữ nguyên targetId chuẩn)
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
      targetId: 'tour-import-cv',
      title: 'Vũ Khí 2: Quét CV Điền Hồ Sơ Tự Động',
      description: 'Tải lên CV PDF có sẵn để tự động trích xuất thông tin, kỹ năng và đồ án vào hồ sơ chính chỉ trong vài giây!',
      badge: 'Nhiệm Vụ 2/3 • Trích Xuất Hồ Sơ',
      actionText: 'Mở Trình Quét CV',
      onAction: () => setIsImportCvModalOpen(true)
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
        let myPipeline = localPipeline.filter(
          (p: any) => !user?.id || p.student_id === user.id || p.student?.id === user.id
        );

        if (user?.id) {
          try {
            const { data: dbPipeline } = await supabase
              .from('candidate_pipeline')
              .select('*')
              .eq('student_id', user.id);
            if (dbPipeline && dbPipeline.length > 0) {
              const map = new Map();
              myPipeline.forEach((p: any) => map.set(p.id, p));
              dbPipeline.forEach((p: any) => map.set(p.id, p));
              myPipeline = Array.from(map.values());
            }
          } catch {
            // ignore
          }
        }

        setPipelineTotal(myPipeline.length);

        // Lọc danh sách phỏng vấn thực tế từ pipeline nhà tuyển dụng
        const interviews: StudentInterviewItem[] = myPipeline
          .filter((p: any) => (p.stage === 'interview' || Boolean(p.interview_date)))
          .map((p: any) => ({
            id: p.id,
            student_id: p.student_id || user?.id || 's3',
            recruiter_name: p.recruiter_name || 'Doanh Nghiệp Tuyển Dụng',
            job_title: p.job_title || p.student?.major || 'Vị trí ứng tuyển',
            interview_date: p.interview_date || 'Chưa xếp ngày',
            interview_time: p.interview_time || '10:00 AM',
            meeting_link: p.meeting_link || undefined,
            interview_location: p.interview_location || (p.meeting_link ? 'Online (Google Meet)' : 'Trực tiếp tại văn phòng'),
            notes: p.private_notes,
            is_confirmed: p.interview_status === 'confirmed'
          }));

        setStudentInterviews(interviews);

        // Đồng bộ lịch phỏng vấn vào War Room Sessions
        myPipeline
          .filter((p: any) => p.interview_date)
          .forEach((p: any) => {
            selfInterviewService.syncFromPipelineItem(p);
          });
        setInterviewSessions(selfInterviewService.getAllSessions());
      }
    };
    loadData();
    window.addEventListener('storage', loadData);
    const unsubscribeBroadcast = subscribeToPipelineEvents(() => {
      loadData();
    });

    return () => {
      window.removeEventListener('storage', loadData);
      unsubscribeBroadcast();
    };
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

  // Xác định rõ: Có ai mời phỏng vấn thực tế từ phía nhà tuyển dụng không
  const hasRecruiterInterview = studentInterviews.length > 0 || interviewSessions.some(s => s.source === 'recruiter_invited');


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
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#090d16] pb-20 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* =========================================================================
       * 1. KHU VỰC HEADER BÀN LÀM VIỆC (CLEAN WORKSPACE HERO BANNER)
       * ========================================================================= */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0c101c] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-600 text-white flex items-center justify-center font-black text-base shadow-sm shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  {displayName}
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {targetMajor}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {verifiedCount} Đồ án đã xác thực
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Bàn Làm Việc Ứng Viên • Nền tảng Hồ Sơ Năng Lực Dựa Trên Bằng Chứng Thực
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Spotlight Tour button */}
            <button
              onClick={() => setIsSpotlightTourOpen(true)}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Khám phá nhanh các tính năng cốt lõi"
            >
              <Compass size={14} className="text-indigo-500" />
              <span className="hidden sm:inline">Hướng Dẫn</span>
            </button>

            {/* Showcase QR Code Modal */}
            <button
              id="tour-showcase-qr"
              onClick={() => setIsShowcaseQrOpen(true)}
              className="px-2.5 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Xem mã QR Showcase để in lên CV hoặc quét nhanh"
            >
              <QrCode size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span>Mã QR Showcase</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyShowcaseLink}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sao chép link Showcase công khai"
            >
              {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copiedLink ? 'Đã sao chép' : 'Copy Link'}</span>
            </button>

            {/* Quét CV Tự Động Điền Hồ Sơ */}
            <button
              id="tour-import-cv"
              onClick={() => setIsImportCvModalOpen(true)}
              className="px-3 py-2 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Quét CV tự động điền hồ sơ cá nhân và đồ án"
            >
              <Sparkles size={14} className="text-purple-600 dark:text-purple-400" />
              <span>Quét CV Điền Hồ Sơ</span>
            </button>

            {/* Single Primary Action: May Đo CV Theo JD */}
            <button
              id="tour-create-cv"
              onClick={() => setIsCreateCvModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              title="May đo CV chuẩn ATS khớp JD"
            >
              <Sparkles size={14} className="text-amber-300" />
              <span>+ May Đo CV Khớp JD</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">

        {/* =========================================================================
         * PHÂN VÙNG 1: TIÊU ĐIỂM PHỎNG VẤN & TRẠNG THÁI ỨNG TUYỂN
         * (Nếu KHÔNG CÓ AI MỜI PHỎNG VẤN: Ẩn hoàn toàn Google Meet và hiển thị trạng thái tinh gọn)
         * ========================================================================= */}
        <section aria-label="Tiêu điểm ứng tuyển">
          {hasRecruiterInterview ? (
            /* TRƯỜNG HỢP A: CÓ DOANH NGHIỆP MỜI PHỎNG VẤN THỰC TẾ */
            <div className="bg-white dark:bg-[#111726] rounded-2xl p-5 sm:p-6 shadow-xs border border-indigo-200 dark:border-indigo-900/60 relative overflow-hidden transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Lịch Phỏng Vấn Sắp Tới
                  </span>
                </div>
                
                <button
                  onClick={() => setIsWarRoomModalOpen(true)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Quản lý lịch phỏng vấn</span>
                </button>
              </div>

              {(() => {
                const currentSession = interviewSessions[selectedSessionIndex] || interviewSessions[0];
                if (!currentSession) return null;

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-2 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Building2 size={14} className="text-indigo-600 dark:text-indigo-400" />
                          {currentSession.company_name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          Doanh Nghiệp Mời
                        </span>
                      </div>

                      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {currentSession.role_title}
                      </h2>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                          <Clock size={14} className="text-indigo-500" />
                          {currentSession.interview_date} lúc {currentSession.interview_time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          {currentSession.format === 'online' ? <Video size={14} className="text-emerald-500" /> : <MapPin size={14} className="text-amber-500" />}
                          {currentSession.format === 'online' ? 'Trực tuyến' : (currentSession.location_address || 'Trực tiếp tại văn phòng')}
                        </span>
                      </div>

                      {/* Ghi chú */}
                      {currentSession.personal_notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                          Ghi chú: {currentSession.personal_notes}
                        </p>
                      )}
                    </div>

                    {/* Action Hub cho buổi phỏng vấn */}
                    <div className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      {/* CHỈ HIỂN THỊ GOOGLE MEET KHI CÓ LINK HỌP TRỰC TUYẾN THẬT */}
                      {currentSession.meeting_link && (
                        <a
                          href={currentSession.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition active:scale-[0.98]"
                        >
                          <Video size={14} />
                          <span>Vào Phòng Họp Online (Google Meet)</span>
                        </a>
                      )}


                      <button
                        onClick={() => handleOpenProjectDefense(currentSession)}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition active:scale-[0.98] cursor-pointer"
                      >
                        <ShieldAlert size={14} className="text-amber-500" />
                        <span>Ôn Bộ Câu Hỏi Bẫy Đồ Án</span>
                      </button>

                      <button
                        onClick={() => handleOpenLinkedCv(currentSession)}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition active:scale-[0.98] cursor-pointer"
                      >
                        <FileText size={14} />
                        <span>Xem Lại CV Đã Nộp</span>
                      </button>

                      {/* Thẻ tác chiến 60s Trước giờ G */}
                      <button
                        onClick={() => setIsCheatSheetOpen(true)}
                        className="py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition active:scale-[0.98] cursor-pointer"
                      >
                        <Zap size={14} className="fill-white" />
                        <span>⚡ Thẻ Tác Chiến 60s (Trước Giờ G)</span>
                      </button>

                      {/* Nút Đồng Bộ Lịch */}
                      <div className="w-full flex justify-center">
                        <CalendarSyncDropdown
                          payload={{
                            title: `[Phỏng Vấn ProfileHub] ${currentSession.role_title} - ${currentSession.company_name}`,
                            description: `Phỏng vấn giữa ${currentSession.company_name} và ${user?.user_metadata?.full_name || 'Ứng viên'}.\nLink họp: ${currentSession.meeting_link || 'Trực tiếp'}\nĐịa điểm: ${currentSession.location_address || 'Google Meet'}`,
                            location: currentSession.meeting_link || currentSession.location_address || 'Google Meet',
                            startTime: currentSession.interview_date ? `${currentSession.interview_date}T${currentSession.interview_time || '09:00'}:00.000Z` : new Date().toISOString(),
                            endTime: currentSession.interview_date ? `${currentSession.interview_date}T10:00:00.000Z` : new Date(Date.now() + 3600000).toISOString(),
                          }}
                          filename={`lich-phong-van-${currentSession.company_name}.ics`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* TRƯỜNG HỢP B: KHÔNG CÓ AI MỜI PHỎNG VẤN (ẨN HOÀN TOÀN GG MEET) */
            <div className="bg-white dark:bg-[#111726] rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <CalendarCheck2 size={14} className="text-indigo-500" />
                    <span>Trạng Thái Tuyển Dụng Hiện Tại</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Hiện chưa có lịch phỏng vấn nào từ doanh nghiệp
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Hồ sơ của bạn đã có {verifiedCount} đồ án được bảo chứng năng lực (Proof-of-Work). Hãy tiếp tục may đo CV khớp theo từng Job Description (JD) để thu hút thêm lời mời phỏng vấn.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                  <button
                    onClick={() => setIsCreateCvModalOpen(true)}
                    className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
                  >
                    <Sparkles size={14} className="text-amber-300" />
                    <span>May Đo CV Khớp JD Mới</span>
                  </button>

                  <button
                    onClick={() => setIsWarRoomModalOpen(true)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>+ Tự Lên Lịch Ôn Phỏng Vấn</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
         * PHÂN VÙNG 2: NHỊP ĐẬP ỨNG TUYỂN (3 METRIC CARDS TINH GỌN, ĐÃ TẮT OFFER)
         * ========================================================================= */}
        <section aria-label="Nhịp đập ứng tuyển" className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Nhịp Đập Ứng Tuyển & Tương Tác Hồ Sơ
              </h3>
            </div>
          </div>

          {/* 3 Thẻ Metric Chuẩn: Đã nộp đơn - Lịch phỏng vấn - NTD đã xem */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Metric 1: Đã nộp đơn */}
            <Link 
              to="/student/jobs"
              className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#161f36]/70 hover:bg-slate-100 dark:hover:bg-[#19243d] border border-slate-200/70 dark:border-slate-800/80 flex flex-col justify-between transition-all cursor-pointer group"
              title="Xem danh sách việc làm và hồ sơ đã ứng tuyển"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Đã nộp đơn</span>
                <ArrowRight size={13} className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{pipelineTotal}</span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Hồ sơ</span>
              </div>
            </Link>

            {/* Metric 2: Lịch phỏng vấn */}
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#161f36]/70 border border-slate-200/70 dark:border-slate-800/80 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Lịch phỏng vấn</span>
                <Clock size={13} className="text-slate-400" />
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{studentInterviews.length}</span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Lịch hẹn</span>
              </div>
            </div>

            {/* Metric 3: Lượt xem NTD */}
            <div 
              className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#161f36]/70 border border-slate-200/70 dark:border-slate-800/80 flex flex-col justify-between"
              title="Tổng lượt xem hồ sơ của bạn từ các Nhà tuyển dụng"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">NTD đã xem hồ sơ</span>
                <Eye size={13} className="text-slate-400" />
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{trackingData.totalViews}</span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Lượt xem</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
         * PHÂN VÙNG 3: KHO BẰNG CHỨNG NĂNG LỰC (PROOF-OF-WORK QUICK ACCESS)
         * ========================================================================= */}
        <section aria-label="Bằng chứng năng lực" className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-xs transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <FolderKanban size={17} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Kho Bằng Chứng Năng Lực (Proof-of-Work)
                </h3>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                  {verifiedCount} Đã xác thực
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Các dự án thực tế kèm mã nguồn và liên kết chạy thử, sẵn sàng chứng minh năng lực.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/projects"
                className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Xem tất cả ({totalProjects})</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>

          {/* Top 3 Verified Projects Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-10 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <FolderKanban size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Bạn chưa cập nhật đồ án thực tế nào vào hồ sơ cá nhân.</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsImportCvModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  <Sparkles size={14} className="text-amber-300" />
                  <span>Quét CV Tự Tạo Đồ Án</span>
                </button>
                <a
                  href="/projects"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition"
                >
                  + Thêm Thủ Công
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.slice(0, 3).map(proj => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161f36]/70 hover:bg-white dark:hover:bg-[#19243d] hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate" title={proj.title}>
                        {proj.title}
                      </h4>
                      {(() => {
                        const variant = getProjectBadgeVariant(proj);
                        if (variant !== 'none') {
                          return <VerifiedBadge variant={variant} demoUrl={proj.demo_url} size="sm" interactive={true} />;
                        }
                        return (
                          <span className="text-[9.5px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800 shrink-0">
                            Chờ duyệt
                          </span>
                        );
                      })()}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {proj.description || 'Đồ án kỹ thuật đã triển khai thực tế.'}
                    </p>

                    {proj.tags && proj.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.tags.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-[10px] font-medium bg-white dark:bg-[#111726] text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200/70 dark:border-slate-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {proj.demo_url && (
                        <a
                          href={proj.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
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
                      className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      + Tạo CV từ đồ án
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* =========================================================================
       * DIALOGS & MODALS
       * ========================================================================= */}

      <CreateCvFlowModal
        isOpen={isCreateCvModalOpen}
        onClose={() => setIsCreateCvModalOpen(false)}
        userId={user?.id}
        userEmail={user?.email}
        profileSourceData={null}
      />

      <InterviewWarRoomModal
        isOpen={isWarRoomModalOpen}
        onClose={() => setIsWarRoomModalOpen(false)}
        onSessionCreated={() => {
          setInterviewSessions(selfInterviewService.getAllSessions());
          setSelectedSessionIndex(0);
        }}
      />

      <CvQuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        cv={quickViewCv}
      />

      <ProjectDefenseModal
        isOpen={isDefenseModalOpen}
        onClose={() => setIsDefenseModalOpen(false)}
        project={defenseProjects[0] || null}
        projects={defenseProjects}
        targetRole={interviewSessions[selectedSessionIndex]?.role_title || targetMajor}
      />

      <SpotlightTour
        isOpen={isSpotlightTourOpen}
        onClose={() => setIsSpotlightTourOpen(false)}
        onComplete={() => setIsSpotlightTourOpen(false)}
        steps={tourSteps}
      />

      <ShowcaseQrModal
        isOpen={isShowcaseQrOpen}
        onClose={() => setIsShowcaseQrOpen(false)}
        userId={user?.id}
        userName={displayName}
        major={targetMajor}
      />

      <ImportCvToProfileModal
        isOpen={isImportCvModalOpen}
        onClose={() => setIsImportCvModalOpen(false)}
        onProfileUpdated={() => {
          fetchDashboardData();
        }}
      />

      {/* Pre-Interview Cheat Sheet Modal */}
      {isCheatSheetOpen && (
        <PreInterviewCheatSheetModal
          isOpen={isCheatSheetOpen}
          onClose={() => setIsCheatSheetOpen(false)}
          candidate={{
            id: 'my_pipeline_item',
            student_id: user?.id || 'me',
            recruiter_id: 'recruiter_partner',
            stage: 'interview',
            job: {
              id: 'job_active',
              recruiter_id: 'rec_unknown',
              title: interviewSessions[selectedSessionIndex]?.role_title || 'Kỹ sư phần mềm',
              company_name: interviewSessions[selectedSessionIndex]?.company_name || 'Doanh nghiệp Công nghệ',
              location: 'Hồ Chí Minh',
              required_skills: ['React', 'Node.js'],
              created_at: new Date().toISOString(),
            },
            student: {
              id: user?.id || 'me',
              full_name: displayName,
              major: targetMajor,
              skills: profile?.skills || ['React', 'TypeScript'],
            },
          }}
        />
      )}

      {/* Candidate Slot Booking Modal */}
      {slotBookingItem && (
        <CandidateSlotBookingModal
          isOpen={Boolean(slotBookingItem)}
          onClose={() => setSlotBookingItem(null)}
          candidateName={displayName}
          companyName={slotBookingItem.companyName || 'Công ty Công nghệ'}
          jobTitle={slotBookingItem.jobTitle || 'Kỹ sư phần mềm'}
          slots={slotBookingItem.slots || []}
          onConfirmSlot={(bookedSlot) => {
            setSlotBookingItem(null);
            fetchDashboardData();
          }}
        />
      )}

    </div>
  );
}
