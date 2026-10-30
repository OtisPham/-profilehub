import React, { useState, useMemo, useEffect } from 'react';
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
  ChevronUp,
  Check,
  Layers,
  ArrowRight,
  ShieldCheck,
  Flame,
  Plus,
  Terminal,
  FileText,
  ShieldAlert,
  HelpCircle,
  Code2,
  Bug,
  Scale
} from 'lucide-react';
import {
  type AICoachEvaluation,
  type IndustryDomainId,
  getAvailableIndustryDomains,
  INDUSTRY_DOMAINS
} from '../../services/aiCvCoachService';
import { starDiagnosticService, type StatementDiagnosis } from '../../services/starDiagnosticService';
import { projectDefenseService, type ProjectDefensePlan } from '../../services/projectDefenseService';
import type { CVSection, PersonalInfoData, ProjectItem } from '../../types/cvSection';

export interface ActionableIssue {
  id: string;
  type: 'objective' | 'project' | 'skills' | 'contact';
  severity: 'high' | 'medium';
  title: string;
  description: string;
  actionLabel: string;
  payload?: any;
}

interface LiveAICoachPanelProps {
  activeSectionTitle: string;
  evaluation: AICoachEvaluation | null;
  isEvaluating: boolean;
  overallScore: number;
  sections?: CVSection[];
  personalInfo?: PersonalInfoData;
  onAutoFix: (suggestedText: string) => void;
  onApplyQuickFix?: (type: 'objective' | 'project' | 'skills' | 'contact' | 'full_polish', payload?: any) => void;
  onOpenFullCoach?: () => void;
  onReEvaluateAll: () => void;
  currentDomainId?: IndustryDomainId;
  onSelectDomain?: (domainId: IndustryDomainId) => void;

  // New Copilot Tabs Props
  activeTab?: 'ats' | 'star' | 'defense';
  onTabChange?: (tab: 'ats' | 'star' | 'defense') => void;
  targetRole?: string;
  pageBudget?: {
    status: 'optimal' | 'warning' | 'overflow' | string;
    statusText: string;
    firstPageFillPercent: number;
    linesOverflow?: number;
    pageCount?: number;
  };
  onUpdateProjectDescription?: (projectId: string, newDescription: string, syncToProfile?: boolean) => void;
}

export default function LiveAICoachPanel({
  activeSectionTitle,
  evaluation,
  isEvaluating,
  overallScore = 85,
  sections = [],
  personalInfo,
  onAutoFix,
  onApplyQuickFix,
  onReEvaluateAll,
  currentDomainId,
  onSelectDomain,
  activeTab: externalTab,
  onTabChange,
  targetRole = 'Kỹ Sư Phần Mềm',
  pageBudget,
  onUpdateProjectDescription
}: LiveAICoachPanelProps) {
  // Primary Copilot Tab: 'ats' | 'star' | 'defense'
  const [internalTab, setInternalTab] = useState<'ats' | 'star' | 'defense'>(externalTab || 'ats');
  const activeTab = externalTab !== undefined ? externalTab : internalTab;

  const handleTabSwitch = (tab: 'ats' | 'star' | 'defense') => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  useEffect(() => {
    if (externalTab) {
      setInternalTab(externalTab);
    }
  }, [externalTab]);

  // Tab 1 Sub-states
  const [showDomainPicker, setShowDomainPicker] = useState(false);
  const [quickActionSuccess, setQuickActionSuccess] = useState<string | null>(null);
  const [atsSubTab, setAtsSubTab] = useState<'issues' | 'checklist'>('issues');

  // Extract projects from sections
  const projSection = sections.find(s => s.type === 'projects');
  const projectItems = useMemo<ProjectItem[]>(() => {
    return (projSection?.items as ProjectItem[]) || [];
  }, [projSection]);

  // Tab 2 (STAR Coach) States
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [showElicitationForm, setShowElicitationForm] = useState(false);
  const [situationAnswer, setSituationAnswer] = useState('');
  const [actionAnswer, setActionAnswer] = useState('');
  const [resultAnswer, setResultAnswer] = useState('');
  const [syncToProfile, setSyncToProfile] = useState(true);

  // Auto-select first project if none selected
  useEffect(() => {
    if (projectItems.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projectItems[0].id);
    }
  }, [projectItems, selectedProjectId]);

  const selectedProject = useMemo(() => {
    return projectItems.find(p => p.id === selectedProjectId) || projectItems[0] || null;
  }, [projectItems, selectedProjectId]);

  // Instant STAR diagnosis for selected project
  const starDiagnosis = useMemo<StatementDiagnosis | null>(() => {
    if (!selectedProject || !selectedProject.description) return null;
    return starDiagnosticService.diagnoseStatement(selectedProject.description);
  }, [selectedProject]);

  // Tab 3 (Defense Briefing) States
  const [selectedDefenseProjectId, setSelectedDefenseProjectId] = useState<string>('');
  const [defenseSubSection, setDefenseSubSection] = useState<'traps' | 'tradeoffs' | 'incident' | 'limits'>('traps');

  useEffect(() => {
    if (projectItems.length > 0 && !selectedDefenseProjectId) {
      setSelectedDefenseProjectId(projectItems[0].id);
    }
  }, [projectItems, selectedDefenseProjectId]);

  const selectedDefenseProject = useMemo(() => {
    return projectItems.find(p => p.id === selectedDefenseProjectId) || projectItems[0] || null;
  }, [projectItems, selectedDefenseProjectId]);

  const defensePlan = useMemo<ProjectDefensePlan | null>(() => {
    if (!selectedDefenseProject) return null;
    return projectDefenseService.generateDefenseBriefing(selectedDefenseProject, targetRole);
  }, [selectedDefenseProject, targetRole]);

  const availableDomains = getAvailableIndustryDomains();
  const activeDomain = currentDomainId
    ? INDUSTRY_DOMAINS[currentDomainId]
    : evaluation?.detectedDomain
    ? INDUSTRY_DOMAINS[evaluation.detectedDomain.id] || INDUSTRY_DOMAINS.it_software
    : INDUSTRY_DOMAINS.it_software;

  // ----------------------------------------------------------------
  // 1. DYNAMIC ACTIONABLE ISSUES DETECTION (ZERO-MODAL 1-CLICK FIXES)
  // ----------------------------------------------------------------
  const detectedIssues = useMemo<ActionableIssue[]>(() => {
    const list: ActionableIssue[] = [];

    // Check Objective
    const objSec = sections.find(s => s.type === 'objective');
    const objText = objSec?.content?.trim() || '';
    if (!objText || objText.length < 45) {
      list.push({
        id: 'issue-objective-short',
        type: 'objective',
        severity: 'high',
        title: 'Mục tiêu nghề nghiệp còn ngắn hoặc chung chung',
        description: 'Chưa nêu rõ vị trí mục tiêu và kết quả định lượng đạt được theo chuẩn ATS.',
        actionLabel: '⚡ Chuẩn hóa mục tiêu theo ngành',
        payload: { suggestedText: activeDomain.sampleObjective }
      });
    } else if (!objText.includes('%') && !/\d+/.test(objText)) {
      list.push({
        id: 'issue-objective-vague',
        type: 'objective',
        severity: 'medium',
        title: 'Mục tiêu chưa có chỉ số định lượng',
        description: 'Bổ sung kết quả hoặc chỉ số thực tiễn giúp tăng 35% độ tin cậy với nhà tuyển dụng.',
        actionLabel: '⚡ Thêm chỉ số STAR vào mục tiêu',
        payload: { suggestedText: activeDomain.sampleObjective }
      });
    }

    // Check Projects
    if (projectItems.length === 0) {
      list.push({
        id: 'issue-proj-none',
        type: 'project',
        severity: 'high',
        title: 'Chưa có dự án hoặc đồ án thực tế',
        description: 'Hồ sơ cần tối thiểu 1-2 đồ án chứng minh kỹ năng áp dụng thực tiễn.',
        actionLabel: '⚡ Nạp đồ án mẫu ngành',
        payload: { isAddSample: true }
      });
    } else {
      projectItems.forEach(p => {
        const desc = p.description || '';
        const hasNumbers = desc.includes('%') || /\d+/.test(desc);
        if (!hasNumbers || desc.length < 60) {
          list.push({
            id: `issue-proj-${p.id}`,
            type: 'project',
            severity: 'high',
            title: `Đồ án "${p.projectName || 'Dự án'}" thiếu số liệu STAR`,
            description: 'Thiếu kết quả đo lường định lượng (% tối ưu, lượng người dùng, thời gian load).',
            actionLabel: '⚡ Thêm số liệu STAR',
            payload: { projectId: p.id, projectName: p.projectName }
          });
        }
      });
    }

    // Check Skills
    const skillsSec = sections.find(s => s.type === 'skills');
    const allSkillWords: string[] = [];
    if (skillsSec?.items && Array.isArray(skillsSec.items)) {
      skillsSec.items.forEach((grp: any) => {
        if (grp.skills && Array.isArray(grp.skills)) {
          allSkillWords.push(...grp.skills.map((s: string) => s.toLowerCase()));
        }
      });
    }
    if (skillsSec?.content) {
      allSkillWords.push(...skillsSec.content.toLowerCase().split(/[,\n]/));
    }
    const missingCoreSkills = activeDomain.coreSkills.filter(
      cs => !allSkillWords.some(sw => sw.includes(cs.toLowerCase()))
    );
    if (missingCoreSkills.length > 0) {
      list.push({
        id: 'issue-skills-missing',
        type: 'skills',
        severity: 'medium',
        title: `Thiếu ${missingCoreSkills.length} từ khóa kỹ năng quan trọng`,
        description: `Nên bổ sung: ${missingCoreSkills.slice(0, 3).join(', ')}... để tăng độ khớp ATS.`,
        actionLabel: `+ Thêm ${missingCoreSkills.slice(0, 2).join(', ')}`,
        payload: { skillsToAdd: missingCoreSkills.slice(0, 3) }
      });
    }

    // Check Contact
    if (personalInfo && !personalInfo.github && !personalInfo.linkedin) {
      list.push({
        id: 'issue-contact-links',
        type: 'contact',
        severity: 'medium',
        title: 'Chưa gắn link GitHub hoặc LinkedIn',
        description: 'Link mã nguồn mở và profile chuyên môn giúp hồ sơ tăng uy tín vượt trội.',
        actionLabel: '+ Điền nhanh link vào CV',
        payload: { focusField: 'github' }
      });
    }

    return list;
  }, [sections, personalInfo, activeDomain, projectItems]);

  // Compute live ATS score dynamically
  const liveAtsScore = useMemo(() => {
    let score = 100;
    detectedIssues.forEach(issue => {
      score -= issue.severity === 'high' ? 10 : 5;
    });
    return Math.max(65, Math.min(100, score));
  }, [detectedIssues]);

  const handleFixIssue = (issue: ActionableIssue) => {
    if (onApplyQuickFix) {
      onApplyQuickFix(issue.type, issue.payload);
    } else if (issue.payload?.suggestedText) {
      onAutoFix(issue.payload.suggestedText);
    }
    setQuickActionSuccess(`Đã tự động sửa: ${issue.title}`);
    setTimeout(() => setQuickActionSuccess(null), 3000);
  };

  const handleFullPolish = () => {
    if (onApplyQuickFix) {
      onApplyQuickFix('full_polish');
    }
    setQuickActionSuccess('✨ Đã tối ưu hóa toàn bộ nội dung CV đạt chuẩn ATS!');
    setTimeout(() => setQuickActionSuccess(null), 3500);
  };

  // Handle STAR Elicitation Assembly & Apply
  const handleApplyElicitedStar = () => {
    if (!selectedProject) return;

    const assembled = starDiagnosticService.assembleStarBullet({
      projectName: selectedProject.projectName || 'Dự án',
      technologies: selectedProject.technologies || ['React', 'TypeScript'],
      situationAnswer: situationAnswer || 'Hệ thống yêu cầu xử lý dữ liệu tải cao',
      actionAnswer: actionAnswer || 'Trực tiếp kiến trúc module và tối ưu hóa truy vấn',
      resultAnswer: resultAnswer || 'Giảm 35% độ trễ phản hồi, phục vụ 10,000 người dùng hàng ngày'
    });

    const newDescription = selectedProject.description
      ? `${selectedProject.description}\n• ${assembled.starBullet}`
      : `• ${assembled.starBullet}`;

    if (onUpdateProjectDescription) {
      onUpdateProjectDescription(selectedProject.id, newDescription, syncToProfile);
    }

    setQuickActionSuccess(`✨ Đã áp dụng câu chuẩn STAR vào "${selectedProject.projectName}"!`);
    setShowElicitationForm(false);
    setSituationAnswer('');
    setActionAnswer('');
    setResultAnswer('');
    setTimeout(() => setQuickActionSuccess(null), 3500);
  };

  // Standard checklist items
  const defaultChecklist = [
    {
      id: 'c1',
      criterion: 'Độ dài mục tiêu chuẩn (2 – 4 câu súc tích)',
      feedback: 'Tóm lược cô đọng năng lực chuyên môn và định hướng rõ ràng.',
      passed: !detectedIssues.some(i => i.type === 'objective')
    },
    {
      id: 'c2',
      criterion: 'Đồ án chuẩn cấu trúc STAR & Có số liệu định lượng',
      feedback: 'Định lượng số ca, phần trăm tối ưu, lượng người dùng và công nghệ.',
      passed: !detectedIssues.some(i => i.type === 'project')
    },
    {
      id: 'c3',
      criterion: `Đầy đủ từ khóa chuyên môn ngành ${activeDomain.shortName}`,
      feedback: `Chứa các từ khóa chuẩn ATS: ${activeDomain.coreSkills.slice(0, 3).join(', ')}.`,
      passed: !detectedIssues.some(i => i.type === 'skills')
    },
    {
      id: 'c4',
      criterion: 'Liên kết minh chứng số (GitHub / LinkedIn / Demo)',
      feedback: 'Có link minh chứng thực tế giúp nhà tuyển dụng xác thực ngay lập tức.',
      passed: !detectedIssues.some(i => i.type === 'contact')
    }
  ];

  const checklistItems = evaluation?.criteriaChecklist && evaluation.criteriaChecklist.length > 0
    ? evaluation.criteriaChecklist
    : defaultChecklist;

  const passedCount = checklistItems.filter(c => c.passed).length;
  const totalCount = checklistItems.length;

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] dark:bg-[#0c101c] border-l border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden select-none font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. Header Sidebar: 3 Primary Copilot Tabs */}
      <div className="p-3 bg-white dark:bg-[#0f1523] border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#1e3a8a] to-[#2563eb] text-white flex items-center justify-center shadow-xs">
              <Sparkles size={14} className="text-yellow-300" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider block leading-tight">
                AI Copilot Side-Panel
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">Trợ Lý Thông Minh 1-Chạm</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
              liveAtsScore >= 85 ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
            }`}>
              {liveAtsScore}/100 ATS
            </span>
          </div>
        </div>

        {/* 3 Main Tabs Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-[#090d16] rounded-xl">
          <button
            onClick={() => handleTabSwitch('ats')}
            className={`py-1.5 text-center text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'ats'
                ? 'bg-white dark:bg-[#1a2338] text-[#1e3a8a] dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck size={13} className={activeTab === 'ats' ? 'text-[#1e3a8a] dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500'} />
            <span>ATS & Check</span>
          </button>

          <button
            onClick={() => handleTabSwitch('star')}
            className={`py-1.5 text-center text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'star'
                ? 'bg-white dark:bg-[#1a2338] text-blue-700 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles size={13} className={activeTab === 'star' ? 'text-blue-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
            <span>STAR Coach</span>
          </button>

          <button
            onClick={() => handleTabSwitch('defense')}
            className={`py-1.5 text-center text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'defense'
                ? 'bg-white dark:bg-[#1a2338] text-purple-700 dark:text-violet-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal size={13} className={activeTab === 'defense' ? 'text-purple-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'} />
            <span>Phòng Thủ</span>
          </button>
        </div>
      </div>

      {/* Main Content Area Based on Active Tab */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {quickActionSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">{quickActionSuccess}</span>
          </div>
        )}

        {/* ========================================================
         * TAB 1: ATS & QUALITY CHECK
         * ======================================================== */}
        {activeTab === 'ats' && (
          <div className="space-y-3">
            {/* A4 Page Budget Alert */}
            {pageBudget && (
              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                pageBudget.status === 'optimal'
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
                  : pageBudget.status === 'warning'
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  <FileText size={15} />
                  <div>
                    <span className="font-bold block">{pageBudget.statusText}</span>
                    <span className="text-[10.5px] opacity-80">
                      {(pageBudget.linesOverflow && pageBudget.linesOverflow > 0) || pageBudget.status === 'overflow'
                        ? 'Nội dung đang tràn sang trang 2' 
                        : 'Vừa vặn trong 1 trang A4'}
                    </span>
                  </div>
                </div>
                <span className="font-mono font-bold">{pageBudget.firstPageFillPercent}%</span>
              </div>
            )}

            {/* Industry Selector */}
            <div className="p-2.5 bg-white dark:bg-[#111728] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span>{activeDomain.icon}</span>
                <div className="truncate">
                  <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Chuẩn Ngành Tuyển Dụng:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{activeDomain.name.split('(')[0].trim()}</span>
                </div>
              </div>
              {onSelectDomain && (
                <button
                  onClick={() => setShowDomainPicker(!showDomainPicker)}
                  className="px-2 py-1 text-[11px] font-bold text-blue-600 dark:text-indigo-400 hover:bg-blue-50 dark:hover:bg-indigo-950/50 rounded-lg border border-blue-200 dark:border-indigo-800/60 shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>Đổi</span>
                  <ChevronDown size={12} />
                </button>
              )}
            </div>

            {/* Sub-tabs: Cần Sửa vs Tiêu chí */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 text-xs font-bold">
              <button
                onClick={() => setAtsSubTab('issues')}
                className={`py-1 px-3 rounded-lg transition cursor-pointer ${
                  atsSubTab === 'issues'
                    ? 'bg-[#1e3a8a] dark:bg-indigo-600 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Cần Sửa ({detectedIssues.length})
              </button>
              <button
                onClick={() => setAtsSubTab('checklist')}
                className={`py-1 px-3 rounded-lg transition cursor-pointer ${
                  atsSubTab === 'checklist'
                    ? 'bg-[#1e3a8a] dark:bg-indigo-600 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Tiêu Chí ({passedCount}/{totalCount})
              </button>
            </div>

            {atsSubTab === 'issues' ? (
              <div className="space-y-2">
                {detectedIssues.length > 0 ? (
                  detectedIssues.map(issue => (
                    <div
                      key={issue.id}
                      className="p-3 bg-white dark:bg-[#111728] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-300 dark:hover:border-indigo-500 transition-all text-left space-y-2"
                    >
                      <div className="flex items-start gap-2">
                        <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                          issue.severity === 'high' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                            {issue.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {issue.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <button
                          onClick={() => handleFixIssue(issue)}
                          className="px-3 py-1.5 bg-blue-50 dark:bg-indigo-950/50 hover:bg-blue-600 dark:hover:bg-indigo-600 text-blue-700 dark:text-indigo-300 hover:text-white rounded-lg text-[11px] font-bold border border-blue-200 dark:border-indigo-800/60 hover:border-transparent flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                        >
                          <Zap size={13} className="text-amber-500" />
                          <span>{issue.actionLabel}</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-center space-y-1.5">
                    <ShieldCheck size={28} className="text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">CV Đạt Chuẩn ATS Hoàn Hảo</h4>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300">Không phát hiện lỗi định dạng, từ khóa hoặc khoảng cách.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 bg-white dark:bg-[#111728] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                {checklistItems.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 size={15} className={`shrink-0 mt-0.5 ${
                      item.passed ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'
                    }`} />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-[11.5px]">{item.criterion}</div>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">{item.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
         * TAB 2: STAR COACH (GUIDED GOOGLE XYZ ELICITATION)
         * ======================================================== */}
        {activeTab === 'star' && (
          <div className="space-y-3">
            {/* Project Picker */}
            <div className="p-2.5 bg-white dark:bg-[#111728] rounded-xl border border-slate-200 dark:border-slate-800">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Chọn đồ án cần soi chuẩn STAR:
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#161f36] border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {projectItems.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.projectName || 'Dự án'}
                  </option>
                ))}
              </select>
            </div>

            {selectedProject ? (
              <div className="space-y-3">
                {/* Diagnostic Score Card */}
                {starDiagnosis && (
                  <div className="p-3 bg-white dark:bg-[#111728] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-left">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Điểm STAR Dự Án:</span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                          starDiagnosis.score >= 80 ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                        }`}>
                          {starDiagnosis.score}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                        {starDiagnosis.isStarCompliant ? 'Đạt chuẩn STAR' : 'Thiếu số liệu'}
                      </span>
                    </div>

                    {/* S-A-R Component Badges */}
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10.5px] font-bold">
                      <div className={`p-1.5 rounded-lg border ${
                        starDiagnosis.hasSituation ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60' : 'bg-slate-50 dark:bg-[#161f36] text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                      }`}>
                        S - Bối Cảnh
                      </div>
                      <div className={`p-1.5 rounded-lg border ${
                        starDiagnosis.hasAction ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60' : 'bg-slate-50 dark:bg-[#161f36] text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                      }`}>
                        A - Hành Động
                      </div>
                      <div className={`p-1.5 rounded-lg border ${
                        starDiagnosis.hasResult ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60' : 'bg-slate-50 dark:bg-[#161f36] text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                      }`}>
                        R - Kết Quả
                      </div>
                    </div>

                    {/* Detected Metrics */}
                    {starDiagnosis.detectedMetrics.length > 0 && (
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-blue-50/50 dark:bg-indigo-950/30 p-2 rounded-lg border border-blue-100 dark:border-indigo-900/40">
                        <span className="font-bold text-blue-900 dark:text-indigo-200 block mb-1">Chỉ số định lượng phát hiện:</span>
                        <div className="flex flex-wrap gap-1">
                          {starDiagnosis.detectedMetrics.map((m, idx) => (
                            <span key={idx} className="bg-blue-100 dark:bg-indigo-900/60 text-blue-800 dark:text-indigo-200 px-1.5 py-0.2 rounded font-mono font-bold text-[10px]">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Passive verbs warning */}
                    {starDiagnosis.detectedPassiveVerbs.length > 0 && (
                      <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200 dark:border-amber-800/60 flex items-start gap-1.5">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                        <div>
                          <span className="font-bold block">Từ ngữ thụ động làm giảm điểm:</span>
                          <span>Đang dùng: "{starDiagnosis.detectedPassiveVerbs.join(', ')}". Nên đổi thành "Trực tiếp kiến trúc", "Tối ưu", "Xây dựng".</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Google XYZ Guided Elicitation Assistant */}
                <div className="p-3.5 bg-gradient-to-b from-blue-50/70 to-white dark:from-[#131b2e] dark:to-[#0f1523] rounded-xl border border-blue-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-blue-600 dark:text-indigo-400" />
                      <span className="text-xs font-black text-blue-950 dark:text-indigo-200 uppercase tracking-wider">
                        Google XYZ Elicitation
                      </span>
                    </div>
                    <button
                      onClick={() => setShowElicitationForm(!showElicitationForm)}
                      className="text-[11px] font-bold text-blue-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{showElicitationForm ? 'Đóng form' : 'Bóc tách câu chữ'}</span>
                      {showElicitationForm ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Công thức Google XYZ: <em>"Đạt được [X] đo bằng [Y] thông qua hành động [Z]"</em>. Điền nhanh 3 câu hỏi gợi ý để tạo câu đắt giá nhất.
                  </p>

                  {showElicitationForm && (
                    <div className="space-y-2.5 pt-2 border-t border-blue-100 dark:border-slate-800">
                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                          1. Bối cảnh & Thách thức (X):
                        </label>
                        <input
                          type="text"
                          value={situationAnswer}
                          onChange={(e) => setSituationAnswer(e.target.value)}
                          placeholder="VD: Hệ thống tải cao, database phản hồi chậm 2.5s..."
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-[#161f36] border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                          2. Hành động kỹ thuật bạn làm (Z):
                        </label>
                        <input
                          type="text"
                          value={actionAnswer}
                          onChange={(e) => setActionAnswer(e.target.value)}
                          placeholder="VD: Trực tiếp tái cấu trúc query và áp dụng Redis cache-aside..."
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-[#161f36] border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                          3. Kết quả định lượng đo được (Y):
                        </label>
                        <input
                          type="text"
                          value={resultAnswer}
                          onChange={(e) => setResultAnswer(e.target.value)}
                          placeholder="VD: Giảm latency từ 2.5s xuống 180ms, chịu tải 5,000 CCU..."
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-[#161f36] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100"
                        />
                      </div>

                      {/* Section 3.4 Sync to Profile Checkbox */}
                      <label className="flex items-center gap-2 pt-1 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={syncToProfile}
                          onChange={(e) => setSyncToProfile(e.target.checked)}
                          className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-semibold text-blue-900 dark:text-indigo-300">
                          Đồng bộ câu văn này vào Hồ sơ gốc (Profile)
                        </span>
                      </label>

                      <button
                        onClick={handleApplyElicitedStar}
                        className="w-full py-2 bg-[#1e3a8a] hover:bg-[#1e40af] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Check size={14} />
                        <span>Áp Dụng Vào CV Ngay (Zero-Modal)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">Chưa có dự án nào trong CV.</p>
            )}
          </div>
        )}

        {/* ========================================================
         * TAB 3: DEFENSE BRIEFING (TECH LEAD INTERVIEW TRAPS)
         * ======================================================== */}
        {activeTab === 'defense' && (
          <div className="space-y-3">
            {/* Project Picker */}
            <div className="p-2.5 bg-white dark:bg-[#111728] rounded-xl border border-slate-200 dark:border-slate-800">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Phòng thủ kỹ thuật cho đồ án:
              </label>
              <select
                value={selectedDefenseProjectId}
                onChange={(e) => setSelectedDefenseProjectId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#161f36] border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {projectItems.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.projectName || 'Dự án'}
                  </option>
                ))}
              </select>
            </div>

            {defensePlan ? (
              <div className="space-y-3">
                {/* Sub-tabs inside Defense */}
                <div className="grid grid-cols-3 gap-1 bg-purple-50 dark:bg-[#141226] p-1 rounded-xl text-[11px] font-bold text-center">
                  <button
                    onClick={() => setDefenseSubSection('traps')}
                    className={`py-1 rounded-lg transition cursor-pointer ${
                      defenseSubSection === 'traps'
                        ? 'bg-white dark:bg-[#201a3d] text-purple-900 dark:text-purple-200 shadow-2xs font-bold'
                        : 'text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100'
                    }`}
                  >
                    Bẫy Kỹ Thuật
                  </button>
                  <button
                    onClick={() => setDefenseSubSection('tradeoffs')}
                    className={`py-1 rounded-lg transition cursor-pointer ${
                      defenseSubSection === 'tradeoffs'
                        ? 'bg-white dark:bg-[#201a3d] text-purple-900 dark:text-purple-200 shadow-2xs font-bold'
                        : 'text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100'
                    }`}
                  >
                    Trade-offs
                  </button>
                  <button
                    onClick={() => setDefenseSubSection('incident')}
                    className={`py-1 rounded-lg transition cursor-pointer ${
                      defenseSubSection === 'incident'
                        ? 'bg-white dark:bg-[#201a3d] text-purple-900 dark:text-purple-200 shadow-2xs font-bold'
                        : 'text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100'
                    }`}
                  >
                    Kịch Bản Lỗi
                  </button>
                </div>

                {/* Sub 1: Trap Questions */}
                {defenseSubSection === 'traps' && (
                  <div className="space-y-2.5">
                    {defensePlan.trapQuestions.map((q, idx) => (
                      <div key={idx} className="p-3 bg-white dark:bg-[#111728] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-left">
                        <div className="flex items-start gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                            Q{idx + 1}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                            {q.question}
                          </h4>
                        </div>
                        <div className="text-[11px] text-purple-900 dark:text-purple-200 bg-purple-50/70 dark:bg-purple-950/40 p-2 rounded-lg border border-purple-100/80 dark:border-purple-900/60 leading-relaxed">
                          <span className="font-bold block text-purple-950 dark:text-purple-100 mb-0.5">Bẫy của Tech Lead:</span>
                          {q.trapContext}
                        </div>
                        <div className="text-[11px] text-emerald-900 dark:text-emerald-200 bg-emerald-50/70 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/60 leading-relaxed">
                          <span className="font-bold block text-emerald-950 dark:text-emerald-100 mb-0.5">Gợi ý trả lời ghi điểm:</span>
                          {q.recommendedAngle}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub 2: Trade-offs */}
                {defenseSubSection === 'tradeoffs' && (
                  <div className="space-y-2.5">
                    {defensePlan.tradeOffs.map((to, idx) => (
                      <div key={idx} className="p-3 bg-white dark:bg-[#111728] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-left text-xs">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-blue-700 dark:text-indigo-400">{to.technology}</span>
                          <span className="text-slate-400 font-normal">so với</span>
                          <span className="text-slate-700 dark:text-slate-300">{to.comparedTo}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#161f36] p-2 rounded-lg leading-relaxed">
                          {to.defenseReason}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub 3: Debugging Incident Story */}
                {defenseSubSection === 'incident' && defensePlan.debuggingStoryScaffold && (
                  <div className="p-3.5 bg-white dark:bg-[#111728] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-left text-xs">
                    <div className="font-black text-slate-900 dark:text-slate-100 text-[11.5px] flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                      <Bug size={14} className="text-rose-500" />
                      <span>Kịch Bản Xử Lý Sự Cố (Incident Story)</span>
                    </div>
                    <div className="text-[11px] space-y-1.5">
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 block">Tình huống sự cố:</span>
                        <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#161f36] p-1.5 rounded">{defensePlan.debuggingStoryScaffold.situation}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 block">Nguyên nhân gốc rễ (Root Cause):</span>
                        <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#161f36] p-1.5 rounded">{defensePlan.debuggingStoryScaffold.rootCause}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 block">Giải pháp khắc phục:</span>
                        <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#161f36] p-1.5 rounded">{defensePlan.debuggingStoryScaffold.resolution}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">Chưa có dự án nào để chuẩn bị phòng thủ.</p>
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom: 1-Click Polish */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1523] space-y-1.5 transition-colors">
        <button
          onClick={handleFullPolish}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] hover:from-[#172554] hover:to-[#1e40af] dark:from-indigo-600 dark:via-blue-600 dark:to-indigo-700 dark:hover:from-indigo-700 dark:hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Sparkles size={14} className="text-amber-300" />
          <span>✨ Tối Ưu Toàn Diện CV (1 Click)</span>
        </button>
      </div>

    </div>
  );
}
