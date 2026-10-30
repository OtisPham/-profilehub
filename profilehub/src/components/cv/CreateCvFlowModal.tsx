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
import { ElevatedCvPreviewCard } from './ElevatedCvPreviewCard';

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
    name: 'Modern Top-Banner',
    badge: 'TopCV Pro Style',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    desc: 'Khối Header màu đậm trải ngang toàn màn hình trên cùng, Avatar bo tròn, thân chia 2 cột bất đối xứng (35% - 65%).',
    columns: '2-col',
    bestFor: 'Đa ngành nghề, Thực tập sinh, Fresher, Doanh nghiệp lớn',
    defaultFontId: 'inter'
  },
  {
    id: 'minimal',
    name: 'Minimalist Harvard',
    badge: 'Ivy League / 1 Cột',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    desc: '1 cột thuần túy, font Serif, đường kẻ hairline 0.5px tinh tế, căn lề lùi đầu dòng chuẩn mực Ivy League.',
    columns: '1-col',
    bestFor: 'Tài chính, Ngân hàng, Tư vấn, Học thuật',
    defaultFontId: 'lora'
  },
  {
    id: 'tech',
    name: 'Tech Developer Terminal',
    badge: 'Dành Cho IT / Dev',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    desc: 'Khối hiển thị Tech Stack dạng thẻ tag bo góc, hiển thị link GitHub/Commit rõ ràng, chia đồ án Bento Grid.',
    columns: '2-col',
    bestFor: 'Frontend, Backend, AI, Data Engineer, Mobile Dev',
    defaultFontId: 'plus-jakarta'
  },
  {
    id: 'executive',
    name: 'Timeline Milestone',
    badge: 'Trục Thời Gian Dọc',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    desc: 'Trục đường kẻ dọc nối các mốc năm học tập và làm việc bằng các chấm tròn Milestone dots liên tục.',
    columns: '1-col',
    bestFor: 'Nghiên cứu, Giáo dục, Ứng viên có quá trình làm việc liên tục',
    defaultFontId: 'lora'
  },
  {
    id: 'pro_split',
    name: 'Left Solid Sidebar',
    badge: 'Phong Cách Châu Âu',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    desc: 'Cột trái có màu nền đồng nhất từ đầu đến chân trang (xanh Navy/xám chì); cột phải nền trắng tinh tế.',
    columns: '2-col',
    bestFor: 'Marketing, UI/UX, Quản trị kinh doanh, Khối quốc tế',
    defaultFontId: 'be-vietnam-pro'
  },
  {
    id: 'compact_ats',
    name: 'Compact 1-Page ATS',
    badge: 'Tối Ưu Tuyệt Đối 1 Trang',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    desc: 'Tối ưu hóa padding/margin siêu gọn gàng, bố cục 2 cột cân xứng 50-50 ở phần kỹ năng, vừa vặn 3 đồ án.',
    columns: '2-col',
    bestFor: 'Sinh viên mới tốt nghiệp, ứng viên có nhiều dự án muốn ép 1 trang A4',
    defaultFontId: 'be-vietnam-pro'
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
        <div className={`bg-white dark:bg-[#0f1523] rounded-3xl shadow-2xl w-full ${step === 'manual_studio' ? 'max-w-6xl' : 'max-w-4xl'} max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-all duration-300`}>
          
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-[#090d16] dark:via-[#0c101c] dark:to-[#111728] text-white border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                {step === 'choose_flow' ? <Sparkles size={20} /> : <LayoutTemplate size={20} />}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {step === 'choose_flow' ? 'Khởi Tạo Bản CV Mới' : 'Tự Chọn Mẫu & Thiết Lập CV'}
                </h2>
                <p className="text-xs text-slate-300 dark:text-slate-400">
                  {step === 'choose_flow'
                    ? 'Chọn phương thức tạo CV phù hợp với nhu cầu ứng tuyển của bạn'
                    : 'Tùy chỉnh mẫu A4, bảng màu và dữ liệu khởi đầu trước khi bắt đầu soạn thảo'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white dark:bg-[#0f1523]">
            {step === 'choose_flow' ? (
              /* ========================================================
               * SCREEN 1: CHOOSE CREATION FLOW
               * ======================================================== */
              <div className="space-y-6">
                <div className="text-center max-w-xl mx-auto mb-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mb-1">
                    Bạn muốn bắt đầu bản CV này theo cách nào?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ProfileHub hỗ trợ cả 2 chế độ: tự động hóa thông minh bằng AI hoặc hoàn toàn tự do sáng tạo theo phong cách của bạn.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* OPTION A: AI GENERATION FROM JD */}
                  <div
                    onClick={() => setIsAiJdModalOpen(true)}
                    className="group relative p-6 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/60 via-slate-50/40 to-white dark:from-[#111728] dark:via-[#0f1523] dark:to-[#0c101c] hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="absolute top-4 right-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-indigo-600 text-white shadow-xs">
                        ⚡ Khuyên Dùng
                      </span>
                    </div>

                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform">
                        <Sparkles size={24} className="text-amber-300 animate-pulse" />
                      </div>

                      <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5 flex items-center gap-2">
                        AI Tự Động Viết Khớp JD
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        Dán nội dung tuyển dụng (JD). AI Gemini đọc hồ sơ cá nhân của bạn, phân tích từ khóa và <strong>tự động sinh toàn bộ bản CV mục tiêu</strong> chuẩn ATS chỉ trong 5 giây.
                      </p>

                      <div className="space-y-2 text-[11.5px] text-slate-600 dark:text-slate-300 border-t border-indigo-100/80 dark:border-slate-800 pt-3">
                        <div className="flex items-center gap-2 text-indigo-950 dark:text-indigo-300 font-medium">
                          <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span>Tự động tối ưu từ khóa kỹ năng theo đúng JD</span>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-950 dark:text-indigo-300 font-medium">
                          <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span>Gắn nhãn minh chứng đồ án thật từ Profile</span>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-950 dark:text-indigo-300 font-medium">
                          <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span>Popup đọc ngay + xem trước nhanh 1-Click</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-indigo-100/60 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">Phù hợp khi đã có JD công ty</span>
                      <button
                        type="button"
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold rounded-xl shadow-md group-hover:shadow-indigo-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Tạo bằng AI</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* OPTION B: MANUAL STUDIO & TEMPLATE PICKER */}
                  <div
                    onClick={() => setStep('manual_studio')}
                    className="group relative p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111728] hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-900/10 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="absolute top-4 right-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        ✍️ Chủ Động 100%
                      </span>
                    </div>

                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-700 dark:to-slate-800 text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform">
                        <LayoutTemplate size={24} />
                      </div>

                      <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5 flex items-center gap-2">
                        Tự Chọn Mẫu & Tự Viết Tay
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        Duyệt bộ sưu tập 6 mẫu CV chuẩn A4 (Harvard, Tech Specialist, ATS Pro...). Tự do soạn thảo câu chữ theo phong cách riêng mà <strong>không trừ lượt AI credit</strong>.
                      </p>

                      <div className="space-y-2 text-[11.5px] text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                          <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span>Tùy chọn tải sẵn dữ liệu Profile hoặc bắt đầu từ trang trắng</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                          <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span>Tự do đổi phông chữ Tiếng Việt, màu sắc, canh lề A4</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                          <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span>Vẫn có sẵn nút [✏️ Sửa / AI] từng câu khi bạn cần</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">CV Tổng quan / Chưa có JD</span>
                      <button
                        type="button"
                        className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-md group-hover:bg-slate-900 dark:group-hover:bg-slate-600 flex items-center gap-1.5 transition-all cursor-pointer"
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Cột trái (7 cols): Toàn bộ Form Điều Khiển & Tùy Chọn */}
                <div className="lg:col-span-7 space-y-6">
                {/* Back button */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep('choose_flow')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Quay lại chọn phương thức
                  </button>
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-lg">
                    Bước 2: Chọn Mẫu & Thiết Lập
                  </span>
                </div>

                {/* CV Name & Role Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-[#0c101c] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tên Bản CV (Để dễ quản lý)
                    </label>
                    <input
                      type="text"
                      value={cvTitle}
                      onChange={(e) => setCvTitle(e.target.value)}
                      placeholder={`CV ${targetRole || 'Frontend Developer'} 2026`}
                      className="w-full px-3 py-2 bg-white dark:bg-[#111728] border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Vị Trí Mục Tiêu (Target Role)
                    </label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="VD: Frontend ReactJS Developer, Data Analyst..."
                      className="w-full px-3 py-2 bg-white dark:bg-[#111728] border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                {/* Template Showcase Grid */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                      <LayoutTemplate size={14} className="text-indigo-600 dark:text-indigo-400" />
                      1. Chọn Mẫu Giao Diện A4 ({TEMPLATE_SHOWCASE.length} Mẫu)
                    </label>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Có thể đổi mẫu bất cứ lúc nào trong Canvas</span>
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
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-200 dark:ring-indigo-800'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111728] hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                          }`}
                        >
                          <div>
                            {/* Template Wireframe Miniature */}
                            <div className="w-full h-24 bg-slate-100 dark:bg-[#090d16] rounded-xl mb-3 p-2 flex flex-col justify-between border border-slate-200 dark:border-slate-800 overflow-hidden relative">
                              {/* Header mini */}
                              <div
                                className="h-3.5 rounded-sm w-full mb-1 flex items-center justify-between px-1"
                                style={{ backgroundColor: isSelected ? selectedColor : '#1e3a8a' }}
                              >
                                <div className="h-1 bg-white/80 rounded w-1/3"></div>
                                <div className="h-1 bg-white/40 rounded w-1/4"></div>
                              </div>

                              {/* Layout Columns mini */}
                              {tmpl.columns === '2-col' ? (
                                <div className="flex gap-1.5 flex-1">
                                  <div className="w-1/3 bg-slate-200/80 dark:bg-slate-800 rounded p-1 space-y-1">
                                    <div className="h-1 bg-slate-400/60 rounded w-full"></div>
                                    <div className="h-1 bg-slate-300 dark:bg-slate-700 rounded w-4/5"></div>
                                    <div className="h-1 bg-slate-300 dark:bg-slate-700 rounded w-3/5"></div>
                                  </div>
                                  <div className="flex-1 bg-white dark:bg-[#111728] rounded p-1 space-y-1 border border-slate-200/60 dark:border-slate-800">
                                    <div className="h-1.5 bg-slate-400 rounded w-1/2"></div>
                                    <div className="h-1 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
                                    <div className="h-1 bg-slate-300 dark:bg-slate-700 rounded w-5/6"></div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex-1 bg-white dark:bg-[#111728] rounded p-1 space-y-1.5 border border-slate-200/60 dark:border-slate-800">
                                  <div className="h-1.5 bg-slate-400 rounded w-1/3"></div>
                                  <div className="h-1 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
                                  <div className="h-1 bg-slate-300 dark:bg-slate-700 rounded w-4/5"></div>
                                  <div className="h-1 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
                                </div>
                              )}

                              {isSelected && (
                                <div className="absolute inset-0 bg-indigo-600/10 backdrop-blur-[0.5px] flex items-center justify-center">
                                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                                    <Check size={14} strokeWidth={3} />
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Badge & Name */}
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <h5 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-1">
                                {tmpl.name}
                              </h5>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${tmpl.badgeColor} shrink-0`}>
                                {tmpl.badge}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-2 mb-2">
                              {tmpl.desc}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10.5px]">
                            <span className="text-slate-400 dark:text-slate-500">{tmpl.columns === '2-col' ? '2 Cột' : '1 Cột'}</span>
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400 truncate max-w-[130px]">{tmpl.bestFor}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Color Palette Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <Palette size={14} className="text-indigo-600 dark:text-indigo-400" />
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
                          className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-medium transition-all cursor-pointer ${
                            isColorActive
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs ring-1 ring-indigo-300 dark:ring-indigo-700'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111728] hover:bg-slate-50 dark:hover:bg-[#161f36] text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span>{swatch.name}</span>
                          {isColorActive && <Check size={12} className="text-indigo-600 dark:text-indigo-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Starting Data Source Option */}
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <ShieldCheck size={14} className="text-indigo-600 dark:text-indigo-400" />
                    3. Nguồn Dữ Liệu Khởi Đầu
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => setDataSource('from_profile')}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                        dataSource === 'from_profile'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111728] hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="dataSourceOption"
                        checked={dataSource === 'from_profile'}
                        onChange={() => setDataSource('from_profile')}
                        className="mt-1 text-[#1e3a8a] focus:ring-[#1e3a8a]"
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
                          ? 'border-[#1e3a8a] bg-blue-50/50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="dataSourceOption"
                        checked={dataSource === 'blank'}
                        onChange={() => setDataSource('blank')}
                        className="mt-1 text-[#1e3a8a] focus:ring-[#1e3a8a]"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Bắt Đầu Với Bản Mẫu Trống (Blank)
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          Khởi tạo khung sườn mẫu cơ bản, bạn tự do nhập toàn bộ thông tin từ đầu theo ý muốn.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Interactive Checkbox List for Projects & Certificates from Profile */}
                  {dataSource === 'from_profile' && (
                    <div className="mt-3.5 p-4 bg-slate-50 dark:bg-[#0c101c] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <FolderKanban size={16} className="text-indigo-600 dark:text-indigo-400" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Tick Chọn Dự Án & Chứng Chỉ Cần Lấy Qua CV:
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 rounded-full">
                          Đã chọn: {selectedProjectIds.length} dự án • {selectedCertIds.length} chứng chỉ
                        </span>
                      </div>

                      {/* Sub-group 1: Projects Checkboxes */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[11.5px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <FolderKanban size={13} className="text-slate-500 dark:text-slate-400" />
                            <span>Dự Án / Đồ Án Thực Tế ({(internalProfileData?.projects || []).length}):</span>
                          </label>
                          <div className="flex items-center gap-1.5 text-[10.5px]">
                            <button
                              type="button"
                              onClick={() => setSelectedProjectIds((internalProfileData?.projects || []).map(p => p.id))}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold px-2 py-0.5 rounded hover:bg-indigo-50 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              Chọn tất cả
                            </button>
                            <span className="text-slate-300 dark:text-slate-600">|</span>
                            <button
                              type="button"
                              onClick={() => setSelectedProjectIds([])}
                              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold px-2 py-0.5 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              Bỏ chọn
                            </button>
                          </div>
                        </div>

                        {(internalProfileData?.projects || []).length === 0 ? (
                          <div className="p-3 bg-white/80 dark:bg-[#111728] rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
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
                                      ? 'border-indigo-600 bg-white dark:bg-[#111728] shadow-2xs'
                                      : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-[#111728]/60 hover:bg-white dark:hover:bg-[#111728] text-slate-500 dark:text-slate-400'
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
                                    className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{proj.title}</span>
                                      {proj.role && (
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{proj.role}</span>
                                      )}
                                    </div>
                                    {proj.tags && proj.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {proj.tags.slice(0, 4).map((t, idx) => (
                                          <span key={idx} className="text-[9.5px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded border border-slate-200/60 dark:border-slate-700">
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
                          <label className="text-[11.5px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Award size={13} className="text-slate-500 dark:text-slate-400" />
                            <span>Chứng Chỉ & Bằng Cấp ({(internalProfileData?.certificates || []).length}):</span>
                          </label>
                          <div className="flex items-center gap-1.5 text-[10.5px]">
                            <button
                              type="button"
                              onClick={() => setSelectedCertIds((internalProfileData?.certificates || []).map(c => c.id))}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold px-2 py-0.5 rounded hover:bg-indigo-50 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              Chọn tất cả
                            </button>
                            <span className="text-slate-300 dark:text-slate-600">|</span>
                            <button
                              type="button"
                              onClick={() => setSelectedCertIds([])}
                              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold px-2 py-0.5 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              Bỏ chọn
                            </button>
                          </div>
                        </div>

                        {(internalProfileData?.certificates || []).length === 0 ? (
                          <div className="p-3 bg-white/80 dark:bg-[#111728] rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
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
                                      ? 'border-indigo-600 bg-white dark:bg-[#111728] shadow-2xs'
                                      : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-[#111728]/60 hover:bg-white dark:hover:bg-[#111728] text-slate-500 dark:text-slate-400'
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
                                    className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{cert.title}</span>
                                      {cert.issue_date && (
                                        <span className="text-[10px] text-slate-400">{cert.issue_date}</span>
                                      )}
                                    </div>
                                    <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                                      Đơn vị cấp: <span className="font-semibold text-slate-700 dark:text-slate-300">{cert.issuer}</span>
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
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400" />
                    4. Trạng Thái Mặc Định Của Bản CV
                  </label>

                  <label
                    onClick={() => setSetAsDefault(!setAsDefault)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                      setAsDefault
                        ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111728] hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={setAsDefault}
                      onChange={(e) => setSetAsDefault(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Tự động đặt làm CV chính (Default CV) ngay lập tức</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded">Mặc định</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Bản CV này sẽ được ưu tiên hiển thị trên Dashboard, làm CV mặc định khi ứng tuyển và chia sẻ hồ sơ với Nhà tuyển dụng.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Final Action Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep('choose_flow')}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Hủy & Quay lại
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleStartManualWriting}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-900/20 flex items-center gap-2 transition active:scale-95 cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Đang Khởi Tạo...' : '🚀 Bắt Đầu Soạn Thảo CV'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Cột phải (5 cols): Sân Khấu Trưng Bày CV Nổi Bổng 2D (Elevated Stage) */}
              <div className="lg:col-span-5 sticky top-2 hidden lg:flex flex-col items-center">
                <div className="w-full bg-slate-900/95 dark:bg-black/90 p-5 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center relative overflow-hidden">
                  {/* Header bar on Stage */}
                  <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-400" />
                      <span>Sân Khấu Bản In A4 Trực Quan</span>
                    </span>
                    <span className="text-[10px] text-indigo-300 bg-indigo-950/80 border border-indigo-800/80 px-2 py-0.5 rounded-full font-mono">
                      2D Elevated Canvas
                    </span>
                  </div>

                  <ElevatedCvPreviewCard
                    templateName={TEMPLATE_SHOWCASE.find(t => t.id === selectedTemplate)?.name || 'Classic ATS Pro'}
                    primaryColor={selectedColor}
                    candidateName={internalProfileData?.profile?.full_name || 'NGUYỄN VĂN AN'}
                    roleTitle={targetRole || 'Kỹ Sư Phần Mềm'}
                    columns={TEMPLATE_SHOWCASE.find(t => t.id === selectedTemplate)?.columns || '2-col'}
                    verifiedProjectsCount={selectedProjectIds.length || (internalProfileData?.projects || []).length || 2}
                    compact={true}
                  />

                  <div className="mt-3 text-center text-[11px] text-slate-400 leading-relaxed">
                    ✨ Tờ giấy A4 hiển thị theo thời gian thực (60-120 FPS). Mẫu: <span className="font-bold text-white">{TEMPLATE_SHOWCASE.find(t => t.id === selectedTemplate)?.name}</span>
                  </div>
                </div>
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
