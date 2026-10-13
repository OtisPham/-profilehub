import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Copy,
  Trash2,
  Edit2,
  Star,
  Check,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FolderPlus,
  Layout,
  Clock,
  X,
  Zap
} from 'lucide-react';
import { cvService, type ManagedCVItem, type StudentProfileData, type SavedCVData } from '../../services/cvService';
import type { CVTemplateType } from './CVTemplates';
import { generate100SampleCandidates, getStoredImportedCandidates } from '../../services/bulkCvImportService';

interface CVManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  activeCvId: string | null;
  profileSourceData: StudentProfileData | null;
  userEmail?: string;
  onSelectCV: (cv: ManagedCVItem) => void;
  onCVsUpdated: () => void;
}

const CAREER_TEMPLATES = [
  {
    role: 'Frontend ReactJS Developer',
    icon: '💻',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Next.js', 'REST API', 'Git'],
    desc: 'Tối ưu cho vị trí Lập trình viên Giao diện Web, chú trọng UI/UX và Core Web Vitals.'
  },
  {
    role: 'Backend Node.js / Express Developer',
    icon: '⚙️',
    skills: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'JWT', 'REST API'],
    desc: 'Tối ưu cho vị trí Xây dựng API, Cơ sở dữ liệu và Kiến trúc Microservices.'
  },
  {
    role: 'Fullstack TypeScript Developer',
    icon: '🚀',
    skills: ['Next.js', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    desc: 'Phù hợp các vị trí phát triển sản phẩm toàn diện End-to-End.'
  },
  {
    role: 'Data Analyst & AI Engineer',
    icon: '📊',
    skills: ['Python', 'SQL', 'Pandas', 'Scikit-Learn', 'Power BI', 'Machine Learning', 'Data Visualization'],
    desc: 'Định hướng Khoa học Dữ liệu, Phân tích dữ liệu kinh doanh và Trí tuệ Nhân tạo.'
  },
  {
    role: 'Mobile App Developer (React Native)',
    icon: '📱',
    skills: ['React Native', 'Expo', 'TypeScript', 'Redux', 'REST API', 'Firebase', 'Mobile UI/UX'],
    desc: 'Lập trình ứng dụng di động đa nền tảng iOS & Android.'
  },
  {
    role: 'UI/UX & Product Designer',
    icon: '🎨',
    skills: ['Figma', 'UI/UX', 'User Research', 'Design System', 'Wireframing', 'Prototyping'],
    desc: 'Nghiên cứu trải nghiệm người dùng và thiết kế giao diện sản phẩm số.'
  }
];

export default function CVManagerModal({
  isOpen,
  onClose,
  userId,
  activeCvId,
  profileSourceData,
  userEmail,
  onSelectCV,
  onCVsUpdated
}: CVManagerModalProps) {
  const [activeTab, setActiveTab] = useState<'my_cvs' | 'create_new'>('my_cvs');
  const [editingCvId, setEditingCvId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editRole, setEditRole] = useState('');

  // Create Form State
  const [creationMode, setCreationMode] = useState<'from_profile' | 'from_old_cv' | 'from_role' | 'blank'>('from_profile');
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState('');
  const [selectedSourceCvId, setSelectedSourceCvId] = useState<string>('');
  const [selectedCareerTemplate, setSelectedCareerTemplate] = useState<number>(0);

  if (!isOpen) return null;

  const cvList = cvService.getAllCVs(userId);

  // Handle Switch CV
  const handleSwitchCV = (cv: ManagedCVItem) => {
    cvService.setActiveCVId(cv.id, userId);
    onSelectCV(cv);
    onCVsUpdated();
    onClose();
  };

  // Handle Rename
  const handleStartRename = (cv: ManagedCVItem) => {
    setEditingCvId(cv.id);
    setEditTitle(cv.title);
    setEditRole(cv.targetRole);
  };

  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      cvService.renameCV(id, editTitle, editRole, userId);
      onCVsUpdated();
    }
    setEditingCvId(null);
  };

  // Handle Duplicate
  const handleDuplicate = (cv: ManagedCVItem) => {
    const cloned = cvService.duplicateCV(cv.id, `${cv.title} (Bản Sao)`, userId);
    if (cloned) {
      onCVsUpdated();
      handleSwitchCV(cloned);
    }
  };

  // Handle Set Default
  const handleSetDefault = (id: string) => {
    cvService.setDefaultCV(id, userId);
    onCVsUpdated();
  };

  // Handle Delete
  const handleDelete = (id: string, title: string) => {
    if (cvList.length <= 1) {
      alert('Bạn phải giữ lại ít nhất 1 CV trong tài khoản.');
      return;
    }
    if (confirm(`Bạn có chắc chắn muốn xóa "${title}" không? Hành động này không thể hoàn tác.`)) {
      cvService.deleteCV(id, userId);
      onCVsUpdated();
    }
  };

  // Batch seed 100 CVs
  const handleBatchSeed100 = () => {
    let samples = getStoredImportedCandidates();
    if (!samples || samples.length === 0) {
      samples = generate100SampleCandidates();
    }
    const created = cvService.bulkImportCandidates(samples, userId);
    onCVsUpdated();
    alert(`🚀 Đã nạp và đẩy thành công ${created.length} bản CV mẫu vào kho quản lý!`);
  };

  // Handle Create New CV Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const titleToUse = newTitle.trim() || 'CV Ứng Tuyển Mới';
    const roleToUse = newRole.trim() || 'Kỹ Sư Phần Mềm';

    let initialData: SavedCVData;

    if (creationMode === 'from_old_cv' && selectedSourceCvId) {
      const source = cvService.getCVById(selectedSourceCvId, userId);
      if (source) {
        initialData = JSON.parse(JSON.stringify(source.data));
        initialData.personalInfo.jobTitle = roleToUse;
      } else {
        const initial = cvService.buildInitialSections(profileSourceData || { profile: null, projects: [], certificates: [], achievements: [] }, userEmail);
        initialData = {
          personalInfo: initial.personalInfo,
          sections: initial.sections,
          selectedTemplate: 'classic',
          primaryColor: '#1e3a8a',
          selectedFontId: 'be-vietnam-pro',
          spacingDensity: 'standard',
          fontSizeLevel: 'medium',
          savedAt: new Date().toISOString()
        };
      }
    } else if (creationMode === 'from_role') {
      const tpl = CAREER_TEMPLATES[selectedCareerTemplate];
      const initial = cvService.buildInitialSections(profileSourceData || { profile: null, projects: [], certificates: [], achievements: [] }, userEmail);
      initial.personalInfo.jobTitle = tpl.role;
      initialData = {
        personalInfo: initial.personalInfo,
        sections: initial.sections,
        selectedTemplate: 'tech',
        primaryColor: '#4f46e5',
        selectedFontId: 'be-vietnam-pro',
        spacingDensity: 'standard',
        fontSizeLevel: 'medium',
        savedAt: new Date().toISOString()
      };
    } else if (creationMode === 'blank') {
      initialData = {
        personalInfo: {
          fullName: 'HỌ VÀ TÊN ỨNG VIÊN',
          jobTitle: roleToUse,
          email: userEmail || 'candidate@example.com',
          phone: '0901 234 567',
          location: 'TP. Hồ Chí Minh',
          visibleFields: { phone: true, email: true, facebook: false, linkedin: true, website: true, location: true, avatarUrl: false }
        },
        sections: [
          {
            id: 'sec_objective',
            type: 'objective',
            title: 'MỤC TIÊU NGHỀ NGHIỆP',
            order_index: 0,
            is_visible: true,
            settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
            content: 'Mô tả mục tiêu nghề nghiệp và định hướng phát triển bản thân...'
          }
        ],
        selectedTemplate: 'classic',
        primaryColor: '#1e3a8a',
        selectedFontId: 'be-vietnam-pro',
        spacingDensity: 'standard',
        fontSizeLevel: 'medium',
        savedAt: new Date().toISOString()
      };
    } else {
      // from_profile
      const initial = cvService.buildInitialSections(profileSourceData || { profile: null, projects: [], certificates: [], achievements: [] }, userEmail);
      initial.personalInfo.jobTitle = roleToUse;
      initialData = {
        personalInfo: initial.personalInfo,
        sections: initial.sections,
        selectedTemplate: 'classic',
        primaryColor: '#1e3a8a',
        selectedFontId: 'be-vietnam-pro',
        spacingDensity: 'standard',
        fontSizeLevel: 'medium',
        savedAt: new Date().toISOString()
      };
    }

    const created = cvService.createNewCV({
      title: titleToUse,
      targetRole: roleToUse,
      data: initialData,
      userId
    });

    onCVsUpdated();
    handleSwitchCV(created);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-950/30 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-blue-100">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-white border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/20">
              <Layers size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-blue-950">Quản Lý Hồ Sơ & Phiên Bản CV</h2>
              <p className="text-xs text-slate-500">Tạo mới, chuyển đổi hoặc nhân bản từ các CV cũ cho từng vị trí ứng tuyển</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-blue-600 hover:text-blue-900 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('my_cvs')}
            className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'my_cvs'
                ? 'bg-white text-blue-600 border-blue-600 shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <FileText size={16} />
            Tất Cả CV Của Tôi ({cvList.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('create_new');
              if (cvList.length > 0 && !selectedSourceCvId) {
                setSelectedSourceCvId(cvList[0].id);
              }
            }}
            className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'create_new'
                ? 'bg-white text-blue-600 border-blue-600 shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Plus size={16} />
            Tạo CV Mới (Có Kế Thừa CV Cũ)
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'my_cvs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-50/70 p-3.5 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 text-sm text-blue-900">
                  <Sparkles size={16} className="text-blue-600" />
                  <span>Mẹo: Bạn có thể tạo nhiều bản CV chuyên biệt cho từng vị trí (Frontend, Backend, AI...) để đạt điểm ATS và AI Matching cao nhất.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBatchSeed100}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
                    title="Nạp và chuyển 100 CV mẫu đa ngành vào danh sách của bạn"
                  >
                    <Zap size={13} className="fill-slate-950" /> Nạp 100 CV Mẫu
                  </button>
                  <button
                    onClick={() => setActiveTab('create_new')}
                    className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus size={14} /> Thêm CV Mới
                  </button>
                </div>
              </div>

              {cvList.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                  <FileText size={48} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-600 font-medium">Chưa có bản CV nào được lưu.</p>
                  <button
                    onClick={() => setActiveTab('create_new')}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
                  >
                    Tạo CV Đầu Tiên
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cvList.map((cv) => {
                    const isActive = cv.id === activeCvId;
                    const projectCount = cv.data?.sections?.find(s => s.type === 'projects')?.items?.length || 0;
                    const skillCount = cv.data?.sections?.find(s => s.type === 'skills')?.items?.reduce((acc: number, g: any) => acc + (g.skills?.length || 0), 0) || 0;

                    return (
                      <div
                        key={cv.id}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                          isActive
                            ? 'border-blue-600 bg-blue-50/30 shadow-md ring-2 ring-blue-100'
                            : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                        }`}
                      >
                        <div>
                          {/* Card Top Meta */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {isActive && (
                                <span className="px-2 py-0.5 bg-blue-600 text-white text-[11px] font-bold rounded-full flex items-center gap-1 shadow-sm">
                                  <Check size={11} /> Đang Soạn Thảo
                                </span>
                              )}
                              {cv.isDefault && (
                                <span className="px-2 py-0.5 bg-amber-500 text-white text-[11px] font-bold rounded-full flex items-center gap-1">
                                  <Star size={11} fill="white" /> CV Chính
                                </span>
                              )}
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-full">
                                {cv.data?.selectedTemplate?.toUpperCase() || 'CLASSIC'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              {!cv.isDefault && (
                                <button
                                  onClick={() => handleSetDefault(cv.id)}
                                  title="Đặt làm CV chính"
                                  className="p-1 text-slate-400 hover:text-amber-500 hover:bg-slate-100 rounded"
                                >
                                  <Star size={15} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDuplicate(cv)}
                                title="Nhân bản từ CV này"
                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded"
                              >
                                <Copy size={15} />
                              </button>
                              <button
                                onClick={() => handleStartRename(cv)}
                                title="Đổi tên CV"
                                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                              >
                                <Edit2 size={15} />
                              </button>
                              {cvList.length > 1 && (
                                <button
                                  onClick={() => handleDelete(cv.id, cv.title)}
                                  title="Xóa CV"
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded"
                                >
                                  <Trash2 size={15} />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Rename Inline or Title */}
                          {editingCvId === cv.id ? (
                            <div className="my-2 space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Tên bản CV"
                                className="w-full text-sm font-bold px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                              />
                              <input
                                type="text"
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                                placeholder="Vị trí mục tiêu (VD: Frontend Dev)"
                                className="w-full text-xs px-2.5 py-1 border border-slate-300 rounded bg-white"
                              />
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => setEditingCvId(null)}
                                  className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                                >
                                  Hủy
                                </button>
                                <button
                                  onClick={() => handleSaveRename(cv.id)}
                                  className="px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                  Lưu
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h3 className="font-bold text-slate-900 text-base line-clamp-1">{cv.title}</h3>
                              <p className="text-xs text-blue-700 font-semibold mb-2">{cv.targetRole || 'Chưa định vị trí'}</p>
                            </div>
                          )}

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg my-2">
                            <div>📁 Đồ án: <strong className="text-slate-800">{projectCount}</strong></div>
                            <div>⚡ Kỹ năng: <strong className="text-slate-800">{skillCount}</strong></div>
                            <div className="col-span-2 flex items-center gap-1 text-[10px] text-slate-400">
                              <Clock size={11} /> Cập nhật: {new Date(cv.updatedAt).toLocaleString('vi-VN')}
                            </div>
                          </div>
                        </div>

                        {/* Action Switch */}
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => handleSwitchCV(cv)}
                            className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                              isActive
                                ? 'bg-slate-100 text-slate-700 cursor-default'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                            }`}
                          >
                            {isActive ? '✓ Đang Mở Bản Này' : 'Mở Chỉnh Sửa Bản Này'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'create_new' && (
            <form onSubmit={handleCreateSubmit} className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">1. Chọn Cách Thức Khởi Tạo CV</h3>
                <p className="text-xs text-slate-500 mb-3">Bạn có thể kế thừa toàn bộ nội dung từ các CV cũ để tùy chỉnh nhanh cho từng JD.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: From Profile */}
                  <label
                    onClick={() => setCreationMode('from_profile')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                      creationMode === 'from_profile'
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="creationMode"
                      checked={creationMode === 'from_profile'}
                      onChange={() => setCreationMode('from_profile')}
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck size={15} className="text-emerald-600" />
                        Tự Động Từ Hồ Sơ Sinh Viên
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Nạp toàn bộ đồ án đã xác thực, bằng cấp, kỹ năng từ trang Profile của bạn.</p>
                    </div>
                  </label>

                  {/* Option 2: Clone Old CV */}
                  <label
                    onClick={() => setCreationMode('from_old_cv')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                      creationMode === 'from_old_cv'
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="creationMode"
                      checked={creationMode === 'from_old_cv'}
                      onChange={() => setCreationMode('from_old_cv')}
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Copy size={15} className="text-blue-600" />
                        Sao Chép / Nhân Bản Từ CV Cũ
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Giữ nguyên các mục đã viết, chỉ sửa đổi tiêu đề và kỹ năng theo JD mới.</p>
                    </div>
                  </label>

                  {/* Option 3: From Role Template */}
                  <label
                    onClick={() => setCreationMode('from_role')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                      creationMode === 'from_role'
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="creationMode"
                      checked={creationMode === 'from_role'}
                      onChange={() => setCreationMode('from_role')}
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Sparkles size={15} className="text-purple-600" />
                        Theo Mẫu Ngành Nghề (Frontend/Backend/AI)
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Cấu trúc sẵn từ khóa, template và dự án gợi ý chuẩn ngành.</p>
                    </div>
                  </label>

                  {/* Option 4: Blank */}
                  <label
                    onClick={() => setCreationMode('blank')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                      creationMode === 'blank'
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="creationMode"
                      checked={creationMode === 'blank'}
                      onChange={() => setCreationMode('blank')}
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FolderPlus size={15} className="text-slate-600" />
                        Tạo CV Trắng Hoàn Toàn
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Bắt đầu từ một khung trống để tự do thiết kế các phần mục.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Sub-Selection for Old CV Mode */}
              {creationMode === 'from_old_cv' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-800 mb-2">Chọn Bản CV Cũ Để Sao Chép Toàn Bộ Dữ Liệu:</label>
                  {cvList.length === 0 ? (
                    <p className="text-xs text-rose-600 font-medium">Bạn chưa có bản CV cũ nào. Vui lòng chọn tạo từ Hồ Sơ Sinh Viên.</p>
                  ) : (
                    <select
                      value={selectedSourceCvId}
                      onChange={(e) => {
                        setSelectedSourceCvId(e.target.value);
                        const source = cvList.find(c => c.id === e.target.value);
                        if (source && !newTitle) {
                          setNewTitle(`${source.title} (Bản Mới)`);
                          setNewRole(source.targetRole);
                        }
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      {cvList.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title} — {c.targetRole} (Cập nhật: {new Date(c.updatedAt).toLocaleDateString('vi-VN')})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Sub-Selection for Role Template Mode */}
              {creationMode === 'from_role' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-800 mb-2">Chọn Vị Trí Mục Tiêu Để Tối Ưu:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CAREER_TEMPLATES.map((tpl, idx) => (
                      <div
                        key={tpl.role}
                        onClick={() => {
                          setSelectedCareerTemplate(idx);
                          setNewTitle(`CV ${tpl.role}`);
                          setNewRole(tpl.role);
                        }}
                        className={`p-2.5 rounded-lg border cursor-pointer transition ${
                          selectedCareerTemplate === idx
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <span>{tpl.icon}</span>
                          <span>{tpl.role}</span>
                        </div>
                        <p className={`text-[10px] mt-1 line-clamp-1 ${selectedCareerTemplate === idx ? 'text-blue-100' : 'text-slate-500'}`}>
                          {tpl.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta Inputs - Single Column Form for Smooth Visual Flow */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-left">
                    Tên Bản CV Mới
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ví dụ: CV Frontend Developer - Ứng Tuyển Công Ty ABC"
                    className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 font-medium placeholder:text-slate-400 placeholder:italic focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-left">
                    Vị Trí Ứng Tuyển Mục Tiêu
                  </label>
                  <input
                    type="text"
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="Ví dụ: Frontend ReactJS Developer"
                    className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 font-medium placeholder:text-slate-400 placeholder:italic focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-750 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('my_cvs')}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Quay Lại
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Plus size={16} /> Khởi Tạo & Mở Soạn Thảo
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
