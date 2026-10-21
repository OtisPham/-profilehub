import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabase';
import BusinessCardModal from '../../components/qr/BusinessCardModal';
import AiCvCoachModal from '../../components/cv/AiCvCoachModal';
import AddSectionModal from '../../components/cv/AddSectionModal';
import DeleteSectionDialog from '../../components/cv/DeleteSectionDialog';
import SectionSettingsModal from '../../components/cv/SectionSettingsModal';
import InteractiveCVCanvas from '../../components/cv/InteractiveCVCanvas';
import LiveAICoachPanel from '../../components/cv/LiveAICoachPanel';
import BulkCvImportModal from '../../components/recruiter/BulkCvImportModal';
import CVManagerModal from '../../components/cv/CVManagerModal';
import ProfileDataPickerModal from '../../components/cv/ProfileDataPickerModal';
import ProjectFitExplainerModal from '../../components/cv/ProjectFitExplainerModal';
import ApplicationPitchModal from '../../components/cv/ApplicationPitchModal';
import StarCvDiagnosticModal from '../../components/cv/StarCvDiagnosticModal';
import { pageBudgetService } from '../../services/pageBudgetService';
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
  Wand2,
  Zap
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

  // PERSONAL INFORMATION (HEADER SECTION)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    facebook: '',
    linkedin: '',
    website: '',
    location: 'TP. Hồ Chí Minh',
    avatarUrl: '',
    visibleFields: {
      phone: true,
      email: true,
      facebook: true,
      linkedin: true,
      website: true,
      location: true,
      avatarUrl: true
    }
  });

  // CV DYNAMIC SECTIONS LIST
  const [sections, setSections] = useState<CVSection[]>([]);

  // AI REAL-TIME EVALUATION PANEL STATES
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

  const isSingleColumnLayout = selectedTemplate === 'minimal' || selectedTemplate === 'executive';

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

      // Ticket 01: Reverse sync projects to master profile
      const projectSections = sections.filter(s => s.type === 'projects');
      const allProjects: ProjectItem[] = projectSections.flatMap(s => (s.items as ProjectItem[]) || []);
      const syncResult = await cvService.syncCvProjectsToMaster(allProjects, user?.id);

      if (user) {
        try {
          const summaryContent = sections.find(s => s.type === 'objective')?.content;
          if (summaryContent) {
            await supabase.from('student_profiles').update({ bio: summaryContent }).eq('id', user.id);
          }
        } catch (dbErr) {
          console.warn('Database background backup notice:', dbErr);
        }
      }

      const timeStr = new Date(result.savedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(`Đã lưu lúc ${timeStr}`);
      if (syncResult && syncResult.syncedProjects.length > 0) {
        setSaveToastSubtitle(`Đã đồng bộ ${syncResult.syncedProjects.length} dự án mới vào Kho Quản lý dự án!`);
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

  // 4. MOVE UP / DOWN
  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    setSections(prev => {
      const idx = prev.findIndex(s => s.id === sectionId);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;

      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy.map((s, i) => ({ ...s, order_index: i }));
    });
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

  const handlePrint = () => {
    const previousMode = isEditorMode;
    setIsEditorMode(false);
    setTimeout(() => {
      window.print();
      setIsEditorMode(previousMode);
    }, 150);
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col bg-slate-100 dark:bg-slate-950 overflow-hidden font-sans">
      
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
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20 shadow-2xs print:hidden">
        
        {/* Left: App Title, Auto-save status, Undo/Redo, Zoom */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
              PH
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                AI ATS CV Studio
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden lg:inline">
                Trợ lý thiết kế & Tối ưu hồ sơ
              </span>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          {/* Auto-save status */}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>{lastSavedTime || 'Đã tự động lưu 15:16'}</span>
          </div>

          {/* Undo / Redo Buttons (Spec v0.4 - UC-CAN-011) */}
          <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
            <button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              title={`Hoàn tác (Ctrl + Z)${undoStack.length > 0 ? ` [${undoStack.length}]` : ''}`}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              title={`Làm lại (Ctrl + Y)${redoStack.length > 0 ? ` [${redoStack.length}]` : ''}`}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* AI Usage Quota Indicator (Spec v0.4 - BR-06 & UC-SYS-003) */}
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[11px] font-bold shadow-2xs"
            title="Hạn mức AI theo quy định Spec: 20 lượt tác vụ/ngày"
          >
            <Zap className="w-3 h-3 text-purple-600 fill-purple-600" />
            <span>Còn: <strong>{remainingAiCredits}</strong>/20 lượt AI</span>
          </div>

          {/* Zoom Ratio 100% */}
          <div className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            100%
          </div>
        </div>

        {/* Right: Preview, Share, Export PDF (CTA Indigo), Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Xem trước Button */}
          <button
            onClick={() => setIsEditorMode(!isEditorMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              !isEditorMode
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">{!isEditorMode ? 'Chế độ Sửa' : 'Xem trước'}</span>
          </button>

          {/* Chia sẻ Button */}
          <button
            onClick={() => setIsCardModalOpen(true)}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
            title="Chia sẻ & QR Danh thiếp số"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Chia sẻ</span>
          </button>

          {/* Pitch Letter CTA (ADR 0002) */}
          <button
            onClick={() => setIsPitchModalOpen(true)}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            title="Tạo Thư ứng tuyển theo ngữ cảnh JD (Contextual Application Pitch)"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Pitch Letter</span>
          </button>

          {/* Main CTA: Xuất PDF (Màu xanh tím nổi bật) */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/25 transition-all active:scale-95 cursor-pointer"
            title="Xuất bản in PDF chuẩn kích thước A4 (Ctrl + P)"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Xuất PDF</span>
          </button>

          {/* User Circular Avatar */}
          <div className="w-8 h-8 rounded-full ring-2 ring-indigo-200 dark:ring-indigo-800 overflow-hidden bg-slate-200 dark:bg-slate-750 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </div>

        </div>

      </header>

      {/* WORKSPACE: 3-PANE RATIO (MAIN CANVAS + AI ATS COPILOT) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Save Success Toast */}
        {showSaveSuccessToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-2.5 text-xs animate-in slide-in-from-top-3 duration-200">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-emerald-300">Đã lưu CV thành công!</div>
              <div className="text-[11px] text-slate-300">{saveToastSubtitle}</div>
            </div>
          </div>
        )}

        {/* Undo Toast */}
        {showUndoToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs animate-in slide-in-from-top-3 duration-200">
            <span>Đã xóa mục <strong className="text-rose-300">{deletedSectionBackup?.section.title}</strong></span>
            <button
              onClick={handleUndoDelete}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Hoàn Tác
            </button>
          </div>
        )}

        {/* CENTER PANE: INTERACTIVE A4 CANVAS WITH CANVAS SUB-TOOLBAR */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center bg-[#f1f5f9] dark:bg-slate-950">
          
          {/* Thanh công cụ phụ của CV (Canvas Sub-toolbar) */}
          <div className="w-full max-w-[210mm] mb-3.5 flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs print:hidden">
            
            {/* Bộ lọc mẫu: ATS Clean Pro (A4) */}
            <div className="relative">
              <button
                onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-750 transition-all"
              >
                <LayoutTemplate className="w-3.5 h-3.5 text-indigo-600" />
                <span>{TEMPLATES_CONFIG.find(t => t.id === selectedTemplate)?.name || 'ATS Clean Pro (A4)'}</span>
                <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
              </button>

              {showTemplateMenu && (
                <div className="absolute top-full left-0 mt-1.5 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-40 animate-in fade-in duration-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Chọn Mẫu CV
                  </div>
                  {TEMPLATES_CONFIG.map(tmpl => (
                    <button
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl)}
                      className={`w-full p-2 rounded-lg text-left text-xs flex items-center justify-between transition-colors ${
                        selectedTemplate === tmpl.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{tmpl.name}</div>
                        <div className="text-[10px] text-slate-400">{tmpl.desc}</div>
                      </div>
                      {selectedTemplate === tmpl.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Page Budget & Adaptive Layout Controls (Ticket 05) */}
            <div className="flex items-center gap-1.5">
              {/* Page Budget Pill */}
              <div
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                  pageBudget.status === 'optimal'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : pageBudget.status === 'warning'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse'
                }`}
                title="Tỷ lệ lấp đầy trang in A4 thời gian thực"
              >
                <span>📊 {pageBudget.statusText}</span>
              </div>

              {/* 1-Click AI Auto-Condense */}
              {pageBudget.firstPageFillPercent > 85 && (
                <button
                  onClick={handleAutoCondense}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1 transition-all shadow-xs"
                  title="1-Click AI Auto-Condense: Tự động rút gọn câu từ rườm rà, bảo toàn 100% từ khóa"
                >
                  <Zap className="w-3 h-3" />
                  <span>Thu Gọn</span>
                </button>
              )}

              {/* Adaptive Layout Switcher */}
              <button
                onClick={handleToggleColumns}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-all"
                title="Chuyển đổi luân phiên bố cục 1 cột và 2 cột"
              >
                <span>{isSingleColumnLayout ? '📑 2 Cột' : '📄 1 Cột'}</span>
              </button>
            </div>

            {/* Các nút tùy chỉnh: Giao diện & Font, Tối ưu STAR, Kéo từ hồ sơ, Tuyển chọn JD */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Nút Soi CV & Khai Thác STAR */}
              <button
                onClick={() => setIsStarDiagnosticModalOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                title="Chẩn đoán câu chữ mơ hồ, soi lỗi thiếu STAR hoặc tạo mới từ trang giấy trắng"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Soi & Khai Thác STAR</span>
              </button>

              {/* Nút Tuyển Chọn Theo JD (Fit Explainer - Ticket 03) */}
              <button
                onClick={() => setIsProjectFitModalOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80 flex items-center gap-1.5 transition-all shadow-2xs"
                title="Đối chiếu các dự án trong kho với JD văn bản dán vào và xếp hạng % phù hợp"
              >
                <Target className="w-3.5 h-3.5 text-purple-600" />
                <span>Fit Theo JD</span>
              </button>

              <button
                onClick={() => {
                  setDesignTab('font');
                  setShowDesignMenu(true);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all shadow-2xs"
                title="Tùy chỉnh phông chữ, cỡ chữ, màu sắc và lề trang A4"
              >
                <Palette className="w-3.5 h-3.5 text-slate-500" />
                <span>Giao diện & Font</span>
              </button>

              {/* Nút Kéo Từ Hồ Sơ */}
              <button
                onClick={() => setIsProfilePickerOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 flex items-center gap-1.5 transition-all shadow-2xs"
                title="Kéo thông tin dự án và chứng chỉ từ Hồ sơ cá nhân bằng checkbox"
              >
                <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
                <span>Kéo Từ Hồ Sơ</span>
              </button>

              {/* Nút Tối ưu STAR màu tím */}
              <button
                onClick={() => setIsCoachModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Tối ưu STAR</span>
              </button>

              {/* Quản lý CV Button */}
              <button
                onClick={() => setIsCVManagerOpen(true)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-all"
                title="Quản lý các bản CV"
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Quản Lý ({managedCvList.length || 1})</span>
              </button>
            </div>
          </div>

          {/* Unified Design Menu Modal Dropdown */}
          {showDesignMenu && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/30 backdrop-blur-xs p-4">
              <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-5 w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-blue-100 mb-4">
                  <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-blue-600" />
                    Tùy Chỉnh Phông Chữ & Giao Diện CV
                  </h4>
                  <button
                    onClick={() => setShowDesignMenu(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                {/* Tabs inside Design Menu */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4">
                  <button
                    onClick={() => setDesignTab('font')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      designTab === 'font' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Font & Cỡ Chữ
                  </button>
                  <button
                    onClick={() => setDesignTab('style')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      designTab === 'style' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Màu Sắc & Lề A4
                  </button>
                </div>

                {/* Tab: Font */}
                {designTab === 'font' && (
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Phông Chữ Tiếng Việt (Google Fonts)
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {FONT_OPTIONS.map(f => (
                          <button
                            key={f.id}
                            onClick={() => setSelectedFont(f)}
                            className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
                              selectedFont.id === f.id
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                            }`}
                            style={{ fontFamily: f.font }}
                          >
                            <div>
                              <div className="font-bold">{f.name}</div>
                              <div className="text-[10px] text-slate-400">{f.desc}</div>
                            </div>
                            {selectedFont.id === f.id && <Check className="w-4 h-4 text-indigo-600" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Cỡ Chữ
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(['small', 'medium', 'large'] as const).map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setFontSizeLevel(lvl)}
                            className={`py-2 rounded-xl text-xs font-bold transition-all ${
                              fontSizeLevel === lvl
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
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
                      <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Màu Chủ Đạo
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {COLOR_PALETTES.map(col => (
                          <button
                            key={col.hex}
                            onClick={() => setPrimaryColor(col.hex)}
                            className={`p-2.5 rounded-xl flex items-center justify-between text-xs transition-all ${
                              primaryColor === col.hex
                                ? 'bg-slate-100 dark:bg-slate-800 font-bold ring-1 ring-indigo-500'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-850'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-4 h-4 rounded-full shadow-xs shrink-0" style={{ backgroundColor: col.hex }} />
                              <span className="text-slate-800 dark:text-slate-200 font-medium">{col.name}</span>
                            </div>
                            {primaryColor === col.hex && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Canh Lề & Mật Độ Khổ Giấy
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(['compact', 'standard', 'relaxed'] as const).map((d) => (
                          <button
                            key={d}
                            onClick={() => setSpacingDensity(d)}
                            className={`py-2 rounded-xl text-xs font-bold transition-all ${
                              spacingDensity === d
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {d === 'compact' ? 'Gọn 1 Trang' : d === 'standard' ? 'Chuẩn Đẹp' : 'Thoáng 2 Trang'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-5 pt-3 border-t border-blue-100 flex justify-end">
                  <button
                    onClick={() => setShowDesignMenu(false)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BR-02: Opt-in Sync Banner */}
          {hasProfileDrift && showDriftBanner && (
            <div className="max-w-[850px] mx-auto mb-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">🔔</div>
                <div>
                  <strong>Đồng bộ Opt-in (Spec BR-02):</strong> Hồ sơ gốc có thông tin mới hơn bản CV này.
                  <div className="text-[11px] text-amber-700 dark:text-amber-400">Hệ thống không tự ý ghi đè dữ liệu. Bạn có muốn đồng bộ các thông tin mới nhất vào CV không?</div>
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
                  className="px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs transition-colors"
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

        {/* RIGHT PANE: AI ATS COPILOT SIDEBAR */}
        <aside className="w-80 md:w-96 shrink-0 h-full print:hidden">
          <LiveAICoachPanel
            activeSectionTitle={activeSectionTitle}
            evaluation={activeEvaluation}
            isEvaluating={isEvaluating}
            overallScore={overallScore}
            onAutoFix={handleAutoFixActive}
            onOpenFullCoach={() => setIsCoachModalOpen(true)}
            currentDomainId={selectedDomainId}
            onSelectDomain={handleSelectDomain}
            onReEvaluateAll={handleRefreshFullAtsEvaluation}
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

    </div>
  );
}