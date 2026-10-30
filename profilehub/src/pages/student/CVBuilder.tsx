import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabase';
import BusinessCardModal from '../../components/qr/BusinessCardModal';
import AiCvCoachModal from '../../components/cv/AiCvCoachModal';
import AddSectionModal from '../../components/cv/AddSectionModal';
import DeleteSectionDialog from '../../components/cv/DeleteSectionDialog';
import SectionSettingsModal from '../../components/cv/SectionSettingsModal';
import ReorderSectionsModal from '../../components/cv/ReorderSectionsModal';
import InteractiveCVCanvas from '../../components/cv/InteractiveCVCanvas';
import GitHubQuickImportBar from '../../components/cv/GitHubQuickImportBar';
import GamifiedOnboardingTour from '../../components/common/GamifiedOnboardingTour';
import LiveAICoachPanel from '../../components/cv/LiveAICoachPanel';
import BulkCvImportModal from '../../components/recruiter/BulkCvImportModal';
import CVManagerModal from '../../components/cv/CVManagerModal';
import ProfileDataPickerModal from '../../components/cv/ProfileDataPickerModal';
import ProjectFitExplainerModal from '../../components/cv/ProjectFitExplainerModal';
import ApplicationPitchModal from '../../components/cv/ApplicationPitchModal';
import StarCvDiagnosticModal from '../../components/cv/StarCvDiagnosticModal';
import CVQualityCheckModal from '../../components/cv/CVQualityCheckModal';
import AtsParserEyeModal from '../../components/cv/AtsParserEyeModal';
import SalaryBenchmarkModal from '../../components/student/SalaryBenchmarkModal';
import AiMockInterviewModal from '../../components/student/AiMockInterviewModal';
import { pageBudgetService } from '../../services/pageBudgetService';
import { evaluateCVQuality } from '../../services/cvQualityCheckService';
import { auditAtsParseability } from '../../services/atsParserEyeService';
import {
  convertImportedCvToCvBuilderState,
  type ImportedCandidateCv
} from '../../services/bulkCvImportService';
import {
  evaluateCvSection,
  evaluateFullCv,
  detectIndustryDomain,
  INDUSTRY_DOMAINS,
  type AICoachEvaluation,
  type CVCoachSection,
  type IndustryDomainId
} from '../../services/aiCvCoachService';
import { cvService, type SavedCVData, type ManagedCVItem, type StudentProfileData } from '../../services/cvService';
import type { CVTemplateType } from '../../components/cv/CVTemplates';
import type {
  CVSection,
  CVSectionType,
  PersonalInfoData,
  EducationItem,
  WorkExperienceItem,
  ProjectItem,
  SkillGroupItem,
  CertificationItem,
  ActivityItem,
  AwardItem,
  LanguageItem,
  ReferenceItem,
  CustomSectionItem,
  SectionSettings
} from '../../types/cvSection';
import {
  Sparkles,
  Printer,
  QrCode,
  LayoutTemplate,
  Palette,
  FileText,
  Sliders,
  Type,
  Check,
  RotateCcw,
  RotateCw,
  PlusCircle,
  Save,
  CheckCircle2,
  RefreshCw,
  Target,
  FileSpreadsheet,
  Layers,
  FolderKanban,
  Share2,
  Clock,
  User,
  ChevronDown,
  Eye,
  Terminal,
  Wand2,
  Zap,
  ArrowUpDown,
  Scissors
} from 'lucide-react';

export const COLOR_PALETTES = [
  { name: 'Xanh Navy Chuyên Nghiệp', hex: '#1e3a8a' },
  { name: 'Xanh Ngọc Lục Bảo (Emerald)', hex: '#047857' },
  { name: 'Tím Đậm (Tech Indigo)', hex: '#4f46e5' },
  { name: 'Xám Than Sang Trọng (Charcoal)', hex: '#334155' },
  { name: 'Đỏ Ruby Quý Phái', hex: '#991b1b' },
];

export const FONT_OPTIONS = [
  { id: 'be-vietnam-pro', name: 'Be Vietnam Pro', desc: 'Chuẩn Tiếng Việt 100%', font: "'Be Vietnam Pro', sans-serif" },
  { id: 'inter', name: 'Inter', desc: 'Hiện Đại & Sắc Nét', font: "'Inter', sans-serif" },
  { id: 'plus-jakarta', name: 'Plus Jakarta Sans', desc: 'Năng Động / TopCV', font: "'Plus Jakarta Sans', sans-serif" },
  { id: 'lora', name: 'Lora (Serif)', desc: 'Học Thuật & Cổ Điển', font: "'Lora', serif" },
  { id: 'roboto', name: 'Roboto', desc: 'Chuẩn Google', font: "'Roboto', sans-serif" },
];

export const TEMPLATES_CONFIG = [
  { id: 'classic' as CVTemplateType, name: 'ATS Clean Pro (A4)', desc: 'Chuẩn ATS 1 & 2 Cột Chuyên Nghiệp', defaultFontIndex: 1 },
  { id: 'tech' as CVTemplateType, name: 'Tech Specialist', desc: '2 Cột IT & Dev Stack', defaultFontIndex: 2 },
  { id: 'pro_split' as CVTemplateType, name: 'TopCV Pro Split', desc: '2 Cột Sidebar Hiện Đại', defaultFontIndex: 0 },
  { id: 'compact_ats' as CVTemplateType, name: 'Compact ATS', desc: '2 Cột Tối Ưu 1 Trang', defaultFontIndex: 0 },
  { id: 'minimal' as CVTemplateType, name: 'Minimalist Harvard', desc: '1 Cột Tối Giản Ivy ATS', defaultFontIndex: 0 },
  { id: 'executive' as CVTemplateType, name: 'Executive Academic', desc: '1 Cột Học Thuật / Serif', defaultFontIndex: 3 },
];

export default function CVBuilder() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { 
    discoverySummary?: string; 
    discoveryProfile?: any;
    targetJd?: string;
    targetRole?: string;
    coachingTips?: string[];
    gapAnalysis?: any[];
  } | undefined;

  const [loading, setLoading] = useState(true);
  const [primaryColor, setPrimaryColor] = useState('#1e3a8a');
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplateType>('classic');
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);
  const [spacingDensity, setSpacingDensity] = useState<'compact' | 'standard' | 'relaxed'>('standard');
  const [fontSizeLevel, setFontSizeLevel] = useState<'small' | 'medium' | 'large'>('medium');
  const [isEditorMode, setIsEditorMode] = useState(true);

  // Toolbar menus
  const [showDesignMenu, setShowDesignMenu] = useState(false);
  const [designTab, setDesignTab] = useState<'template' | 'font' | 'style'>('template');
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showDensityMenu, setShowDensityMenu] = useState(false);

  // Modals & Dialogs
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isCVManagerOpen, setIsCVManagerOpen] = useState(false);
  const [isProfilePickerOpen, setIsProfilePickerOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<CVSection | null>(null);
  const [sectionToConfigure, setSectionToConfigure] = useState<CVSection | null>(null);

  // Multi-CV Management State
  const [managedCvList, setManagedCvList] = useState<ManagedCVItem[]>([]);
  const [activeCvId, setActiveCvId] = useState<string | null>(null);
  const [profileSourceData, setProfileSourceData] = useState<StudentProfileData | null>(null);

  // Undo Toast State
  const [deletedSectionBackup, setDeletedSectionBackup] = useState<{ section: CVSection; index: number } | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);

  // Spec v0.4 - Section 5: State Stack Undo / Redo
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  // Spec v0.4 - Section 3 BR-06: AI Usage Quota (20 credits/day)
  const [remainingAiCredits, setRemainingAiCredits] = useState<number>(() => {
    return cvService.getAiQuota(user?.id).remaining;
  });

  // Spec v0.4 - Section 3 BR-02: Opt-in Sync Banner
  const [hasProfileDrift, setHasProfileDrift] = useState(false);
  const [showDriftBanner, setShowDriftBanner] = useState(false);

  // Save State
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [showSaveSuccessToast, setShowSaveSuccessToast] = useState(false);
  const [saveToastSubtitle, setSaveToastSubtitle] = useState<string>('Dữ liệu chỉnh sửa đã được lưu an toàn.');
  const [showGuestSyncModal, setShowGuestSyncModal] = useState(false);

  // PERSONAL INFORMATION (HEADER SECTION)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    facebook: '',
    linkedin: '',
    github: '',
    website: '',
    location: 'TP. Hồ Chí Minh',
    avatarUrl: '',
    visibleFields: {
      phone: true,
      email: true,
      facebook: true,
      linkedin: true,
      github: true,
      website: true,
      location: true,
      avatarUrl: true
    }
  });

  // CV DYNAMIC SECTIONS LIST
  const [sections, setSections] = useState<CVSection[]>([]);

  // AI REAL-TIME EVALUATION PANEL STATES
  const [copilotTab, setCopilotTab] = useState<'ats' | 'star' | 'defense'>('ats');
  const [activeSectionId, setActiveSectionId] = useState<string | null>('sec-objective');
  const [activeSectionTitle, setActiveSectionTitle] = useState<string>('Mục Tiêu Nghề Nghiệp');
  const [activeEvaluation, setActiveEvaluation] = useState<AICoachEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [overallScore, setOverallScore] = useState<number>(85);
  const [selectedDomainId, setSelectedDomainId] = useState<IndustryDomainId>('it_software');

  // Raw DB records
  const [rawProjects, setRawProjects] = useState<any[]>([]);

  // Project Fit Explainer Modal State (Ticket 03)
  const [isProjectFitModalOpen, setIsProjectFitModalOpen] = useState(false);

  // Contextual Application Pitch State (ADR 0002)
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [applicationPitch, setApplicationPitch] = useState<string>('');
  const [currentJdText, setCurrentJdText] = useState<string>('');

  // STAR Diagnostic & Guided Elicitation Modal State
  const [isStarDiagnosticModalOpen, setIsStarDiagnosticModalOpen] = useState(false);

  // Feature 9: Rule-Engine CV Quality Check Modal State
  const [isQualityCheckModalOpen, setIsQualityCheckModalOpen] = useState(false);

  // ATS Parser Eye-View Modal State (Ticket ATS-Eye)
  const [isAtsParserEyeOpen, setIsAtsParserEyeOpen] = useState(false);

  // Salary Benchmark & AI Mock Interview States
  const [isSalaryBenchmarkOpen, setIsSalaryBenchmarkOpen] = useState(false);
  const [isAiMockInterviewOpen, setIsAiMockInterviewOpen] = useState(false);

  
  const handleImportFromGitHub = (newProject: ProjectItem) => {
    let nextSections: CVSection[] = [];
    setSections(prev => {
      let updated = [...prev];
      const projIdx = updated.findIndex(s => s.type === 'projects');
      if (projIdx !== -1) {
        const sec = { ...updated[projIdx] };
        sec.is_visible = true;
        sec.items = [newProject, ...(sec.items || [])];
        updated[projIdx] = sec;
      } else {
        updated.push({
          id: `sec_projects_${Date.now()}`,
          type: 'projects',
          title: 'DỰ ÁN & ĐỒ ÁN NỔI BẬT',
          order_index: updated.length,
          is_visible: true,
          settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
          items: [newProject]
        });
      }
      nextSections = updated;
      return updated;
    });

    // Auto-save immediately to localStorage so it won't disappear on refresh
    setTimeout(() => {
      try {
        const cvData: SavedCVData = {
          personalInfo,
          sections: nextSections,
          selectedTemplate,
          primaryColor,
          selectedFontId: selectedFont.id,
          spacingDensity,
          fontSizeLevel,
          savedAt: new Date().toISOString(),
          applicationPitch: applicationPitch || undefined,
          targetJdText: currentJdText || locationState?.targetJd || undefined,
          targetRoleTitle: locationState?.targetRole || personalInfo.jobTitle || undefined
        };
        cvService.saveCV(cvData, user?.id);
        const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        setLastSavedTime(`Đã tự động lưu lúc ${timeStr}`);
      } catch (e) {
        console.error('Auto-save GitHub import error:', e);
      }
    }, 100);

    setSaveToastSubtitle(`Đã thêm dự án "${newProject.projectName}" từ GitHub và tự động lưu vào CV!`);
    setShowSaveSuccessToast(true);
    setTimeout(() => setShowSaveSuccessToast(false), 3500);
  };

  const handleApplyProjectFromDiagnostic = (project: ProjectItem) => {
    setSections(prev => {
      let updated = [...prev];
      const projIdx = updated.findIndex(s => s.type === 'projects');
      if (projIdx >= 0) {
        const existingItems = (updated[projIdx].items as ProjectItem[]) || [];
        updated[projIdx] = {
          ...updated[projIdx],
          items: [project, ...existingItems]
        };
      } else {
        updated.push({
          id: `sec_projects_${Date.now()}`,
          type: 'projects',
          title: 'DỰ ÁN & ĐỒ ÁN NỔI BẬT',
          order_index: updated.length,
          is_visible: true,
          settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
          items: [project]
        });
      }
      return updated;
    });

    setSaveToastSubtitle(`Đã thêm đồ án "${project.projectName}" chuẩn STAR vào CV!`);
    setShowSaveSuccessToast(true);
    setTimeout(() => setShowSaveSuccessToast(false), 3500);
  };

  // Real-time Page Budget Guard (Ticket 05)
  const pageBudget = useMemo(() => {
    return pageBudgetService.calculatePageBudget(sections, personalInfo, spacingDensity);
  }, [sections, personalInfo, spacingDensity]);

  // Feature 9: Real-time Rule-Engine CV Quality Check
  const qualityCheck = useMemo(() => {
    return evaluateCVQuality(
      {
        title: managedCvList.find(c => c.id === activeCvId)?.title || 'Bản CV',
        targetRole: locationState?.targetRole || personalInfo.jobTitle || 'Chuyên viên',
        personalInfo,
        sections
      },
      pageBudget.firstPageFillPercent
    );
  }, [managedCvList, activeCvId, locationState?.targetRole, personalInfo, sections, pageBudget.firstPageFillPercent]);

  const isSingleColumnLayout = selectedTemplate === 'minimal' || selectedTemplate === 'executive';

  // ATS Parser Audit Calculation
  const atsAuditResult = useMemo(() => {
    return auditAtsParseability(sections, personalInfo, selectedTemplate);
  }, [sections, personalInfo, selectedTemplate]);

  const handleSwitchToMinimal = () => {
    setSelectedTemplate('minimal');
    setSaveToastSubtitle('Đã chuyển sang mẫu Minimalist Harvard 1 cột chuẩn ATS!');
    setShowSaveSuccessToast(true);
    setTimeout(() => setShowSaveSuccessToast(false), 3000);
  };

  const handleToggleColumns = () => {
    if (isSingleColumnLayout) {
      setSelectedTemplate('classic');
    } else {
      setSelectedTemplate('minimal');
    }
  };

  const handleAutoCondense = () => {
    const { sections: condensed, charactersSaved } = pageBudgetService.autoCondenseCvContent(sections);
    setSections(condensed);
    setSaveToastSubtitle(`Đã tự động thu gọn ${charactersSaved} ký tự để tối ưu vừa vặn 1 trang A4!`);
    setShowSaveSuccessToast(true);
    setTimeout(() => setShowSaveSuccessToast(false), 3500);
  };

  const handleApplyProjectsFromFitExplainer = (selectedProjects: ProjectItem[]) => {
    setSections(prev => {
      let updated = [...prev];
      const projIdx = updated.findIndex(s => s.type === 'projects');
      if (projIdx >= 0) {
        updated[projIdx] = {
          ...updated[projIdx],
          items: selectedProjects
        };
      } else {
        updated.push({
          id: `sec_projects_${Date.now()}`,
          type: 'projects',
          title: 'DỰ ÁN & ĐỒ ÁN NỔI BẬT',
          order_index: updated.length,
          is_visible: true,
          settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
          items: selectedProjects
        });
      }
      return updated;
    });

    setSaveToastSubtitle(`Đã tuyển chọn và đưa ${selectedProjects.length} đồ án phù hợp nhất vào CV!`);
    setShowSaveSuccessToast(true);
    setTimeout(() => setShowSaveSuccessToast(false), 3500);
  };

  // Switch template
  const handleSelectTemplate = (tmpl: typeof TEMPLATES_CONFIG[0]) => {
    setSelectedTemplate(tmpl.id);
    setSelectedFont(FONT_OPTIONS[tmpl.defaultFontIndex]);
    setShowTemplateMenu(false);
  };

  // Switch active CV from Manager
  const handleSelectCVFromManager = (cv: ManagedCVItem) => {
    setActiveCvId(cv.id);
    if (cv.data) {
      if (cv.data.personalInfo) {
        setPersonalInfo(cv.data.personalInfo);
        if (cv.data.personalInfo.jobTitle) {
          const detected = detectIndustryDomain(cv.data.personalInfo.jobTitle);
          setSelectedDomainId(detected.id);
        }
      }
      if (cv.data.sections && Array.isArray(cv.data.sections)) {
        setSections(cv.data.sections);
      }
      if (cv.data.selectedTemplate) setSelectedTemplate(cv.data.selectedTemplate);
      if (cv.data.primaryColor) setPrimaryColor(cv.data.primaryColor);
      if (cv.data.selectedFontId) {
        const foundFont = FONT_OPTIONS.find(f => f.id === cv.data.selectedFontId);
        if (foundFont) setSelectedFont(foundFont);
      }
      if (cv.data.spacingDensity) setSpacingDensity(cv.data.spacingDensity);
      if (cv.data.fontSizeLevel) setFontSizeLevel(cv.data.fontSizeLevel);
      if (cv.data.savedAt) {
        const timeStr = new Date(cv.data.savedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        setLastSavedTime(`Đã lưu lúc ${timeStr}`);
      }

      setApplicationPitch(cv.data.applicationPitch || '');
      setCurrentJdText(cv.data.targetJdText || '');

      const initialSummary = cv.data.sections?.find(s => s.type === 'objective')?.content || '';
      const initialEval = evaluateCvSection('summary', initialSummary, {
        jobTarget: cv.data.personalInfo?.jobTitle,
        domainId: detectIndustryDomain(cv.data.personalInfo?.jobTitle).id
      });
      setActiveEvaluation(initialEval);
    }
  };

  // Refresh CV list
  const refreshCVList = useCallback(() => {
    const list = cvService.getAllCVs(user?.id);
    setManagedCvList(list);
    const currActiveId = cvService.getActiveCVId(user?.id);
    setActiveCvId(currActiveId);
  }, [user]);

  // Load initial data via cvService frontend service
  const fetchAllData = useCallback(async () => {
    setLoading(true);

    // 1. Fetch student source records from Supabase
    const sourceData = await cvService.fetchStudentCVSourceData(user?.id);
    setProfileSourceData(sourceData);
    setRawProjects(sourceData.projects);

    // 2. Check multi-CVs list
    const list = cvService.getAllCVs(user?.id);
    setManagedCvList(list);

    const activeId = cvService.getActiveCVId(user?.id);
    setActiveCvId(activeId);

    const activeCV = list.find(c => c.id === activeId) || (list.length > 0 ? list[0] : null);

    if (activeCV && activeCV.data) {
      if (activeCV.data.personalInfo) {
        setPersonalInfo(activeCV.data.personalInfo);
        if (activeCV.data.personalInfo.jobTitle) {
          const detected = detectIndustryDomain(activeCV.data.personalInfo.jobTitle);
          setSelectedDomainId(detected.id);
        }
      }
      if (activeCV.data.sections && Array.isArray(activeCV.data.sections) && activeCV.data.sections.length > 0) {
        setSections(activeCV.data.sections);
        if (activeCV.data.selectedTemplate) setSelectedTemplate(activeCV.data.selectedTemplate);
        if (activeCV.data.primaryColor) setPrimaryColor(activeCV.data.primaryColor);
        if (activeCV.data.selectedFontId) {
          const foundFont = FONT_OPTIONS.find(f => f.id === activeCV.data.selectedFontId);
          if (foundFont) setSelectedFont(foundFont);
        }
        if (activeCV.data.spacingDensity) setSpacingDensity(activeCV.data.spacingDensity);
        if (activeCV.data.fontSizeLevel) setFontSizeLevel(activeCV.data.fontSizeLevel);
        if (activeCV.data.savedAt) {
          const timeStr = new Date(activeCV.data.savedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          setLastSavedTime(`Đã lưu lúc ${timeStr}`);
        }
        if (activeCV.data.applicationPitch) setApplicationPitch(activeCV.data.applicationPitch);
        if (activeCV.data.targetJdText) setCurrentJdText(activeCV.data.targetJdText);
        else if (locationState?.targetJd) setCurrentJdText(locationState.targetJd);
        const initialSummary = activeCV.data.sections.find(s => s.type === 'objective')?.content || '';
        const detectedDom = detectIndustryDomain(activeCV.data.personalInfo?.jobTitle).id;
        const initialEval = evaluateCvSection('summary', initialSummary, {
          jobTarget: activeCV.data.personalInfo?.jobTitle,
          domainId: detectedDom
        });
        setActiveEvaluation(initialEval);
        const fullEval = evaluateFullCv(activeCV.data.personalInfo, activeCV.data.sections, detectedDom);
        setOverallScore(fullEval.overallScore);

        // Spec v0.4 BR-02: Check for Profile Drift
        if (activeCV.data.personalInfo && sourceData.profile) {
          const p = sourceData.profile;
          const cvP = activeCV.data.personalInfo;
          const isDrift = Boolean(
            (p.full_name && p.full_name !== cvP.fullName) ||
            (p.major && p.major !== cvP.jobTitle)
          );
          if (isDrift) {
            setHasProfileDrift(true);
            setShowDriftBanner(true);
          }
        }

        setLoading(false);
        return;
      }
    }

    // 3. Fallback: Build initial structured CV sections from profile
    const initialCV = cvService.buildInitialSections(sourceData, user?.email);
    setPersonalInfo(initialCV.personalInfo);
    setSections(initialCV.sections);

    const initialDomain = detectIndustryDomain(initialCV.personalInfo.jobTitle || sourceData.profile?.major);
    setSelectedDomainId(initialDomain.id);

    const initialSummary = initialCV.sections.find(s => s.type === 'objective')?.content || '';
    const initialEval = evaluateCvSection('summary', initialSummary, {
      jobTarget: initialCV.personalInfo.jobTitle,
      domainId: initialDomain.id
    });
    setActiveEvaluation(initialEval);
    const fullEval = evaluateFullCv(initialCV.personalInfo, initialCV.sections, initialDomain.id);
    setOverallScore(fullEval.overallScore);
    if (locationState?.targetJd) setCurrentJdText(locationState.targetJd);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, location.state, location.key]);

  // Listen for CV switch / create events from modal or sidebar
  useEffect(() => {
    const handleCvSwitched = (e: any) => {
      if (e.detail) {
        handleSelectCVFromManager(e.detail);
      } else {
        fetchAllData();
      }
    };
    window.addEventListener('profilehub:cv-switched', handleCvSwitched);

    return () => {
      window.removeEventListener('profilehub:cv-switched', handleCvSwitched);
    };
  }, [handleSelectCVFromManager, fetchAllData]);

  // Real-time Debounced Auto-Save to localStorage
  const isInitialLoadDone = useRef(false);
  useEffect(() => {
    if (loading) return;
    if (!isInitialLoadDone.current) {
      isInitialLoadDone.current = true;
      return;
    }

    const timer = setTimeout(() => {
      try {
        const cvData: SavedCVData = {
          personalInfo,
          sections,
          selectedTemplate,
          primaryColor,
          selectedFontId: selectedFont.id,
          spacingDensity,
          fontSizeLevel,
          savedAt: new Date().toISOString(),
          applicationPitch: applicationPitch || undefined,
          targetJdText: currentJdText || locationState?.targetJd || undefined,
          targetRoleTitle: locationState?.targetRole || personalInfo.jobTitle || undefined
        };
        cvService.saveCV(cvData, user?.id);
        const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        setLastSavedTime(`Đã tự động lưu lúc ${timeStr}`);
      } catch (err) {
        console.error('Debounced auto-save error:', err);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [sections, personalInfo, selectedTemplate, primaryColor, selectedFont, spacingDensity, fontSizeLevel, loading, user]);

  // Spec v0.4 - Section 5: State Stack Undo / Redo
  const handleUndoDelete = useCallback(() => {
    if (deletedSectionBackup) {
      setSections(prev => {
        const copy = [...prev];
        copy.splice(deletedSectionBackup.index, 0, deletedSectionBackup.section);
        return copy.map((s, i) => ({ ...s, order_index: i }));
      });
      setDeletedSectionBackup(null);
      setShowUndoToast(false);
    }
  }, [deletedSectionBackup]);

  const pushUndoAction = useCallback((action: any) => {
    setUndoStack(prev => [...prev.slice(-30), action]);
    setRedoStack([]); // Clear redo stack on new fork
  }, []);

  const handleUndo = useCallback(() => {
    setUndoStack(prevUndo => {
      if (prevUndo.length === 0) {
        // Fallback to undo delete toast if stack is empty
        handleUndoDelete();
        return prevUndo;
      }
      const action = prevUndo[prevUndo.length - 1];
      const newUndo = prevUndo.slice(0, -1);

      if (action.type === 'PERSONAL_INFO') {
        setPersonalInfo(p => ({ ...p, [action.field]: action.oldValue }));
      } else if (action.type === 'SECTION_CONTENT') {
        setSections(secs => secs.map(s => s.id === action.sectionId ? { ...s, content: action.oldValue } : s));
      } else if (action.type === 'ITEM_FIELD') {
        setSections(secs => secs.map(s => {
          if (s.id !== action.sectionId || !s.items) return s;
          return {
            ...s,
            items: s.items.map((it: any) => it.id === action.itemId ? { ...it, [action.field]: action.oldValue } : it)
          };
        }));
      } else if (action.type === 'SECTION_DELETE') {
        setSections(secs => {
          const copy = [...secs];
          copy.splice(action.index, 0, action.section);
          return copy.map((s, i) => ({ ...s, order_index: i }));
        });
        setShowUndoToast(false);
      }

      setRedoStack(prevRedo => [...prevRedo, action]);
      return newUndo;
    });
  }, [handleUndoDelete]);

  const handleRedo = useCallback(() => {
    setRedoStack(prevRedo => {
      if (prevRedo.length === 0) return prevRedo;
      const action = prevRedo[prevRedo.length - 1];
      const newRedo = prevRedo.slice(0, -1);

      if (action.type === 'PERSONAL_INFO') {
        setPersonalInfo(p => ({ ...p, [action.field]: action.newValue }));
      } else if (action.type === 'SECTION_CONTENT') {
        setSections(secs => secs.map(s => s.id === action.sectionId ? { ...s, content: action.newValue } : s));
      } else if (action.type === 'ITEM_FIELD') {
        setSections(secs => secs.map(s => {
          if (s.id !== action.sectionId || !s.items) return s;
          return {
            ...s,
            items: s.items.map((it: any) => it.id === action.itemId ? { ...it, [action.field]: action.newValue } : it)
          };
        }));
      } else if (action.type === 'SECTION_DELETE') {
        setSections(secs => secs.filter(s => s.id !== action.section.id));
      }

      setUndoStack(prevUndo => [...prevUndo, action]);
      return newRedo;
    });
  }, []);

  // Global Keyboard Shortcuts (Ctrl+S to save, Ctrl+P to print, Ctrl+Z to undo, Ctrl+Y to redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      if (isCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (isCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (isCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveCV();
      } else if (isCtrl && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [personalInfo, sections, selectedTemplate, primaryColor, selectedFont, spacingDensity, fontSizeLevel, handleUndo, handleRedo]);

  // Section Focus & AI Evaluation Trigger
  const handleFocusSection = (sectionId: string, type: CVSectionType, content: string, domainOverride?: IndustryDomainId) => {
    setActiveSectionId(sectionId);
    const targetSection = sections.find(s => s.id === sectionId);
    const title = targetSection ? targetSection.title : 'Thông tin cá nhân';
    setActiveSectionTitle(title);

    setIsEvaluating(true);
    setTimeout(() => {
      let evalType: CVCoachSection = 'summary';
      if (type === 'projects' || type === 'work_experience') evalType = 'project';
      else if (type === 'skills') evalType = 'skills';
      else if (type === 'objective') evalType = 'summary';
      else evalType = 'contact';

      const domain = domainOverride || selectedDomainId;
      const result = evaluateCvSection(evalType, content, {
        jobTarget: personalInfo.jobTitle,
        domainId: domain
      });
      setActiveEvaluation(result);
      setIsEvaluating(false);
    }, 200);
  };

  // Full ATS Refresh & Re-evaluation Handler for AI ATS Copilot
  const handleRefreshFullAtsEvaluation = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      const fullResult = evaluateFullCv(personalInfo, sections, selectedDomainId);
      setOverallScore(fullResult.overallScore);

      // Re-evaluate the currently active section or fallback to summary
      const targetSec = sections.find(s => s.id === activeSectionId) || sections.find(s => s.type === 'objective') || sections[0];
      if (targetSec) {
        let evalType: CVCoachSection = 'summary';
        if (targetSec.type === 'projects' || targetSec.type === 'work_experience') evalType = 'project';
        else if (targetSec.type === 'skills') evalType = 'skills';
        else if (targetSec.type === 'objective') evalType = 'summary';
        else evalType = 'contact';

        const content = targetSec.content || (targetSec.items && targetSec.items[0]?.description) || '';
        const secEval = evaluateCvSection(evalType, content, {
          jobTarget: personalInfo.jobTitle,
          domainId: selectedDomainId
        });
        setActiveEvaluation(secEval);
      }

      setIsEvaluating(false);
    }, 350);
  };

  const handleSelectDomain = (domainId: IndustryDomainId) => {
    setSelectedDomainId(domainId);
    const fullResult = evaluateFullCv(personalInfo, sections, domainId);
    setOverallScore(fullResult.overallScore);

    const targetSec = sections.find(s => s.id === activeSectionId) || sections.find(s => s.type === 'objective');
    if (targetSec) {
      const content = targetSec.content || (targetSec.items && targetSec.items[0]?.description) || '';
      handleFocusSection(targetSec.id, targetSec.type, content, domainId);
    }
  };

  // Personal Info handlers
  const handleUpdatePersonalInfo = (field: keyof PersonalInfoData, value: any) => {
    setPersonalInfo(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'jobTitle' && value) {
        const detected = detectIndustryDomain(value);
        setSelectedDomainId(detected.id);
      }
      return updated;
    });
  };

  const handleToggleFieldVisibility = (field: keyof PersonalInfoData['visibleFields']) => {
    setPersonalInfo(prev => ({
      ...prev,
      visibleFields: {
        ...prev.visibleFields,
        [field]: !prev.visibleFields[field]
      }
    }));
  };

  // ========================================================
  // SAVE CV & PERSISTENCE HANDLERS
  // ========================================================
  const handleSaveCV = async () => {
    setIsSaving(true);
    try {
      const cvData: SavedCVData = {
        personalInfo,
        sections,
        selectedTemplate,
        primaryColor,
        selectedFontId: selectedFont.id,
        spacingDensity,
        fontSizeLevel,
        savedAt: new Date().toISOString(),
        applicationPitch: applicationPitch || undefined,
        targetJdText: currentJdText || locationState?.targetJd || undefined,
        targetRoleTitle: locationState?.targetRole || personalInfo.jobTitle || undefined
      };

      const result = await cvService.saveCV(cvData, user?.id);

      // Reverse-Sync: Synchronize CV changes back to Profile & Projects
      const reverseSyncResult = await cvService.syncCvToFullProfile({ personalInfo, sections }, user?.id);

      const timeStr = new Date(result.savedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(`Đã lưu lúc ${timeStr}`);

      if (user && reverseSyncResult.summary.length > 0) {
        setSaveToastSubtitle(`Đã đồng bộ vào Hồ sơ: ${reverseSyncResult.summary.join(' • ')}`);
      } else if (!user) {
        setSaveToastSubtitle('Đã lưu CV trên máy. Đăng nhập để đồng bộ trực tiếp vào Hồ sơ!');
        setShowGuestSyncModal(true);
      } else {
        setSaveToastSubtitle('Dữ liệu chỉnh sửa đã được lưu an toàn.');
      }
      setShowSaveSuccessToast(true);
      setTimeout(() => {
        setShowSaveSuccessToast(false);
      }, 3500);
    } catch (err) {
      console.error('Failed to save CV:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePitchFromModal = (pitch: string, jd: string) => {
    setApplicationPitch(pitch);
    setCurrentJdText(jd);
    setSaveToastSubtitle('Đã lưu nội dung Pitch Letter vào bản CV!');
    setShowSaveSuccessToast(true);
    setTimeout(() => setShowSaveSuccessToast(false), 3000);
  };

  const handleResetToOriginal = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản lưu và nạp lại dữ liệu gốc từ hồ sơ sinh viên?')) {
      const storageKey = `profilehub_saved_cv_${user?.id || 'guest'}`;
      localStorage.removeItem(storageKey);
      localStorage.removeItem('profilehub_saved_cv_latest');
      setLastSavedTime(null);
      fetchAllData();
    }
  };

  // Handle importing a candidate CV (from XLSX or sample 100 dataset) into the CV Builder
  const handleImportCandidateIntoCvBuilder = (candidate: ImportedCandidateCv) => {
    const converted = convertImportedCvToCvBuilderState(candidate);
    
    // 1. Update personal info state
    setPersonalInfo(converted.personalInfo);
    
    // 2. Update dynamic CV sections
    setSections(converted.sections);
    
    // 3. Detect and update industry domain
    const detectedDomain = detectIndustryDomain(candidate.target_role);
    setSelectedDomainId(detectedDomain.id);
    
    // 4. Trigger Live AI Coach evaluation for the new summary/objective
    const objectiveSec = converted.sections.find(s => s.type === 'objective');
    if (objectiveSec && objectiveSec.content) {
      const newEval = evaluateCvSection('summary', objectiveSec.content, {
        jobTarget: candidate.target_role,
        domainId: detectedDomain.id
      });
      setActiveEvaluation(newEval);
      setActiveSectionId('sec-objective');
      setActiveSectionTitle('Mục Tiêu Nghề Nghiệp');
    }
    
    // 5. Show success notification
    setShowSaveSuccessToast(true);
    setTimeout(() => {
      setShowSaveSuccessToast(false);
    }, 4000);
  };

  // ========================================================
  // SECTION CRUD & MANAGEMENT HANDLERS
  // ========================================================

  // 1. ADD SECTION (No page reload, prevents duplicate default section)
  const handleAddSection = (type: CVSectionType, customTitle?: string) => {
    const titles: Record<CVSectionType, string> = {
      personal_info: 'THÔNG TIN CÁ NHÂN',
      objective: 'MỤC TIÊU NGHỀ NGHIỆP',
      education: 'HỌC VẤN & BẰNG CẤP',
      work_experience: 'KINH NGHIỆM LÀM VIỆC',
      projects: 'DỰ ÁN & ĐỒ ÁN',
      skills: 'KỸ NĂNG CHUYÊN MÔN',
      certifications: 'CHỨNG CHỈ',
      activities: 'HOẠT ĐỘNG & SỰ KIỆN',
      awards: 'GIẢI THƯỞNG & THÀNH TÍCH',
      languages: 'NGOẠI NGỮ',
      references: 'NGƯỜI THAM CHIẾU',
      custom: customTitle?.toUpperCase() || 'MỤC TÙY CHỈNH'
    };

    const newId = `sec_${type}_${Date.now()}`;
    const newOrder = sections.length;

    let initialContent: string | undefined = undefined;
    let initialItems: any[] | undefined = undefined;

    if (type === 'objective') {
      initialContent = 'Mô tả mục tiêu nghề nghiệp ngắn hạn và dài hạn của bạn...';
    } else {
      const defaultItem = cvService.createDefaultSectionItem(type);
      initialItems = Array.isArray(defaultItem) ? defaultItem : [defaultItem];
    }

    const newSection: CVSection = {
      id: newId,
      type,
      title: titles[type],
      order_index: newOrder,
      is_visible: true,
      settings: {
        showTitle: true,
        showDivider: true,
        spacing: 'normal',
        titleStyle: 'bold',
        titleCase: 'uppercase'
      },
      content: initialContent,
      items: initialItems
    };

    setSections(prev => [...prev, newSection]);
  };

  // 2. DUPLICATE SECTION (Creates deep copy with unique IDs)
  const handleDuplicateSection = (sectionId: string) => {
    setSections(prev => {
      const idx = prev.findIndex(s => s.id === sectionId);
      if (idx === -1) return prev;
      const target = prev[idx];

      const duplicatedItems = target.items
        ? target.items.map(item => ({ ...item, id: `dup_item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` }))
        : undefined;

      const newSection: CVSection = {
        ...target,
        id: `dup_sec_${Date.now()}`,
        title: `${target.title} (Bản sao)`,
        order_index: idx + 1,
        items: duplicatedItems
      };

      const copy = [...prev];
      copy.splice(idx + 1, 0, newSection);
      return copy.map((s, i) => ({ ...s, order_index: i }));
    });
  };

  // 3. HIDE / SHOW SECTION (Data is preserved!)
  const handleToggleHideSection = (sectionId: string) => {
    setSections(prev =>
      prev.map(s => (s.id === sectionId ? { ...s, is_visible: !s.is_visible } : s))
    );
  };

  // 4. MOVE UP / DOWN (Column-Aware for 2-column or unified list for 1-column)
  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    setSections(prev => {
      const targetSec = prev.find(s => s.id === sectionId);
      if (!targetSec) return prev;

      const isTwoCol = ['classic', 'tech', 'pro_split', 'compact_ats'].includes(selectedTemplate);
      const LEFT_TYPES: CVSectionType[] = ['skills', 'certifications', 'languages', 'awards', 'references'];
      const isTargetLeft = LEFT_TYPES.includes(targetSec.type);

      if (isTwoCol) {
        // Find visible sections in the exact same visual column
        const columnSections = prev.filter(s => LEFT_TYPES.includes(s.type) === isTargetLeft);
        const colIdx = columnSections.findIndex(s => s.id === sectionId);
        if (colIdx === -1) return prev;

        const targetColIdx = direction === 'up' ? colIdx - 1 : colIdx + 1;
        if (targetColIdx < 0 || targetColIdx >= columnSections.length) return prev;

        const swapSec = columnSections[targetColIdx];
        const idxA = prev.findIndex(s => s.id === targetSec.id);
        const idxB = prev.findIndex(s => s.id === swapSec.id);

        const copy = [...prev];
        const temp = copy[idxA];
        copy[idxA] = copy[idxB];
        copy[idxB] = temp;
        return copy.map((s, i) => ({ ...s, order_index: i }));
      } else {
        const idx = prev.findIndex(s => s.id === sectionId);
        if (idx === -1) return prev;
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= prev.length) return prev;

        const copy = [...prev];
        const temp = copy[idx];
        copy[idx] = copy[targetIdx];
        copy[targetIdx] = temp;
        return copy.map((s, i) => ({ ...s, order_index: i }));
      }
    });
  };

  // 4b. TOGGLE PAGE BREAK (Chủ động ngắt trang A4 trước một mục)
  const handleTogglePageBreak = (sectionId: string) => {
    setSections(prev =>
      prev.map(s => {
        if (s.id !== sectionId) return s;
        const current = Boolean(s.settings?.pageBreakBefore);
        return {
          ...s,
          settings: {
            ...s.settings,
            pageBreakBefore: !current
          }
        };
      })
    );
  };

  // 5. DRAG & DROP REORDER
  const handleReorderSections = (draggedId: string, targetId: string) => {
    setSections(prev => {
      const draggedIdx = prev.findIndex(s => s.id === draggedId);
      const targetIdx = prev.findIndex(s => s.id === targetId);
      if (draggedIdx === -1 || targetIdx === -1) return prev;

      const copy = [...prev];
      const [draggedItem] = copy.splice(draggedIdx, 1);
      copy.splice(targetIdx, 0, draggedItem);
      return copy.map((s, i) => ({ ...s, order_index: i }));
    });
  };

  // 6. DELETE WITH CONFIRMATION & UNDO TOAST
  const handleRequestDeleteSection = (section: CVSection) => {
    setSectionToDelete(section);
  };

  const handleConfirmDeleteSection = () => {
    if (!sectionToDelete) return;
    const idx = sections.findIndex(s => s.id === sectionToDelete.id);
    setDeletedSectionBackup({ section: sectionToDelete, index: idx });
    setSections(prev => prev.filter(s => s.id !== sectionToDelete.id).map((s, i) => ({ ...s, order_index: i })));
    setSectionToDelete(null);

    // Show Undo Toast for 5s
    setShowUndoToast(true);
    setTimeout(() => {
      setShowUndoToast(false);
    }, 5000);
  };

  // Spec v0.4 - Section 3 BR-06: Deduct AI credit
  const handleDeductAiCredit = useCallback(() => {
    const rem = cvService.deductAiCredit(user?.id);
    setRemainingAiCredits(rem);
  }, [user]);

  // Spec v0.4 - Section 3 BR-02: Opt-in Sync from Master Profile
  const handleAcceptSyncFromProfile = useCallback(() => {
    if (!profileSourceData?.profile) return;
    const p = profileSourceData.profile;
    const oldPersonal = { ...personalInfo };
    const newPersonal: PersonalInfoData = {
      ...personalInfo,
      fullName: p.full_name || personalInfo.fullName,
      jobTitle: p.major || personalInfo.jobTitle,
    };
    setPersonalInfo(newPersonal);
    pushUndoAction({
      type: 'PERSONAL_INFO',
      field: 'fullName',
      oldValue: oldPersonal.fullName,
      newValue: newPersonal.fullName,
      description: 'Đồng bộ từ Hồ sơ gốc'
    });
    setHasProfileDrift(false);
    setShowDriftBanner(false);
  }, [profileSourceData, personalInfo, pushUndoAction]);

  // 7. SECTION SETTINGS (Title, Spacing, Divider, Case)
  const handleSaveSectionSettings = (sectionId: string, updatedTitle: string, updatedSettings: SectionSettings) => {
    setSections(prev =>
      prev.map(s => (s.id === sectionId ? { ...s, title: updatedTitle, settings: updatedSettings } : s))
    );
  };

  // 8. ITEM-LEVEL CRUD HANDLERS
  const handleAddItemToSection = (sectionId: string) => {
    setSections(prev =>
      prev.map(s => {
        if (s.id !== sectionId) return s;
        const itemId = `item_${Date.now()}`;
        let newItem: any = {};

        if (s.type === 'education') {
          newItem = { id: itemId, institution: 'Tên Trường Mới', major: 'Chuyên Ngành', startDate: '2024', endDate: '2026', description: '• Thành tích...' };
        } else if (s.type === 'work_experience') {
          newItem = { id: itemId, company: 'Công Ty Mới', position: 'Vị Trí Mới', startDate: '2025', endDate: 'Hiện tại', description: '• Mô tả công việc...' };
        } else if (s.type === 'projects') {
          newItem = { id: itemId, projectName: 'Tên Dự Án Mới', role: 'Developer', startDate: '2025', endDate: '2026', description: '• Mô tả đồ án...', technologies: ['React'] };
        } else if (s.type === 'skills') {
          newItem = { id: itemId, groupName: 'Nhóm Kỹ Năng Mới', skills: ['Skill 1', 'Skill 2'] };
        } else if (s.type === 'certifications') {
          newItem = { id: itemId, certificateName: 'Chứng Chỉ Mới', organization: 'Đơn Vị Cấp', issueDate: '2026' };
        } else if (s.type === 'activities') {
          newItem = { id: itemId, organization: 'Hoạt Động Mới', role: 'Thành viên', startDate: '2025', endDate: '2026', description: '• Chi tiết...' };
        } else if (s.type === 'awards') {
          newItem = { id: itemId, awardName: 'Giải Thưởng Mới', organization: 'Đơn Vị Cấp', date: '2026' };
        } else if (s.type === 'languages') {
          newItem = { id: itemId, language: 'Ngoại Ngữ Mới', level: 'Giao tiếp' };
        } else if (s.type === 'references') {
          newItem = { id: itemId, name: 'Người Tham Chiếu Mới', position: 'Chức Vụ', company: 'Công Ty', email: 'email@example.com', phone: '0912 345 678' };
        } else {
          newItem = { id: itemId, title: 'Dòng mới', date: '2026', description: 'Mô tả nội dung...' };
        }

        return { ...s, items: [...(s.items || []), newItem] };
      })
    );
  };

  const handleDeleteItemFromSection = (sectionId: string, itemId: string) => {
    setSections(prev =>
      prev.map(s => {
        if (s.id !== sectionId || !s.items) return s;
        return { ...s, items: s.items.filter(item => item.id !== itemId) };
      })
    );
  };

  const handleUpdateItemInSection = (sectionId: string, itemId: string, updated: any) => {
    setSections(prev =>
      prev.map(s => {
        if (s.id !== sectionId || !s.items) return s;
        return {
          ...s,
          items: s.items.map(item => (item.id === itemId ? { ...item, ...updated } : item))
        };
      })
    );
  };

  const handleUpdateProjectDescriptionFromCopilot = (projectId: string, newDescription: string, syncToProfile?: boolean) => {
    const projSec = sections.find(s => s.type === 'projects');
    if (!projSec) return;
    handleUpdateItemInSection(projSec.id, projectId, { description: newDescription });

    if (syncToProfile && user?.id) {
      const projItem = ((projSec.items as ProjectItem[]) || []).find(p => p.id === projectId);
      if (projItem) {
        cvService.syncCvProjectsToMaster([{ ...projItem, description: newDescription }], user.id);
      }
    }
  };

  const handleDuplicateItemInSection = (sectionId: string, itemId: string) => {
    setSections(prev =>
      prev.map(s => {
        if (s.id !== sectionId || !s.items) return s;
        const itemIdx = s.items.findIndex(item => item.id === itemId);
        if (itemIdx === -1) return s;
        const target = s.items[itemIdx];
        const duplicatedItem = {
          ...target,
          id: `dup_item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          title: target.title ? `${target.title} (Bản sao)` : undefined,
          projectName: target.projectName ? `${target.projectName} (Bản sao)` : undefined,
          company: target.company ? `${target.company} (Bản sao)` : undefined
        };
        const copy = [...s.items];
        copy.splice(itemIdx + 1, 0, duplicatedItem);
        return { ...s, items: copy };
      })
    );
  };

  const handleUpdateSection = (sectionId: string, updated: Partial<CVSection>) => {
    setSections(prev =>
      prev.map(s => (s.id === sectionId ? { ...s, ...updated } : s))
    );
  };

  // Import selected projects and certificates from Profile via Checkboxes
  const handleImportFromProfile = (selectedProjects: ProjectItem[], selectedCerts: CertificationItem[]) => {
    setSections(prev => {
      let updated = [...prev];

      if (selectedProjects.length > 0) {
        const projIdx = updated.findIndex(s => s.type === 'projects');
        if (projIdx >= 0) {
          const existing = (updated[projIdx].items as ProjectItem[]) || [];
          updated[projIdx] = {
            ...updated[projIdx],
            items: [...existing, ...selectedProjects]
          };
        } else {
          updated.push({
            id: `sec_projects_${Date.now()}`,
            type: 'projects',
            title: 'DỰ ÁN & ĐỒ ÁN NỔI BẬT',
            order_index: updated.length,
            is_visible: true,
            settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
            items: selectedProjects
          });
        }
      }

      if (selectedCerts.length > 0) {
        const certIdx = updated.findIndex(s => s.type === 'certifications');
        if (certIdx >= 0) {
          const existing = (updated[certIdx].items as CertificationItem[]) || [];
          updated[certIdx] = {
            ...updated[certIdx],
            items: [...existing, ...selectedCerts]
          };
        } else {
          updated.push({
            id: `sec_certs_${Date.now()}`,
            type: 'certifications',
            title: 'CHỨNG CHỈ & BẰNG CẤP',
            order_index: updated.length,
            is_visible: true,
            settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
            items: selectedCerts
          });
        }
      }

      return updated;
    });

    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(`Đã kéo ${selectedProjects.length} dự án & ${selectedCerts.length} chứng chỉ từ hồ sơ (Lúc ${timeStr})`);
    setShowSaveSuccessToast(true);
    setTimeout(() => setShowSaveSuccessToast(false), 3000);
  };

  // 1-Click Auto Fix: write AI suggestion directly to active section/item
  const handleAutoFixActive = (suggestedText: string) => {
    if (!activeSectionId) return;

    setSections(prev =>
      prev.map(s => {
        if (s.id !== activeSectionId) return s;
        if (s.type === 'objective' || s.content !== undefined) {
          return { ...s, content: suggestedText };
        }
        if (s.items && s.items.length > 0) {
          const updatedItems = [...s.items];
          updatedItems[0] = { ...updatedItems[0], description: suggestedText };
          return { ...s, items: updatedItems };
        }
        return s;
      })
    );

    // Re-evaluate
    handleFocusSection(activeSectionId, 'objective', suggestedText);
  };

  // 1-Click Actionable Issues Fix (Zero-Modal Instant Polish)
  const handleApplyQuickFix = (type: 'objective' | 'project' | 'skills' | 'contact' | 'full_polish', payload?: any) => {
    const activeDomain = INDUSTRY_DOMAINS[selectedDomainId] || detectIndustryDomain(personalInfo.jobTitle);

    let nextSections = [...sections];

    if (type === 'objective' || type === 'full_polish') {
      const textToUse = payload?.suggestedText || activeDomain.sampleObjective;
      nextSections = nextSections.map(s => {
        if (s.type === 'objective') {
          return { ...s, content: textToUse };
        }
        return s;
      });
    }

    if (type === 'project' || type === 'full_polish') {
      const targetProjectId = payload?.projectId;
      nextSections = nextSections.map(s => {
        if (s.type !== 'projects' || !s.items) return s;
        return {
          ...s,
          items: s.items.map((item: ProjectItem) => {
            if (targetProjectId && item.id !== targetProjectId) return item;
            const metrics = activeDomain.industryMetrics[0] || 'nâng cao 30% hiệu năng và đảm bảo 99.9% uptime';
            const verb = activeDomain.powerActionVerbs[0] || 'Trực tiếp kiến trúc và phát triển';
            let currentDesc = item.description || '';
            if (!currentDesc.includes('%') && !/\d+/.test(currentDesc)) {
              currentDesc = currentDesc.trim()
                ? `${currentDesc}, ${metrics}.`
                : `• ${verb} giải pháp toàn diện với kiến trúc hiện đại, ${metrics}.`;
            }
            return { ...item, description: currentDesc };
          })
        };
      });
    }

    if (type === 'skills' || type === 'full_polish') {
      const toAdd: string[] = payload?.skillsToAdd || activeDomain.coreSkills.slice(0, 3);
      nextSections = nextSections.map(s => {
        if (s.type !== 'skills') return s;
        if (s.items && s.items.length > 0) {
          const firstGroup = { ...s.items[0] };
          const existing = firstGroup.skills || [];
          const merged = Array.from(new Set([...existing, ...toAdd]));
          firstGroup.skills = merged;
          return { ...s, items: [firstGroup, ...s.items.slice(1)] };
        }
        return {
          ...s,
          items: [{ id: `grp_${Date.now()}`, groupName: 'Kỹ Năng Cốt Lõi', skills: toAdd }]
        };
      });
    }

    if (type === 'contact') {
      setPersonalInfo(prev => ({
        ...prev,
        github: prev.github || 'github.com/profile',
        visibleFields: { ...prev.visibleFields, github: true, linkedin: true }
      }));
    }

    setSections(nextSections);

    // Auto-save immediately
    setTimeout(() => {
      try {
        const cvData: SavedCVData = {
          personalInfo,
          sections: nextSections,
          selectedTemplate,
          primaryColor,
          selectedFontId: selectedFont.id,
          spacingDensity,
          fontSizeLevel,
          savedAt: new Date().toISOString(),
          applicationPitch: applicationPitch || undefined,
          targetJdText: currentJdText || locationState?.targetJd || undefined,
          targetRoleTitle: locationState?.targetRole || personalInfo.jobTitle || undefined
        };
        cvService.saveCV(cvData, user?.id);
        const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        setLastSavedTime(`Đã tự động lưu lúc ${timeStr}`);
      } catch (err) {
        console.error('Save quick fix error:', err);
      }
    }, 100);

    setSaveToastSubtitle(
      type === 'full_polish'
        ? '✨ Đã tối ưu hóa toàn bộ Mục tiêu, STAR & Kỹ năng trên CV!'
        : '⚡ Đã áp dụng sửa lỗi 1-chạm thành công vào CV!'
    );
    setShowSaveSuccessToast(true);
    setTimeout(() => setShowSaveSuccessToast(false), 3000);
  };

  const handlePrint = () => {
    const previousMode = isEditorMode;
    setIsEditorMode(false);
    setTimeout(() => {
      window.print();
      setIsEditorMode(previousMode);
    }, 150);
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      
      {/* CSS @media print Rules for Perfect Clean PDF Printing */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          *, *::before, *::after {
            box-shadow: none !important;
            text-shadow: none !important;
          }
          html, body {
            width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          /* Hide everything in body except the CV Container */
          body * {
            visibility: hidden;
          }
          /* Make CV Containers and its contents visible */
          #cv-preview-a4, #cv-preview-a4 *, .cv-page-sheet, .cv-page-sheet * {
            visibility: visible;
          }
          #cv-preview-a4, .cv-page-sheet {
            display: block !important;
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            height: auto !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            color: #0f172a !important;
            overflow: visible !important;
            font-family: ${selectedFont.font} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .cv-page-sheet {
            page-break-after: always !important;
            break-after: page !important;
          }
          .cv-page-sheet:last-of-type {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .cv-header-block {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            break-after: avoid !important;
            page-break-after: avoid !important;
            height: auto !important;
            overflow: visible !important;
          }
          .cv-section-block {
            break-inside: auto !important;
            page-break-inside: auto !important;
            height: auto !important;
            overflow: visible !important;
          }
          .cv-section-header {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            break-after: avoid !important;
            page-break-after: avoid !important;
          }
          .section-content {
            height: auto !important;
            overflow: visible !important;
          }
          .cv-item-block {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            display: block !important;
            height: auto !important;
            overflow: visible !important;
            margin-bottom: 6px !important;
          }
          input, textarea {
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            background: transparent !important;
            resize: none !important;
            color: inherit !important;
            appearance: none !important;
            -webkit-appearance: none !important;
          }
          input::placeholder, textarea::placeholder {
            color: transparent !important;
          }
        }
      `}</style>

      {/* TOP ACTION BAR - REDESIGNED TO EXACT SPECIFICATION */}
      <header className="h-14 bg-white dark:bg-[#0c101c] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)] print:hidden transition-colors">
        
        {/* Left: App Title, Auto-save status, Undo/Redo, Zoom */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-white flex items-center justify-center font-black text-xs shadow-xs">
              PH
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                AI ATS CV Studio
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden lg:inline">
                Trợ lý thiết kế & Tối ưu hồ sơ
              </span>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Auto-save status */}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>{lastSavedTime || 'Đã tự động lưu 15:16'}</span>
          </div>

          {/* Undo / Redo Buttons (Spec v0.4 - UC-CAN-011) */}
          <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
            <button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              title={`Hoàn tác (Ctrl + Z)${undoStack.length > 0 ? ` [${undoStack.length}]` : ''}`}
              className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              title={`Làm lại (Ctrl + Y)${redoStack.length > 0 ? ` [${redoStack.length}]` : ''}`}
              className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* AI Usage Quota Indicator (Spec v0.4 - BR-06 & UC-SYS-003) */}
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-indigo-950/60 border border-blue-200 dark:border-indigo-800/80 text-blue-700 dark:text-indigo-300 text-[11px] font-bold shadow-2xs"
            title="Hạn mức AI theo quy định Spec: 20 lượt tác vụ/ngày"
          >
            <Zap className="w-3 h-3 text-blue-600 dark:text-indigo-400 fill-blue-600 dark:fill-indigo-400" />
            <span>Còn: <strong>{remainingAiCredits}</strong>/20 lượt AI</span>
          </div>

          {/* Zoom Ratio 100% */}
          <div className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            100%
          </div>
        </div>

        {/* Right: Preview, Share, Export PDF (CTA Blue), Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Xem trước Button */}
          <button
            onClick={() => setIsEditorMode(!isEditorMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              !isEditorMode
                ? 'bg-[#1e3a8a] dark:bg-indigo-600 text-white border-[#1e3a8a] dark:border-indigo-600'
                : 'bg-white dark:bg-[#111728] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">{!isEditorMode ? 'Chế độ Sửa' : 'Xem trước'}</span>
          </button>

          {/* Chia sẻ Button */}
          <button
            onClick={() => setIsCardModalOpen(true)}
            className="px-3 py-1.5 bg-white dark:bg-[#111728] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
            title="Chia sẻ & QR Danh thiếp số"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Chia sẻ</span>
          </button>

          {/* Pitch Letter CTA (ADR 0002) */}
          <button
            onClick={() => setIsPitchModalOpen(true)}
            className="px-3 py-1.5 bg-blue-50 dark:bg-indigo-950/50 hover:bg-blue-100 dark:hover:bg-indigo-950/80 text-[#1e40af] dark:text-indigo-300 border border-blue-200 dark:border-indigo-800/70 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            title="Tạo Thư ứng tuyển theo ngữ cảnh JD (Contextual Application Pitch)"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Pitch Letter</span>
          </button>

          {/* Main CTA: Xuất PDF */}
          <button
            id="btn-save-sync-profile"
            onClick={handleSaveCV}
            disabled={isSaving}
            className="px-3.5 py-2 bg-[#1e3a8a] hover:bg-[#1e40af] dark:bg-indigo-600 dark:hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            title="Lưu bản CV và tự động đồng bộ Họ tên, Kỹ năng, Dự án vào Hồ sơ cá nhân (Ctrl + S)"
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Lưu & Đồng bộ</span>
            <span className="sm:hidden">Lưu</span>
          </button>

          <button
            id="tour-export-pdf"
            onClick={handlePrint}
            className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/25 transition-all active:scale-95 cursor-pointer"
            title="Xuất bản in PDF chuẩn kích thước A4 (Ctrl + P)"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Xuất PDF</span>
          </button>

          {/* User Circular Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#1e3a8a] dark:bg-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-200 dark:ring-indigo-400/40 overflow-hidden shrink-0">
            {personalInfo.fullName ? personalInfo.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4 text-white" />}
          </div>

        </div>

      </header>

      {/* WORKSPACE: 3-PANE RATIO (MAIN CANVAS + AI ATS COPILOT) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Save Success Toast */}
        {showSaveSuccessToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-[#1e3a8a] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-blue-300/30 flex items-center gap-2.5 text-xs animate-in slide-in-from-top-3 duration-200">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">Đã lưu CV thành công!</div>
              <div className="text-[11px] text-blue-200">{saveToastSubtitle}</div>
            </div>
          </div>
        )}

        {/* Undo Toast */}
        {showUndoToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-[#1e3a8a] text-white px-4 py-2.5 rounded-xl shadow-xl border border-blue-300/30 flex items-center gap-3 text-xs animate-in slide-in-from-top-3 duration-200">
            <span>Đã xóa mục <strong className="text-amber-300">{deletedSectionBackup?.section.title}</strong></span>
            <button
              onClick={handleUndoDelete}
              className="px-2.5 py-1 bg-white text-[#1e3a8a] hover:bg-blue-50 rounded-lg font-bold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Hoàn Tác
            </button>
          </div>
        )}

        {/* CENTER PANE: INTERACTIVE A4 CANVAS WITH CANVAS SUB-TOOLBAR */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center bg-[#f8fafc] dark:bg-[#090d16] transition-colors">
          {/* ⚡ 1-Click GitHub & JD Quick Import Bar */}
          <div id="tour-github-import" className="w-full max-w-[210mm]">
            <GitHubQuickImportBar onImportProject={handleImportFromGitHub} targetRole={personalInfo?.jobTitle} />
          </div>
          
          {/* Thanh công cụ phụ của CV (Canvas Sub-toolbar) */}
          <div className="w-full max-w-[210mm] mb-3.5 flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-white dark:bg-[#0f1523] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] print:hidden transition-colors">
            
            {/* Bộ lọc mẫu: ATS Clean Pro (A4) */}
            <div id="tour-template-selector" className="relative">
              <button
                onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#161f36] border border-slate-200 dark:border-slate-700/80 flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <LayoutTemplate className="w-3.5 h-3.5 text-blue-600 dark:text-indigo-400" />
                <span>{TEMPLATES_CONFIG.find(t => t.id === selectedTemplate)?.name || 'ATS Clean Pro (A4)'}</span>
                <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
              </button>

              {showTemplateMenu && (
                <div className="absolute top-full left-0 mt-1.5 w-64 bg-white dark:bg-[#111728] rounded-xl shadow-2xl dark:shadow-[0_12px_40px_rgba(0,0,0,0.7)] border border-slate-200 dark:border-slate-700/80 p-2 z-40 animate-in fade-in duration-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Chọn Mẫu CV
                  </div>
                  {TEMPLATES_CONFIG.map(tmpl => (
                    <button
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl)}
                      className={`w-full p-2 rounded-lg text-left text-xs flex items-center justify-between transition-colors ${
                        selectedTemplate === tmpl.id
                          ? 'bg-blue-50 dark:bg-indigo-950/70 text-blue-700 dark:text-indigo-300 font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{tmpl.name}</div>
                        <div className="text-[10px] text-slate-400">{tmpl.desc}</div>
                      </div>
                      {selectedTemplate === tmpl.id && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-indigo-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Page Budget & Adaptive Layout Controls (Ticket 05) */}
            <div className="flex items-center gap-1.5">
              {/* Quality Check Pill (Feature 9) -> AI Copilot Side-Panel Tab 1 */}
              <button
                type="button"
                onClick={() => setCopilotTab('ats')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                  qualityCheck.passed
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-950/60'
                    : qualityCheck.errorsCount > 0
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-950/60 animate-pulse'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-950/60'
                }`}
                title="Bấm để mở trợ lý ATS & Check trên Side-Panel (Zero-Modal)"
              >
                <span>
                  {qualityCheck.passed
                    ? `🛡️ Chuẩn ATS: ${qualityCheck.score}%`
                    : `⚠️ Điểm: ${qualityCheck.score}% (${qualityCheck.errorsCount} lỗi)`}
                </span>
              </button>

              {/* Page Budget Pill */}
              <div
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                  pageBudget.status === 'optimal'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                    : pageBudget.status === 'warning'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60 animate-pulse'
                }`}
                title="Tỷ lệ lấp đầy trang in A4 thời gian thực"
              >
                <span>📊 {pageBudget.statusText}</span>
              </div>

              {/* 1-Click AI Auto-Condense */}
              {pageBudget.firstPageFillPercent > 85 && (
                <button
                  onClick={handleAutoCondense}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                  title="1-Click AI Auto-Condense: Tự động rút gọn câu từ rườm rà, bảo toàn 100% từ khóa"
                >
                  <Zap className="w-3 h-3" />
                  <span>Thu Gọn</span>
                </button>
              )}

              {/* Adaptive Layout Switcher */}
              <button
                onClick={handleToggleColumns}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-[#151d30] border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
                title="Chuyển đổi luân phiên bố cục 1 cột và 2 cột"
              >
                <span>{isSingleColumnLayout ? '📑 2 Cột' : '📄 1 Cột'}</span>
              </button>
            </div>

            {/* Các công cụ định dạng trang in A4 & đồng bộ dữ liệu */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => {
                  setDesignTab('font');
                  setShowDesignMenu(true);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-[#151d30] border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Tùy chỉnh phông chữ, cỡ chữ, màu sắc và lề trang A4"
              >
                <Palette className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Giao diện & Font</span>
              </button>

              {/* Nút Thứ Tự & Ngắt Trang */}
              <button
                onClick={() => setIsReorderModalOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#eff6ff] dark:bg-indigo-950/40 hover:bg-blue-100 dark:hover:bg-indigo-950/70 text-[#1e40af] dark:text-indigo-300 border border-blue-200 dark:border-indigo-800/60 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Sắp xếp mục nào hiển thị trước, mục nào ra sau hoặc chủ động ngắt trang A4"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-[#1e3a8a] dark:text-indigo-400" />
                <span>Thứ Tự & Ngắt Trang</span>
              </button>

              {/* Nút Kéo Từ Hồ Sơ */}
              <button
                onClick={() => setIsProfilePickerOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#eff6ff] dark:bg-indigo-950/40 hover:bg-blue-100 dark:hover:bg-indigo-950/70 text-[#1e40af] dark:text-indigo-300 border border-blue-200 dark:border-indigo-800/60 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Kéo thông tin dự án và chứng chỉ từ Hồ sơ cá nhân bằng checkbox"
              >
                <FolderKanban className="w-3.5 h-3.5 text-blue-600 dark:text-indigo-400" />
                <span>Kéo Từ Hồ Sơ</span>
              </button>

              {/* Nút Tối ưu STAR 1-Chạm */}
              <button
                onClick={() => handleApplyQuickFix('full_polish')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#eff6ff] dark:bg-indigo-950/40 hover:bg-blue-100 dark:hover:bg-indigo-950/70 text-[#1e40af] dark:text-indigo-300 border border-blue-200 dark:border-indigo-800/60 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                title="Tự động tối ưu toàn diện CV theo chuẩn ATS (1 chạm)"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-indigo-400" />
                <span>✨ Tối Ưu Toàn CV</span>
              </button>

              {/* Quản lý CV Button */}
              <button
                onClick={() => setIsCVManagerOpen(true)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-[#151d30] border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
                title="Quản lý các bản CV"
              >
                <Layers className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span className="hidden sm:inline">Quản Lý ({managedCvList.length || 1})</span>
              </button>
            </div>
          </div>

          {/* Unified Design Menu Modal Dropdown */}
          {showDesignMenu && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 dark:bg-black/70 backdrop-blur-xs p-4">
              <div className="bg-white dark:bg-[#111728] rounded-2xl shadow-2xl dark:shadow-[0_16px_50px_rgba(0,0,0,0.8)] border border-blue-100 dark:border-slate-800 p-5 w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-blue-100 dark:border-slate-800 mb-4">
                  <h4 className="text-sm font-bold text-blue-950 dark:text-slate-100 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-blue-600 dark:text-indigo-400" />
                    Tùy Chỉnh Phông Chữ & Giao Diện CV
                  </h4>
                  <button
                    onClick={() => setShowDesignMenu(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Tabs inside Design Menu */}
                <div className="flex bg-slate-100 dark:bg-[#161f36] p-1 rounded-xl mb-4">
                  <button
                    onClick={() => setDesignTab('font')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      designTab === 'font'
                        ? 'bg-white dark:bg-[#111728] text-blue-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Font & Cỡ Chữ
                  </button>
                  <button
                    onClick={() => setDesignTab('style')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      designTab === 'style'
                        ? 'bg-white dark:bg-[#111728] text-blue-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Màu Sắc & Lề A4
                  </button>
                </div>

                {/* Tab: Font */}
                {designTab === 'font' && (
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                        Phông Chữ Tiếng Việt (Google Fonts)
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {FONT_OPTIONS.map(f => (
                          <button
                            key={f.id}
                            onClick={() => setSelectedFont(f)}
                            className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              selectedFont.id === f.id
                                ? 'bg-blue-50 dark:bg-indigo-950/70 text-blue-700 dark:text-indigo-300 font-bold border border-blue-200 dark:border-indigo-800/80'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent'
                            }`}
                            style={{ fontFamily: f.font }}
                          >
                            <div>
                              <div className="font-bold">{f.name}</div>
                              <div className="text-[10px] text-slate-400 dark:text-slate-500">{f.desc}</div>
                            </div>
                            {selectedFont.id === f.id && <Check className="w-4 h-4 text-blue-600 dark:text-indigo-400" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                        Cỡ Chữ
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(['small', 'medium', 'large'] as const).map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setFontSizeLevel(lvl)}
                            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              fontSizeLevel === lvl
                                ? 'bg-[#2563eb] dark:bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-[#161f36] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                            }`}
                          >
                            {lvl === 'small' ? 'Nhỏ (11px)' : lvl === 'medium' ? 'Vừa (12px)' : 'Lớn (13px)'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Style */}
                {designTab === 'style' && (
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                        Màu Chủ Đạo
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {COLOR_PALETTES.map(col => (
                          <button
                            key={col.hex}
                            onClick={() => setPrimaryColor(col.hex)}
                            className={`p-2.5 rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer ${
                              primaryColor === col.hex
                                ? 'bg-slate-100 dark:bg-[#161f36] font-bold ring-1 ring-blue-500 dark:ring-indigo-500'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/70'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-4 h-4 rounded-full shadow-xs shrink-0" style={{ backgroundColor: col.hex }} />
                              <span className="text-slate-800 dark:text-slate-200 font-medium">{col.name}</span>
                            </div>
                            {primaryColor === col.hex && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-indigo-400" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                        Canh Lề & Mật Độ Khổ Giấy
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(['compact', 'standard', 'relaxed'] as const).map((d) => (
                          <button
                            key={d}
                            onClick={() => setSpacingDensity(d)}
                            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              spacingDensity === d
                                ? 'bg-[#2563eb] dark:bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-[#161f36] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                            }`}
                          >
                            {d === 'compact' ? 'Gọn 1 Trang' : d === 'standard' ? 'Chuẩn Đẹp' : 'Thoáng 2 Trang'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-5 pt-3 border-t border-blue-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => setShowDesignMenu(false)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BR-02: Opt-in Sync Banner */}
          {hasProfileDrift && showDriftBanner && (
            <div className="max-w-[850px] mx-auto mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">🔔</div>
                <div>
                  <strong>Đồng bộ Opt-in (Spec BR-02):</strong> Hồ sơ gốc có thông tin mới hơn bản CV này.
                  <div className="text-[11px] text-amber-700">Hệ thống không tự ý ghi đè dữ liệu. Bạn có muốn đồng bộ các thông tin mới nhất vào CV không?</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAcceptSyncFromProfile}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Đồng bộ ngay
                </button>
                <button
                  onClick={() => setShowDriftBanner(false)}
                  className="px-2.5 py-1.5 rounded-lg border border-amber-300 hover:bg-amber-100 text-amber-800 text-xs transition-colors"
                >
                  Bỏ qua
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64 text-sm text-slate-500">
              ⏳ Đang nạp cấu trúc Section và dữ liệu CV...
            </div>
          ) : (
            <InteractiveCVCanvas
              personalInfo={personalInfo}
              sections={sections}
              primaryColor={primaryColor}
              template={selectedTemplate}
              fontFamily={selectedFont.font}
              spacingDensity={spacingDensity}
              fontSizeLevel={fontSizeLevel}
              activeSectionId={activeSectionId}
              isEditorMode={isEditorMode}
              onUpdatePersonalInfo={handleUpdatePersonalInfo}
              onToggleFieldVisibility={handleToggleFieldVisibility}
              onUpdateSection={handleUpdateSection}
              onUpdateSectionSettings={handleSaveSectionSettings}
              onOpenSettingsModal={(sec) => setSectionToConfigure(sec)}
              onMoveSection={handleMoveSection}
              onReorderSections={handleReorderSections}
              onTogglePageBreak={handleTogglePageBreak}
              onToggleHideSection={handleToggleHideSection}
              onDuplicateSection={handleDuplicateSection}
              onRequestDeleteSection={handleRequestDeleteSection}
              onOpenAddSectionModal={() => setIsAddSectionModalOpen(true)}
              onFocusSection={handleFocusSection}
              onAiOptimizeItem={(secId, itemId, text) => {
                handleFocusSection(secId, 'projects', text);
              }}
              onAddItemToSection={handleAddItemToSection}
              onDeleteItemFromSection={handleDeleteItemFromSection}
              onUpdateItemInSection={handleUpdateItemInSection}
              onDuplicateItemInSection={handleDuplicateItemInSection}
              targetRole={locationState?.targetRole || personalInfo.jobTitle || 'Chuyên viên kỹ thuật'}
              jdContext={locationState?.targetJd || ''}
              remainingCredits={remainingAiCredits}
              onRecordUndo={pushUndoAction}
              onDeductAiCredit={handleDeductAiCredit}
              onOpenProfilePicker={() => setIsProfilePickerOpen(true)}
            />
          )}
        </main>

        {/* RIGHT PANE: AI ATS COPILOT SIDEBAR (3-TAB ZERO-MODAL WORKSPACE) */}
        <aside className="w-80 md:w-96 shrink-0 h-full print:hidden">
          <LiveAICoachPanel
            activeSectionTitle={activeSectionTitle}
            evaluation={activeEvaluation}
            isEvaluating={isEvaluating}
            overallScore={overallScore}
            sections={sections}
            personalInfo={personalInfo}
            onAutoFix={handleAutoFixActive}
            onApplyQuickFix={handleApplyQuickFix}
            currentDomainId={selectedDomainId}
            onSelectDomain={handleSelectDomain}
            onReEvaluateAll={handleRefreshFullAtsEvaluation}
            activeTab={copilotTab}
            onTabChange={setCopilotTab}
            targetRole={locationState?.targetRole || personalInfo.jobTitle || 'Kỹ Sư Phần Mềm'}
            pageBudget={pageBudget}
            onUpdateProjectDescription={handleUpdateProjectDescriptionFromCopilot}
          />
        </aside>

      </div>

      {/* MODALS & DIALOGS */}
      
      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        existingSections={sections}
        onAddSection={handleAddSection}
      />

      {/* Delete Section Dialog */}
      <DeleteSectionDialog
        isOpen={!!sectionToDelete}
        onClose={() => setSectionToDelete(null)}
        onConfirm={handleConfirmDeleteSection}
        sectionTitle={sectionToDelete?.title || ''}
      />

      {/* Section Settings Modal */}
      <SectionSettingsModal
        isOpen={!!sectionToConfigure}
        onClose={() => setSectionToConfigure(null)}
        section={sectionToConfigure}
        onSave={handleSaveSectionSettings}
      />

      {/* Reorder & Page Break Modal */}
      <ReorderSectionsModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        sections={sections}
        template={selectedTemplate}
        onMoveSection={handleMoveSection}
        onTogglePageBreak={handleTogglePageBreak}
        onToggleHideSection={handleToggleHideSection}
      />

      {/* SMART BUSINESS CARD MODAL */}
      <BusinessCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        studentName={personalInfo.fullName || 'Sinh Viên'}
        major={personalInfo.jobTitle || 'Công Nghệ Thông Tin'}
        university={'Đại Học Bách Khoa'}
        email={personalInfo.email || ''}
        username={user?.id || 'student'}
        skills={[]}
        verifiedCount={rawProjects.filter((p: any) => p.is_verified).length}
      />

      {/* FULL AI CV COACH MODAL */}
      <AiCvCoachModal
        isOpen={isCoachModalOpen}
        onClose={() => setIsCoachModalOpen(false)}
        projects={rawProjects}
        onApplyToCv={(data) => {
          if (data.summary) {
            setSections(prev =>
              prev.map(s => (s.type === 'objective' ? { ...s, content: data.summary } : s))
            );
          }
          if (data.skills && data.skills.length > 0) {
            setSections(prev =>
              prev.map(s => {
                if (s.type !== 'skills') return s;
                return {
                  ...s,
                  items: [
                    {
                      id: `grp_ai_${Date.now()}`,
                      groupName: 'Kỹ Năng Đã Tối Ưu Bởi AI',
                      skills: data.skills || []
                    }
                  ]
                };
              })
            );
          }
          if (data.allProjectDescriptions && Object.keys(data.allProjectDescriptions).length > 0) {
            setSections(prev =>
              prev.map(s => {
                if (s.type !== 'projects' || !s.items) return s;
                return {
                  ...s,
                  items: s.items.map(item => {
                    const updatedDesc = data.allProjectDescriptions?.[item.id];
                    return updatedDesc !== undefined ? { ...item, description: updatedDesc } : item;
                  })
                };
              })
            );
          } else if (data.projectDescription && data.selectedProjectId) {
            setSections(prev =>
              prev.map(s => {
                if (s.type !== 'projects' || !s.items) return s;
                return {
                  ...s,
                  items: s.items.map(item =>
                    item.id === data.selectedProjectId ? { ...item, description: data.projectDescription! } : item
                  )
                };
              })
            );
          }
        }}
        initialData={{
          summary: sections.find(s => s.type === 'objective')?.content,
          jobTarget: personalInfo.jobTitle,
          studentName: personalInfo.fullName,
          email: personalInfo.email,
          phone: personalInfo.phone
        }}
      />

      {/* Multi-CV Management Modal */}
      <CVManagerModal
        isOpen={isCVManagerOpen}
        onClose={() => setIsCVManagerOpen(false)}
        userId={user?.id}
        activeCvId={activeCvId}
        profileSourceData={profileSourceData}
        userEmail={user?.email}
        onSelectCV={handleSelectCVFromManager}
        onCVsUpdated={refreshCVList}
      />

      {/* Bulk Excel & 100 Sample CV Import Modal */}
      <BulkCvImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        title="Nhập CV Nhanh Bằng Excel (.xlsx) / 100 CV Mẫu Cho AI CV Builder"
        subtitle="Chọn từ 100 CV mẫu chuẩn hóa hoặc tải lên file Excel để nạp tức thì vào CV Builder, tự động khớp chuyên ngành & kích hoạt AI Live Coach."
        onSelectCandidate={handleImportCandidateIntoCvBuilder}
      />

      {/* Profile Data Picker Modal (Kéo Dự Án & Chứng Chỉ Qua Checkbox) */}
      <ProfileDataPickerModal
        isOpen={isProfilePickerOpen}
        onClose={() => setIsProfilePickerOpen(false)}
        profileData={profileSourceData}
        currentSections={sections}
        onImport={handleImportFromProfile}
      />

      {/* Project Fit Explainer Modal (Ticket 03) */}
      <ProjectFitExplainerModal
        isOpen={isProjectFitModalOpen}
        onClose={() => setIsProjectFitModalOpen(false)}
        projects={rawProjects}
        onApplySelectedProjects={handleApplyProjectsFromFitExplainer}
      />

      {/* Contextual Application Pitch Modal (ADR 0002) */}
      <ApplicationPitchModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
        applicantName={personalInfo.fullName}
        targetRole={locationState?.targetRole || personalInfo.jobTitle || 'Lập trình viên'}
        initialJd={currentJdText || locationState?.targetJd || ''}
        projects={
          sections.filter(s => s.type === 'projects').flatMap(s => (s.items as ProjectItem[]) || []).length > 0
            ? sections.filter(s => s.type === 'projects').flatMap(s => (s.items as ProjectItem[]) || [])
            : rawProjects
        }
        savedPitch={applicationPitch}
        onSavePitch={handleSavePitchFromModal}
      />

      {/* STAR Diagnostic & Guided Elicitation Modal */}
      <StarCvDiagnosticModal
        isOpen={isStarDiagnosticModalOpen}
        onClose={() => setIsStarDiagnosticModalOpen(false)}
        onApplyProjectBullets={handleApplyProjectFromDiagnostic}
      />

      {/* Feature 9: Rule-Engine CV Quality Check Modal */}
      <CVQualityCheckModal
        isOpen={isQualityCheckModalOpen}
        onClose={() => setIsQualityCheckModalOpen(false)}
        result={qualityCheck}
      />

      {/* ATS Parser Eye-View Modal */}
      <AtsParserEyeModal
        isOpen={isAtsParserEyeOpen}
        onClose={() => setIsAtsParserEyeOpen(false)}
        auditResult={atsAuditResult}
        currentTemplate={selectedTemplate}
        onSwitchToSingleColumn={handleSwitchToMinimal}
      />

      {/* Salary Benchmark Modal */}
      <SalaryBenchmarkModal
        isOpen={isSalaryBenchmarkOpen}
        onClose={() => setIsSalaryBenchmarkOpen(false)}
        initialRole={locationState?.targetRole || personalInfo.jobTitle || 'Kỹ Sư Phần Mềm'}
        techStack={sections.filter(s => s.type === 'skills').flatMap(s => (s.items as any[]) || []).flatMap(i => i.skills || [i.name || i])}
        verifiedProjectsCount={sections.filter(s => s.type === 'projects').flatMap(s => (s.items as any[]) || []).length}
      />

      {/* AI Mock Interview Modal */}
      <AiMockInterviewModal
        isOpen={isAiMockInterviewOpen}
        onClose={() => setIsAiMockInterviewOpen(false)}
        candidateName={personalInfo.fullName || 'Bạn'}
        roleTitle={locationState?.targetRole || personalInfo.jobTitle || 'Kỹ Sư Phần Mềm'}
        projectName={sections.filter(s => s.type === 'projects').flatMap(s => (s.items as any[]) || [])[0]?.title || 'E-Commerce Platform'}
        techStack={sections.filter(s => s.type === 'skills').flatMap(s => (s.items as any[]) || []).flatMap(i => i.skills || [i.name || i])}
      />

          {/* GUEST PERSISTENCE MODAL */}
      {showGuestSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-900">
              Bản CV đã lưu thành công trên máy!
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Bạn đang trải nghiệm ở chế độ Khách. Để tự động đồng bộ <strong>Dự án</strong>, <strong>Kỹ năng</strong> và <strong>Thông tin cá nhân</strong> này vào <strong>Hồ sơ năng lực (Profile)</strong> vĩnh viễn trên mọi thiết bị, bạn có thể đăng nhập nhanh bằng GitHub.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 px-4 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-blue-900/20 transition-all cursor-pointer"
              >
                <span>Đăng nhập với GitHub để đồng bộ ngay</span>
              </button>
              <button
                onClick={() => setShowGuestSyncModal(false)}
                className="w-full py-2 px-4 text-slate-500 hover:text-slate-700 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              >
                Để sau, tiếp tục chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}