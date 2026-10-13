import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { getSharedJobs, getRecruiterCompanyProfile } from '../../utils/jobSync';
import { addToSharedPipeline } from '../../utils/pipelineSync';
import RecruiterCompanyModal from '../../components/student/RecruiterCompanyModal';
import { 
  Search, 
  Briefcase, 
  MapPin, 
  Building2, 
  Send, 
  Info, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Target, 
  BarChart3, 
  Cpu, 
  AlertCircle,
  Clock,
  X,
  ChevronRight
} from 'lucide-react';
import type { JobPost } from '../../types/database';
import { analyzeAiPortfolioMatch } from '../../services/portfolioMatchService';
import type { AiMatchResult, AiCandidateProfile, AiJobDescriptionInput } from '../../types/portfolioMatch';

export default function StudentJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobPost | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  // AI Matching Modal State
  const [selectedJobForAi, setSelectedJobForAi] = useState<JobPost | null>(null);
  const [aiMatchResult, setAiMatchResult] = useState<AiMatchResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Student Profile Context for AI Matching
  const studentProfile: AiCandidateProfile = {
    target_role: 'Frontend Developer / Software Engineer',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'REST API', 'Git', 'HTML/CSS'],
    projects: [
      {
        id: 'p1',
        title: 'Hệ thống Quản lý Portfolio & Đồ án Sinh viên (ProfileHub)',
        description: 'Xây dựng bằng React và TypeScript, tích hợp AI CV Matcher và tối ưu render giúp giảm 35% response time, phục vụ 500+ sinh viên.',
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'REST API'],
        is_verified: true,
        verifier_name: 'TS. Nguyễn Văn A (Khoa CNTT)',
        demo_url: 'https://demo.profilehub.dev',
        github_url: 'https://github.com/profilehub/frontend',
        metrics: ['giảm 35% response time', '500+ sinh viên', '9.2/10 điểm đồ án'],
      },
      {
        id: 'p2',
        title: 'E-Commerce Storefront SPA',
        description: 'Trang web bán hàng thời trang có giỏ hàng, tích hợp thanh toán và quản lý sản phẩm.',
        technologies: ['React', 'JavaScript', 'REST API', 'Tailwind CSS'],
        is_verified: false,
        github_url: 'https://github.com/student/ecommerce-store',
        metrics: [],
      }
    ],
    experience_level: 'fresher',
  };

  useEffect(() => {
    const loadJobs = () => {
      const allJobs = getSharedJobs();
      setJobs(allJobs);
    };

    loadJobs();
    window.addEventListener('storage', loadJobs);
    window.addEventListener('focus', loadJobs);
    return () => {
      window.removeEventListener('storage', loadJobs);
      window.removeEventListener('focus', loadJobs);
    };
  }, []);

  const handleApplyJob = (job: JobPost) => {
    const newItem = {
      id: 'p_' + Date.now(),
      recruiter_id: job.recruiter_id || 'rec1',
      student_id: user?.id || 'std_curr',
      stage: 'discovered' as const,
      student: {
        id: user?.id || 'std_curr',
        full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Sinh Viên Ứng Tuyển',
        major: 'Công Nghệ Thông Tin',
        university: 'Đại Học Bách Khoa',
        gpa: '3.6 / 4.0',
        skills: ['React', 'TypeScript', 'Node.js', 'Git']
      },
      private_notes: `Ứng tuyển trực tiếp từ bài đăng tuyển dụng: ${job.title}`
    };

    addToSharedPipeline(newItem, job.recruiter_id);
    setAppliedJobIds(prev => [...prev, job.id]);
    alert(`🎉 Ứng tuyển thành công vị trí: ${job.title}!\nHồ sơ Verified của bạn đã được chuyển tới Nhà tuyển dụng.`);
  };

  const handleOpenAiAnalysis = async (job: JobPost) => {
    setSelectedJobForAi(job);
    setAiLoading(true);
    try {
      const jobInput: AiJobDescriptionInput = {
        title: job.title,
        raw_jd_text: `${job.title} ${job.description} ${(job.required_skills || []).join(' ')}`,
        required_skills: job.required_skills || [],
        level: 'fresher',
      };
      const result = await analyzeAiPortfolioMatch(studentProfile, jobInput);
      setAiMatchResult(result);
    } catch (err) {
      console.error('Error computing AI match score:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.required_skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Header Banner with AI Badge */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '24px 28px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        marginBottom: '25px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '11px', fontWeight: 'bold', marginBottom: '8px' }}>
            <Sparkles size={14} /> AI SMART MATCH ENABLED
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            💼 Việc Làm & Đánh Giá Tương Thích AI
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
            Hệ thống tự động so khớp đồ án thực tế và huy hiệu Verified của bạn với từng vị trí công việc.
          </p>
        </div>
        <div style={{ fontSize: '13px', fontWeight: 'bold', backgroundColor: '#f0fdf4', color: '#15803d', padding: '8px 16px', borderRadius: '12px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={16} /> 2 Đồ án Verified Sẵn Sàng
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '25px' }}>
        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm theo vị trí tuyển dụng, phòng ban hoặc kỹ năng (VD: React, TypeScript, Docker)..."
          style={{
            width: '100%',
            padding: '14px 16px 14px 46px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            fontSize: '14px',
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
        />
      </div>

      {/* Job Grid / List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredJobs.length === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', border: '1px dashed #cbd5e1', color: '#64748b' }}>
            Chưa có bài đăng tuyển dụng nào phù hợp với từ khóa tìm kiếm.
          </div>
        ) : (
          filteredJobs.map(job => {
            const recruiterProfile = getRecruiterCompanyProfile(job.recruiter_id);
            const isApplied = appliedJobIds.includes(job.id);

            return (
              <div
                key={job.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  padding: '22px 24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                  transition: 'transform 0.15s ease, boxShadow 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 6px 0' }}>
                      {job.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#475569', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 'bold', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Building2 size={15} /> {recruiterProfile.companyName}
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Briefcase size={14} /> {job.department || 'Công nghệ thông tin'}
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: '500' }}>
                        <MapPin size={14} /> {job.location || 'TP. Hồ Chí Minh'}
                      </span>
                    </div>
                  </div>

                  {/* AI Match Pill on Job Card */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', backgroundColor: '#f0fdf4', color: '#166534', padding: '5px 12px', borderRadius: '12px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={12} color="#16a34a" /> AI Match Ready
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', backgroundColor: '#ecfdf5', color: '#047857', padding: '5px 10px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                      🟢 Tuyển Dụng
                    </span>
                  </div>
                </div>

                {/* Job Description */}
                <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 14px 0', lineHeight: '1.6' }}>
                  {job.description}
                </p>

                {/* Skills Chips */}
                {job.required_skills && job.required_skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', alignSelf: 'center', fontWeight: 'bold', marginRight: '4px' }}>Yêu cầu:</span>
                    {job.required_skills.map((skill, idx) => (
                      <span key={idx} style={{ fontSize: '11px', fontWeight: 'bold', backgroundColor: '#f1f5f9', color: '#334155', padding: '3px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Buttons */}
                <div style={{ display: 'flex', gap: '10px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                  
                  {/* AI Compatibility Assessment Button */}
                  <button
                    onClick={() => handleOpenAiAnalysis(job)}
                    style={{
                      padding: '9px 16px',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Sparkles size={15} /> 🔍 Phân Tích Tương Thích AI
                  </button>

                  <button
                    onClick={() => setSelectedJobForModal(job)}
                    style={{
                      padding: '9px 16px',
                      backgroundColor: '#f8fafc',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Info size={15} /> Thông Tin Công Ty
                  </button>

                  <button
                    onClick={() => handleApplyJob(job)}
                    disabled={isApplied}
                    style={{
                      padding: '9px 20px',
                      backgroundColor: isApplied ? '#ecfdf5' : '#1e3a8a',
                      color: isApplied ? '#047857' : 'white',
                      border: isApplied ? '1px solid #a7f3d0' : 'none',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 'bold',
                      cursor: isApplied ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: isApplied ? 'none' : '0 2px 4px rgba(30, 58, 138, 0.2)',
                      marginLeft: 'auto'
                    }}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 size={15} /> Đã Nộp Hồ Sơ
                      </>
                    ) : (
                      <>
                        <Send size={15} /> Ứng Tuyển Ngay
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Recruiter / Company Profile Modal */}
      {selectedJobForModal && (
        <RecruiterCompanyModal
          recruiterId={selectedJobForModal.recruiter_id}
          jobTitle={selectedJobForModal.title}
          onClose={() => setSelectedJobForModal(null)}
        />
      )}

      {/* AI Compatibility Assessment Modal for Student */}
      {selectedJobForAi && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            maxWidth: '850px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 'bold', color: '#1d4ed8', backgroundColor: '#eff6ff', padding: '3px 10px', borderRadius: '10px', marginBottom: '6px' }}>
                  <Sparkles size={13} /> AI MATCH REPORT
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                  Đánh Giá Tương Thích: {selectedJobForAi.title}
                </h2>
              </div>
              <button
                onClick={() => { setSelectedJobForAi(null); setAiMatchResult(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={22} />
              </button>
            </div>

            {aiLoading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                <div style={{ width: '36px', height: '36px', border: '3px solid #cbd5e1', borderTopColor: '#1d4ed8', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 1s linear infinite' }} />
                <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#0f172a' }}>AI Engine Đang Phân Tích Ma Trận 4 Trụ Cột...</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>Đối chiếu đồ án Verified, Metrics định lượng và kỹ năng với JD</div>
              </div>
            ) : aiMatchResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Top Score Banner */}
                <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyItems: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: aiMatchResult.overall_score < 50 ? '#e11d48' : aiMatchResult.overall_score >= 80 ? '#059669' : aiMatchResult.overall_score >= 60 ? '#1e3a8a' : '#d97706',
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'black',
                      fontSize: '20px',
                      flexShrink: 0
                    }}>
                      <span>{aiMatchResult.overall_score}%</span>
                      <span style={{ fontSize: '8px', textTransform: 'uppercase', opacity: 0.9, fontWeight: 'bold' }}>AI</span>
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '8px' }}>
                          {aiMatchResult.match_rating}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <ShieldCheck size={12} /> {aiMatchResult.trust_index.trust_tier} (x{aiMatchResult.trust_index.multiplier})
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#334155', fontWeight: '500' }}>
                        {aiMatchResult.executive_summary}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4-Pillars Visual Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Target size={14} /> 1. SKILLS FIT (30%)
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{aiMatchResult.pillars.skill_fit.score}%</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      Khớp {aiMatchResult.pillars.skill_fit.matched_core.length} kỹ năng cốt lõi
                    </div>
                  </div>

                  <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#4f46e5', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} /> 2. EVIDENCE (40%)
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{aiMatchResult.pillars.evidence_depth.score}%</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      {aiMatchResult.trust_index.verified_project_count} Đồ án Verified
                    </div>
                  </div>

                  <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#d97706', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BarChart3 size={14} /> 3. METRICS (20%)
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{aiMatchResult.pillars.impact_complexity.score}%</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      {aiMatchResult.pillars.impact_complexity.detected_metrics_count} chỉ số định lượng
                    </div>
                  </div>

                  <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#7c3aed', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Cpu size={14} /> 4. LEVEL (10%)
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{aiMatchResult.pillars.alignment_level.score}%</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      Cấp độ Fresher phù hợp
                    </div>
                  </div>
                </div>

                {/* Gap Analysis & Actionable Project Roadmap */}
                {aiMatchResult.gap_analysis && aiMatchResult.gap_analysis.length > 0 && (
                  <div style={{ backgroundColor: '#fff1f2', borderRadius: '14px', padding: '18px', border: '1px solid #fecdd3' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#be123c', fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>
                      <AlertCircle size={16} /> Lỗ Hổng Năng Lực & Đề Xuất Đồ Án Mẫu Bù Đắp:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {aiMatchResult.gap_analysis.map((gap, i) => (
                        <div key={i} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px 14px', border: '1px solid #ffe4e6' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#e11d48' }}>
                              Thiếu Kỹ Năng: {gap.skill_or_topic}
                            </span>
                            <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Clock size={12} /> ~{gap.remediation_roadmap.estimated_effort_weeks} tuần
                            </span>
                          </div>
                          <div style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#0f172a', marginBottom: '2px' }}>
                            💡 {gap.remediation_roadmap.suggested_project_title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
                            {gap.remediation_roadmap.project_objective}
                          </div>
                          <div style={{ fontSize: '11px', color: '#059669', backgroundColor: '#f0fdf4', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                            🎯 Tiêu chuẩn đầu ra: {gap.remediation_roadmap.target_metrics}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coaching Advice */}
                <div style={{ backgroundColor: '#fefce8', borderRadius: '14px', padding: '16px', border: '1px solid #fef08a' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#854d0e', marginBottom: '8px' }}>
                    💡 Lời Khuyên Tối Ưu CV Trước Khi Nộp:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12.5px', color: '#713f12', lineHeight: '1.6' }}>
                    {aiMatchResult.cv_coaching_tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>

                {/* Modal Footer Action */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px' }}>
                  <button
                    onClick={() => { setSelectedJobForAi(null); setSelectedJobForModal(selectedJobForAi); }}
                    style={{ padding: '10px 18px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Xem Chi Tiết Công Ty
                  </button>
                  <button
                    onClick={() => {
                      if (selectedJobForAi) handleApplyJob(selectedJobForAi);
                      setSelectedJobForAi(null);
                    }}
                    style={{ padding: '10px 22px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Send size={14} /> Ứng Tuyển Với Điểm AI ({aiMatchResult.overall_score}%)
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
