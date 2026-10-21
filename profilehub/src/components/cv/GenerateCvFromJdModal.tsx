import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Briefcase, 
  Cpu, 
  Layers, 
  UserCheck, 
  Zap, 
  AlertCircle,
  FileCode2
} from 'lucide-react';
import { cvService, type ManagedCVItem, type StudentProfileData } from '../../services/cvService';
import { useAuth } from '../../context/AuthProvider';
import CvQuickViewModal from './CvQuickViewModal';

interface GenerateCvFromJdModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialJdText?: string;
  initialTargetRole?: string;
  initialCompanyName?: string;
  onSuccess?: (newCv: ManagedCVItem) => void;
}

const SAMPLE_JDS = [
  {
    role: 'Frontend ReactJS / TypeScript Developer',
    company: 'FPT Software / VNG Tech',
    icon: '💻',
    jd: `Vị trí: Frontend React Developer (Junior / Fresher)
Mô tả công việc:
- Phát triển và tối ưu hóa các thành phần giao diện người dùng bằng React, TypeScript và Tailwind CSS.
- Tích hợp RESTful API và xử lý state management với Redux Toolkit / React Query.
- Tối ưu hóa hiệu năng render, đảm bảo Responsive trên đa thiết bị và chuẩn accessibility.
- Tham gia quy trình Agile/Scrum, review code và viết unit test bằng Jest.
Yêu cầu ứng viên:
- Nắm vững kiến trúc React Hooks, TypeScript, HTML5/CSS3.
- Có kinh nghiệm với Git, RESTful API, tối ưu trải nghiệm người dùng (UX).
- Ưu tiên ứng viên có các đồ án thực tế hoàn chỉnh và tư duy giải quyết vấn đề tốt.`
  },
  {
    role: 'Backend Node.js & Cloud Developer',
    company: 'Tiki / Momo Fintech',
    icon: '⚙️',
    jd: `Vị trí: Backend Node.js Engineer (Fresher / Junior)
Mô tả công việc:
- Thiết kế và phát triển RESTful API hiệu năng cao bằng Node.js, Express/NestJS và TypeScript.
- Thiết kế cơ sở dữ liệu quan hệ PostgreSQL / MySQL và tối ưu câu truy vấn.
- Triển khai xác thực người dùng JWT, bảo mật hệ thống và tích hợp Redis cache.
- Sử dụng Docker để đóng gói ứng dụng và làm việc với CI/CD pipeline.
Yêu cầu:
- Thành thạo Node.js, TypeScript, cơ sở dữ liệu quan hệ SQL.
- Hiểu biết về cấu trúc dữ liệu, giải thuật và kiến trúc microservices cơ bản.
- Có dự án thực tế trên GitHub là một lợi thế lớn.`
  },
  {
    role: 'Data Analyst & BI Specialist',
    company: 'Shopee / Viettel Digital',
    icon: '📊',
    jd: `Vị trí: Chuyên viên Phân Tích Dữ Liệu (Data Analyst)
Mô tả:
- Khai thác, làm sạch và xử lý các tập dữ liệu lớn bằng SQL và Python (Pandas, NumPy).
- Xây dựng dashboard trực quan hóa dữ liệu kinh doanh bằng Power BI / Tableau.
- Nhận diện xu hướng và báo cáo phân tích hỗ trợ ra quyết định kinh doanh.
Yêu cầu:
- Thành thạo SQL truy vấn dữ liệu phức tạp.
- Sử dụng tốt Python cho phân tích dữ liệu, tư duy logic định lượng nhạy bén.`
  },
  {
    role: 'UI/UX & Product Designer',
    company: 'VinAI / One Mount Group',
    icon: '🎨',
    jd: `Vị trí: UI/UX Designer
Mô tả công việc:
- Nghiên cứu người dùng, xây dựng User Flow, Wireframe và Prototype tương tác cao bằng Figma.
- Xây dựng và duy trì Design System chuẩn hóa cho ứng dụng web và mobile.
- Phối hợp chặt chẽ với đội ngũ Frontend Developer để kiểm thử tính khả thi của giao diện.
Yêu cầu:
- Sử dụng thành thạo Figma, nắm vững nguyên lý thị giác, Typography và Spacing.
- Có Portfolio đồ án thiết kế hoàn chỉnh.`
  }
];

export default function GenerateCvFromJdModal({
  isOpen,
  onClose,
  initialJdText = '',
  initialTargetRole = '',
  initialCompanyName = '',
  onSuccess
}: GenerateCvFromJdModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jdText, setJdText] = useState(initialJdText);
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [companyName, setCompanyName] = useState(initialCompanyName);

  const [sourceData, setSourceData] = useState<StudentProfileData | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Generation Steps & Progress
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [newlyCreatedCv, setNewlyCreatedCv] = useState<ManagedCVItem | null>(null);
  const [aiNotes, setAiNotes] = useState<any>(null);

  useEffect(() => {
    if (initialJdText) setJdText(initialJdText);
    if (initialTargetRole) setTargetRole(initialTargetRole);
    if (initialCompanyName) setCompanyName(initialCompanyName);
  }, [initialJdText, initialTargetRole, initialCompanyName]);

  useEffect(() => {
    if (isOpen) {
      setNewlyCreatedCv(null);
      setAiNotes(null);
      setError(null);
      setIsGenerating(false);
      setProgressStep(0);
      setIsDataLoading(true);
      cvService.fetchStudentCVSourceData(user?.id).then(data => {
        setSourceData(data);
        setIsDataLoading(false);
      }).catch(() => {
        setIsDataLoading(false);
      });
    }
  }, [isOpen, user?.id]);

  if (!isOpen) return null;

  const handleApplySample = (sample: typeof SAMPLE_JDS[0]) => {
    setJdText(sample.jd);
    setTargetRole(sample.role);
    setCompanyName(sample.company);
  };

  const handleStartGenerate = async () => {
    if (!jdText.trim()) {
      setError('Vui lòng dán hoặc nhập nội dung Mô tả công việc (JD).');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setProgressStep(1);

    try {
      // Step 1: Đọc hiểu JD
      await new Promise(r => setTimeout(r, 600));
      setProgressStep(2);

      // Step 2: Quét hồ sơ gốc
      await new Promise(r => setTimeout(r, 600));
      setProgressStep(3);

      // Step 3: Gọi AI sinh CV
      const result = await cvService.generateTailoredCVFromJD({
        jdText,
        targetRole: targetRole.trim() || undefined,
        companyName: companyName.trim() || undefined,
        userId: user?.id,
        userEmail: user?.email
      });

      setProgressStep(4);
      await new Promise(r => setTimeout(r, 600));

      if (onSuccess) {
        onSuccess(result.cv);
      }

      // Thay vì tự tắt và nhảy trang ngay, mở popup CV vừa tạo để người dùng đọc chi tiết
      setNewlyCreatedCv(result.cv);
      setAiNotes(result.aiNotes);
      setIsGenerating(false);
      setProgressStep(0);
    } catch (err: any) {
      console.error('Error generating tailored CV:', err);
      setError(err?.message || 'Có lỗi xảy ra khi tạo CV bằng AI. Vui lòng thử lại.');
      setIsGenerating(false);
      setProgressStep(0);
    }
  };

  if (newlyCreatedCv) {
    return (
      <CvQuickViewModal
        isOpen={true}
        cv={newlyCreatedCv}
        aiNotes={aiNotes}
        isNewlyCreated={true}
        onClose={() => {
          setNewlyCreatedCv(null);
          onClose();
        }}
        onOpenInBuilder={() => {
          setNewlyCreatedCv(null);
          onClose();
          navigate('/cv-builder');
        }}
      />
    );
  }

  const profile = sourceData?.profile;
  const projectsCount = sourceData?.projects.length || 0;
  const skillsCount = profile?.skills?.length || 0;
  const certsCount = sourceData?.certificates.length || 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  AI Tạo CV Khớp Với JD Tự Động
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  GEMINI ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                AI phân tích yêu cầu công việc & trích xuất dữ liệu Hồ Sơ Cá Nhân để tạo ra bản CV mục tiêu hoàn chỉnh.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Candidate Source Profile Pill */}
        <div className="bg-blue-50/80 dark:bg-slate-800/60 px-5 py-3 border-b border-blue-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              <strong>Hồ Sơ Nguồn:</strong> {profile?.full_name || user?.user_metadata?.full_name || 'Ứng viên'}
              {' '}({profile?.major || 'CNTT'})
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span>⚡ {skillsCount} kỹ năng</span>
            <span>•</span>
            <span>📂 {projectsCount} đồ án thực tế</span>
            <span>•</span>
            <span>📜 {certsCount} chứng chỉ</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Sample Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              💡 Nạp nhanh JD mẫu theo chuyên ngành mong muốn:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_JDS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleApplySample(sample)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800 text-left transition text-xs group"
                >
                  <div className="text-base mb-1">{sample.icon}</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px] line-clamp-1 group-hover:text-blue-600">
                    {sample.role.split('Developer')[0].trim()}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {sample.company}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Role & Company Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Vị trí tuyển dụng mục tiêu (Tùy chọn):
              </label>
              <input
                type="text"
                placeholder="VD: Frontend ReactJS Developer..."
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                disabled={isGenerating}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tên công ty tuyển dụng (Tùy chọn):
              </label>
              <input
                type="text"
                placeholder="VD: FPT Software, Tiki, Viettel..."
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                disabled={isGenerating}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          {/* JD Text Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Nội dung mô tả công việc (Dán JD vào đây) <span className="text-rose-500">*</span>:
              </label>
              <span className="text-[11px] text-slate-400">
                {jdText.length} ký tự
              </span>
            </div>
            <textarea
              rows={7}
              placeholder="Dán toàn bộ văn bản mô tả công việc (JD), bao gồm chức danh, trách nhiệm, công nghệ yêu cầu và quyền lợi..."
              value={jdText}
              onChange={e => setJdText(e.target.value)}
              disabled={isGenerating}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono transition leading-relaxed"
            />
          </div>

          {/* AI Generation Live Progress */}
          {isGenerating && (
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3 animate-in fade-in duration-200 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-2 text-blue-400">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  AI Đang Tự Động Sinh Nội Dung CV...
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {progressStep * 25}%
                </span>
              </div>

              {/* Progress Steps Visualizer */}
              <div className="space-y-2 text-xs">
                <div className={`flex items-center gap-2.5 transition-colors ${progressStep >= 1 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${progressStep >= 1 ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>1. Đọc hiểu JD, nhận diện công nghệ & trách nhiệm cốt lõi</span>
                </div>
                <div className={`flex items-center gap-2.5 transition-colors ${progressStep >= 2 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${progressStep >= 2 ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>2. Quét hồ sơ cá nhân, chọn lọc kỹ năng và đồ án liên quan nhất</span>
                </div>
                <div className={`flex items-center gap-2.5 transition-colors ${progressStep >= 3 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${progressStep >= 3 ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>3. Cá nhân hóa mục tiêu & viết lại bullet points đồ án chuẩn STAR</span>
                </div>
                <div className={`flex items-center gap-2.5 transition-colors ${progressStep >= 4 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${progressStep >= 4 ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>4. Hoàn tất! Đang lưu bản CV và mở CV Builder...</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition disabled:opacity-50"
          >
            Hủy Bỏ
          </button>

          <button
            type="button"
            onClick={handleStartGenerate}
            disabled={isGenerating || !jdText.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Đang Xử Lý & Tạo CV...' : 'Tạo CV Khớp JD Ngay'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

      </div>
    </div>
  );
}
