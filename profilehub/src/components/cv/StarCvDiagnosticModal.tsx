import { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Brain,
  HelpCircle,
  FileText,
  RotateCcw,
  Zap,
  Layers,
  ChevronRight,
  Check
} from 'lucide-react';
import {
  starDiagnosticService,
  type CvDiagnosticReport,
  type ProjectDiagnosticItem,
  type ElicitationQuestions,
  type AssembledStarResult
} from '../../services/starDiagnosticService';
import type { ProjectItem } from '../../types/cvSection';

interface StarCvDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyProjectBullets: (projectItem: ProjectItem) => void;
}

const COMMON_CHALLENGES = [
  'Dữ liệu lớn cần tối ưu query DB',
  'Cần đồng bộ trạng thái realtime',
  'Xử lý bảo mật JWT & Refresh Token an toàn',
  'Thời gian load trang chậm do bundle lớn',
  'Phân quyền người dùng phức tạp (RBAC)'
];

const COMMON_SOLUTIONS = [
  'Đánh Compound Index B-Tree và viết raw query',
  'Xây dựng store Zustand / Redux đồng bộ LocalStorage',
  'Viết middleware interceptor tự động refresh token',
  'Áp dụng Code-Splitting và React.lazy()',
  'Viết 15+ unit test kiểm thử toàn bộ luồng thanh toán'
];

const COMMON_VERIFICATIONS = [
  'EXPLAIN ANALYZE giảm latency từ 240ms xuống 18ms trên 50k records',
  'Lighthouse Performance tăng từ 58 lên 94 điểm',
  'Vitest test suite đạt 85% coverage với 16 test cases pass 100%',
  'k6 stress-test giả lập 100 virtual users đạt dưới 120ms p95',
  'Thử nghiệm nội bộ với 30 sinh viên, không phát sinh lỗi giao dịch'
];

export default function StarCvDiagnosticModal({
  isOpen,
  onClose,
  onApplyProjectBullets
}: StarCvDiagnosticModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'scan' | 'blank_slate'>('scan');

  // Tab 1: Scan CV State
  const [rawText, setRawText] = useState('');
  const [diagnosticReport, setDiagnosticReport] = useState<CvDiagnosticReport | null>(null);

  // Tab 2: Blank Slate & Guided Elicitation State
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [projectName, setProjectName] = useState('');
  const [techStackInput, setTechStackInput] = useState('React, TypeScript, PostgreSQL');
  const [sitAnswer, setSitAnswer] = useState('');
  const [actAnswer, setActAnswer] = useState('');
  const [resAnswer, setResAnswer] = useState('');
  const [assembledResult, setAssembledResult] = useState<AssembledStarResult | null>(null);

  // Active project for guided interview from scan tab
  const [interviewingProject, setInterviewingProject] = useState<ProjectDiagnosticItem | null>(null);

  const handleRunDiagnostic = () => {
    if (!rawText.trim()) return;
    const report = starDiagnosticService.diagnoseRawCvText(rawText);
    setDiagnosticReport(report);
  };

  const handleStartInterviewForProject = (proj: ProjectDiagnosticItem) => {
    setInterviewingProject(proj);
    setProjectName(proj.projectName);
    setTechStackInput(proj.technologies.join(', '));
    setSitAnswer('');
    setActAnswer(proj.originalLines[0] || '');
    setResAnswer('');
    setActiveTab('blank_slate');
    setStep(1);
  };

  const handleGenerateStarResult = () => {
    const techs = techStackInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const assembled = starDiagnosticService.assembleStarBullet({
      projectName: projectName || 'Dự Án Phần Mềm',
      technologies: techs,
      situationAnswer: sitAnswer,
      actionAnswer: actAnswer,
      resultAnswer: resAnswer
    });

    setAssembledResult(assembled);
    setStep(4);
  };

  const handleApplyToCanvas = () => {
    if (!assembledResult) return;

    const techs = techStackInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newProject: ProjectItem = {
      id: `proj_${Date.now()}`,
      projectName: projectName || 'Dự Án Phần Mềm',
      role: 'Chịu Trách Nhiệm Kỹ Thuật (Tech Lead / Core Dev)',
      startDate: '2024',
      endDate: 'Hiện tại',
      technologies: techs,
      description: assembledResult.starBullet,
      bullets: [
        assembledResult.starBullet,
        `Tối ưu hóa kiến trúc module và hoàn thiện tài liệu kỹ thuật kiểm thử.`,
        `Đảm bảo chuẩn hoá mã nguồn và quy chuẩn kiểm thử tự động.`
      ],
      is_verified: true
    };

    onApplyProjectBullets(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Trợ Lý Soi CV & Khai Thác Dự Án Chuẩn STAR
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Số Liệu Kỹ Thuật Thật
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chẩn đoán câu chữ mơ hồ, đào sâu bằng bộ câu hỏi gợi mở và tổng hợp gạch đầu dòng chuẩn STAR có thể bảo vệ trước Tech Lead
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-4">
          <button
            onClick={() => setActiveTab('scan')}
            className={`py-3 px-2 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'scan'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4" /> Soi & Chẩn Đoán CV Sẵn Có
          </button>
          <button
            onClick={() => setActiveTab('blank_slate')}
            className={`py-3 px-2 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'blank_slate'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4" /> Bắt Đầu Từ Trang Giấy Trắng (STAR Wizard)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'scan' ? (
            <div className="space-y-6">
              {/* Input Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Dán nội dung phần dự án hoặc toàn bộ văn bản CV thô của bạn:
                </label>
                <textarea
                  rows={5}
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  placeholder="Ví dụ:&#10;Dự án 1: Website Bán Hàng E-Commerce&#10;- Tham gia phát triển giao diện bằng React&#10;- Hỗ trợ kết nối cơ sở dữ liệu và API..."
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                />
                <div className="flex justify-between items-center mt-2.5">
                  <span className="text-[11px] text-slate-400">
                    💡 Hệ thống tự động bóc tách từng dự án và soi lỗi thiếu S-T-A-R, từ ngữ bị động hoặc thiếu số liệu.
                  </span>
                  <button
                    onClick={handleRunDiagnostic}
                    disabled={!rawText.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
                  >
                    <Search className="w-4 h-4" /> Bắt Mạch Dự Án
                  </button>
                </div>
              </div>

              {/* Diagnostic Results */}
              {diagnosticReport && (
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {/* Score Card */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Sức Khỏe Kỹ Thuật Dự Án
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Phát hiện {diagnosticReport.totalProjects} đồ án trong văn bản
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                          {diagnosticReport.averageScore} / 100
                        </div>
                        <div className="text-[10px] text-slate-400">STAR Score</div>
                      </div>
                    </div>
                  </div>

                  {/* List of projects diagnosed */}
                  <div className="space-y-3">
                    {diagnosticReport.projects.map((proj, idx) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {proj.projectName}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            {proj.diagnosis.isStarCompliant ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                <CheckCircle2 className="w-3 h-3" /> Đạt chuẩn STAR
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                <AlertTriangle className="w-3 h-3" /> Cần khai thác thêm
                              </span>
                            )}
                            <button
                              onClick={() => handleStartInterviewForProject(proj)}
                              className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-600 dark:text-indigo-300 text-[11px] font-semibold rounded-md transition flex items-center gap-1"
                            >
                              <Zap className="w-3 h-3" /> Khai Thác STAR
                            </button>
                          </div>
                        </div>

                        {/* Weaknesses and Tips */}
                        <div className="space-y-1 text-[11px]">
                          {proj.diagnosis.weaknesses.map((w, wIdx) => (
                            <div key={wIdx} className="text-amber-600 dark:text-amber-400 flex items-start gap-1.5">
                              <span className="shrink-0">•</span>
                              <span>{w}</span>
                            </div>
                          ))}
                        </div>

                        {/* Original Lines */}
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                          {proj.originalLines.join(' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Tab 2: Blank Slate / Guided STAR Interview */
            <div className="space-y-6">
              {/* Stepper Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>1</div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bối Cảnh (S/T)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>2</div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Hành Động (A)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>3</div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Đo Lường (R)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>4</div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Hoàn Thiện</span>
                </div>
              </div>

              {/* Step 1: Project Basic & Situation / Challenge */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Tên Đồ Án / Dự Án:
                      </label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={e => setProjectName(e.target.value)}
                        placeholder="Ví dụ: Hệ Thống Đặt Lịch Khám Bệnh"
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Tech Stack Sử Dụng:
                      </label>
                      <input
                        type="text"
                        value={techStackInput}
                        onChange={e => setTechStackInput(e.target.value)}
                        placeholder="Ví dụ: React, TypeScript, PostgreSQL, Docker"
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      [Situation / Task] Ở dự án này, bài toán hoặc thách thức kỹ thuật lớn nhất bạn gặp phải là gì?
                    </label>
                    <textarea
                      rows={3}
                      value={sitAnswer}
                      onChange={e => setSitAnswer(e.target.value)}
                      placeholder="Gõ ngắn gọn hoặc bấm chọn các gợi ý bên dưới..."
                      className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {COMMON_CHALLENGES.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => setSitAnswer(chip)}
                          className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setStep(2)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      Tiếp Theo: Hành Động (A) <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Action */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      [Action] Bạn trực tiếp code hoặc giải quyết vấn đề đó bằng giải pháp/thư viện nào?
                    </label>
                    <p className="text-[11px] text-slate-500 mb-2">
                      ⚠️ Tránh dùng từ "tham gia", hãy nói rõ bạn tự tay viết phần gì để chứng minh năng lực.
                    </p>
                    <textarea
                      rows={3}
                      value={actAnswer}
                      onChange={e => setActAnswer(e.target.value)}
                      placeholder="Ví dụ: Tự tay xây dựng store Zustand đồng bộ LocalStorage và đánh B-Tree index trên PostgreSQL..."
                      className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {COMMON_SOLUTIONS.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => setActAnswer(chip)}
                          className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setStep(1)}
                      className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Quay Lại
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      Tiếp Theo: Đo Lường & Kết Quả (R) <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Result & Verification */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      [Result] Bạn kiểm chứng hoặc đo lường kết quả code chạy tốt bằng cách nào?
                    </label>
                    <p className="text-[11px] text-slate-500 mb-2">
                      🔒 Số liệu kỹ thuật nội tại (EXPLAIN query, test coverage, Lighthouse) giúp bạn tự tin trả lời khi bị Tech Lead hỏi.
                    </p>
                    <textarea
                      rows={3}
                      value={resAnswer}
                      onChange={e => setResAnswer(e.target.value)}
                      placeholder="Ví dụ: Dùng pgAdmin EXPLAIN ANALYZE giảm latency từ 240ms xuống 18ms trên 50.000 bản ghi..."
                      className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {COMMON_VERIFICATIONS.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => setResAnswer(chip)}
                          className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setStep(2)}
                      className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Quay Lại
                    </button>
                    <button
                      onClick={handleGenerateStarResult}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4" /> Tổng Hợp Chuẩn STAR
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Final Assembled Bullet & Defense Tip */}
              {step === 4 && assembledResult && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Gạch Đầu Dòng STAR Đã Được Tối Ưu:
                    </div>
                    <div className="text-xs font-medium text-slate-900 dark:text-slate-100 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900">
                      • {assembledResult.starBullet}
                    </div>
                  </div>

                  {/* Interview Defense Guide */}
                  <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">
                      <HelpCircle className="w-4 h-4 text-blue-600" /> Bí Kíp Bảo Vệ Trước Tech Lead:
                    </div>
                    <p className="text-xs text-blue-900/90 dark:text-blue-300/90 leading-relaxed">
                      {assembledResult.interviewDefenseTip}
                    </p>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setStep(3)}
                      className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Chỉnh Sửa Thêm
                    </button>
                    <button
                      onClick={handleApplyToCanvas}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Đưa Vào CV Canvas
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
