import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Briefcase, 
  UserCheck, 
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { cvService, type ManagedCVItem, type StudentProfileData } from '../../services/cvService';
import { useAuth } from '../../context/AuthProvider';
import CvQuickViewModal from './CvQuickViewModal';
import SalaryBenchmarkModal from '../student/SalaryBenchmarkModal';
import { extractLevelFromJdOrTitle } from '../../services/salaryBenchmarkService';

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
  const navigate = useNavigate();
  const { user } = useAuth();

  const [jdText, setJdText] = useState(initialJdText);
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [sourceData, setSourceData] = useState<StudentProfileData | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Result modal state
  const [newlyCreatedCv, setNewlyCreatedCv] = useState<ManagedCVItem | null>(null);
  const [aiNotes, setAiNotes] = useState<any>(null);

  // Salary Benchmark Modal state
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);

  // Load student profile & projects on mount
  useEffect(() => {
    if (isOpen && user?.id) {
      cvService.fetchStudentCVSourceData(user.id).then(data => {
        setSourceData(data);
        if (!targetRole && data.profile?.major) {
          setTargetRole(data.profile.major);
        }
      });
    }
  }, [isOpen, user?.id, targetRole]);

  // Sync initial props
  useEffect(() => {
    if (initialJdText) setJdText(initialJdText);
    if (initialTargetRole) setTargetRole(initialTargetRole);
    if (initialCompanyName) setCompanyName(initialCompanyName);
  }, [initialJdText, initialTargetRole, initialCompanyName]);

  if (!isOpen) return null;

  const handleApplySample = (sample: typeof SAMPLE_JDS[0]) => {
    setJdText(sample.jd);
    setTargetRole(sample.role);
    setCompanyName(sample.company.split('/')[0].trim());
    setError(null);
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
      // Step 1: Parsing JD
      await new Promise(r => setTimeout(r, 600));
      setProgressStep(2);

      // Step 2: Scoring & filtering projects
      await new Promise(r => setTimeout(r, 700));
      setProgressStep(3);

      // Step 3: Trigger real AI service
      const currentSource = sourceData || await cvService.fetchStudentCVSourceData(user?.id);
      
      const { cv: createdCv, aiNotes: returnedAiNotes } = await cvService.generateTailoredCVFromJD({
        jdText,
        targetRole: targetRole || undefined,
        companyName: companyName || undefined,
        userId: user?.id,
        userEmail: user?.email
      });

      setProgressStep(4);
      await new Promise(r => setTimeout(r, 500));

      setIsGenerating(false);
      setProgressStep(0);

      // Lưu kết quả và hiển thị QuickView
      setNewlyCreatedCv(createdCv);
      setAiNotes({
        targetRole: targetRole || createdCv.targetRole,
        highlightedProjects: (createdCv.data.sections?.find((s: any) => s.type === 'projects')?.items || []).map((p: any) => p.title || p.projectName),
        tailoringSummary: returnedAiNotes?.tailoringSummary || [
          'Đã tái cấu trúc mục tiêu nghề nghiệp theo sát sứ mệnh của công ty.',
          'Sắp xếp lại thứ tự đồ án dựa trên độ khớp từ khóa công nghệ với JD.',
          'Lọc và làm nổi bật các kỹ năng cứng mà nhà tuyển dụng yêu cầu.'
        ]
      });

      if (onSuccess) {
        onSuccess(createdCv);
      }
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
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#0f1523] rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-[#090d16] dark:via-[#0c101c] dark:to-[#111728] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  AI May Đo CV Khớp Với JD Tự Động
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  GEMINI ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-300 dark:text-slate-400 mt-0.5">
                AI phân tích yêu cầu công việc & trích xuất dữ liệu Hồ Sơ Cá Nhân để tạo ra bản CV mục tiêu hoàn chỉnh.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition disabled:opacity-50 cursor-pointer"
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Candidate Source Profile Pill */}
        <div className="bg-slate-50 dark:bg-[#0c101c] px-5 py-3 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
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
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto bg-white dark:bg-[#0f1523]">
          
          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Sample Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              💡 Nạp nhanh JD mẫu theo chuyên ngành mong muốn:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_JDS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleApplySample(sample)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#111728] hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-[#162038] text-left transition text-xs group cursor-pointer"
                >
                  <div className="text-base mb-1">{sample.icon}</div>
                  <div className="font-bold text-slate-800 dark:text-slate-100 text-[11px] line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {sample.role.split('Developer')[0].trim()}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {sample.company}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Role & Company Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                Vị trí tuyển dụng mục tiêu (Tùy chọn):
              </label>
              <input
                type="text"
                placeholder="VD: Frontend ReactJS Developer..."
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                disabled={isGenerating}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#111728] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                Tên công ty tuyển dụng (Tùy chọn):
              </label>
              <input
                type="text"
                placeholder="VD: FPT Software, Tiki, Viettel..."
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                disabled={isGenerating}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#111728] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* JD Text Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Nội dung mô tả công việc (Dán JD vào đây) <span className="text-rose-500">*</span>:
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSalaryModalOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200 dark:border-emerald-800 transition shadow-xs cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Khảo Sát Lương JD Này</span>
                </button>
                <span className="text-[11px] text-slate-400 dark:text-slate-400">
                  {jdText.length} ký tự
                </span>
              </div>
            </div>
            <textarea
              rows={7}
              placeholder="Dán toàn bộ văn bản mô tả công việc (JD), bao gồm chức danh, trách nhiệm, công nghệ yêu cầu và quyền lợi..."
              value={jdText}
              onChange={e => setJdText(e.target.value)}
              disabled={isGenerating}
              className="w-full p-3.5 bg-slate-50/80 dark:bg-[#090d16] border border-slate-200 dark:border-slate-700/80 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono transition leading-relaxed selection:bg-indigo-500 selection:text-white"
            />
          </div>

          {/* AI Generation Live Progress */}
          {isGenerating && (
            <div className="p-4 bg-gradient-to-r from-indigo-900 to-violet-950 dark:from-[#0b1021] dark:to-[#171e36] text-white rounded-2xl border border-indigo-700/50 dark:border-indigo-500/30 space-y-3 animate-in fade-in duration-200 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-2 text-indigo-200">
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  AI Đang Tự Động Sinh Nội Dung CV...
                </span>
                <span className="text-xs font-mono font-bold text-indigo-200">
                  {progressStep * 25}%
                </span>
              </div>

              {/* Progress Steps Visualizer */}
              <div className="space-y-2 text-xs">
                <div className={`flex items-center gap-2.5 transition-colors ${progressStep >= 1 ? 'text-emerald-300 font-semibold' : 'text-indigo-200/60'}`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${progressStep >= 1 ? 'text-emerald-300' : 'text-indigo-300/40'}`} />
                  <span>1. Đọc hiểu JD, nhận diện công nghệ & trách nhiệm cốt lõi</span>
                </div>
                <div className={`flex items-center gap-2.5 transition-colors ${progressStep >= 2 ? 'text-emerald-300 font-semibold' : 'text-indigo-200/60'}`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${progressStep >= 2 ? 'text-emerald-300' : 'text-indigo-300/40'}`} />
                  <span>2. Quét hồ sơ cá nhân, chọn lọc kỹ năng và đồ án liên quan nhất</span>
                </div>
                <div className={`flex items-center gap-2.5 transition-colors ${progressStep >= 3 ? 'text-emerald-300 font-semibold' : 'text-indigo-200/60'}`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${progressStep >= 3 ? 'text-emerald-300' : 'text-indigo-300/40'}`} />
                  <span>3. Cá nhân hóa mục tiêu & viết lại bullet points đồ án chuẩn STAR</span>
                </div>
                <div className={`flex items-center gap-2.5 transition-colors ${progressStep >= 4 ? 'text-emerald-300 font-semibold' : 'text-indigo-200/60'}`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${progressStep >= 4 ? 'text-emerald-300' : 'text-indigo-300/40'}`} />
                  <span>4. Hoàn tất! Đang lưu bản CV và mở CV Builder...</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#0c101c] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
          >
            Hủy Bỏ
          </button>

          <button
            type="button"
            onClick={handleStartGenerate}
            disabled={isGenerating || !jdText.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isGenerating ? 'Đang Xử Lý & Tạo CV...' : 'Tạo CV Khớp JD Ngay'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

      </div>

      {/* Salary Benchmark Modal */}
      {isSalaryModalOpen && (
        <SalaryBenchmarkModal
          isOpen={isSalaryModalOpen}
          onClose={() => setIsSalaryModalOpen(false)}
          initialRole={targetRole || 'Frontend ReactJS Developer'}
          initialLevel={extractLevelFromJdOrTitle(jdText || targetRole)}
        />
      )}
    </div>
  );
}
