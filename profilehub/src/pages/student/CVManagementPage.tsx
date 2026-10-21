import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import {
  FileText,
  Plus,
  Copy,
  Trash2,
  Edit3,
  Star,
  CheckCircle2,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  FileSpreadsheet,
  Search,
  Filter,
  Check,
  RefreshCw,
  AlertCircle,
  Eye
} from 'lucide-react';
import { cvService, type ManagedCVItem, type StudentProfileData } from '../../services/cvService';
import CVManagerModal from '../../components/cv/CVManagerModal';
import BulkCvImportModal from '../../components/recruiter/BulkCvImportModal';
import GenerateCvFromJdModal from '../../components/cv/GenerateCvFromJdModal';
import CvQuickViewModal from '../../components/cv/CvQuickViewModal';
import CreateCvFlowModal from '../../components/cv/CreateCvFlowModal';
import { 
  convertImportedCvToCvBuilderState, 
  generate100SampleCandidates, 
  getStoredImportedCandidates, 
  saveImportedCandidates,
  type ImportedCandidateCv 
} from '../../services/bulkCvImportService';

export default function CVManagementPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cvList, setCvList] = useState<ManagedCVItem[]>([]);
  const [activeCvId, setActiveCvId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Modals & Notifications
  const [isCreateFlowModalOpen, setIsCreateFlowModalOpen] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isGenerateJdModalOpen, setIsGenerateJdModalOpen] = useState(false);
  const [selectedCvForView, setSelectedCvForView] = useState<ManagedCVItem | null>(null);
  const [quickRenameId, setQuickRenameId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [renameRole, setRenameRole] = useState('');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Load Data
  const loadData = useCallback(async () => {
    setLoading(true);
    
    // 1. Tải nhanh từ Local Cache trước để giao diện không bị giật lag
    const localList = cvService.getAllCVs(user?.id);
    if (localList.length > 0) {
      setCvList(localList);
      setActiveCvId(cvService.getActiveCVId(user?.id));
    }

    const [sourceData, cloudList] = await Promise.all([
      cvService.fetchStudentCVSourceData(user?.id),
      cvService.fetchAndSyncCVs(user?.id)
    ]);

    setProfileData(sourceData);
    setCvList(cloudList);

    const activeId = cvService.getActiveCVId(user?.id);
    setActiveCvId(activeId);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Actions
  const handleOpenCvInBuilder = (cv: ManagedCVItem) => {
    cvService.setActiveCVId(cv.id, user?.id);
    navigate('/cv-builder');
  };

  const handleDuplicate = (cv: ManagedCVItem) => {
    const cloned = cvService.duplicateCV(cv.id, `${cv.title} (Bản Mới)`, user?.id);
    if (cloned) {
      loadData();
      setToastMessage({ type: 'success', text: `Đã nhân bản thành công "${cv.title}"!` });
    }
  };

  const handleSetDefault = (id: string) => {
    cvService.setDefaultCV(id, user?.id);
    loadData();
    setToastMessage({ type: 'success', text: 'Đã đặt làm CV chính mặc định!' });
  };

  const handleDelete = (id: string, title: string) => {
    if (cvList.length <= 1) {
      alert('Bạn cần giữ lại ít nhất một bản CV trong tài khoản.');
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa bản "${title}" không?`)) {
      cvService.deleteCV(id, user?.id);
      loadData();
      setToastMessage({ type: 'info', text: `Đã xóa bản CV "${title}".` });
    }
  };

  const handleSaveRename = (id: string) => {
    if (renameTitle.trim()) {
      cvService.renameCV(id, renameTitle, renameRole, user?.id);
      loadData();
      setToastMessage({ type: 'success', text: 'Đã cập nhật thông tin bản CV!' });
    }
    setQuickRenameId(null);
  };

  // 1-Click Push All 100 Sample CVs (Guarantees multi-industry distribution: Medical, Business, Design, Tech)
  const handleBatchPush100Samples = () => {
    const samples = generate100SampleCandidates();
    saveImportedCandidates(samples);
    const created = cvService.bulkImportCandidates(samples, user?.id);
    loadData();
    setToastMessage({
      type: 'success',
      text: `🚀 Đã nạp thành công ${created.length} bản CV đa ngành nghề (Điều dưỡng/Y tế, Marketing, Kế toán, HR, UI/UX, CNTT...) vào Quản Lý CV!`
    });
  };

  // Batch Push handler from Modal
  const handleBatchPushFromModal = (candidates: ImportedCandidateCv[]) => {
    if (!candidates || candidates.length === 0) return;
    const created = cvService.bulkImportCandidates(candidates, user?.id);
    setIsBulkImportOpen(false);
    loadData();
    setToastMessage({
      type: 'success',
      text: `🎉 Đã chuyển ${created.length} CV từ danh sách nạp vào Quản Lý CV thành công!`
    });
  };

  // Clear all bulk imported CVs
  const handleClearBulkCVs = () => {
    if (window.confirm('Bạn có chắc muốn dọn dẹp và xóa các bản CV đã nạp hàng loạt (giữ lại CV chính)?')) {
      cvService.clearAllBulkCVs(user?.id);
      loadData();
      setToastMessage({ type: 'info', text: 'Đã dọn dẹp danh sách CV hàng loạt.' });
    }
  };

  // Single candidate import
  const handleImportSingleCandidate = (candidate: ImportedCandidateCv) => {
    const converted = convertImportedCvToCvBuilderState(candidate);
    cvService.createNewCV({
      title: `CV ${candidate.target_role} (${candidate.full_name})`,
      targetRole: candidate.target_role,
      data: {
        personalInfo: converted.personalInfo,
        sections: converted.sections,
        selectedTemplate: 'classic',
        primaryColor: '#1e3a8a',
        selectedFontId: 'be-vietnam-pro',
        spacingDensity: 'standard',
        fontSizeLevel: 'medium',
        savedAt: new Date().toISOString()
      },
      userId: user?.id
    });
    setIsBulkImportOpen(false);
    loadData();
    navigate('/cv-builder');
  };

  // Filter & Search computation with smart multi-industry groups
  const filteredList = useMemo(() => {
    return cvList.filter(cv => {
      const matchSearch = searchTerm === '' ||
        cv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.targetRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.data?.personalInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchRole = true;
      if (roleFilter === 'ALL') {
        matchRole = true;
      } else if (roleFilter === 'GROUP_MEDICAL') {
        matchRole = /nurse|điều dưỡng|y tế|y tá|dược|bệnh viện|y khoa|lâm sàng|hồi sức/i.test(cv.targetRole);
      } else if (roleFilter === 'GROUP_BUSINESS') {
        matchRole = /marketing|nhân sự|hr|kế toán|tài chính|kinh doanh|sales|quản trị|truyền thông/i.test(cv.targetRole);
      } else if (roleFilter === 'GROUP_DESIGN') {
        matchRole = /design|thiết kế|ui\/ux|đồ họa|graphic|mỹ thuật/i.test(cv.targetRole);
      } else if (roleFilter === 'GROUP_TECH') {
        matchRole = /developer|engineer|frontend|backend|fullstack|lập trình|kỹ sư|ai|data|mobile|qa|cloud|devops/i.test(cv.targetRole);
      } else {
        matchRole = cv.targetRole.toLowerCase().includes(roleFilter.toLowerCase());
      }

      return matchSearch && matchRole;
    });
  }, [cvList, searchTerm, roleFilter]);

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, page, pageSize]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl text-white font-bold text-sm flex items-center gap-3 transition-all animate-bounce ${
          toastMessage.type === 'success' ? 'bg-emerald-600' : toastMessage.type === 'error' ? 'bg-rose-600' : 'bg-blue-600'
        }`}>
          <CheckCircle2 size={18} />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-blue-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold border border-white/10">
              <Layers size={14} />
              Trung Tâm Quản Lý Hồ Sơ Ứng Tuyển
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Quản Lý Phiên Bản & Hồ Sơ CV
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Tạo và quản lý hàng loạt bản CV chuyên biệt cho từng vị trí tuyển dụng. Tích hợp nạp 100 CV mẫu tức thì để trải nghiệm chuẩn hóa ATS & AI Matching đối chiếu.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleBatchPush100Samples}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs sm:text-sm font-black rounded-xl shadow-lg shadow-amber-500/30 flex items-center gap-2 transition active:scale-95 border border-amber-300"
            >
              <Zap size={16} className="fill-slate-950" />
              ⚡ Đẩy Toàn Bộ 100 CV Vào Quản Lý
            </button>

            <button
              onClick={() => setIsBulkImportOpen(true)}
              className="px-4 py-2.5 bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md backdrop-blur-sm flex items-center gap-2 transition active:scale-95"
            >
              <FileSpreadsheet size={16} />
              Nhập Excel / Kho CV
            </button>

            <button
              onClick={() => setIsGenerateJdModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-purple-500/30 flex items-center gap-2 transition active:scale-95 border border-purple-400/30"
            >
              <Sparkles size={16} className="text-yellow-300 animate-pulse" />
              AI Tạo CV Khớp JD
            </button>

            <button
              onClick={() => setIsCreateFlowModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition active:scale-95"
            >
              <Plus size={16} />
              Tạo CV Mới
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Tổng số bản CV trong kho:</span>
            <span className="text-lg sm:text-xl font-black text-amber-300">{cvList.length} bản</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Bản đang chỉnh sửa:</span>
            <span className="text-sm font-bold text-blue-300 line-clamp-1">
              {cvList.find(c => c.id === activeCvId)?.title || 'Chưa chọn'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">CV Chính (Mặc định):</span>
            <span className="text-sm font-bold text-emerald-300 line-clamp-1">
              {cvList.find(c => c.isDefault)?.title || 'CV Mặc định'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Đồ án trong hồ sơ:</span>
            <span className="text-lg sm:text-xl font-black text-emerald-400">
              {profileData?.projects.length || 0} đồ án
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Search, Filter and Actions Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên CV, ứng viên hoặc vị trí tuyển dụng..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={15} className="text-slate-400" />
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">🌐 Tất cả ngành nghề ({cvList.length})</option>
                <optgroup label="── NHÓM LĨNH VỰC ──">
                  <option value="GROUP_MEDICAL">🏥 Y Tế & Điều Dưỡng (Nurse / Health)</option>
                  <option value="GROUP_BUSINESS">💼 Kinh Doanh, Marketing & HR</option>
                  <option value="GROUP_DESIGN">🎨 Thiết Kế & Sáng Tạo (UI/UX)</option>
                  <option value="GROUP_TECH">💻 CNTT & Kỹ Thuật Phần Mềm</option>
                </optgroup>
                <optgroup label="── VỊ TRÍ CHUYÊN MÔN ──">
                  <option value="Điều Dưỡng">Điều Dưỡng Viên Đa Khoa</option>
                  <option value="ICU Nurse">Điều Dưỡng Cấp Cứu ICU</option>
                  <option value="Dược">Dược Sĩ Lâm Sàng</option>
                  <option value="Marketing">Marketing & Digital Media</option>
                  <option value="Nhân Sự">Nhân Sự & Tuyển Dụng (HR)</option>
                  <option value="Kế Toán">Kế Toán & Tài Chính</option>
                  <option value="Bán Hàng">Tư Vấn Bán Hàng (Sales/CSKH)</option>
                  <option value="Design">UI/UX & Product Design</option>
                  <option value="Frontend">Frontend ReactJS</option>
                  <option value="Backend">Backend Node.js / Golang</option>
                  <option value="AI">AI & Machine Learning</option>
                  <option value="Nông Nghiệp">Nông Nghiệp Công Nghệ Cao</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Hiển thị <strong>{filteredList.length}</strong> / {cvList.length} bản CV
            </span>

            {cvList.length > 5 && (
              <button
                onClick={handleClearBulkCVs}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5"
                title="Xóa các CV nạp hàng loạt để làm gọn danh sách"
              >
                <Trash2 size={13} />
                Dọn Dẹp CV Hàng Loạt
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Đang tải danh sách hồ sơ CV...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 shadow-xs">
            <Layers size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              {cvList.length === 0 ? 'Chưa Có Bản CV Nào Trong Quản Lý' : 'Không Tìm Thấy Bản CV Phù Hợp'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
              {cvList.length === 0
                ? 'Nhấn nút "⚡ Đẩy Toàn Bộ 100 CV Vào Quản Lý" bên trên để nạp ngay bộ 100 hồ sơ đa ngành nghề hoàn chỉnh vào tài khoản của bạn.'
                : 'Thử xóa bộ lọc tìm kiếm để xem toàn bộ danh sách.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              {cvList.length === 0 ? (
                <button
                  onClick={handleBatchPush100Samples}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Zap size={15} /> ⚡ Đẩy Ngay 100 CV Mẫu Vào Danh Sách
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('ALL');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Đặt Lại Bộ Lọc
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* CV Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedList.map((cv) => {
                const isActive = cv.id === activeCvId;
                const projectCount = cv.data?.sections?.find(s => s.type === 'projects')?.items?.length || 0;
                const skillCount = cv.data?.sections?.find(s => s.type === 'skills')?.items?.reduce((acc: number, g: any) => acc + (g.skills?.length || 0), 0) || 0;
                const certCount = cv.data?.sections?.find(s => s.type === 'certifications')?.items?.length || 0;
                const candidateName = cv.data?.personalInfo?.fullName || 'Ứng Viên';

                return (
                  <div
                    key={cv.id}
                    className={`bg-white rounded-2xl border-2 transition-all p-5 flex flex-col justify-between shadow-xs hover:shadow-md ${
                      isActive
                        ? 'border-blue-600 ring-2 ring-blue-100/80 bg-blue-50/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isActive && (
                            <span className="px-2.5 py-0.5 bg-blue-600 text-white text-[11px] font-bold rounded-full flex items-center gap-1 shadow-xs">
                              <CheckCircle2 size={12} /> Đang Soạn Thảo
                            </span>
                          )}
                          {cv.isDefault && (
                            <span className="px-2.5 py-0.5 bg-amber-500 text-white text-[11px] font-bold rounded-full flex items-center gap-1 shadow-xs">
                              <Star size={12} fill="white" /> CV Mặc Định
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase">
                            {cv.data?.selectedTemplate || 'CLASSIC'}
                          </span>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {!cv.isDefault && (
                            <button
                              onClick={() => handleSetDefault(cv.id)}
                              title="Đặt làm CV chính (mặc định)"
                              className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-100 rounded-lg transition"
                            >
                              <Star size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDuplicate(cv)}
                            title="Nhân bản / Sao chép từ CV này"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Copy size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setQuickRenameId(cv.id);
                              setRenameTitle(cv.title);
                              setRenameRole(cv.targetRole);
                            }}
                            title="Đổi tên và vị trí mục tiêu"
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Edit3 size={15} />
                          </button>
                          {cvList.length > 1 && (
                            <button
                              onClick={() => handleDelete(cv.id, cv.title)}
                              title="Xóa bản CV này"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Inline Rename Form or Title */}
                      {quickRenameId === cv.id ? (
                        <div className="my-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <input
                            type="text"
                            value={renameTitle}
                            onChange={(e) => setRenameTitle(e.target.value)}
                            placeholder="Tên bản CV"
                            className="w-full text-xs font-bold px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                          />
                          <input
                            type="text"
                            value={renameRole}
                            onChange={(e) => setRenameRole(e.target.value)}
                            placeholder="Vị trí ứng tuyển"
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                          />
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              onClick={() => setQuickRenameId(null)}
                              className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={() => handleSaveRename(cv.id)}
                              className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Lưu
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-3">
                          <h3 className="font-bold text-slate-900 text-base line-clamp-1">{cv.title}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-blue-700 font-bold">{cv.targetRole || 'Chưa định vị trí'}</span>
                            <span className="text-[11px] text-slate-400">• {candidateName}</span>
                          </div>
                        </div>
                      )}

                      {/* Meta Info */}
                      <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl text-slate-600 my-3">
                        <div className="text-center">
                          <span className="block font-bold text-slate-900 text-sm">{projectCount}</span>
                          <span className="text-[10px] text-slate-500">Đồ án</span>
                        </div>
                        <div className="text-center border-x border-slate-200">
                          <span className="block font-bold text-slate-900 text-sm">{skillCount}</span>
                          <span className="text-[10px] text-slate-500">Kỹ năng</span>
                        </div>
                        <div className="text-center">
                          <span className="block font-bold text-slate-900 text-sm">{certCount}</span>
                          <span className="text-[10px] text-slate-500">Chứng chỉ</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[10.5px] text-slate-400 mb-4">
                        <Clock size={12} />
                        <span>Cập nhật: {new Date(cv.updatedAt).toLocaleString('vi-VN')}</span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCvForView(cv)}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-98"
                        title="Xem và đọc nhanh nội dung bản CV này"
                      >
                        <Eye size={14} />
                        <span>Xem</span>
                      </button>

                      <button
                        onClick={() => handleOpenCvInBuilder(cv)}
                        className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm active:scale-98"
                      >
                        <FileText size={14} />
                        {isActive ? 'Tiếp Tục Soạn Thảo' : 'Mở Chỉnh Sửa'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
                <span className="text-slate-500">
                  Trang {page} / {totalPages} ({filteredList.length} CV)
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg font-bold disabled:opacity-40 hover:bg-slate-100"
                  >
                    Trang trước
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5 && page > 3) {
                      pageNum = page - 3 + i;
                      if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded-lg font-bold transition ${
                          page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg font-bold disabled:opacity-40 hover:bg-slate-100"
                  >
                    Trang sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <CreateCvFlowModal
        isOpen={isCreateFlowModalOpen}
        onClose={() => setIsCreateFlowModalOpen(false)}
        userId={user?.id}
        userEmail={user?.email}
        profileSourceData={profileData}
        onCvCreated={loadData}
      />

      <CVManagerModal
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
        userId={user?.id}
        activeCvId={activeCvId}
        profileSourceData={profileData}
        userEmail={user?.email}
        onSelectCV={(cv) => {
          cvService.setActiveCVId(cv.id, user?.id);
          loadData();
          navigate('/cv-builder');
        }}
        onCVsUpdated={loadData}
      />

      <BulkCvImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        title="Nhập CV Nhanh Bằng Excel (.xlsx) Hoặc 100 CV Mẫu"
        subtitle="Chọn từ danh sách 100 CV mẫu chuẩn ATS hoặc tải lên file Excel để nạp trực tiếp toàn bộ 100 CV vào hệ thống."
        onSelectCandidate={handleImportSingleCandidate}
        onBatchPushAll={handleBatchPushFromModal}
      />

      <GenerateCvFromJdModal
        isOpen={isGenerateJdModalOpen}
        onClose={() => setIsGenerateJdModalOpen(false)}
        onSuccess={() => {
          loadData();
        }}
      />

      {/* Popup Xem Nhanh & Đọc Chi Tiết CV */}
      <CvQuickViewModal
        isOpen={!!selectedCvForView}
        cv={selectedCvForView}
        onClose={() => setSelectedCvForView(null)}
        onOpenInBuilder={() => {
          if (selectedCvForView) {
            handleOpenCvInBuilder(selectedCvForView);
          }
          setSelectedCvForView(null);
        }}
      />
    </div>
  );
}
