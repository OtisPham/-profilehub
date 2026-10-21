import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  LayoutTemplate,
  Edit3,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FileText,
  Palette,
  Briefcase,
  Zap,
  CheckCircle2,
  Columns,
  Square,
  CheckSquare,
  FolderKanban,
  Award,
  Layers
} from 'lucide-react';
import type { CVTemplateType } from './CVTemplates';
import { cvService, type StudentProfileData, type SavedCVData } from '../../services/cvService';
import GenerateCvFromJdModal from './GenerateCvFromJdModal';

interface CreateCvFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  userEmail?: string;
  profileSourceData: StudentProfileData | null;
  initialStep?: 'choose_flow' | 'manual_studio';
  onCvCreated?: () => void;
}

export const TEMPLATE_SHOWCASE: Array<{
  id: CVTemplateType;
  name: string;
  badge: string;
  badgeColor: string;
  desc: string;
  columns: '1-col' | '2-col';
  bestFor: string;
  defaultFontId: string;
}> = [
  {
    id: 'classic',
    name: 'Classic ATS Pro',
    badge: 'Chuẩn ATS Cao',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    desc: 'Bố cục 2 cột cân đối, thanh lịch, dễ đọc với mọi hệ thống ATS tuyển dụng.',
    columns: '2-col',
    bestFor: 'Đa ngành nghề, Thực tập sinh, Fresher',
    defaultFontId: 'inter'
  },
  {
    id: 'tech',
    name: 'Tech Specialist',
    badge: 'Dành Cho IT / Dev',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    desc: 'Tối ưu cho Lập trình viên, làm nổi bật Tech Stack, Đồ án GitHub và Kỹ năng kỹ thuật.',
    columns: '2-col',
    bestFor: 'Frontend, Backend, AI, Data Engineer',
    defaultFontId: 'plus-jakarta'
  },
  {
    id: 'pro_split',
    name: 'TopCV Modern Split',
    badge: 'Sidebar Hiện Đại',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    desc: 'Cột sidebar màu sắc nổi bật thông tin liên hệ, kỹ năng; cột phải tập trung kinh nghiệm.',
    columns: '2-col',
    bestFor: 'Marketing, UI/UX, Quản trị kinh doanh',
    defaultFontId: 'be-vietnam-pro'
  },
  {
    id: 'compact_ats',
    name: 'Compact ATS 1-Trang',
    badge: 'Tối Ưu 1 Trang',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    desc: 'Khoảng cách tinh chỉnh gọn gàng, chứa nhiều thông tin nhưng không bị tràn sang trang 2.',
    columns: '2-col',
    bestFor: 'Ứng viên có nhiều dự án, tối ưu độ dài',
    defaultFontId: 'be-vietnam-pro'
  },
  {
    id: 'minimal',
    name: 'Minimalist Harvard',
    badge: 'Ivy League / 1 Cột',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    desc: 'Phong cách tối giản kinh điển của các trường Ivy League, 1 cột mạch lạc, sang trọng.',
    columns: '1-col',
    bestFor: 'Tài chính, Ngân hàng, Tư vấn, Học thuật',
    defaultFontId: 'be-vietnam-pro'
  },
  {
    id: 'executive',
    name: 'Executive Academic',
    badge: 'Học Thuật / Serif',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    desc: 'Đường nét trang nhã với phông chữ có chân (Serif), thể hiện chiều sâu nghiên cứu.',
    columns: '1-col',
    bestFor: 'Nghiên cứu, Giáo dục, Quản lý cấp cao',
    defaultFontId: 'lora'
  }
];

export const COLOR_SWATCHES = [
  { name: 'Xanh Navy Chuyên Nghiệp', hex: '#1e3a8a', bgClass: 'bg-[#1e3a8a]' },
  { name: 'Xanh Ngọc Lục Bảo (Emerald)', hex: '#047857', bgClass: 'bg-[#047857]' },
  { name: 'Tím Đậm (Tech Indigo)', hex: '#4f46e5', bgClass: 'bg-[#4f46e5]' },
  { name: 'Xám Than Sang Trọng (Charcoal)', hex: '#334155', bgClass: 'bg-[#334155]' },
  { name: 'Đỏ Ruby Quý Phái', hex: '#991b1b', bgClass: 'bg-[#991b1b]' },
];

export default function CreateCvFlowModal({
  isOpen,
  onClose,
  userId,
  userEmail,
  profileSourceData,
  initialStep = 'choose_flow',
  onCvCreated
}: CreateCvFlowModalProps) {
  const navigate = useNavigate();

  // Step state: 'choose_flow' | 'manual_studio'
  const [step, setStep] = useState<'choose_flow' | 'manual_studio'>(initialStep);
  const [isAiJdModalOpen, setIsAiJdModalOpen] = useState(false);

  // Reset or update step when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
    }
  }, [isOpen, initialStep]);

  // Manual Studio Form State
  const [internalProfileData, setInternalProfileData] = useState<StudentProfileData | null>(profileSourceData);
  const [cvTitle, setCvTitle] = useState('');
  const [targetRole, setTargetRole] = useState(profileSourceData?.profile?.major || 'Kỹ Sư Phần Mềm');
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplateType>('classic');
  const [selectedColor, setSelectedColor] = useState<string>('#1e3a8a');
  const [dataSource, setDataSource] = useState<'from_profile' | 'blank'>('from_profile');
  const [setAsDefault, setSetAsDefault] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>([]);

  // Load profile data if not provided
  React.useEffect(() => {
    if (profileSourceData) {
      setInternalProfileData(profileSourceData);
      if (profileSourceData.profile?.major && !targetRole) {
        setTargetRole(profileSourceData.profile.major);
      }
      setSelectedProjectIds((profileSourceData.projects || []).map(p => p.id));
      setSelectedCertIds((profileSourceData.certificates || []).map(c => c.id));
    } else if (userId) {
      cvService.fetchStudentCVSourceData(userId).then(data => {
        setInternalProfileData(data);
        if (data.profile?.major) {
          setTargetRole(data.profile.major);
        }
        setSelectedProjectIds((data.projects || []).map(p => p.id));
        setSelectedCertIds((data.certificates || []).map(c => c.id));
      });
    }
  }, [profileSourceData, userId]);

  if (!isOpen) return null;

  // Handle launch Manual Studio
  const handleStartManualWriting = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let profileDataToUse = internalProfileData;
      if (!profileDataToUse && userId) {
        try {
          profileDataToUse = await cvService.fetchStudentCVSourceData(userId);
          setInternalProfileData(profileDataToUse);
        } catch (e) {
          console.warn('[CreateCvFlowModal] Could not fetch profile source data:', e);
        }
      }

      const finalRole = targetRole.trim() || profileDataToUse?.profile?.major || 'Kỹ Sư Phần Mềm';
      const finalTitle = cvTitle.trim() || `CV ${finalRole} (${new Date().toLocaleDateString('vi-VN')})`;
      const matchedTemplate = TEMPLATE_SHOWCASE.find(t => t.id === selectedTemplate);

      let initialData: SavedCVData;

      if (dataSource === 'blank') {
        initialData = {
          personalInfo: {
            fullName: profileDataToUse?.profile?.full_name || 'HỌ VÀ TÊN ỨNG VIÊN',
            jobTitle: finalRole,
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
              content: 'Mô tả mục tiêu phát triển chuyên môn và định hướng đóng góp giá trị cho doanh nghiệp...'
            },
            {
              id: 'sec_education',
              type: 'education',
              title: 'HỌC VẤN & BẰNG CẤP',
              order_index: 1,
              is_visible: true,
              settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
              items: [
                {
                  id: `edu_${Date.now()}`,
                  institution: profileDataToUse?.profile?.university || 'Trường Đại Học',
                  major: finalRole,
                  startDate: '2022',
                  endDate: '2026',
                  description: '• Chuyên ngành chính và các học phần đạt thành tích xuất sắc.'
                }
              ]
            },
            {
              id: 'sec_projects',
              type: 'projects',
              title: 'DỰ ÁN & ĐỒ ÁN NỔI BẬT',
              order_index: 2,
              is_visible: true,
              settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
              items: [
                {
                  id: `proj_${Date.now()}`,
                  projectName: 'Dự Án Cá Nhân Tiêu Biểu',
                  role: 'Nhà phát triển chính',
                  startDate: '2025',
                  endDate: '2026',
                  description: '• Xây dựng giải pháp giải quyết bài toán thực tế.\n• Ứng dụng công nghệ hiện đại và đạt kết quả đo lường rõ ràng.',
                  technologies: ['React', 'TypeScript', 'Node.js']
                }
              ]
            }
          ],
          selectedTemplate,
          primaryColor: selectedColor,
          selectedFontId: matchedTemplate?.defaultFontId || 'be-vietnam-pro',
          spacingDensity: 'standard',
          fontSizeLevel: 'medium',
          savedAt: new Date().toISOString()
        };
      } else {
        // from_profile: Fill education, and ONLY the selected projects & certificates from checkboxes
        const filteredProjects = (profileDataToUse?.projects || []).filter(p => selectedProjectIds.includes(p.id));
        const filteredCerts = (profileDataToUse?.certificates || []).filter(c => selectedCertIds.includes(c.id));

        const initial = cvService.buildInitialSections(
          {
            ...(profileDataToUse || { profile: null, projects: [], certificates: [], achievements: [] }),
            projects: filteredProjects,
            certificates: filteredCerts
          },
          userEmail
        );
        initial.personalInfo.jobTitle = finalRole;
        initialData = {
          personalInfo: initial.personalInfo,
          sections: initial.sections,
          selectedTemplate,
          primaryColor: selectedColor,
          selectedFontId: matchedTemplate?.defaultFontId || 'be-vietnam-pro',
          spacingDensity: 'standard',
          fontSizeLevel: 'medium',
          savedAt: new Date().toISOString()
        };
      }

      const created = cvService.createNewCV({
        title: finalTitle,
        targetRole: finalRole,
        data: initialData,
        userId,
        isDefault: setAsDefault
      });

      if (onCvCreated) onCvCreated();
      onClose();
      window.dispatchEvent(new CustomEvent('profilehub:cv-switched', { detail: created }));
      navigate('/cv-builder', { state: { newCvId: created.id, timestamp: Date.now() }, replace: true });
    } catch (err) {
      console.error('[CreateCvFlowModal] Error creating CV:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-100">
          
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                {step === 'choose_flow' ? <Sparkles size={20} /> : <LayoutTemplate size={20} />}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {step === 'choose_flow' ? 'Khởi Tạo Bản CV Mới' : 'Tự Chọn Mẫu & Thiết Lập CV'}
                </h2>
                <p className="text-xs text-slate-500">
                  {step === 'choose_flow'
                    ? 'Chọn phương thức tạo CV phù hợp với nhu cầu ứng tuyển của bạn'
                    : 'Tùy chỉnh mẫu A4, bảng màu và dữ liệu khởi đầu trước khi bắt đầu soạn thảo'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            {step === 'choose_flow' ? (
              /* ========================================================
               * SCREEN 1: CHOOSE CREATION FLOW
               * ======================================================== */
              <div className="space-y-6">
                <div className="text-center max-w-xl mx-auto mb-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-1">
                    Bạn muốn bắt đầu bản CV này theo cách nào?
                  </h3>
                  <p className="text-xs text-slate-500">
                    ProfileHub hỗ trợ cả 2 chế độ: tự động hóa thông minh bằng AI hoặc hoàn toàn tự do sáng tạo theo phong cách của bạn.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* OPTION A: AI GENERATION FROM JD */}
                  <div
                    onClick={() => setIsAiJdModalOpen(true)}
                    className="group relative p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-b from-purple-50/60 via-indigo-50/20 to-white hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="absolute top-4 right-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-purple-600 text-white shadow-xs">
                        ⚡ Khuyên Dùng
                      </span>
                    </div>

                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform">
                        <Sparkles size={24} className="text-yellow-300 animate-pulse" />
                      </div>

                      <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors mb-1.5 flex items-center gap-2">
                        AI Tự Động Viết Khớp JD
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        Dán nội dung tuyển dụng (JD). AI Gemini đọc hồ sơ cá nhân của bạn, phân tích từ khóa và <strong>tự động sinh toàn bộ bản CV mục tiêu</strong> chuẩn ATS chỉ trong 5 giây.
                      </p>

                      <div className="space-y-2 text-[11.5px] text-slate-600 border-t border-purple-100/80 pt-3">
                        <div className="flex items-center gap-2 text-purple-900 font-medium">
                          <CheckCircle2 size={14} className="text-purple-600 shrink-0" />
                          <span>Tự động tối ưu từ khóa kỹ năng theo đúng JD</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-900 font-medium">
                          <CheckCircle2 size={14} className="text-purple-600 shrink-0" />
                          <span>Gắn nhãn minh chứng đồ án thật từ Profile</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-900 font-medium">
                          <CheckCircle2 size={14} className="text-purple-600 shrink-0" />
                          <span>Popup đọc ngay + xem trước nhanh 1-Click</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-purple-100/60 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-purple-600">Phù hợp khi đã có JD công ty</span>
                      <button
                        type="button"
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md group-hover:shadow-purple-500/30 flex items-center gap-1.5 transition-all"
                      >
                        <span>Tạo bằng AI</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* OPTION B: MANUAL STUDIO & TEMPLATE PICKER */}
                  <div
                    onClick={() => setStep('manual_studio')}
                    className="group relative p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="absolute top-4 right-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                        ✍️ Chủ Động 100%
                      </span>
                    </div>

                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-600 text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform">
                        <LayoutTemplate size={24} />
                      </div>

                      <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5 flex items-center gap-2">
                        Tự Chọn Mẫu & Tự Viết Tay
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        Duyệt bộ sưu tập 6 mẫu CV chuẩn A4 (Harvard, Tech Specialist, ATS Pro...). Tự do soạn thảo câu chữ theo phong cách riêng mà <strong>không trừ lượt AI credit</strong>.
                      </p>

                      <div className="space-y-2 text-[11.5px] text-slate-600 border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                          <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                          <span>Tùy chọn tải sẵn dữ liệu Profile hoặc bắt đầu từ trang trắng</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                          <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                          <span>Tự do đổi phông chữ Tiếng Việt, màu sắc, canh lề A4</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                          <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                          <span>Vẫn có sẵn nút [✏️ Sửa / AI] từng câu khi bạn cần</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500">CV Tổng quan / Chưa có JD</span>
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md group-hover:bg-blue-700 flex items-center gap-1.5 transition-all"
                      >
                        <span>Chọn Mẫu & Viết</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ========================================================
               * SCREEN 2: TEMPLATE SHOWCASE & MANUAL SETUP STUDIO
               * ======================================================== */
              <div className="space-y-6">
                {/* Back button */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep('choose_flow')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <ArrowLeft size={14} /> Quay lại chọn phương thức
                  </button>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    Bước 2: Chọn Mẫu & Thiết Lập
                  </span>
                </div>

                {/* CV Name & Role Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tên Bản CV (Để dễ quản lý)
                    </label>
                    <input
                      type="text"
                      value={cvTitle}
                      onChange={(e) => setCvTitle(e.target.value)}
                      placeholder={`CV ${targetRole || 'Frontend Developer'} 2026`}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Vị Trí Mục Tiêu (Target Role)
                    </label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="VD: Frontend ReactJS Developer, Data Analyst..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                {/* Template Showcase Grid */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <LayoutTemplate size={14} className="text-blue-600" />
                      1. Chọn Mẫu Giao Diện A4 ({TEMPLATE_SHOWCASE.length} Mẫu)
                    </label>
                    <span className="text-[11px] text-slate-500">Có thể đổi mẫu bất cứ lúc nào trong Canvas</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {TEMPLATE_SHOWCASE.map((tmpl) => {
                      const isSelected = selectedTemplate === tmpl.id;
                      return (
                        <div
                          key={tmpl.id}
                          onClick={() => setSelectedTemplate(tmpl.id)}
                          className={`relative p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/40 shadow-md ring-2 ring-blue-100'
                              : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                          }`}
                        >
                          <div>
                            {/* Template Wireframe Miniature */}
                            <div className="w-full h-24 bg-slate-100 rounded-xl mb-3 p-2 flex flex-col justify-between border border-slate-200 overflow-hidden relative">
                              {/* Header mini */}
                              <div
                                className="h-3.5 rounded-sm w-full mb-1 flex items-center justify-between px-1"
                                style={{ backgroundColor: isSelected ? selectedColor : '#334155' }}
                              >
                                <div className="h-1 bg-white/80 rounded w-1/3"></div>
                                <div className="h-1 bg-white/40 rounded w-1/4"></div>
                              </div>

                              {/* Layout Columns mini */}
                              {tmpl.columns === '2-col' ? (
                                <div className="flex gap-1.5 flex-1">
                                  <div className="w-1/3 bg-slate-200/80 rounded p-1 space-y-1">
                                    <div className="h-1 bg-slate-400/60 rounded w-full"></div>
                                    <div className="h-1 bg-slate-300 rounded w-4/5"></div>
                                    <div className="h-1 bg-slate-300 rounded w-3/5"></div>
                                  </div>
                                  <div className="flex-1 bg-white rounded p-1 space-y-1 border border-slate-200/60">
                                    <div className="h-1.5 bg-slate-400 rounded w-1/2"></div>
                                    <div className="h-1 bg-slate-300 rounded w-full"></div>
                                    <div className="h-1 bg-slate-300 rounded w-5/6"></div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex-1 bg-white rounded p-1 space-y-1.5 border border-slate-200/60">
                                  <div className="h-1.5 bg-slate-400 rounded w-1/3"></div>
                                  <div className="h-1 bg-slate-300 rounded w-full"></div>
                                  <div className="h-1 bg-slate-300 rounded w-4/5"></div>
                                  <div className="h-1 bg-slate-300 rounded w-full"></div>
                                </div>
                              )}

                              {isSelected && (
                                <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[0.5px] flex items-center justify-center">
                                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                                    <Check size={14} strokeWidth={3} />
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Badge & Name */}
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <h5 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                                {tmpl.name}
                              </h5>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${tmpl.badgeColor} shrink-0`}>
                                {tmpl.badge}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 leading-normal line-clamp-2 mb-2">
                              {tmpl.desc}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                            <span className="text-slate-400">{tmpl.columns === '2-col' ? '2 Cột' : '1 Cột'}</span>
                            <span className="font-semibold text-blue-700 truncate max-w-[130px]">{tmpl.bestFor}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Color Palette Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <Palette size={14} className="text-blue-600" />
                    2. Màu Sắc Chủ Đạo Cho CV
                  </label>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {COLOR_SWATCHES.map((swatch) => {
                      const isColorActive = selectedColor === swatch.hex;
                      return (
                        <button
                          key={swatch.hex}
                          type="button"
                          onClick={() => setSelectedColor(swatch.hex)}
                          className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-medium transition-all ${
                            isColorActive
                              ? 'border-slate-800 bg-slate-900 text-white shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span>{swatch.name}</span>
                          {isColorActive && <Check size={12} className="text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Starting Data Source Option */}
                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <ShieldCheck size={14} className="text-blue-600" />
                    3. Nguồn Dữ Liệu Khởi Đầu
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => setDataSource('from_profile')}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                        dataSource === 'from_profile'
                          ? 'border-blue-600 bg-blue-50/50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="dataSourceOption"
                        checked={dataSource === 'from_profile'}
                        onChange={() => setDataSource('from_profile')}
                        className="mt-1 text-blue-600"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>Nạp Dữ Liệu Từ Hồ Sơ Cá Nhân</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">Khuyên dùng</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Tự động nạp sẵn Học vấn, Đồ án, Kỹ năng từ trang Profile của bạn. Bạn không cần phải gõ lại từ đầu.
                        </p>
                      </div>
                    </label>

                    <label
                      onClick={() => setDataSource('blank')}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                        dataSource === 'blank'
                          ? 'border-blue-600 bg-blue-50/50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="dataSourceOption"
                        checked={dataSource === 'blank'}
                        onChange={() => setDataSource('blank')}
                        className="mt-1 text-blue-600"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Bắt Đầu Với Bản Mẫu Trống (Blank)
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Khởi tạo khung sườn mẫu cơ bản, bạn tự do nhập toàn bộ thông tin từ đầu theo ý muốn.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Interactive Checkbox List for Projects & Certificates from Profile */}
                  {dataSource === 'from_profile' && (
                    <div className="mt-3.5 p-4 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50/70 rounded-2xl border border-blue-100/90 space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-2.5 border-b border-blue-100">
                        <div className="flex items-center gap-2">
                          <FolderKanban size={16} className="text-blue-600" />
                          <span className="text-xs font-bold text-slate-800">
                            Tick Chọn Dự Án & Chứng Chỉ Cần Lấy Qua CV:
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                          Đã chọn: {selectedProjectIds.length} dự án • {selectedCertIds.length} chứng chỉ
                        </span>
                      </div>

                      {/* Sub-group 1: Projects Checkboxes */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[11.5px] font-bold text-slate-700 flex items-center gap-1.5">
                            <FolderKanban size={13} className="text-slate-500" />
                            <span>Dự Án / Đồ Án Thực Tế ({(internalProfileData?.projects || []).length}):</span>
                          </label>
                          <div className="flex items-center gap-1.5 text-[10.5px]">
                            <button
                              type="button"
                              onClick={() => setSelectedProjectIds((internalProfileData?.projects || []).map(p => p.id))}
                              className="text-blue-600 hover:text-blue-800 font-semibold px-2 py-0.5 rounded hover:bg-blue-100/50"
                            >
                              Chọn tất cả
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              type="button"
                              onClick={() => setSelectedProjectIds([])}
                              className="text-slate-500 hover:text-slate-700 font-semibold px-2 py-0.5 rounded hover:bg-slate-200/50"
                            >
                              Bỏ chọn
                            </button>
                          </div>
                        </div>

                        {(internalProfileData?.projects || []).length === 0 ? (
                          <div className="p-3 bg-white/80 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                            Chưa có dự án trong Hồ Sơ Cá Nhân (Hệ thống sẽ nạp đồ án mẫu tiêu biểu)
                          </div>
                        ) : (
                          <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                            {(internalProfileData?.projects || []).map(proj => {
                              const isChecked = selectedProjectIds.includes(proj.id);
                              return (
                                <label
                                  key={proj.id}
                                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                                    isChecked
                                      ? 'border-blue-500 bg-white shadow-2xs'
                                      : 'border-slate-200 bg-white/60 hover:bg-white text-slate-500'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      setSelectedProjectIds(prev =>
                                        prev.includes(proj.id) ? prev.filter(x => x !== proj.id) : [...prev, proj.id]
                                      );
                                    }}
                                    className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-800 truncate">{proj.title}</span>
                                      {proj.role && (
                                        <span className="text-[10px] text-slate-500 font-medium">{proj.role}</span>
                                      )}
                                    </div>
                                    {proj.tags && proj.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {proj.tags.slice(0, 4).map((t, idx) => (
                                          <span key={idx} className="text-[9.5px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                                            {t}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Sub-group 2: Certificates Checkboxes */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[11.5px] font-bold text-slate-700 flex items-center gap-1.5">
                            <Award size={13} className="text-slate-500" />
                            <span>Chứng Chỉ & Bằng Cấp ({(internalProfileData?.certificates || []).length}):</span>
                          </label>
                          <div className="flex items-center gap-1.5 text-[10.5px]">
                            <button
                              type="button"
                              onClick={() => setSelectedCertIds((internalProfileData?.certificates || []).map(c => c.id))}
                              className="text-blue-600 hover:text-blue-800 font-semibold px-2 py-0.5 rounded hover:bg-blue-100/50"
                            >
                              Chọn tất cả
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              type="button"
                              onClick={() => setSelectedCertIds([])}
                              className="text-slate-500 hover:text-slate-700 font-semibold px-2 py-0.5 rounded hover:bg-slate-200/50"
                            >
                              Bỏ chọn
                            </button>
                          </div>
                        </div>

                        {(internalProfileData?.certificates || []).length === 0 ? (
                          <div className="p-3 bg-white/80 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                            Chưa có chứng chỉ trong Hồ Sơ Cá Nhân
                          </div>
                        ) : (
                          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                            {(internalProfileData?.certificates || []).map(cert => {
                              const isChecked = selectedCertIds.includes(cert.id);
                              return (
                                <label
                                  key={cert.id}
                                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                                    isChecked
                                      ? 'border-blue-500 bg-white shadow-2xs'
                                      : 'border-slate-200 bg-white/60 hover:bg-white text-slate-500'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      setSelectedCertIds(prev =>
                                        prev.includes(cert.id) ? prev.filter(x => x !== cert.id) : [...prev, cert.id]
                                      );
                                    }}
                                    className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-800 truncate">{cert.title}</span>
                                      {cert.issue_date && (
                                        <span className="text-[10px] text-slate-400">{cert.issue_date}</span>
                                      )}
                                    </div>
                                    <div className="text-[10.5px] text-slate-500 mt-0.5">
                                      Đơn vị cấp: <span className="font-semibold">{cert.issuer}</span>
                                    </div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Default Setting Option */}
                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <CheckCircle2 size={14} className="text-blue-600" />
                    4. Trạng Thái Mặc Định Của Bản CV
                  </label>

                  <label
                    onClick={() => setSetAsDefault(!setAsDefault)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                      setAsDefault
                        ? 'border-blue-600 bg-blue-50/40'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={setAsDefault}
                      onChange={(e) => setSetAsDefault(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Tự động đặt làm CV chính (Default CV) ngay lập tức</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">Mặc định</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Bản CV này sẽ được ưu tiên hiển thị trên Dashboard, làm CV mặc định khi ứng tuyển và chia sẻ hồ sơ với Nhà tuyển dụng.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Final Action Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep('choose_flow')}
                    className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition"
                  >
                    Hủy & Quay lại
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleStartManualWriting}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition active:scale-95"
                  >
                    <span>{isSubmitting ? 'Đang Khởi Tạo...' : '🚀 Bắt Đầu Soạn Thảo CV'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded GenerateCvFromJdModal if user picks Option A */}
      {isAiJdModalOpen && (
        <GenerateCvFromJdModal
          isOpen={isAiJdModalOpen}
          onClose={() => setIsAiJdModalOpen(false)}
          onSuccess={() => {
            setIsAiJdModalOpen(false);
            if (onCvCreated) onCvCreated();
            onClose();
          }}
        />
      )}
    </>
  );
}
