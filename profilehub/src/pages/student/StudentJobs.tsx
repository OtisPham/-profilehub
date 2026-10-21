import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { getSharedJobs, getRecruiterCompanyProfile } from '../../utils/jobSync';
import { addToSharedPipeline } from '../../utils/pipelineSync';
import RecruiterCompanyModal from '../../components/student/RecruiterCompanyModal';
import GenerateCvFromJdModal from '../../components/cv/GenerateCvFromJdModal';
import { 
  Search, 
  Briefcase, 
  MapPin, 
  Building2, 
  Send, 
  Info, 
  CheckCircle2, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import type { JobPost } from '../../types/database';
import { supabase } from '../../services/supabase';
import { cvService } from '../../services/cvService';
import { applicationService } from '../../services/applicationService';

export default function StudentJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    };

    loadJobs();
    window.addEventListener('storage', loadJobs);
    window.addEventListener('focus', loadJobs);
    return () => {
      window.removeEventListener('storage', loadJobs);
      window.removeEventListener('focus', loadJobs);
    };
  }, []);

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

    // 3. Tự động ghi nhận vào Application Hub cá nhân của sinh viên (bảo toàn CV & JD Snapshot)
    try {
      const company = getRecruiterCompanyProfile(job.recruiter_id);
      applicationService.createApplication({
        studentId: user?.id || 'std_curr',
        companyName: company?.companyName || 'Công ty Công Nghệ Tuyển Dụng',
        position: job.title,
        jobDescription: job.description,
        jobUrl: '',
        source: 'ProfileHub Jobs',
        status: 'applied',
        appliedDate: new Date().toISOString().split('T')[0],
        priority: 'high',
        cvId: activeCv?.id,
        cvTitle: activeCv?.title,
        cvSnapshot: activeCv?.data,
        notes: `Ứng tuyển trực tiếp từ tin tuyển dụng ProfileHub: ${job.title}`
      }, 'Ứng tuyển trực tiếp qua cổng tuyển dụng ProfileHub', 'auto_apply');
    } catch (appErr) {
      console.warn('[StudentJobs] Lỗi ghi nhận Application cá nhân:', appErr);
    }

    setAppliedJobIds(prev => [...prev, job.id]);
    alert(`🎉 Ứng tuyển thành công vị trí: ${job.title}!\nBản CV "${activeCv?.title || 'CV Mặc Định'}" của bạn đã được chuyển tới Nhà tuyển dụng và tự động đồng bộ vào Hub Tiến trình Ứng tuyển.`);
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.required_skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Header Banner */}
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
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            💼 Khám Phá Cơ Hội Việc Làm & Ứng Tuyển
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
            Xem danh sách bài đăng tuyển dụng từ doanh nghiệp đối tác và nộp hồ sơ ứng tuyển trực tiếp.
          </p>
        </div>
        <div style={{ fontSize: '13px', fontWeight: 'bold', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '8px 16px', borderRadius: '12px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Briefcase size={16} /> {filteredJobs.length} Vị Trí Đang Mở
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

                  {/* Status Pill on Job Card */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', backgroundColor: '#ecfdf5', color: '#047857', padding: '5px 10px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                      🟢 Đang Tuyển Dụng
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

      {/* Recruiter / Company Profile Modal */}
      {selectedJobForModal && (
        <RecruiterCompanyModal
          recruiterId={selectedJobForModal.recruiter_id}
          jobTitle={selectedJobForModal.title}
          onClose={() => setSelectedJobForModal(null)}
        />
      )}

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
