import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabase';
import type { JobPost } from '../../types/database';
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
  Filter
} from 'lucide-react';
import { getSharedJobs, saveSharedJobs } from '../../utils/jobSync';
import { Link } from 'react-router-dom';

const POPULAR_SKILL_TAGS = [
  'ReactJS', 'TypeScript', 'Node.js', 'Python', 'Next.js', 
  'Figma', 'UI/UX', 'Tailwind CSS', 'SQL', 'Git', 'Docker', 'AI / ML'
];

const DEPARTMENTS = [
  'Công nghệ thông tin & Phần mềm',
  'Thiết kế sản phẩm (UI/UX)',
  'Dữ liệu & Trí tuệ nhân tạo (AI/Data)',
  'Marketing & Truyền thông số',
  'Kinh doanh & Phát triển đối tác',
  'Quản trị nhân sự & Vận hành'
];

export default function JobManagement() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'closed'>('all');

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPost | null>(null);
  const [deleteConfirmJob, setDeleteConfirmJob] = useState<JobPost | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDepartment, setFormDepartment] = useState('Công nghệ thông tin & Phần mềm');
  const [formLocation, setFormLocation] = useState('TP. Hồ Chí Minh');
  const [formSkillsInput, setFormSkillsInput] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'closed'>('active');

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

    const handleSync = () => {
      const shared = getSharedJobs();
      setJobs(shared);
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
    setFormSkillsInput('ReactJS, TypeScript, Node.js, Git');
    setFormDescription('');
    setFormStatus('active');
    setShowModal(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (job: JobPost) => {
    setEditingJob(job);
    setFormTitle(job.title);
    setFormDepartment(job.department || 'Công nghệ thông tin & Phần mềm');
    setFormLocation(job.location || 'TP. Hồ Chí Minh');
    setFormSkillsInput(job.required_skills ? job.required_skills.join(', ') : '');
    setFormDescription(job.description || '');
    setFormStatus(job.status || 'active');
    setShowModal(true);
  };

  // Submit Save (Create or Update)
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = formSkillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '');

    if (editingJob) {
      // UPDATE EXISTING JOB
      const updatedJob: JobPost = {
        ...editingJob,
        title: formTitle,
        department: formDepartment,
        location: formLocation,
        required_skills: skillsArray,
        description: formDescription,
        status: formStatus
      };

      try {
        if (user?.id) {
          await supabase
            .from('recruiter_jobs')
            .update({
              title: formTitle,
              department: formDepartment,
              location: formLocation,
              required_skills: skillsArray,
              description: formDescription,
              status: formStatus
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
      const newJob: JobPost = {
        id: 'job_' + Date.now(),
        recruiter_id: user?.id || 'rec1',
        title: formTitle,
        department: formDepartment,
        location: formLocation,
        required_skills: skillsArray,
        description: formDescription,
        status: formStatus,
        created_at: new Date().toISOString()
      };

      try {
        if (user?.id) {
          await supabase.from('recruiter_jobs').insert([{
            recruiter_id: user.id,
            title: formTitle,
            department: formDepartment,
            location: formLocation,
            required_skills: skillsArray,
            description: formDescription,
            status: formStatus
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

    return matchSearch && matchDept && matchStatus;
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
              🏢 Quản Trị Tuyển Dụng
            </span>
            <span className="text-xs text-slate-400 font-medium">/ Quản Lý Bài Đăng</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-blue-950 flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-purple-600" />
            Quản Lý Bài Đăng Tuyển Dụng
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Đăng mới, chỉnh sửa thông tin mô tả / yêu cầu đồ án, bật/tắt nhận hồ sơ và xóa bài đăng dễ dàng.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all active:scale-95 cursor-pointer self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>+ Đăng Vị Trí Tuyển Dụng Mới</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tổng Số Bài Đăng</div>
          <div className="text-2xl font-black text-blue-950">{jobs.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Vị trí đã tạo</div>
        </div>

        <div className="bg-white border border-emerald-200/80 rounded-2xl p-4 shadow-xs bg-emerald-50/20">
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Đang Mở Tuyển Dụng</div>
          <div className="text-2xl font-black text-emerald-600">{activeCount}</div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Hiển thị trên portal sinh viên</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Đã Đóng / Tạm Dừng</div>
          <div className="text-2xl font-black text-slate-600">{closedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Tạm ngưng nhận hồ sơ</div>
        </div>

        <div className="bg-white border border-purple-200/80 rounded-2xl p-4 shadow-xs bg-purple-50/20">
          <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-1">Luồng Tuyển Dụng</div>
          <Link to="/recruiter/pipeline" className="text-xs font-bold text-purple-600 flex items-center gap-1 mt-2 hover:underline">
            <span>Mở Pipeline Theo Dõi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs mb-6 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm vị trí công việc, kỹ năng, phòng ban hoặc từ khóa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:inline" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full sm:w-auto px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">Tất Cả Phòng Ban</option>
            {DEPARTMENTS.map((dept, idx) => (
              <option key={idx} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">Tất Cả Trạng Thái</option>
            <option value="active">🟢 Đang Mở Tuyển</option>
            <option value="closed">⏸️ Đã Đóng / Tạm Dừng</option>
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
              {searchTerm || selectedDept !== 'all' || selectedStatus !== 'all'
                ? 'Thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm của bạn.'
                : 'Bạn chưa tạo bài đăng tuyển dụng nào. Hãy nhấn nút Đăng Vị Trí Tuyển Dụng Mới để bắt đầu nhận hồ sơ sinh viên!'}
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

              return (
                <div
                  key={job.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
                >
                  {/* Card Top Header */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
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

                      <span className="text-[11px] text-slate-400 font-medium">
                        {job.created_at ? new Date(job.created_at).toLocaleDateString('vi-VN') : 'Gần đây'}
                      </span>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-base font-bold text-blue-950 mb-2 leading-snug line-clamp-2">
                      {job.title}
                    </h3>

                    {/* Department & Location */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mb-3.5">
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
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4 whitespace-pre-wrap">
                      {job.description || 'Chưa có mô tả chi tiết.'}
                    </p>

                    {/* Required Skills Tags */}
                    {job.required_skills && job.required_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.required_skills.slice(0, 5).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10.5px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md border border-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.required_skills.length > 5 && (
                          <span className="text-[10.5px] bg-slate-50 text-slate-400 font-medium px-1.5 py-0.5 rounded-md">
                            +{job.required_skills.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3.5 border-t border-slate-100 flex flex-col gap-2.5">
                    
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

                    {/* Action Row 2: Pipeline & AI Assistant Shortcuts */}
                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                      <Link
                        to={`/recruiter/search?role=${encodeURIComponent(job.title)}`}
                        className="text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1 hover:underline"
                      >
                        <Sparkles className="w-3 h-3" /> Tìm Ứng Viên Khớp
                      </Link>

                      <Link
                        to="/recruiter/pipeline"
                        className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline"
                      >
                        <Kanban className="w-3 h-3" /> Xem Pipeline →
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: TẠO MỚI / CHỈNH SỬA BÀI ĐĂNG TUYỂN DỤNG */}
      {/* ============================================================ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/45 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 bg-gradient-to-r from-blue-950 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                  {editingJob ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold">
                    {editingJob ? '✏️ Chỉnh Sửa Bài Đăng Tuyển Dụng' : '💼 Đăng Vị Trí Tuyển Dụng Mới'}
                  </h2>
                  <p className="text-[11px] text-blue-200">
                    {editingJob ? 'Cập nhật nội dung mô tả, kỹ năng và trạng thái tuyển dụng' : 'Điền thông tin chi tiết để sinh viên có thể xem và ứng tuyển'}
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
                    Địa Điểm Làm Việc:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: TP. Hồ Chí Minh (Chế độ Hybrid)"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                  />
                </div>
              </div>

              {/* Status Selector */}
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
                    <span>Đang Mở Tuyển Dụng</span>
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
                    <span>Tạm Dừng / Đóng Tuyển</span>
                  </button>
                </div>
              </div>

              {/* Skills Input & Popular Tag Suggestions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kỹ Năng Yêu Cầu (cách nhau bởi dấu phẩy):
                </label>
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

              {/* Detailed Description & Project Requirements */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô Tả Chi Tiết Công Việc & Yêu Cầu Đồ Án Verified <span className="text-red-500">*</span>:
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Mô tả trách nhiệm công việc, quyền lợi chế độ đãi ngộ, và các tiêu chí đồ án thực tế mong muốn ở ứng viên..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium leading-relaxed"
                />
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
