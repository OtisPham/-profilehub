import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Check,
  RefreshCw,
  Award,
  FileCheck,
  HelpCircle,
  FolderKanban,
  Shield,
  Plus,
  TrendingUp,
  Layers,
  Eye,
  Sliders,
  CheckCircle,
  Mail,
  Phone,
  Globe,
  Zap,
  Target,
  User,
  Copy,
  ChevronDown,
  ChevronRight,
  FileText,
  BarChart3,
  Flame,
  CheckCheck,
  CheckSquare2,
  Wand2,
  Compass
} from 'lucide-react';
import {
  getStepGuidance,
  evaluateCvSection,
  getAvailableIndustryDomains,
  detectIndustryDomain,
  INDUSTRY_DOMAINS,
  type CVCoachSection,
  type AICoachEvaluation,
  type IndustryDomainId,
  type IndustryDomainConfig
} from '../../services/aiCvCoachService';
import type { Project } from '../../types/database';

interface AiCvCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToCv: (data: {
    summary: string;
    projectDescription?: string;
    allProjectDescriptions?: Record<string, string>;
    skills?: string[];
    contactInfo?: string;
    selectedProjectId?: string;
  }) => void;
  projects?: Project[];
  initialData?: {
    summary?: string;
    skills?: string[];
    jobTarget?: string;
    studentName?: string;
    university?: string;
    email?: string;
    phone?: string;
  };
}

const SECTIONS: CVCoachSection[] = ['summary', 'project', 'skills', 'contact'];

const STEP_ICONS: Record<CVCoachSection, React.ReactNode> = {
  summary: <Target className="w-4 h-4" />,
  project: <FolderKanban className="w-4 h-4" />,
  skills: <Layers className="w-4 h-4" />,
  contact: <User className="w-4 h-4" />
};

const STEP_LABELS: Record<CVCoachSection, { short: string; full: string; badge: string; desc: string }> = {
  summary: { short: '1. Mục Tiêu', full: 'Mục Tiêu & Tóm Tắt Nghề Nghiệp', badge: 'Chuẩn ATS', desc: 'Định lượng năng lực và định hướng 2-4 câu' },
  project: { short: '2. Đồ Án & Kinh Nghiệm', full: 'Đồ Án & Kinh Nghiệm Thực Tế', badge: 'STAR & Minh Chứng', desc: 'Cấu trúc Situation - Task - Action - Result' },
  skills: { short: '3. Kỹ Năng Trọng Tâm', full: 'Kỹ Năng & Công Nghệ Cốt Lõi', badge: 'Đúng Barem Ngành', desc: 'Từ khóa chuyên môn khớp mô tả công việc' },
  contact: { short: '4. Liên Hệ & Bằng Chứng', full: 'Thông Tin Liên Hệ & Bằng Chứng Số', badge: 'Xác Thực 100%', desc: 'Email, SĐT, Portfolio & Link chứng chỉ' }
};

export default function AiCvCoachModal({
  isOpen,
  onClose,
  onApplyToCv,
  projects = [],
  initialData
}: AiCvCoachModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projectDescriptionsMap, setProjectDescriptionsMap] = useState<Record<string, string>>({});
  const [viewTab, setViewTab] = useState<'coach' | 'diff' | 'preview'>('coach');

  // Industry Domain selection
  const availableDomains = getAvailableIndustryDomains();
  const initialDomain = detectIndustryDomain(initialData?.jobTarget || initialData?.summary);
  const [selectedDomainId, setSelectedDomainId] = useState<IndustryDomainId>(initialDomain.id);
  const [showDomainDropdown, setShowDomainDropdown] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeDomain: IndustryDomainConfig = INDUSTRY_DOMAINS[selectedDomainId] || initialDomain;

  // Form states per step
  const [contentMap, setContentMap] = useState<Record<CVCoachSection, string>>({
    summary: initialData?.summary || '',
    project: '',
    skills: initialData?.skills?.join(', ') || '',
    contact: initialData?.email
      ? `${initialData?.studentName || 'Sinh Viên'} | ${initialData?.jobTarget || activeDomain.name}\nEmail: ${initialData?.email} | SĐT: ${initialData?.phone || '0901234567'}\nLinkedIn: linkedin.com/in/profile | Địa chỉ: TP. Hồ Chí Minh`
      : ''
  });

  // Evaluation results per step
  const [evalMap, setEvalMap] = useState<Record<CVCoachSection, AICoachEvaluation | null>>({
    summary: null,
    project: null,
    skills: null,
    contact: null
  });

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const currentSection = SECTIONS[currentStepIndex];
  const guidance = getStepGuidance(currentSection, selectedDomainId);
  const currentContent = contentMap[currentSection];
  const currentEval = evalMap[currentSection];

  // Sync initial data if provided
  useEffect(() => {
    if (initialData?.summary && !contentMap.summary) {
      setContentMap(prev => ({ ...prev, summary: initialData.summary || '' }));
    }
    if (initialData?.skills && !contentMap.skills) {
      setContentMap(prev => ({ ...prev, skills: initialData.skills?.join(', ') || '' }));
    }
    if (initialData?.jobTarget) {
      const detected = detectIndustryDomain(initialData.jobTarget);
      setSelectedDomainId(detected.id);
    }
  }, [initialData]);

  // Initialize project descriptions map for all available projects
  useEffect(() => {
    if (projects.length > 0) {
      const initialMap: Record<string, string> = {};
      projects.forEach(p => {
        initialMap[p.id] = p.description
          ? `${p.title}: ${p.description}`
          : `${p.title} — (Tech Stack: ${p.tags?.join(', ') || 'N/A'})`;
      });
      setProjectDescriptionsMap(prev => ({ ...initialMap, ...prev }));

      if (!selectedProjectId) {
        const first = projects[0];
        setSelectedProjectId(first.id);
        const text = initialMap[first.id] || `${first.title}: ${first.description || ''}`;
        setContentMap(prev => ({ ...prev, project: text }));
      }
    }
  }, [projects]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSelectDomain = (domainId: IndustryDomainId) => {
    setSelectedDomainId(domainId);
    setShowDomainDropdown(false);
    setEvalMap(prev => ({
      ...prev,
      [currentSection]: null
    }));
  };

  const handleSelectProject = (proj: Project) => {
    if (selectedProjectId && contentMap.project) {
      setProjectDescriptionsMap(prev => ({ ...prev, [selectedProjectId]: contentMap.project }));
    }

    setSelectedProjectId(proj.id);
    const existing = projectDescriptionsMap[proj.id];
    const text = existing !== undefined
      ? existing
      : (proj.description ? `${proj.title}: ${proj.description}` : `${proj.title} — (Tech Stack: ${proj.tags?.join(', ') || 'N/A'})`);

    setProjectDescriptionsMap(prev => ({ ...prev, [proj.id]: text }));
    setContentMap(prev => ({ ...prev, project: text }));
    setEvalMap(prev => ({ ...prev, project: null }));
  };

  const handleContentChange = (val: string) => {
    setContentMap(prev => ({ ...prev, [currentSection]: val }));
    if (currentSection === 'project' && selectedProjectId) {
      setProjectDescriptionsMap(prev => ({ ...prev, [selectedProjectId]: val }));
    }
  };

  const handleAddSkillTag = (skillName: string) => {
    const current = contentMap.skills.trim();
    if (!current) {
      handleContentChange(skillName);
      return;
    }
    if (!current.toLowerCase().includes(skillName.toLowerCase())) {
      handleContentChange(`${current}, ${skillName}`);
    }
  };

  const handlePopulateIndustryTemplate = () => {
    if (currentSection === 'summary') {
      handleApplySuggestion(activeDomain.sampleObjective);
    } else if (currentSection === 'project') {
      handleApplySuggestion(activeDomain.sampleProject);
    } else if (currentSection === 'skills') {
      handleApplySuggestion(activeDomain.sampleSkills);
    } else if (currentSection === 'contact') {
      handleApplySuggestion(guidance.sampleGood);
    }
  };

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      const result = evaluateCvSection(currentSection, currentContent, {
        jobTarget: initialData?.jobTarget,
        domainId: selectedDomainId
      });
      setEvalMap(prev => ({ ...prev, [currentSection]: result }));
      setIsEvaluating(false);
    }, 450);
  };

  const handleAutoFix = () => {
    const suggested = currentEval?.suggestedImprovement || guidance.sampleGood;
    handleApplySuggestion(suggested);
  };

  const handleNextStep = () => {
    if (currentStepIndex < SECTIONS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setShowTips(false);
    } else {
      handleFinish();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setShowTips(false);
    }
  };

  const handleApplySuggestion = (suggestion: string) => {
    handleContentChange(suggestion);
    const result = evaluateCvSection(currentSection, suggestion, {
      jobTarget: initialData?.jobTarget,
      domainId: selectedDomainId
    });
    setEvalMap(prev => ({ ...prev, [currentSection]: result }));
  };

  const handleFinish = () => {
    const finalProjectMap = {
      ...projectDescriptionsMap,
      ...(selectedProjectId ? { [selectedProjectId]: contentMap.project } : {})
    };

    onApplyToCv({
      summary: contentMap.summary,
      projectDescription: contentMap.project,
      allProjectDescriptions: finalProjectMap,
      skills: contentMap.skills.split(',').map(s => s.trim()).filter(Boolean),
      contactInfo: contentMap.contact,
      selectedProjectId
    });
    onClose();
  };

  // Overall Score Calculation
  const evaluatedCount = Object.values(evalMap).filter(Boolean).length;
  const totalScore = Object.values(evalMap).reduce((acc, curr) => acc + (curr?.score || 0), 0);
  const averageScore = evaluatedCount > 0 ? Math.round(totalScore / evaluatedCount) : 85;
  const selectedProjObj = projects.find(p => p.id === selectedProjectId);

  // Circular gauge calculations
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const activeSectionScore = currentEval?.score || (currentContent.trim().length > 30 ? 80 : 45);
  const activeStrokeOffset = circumference - (activeSectionScore / 100) * circumference;

  const passedCriteriaCount = currentEval?.criteriaChecklist.filter(c => c.passed).length || 0;
  const totalCriteriaCount = currentEval?.criteriaChecklist.length || 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/30 backdrop-blur-sm p-2 sm:p-4 md:p-6 overflow-y-auto font-sans antialiased text-slate-800 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl shadow-blue-900/10 border border-blue-100 flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* Top Header Bar: Pro White & Blue Studio Aesthetic */}
        <div className="relative px-5 py-3 border-b border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-white backdrop-blur-sm pr-14 md:pr-16">
          {/* Left: Brand / Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/25 shrink-0">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black tracking-tight text-blue-950 truncate">
                AI CV Diagnostic & Optimization Studio
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-bold border border-emerald-200 shrink-0">
                ATS v4.2 Live
              </span>
            </div>
          </div>

          {/* Center: Domain Selector & View Switcher (Chẩn Đoán | So Sánh | Bản In) */}
          <div className="flex-1 flex items-center justify-center gap-2.5 flex-wrap">
            {/* Domain Selector Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDomainDropdown(!showDomainDropdown)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200 shadow-2xs transition-all active:scale-95 shrink-0"
              >
                <span>{activeDomain.icon}</span>
                <span className="font-bold truncate max-w-[130px]">{activeDomain.shortName}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 text-blue-600 shrink-0" />
              </button>

              {showDomainDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDomainDropdown(false)}
                  />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-72 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-blue-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[10px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                      Chọn chuẩn ngành đối chiếu:
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {availableDomains.map(d => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => handleSelectDomain(d.id)}
                          className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
                            selectedDomainId === d.id
                              ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                              : 'text-slate-700 hover:bg-blue-50/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base shrink-0">{d.icon}</span>
                            <div className="truncate">
                              <div className="font-bold truncate">{d.shortName}</div>
                              <div className="text-[10px] text-slate-400 truncate">{d.description}</div>
                            </div>
                          </div>
                          {selectedDomainId === d.id && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Tab View Switcher */}
            <div className="flex bg-blue-50/80 p-1 rounded-xl border border-blue-100 shrink-0">
              <button
                type="button"
                onClick={() => setViewTab('coach')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewTab === 'coach'
                    ? 'bg-white text-blue-700 shadow-2xs font-black border border-blue-100'
                    : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Chẩn Đoán
              </button>
              <button
                type="button"
                onClick={() => setViewTab('diff')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewTab === 'diff'
                    ? 'bg-white text-blue-700 shadow-2xs font-black border border-blue-100'
                    : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                So Sánh Diff
              </button>
              <button
                type="button"
                onClick={() => setViewTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewTab === 'preview'
                    ? 'bg-white text-blue-700 shadow-2xs font-black border border-blue-100'
                    : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Bản In A4
              </button>
            </div>
          </div>

          {/* Dedicated Absolute Top-Right Corner Close Button */}
          <button
            onClick={onClose}
            aria-label="Đóng Studio"
            title="Đóng cửa sổ"
            className="absolute top-3 right-4 w-9 h-9 flex items-center justify-center text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-full transition-all active:scale-95 shadow-2xs cursor-pointer z-10"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Stepper Navigation Strip */}
        {viewTab === 'coach' && (
          <div className="px-6 py-3 bg-blue-50/40 border-b border-blue-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
              {SECTIONS.map((sec, idx) => {
                const isCurrent = idx === currentStepIndex;
                const isPassed = evalMap[sec]?.status === 'pass';
                const hasScore = evalMap[sec]?.score !== undefined;
                const label = STEP_LABELS[sec];
                return (
                  <button
                    key={sec}
                    onClick={() => {
                      setCurrentStepIndex(idx);
                      setShowTips(false);
                    }}
                    className={`flex items-center justify-between py-2 px-3 rounded-2xl text-xs transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20 border border-blue-600'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                        : 'bg-white text-slate-700 border border-blue-100 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isCurrent
                          ? 'bg-white/25 text-white'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isPassed ? <Check className="w-3 h-3" /> : idx + 1}
                      </span>
                      <span className="truncate flex items-center gap-1.5 font-bold">
                        {STEP_ICONS[sec]}
                        <span>{label.short}</span>
                      </span>
                    </div>

                    {evalMap[sec] && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isCurrent
                          ? 'bg-white/20 text-white'
                          : isPassed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isPassed ? 'Đạt' : 'Cần sửa'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePopulateIndustryTemplate}
                className="text-xs flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold border border-blue-200 transition-all active:scale-[0.98]"
                title={`Nạp tự động mẫu chuẩn ngành ${activeDomain.shortName}`}
              >
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                Nạp Chuẩn {activeDomain.shortName}
              </button>

              <button
                onClick={() => setShowTips(!showTips)}
                className="text-xs flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-slate-700 hover:bg-blue-50 rounded-xl border border-blue-200 font-semibold transition-colors shrink-0 shadow-2xs"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                {showTips ? 'Ẩn so sánh' : 'Xem mẫu Đạt / Tránh'}
              </button>

              <button
                onClick={handleFinish}
                className="text-xs flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98]"
              >
                <Check className="w-3.5 h-3.5" />
                Áp Dụng Vào CV
              </button>
            </div>
          </div>
        )}

        {/* Modal Main Content Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#f8faff]">
          
          {/* TAB 1: 4-STEP COACH STUDIO */}
          {viewTab === 'coach' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Context, Verified Evidence Selector & Editor */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* Step Banner with Crisp Guidance */}
                <div className="bg-white border border-blue-100 rounded-3xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-blue-950 text-sm flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      {guidance.title}
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      {STEP_LABELS[currentSection].badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3.5 font-medium">
                    {guidance.subtitle}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {guidance.instructions.map((inst, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-blue-50/40 p-2.5 rounded-xl border border-blue-100/70">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                        <span className="leading-snug">{inst}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 2 Special: Verified Project Selector */}
                {currentSection === 'project' && projects.length > 0 && (
                  <div className="p-4 bg-white rounded-3xl border border-blue-100 shadow-xs">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                        <FolderKanban className="w-4 h-4 text-blue-600" />
                        Đồ án trong hồ sơ ({projects.length} đồ án):
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">Chọn để nạp nội dung & minh chứng</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {projects.map((proj) => {
                        const isSelected = selectedProjectId === proj.id;
                        return (
                          <button
                            key={proj.id}
                            onClick={() => handleSelectProject(proj)}
                            className={`px-3.5 py-2 rounded-xl text-xs whitespace-nowrap flex items-center gap-2 transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white font-bold shadow-xs'
                                : 'bg-blue-50/40 text-slate-700 border border-blue-100 hover:bg-blue-50'
                            }`}
                          >
                            {proj.is_verified && <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                            <span className="max-w-[160px] truncate font-medium">{proj.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 3 Special: In-Demand Industry Skills Pills */}
                {currentSection === 'skills' && (
                  <div className="p-4 bg-white rounded-3xl border border-blue-100 shadow-xs">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-blue-600" />
                        Từ khóa kỹ năng trọng tâm ngành {activeDomain.shortName}:
                      </span>
                      <button
                        onClick={() => handleApplySuggestion(activeDomain.sampleSkills)}
                        className="text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        Nạp phân nhóm đầy đủ ⚡
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDomain.coreSkills.map((sk) => (
                        <button
                          key={sk}
                          onClick={() => handleAddSkillTag(sk)}
                          className="px-3 py-1 bg-blue-50/50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-medium flex items-center gap-1 transition-all active:scale-95 shadow-2xs"
                        >
                          <Plus className="w-3 h-3 text-blue-600" />
                          {sk}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expandable Good/Bad Comparison Cards */}
                {showTips && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-white rounded-3xl border border-blue-100 animate-in fade-in duration-200">
                    <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mẫu Đạt Chuẩn Tuyển Dụng:
                        </span>
                        <button
                          onClick={() => handleApplySuggestion(guidance.sampleGood)}
                          className="text-[10.5px] text-emerald-700 hover:underline font-bold"
                        >
                          Áp dụng ✍️
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 italic whitespace-pre-line leading-relaxed">
                        "{guidance.sampleGood}"
                      </p>
                    </div>

                    <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-2xl">
                      <span className="text-xs font-bold text-rose-900 flex items-center gap-1 mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Mẫu Chưa Đạt (Cần Tránh):
                      </span>
                      <p className="text-xs text-slate-700 italic whitespace-pre-line leading-relaxed">
                        "{guidance.sampleBad}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Text Editor Area */}
                <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-blue-950">
                      Nội dung bạn soạn thảo:
                    </label>
                    <span className="text-[11px] font-mono font-medium text-slate-400">
                      {currentContent.trim() ? `${currentContent.trim().split(/\s+/).length} từ` : '0 từ'}
                    </span>
                  </div>

                  <textarea
                    value={currentContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder={`Nhập hoặc dán nội dung cho ${guidance.title.toLowerCase()}...`}
                    rows={6}
                    className="w-full p-4 text-xs font-sans text-slate-800 bg-blue-50/30 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none resize-none leading-relaxed transition-all"
                  />

                  {/* Actions under textarea */}
                  <div className="flex items-center justify-between mt-3.5 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleApplySuggestion(guidance.sampleGood)}
                        className="text-xs text-slate-600 hover:text-blue-700 flex items-center gap-1 font-semibold transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        Điền câu mẫu
                      </button>

                      {currentEval && currentEval.status !== 'pass' && (
                        <button
                          onClick={handleAutoFix}
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-bold transition-colors"
                        >
                          <Zap className="w-3.5 h-3.5 text-blue-600" />
                          Tự động sửa lỗi (Auto-Fix)
                        </button>
                      )}
                    </div>

                    <button
                      onClick={handleEvaluate}
                      disabled={isEvaluating || !currentContent.trim()}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      {isEvaluating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          AI Đang phân tích...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Chẩn Đoán Chuẩn {activeDomain.shortName}
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: AI Diagnostic Matrix & Actionable Feedback */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-blue-100 shadow-xs flex flex-col justify-between">
                
                {currentEval ? (
                  <div className="space-y-4">
                    
                    {/* Score Card Header with Circular Progress Ring */}
                    {/* Criteria Status Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-blue-100">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Tiêu Chuẩn Đánh Giá:
                          </span>
                          <span className="text-[10px] font-bold text-blue-700">
                            {activeDomain.shortName}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-xl font-bold tracking-tight ${
                            currentEval.status === 'pass' ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {passedCriteriaCount}/{totalCriteriaCount} tiêu chí đạt
                          </span>

                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            currentEval.status === 'pass'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {currentEval.status === 'pass' ? 'Đạt chuẩn tuyển dụng' : 'Cần tối ưu thêm'}
                          </span>
                        </div>
                      </div>

                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                        currentEval.status === 'pass'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : 'bg-amber-50 border-amber-200 text-amber-600'
                      }`}>
                        <Award className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Concise Summary Feedback */}
                    <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100/70">
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {currentEval.conciseFeedback}
                      </p>
                    </div>

                    {/* Criteria Checklist with Clean Badges */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                          Tiêu chí đánh giá chi tiết:
                        </h5>
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          {passedCriteriaCount}/{totalCriteriaCount} Đạt
                        </span>
                      </div>

                      <div className="space-y-2 max-h-52 overflow-y-auto pr-0.5">
                        {currentEval.criteriaChecklist.map((c) => (
                          <div
                            key={c.id}
                            className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 transition-all ${
                              c.passed
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                                : 'bg-rose-50/70 border-rose-200 text-rose-950'
                            }`}
                          >
                            {c.passed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-[11.5px] leading-snug">{c.criterion}</div>
                              <div className="text-[11px] opacity-85 mt-0.5 leading-normal">{c.feedback}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* STAR Suggestion Highlight Box */}
                    {currentEval.suggestedImprovement && (
                      <div className="p-4 bg-blue-50/90 border border-blue-200 rounded-2xl">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-blue-950 flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-blue-600" />
                            Đề xuất tối ưu STAR theo ngành:
                          </span>
                          <button
                            onClick={() => handleApplySuggestion(currentEval.suggestedImprovement!)}
                            className="text-[11px] text-blue-700 font-bold hover:underline"
                          >
                            Áp dụng ngay ⚡
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 italic leading-relaxed">
                          "{currentEval.suggestedImprovement}"
                        </p>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 min-h-[240px]">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
                      <Sparkles className="w-7 h-7 text-blue-500" />
                    </div>
                    <h5 className="text-xs font-bold text-blue-950 mb-1">
                      Chưa có kết quả chẩn đoán
                    </h5>
                    <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                      Soạn thảo nội dung ở bên trái rồi nhấn <span className="font-bold text-blue-900">"Chẩn Đoán Chuẩn {activeDomain.shortName}"</span> để kiểm tra.
                    </p>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 2: SIDE-BY-SIDE DIFF INSPECTOR */}
          {viewTab === 'diff' && (
            <div className="space-y-6">
              <div className="p-4.5 bg-white rounded-3xl border border-blue-100 flex items-center justify-between shadow-xs">
                <div>
                  <h4 className="text-sm font-bold text-blue-950">
                    So Sánh Trực Quan Trước & Sau Khi AI Tối Ưu
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Đối chiếu bản gốc của bạn với phiên bản đã được tinh chỉnh theo tiêu chuẩn STAR & ATS của ngành {activeDomain.name}.
                  </p>
                </div>

                <button
                  onClick={handlePopulateIndustryTemplate}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Nạp Tất Cả Đề Xuất
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Content Card */}
                <div className="p-5 bg-white rounded-3xl border border-blue-100 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-blue-100 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Nội Dung Hiện Tại
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {currentContent.trim() ? `${currentContent.trim().split(/\s+/).length} từ` : '0 từ'}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs text-slate-800 leading-relaxed min-h-[140px] whitespace-pre-line">
                      {currentContent || '(Chưa có nội dung soạn thảo)'}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-blue-100 text-[11px] text-slate-400 font-medium">
                    Mục: {STEP_LABELS[currentSection].full}
                  </div>
                </div>

                {/* AI Enhanced Suggestion Card */}
                <div className="p-5 bg-white rounded-3xl border border-blue-200 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-blue-100 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                          Phiên Bản AI Tối Ưu (STAR & ATS)
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(currentEval?.suggestedImprovement || guidance.sampleGood, 'diff-copy')}
                        className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline"
                      >
                        {copiedKey === 'diff-copy' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        Sao chép
                      </button>
                    </div>

                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200/80 text-xs text-slate-800 leading-relaxed min-h-[140px] whitespace-pre-line">
                      {currentEval?.suggestedImprovement || guidance.sampleGood}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-blue-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Chuẩn ngành {activeDomain.shortName}
                    </span>

                    <button
                      onClick={() => handleApplySuggestion(currentEval?.suggestedImprovement || guidance.sampleGood)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-blue-600/20"
                    >
                      Áp dụng bản này ⚡
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab 2 Footer Action Bar */}
              <div className="pt-5 border-t border-blue-100 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setViewTab('coach')}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all"
                >
                  Chuyển sang Chẩn đoán
                </button>
                <button
                  onClick={handleFinish}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  <Check className="w-4 h-4" />
                  Áp Dụng Vào CV
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE CV PREVIEW */}
          {viewTab === 'preview' && (
            <div className="max-w-3xl mx-auto bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              
              {/* CV Preview Top */}
              <div className="border-b-2 border-blue-600 pb-4 mb-6 flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tight">
                    {initialData?.studentName || 'NGUYỄN VĂN AN'}
                  </h2>
                  <div className="text-sm font-bold text-blue-600 mt-1 flex items-center gap-2">
                    <span>{initialData?.jobTarget || activeDomain.name}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                      {activeDomain.icon} {activeDomain.shortName}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-600" /> {initialData?.email || 'student@profilehub.edu.vn'}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-600" /> {initialData?.phone || '0912 345 678'}</span>
                    <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-blue-600" /> profilehub.edu.vn/cv</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    <Shield className="w-3.5 h-3.5" /> ProfileHub Verified
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 mt-1">Đã tối ưu theo chuẩn ngành</div>
                </div>
              </div>

              {/* CV Section 1: Summary */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider border-b border-blue-100 pb-1 mb-2 flex items-center justify-between">
                  <span>1. Mục Tiêu & Tóm Tắt Nghề Nghiệp</span>
                  {evalMap.summary?.status === 'pass' && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Chuẩn ATS
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {contentMap.summary || '(Chưa có nội dung tóm tắt. Hoàn thành Bước 1 để tự động điền tại đây)'}
                </p>
              </div>

              {/* CV Section 2: Projects */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider border-b border-blue-100 pb-1 mb-2 flex items-center justify-between">
                  <span>2. Đồ Án / Dự Án Thực Tế (Featured Projects)</span>
                  {selectedProjObj?.is_verified && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Đã Kiểm Định Học Thuật
                    </span>
                  )}
                </h4>
                <div className="text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-blue-950">
                    {selectedProjObj?.title || `Dự Án Trọng Tâm Ngành ${activeDomain.shortName}`}
                  </div>
                  <p className="leading-relaxed whitespace-pre-line">
                    {contentMap.project || '(Chưa có nội dung mô tả đồ án. Hoàn thành Bước 2 để tự động điền)'}
                  </p>
                </div>
              </div>

              {/* CV Section 3: Skills */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider border-b border-blue-100 pb-1 mb-2 flex items-center justify-between">
                  <span>3. Kỹ Năng Chuyên Môn</span>
                  {evalMap.skills?.status === 'pass' && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Đúng Chuẩn Ngành
                    </span>
                  )}
                </h4>
                <div className="text-xs text-slate-700 leading-relaxed">
                  {contentMap.skills || '(Chưa có danh sách kỹ năng)'}
                </div>
              </div>

              {/* CV Section 4: Contact */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider border-b border-blue-100 pb-1 mb-2">
                  4. Thông Tin Liên Hệ & Bằng Chứng Số
                </h4>
                <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-blue-50/40 p-3.5 rounded-2xl border border-blue-100">
                  {contentMap.contact || '(Chưa có thông tin liên hệ)'}
                </div>
              </div>

              {/* Actions Bottom */}
              <div className="pt-6 border-t border-blue-100 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setViewTab('coach')}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all"
                >
                  Quay lại chỉnh sửa
                </button>

                <button
                  onClick={handleFinish}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Check className="w-4 h-4" />
                  Xác Nhận & Xuất Vào Bản In CV
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}


