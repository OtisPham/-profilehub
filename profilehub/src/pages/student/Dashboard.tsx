import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabase';
import RecruiterDashboard from '../recruiter/RecruiterDashboard';
import VerifiedBadge from '../../components/common/VerifiedBadge';
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
  FileText
} from 'lucide-react';
import type { VerificationStatus } from '../../types/database';
import { getSharedPipeline, updateInterviewStatusByStudent } from '../../utils/pipelineSync';

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

  // Calculate Dynamic Real Metrics
  const totalProjects = projects.length;
  const verifiedProjectsCount = projects.filter(p => p.is_verified || p.verification_status === 'verified').length;
  const totalSkillsCount = profile?.skills?.length || 0;
  const totalCertsCount = certificates.length;
  const totalAchsCount = achievements.length;
  const totalFeedbacksCount = feedbacks.length;
  
  const avgTechScore = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.technical_score, 0) / feedbacks.length).toFixed(1)
    : 'Chưa có';

  // Calculate Profile Completion %
  let completion = 0;
  if (profile?.full_name) completion += 20;
  if (profile?.major) completion += 20;
  if (profile?.university) completion += 20;
  if (profile?.skills && profile.skills.length > 0) completion += 15;
  if (profile?.bio) completion += 15;
  if (totalProjects > 0) completion += 10;

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Sinh Viên';

  return (
    <div style={{ padding: '0', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Top Header */}
      <header style={{ height: '70px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          <span>Bảng Điều Khiển</span> <span style={{ margin: '0 8px' }}>/</span> <span style={{ color: '#0f172a', fontWeight: '500' }}>Sinh Viên Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontWeight: '600', color: '#1e3a8a', fontSize: '13px' }}>👨‍🎓 {displayName}</span>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#1e3a8a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Welcome Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '26px', color: '#0f172a', margin: '0 0 6px 0' }}>
              Xin chào, {displayName}! 👋
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
              Xây dựng hồ sơ năng lực thực tế, nhận xác thực đồ án chính thức và kết nối AI tuyển dụng.
            </p>
          </div>
          <a
            href="/profile"
            style={{ padding: '10px 20px', backgroundColor: '#1e3a8a', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <UserCheck size={16} /> Xem Hồ Sơ Cá Nhân →
          </a>
        </div>

        {/* Banner AI CV Builder & Coach */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #4338ca 50%, #6d28d9 100%)', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={24} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                ✨ AI CV Builder & Coach (Chuẩn ATS Quốc Tế)
              </div>
              <div style={{ fontSize: '13px', color: '#e0e7ff', marginTop: '2px' }}>
                Soạn thảo CV tương tác 2 cột chuẩn ATS, gợi ý tiêu chí trực tiếp, AI cố vấn tối ưu STAR và xuất PDF A4 sắc nét.
              </div>
            </div>
          </div>
          <a
            href="/cv-builder"
            style={{ padding: '10px 18px', backgroundColor: '#ffffff', color: '#1e3a8a', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            Tạo & Tối ưu CV <ArrowRight size={14} />
          </a>
        </div>

        {/* 2-Column Career Tools: Master Profile & Multi-version CV Manager */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '25px' }}>
          {/* Candidate Master Profile Card */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #dbeafe', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.06)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserCheck size={22} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1e3a8a' }}>Hồ Sơ Năng Lực Toàn Diện</h4>
                    <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: '500' }}>Dự án • Chứng chỉ • Thành tích</span>
                  </div>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '8px' }}>
                  HỒ SƠ GỐC
                </span>
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '12.5px', color: '#4b5563', lineHeight: '1.5' }}>
                Quản lý tập trung các dự án thực tế, bằng cấp chứng chỉ và giải thưởng học thuật đã được đồng bộ vào hồ sơ cá nhân.
              </p>
            </div>
            <a
              href="/profile"
              style={{ padding: '9px 14px', backgroundColor: '#1d4ed8', color: 'white', borderRadius: '8px', fontSize: '12.5px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              Cập Nhật Hồ Sơ Năng Lực <ArrowRight size={14} />
            </a>
          </div>

          {/* Multi-version CV Manager Card */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0e7ff', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(99, 102, 241, 0.06)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#312e81' }}>Quản Lý Đa Phiên Bản CV</h4>
                    <span style={{ fontSize: '11px', color: '#4f46e5', fontWeight: '500' }}>Tùy chỉnh CV cho từng cơ hội việc làm</span>
                  </div>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', backgroundColor: '#eef2ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '8px' }}>
                  CV HUB
                </span>
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '12.5px', color: '#4b5563', lineHeight: '1.5' }}>
                Tạo và lưu trữ nhiều phiên bản CV theo từng vị trí ứng tuyển mục tiêu, xuất file PDF chuẩn chuyên nghiệp kèm mã QR minh chứng.
              </p>
            </div>
            <a
              href="/cv-manager"
              style={{ padding: '9px 14px', backgroundColor: '#4f46e5', color: 'white', borderRadius: '8px', fontSize: '12.5px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              Quản Lý Kho CV Của Bạn <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Banner Quick Link to Jobs Feed */}
        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '20px 24px', marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#1d4ed8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={22} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e3a8a' }}>
                💼 Bài Đăng Tuyển Dụng Doanh Nghiệp Đang Mở
              </div>
              <div style={{ fontSize: '13px', color: '#3b82f6', marginTop: '2px' }}>
                Xem danh sách bài đăng từ Nhà tuyển dụng đối tác, ứng tuyển trực tiếp & xem thông tin chi tiết HR & Công ty.
              </div>
            </div>
          </div>
          <a
            href="/student/jobs"
            style={{ padding: '10px 18px', backgroundColor: '#1e3a8a', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Xem Bài Đăng Tuyển Dụng →
          </a>
        </div>

        {/* Recruiter Interview Invitations Widget for Student */}
        {studentInterviews.length > 0 && (
          <div style={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '16px', padding: '24px', marginBottom: '25px', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#581c87', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={20} color="#7c3aed" /> 🔔 Thông Báo Lịch Phỏng Vấn Mới Từ Nhà Tuyển Dụng
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b21a8' }}>
                  Bạn có lịch hẹn phỏng vấn trực tiếp từ Nhà tuyển dụng đối tác. Hãy xác nhận tham gia và xem link họp trực tuyến.
                </p>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', backgroundColor: '#7c3aed', color: 'white', padding: '4px 12px', borderRadius: '12px' }}>
                {studentInterviews.length} Lịch hẹn phỏng vấn
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {studentInterviews.map(inv => (
                <div key={inv.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #ddd6fe', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#8b5cf6', textTransform: 'uppercase' }}>🏢 {inv.recruiter_name}</span>
                        <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', margin: '2px 0 0 0' }}>{inv.job_title}</h3>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                        Mới đặt lịch
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#374151', display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', color: '#6d28d9' }}>
                        <Clock size={14} /> {inv.interview_date} lúc {inv.interview_time}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563' }}>
                        <MapPin size={14} /> {inv.interview_location}
                      </div>
                      {inv.notes && (
                        <div style={{ fontSize: '11px', color: '#92400e', fontStyle: 'italic', marginTop: '2px' }}>
                          📝 {inv.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                    <a
                      href={inv.meeting_link}
                      target="_blank"
                      rel="noreferrer"
                      style={{ flex: 1, padding: '8px 12px', backgroundColor: '#7c3aed', color: 'white', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Video size={14} /> Tham gia Meet
                    </a>
                    <button
                      onClick={() => {
                        updateInterviewStatusByStudent(inv.student_id || user?.id || 's3', 'confirmed');
                        setStudentInterviews(prev => prev.map(item => item.id === inv.id ? { ...item, is_confirmed: true } : item));
                        alert(`Bạn đã xác nhận tham gia buổi phỏng vấn ${inv.job_title}! Trạng thái đã được đồng bộ trực tiếp tới Nhà tuyển dụng.`);
                      }}
                      style={{ padding: '8px 14px', backgroundColor: inv.is_confirmed ? '#ecfdf5' : '#7c3aed', color: inv.is_confirmed ? '#047857' : 'white', border: inv.is_confirmed ? '1px solid #a7f3d0' : 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <CheckCircle2 size={14} color={inv.is_confirmed ? '#047857' : '#ffffff'} /> {inv.is_confirmed ? 'Đã xác nhận' : 'Xác nhận ngay'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Profile Completion Bar (Only shown if completion < 100%) */}
        {completion < 100 && (
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#1e3a8a', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🛡️ Mức Độ Hoàn Thành Hồ Sơ: 
                <span style={{ backgroundColor: completion >= 80 ? '#059669' : '#1e3a8a', color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' }}>
                  {completion}%
                </span>
              </span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                {completion >= 80 ? '✓ Hồ sơ của bạn gần đạt chuẩn tối ưu' : 'Bổ sung thêm thông tin để nâng cao cơ hội kết nối Nhà tuyển dụng'}
              </span>
            </div>
            <div style={{ width: '100%', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${completion}%`, height: '100%', backgroundColor: completion >= 80 ? '#10b981' : '#f59e0b', transition: 'width 0.5s ease' }}></div>
            </div>
          </div>
        )}

        {/* Dynamic Real Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '35px' }}>
          
          {/* Card 1: Projects */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', borderTop: '4px solid #3b82f6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FolderKanban size={16} color="#3b82f6" /> ĐỒ ÁN THỰC TẾ
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>{totalProjects}</div>
            <div style={{ fontSize: '12px', color: '#059669', marginTop: '6px', fontWeight: '500' }}>
              🛡️ {verifiedProjectsCount} đồ án Verified
            </div>
          </div>

          {/* Card 2: Certificates */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', borderTop: '4px solid #10b981', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} color="#10b981" /> CHỨNG CHỈ & BẰNG CẤP
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>{totalCertsCount}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
              {totalAchsCount} thành tích & giải thưởng
            </div>
          </div>

          {/* Card 3: Skills */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', borderTop: '4px solid #8b5cf6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code2 size={16} color="#8b5cf6" /> KỸ NĂNG CHUYÊN MÔN
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>{totalSkillsCount}</div>
            <div style={{ fontSize: '12px', color: '#8b5cf6', marginTop: '6px', fontWeight: '500' }}>
              Tech stack cập nhật
            </div>
          </div>

          {/* Card 4: Recruiter Feedbacks */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', borderTop: '4px solid #f59e0b', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#f59e0b" /> ĐÁNH GIÁ PHỎNG VẤN
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>{totalFeedbacksCount}</div>
            <div style={{ fontSize: '12px', color: '#d97706', marginTop: '6px', fontWeight: '500' }}>
              Phản hồi từ Nhà tuyển dụng
            </div>
          </div>

        </div>

        {/* Recent Projects Section */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#0f172a' }}>
                📁 Đồ Án Mới Nhất
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                Danh sách đồ án thực tế bạn đã cập nhật lên hệ thống ProfileHub.
              </p>
            </div>
            <a href="/projects" style={{ fontSize: '13px', color: '#1e3a8a', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Quản lý tất cả đồ án ({totalProjects}) <ArrowRight size={14} />
            </a>
          </div>

          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#64748b' }}>
              <p style={{ margin: '0 0 14px 0', fontSize: '14px' }}>Bạn chưa cập nhật đồ án nào lên ProfileHub.</p>
              <a href="/projects" style={{ padding: '10px 18px', backgroundColor: '#1e3a8a', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px' }}>
                + Đăng Tải Đồ Án Đầu Tiên
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {projects.slice(0, 3).map(project => (
                <div key={project.id} style={{ padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>{project.title}</h4>
                      {project.is_verified || project.verification_status === 'verified' ? (
                        <VerifiedBadge size="sm" />
                      ) : (
                        <span style={{ fontSize: '10px', backgroundColor: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                          ⏳ Chờ duyệt
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '600px' }}>
                      {project.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Demo <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}