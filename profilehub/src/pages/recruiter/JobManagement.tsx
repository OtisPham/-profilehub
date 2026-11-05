import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabase';
import type { JobPost } from '../../types/database';
import type { ExperienceLevel, WorkplaceType, SalaryCurrency, CandidateProfileInput } from '../../types/job.types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  MapPin, 
  Building2, 
  Users, 
  CheckCircle2, 
  PauseCircle, 
  PlayCircle, 
  Sparkles, 
  Kanban, 
  X, 
  AlertTriangle,
  FileText,
  Briefcase,
  Layers,
  ChevronRight,
  Filter,
  DollarSign,
  ShieldCheck,
  Calendar,
  Laptop,
  Check,
  Wand2
} from 'lucide-react';
import { getSharedJobs, saveSharedJobs, getRecruiterCompanyProfile } from '../../utils/jobSync';
import { jobStudioService } from '../../services/jobStudioService';
import { Link } from 'react-router-dom';

const POPULAR_SKILL_TAGS = [
  'ReactJS', 'TypeScript', 'Node.js', 'Python', 'Next.js', 
  'Figma', 'UI/UX', 'Tailwind CSS', 'PostgreSQL', 'Docker', 'Kubernetes', 'Golang', 'Git'
];

const DEPARTMENTS = [
  'Công nghệ thông tin & Phần mềm',
  'Thiết kế sản phẩm (UI/UX)',
  'Dữ liệu & Trí tuệ nhân tạo (AI/Data)',
  'Marketing & Truyền thông số',
  'Kinh doanh & Phát triển đối tác',
  'Quản trị nhân sự & Vận hành'
];

const WORKPLACE_OPTIONS: { value: WorkplaceType; label: string; icon: string }[] = [
  { value: 'on-site', label: '🏢 Tại văn phòng (On-site)', icon: '🏢' },
  { value: 'hybrid', label: '🌐 Linh hoạt (Hybrid)', icon: '🌐' },
  { value: 'remote', label: '🏠 Làm từ xa (Remote)', icon: '🏠' }
];

const LEVEL_OPTIONS: { value: ExperienceLevel; label: string; icon: string }[] = [
  { value: 'intern', label: '🌱 Thực tập sinh (Intern)', icon: '🌱' },
  { value: 'fresher', label: '🚀 Mới tốt nghiệp (Fresher)', icon: '🚀' },
  { value: 'junior', label: '⚡ Khởi đầu (Junior 1-2 năm)', icon: '⚡' },
  { value: 'middle', label: '💼 Trung cấp (Middle 2-4 năm)', icon: '💼' },
  { value: 'senior', label: '🏆 Cao cấp (Senior 4+ năm)', icon: '🏆' }
];

export default function JobManagement() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'closed'>('all');
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPost | null>(null);
  const [deleteConfirmJob, setDeleteConfirmJob] = useState<JobPost | null>(null);

  // Form Fields (Standardized Studio)
  const [formTitle, setFormTitle] = useState('');
  const [formDepartment, setFormDepartment] = useState('Công nghệ thông tin & Phần mềm');
  const [formLocation, setFormLocation] = useState('TP. Hồ Chí Minh');
  const [formWorkplaceType, setFormWorkplaceType] = useState<WorkplaceType>('on-site');
  const [formExperienceLevel, setFormExperienceLevel] = useState<ExperienceLevel>('fresher');
  const [formSalaryMin, setFormSalaryMin] = useState<string>('');
  const [formSalaryMax, setFormSalaryMax] = useState<string>('');
  const [formCurrency, setFormCurrency] = useState<SalaryCurrency>('VND');
  const [formIsNegotiable, setFormIsNegotiable] = useState(false);
  const [formDeadlineDate, setFormDeadlineDate] = useState('');
  const [formSkillsInput, setFormSkillsInput] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'closed'>('active');

  // Skill Extraction State
  const [isExtractingSkills, setIsExtractingSkills] = useState(false);
  const [extractionFeedback, setExtractionFeedback] = useState<string | null>(null);

  // Pool of Candidates for Matching
  const [talentPool, setTalentPool] = useState<CandidateProfileInput[]>([]);

  // Lấy hồ sơ doanh nghiệp hiện tại để kế thừa Tích Xanh & Mã số thuế
  const currentRecruiterProfile = useMemo(() => {
    return user?.id ? getRecruiterCompanyProfile(user.id) : null;
  }, [user]);

  // Load initial candidate pool from local cache or demo pool
  const loadTalentPool = () => {
    try {
      const stored = localStorage.getItem('student_profiles_bulk');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTalentPool(parsed.map((p: any) => ({
            id: p.id,
            full_name: p.full_name,
            university: p.university,
            major: p.major,
            gpa: p.gpa,
            skills: p.skills || [],
            is_open_to_work: p.is_open_to_work ?? true,
            blocked_companies: p.blocked_companies || [],
            verified_projects_count: p.verified_projects_count || 1,
            projects: p.projects || []
          })));
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Default sample talent pool for instant candidate matching
    setTalentPool([
      {
        id: 'stu_1',
        full_name: 'Nguyễn Văn An',
        university: 'Đại Học Bách Khoa TP.HCM',
        major: 'Kỹ thuật Phần mềm',
        gpa: '3.6/4.0',
        skills: ['ReactJS', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Git'],
        is_open_to_work: true,
        verified_projects_count: 3
      },
      {
        id: 'stu_2',
        full_name: 'Trần Thị Mai',
        university: 'Đại Học Quốc Gia',
        major: 'Khoa học Máy tính',
        gpa: '3.8/4.0',
        skills: ['ReactJS', 'TypeScript', 'Figma', 'UI/UX', 'Tailwind CSS'],
        is_open_to_work: true,
        verified_projects_count: 2
      },
      {
        id: 'stu_3',
        full_name: 'Lê Hoàng Minh',
        university: 'Đại Học Công Nghệ Thông Tin',
        major: 'Hệ thống Thông tin',
        gpa: '3.4/4.0',
        skills: ['Python', 'Golang', 'Docker', 'Kubernetes', 'PostgreSQL'],
        is_open_to_work: true,
        verified_projects_count: 2
      },
      {
        id: 'stu_4',
        full_name: 'Phạm Quỳnh Anh',
        university: 'Đại Học Sư Phạm Kỹ Thuật',
        major: 'Kỹ thuật Máy tính',
        gpa: '3.5/4.0',
        skills: ['ReactJS', 'Next.js', 'TypeScript', 'Docker', 'REST API'],
        is_open_to_work: true,
        verified_projects_count: 1
      }
    ]);
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data: dbJobs, error } = await supabase
        .from('recruiter_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && dbJobs && dbJobs.length > 0) {
        setJobs(dbJobs);
        saveSharedJobs(dbJobs, user?.id);
      } else {
        const shared = getSharedJobs();
        setJobs(shared);
      }
    } catch (err) {
      console.error("Fetch jobs error:", err);
      const shared = getSharedJobs();
      setJobs(shared);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    loadTalentPool();

    const handleSync = () => {
      const shared = getSharedJobs();
      setJobs(shared);
      loadTalentPool();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, [user]);

  // Open modal for Creating
  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setFormTitle('');
    setFormDepartment('Công nghệ thông tin & Phần mềm');
    setFormLocation('TP. Hồ Chí Minh');
    setFormWorkplaceType('hybrid');
    setFormExperienceLevel('intern');
    setFormSalaryMin('8000000');
    setFormSalaryMax('12000000');
    setFormCurrency('VND');
    setFormIsNegotiable(false);
    setFormDeadlineDate('');
    setFormSkillsInput('ReactJS, TypeScript, Node.js, Git');
    setFormDescription('');
    setFormStatus('active');
    setExtractionFeedback(null);
    setShowModal(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (job: JobPost) => {
    setEditingJob(job);
    setFormTitle(job.title);
    setFormDepartment(job.department || 'Công nghệ thông tin & Phần mềm');
    setFormLocation(job.location || 'TP. Hồ Chí Minh');
    setFormWorkplaceType(job.workplace_type || 'on-site');
    setFormExperienceLevel(job.experience_level || 'fresher');
    setFormSalaryMin(job.salary_min !== undefined ? job.salary_min.toString() : '');
    setFormSalaryMax(job.salary_max !== undefined ? job.salary_max.toString() : '');
    setFormCurrency(job.currency || 'VND');
    setFormIsNegotiable(job.is_negotiable ?? false);
    setFormDeadlineDate(job.deadline_date || '');
    setFormSkillsInput(job.required_skills ? job.required_skills.join(', ') : '');
    setFormDescription(job.description || '');
    setFormStatus(job.status || 'active');
    setExtractionFeedback(null);
    setShowModal(true);
  };

  // 1-Click AI / Regex Skill Extraction from JD Description
  const handleExtractSkills = () => {
    if (!formDescription || formDescription.trim() === '') {
      setExtractionFeedback('Vui lòng dán nội dung mô tả công việc (JD) vào ô bên dưới trước khi bóc tách.');
      return;
    }

    setIsExtractingSkills(true);
    setExtractionFeedback(null);

    try {
      const result = jobStudioService.extractSkillsFromText(formDescription);
      
      if (result.allSkills.length === 0) {
        setExtractionFeedback('Không phát hiện từ khóa công nghệ quen thuộc. Bạn có thể tự gõ tag kỹ năng.');
        return;
      }

      // Hợp nhất với các kỹ năng đã gõ trước đó không trùng lặp
      const existing = formSkillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const merged = Array.from(new Set([...existing, ...result.allSkills]));
      setFormSkillsInput(merged.join(', '));
      setExtractionFeedback(`✨ Đã bóc tách tự động thành công ${result.allSkills.length} kỹ năng chuẩn hóa từ JD!`);
    } catch (err) {
      console.error(err);
      setExtractionFeedback('Có lỗi khi xử lý bóc tách kỹ năng.');
    } finally {
      setIsExtractingSkills(false);
    }
  };

  // Submit Save (Create or Update)
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = formSkillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '');

    const parsedMin = formIsNegotiable || formSalaryMin === '' ? undefined : Number(formSalaryMin);
    const parsedMax = formIsNegotiable || formSalaryMax === '' ? undefined : Number(formSalaryMax);

    if (editingJob) {
      // UPDATE EXISTING JOB
      let updatedJob: JobPost = {
        ...editingJob,
        title: formTitle,
        department: formDepartment,
        location: formLocation,
        workplace_type: formWorkplaceType,
        experience_level: formExperienceLevel,
        salary_min: parsedMin,
        salary_max: parsedMax,
        currency: formCurrency,
        is_negotiable: formIsNegotiable,
        deadline_date: formDeadlineDate || undefined,
        required_skills: skillsArray,
        description: formDescription,
        status: formStatus,
        updated_at: new Date().toISOString()
      };

      // Tự động kế thừa Tích Xanh & Mã số thuế từ hồ sơ pháp nhân
      updatedJob = jobStudioService.inheritTaxVerification(updatedJob, currentRecruiterProfile || undefined) as JobPost;

      try {
        if (user?.id) {
          await supabase
            .from('recruiter_jobs')
            .update({
              title: formTitle,
              department: formDepartment,
              location: formLocation,
              workplace_type: formWorkplaceType,
              experience_level: formExperienceLevel,
              salary_min: parsedMin,
              salary_max: parsedMax,
              currency: formCurrency,
              is_negotiable: formIsNegotiable,
              deadline_date: formDeadlineDate || null,
              required_skills: skillsArray,
              description: formDescription,
              status: formStatus,
              is_tax_verified: updatedJob.is_tax_verified,
              tax_verification_tier: updatedJob.tax_verification_tier,
              tax_code: updatedJob.tax_code,
              updated_at: new Date().toISOString()
            })
            .eq('id', editingJob.id);
        }
      } catch (err) {
        console.warn("DB update error:", err);
      }

      const updatedList = jobs.map(j => (j.id === editingJob.id ? updatedJob : j));
      setJobs(updatedList);
      saveSharedJobs(updatedList, user?.id);
    } else {
      // CREATE NEW JOB
      let newJob: JobPost = {
        id: 'job_' + Date.now(),
        recruiter_id: user?.id || 'rec1',
        title: formTitle,
        department: formDepartment,
        location: formLocation,
        workplace_type: formWorkplaceType,
        experience_level: formExperienceLevel,
        salary_min: parsedMin,
        salary_max: parsedMax,
        currency: formCurrency,
        is_negotiable: formIsNegotiable,
        deadline_date: formDeadlineDate || undefined,
        required_skills: skillsArray,
        description: formDescription,
        status: formStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Tự động kế thừa Tích Xanh & Mã số thuế từ hồ sơ pháp nhân
      newJob = jobStudioService.inheritTaxVerification(newJob, currentRecruiterProfile || undefined) as JobPost;

      try {
        if (user?.id) {
          await supabase.from('recruiter_jobs').insert([{
            recruiter_id: user.id,
            title: formTitle,
            department: formDepartment,
            location: formLocation,
            workplace_type: formWorkplaceType,
            experience_level: formExperienceLevel,
            salary_min: parsedMin,
            salary_max: parsedMax,
            currency: formCurrency,
            is_negotiable: formIsNegotiable,
            deadline_date: formDeadlineDate || null,
            required_skills: skillsArray,
            description: formDescription,
            status: formStatus,
            is_tax_verified: newJob.is_tax_verified,
            tax_verification_tier: newJob.tax_verification_tier,
            tax_code: newJob.tax_code
          }]);
        }
      } catch (err) {
        console.warn("DB insert error:", err);
      }

      const updatedList = [newJob, ...jobs];
      setJobs(updatedList);
      saveSharedJobs(updatedList, user?.id);
    }

    setShowModal(false);
  };

  // Toggle Job Active/Closed Status
  const handleToggleStatus = async (job: JobPost) => {
    const nextStatus = job.status === 'active' ? 'closed' : 'active';
    const updatedJob: JobPost = { ...job, status: nextStatus };

    try {
      if (user?.id) {
        await supabase
          .from('recruiter_jobs')
          .update({ status: nextStatus })
          .eq('id', job.id);
      }
    } catch (err) {
      console.warn("DB toggle status error:", err);
    }

    const updatedList = jobs.map(j => (j.id === job.id ? updatedJob : j));
    setJobs(updatedList);
    saveSharedJobs(updatedList, user?.id);
  };

  // Delete Job
  const handleDeleteJob = async () => {
    if (!deleteConfirmJob) return;

    try {
      if (user?.id) {
        await supabase
          .from('recruiter_jobs')
          .delete()
          .eq('id', deleteConfirmJob.id);
      }
    } catch (err) {
      console.warn("DB delete error:", err);
    }

    const updatedList = jobs.filter(j => j.id !== deleteConfirmJob.id);
    setJobs(updatedList);
    saveSharedJobs(updatedList, user?.id);
    setDeleteConfirmJob(null);
  };

  // Quick append a skill tag into input
  const handleAddSkillTag = (tag: string) => {
    const current = formSkillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '');
    if (!current.includes(tag)) {
      setFormSkillsInput(current.length > 0 ? `${formSkillsInput}, ${tag}` : tag);
    }
  };

  // Filtered jobs
  const filteredJobs = jobs.filter(job => {
    const matchSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.department && job.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.required_skills && job.required_skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchDept = selectedDept === 'all' || job.department === selectedDept;
    const matchStatus = selectedStatus === 'all' || (job.status || 'active') === selectedStatus;
    const matchWorkplace = selectedWorkplace === 'all' || job.workplace_type === selectedWorkplace;
    const matchLevel = selectedLevel === 'all' || job.experience_level === selectedLevel;

    return matchSearch && matchDept && matchStatus && matchWorkplace && matchLevel;
  });

  const activeCount = jobs.filter(j => (j.status || 'active') === 'active').length;
  const closedCount = jobs.filter(j => j.status === 'closed').length;

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#f8fafc] text-slate-900 font-sans p-4 sm:p-6 md:p-8">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-md">
              🏢 Smart Job Studio
            </span>
            <span className="text-xs text-slate-400 font-medium">/ Chuẩn Hóa Tin Đăng & Bắt Cặp Ứng Viên</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-blue-950 flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-purple-600" />
            Quản Lý Bài Đăng Tuyển Dụng
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chuẩn hóa dải lương, hình thức làm việc, bóc tách kỹ năng 1-click bằng AI/Regex và bắt cặp ứng viên tiềm năng tức thì.
          </p>
        </div>

        {/* Action Button: Create Job */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-purple-600/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng Vị Trí Mới</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Tổng Số Tin Đăng</div>
          <div className="text-2xl font-black text-slate-800">{jobs.length}</div>
        </div>

        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-xs bg-gradient-to-br from-white to-emerald-50/40">
          <div className="text-[11px] font-bold uppercase text-emerald-600 mb-1">Đang Mở Tuyển</div>
          <div className="text-2xl font-black text-emerald-700">{activeCount}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Đã Đóng / Tạm Dừng</div>
          <div className="text-2xl font-black text-slate-600">{closedCount}</div>
        </div>

        <div className="bg-white border border-purple-100 rounded-2xl p-4 shadow-xs bg-gradient-to-br from-white to-purple-50/40">
          <div className="text-[11px] font-bold uppercase text-purple-600 mb-1">Ứng Viên Khả Dụng</div>
          <div className="text-2xl font-black text-purple-700">{talentPool.length}</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="max-w-7xl mx-auto bg-white border border-slate-200 rounded-2xl p-3.5 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 flex-wrap">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, kỹ năng, mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">Tất Cả Phòng Ban</option>
            {DEPARTMENTS.map((dept, idx) => (
              <option key={idx} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Workplace Filter */}
          <select
            value={selectedWorkplace}
            onChange={(e) => setSelectedWorkplace(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">Mọi Hình Thức</option>
            <option value="on-site">🏢 On-site</option>
            <option value="hybrid">🌐 Hybrid</option>
            <option value="remote">🏠 Remote</option>
          </select>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">Mọi Cấp Bậc</option>
            <option value="intern">🌱 Intern</option>
            <option value="fresher">🚀 Fresher</option>
            <option value="junior">⚡ Junior</option>
            <option value="middle">💼 Middle</option>
            <option value="senior">🏆 Senior</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">Tất Cả Trạng Thái</option>
            <option value="active">🟢 Đang Mở Tuyển</option>
            <option value="closed">⏸️ Đã Tạm Dừng</option>
          </select>
        </div>
      </div>

      {/* Main Jobs Listing */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8">
            <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Đang tải danh sách bài đăng tuyển dụng...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 space-y-3">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Không tìm thấy bài đăng tuyển dụng nào</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Thử điều chỉnh lại bộ lọc hoặc nhấn nút Đăng Vị Trí Mới để bắt đầu nhận hồ sơ sinh viên!
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 hover:bg-purple-700 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Đăng Bài Tuyển Dụng Đầu Tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job) => {
              const isActive = (job.status || 'active') === 'active';
              const salaryFormatted = jobStudioService.formatSalaryRange(job);

              // Tính số lượng ứng viên tiềm năng khớp với job
              const matchResult = jobStudioService.findMatchingCandidatesForJob(
                job,
                talentPool,
                currentRecruiterProfile?.companyName
              );

              return (
                <div
                  key={job.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
                >
                  {/* Card Top Header */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(job)}
                          title="Bấm để chuyển trạng thái Mở / Đóng tuyển dụng"
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer border ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {isActive ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Đang Mở Tuyển</span>
                            </>
                          ) : (
                            <>
                              <PauseCircle className="w-3.5 h-3.5 text-slate-500" />
                              <span>Đã Tạm Dừng</span>
                            </>
                          )}
                        </button>

                        {/* Huy hiệu Tích Xanh / Bạc pháp nhân */}
                        {job.is_tax_verified && (
                          <span 
                            title={`Doanh nghiệp đã xác thực MST: ${job.tax_code || ''}`}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                              job.tax_verification_tier === 'full'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>{job.tax_verification_tier === 'full' ? 'Tích Xanh MST' : 'Tích Bạc'}</span>
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 font-medium">
                        {job.created_at ? new Date(job.created_at).toLocaleDateString('vi-VN') : 'Gần đây'}
                      </span>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-base font-bold text-blue-950 mb-2 leading-snug line-clamp-2">
                      {job.title}
                    </h3>

                    {/* Standardized Salary & Workplace Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{salaryFormatted}</span>
                      </span>

                      {job.workplace_type && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                          {job.workplace_type === 'on-site' ? '🏢 On-site' : job.workplace_type === 'hybrid' ? '🌐 Hybrid' : '🏠 Remote'}
                        </span>
                      )}

                      {job.experience_level && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                          {job.experience_level === 'intern' ? '🌱 Intern' : 
                           job.experience_level === 'fresher' ? '🚀 Fresher' : 
                           job.experience_level === 'junior' ? '⚡ Junior' : 
                           job.experience_level === 'middle' ? '💼 Middle' : '🏆 Senior'}
                        </span>
                      )}
                    </div>

                    {/* Department & Location */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="truncate max-w-[170px]">{job.department || 'Công nghệ thông tin'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{job.location || 'Toàn quốc'}</span>
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3 whitespace-pre-wrap">
                      {job.description || 'Chưa có mô tả chi tiết.'}
                    </p>

                    {/* Required Skills Tags */}
                    {job.required_skills && job.required_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3.5">
                        {job.required_skills.slice(0, 5).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md border border-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.required_skills.length > 5 && (
                          <span className="text-[10px] bg-slate-50 text-slate-400 font-medium px-1.5 py-0.5 rounded-md">
                            +{job.required_skills.length - 5}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Instant Candidate Match Chip */}
                    <div className="mb-3">
                      <Link
                        to={`/recruiter/search?role=${encodeURIComponent(job.title)}&jobId=${job.id}&skills=${encodeURIComponent(job.required_skills ? job.required_skills.join(',') : '')}`}
                        className="w-full inline-flex items-center justify-between px-3 py-1.5 rounded-xl bg-purple-50/80 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all"
                        title="Bấm để xem danh sách các ứng viên có kỹ năng phù hợp với tin tuyển dụng này"
                      >
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-purple-600" />
                          <span>{matchResult.totalEligibleCandidates} ứng viên phù hợp (≥ 50%)</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                      </Link>
                    </div>

                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                    
                    {/* Action Row 1: Edit & Delete Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenEditModal(job)}
                        className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                        title="Chỉnh sửa thông tin vị trí tuyển dụng"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Chỉnh Sửa</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmJob(job)}
                        className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                        title="Xóa bài đăng này"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        <span>Xóa Bài</span>
                      </button>
                    </div>

                    {/* Action Row 2: Pipeline Shortcut */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <Link
                        to="/recruiter/pipeline"
                        className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 hover:underline"
                      >
                        <Kanban className="w-3 h-3" /> Xem Tiến Trình Pipeline →
                      </Link>

                      {job.deadline_date && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Hạn: {new Date(job.deadline_date).toLocaleDateString('vi-VN')}
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: SMART JOB STUDIO - TẠO MỚI / CHỈNH SỬA BÀI ĐĂNG */}
      {/* ============================================================ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/45 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 bg-gradient-to-r from-blue-950 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                  {editingJob ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <span>{editingJob ? '✏️ Chỉnh Sửa Bài Đăng Tuyển Dụng' : '💼 Đăng Vị Trí Tuyển Dụng Mới'}</span>
                    {currentRecruiterProfile?.isTaxVerified && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                        🛡️ Tích Xanh ĐKKD
                      </span>
                    )}
                  </h2>
                  <p className="text-[11px] text-blue-200">
                    Smart Job Studio chuẩn hóa dải lương, hình thức làm việc và bóc tách kỹ năng 1-click
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveJob} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-left">
              
              {/* Job Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên Vị Trí Tuyển Dụng <span className="text-red-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Thực tập sinh Frontend ReactJS / Fullstack Developer..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                />
              </div>

              {/* Department & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phòng Ban / Lĩnh Vực:
                  </label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium cursor-pointer"
                  >
                    {DEPARTMENTS.map((dept, idx) => (
                      <option key={idx} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Địa Điểm Trụ Sở / Văn Phòng:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: TP. Hồ Chí Minh / Hà Nội"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                  />
                </div>
              </div>

              {/* Workplace Type & Experience Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hình Thức Làm Việc:
                  </label>
                  <select
                    value={formWorkplaceType}
                    onChange={(e) => setFormWorkplaceType(e.target.value as WorkplaceType)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium cursor-pointer"
                  >
                    {WORKPLACE_OPTIONS.map((opt, idx) => (
                      <option key={idx} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cấp Bậc Yêu Cầu:
                  </label>
                  <select
                    value={formExperienceLevel}
                    onChange={(e) => setFormExperienceLevel(e.target.value as ExperienceLevel)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium cursor-pointer"
                  >
                    {LEVEL_OPTIONS.map((opt, idx) => (
                      <option key={idx} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Salary Section (Standardized) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dải Lương Chuẩn Hóa</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsNegotiable}
                      onChange={(e) => setFormIsNegotiable(e.target.checked)}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Lương Thỏa Thuận</span>
                  </label>
                </div>

                {!formIsNegotiable ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
                    <div>
                      <input
                        type="number"
                        placeholder="Tối thiểu (VD: 8000000)"
                        value={formSalaryMin}
                        onChange={(e) => setFormSalaryMin(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Tối đa (VD: 15000000)"
                        value={formSalaryMax}
                        onChange={(e) => setFormSalaryMax(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                      />
                    </div>
                    <div>
                      <select
                        value={formCurrency}
                        onChange={(e) => setFormCurrency(e.target.value as SalaryCurrency)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium outline-none cursor-pointer"
                      >
                        <option value="VND">VNĐ (Triệu VNĐ)</option>
                        <option value="USD">USD (Đô la Mỹ)</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">
                    Dải lương sẽ hiển thị là "Thỏa thuận" trên sàn việc làm của sinh viên.
                  </p>
                )}
              </div>

              {/* Deadline Date & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hạn Chót Ứng Tuyển (Deadline):
                  </label>
                  <input
                    type="date"
                    value={formDeadlineDate}
                    onChange={(e) => setFormDeadlineDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Trạng Thái Tuyển Dụng:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormStatus('active')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        formStatus === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-400 ring-1 ring-emerald-400'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đang Mở Tuyển</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormStatus('closed')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        formStatus === 'closed'
                          ? 'bg-amber-50 text-amber-800 border-amber-400 ring-1 ring-amber-400'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Tạm Dừng Tuyển</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô Tả Chi Tiết Công Việc (JD) <span className="text-red-500">*</span>:
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Dán hoặc nhập mô tả công việc, trách nhiệm và quyền lợi... Bấm nút [✨ AI Bóc Tách Kỹ Năng] để tự động trích xuất các công nghệ vào danh sách yêu cầu!"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium leading-relaxed"
                />
              </div>

              {/* Skills Input & 1-CLICK AI SKILL EXTRACTION */}
              <div>
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                  <label className="text-xs font-bold text-slate-700">
                    Kỹ Năng Yêu Cầu (cách nhau bởi dấu phẩy):
                  </label>

                  {/* 1-Click AI / Regex Skill Extraction Button */}
                  <button
                    type="button"
                    onClick={handleExtractSkills}
                    disabled={isExtractingSkills}
                    className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    title="Tự động quét đoạn mô tả công việc phía trên để trích xuất các tag công nghệ IT chuẩn hóa"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{isExtractingSkills ? 'Đang bóc tách...' : '✨ AI Bóc Tách Kỹ Năng'}</span>
                  </button>
                </div>

                {extractionFeedback && (
                  <div className="text-[11px] font-medium text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg mb-2">
                    {extractionFeedback}
                  </div>
                )}

                <input
                  type="text"
                  placeholder="VD: ReactJS, TypeScript, Git, Tailwind CSS, Node.js..."
                  value={formSkillsInput}
                  onChange={(e) => setFormSkillsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium mb-2"
                />

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-medium">Gợi ý nhanh:</span>
                  {POPULAR_SKILL_TAGS.map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddSkillTag(tag)}
                      className="text-[10px] bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer active:scale-95"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition-all active:scale-95 cursor-pointer"
                >
                  {editingJob ? '💾 Cập Nhật Bài Đăng' : '🚀 Đăng Vị Trí Mới'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: XÁC NHẬN XÓA BÀI ĐĂNG */}
      {/* ============================================================ */}
      {deleteConfirmJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-red-200 rounded-3xl shadow-2xl w-full max-w-md p-6 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Xác Nhận Xóa Bài Đăng Tuyển Dụng?
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Bạn có chắc chắn muốn xóa bài đăng <strong className="text-slate-900">"{deleteConfirmJob.title}"</strong> không? Bài đăng sẽ bị gỡ bỏ hoàn toàn khỏi cổng thông tin việc làm của sinh viên.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmJob(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1"
              >
                Hủy Bỏ
              </button>

              <button
                type="button"
                onClick={handleDeleteJob}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 transition-all active:scale-95 cursor-pointer flex-1"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
