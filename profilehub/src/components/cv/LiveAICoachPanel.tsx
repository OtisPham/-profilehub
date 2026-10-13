import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Wand2,
  RotateCcw,
  Zap,
  Target,
  Lightbulb,
  CheckCheck,
  ChevronDown,
  Check
} from 'lucide-react';
import {
  type AICoachEvaluation,
  type IndustryDomainId,
  getAvailableIndustryDomains,
  INDUSTRY_DOMAINS
} from '../../services/aiCvCoachService';

export interface TargetJdInfo {
  targetRole?: string;
  targetJd?: string;
  coachingTips?: string[];
  gapAnalysis?: Array<{
    skill_or_topic: string;
    importance: string;
    gap_description?: string;
    remediation_roadmap?: {
      suggested_project_title?: string;
      project_objective?: string;
      recommended_tech_stack?: string[];
      target_metrics?: string;
      estimated_effort_weeks?: number;
    };
  }>;
}

interface LiveAICoachPanelProps {
  activeSectionTitle: string;
  evaluation: AICoachEvaluation | null;
  isEvaluating: boolean;
  overallScore: number;
  onAutoFix: (suggestedText: string) => void;
  onOpenFullCoach: () => void;
  onReEvaluateAll: () => void;
  currentDomainId?: IndustryDomainId;
  onSelectDomain?: (domainId: IndustryDomainId) => void;
  targetJdInfo?: TargetJdInfo;
  onReMatch?: () => void;
}

export default function LiveAICoachPanel({
  activeSectionTitle,
  evaluation,
  isEvaluating,
  overallScore = 85,
  onAutoFix,
  onOpenFullCoach,
  onReEvaluateAll,
  currentDomainId,
  onSelectDomain,
  targetJdInfo,
  onReMatch
}: LiveAICoachPanelProps) {
  const [showDomainPicker, setShowDomainPicker] = useState(false);
  const [quickActionSuccess, setQuickActionSuccess] = useState<string | null>(null);
  const [coachTab, setCoachTab] = useState<'section' | 'targetJd'>(targetJdInfo?.targetJd ? 'targetJd' : 'section');

  const availableDomains = getAvailableIndustryDomains();

  const activeDomain = currentDomainId
    ? INDUSTRY_DOMAINS[currentDomainId]
    : evaluation?.detectedDomain
    ? INDUSTRY_DOMAINS[evaluation.detectedDomain.id] || INDUSTRY_DOMAINS.healthcare_nursing
    : INDUSTRY_DOMAINS.healthcare_nursing;

  const handleTriggerQuickFill = (text: string, label: string) => {
    onAutoFix(text);
    setQuickActionSuccess(`Đã áp dụng: ${label}`);
    setTimeout(() => setQuickActionSuccess(null), 2500);
  };

  // Circular progress calculation
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const displayScore = overallScore || 85;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  // Default Medical/General standard checklist items if evaluation criteria isn't ready
  const defaultChecklist = [
    {
      id: 'c1',
      criterion: 'Độ dài chuẩn (2 – 4 câu súc tích)',
      feedback: 'Tóm lược cô đọng năng lực chuyên môn và định hướng hành nghề rõ ràng.',
      passed: true
    },
    {
      id: 'c2',
      criterion: 'Nêu rõ vị trí & định hướng nghề nghiệp',
      feedback: 'Xác định chính xác vị trí ứng tuyển mục tiêu theo chuẩn ngành y dược.',
      passed: true
    },
    {
      id: 'c3',
      criterion: 'Đầy đủ từ khóa chuyên môn y dược',
      feedback: 'Chứa các từ khóa chuẩn ATS: Dược lâm sàng, GPP, tư vấn điều trị an toàn.',
      passed: true
    },
    {
      id: 'c4',
      criterion: 'Có số liệu minh chứng định lượng',
      feedback: 'Định lượng số ca tư vấn, giờ thực hành lâm sàng và tỷ lệ an toàn.',
      passed: true
    }
  ];

  const checklistItems = evaluation?.criteriaChecklist && evaluation.criteriaChecklist.length > 0
    ? evaluation.criteriaChecklist
    : defaultChecklist;

  const passedCount = checklistItems.filter(c => c.passed).length;
  const totalCount = checklistItems.length;

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden select-none font-sans text-slate-900 dark:text-slate-100">
      
      {/* 1. Header Sidebar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                AI ATS Copilot
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Trợ lý chấm điểm tự động
            </p>
          </div>
        </div>

        <button
          onClick={onOpenFullCoach}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-all"
        >
          Studio 4 bước
        </button>
      </div>

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        
        {/* Tab Switcher if Target JD is available */}
        {targetJdInfo?.targetJd && (
          <div className="flex bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setCoachTab('section')}
              className={`flex-1 py-1 text-center text-xs font-bold rounded-lg transition-all ${
                coachTab === 'section'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Mục Đang Sửa
            </button>
            <button
              onClick={() => setCoachTab('targetJd')}
              className={`flex-1 py-1 text-center text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                coachTab === 'targetJd'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>Đối Chiếu JD</span>
              {targetJdInfo.gapAnalysis && targetJdInfo.gapAnalysis.length > 0 && (
                <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                  {targetJdInfo.gapAnalysis.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* 2. Card 1 - Chuẩn Ngành Tuyển Dụng */}
        <div className="relative">
          <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                  Chuẩn Ngành Tuyển Dụng
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                  <span>{activeDomain.icon}</span>
                  <span className="truncate">{activeDomain.name.split('(')[0].trim()}</span>
                </div>
              </div>

              {onSelectDomain && (
                <button
                  onClick={() => setShowDomainPicker(!showDomainPicker)}
                  className="px-3 py-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl border border-indigo-200 dark:border-indigo-800/80 transition-colors shrink-0 flex items-center gap-1 shadow-2xs"
                >
                  Đổi Ngành
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>
              )}
            </div>
          </div>

          {/* Domain Picker Dropdown */}
          {showDomainPicker && onSelectDomain && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-30 max-h-60 overflow-y-auto animate-in fade-in duration-100">
              <div className="text-[10px] font-bold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                Chọn chuẩn ngành:
              </div>
              {availableDomains.map(d => (
                <button
                  key={d.id}
                  onClick={() => {
                    onSelectDomain(d.id);
                    setShowDomainPicker(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
                    activeDomain.id === d.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate text-left">
                    <span>{d.icon}</span>
                    <span className="font-semibold truncate">{d.name.split('(')[0].trim()}</span>
                  </span>
                  {activeDomain.id === d.id && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Card 2 - Điểm Tiêu Chuẩn ATS (With Circular Progress Bar) */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Điểm Tiêu Chuẩn ATS
              </div>
              <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                {displayScore}<span className="text-sm font-normal text-slate-400">/100</span>
              </div>
            </div>

            {/* Circular Progress Bar Indicator */}
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 52 52">
                <circle
                  cx="26"
                  cy="26"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-slate-100 dark:text-slate-700"
                />
                <circle
                  cx="26"
                  cy="26"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="4.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="text-emerald-500 transition-all duration-700 ease-out"
                />
              </svg>
              <span className="absolute text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">
                {displayScore}%
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <span className={`font-semibold flex items-center gap-1.5 transition-colors ${
              displayScore >= 80 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : displayScore >= 65 
                ? 'text-amber-600 dark:text-amber-400' 
                : 'text-rose-600 dark:text-rose-400'
            }`}>
              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${
                displayScore >= 80 ? 'text-emerald-500' : displayScore >= 65 ? 'text-amber-500' : 'text-rose-500'
              }`} />
              <span className="text-left">
                {displayScore >= 80 ? 'Đạt chuẩn ATS & Minh chứng' : displayScore >= 65 ? 'Khá chuẩn ATS (Cần STAR)' : 'Cần tối ưu thêm ATS'}
              </span>
            </span>
            <button
              onClick={onReEvaluateAll}
              disabled={isEvaluating}
              title={isEvaluating ? 'Đang phân tích & chấm lại...' : 'Chấm lại toàn bộ điểm ATS'}
              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 p-1.5 rounded-lg transition-all active:scale-90 disabled:opacity-50 flex items-center gap-1"
            >
              <RotateCcw className={`w-3.5 h-3.5 transition-all ${isEvaluating ? 'animate-spin text-indigo-600 dark:text-indigo-400' : 'hover:-rotate-45'}`} />
            </button>
          </div>
        </div>

        {/* 4. CỤM NÚT CÔNG CỤ AI (Nạp Mẫu Ngành & Gợi Ý STAR) */}
        <div>
          {quickActionSuccess && (
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mb-1.5 animate-in fade-in">
              <CheckCheck className="w-3 h-3" /> {quickActionSuccess}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (activeSectionTitle.toLowerCase().includes('mục tiêu') || activeSectionTitle.toLowerCase().includes('tóm tắt')) {
                  handleTriggerQuickFill(activeDomain.sampleObjective, 'Mục tiêu mẫu');
                } else if (activeSectionTitle.toLowerCase().includes('kỹ năng')) {
                  handleTriggerQuickFill(activeDomain.sampleSkills, 'Kỹ năng mẫu');
                } else {
                  handleTriggerQuickFill(activeDomain.sampleProject, 'Dự án mẫu');
                }
              }}
              className="py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-2xs text-left"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Nạp Mẫu Ngành</span>
            </button>

            <button
              onClick={() => {
                if (evaluation?.suggestedImprovement) {
                  handleTriggerQuickFill(evaluation.suggestedImprovement, 'Câu STAR chuẩn');
                } else {
                  handleTriggerQuickFill(activeDomain.sampleProject, 'Câu STAR mẫu');
                }
              }}
              className="py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-2xs text-left"
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>Gợi Ý STAR</span>
            </button>
          </div>
        </div>

        {/* 5. Card 3 - Barem Tiêu Chuẩn Ngành */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Barem Tiêu Chuẩn {activeDomain.shortName}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              {passedCount}/{totalCount} Đạt
            </span>
          </div>

          <div className="space-y-2.5">
            {checklistItems.map((item, idx) => (
              <div key={item.id || idx} className="flex items-start gap-2.5 text-xs text-left">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 dark:text-white text-[11.5px] leading-snug">
                    {item.criterion}
                  </div>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed text-left">
                    {item.feedback}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. Sticky Bottom Button: AI Chẩn Đoán 4 Bước */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <button
          onClick={onOpenFullCoach}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>AI Chẩn Đoán 4 Bước</span>
        </button>
      </div>

    </div>
  );
}
