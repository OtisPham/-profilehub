import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { getSharedJobs, getRecruiterCompanyProfile } from '../../utils/jobSync';
import { addToSharedPipeline, getSharedPipeline } from '../../utils/pipelineSync';
import RecruiterCompanyModal from '../../components/student/RecruiterCompanyModal';
import GenerateCvFromJdModal from '../../components/cv/GenerateCvFromJdModal';
import ApplicationKanbanBoard from '../../components/student/ApplicationKanbanBoard';
import CandidatePrivacyModal from '../../components/student/CandidatePrivacyModal';
import { applicationTrackerService } from '../../services/applicationTrackerService';
import { 
  Search, 
  Briefcase, 
  MapPin, 
  Building2, 
  Send, 
  Info, 
  CheckCircle2, 
  ShieldCheck,
  Sparkles,
  FolderKanban,
  Shield
} from 'lucide-react';
import type { JobPost } from '../../types/database';
import { supabase } from '../../services/supabase';
import { cvService } from '../../services/cvService';

export default function StudentJobs() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'jobs' | 'pipeline'>('jobs');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobPost | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [generateCvJob, setGenerateCvJob] = useState<{
    isOpen: boolean;
    role: string;
    company: string;
    jdText: string;
  } | null>(null);

  const handleOpenGenerateCvModal = (job: JobPost, companyName: string) => {
    const skillsList = job.required_skills && job.required_skills.length > 0
      ? job.required_skills.map(s => `- ${s}`).join('\n')
      : '- Không có yêu cầu cụ thể';

    const jdContent = `Vị trí tuyển dụng: ${job.title}
Công ty: ${companyName}
Địa điểm: ${job.location || 'Toàn quốc'}
Phòng ban: ${job.department || 'Công nghệ thông tin'}

Mô tả công việc:
${job.description || 'Tham gia nghiên cứu, phát triển và đóng góp vào các dự án phần mềm theo yêu cầu.'}

Yêu cầu kỹ năng và năng lực:
${skillsList}`;

    setGenerateCvJob({
      isOpen: true,
      role: job.title,
      company: companyName,
      jdText: jdContent
    });
  };

  useEffect(() => {
    const loadJobs = async () => {
      // 1. Tải nhanh từ Local Cache
      const allJobs = getSharedJobs();
      setJobs(allJobs);

      // 2. Thử truy vấn thêm các Jobs thật từ Supabase Cloud
      try {
        const { data: dbJobs, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(dbJobs) && dbJobs.length > 0) {
          setJobs(dbJobs);
        }
      } catch (err) {
        // Fallback local
      }
      // 3. Tải danh sách công việc đã nộp hồ sơ
      try {
        const localPipeline = getSharedPipeline(user?.id);
        const myApplied = localPipeline
          .filter(p => !user?.id || p.student_id === user.id || p.student?.id === user.id)
          .map(p => p.job_id)
          .filter(Boolean) as string[];

        if (user?.id) {
          const { data: dbPipeline } = await supabase
            .from('candidate_pipeline')
            .select('job_id')
            .eq('student_id', user.id);
          if (dbPipeline) {
            const dbApplied = dbPipeline.map(p => p.job_id).filter(Boolean) as string[];
            setAppliedJobIds(Array.from(new Set([...myApplied, ...dbApplied])));
          } else {
            setAppliedJobIds(Array.from(new Set(myApplied)));
          }
        } else {
          setAppliedJobIds(Array.from(new Set(myApplied)));
        }
      } catch (err) {
        // Fallback
      }
    };

    loadJobs();
    window.addEventListener('storage', loadJobs);
    window.addEventListener('focus', loadJobs);
    return () => {
      window.removeEventListener('storage', loadJobs);
      window.removeEventListener('focus', loadJobs);
    };
  }, [user]);

  const handleApplyJob = async (job: JobPost) => {
    // Thu thập bản CV đang kích hoạt (Active CV) hoặc CV mặc định của sinh viên
    const activeCv = cvService.getActiveCV(user?.id);
    const newId = 'p_' + Date.now();

    // Lấy danh sách kỹ năng thực tế từ bản CV
    const candidateSkills = (
      activeCv?.data?.sections?.find(s => s.type === 'skills')?.items?.flatMap((g: any) => g.skills || []) ||
      ['React', 'TypeScript', 'Node.js', 'Git']
    );

    const newItem = {
      id: newId,
      recruiter_id: job.recruiter_id || 'rec1',
      student_id: user?.id || 'std_curr',
      job_id: job.id,
      stage: 'discovered' as const,
      cv_id: activeCv?.id,
      cv_data: activeCv?.data,
      student: {
        id: user?.id || 'std_curr',
        full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || activeCv?.data?.personalInfo?.fullName || 'Sinh Viên Ứng Tuyển',
        major: activeCv?.targetRole || 'Công Nghệ Thông Tin',
        university: activeCv?.data?.sections?.find(s => s.type === 'education')?.items?.[0]?.institution || 'Đại Học Công Nghệ',
        skills: candidateSkills,
      },
      private_notes: `Ứng tuyển từ tin tuyển dụng: ${job.title}. Bản CV: "${activeCv?.title || 'CV Chính'}"`
    };

    // 1. Gửi trực tiếp lên Supabase Cloud Database để Nhà tuyển dụng ở máy khác nhận được ngay
    try {
      if (user?.id) {
        await supabase.from('candidate_pipeline').insert([{
          id: newId,
          recruiter_id: job.recruiter_id || 'rec1',
          student_id: user.id,
          job_id: job.id,
          stage: 'discovered',
          private_notes: newItem.private_notes,
          cv_id: activeCv?.id || null,
          cv_data: activeCv?.data || null,
        }]);
      }
    } catch (e) {
      console.warn('[StudentJobs] Lỗi ghi pipeline Supabase, lưu fallback local:', e);
    }

    // 2. Đồng thời lưu local cache để tương thích với các tab đang mở
    addToSharedPipeline(newItem, job.recruiter_id);
    setAppliedJobIds(prev => [...prev, job.id]);

    // 3. Tự động đồng bộ vào Bảng Kanban Tiến Trình Ứng Tuyển của sinh viên
    try {
      const recruiterProfile = getRecruiterCompanyProfile(job.recruiter_id);
      const companyTitle = recruiterProfile?.companyName || 'Doanh Nghiệp Tuyển Dụng';
      applicationTrackerService.createApplication({
        userId: user?.id || 'default',
        companyName: companyTitle,
        roleTitle: job.title,
        salaryExpectation: (job as any).salary_range || undefined,
        jobLocation: job.location || undefined,
        applicationSource: 'profilehub',
        stage: 'applied',
        linkedCvId: activeCv?.id,
        linkedCvTitle: activeCv?.title || activeCv?.targetRole || 'Bản CV đã lưu',
        appliedDate: new Date().toISOString().split('T')[0],
        notes: `Nộp trực tiếp từ tin tuyển dụng trên ProfileHub: ${job.title}`
      }, user?.id);
    } catch (err) {
      console.warn('[StudentJobs] Lỗi ghi applicationTrackerService:', err);
    }

    alert(`🎉 Ứng tuyển thành công vị trí: ${job.title}!\nBản CV "${activeCv?.title || 'CV Mặc Định'}" của bạn đã được chuyển tới Nhà tuyển dụng và đưa vào Bảng Kanban theo dõi.`);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.required_skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (onlyVerified) {
      const rec = getRecruiterCompanyProfile(job.recruiter_id);
      return Boolean(rec?.isTaxVerified && rec?.taxVerificationTier === 'full');
    }
    return true;
  });

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '24px 28px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            💼 Việc Làm & Tiến Trình Tuyển Dụng
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
            Khám phá cơ hội việc làm doanh nghiệp và quản lý toàn bộ phễu tuyển dụng cá nhân theo chuẩn Kanban.
          </p>
        </div>
        <div style={{ fontSize: '13px', fontWeight: 'bold', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '8px 16px', borderRadius: '12px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Briefcase size={16} /> {filteredJobs.length} Vị Trí Đang Mở
        </div>
      </div>

      {/* Tab Switcher & Privacy Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'jobs'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Briefcase size={15} />
          <span>Khám Phá Việc Làm ({filteredJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'pipeline'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FolderKanban size={15} />
          <span>Tiến Trình Ứng Tuyển (Kanban)</span>
        </button>
      </div>

        <button
          onClick={() => setIsPrivacyModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition"
          title="Cài đặt chế độ Open to Work và Ẩn hồ sơ khỏi công ty chỉ định"
        >
          <Shield size={15} className="text-blue-600 dark:text-blue-400" />
          <span>Quyền Riêng Tư & Ẩn CV</span>
        </button>
      </div>

      {activeTab === 'pipeline' ? (
        <ApplicationKanbanBoard />
      ) : (
        <>
          {/* Search Bar & Quick Filter */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
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

        <button
          type="button"
          onClick={() => setOnlyVerified(prev => !prev)}
          style={{
            padding: '12px 18px',
            borderRadius: '12px',
            border: onlyVerified ? '1px solid #16a34a' : '1px solid #cbd5e1',
            backgroundColor: onlyVerified ? '#dcfce7' : '#ffffff',
            color: onlyVerified ? '#15803d' : '#475569',
            fontSize: '13px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease'
          }}
        >
          <ShieldCheck size={16} color={onlyVerified ? '#16a34a' : '#64748b'} />
          <span>{onlyVerified ? '✓ Đang Lọc: Chỉ Công Ty Tích Xanh' : '🛡️ Chỉ Xem Công Ty Tích Xanh'}</span>
        </button>
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
                      <span style={{ fontWeight: 'bold', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building2 size={15} /> {recruiterProfile.companyName}
                        {recruiterProfile.isTaxVerified ? (
                          recruiterProfile.taxVerificationTier === 'full' ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '1px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}>
                              <ShieldCheck size={12} /> Tích Xanh
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '1px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}>
                              <Shield size={12} /> Tích Bạc
                            </span>
                          )
                        ) : null}
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

                  {/* Status Pill on Job Card */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', backgroundColor: '#ecfdf5', color: '#047857', padding: '5px 10px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                      🟢 Đang Tuyển Dụng
                    </span>
                  </div>
                </div>

                {/* Safety Caution Banner for Silver Tier */}
                {recruiterProfile.isTaxVerified && recruiterProfile.taxVerificationTier === 'silver' && (
                  <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef08a', color: '#854d0e', padding: '7px 12px', borderRadius: '6px', fontSize: '11.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>⚠️</span>
                    <span>Tài khoản tự khai báo bằng email cá nhân. <strong>Tuyệt đối không đóng bất kỳ khoản phí nào</strong> khi ứng tuyển!</span>
                  </div>
                )}

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
                    onClick={() => handleOpenGenerateCvModal(job, recruiterProfile.companyName)}
                    style={{
                      padding: '9px 16px',
                      background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)'
                    }}
                  >
                    <Sparkles size={15} style={{ color: '#fde047' }} />
                    AI Tạo CV Khớp JD Này
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
      </>
      )}

      {/* Recruiter / Company Profile Modal */}
      {selectedJobForModal && (
        <RecruiterCompanyModal
          recruiterId={selectedJobForModal.recruiter_id}
          jobTitle={selectedJobForModal.title}
          onClose={() => setSelectedJobForModal(null)}
        />
      )}

      {/* Candidate Privacy & Blacklist Modal */}
      <CandidatePrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        userId={user?.id || 'default_student'}
      />

      {/* AI Generate CV From JD Modal */}
      {generateCvJob?.isOpen && (
        <GenerateCvFromJdModal
          isOpen={generateCvJob.isOpen}
          onClose={() => setGenerateCvJob(null)}
          initialJdText={generateCvJob.jdText}
          initialTargetRole={generateCvJob.role}
          initialCompanyName={generateCvJob.company}
        />
      )}

    </div>
  );
}
