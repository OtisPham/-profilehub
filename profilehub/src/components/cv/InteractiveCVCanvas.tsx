import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Award,
  Layers,
  GraduationCap,
  Briefcase,
  FolderGit2,
  FileText,
  Copy,
  Settings,
  Eye,
  EyeOff,
  GripVertical,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Globe,
  Facebook,
  Linkedin,
  Calendar,
  Tag,
  CheckCircle2,
  Users,
  Trophy,
  Languages as LanguagesIcon,
  UserCheck,
  PlusCircle,
  AlertCircle,
  FolderKanban,
  Edit3,
  ShieldAlert
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import StarDiffReviewModal from './StarDiffReviewModal';
import ProjectDefenseModal from './ProjectDefenseModal';
import type { CVTemplateType } from './CVTemplates';
import InlineEditPopover from './InlineEditPopover';
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

export interface PageSectionBlock {
  section: CVSection;
  isContinuation?: boolean;
  items?: any[];
  isObjectiveOrCustom?: boolean;
  content?: string;
  showAddButton?: boolean;
  hideHeader?: boolean;
}

export interface CVPage {
  pageNumber: number;
  hasHeader: boolean;
  sections: PageSectionBlock[];
  leftSections?: PageSectionBlock[];
  rightSections?: PageSectionBlock[];
}

interface InteractiveCVCanvasProps {
  personalInfo: PersonalInfoData;
  sections: CVSection[];
  primaryColor: string;
  template: CVTemplateType;
  fontFamily: string;
  spacingDensity?: 'compact' | 'standard' | 'relaxed';
  fontSizeLevel?: 'small' | 'medium' | 'large';
  activeSectionId: string | null;
  isEditorMode?: boolean;
  onUpdatePersonalInfo: (field: keyof PersonalInfoData, value: any) => void;
  onToggleFieldVisibility: (field: keyof PersonalInfoData['visibleFields']) => void;
  onUpdateSection: (sectionId: string, updated: Partial<CVSection>) => void;
  onUpdateSectionSettings: (sectionId: string, updatedTitle: string, settings: SectionSettings) => void;
  onOpenSettingsModal: (section: CVSection) => void;
  onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
  onReorderSections?: (draggedId: string, targetId: string) => void;
  onToggleHideSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onRequestDeleteSection: (section: CVSection) => void;
  onOpenAddSectionModal: () => void;
  onFocusSection: (sectionId: string, type: CVSectionType, content: string) => void;
  onAiOptimizeItem?: (sectionId: string, itemId: string, currentText: string) => void;
  // Item-level handlers
  onAddItemToSection: (sectionId: string) => void;
  onDeleteItemFromSection: (sectionId: string, itemId: string) => void;
  onUpdateItemInSection: (sectionId: string, itemId: string, updated: any) => void;
  onDuplicateItemInSection?: (sectionId: string, itemId: string) => void;
  // Contextual AI & Undo props (Spec v0.4)
  targetRole?: string;
  jdContext?: string;
  remainingCredits?: number;
  onRecordUndo?: (record: any) => void;
  onDeductAiCredit?: () => void;
  onOpenProfilePicker?: (initialTab?: 'projects' | 'certificates') => void;
}

/**
 * Pure Document Flow Auto-Expanding Textarea:
 * Never forces height. Grows strictly to fit content without scrollbars.
 */
export function AutoExpandingTextarea({
  value,
  onChange,
  placeholder,
  className = '',
  style = {},
  readOnly = false
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  readOnly?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        resize();
      }}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full overflow-hidden resize-none bg-transparent border-none outline-none leading-relaxed transition-height duration-75 block ${className}`}
      style={{ ...style, height: 'auto' }}
      rows={1}
    />
  );
}

export default function InteractiveCVCanvas({
  personalInfo,
  sections,
  primaryColor,
  template,
  fontFamily,
  spacingDensity = 'standard',
  fontSizeLevel = 'medium',
  activeSectionId,
  isEditorMode = true,
  onUpdatePersonalInfo,
  onToggleFieldVisibility,
  onUpdateSection,
  onUpdateSectionSettings,
  onOpenSettingsModal,
  onMoveSection,
  onReorderSections,
  onToggleHideSection,
  onDuplicateSection,
  onRequestDeleteSection,
  onOpenAddSectionModal,
  onFocusSection,
  onAiOptimizeItem,
  onAddItemToSection,
  onDeleteItemFromSection,
  onUpdateItemInSection,
  onDuplicateItemInSection,
  targetRole = 'Chuyên viên kỹ thuật',
  jdContext = '',
  remainingCredits = 20,
  onRecordUndo,
  onDeductAiCredit,
  onOpenProfilePicker
}: InteractiveCVCanvasProps) {
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const measureContainerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<CVPage[]>([{ pageNumber: 1, hasHeader: true, sections: [] }]);

  // Inline Edit Popover State (Spec v0.4 - UC-CAN-009 & UC-CAN-010)
  const [inlineEditState, setInlineEditState] = useState<{
    isOpen: boolean;
    initialText: string;
    fieldLabel: string;
    onSave: (text: string) => void;
    onApplyAi: (text: string) => void;
  }>({
    isOpen: false,
    initialText: '',
    fieldLabel: '',
    onSave: () => {},
    onApplyAi: () => {},
  });

  const openInlineEditor = (options: {
    initialText: string;
    fieldLabel: string;
    onSave: (text: string) => void;
    onApplyAi: (text: string) => void;
  }) => {
    setInlineEditState({
      isOpen: true,
      initialText: options.initialText,
      fieldLabel: options.fieldLabel,
      onSave: options.onSave,
      onApplyAi: options.onApplyAi,
    });
  };

  // STAR Diff Review Modal State (Ticket 04)
  const [starProjectToReview, setStarProjectToReview] = useState<(ProjectItem & { _sectionId: string }) | null>(null);

  // Project Technical Defense Modal State (Trụ Cột 3)
  const [defenseProjectToReview, setDefenseProjectToReview] = useState<ProjectItem | null>(null);

  // Spacing presets
  const paddingMap = {
    compact: 'p-[8mm]',
    standard: 'p-[11mm]',
    relaxed: 'p-[14mm]'
  };

  const sectionSpacingMap = {
    compact: 'space-y-2.5',
    standard: 'space-y-3.5',
    relaxed: 'space-y-5'
  };

  const textScaleMap = {
    small: 'text-[11px]',
    medium: 'text-xs',
    large: 'text-[13px]'
  };

  const baseTextSize = textScaleMap[fontSizeLevel];

  // Helper: Format section title case based on settings
  const formatTitle = (title: string, titleCase?: string) => {
    if (!title) return '';
    if (titleCase === 'uppercase') return title.toUpperCase();
    if (titleCase === 'capitalize') {
      return title.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());
    }
    return title;
  };

  // Drag & Drop
  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (!isEditorMode) return;
    setDraggedSectionId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedSectionId && draggedSectionId !== targetId && onReorderSections) {
      onReorderSections(draggedSectionId, targetId);
    }
    setDraggedSectionId(null);
  };

  // ----------------------------------------------------
  // WYSIWYG A4 PAGINATION COMPUTATION ENGINE (2-COLUMN & 1-COLUMN)
  // ----------------------------------------------------
  useLayoutEffect(() => {
    const visibleSections = sections.filter(s => s.is_visible);
    if (visibleSections.length === 0) {
      setPages([{ pageNumber: 1, hasHeader: true, sections: [] }]);
      return;
    }

    // A4 Physical Constants in CSS Pixels (96 DPI):
    // 297mm ≈ 1122.5px
    const A4_HEIGHT_PX = 1122.5;
    const PADDING_V_PX = spacingDensity === 'compact' ? 52 : spacingDensity === 'relaxed' ? 106 : 80;
    // Usable vertical budget per page (with bottom safety margin for pristine spacing)
    const USABLE_PAGE_HEIGHT = A4_HEIGHT_PX - PADDING_V_PX - 20;

    // Helper functions to measure or estimate element heights accurately
    const getHeaderHeight = () => {
      const el = document.getElementById('cv-measure-header');
      if (el && el.offsetHeight > 0) return el.offsetHeight + 14;
      return 130;
    };

    const getObjectiveHeight = (sec: CVSection) => {
      const el = document.getElementById(`cv-measure-sec-${sec.id}`);
      if (el && el.offsetHeight > 0) return el.offsetHeight + 12;
      const lines = (sec.content || '').split('\n').length;
      return 40 + Math.max(1, lines) * 18;
    };

    const getSectionHeaderHeight = (sec: CVSection) => {
      const el = document.getElementById(`cv-measure-header-${sec.id}`);
      if (el && el.offsetHeight > 0) return el.offsetHeight + 8;
      return 30;
    };

    const getItemHeight = (item: any, secType: CVSectionType) => {
      const el = document.getElementById(`cv-measure-item-${item.id}`);
      if (el && el.offsetHeight > 0) return el.offsetHeight + 10;
      
      // Heuristic fallback based on item content
      if (secType === 'projects') {
        const descLen = (item.description || '').length;
        return 56 + Math.ceil(descLen / 70) * 16;
      }
      if (secType === 'education' || secType === 'work_experience') {
        const descLen = (item.description || '').length;
        return 50 + Math.ceil(descLen / 75) * 16;
      }
      if (secType === 'skills') {
        const skillCount = (item.skills || []).length;
        return 30 + Math.ceil(skillCount / 3) * 20;
      }
      if (secType === 'certifications' || secType === 'awards') return 44;
      return 48;
    };

    // Generic partition function that splits an array of CVSections into pages
    const partitionSectionList = (
      sectionList: CVSection[],
      initialTopHeight: number,
      usableHeight: number
    ): PageSectionBlock[][] => {
      const resultPages: PageSectionBlock[][] = [];
      let currentPageBlocks: PageSectionBlock[] = [];
      let currentHeight = initialTopHeight;

      for (const section of sectionList) {
        const secHeaderHeight = getSectionHeaderHeight(section);
        const items = section.items || [];

        if (items.length === 0) {
          const contentHeight = getObjectiveHeight(section);
          const totalBlockHeight = secHeaderHeight + contentHeight + 10;

          if (currentHeight + totalBlockHeight > usableHeight && currentHeight > 140) {
            resultPages.push(currentPageBlocks);
            currentPageBlocks = [];
            currentHeight = 0;
          }

          currentPageBlocks.push({
            section,
            isObjectiveOrCustom: true,
            content: section.content,
            showAddButton: false
          });
          currentHeight += totalBlockHeight;
        } else {
          let currentSectionOnPage: PageSectionBlock | null = null;

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemHeight = getItemHeight(item, section.type);
            const isFirstItemInSection = currentSectionOnPage === null;
            const neededHeight = isFirstItemInSection ? (secHeaderHeight + itemHeight + 12) : (itemHeight + 8);

            if (currentHeight + neededHeight > usableHeight && currentHeight > 140) {
              if (currentSectionOnPage) {
                currentSectionOnPage.showAddButton = false;
              }
              resultPages.push(currentPageBlocks);
              currentPageBlocks = [];
              currentHeight = 0;

              currentSectionOnPage = {
                section,
                isContinuation: true,
                items: [item],
                showAddButton: i === items.length - 1
              };
              currentPageBlocks.push(currentSectionOnPage);
              currentHeight = secHeaderHeight + itemHeight + 12;
            } else {
              if (!currentSectionOnPage) {
                currentSectionOnPage = {
                  section,
                  isContinuation: false,
                  items: [item],
                  showAddButton: i === items.length - 1
                };
                currentPageBlocks.push(currentSectionOnPage);
                currentHeight += neededHeight;
              } else {
                currentSectionOnPage.items!.push(item);
                currentSectionOnPage.showAddButton = i === items.length - 1;
                currentHeight += itemHeight + 8;
              }
            }
          }
        }
      }

      if (currentPageBlocks.length > 0) {
        resultPages.push(currentPageBlocks);
      }

      return resultPages.length > 0 ? resultPages : [[]];
    };

    const isTwoColumn = template === 'classic' || template === 'tech' || template === 'pro_split' || template === 'compact_ats';
    const LEFT_COLUMN_TYPES: CVSectionType[] = ['skills', 'certifications', 'languages', 'awards', 'references'];

    if (isTwoColumn) {
      // 2-Column Mode: split sections into left (sidebar) and right (main content)
      const leftSections = visibleSections.filter(s => LEFT_COLUMN_TYPES.includes(s.type));
      const rightSections = visibleSections.filter(s => !LEFT_COLUMN_TYPES.includes(s.type));

      const headerH = getHeaderHeight();
      const leftPages = partitionSectionList(leftSections, headerH, USABLE_PAGE_HEIGHT);
      const rightPages = partitionSectionList(rightSections, headerH, USABLE_PAGE_HEIGHT);

      const totalPageCount = Math.max(1, leftPages.length, rightPages.length);
      const computedPages: CVPage[] = [];

      for (let p = 0; p < totalPageCount; p++) {
        computedPages.push({
          pageNumber: p + 1,
          hasHeader: p === 0,
          sections: [],
          leftSections: leftPages[p] || [],
          rightSections: rightPages[p] || []
        });
      }

      setPages(computedPages);
    } else {
      // 1-Column Mode (minimal, executive)
      const headerH = getHeaderHeight();
      const singlePages = partitionSectionList(visibleSections, headerH, USABLE_PAGE_HEIGHT);
      const computedPages: CVPage[] = singlePages.map((blocks, idx) => ({
        pageNumber: idx + 1,
        hasHeader: idx === 0,
        sections: blocks
      }));

      setPages(computedPages.length > 0 ? computedPages : [{ pageNumber: 1, hasHeader: true, sections: [] }]);
    }
  }, [sections, personalInfo, spacingDensity, fontSizeLevel, fontFamily, template]);

  // ----------------------------------------------------
  // SECTION RENDERERS (PURE DOCUMENT FLOW - HEIGHT: AUTO)
  // ----------------------------------------------------

  // 1. OBJECTIVE SECTION (Shrinks strictly to text height)
  const renderObjectiveContent = (section: CVSection) => (
    <div style={{ height: 'auto' }} className="relative group/obj">
      <AutoExpandingTextarea
        value={section.content || ''}
        onChange={(val) => onUpdateSection(section.id, { content: val })}
        placeholder="Nhập mục tiêu nghề nghiệp, kỹ năng cốt lõi và định hướng phát triển..."
        className={`${baseTextSize} text-slate-700 dark:text-slate-200 focus:bg-blue-50/40 rounded px-0.5`}
        style={{ fontFamily }}
        readOnly={!isEditorMode}
      />
      {isEditorMode && (
        <button
          type="button"
          onClick={() => openInlineEditor({
            initialText: section.content || '',
            fieldLabel: 'mục tiêu nghề nghiệp',
            onSave: (val) => {
              if (onRecordUndo) {
                onRecordUndo({
                  type: 'SECTION_CONTENT',
                  sectionId: section.id,
                  oldValue: section.content || '',
                  newValue: val,
                  description: 'Sửa mục tiêu nghề nghiệp'
                });
              }
              onUpdateSection(section.id, { content: val });
            },
            onApplyAi: (val) => {
              if (onRecordUndo) {
                onRecordUndo({
                  type: 'SECTION_CONTENT',
                  sectionId: section.id,
                  oldValue: section.content || '',
                  newValue: val,
                  description: 'Áp dụng gợi ý AI mục tiêu nghề nghiệp'
                });
              }
              onUpdateSection(section.id, { content: val });
              if (onDeductAiCredit) onDeductAiCredit();
            }
          })}
          className="absolute -top-1 right-0 hidden group-hover/obj:flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-700 rounded text-[10px] font-bold shadow-xs hover:bg-blue-100 transition print:hidden z-10"
          title="Chỉnh sửa & Tác vụ AI [✏️]"
        >
          <Edit3 className="w-2.5 h-2.5 text-blue-600" />
          <span>Sửa / AI [✏️]</span>
        </button>
      )}
    </div>
  );

  // 2. EDUCATION SECTION
  const renderEducationContent = (section: CVSection, overrideItems?: EducationItem[], showAddBtn: boolean = true) => {
    const items = overrideItems || (section.items as EducationItem[]) || [];
    return (
      <div className="space-y-2" style={{ height: 'auto' }}>
        {items.map((item) => (
          <div
            key={item.id}
            id={`cv-measure-item-${item.id}`}
            className="cv-item-block group/item relative py-0.5"
            style={{ height: 'auto', breakInside: 'avoid', pageBreakInside: 'avoid' }}
          >
            {/* Item Controls */}
            {isEditorMode && (
              <div className="absolute top-0 right-0 hidden group-hover/item:flex print:hidden items-center gap-1 bg-slate-900 text-white rounded px-1.5 py-0.5 text-[10px] z-10 shadow-xs">
                <button
                  type="button"
                  onClick={() => openInlineEditor({
                    initialText: item.description || '',
                    fieldLabel: 'mô tả học vấn',
                    onSave: (val) => {
                      if (onRecordUndo) {
                        onRecordUndo({
                          type: 'ITEM_FIELD',
                          sectionId: section.id,
                          itemId: item.id,
                          field: 'description',
                          oldValue: item.description || '',
                          newValue: val,
                          description: 'Sửa mô tả học vấn'
                        });
                      }
                      onUpdateItemInSection(section.id, item.id, { description: val });
                    },
                    onApplyAi: (val) => {
                      if (onRecordUndo) {
                        onRecordUndo({
                          type: 'ITEM_FIELD',
                          sectionId: section.id,
                          itemId: item.id,
                          field: 'description',
                          oldValue: item.description || '',
                          newValue: val,
                          description: 'Áp dụng AI mô tả học vấn'
                        });
                      }
                      onUpdateItemInSection(section.id, item.id, { description: val });
                      if (onDeductAiCredit) onDeductAiCredit();
                    }
                  })}
                  className="px-1.5 py-0.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded flex items-center gap-1 transition"
                  title="Chỉnh sửa & Tác vụ AI [✏️]"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>Sửa / AI [✏️]</span>
                </button>
                {onDuplicateItemInSection && (
                  <button onClick={() => onDuplicateItemInSection(section.id, item.id)} title="Nhân bản" className="p-0.5 hover:text-blue-300">
                    <Copy className="w-2.5 h-2.5" />
                  </button>
                )}
                <button onClick={() => onDeleteItemFromSection(section.id, item.id)} title="Xóa" className="p-0.5 hover:text-rose-400">
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            )}

            {/* Institution & Dates */}
            <div className="flex flex-wrap items-baseline justify-between gap-1 mb-0.5">
              <input
                type="text"
                value={item.institution}
                onChange={(e) => onUpdateItemInSection(section.id, item.id, { institution: e.target.value })}
                placeholder="Tên Trường Đại Học"
                readOnly={!isEditorMode}
                className="font-bold text-slate-900 dark:text-slate-100 bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-0.5 flex-1 text-xs"
                style={{ fontFamily }}
              />
              <div className="text-[11px] font-medium text-slate-500 shrink-0">
                <input
                  type="text"
                  value={item.startDate}
                  onChange={(e) => onUpdateItemInSection(section.id, item.id, { startDate: e.target.value })}
                  placeholder="2022"
                  readOnly={!isEditorMode}
                  className="bg-transparent border-none outline-none w-10 text-right"
                />
                <span> – </span>
                <input
                  type="text"
                  value={item.endDate}
                  onChange={(e) => onUpdateItemInSection(section.id, item.id, { endDate: e.target.value })}
                  placeholder="Hiện tại"
                  readOnly={!isEditorMode}
                  className="bg-transparent border-none outline-none w-14 text-left"
                />
              </div>
            </div>

            {/* Major */}
            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">
              <input
                type="text"
                value={item.major}
                onChange={(e) => onUpdateItemInSection(section.id, item.id, { major: e.target.value })}
                placeholder="Chuyên ngành"
                readOnly={!isEditorMode}
                className="font-semibold text-slate-700 dark:text-slate-300 bg-transparent border-none outline-none px-0.5 flex-1"
              />
            </div>

            {/* Highlights */}
            {item.description && (
              <AutoExpandingTextarea
                value={item.description}
                onChange={(val) => onUpdateItemInSection(section.id, item.id, { description: val })}
                className={`${baseTextSize} text-slate-600 dark:text-slate-300`}
                readOnly={!isEditorMode}
              />
            )}
          </div>
        ))}

        {isEditorMode && showAddBtn && (
          <button
            onClick={() => onAddItemToSection(section.id)}
            className="print:hidden w-full py-1 border border-dashed border-slate-300 hover:border-blue-400 text-slate-500 hover:text-blue-600 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
          >
            <Plus className="w-3 h-3" /> + Thêm Học Vấn
          </button>
        )}
      </div>
    );
  };

  // 3. WORK EXPERIENCE SECTION
  const renderWorkExperienceContent = (section: CVSection, overrideItems?: WorkExperienceItem[], showAddBtn: boolean = true) => {
    const items = overrideItems || (section.items as WorkExperienceItem[]) || [];
    return (
      <div className="space-y-2.5" style={{ height: 'auto' }}>
        {items.map((item) => (
          <div
            key={item.id}
            id={`cv-measure-item-${item.id}`}
            className="cv-item-block group/item relative py-0.5"
            style={{ height: 'auto', breakInside: 'avoid', pageBreakInside: 'avoid' }}
          >
            {isEditorMode && (
              <div className="absolute top-0 right-0 hidden group-hover/item:flex print:hidden items-center gap-1 bg-slate-900 text-white rounded px-1.5 py-0.5 text-[10px] z-10 shadow-xs">
                <button
                  type="button"
                  onClick={() => openInlineEditor({
                    initialText: item.description || '',
                    fieldLabel: 'mô tả kinh nghiệm',
                    onSave: (val) => {
                      if (onRecordUndo) {
                        onRecordUndo({
                          type: 'ITEM_FIELD',
                          sectionId: section.id,
                          itemId: item.id,
                          field: 'description',
                          oldValue: item.description || '',
                          newValue: val,
                          description: 'Sửa mô tả kinh nghiệm'
                        });
                      }
                      onUpdateItemInSection(section.id, item.id, { description: val });
                    },
                    onApplyAi: (val) => {
                      if (onRecordUndo) {
                        onRecordUndo({
                          type: 'ITEM_FIELD',
                          sectionId: section.id,
                          itemId: item.id,
                          field: 'description',
                          oldValue: item.description || '',
                          newValue: val,
                          description: 'Áp dụng AI mô tả kinh nghiệm'
                        });
                      }
                      onUpdateItemInSection(section.id, item.id, { description: val });
                      if (onDeductAiCredit) onDeductAiCredit();
                    }
                  })}
                  className="px-1.5 py-0.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded flex items-center gap-1 transition"
                  title="Chỉnh sửa & Tác vụ AI [✏️]"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>Sửa / AI [✏️]</span>
                </button>
                <button onClick={() => onDeleteItemFromSection(section.id, item.id)} title="Xóa" className="p-0.5 hover:text-rose-400">
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-baseline justify-between gap-1 mb-0.5">
              <input
                type="text"
                value={item.company}
                onChange={(e) => onUpdateItemInSection(section.id, item.id, { company: e.target.value })}
                placeholder="Tên Công Ty"
                readOnly={!isEditorMode}
                className="font-bold text-slate-900 dark:text-slate-100 bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-0.5 flex-1 text-xs"
              />
              <div className="text-[11px] font-medium text-slate-500 shrink-0">
                <input
                  type="text"
                  value={item.startDate}
                  onChange={(e) => onUpdateItemInSection(section.id, item.id, { startDate: e.target.value })}
                  placeholder="07/2024"
                  readOnly={!isEditorMode}
                  className="bg-transparent border-none outline-none w-14 text-right"
                />
                <span> – </span>
                <input
                  type="text"
                  value={item.endDate}
                  onChange={(e) => onUpdateItemInSection(section.id, item.id, { endDate: e.target.value })}
                  placeholder="Hiện tại"
                  readOnly={!isEditorMode}
                  className="bg-transparent border-none outline-none w-14 text-left"
                />
              </div>
            </div>

            <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              <input
                type="text"
                value={item.position}
                onChange={(e) => onUpdateItemInSection(section.id, item.id, { position: e.target.value })}
                placeholder="Vị trí công việc"
                readOnly={!isEditorMode}
                className="w-full bg-transparent border-none outline-none px-0.5"
              />
            </div>

            <AutoExpandingTextarea
              value={item.description || ''}
              onChange={(val) => onUpdateItemInSection(section.id, item.id, { description: val })}
              placeholder="• Trách nhiệm và thành tích đạt được..."
              className={`${baseTextSize} text-slate-600 dark:text-slate-300`}
              readOnly={!isEditorMode}
            />
          </div>
        ))}

        {isEditorMode && showAddBtn && (
          <button
            onClick={() => onAddItemToSection(section.id)}
            className="print:hidden w-full py-1 border border-dashed border-slate-300 hover:border-blue-400 text-slate-500 hover:text-blue-600 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
          >
            <Plus className="w-3 h-3" /> + Thêm Kinh Nghiệm
          </button>
        )}
      </div>
    );
  };

  // 4. PROJECTS SECTION (Snug, Document Flow, Auto Height)
  const renderProjectsContent = (section: CVSection, overrideItems?: ProjectItem[], showAddBtn: boolean = true) => {
    const items = overrideItems || (section.items as ProjectItem[]) || [];
    return (
      <div className="space-y-2.5" style={{ height: 'auto' }}>
        {items.map((item) => (
          <div
            key={item.id}
            id={`cv-measure-item-${item.id}`}
            className="cv-item-block group/item relative py-0.5"
            style={{ height: 'auto', breakInside: 'avoid', pageBreakInside: 'avoid' }}
          >
            {isEditorMode && (
              <div className="absolute top-0 right-0 hidden group-hover/item:flex print:hidden items-center gap-1 bg-slate-900 text-white rounded px-1.5 py-0.5 text-[10px] z-10 shadow-xs">
                <button
                  type="button"
                  onClick={() => openInlineEditor({
                    initialText: item.description || '',
                    fieldLabel: 'mô tả đồ án / dự án',
                    onSave: (val) => {
                      if (onRecordUndo) {
                        onRecordUndo({
                          type: 'ITEM_FIELD',
                          sectionId: section.id,
                          itemId: item.id,
                          field: 'description',
                          oldValue: item.description || '',
                          newValue: val,
                          description: 'Sửa mô tả dự án'
                        });
                      }
                      onUpdateItemInSection(section.id, item.id, { description: val });
                    },
                    onApplyAi: (val) => {
                      if (onRecordUndo) {
                        onRecordUndo({
                          type: 'ITEM_FIELD',
                          sectionId: section.id,
                          itemId: item.id,
                          field: 'description',
                          oldValue: item.description || '',
                          newValue: val,
                          description: 'Áp dụng AI mô tả dự án'
                        });
                      }
                      onUpdateItemInSection(section.id, item.id, { description: val });
                      if (onDeductAiCredit) onDeductAiCredit();
                    }
                  })}
                  className="px-1.5 py-0.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded flex items-center gap-1 transition"
                  title="Chỉnh sửa & Tác vụ AI [✏️]"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>Sửa / AI [✏️]</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStarProjectToReview({ ...item, _sectionId: section.id })}
                  className="px-1.5 py-0.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded flex items-center gap-1 transition"
                  title="Chuẩn hóa STAR & Anti-Hallucination Guard [⭐]"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>STAR [⭐]</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDefenseProjectToReview(item)}
                  className="px-1.5 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded flex items-center gap-1 transition"
                  title="Diễn tập câu hỏi xoáy & Phòng thủ trước Tech Lead [🛡️]"
                >
                  <ShieldAlert className="w-2.5 h-2.5" />
                  <span>Phòng thủ [🛡️]</span>
                </button>
                {onDuplicateItemInSection && (
                  <button onClick={() => onDuplicateItemInSection(section.id, item.id)} title="Nhân bản" className="p-0.5 hover:text-blue-300">
                    <Copy className="w-2.5 h-2.5" />
                  </button>
                )}
                <button onClick={() => onDeleteItemFromSection(section.id, item.id)} title="Xóa" className="p-0.5 hover:text-rose-400">
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            )}

            {/* Project Name & Dates */}
            <div className="flex flex-wrap items-baseline justify-between gap-1 mb-0.5">
              <div className="flex items-center gap-1 flex-1">
                <input
                  type="text"
                  value={item.projectName}
                  onChange={(e) => onUpdateItemInSection(section.id, item.id, { projectName: e.target.value })}
                  placeholder="Tên Dự Án"
                  readOnly={!isEditorMode}
                  className="font-bold text-slate-900 dark:text-slate-100 bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-0.5 flex-1 text-xs"
                />
              </div>

              <div className="text-[11px] font-medium text-slate-500 shrink-0">
                <input
                  type="text"
                  value={item.startDate}
                  onChange={(e) => onUpdateItemInSection(section.id, item.id, { startDate: e.target.value })}
                  placeholder="2025"
                  readOnly={!isEditorMode}
                  className="bg-transparent border-none outline-none w-10 text-right"
                />
                <span> – </span>
                <input
                  type="text"
                  value={item.endDate}
                  onChange={(e) => onUpdateItemInSection(section.id, item.id, { endDate: e.target.value })}
                  placeholder="2026"
                  readOnly={!isEditorMode}
                  className="bg-transparent border-none outline-none w-10 text-left"
                />
              </div>
            </div>

            {/* Role & Tech (Snug together without gaps) */}
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5 text-[11px]">
              <input
                type="text"
                value={item.role}
                onChange={(e) => onUpdateItemInSection(section.id, item.id, { role: e.target.value })}
                placeholder="Vai trò"
                readOnly={!isEditorMode}
                className="font-semibold text-slate-700 dark:text-slate-300 bg-transparent border-none outline-none px-0.5 shrink-0"
              />
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <div className="flex items-center gap-1 flex-1 min-w-[120px]">
                <span className="font-semibold text-slate-500 dark:text-slate-400 shrink-0">Tech:</span>
                <input
                  type="text"
                  value={(item.technologies || []).join(', ')}
                  onChange={(e) => onUpdateItemInSection(section.id, item.id, {
                    technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  placeholder="React, TypeScript, Node.js"
                  readOnly={!isEditorMode}
                  className="w-full bg-transparent border-none outline-none px-0.5 font-medium text-blue-600 dark:text-blue-400 text-[11px]"
                />
              </div>
            </div>

            {/* Scoped Contribution & System Context (Ticket 02) */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1 text-[11px]">
              {item.scopeType === 'team' ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
                  👥 Đồ án nhóm{item.teamSize ? ` (${item.teamSize} TV)` : ''}
                </span>
              ) : item.scopeType === 'solo' ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                  👤 Đồ án cá nhân
                </span>
              ) : null}

              {item.systemContext && (
                <span className="text-[10.5px] text-slate-500 dark:text-slate-400 italic">
                  <span className="font-semibold text-slate-600 dark:text-slate-300 not-italic">Hệ thống:</span> {item.systemContext}
                </span>
              )}
            </div>

            {/* Editor mode configuration bar: Scope Selector, System Scope, Reverse Sync (Print hidden) */}
            {isEditorMode && (
              <div className="print:hidden my-1 p-1.5 rounded-md bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                {/* Scope selection */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Quy mô:</span>
                  <select
                    value={item.scopeType || 'team'}
                    onChange={(e) => onUpdateItemInSection(section.id, item.id, { scopeType: e.target.value as 'solo' | 'team' })}
                    className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200"
                  >
                    <option value="team">👥 Đồ án nhóm</option>
                    <option value="solo">👤 Đồ án cá nhân</option>
                  </select>

                  {(item.scopeType || 'team') === 'team' && (
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">Số TV:</span>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={item.teamSize || 4}
                        onChange={(e) => onUpdateItemInSection(section.id, item.id, { teamSize: parseInt(e.target.value, 10) || 1 })}
                        className="w-12 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1 py-0.5 text-[11px] text-center"
                        placeholder="4"
                      />
                    </div>
                  )}
                </div>

                {/* System context input */}
                {(item.scopeType || 'team') === 'team' && (
                  <div className="flex items-center gap-1 flex-1 min-w-[180px]">
                    <span className="text-slate-500 shrink-0">Bối cảnh:</span>
                    <input
                      type="text"
                      value={item.systemContext || ''}
                      onChange={(e) => onUpdateItemInSection(section.id, item.id, { systemContext: e.target.value })}
                      placeholder="Hệ thống chung..."
                      className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-[11px]"
                    />
                  </div>
                )}

                {/* URLs input (Ticket 06) */}
                <div className="flex items-center gap-2 w-full pt-1 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1 flex-1">
                    <span className="text-slate-400 text-[10px]">Demo:</span>
                    <input
                      type="url"
                      value={item.projectUrl || ''}
                      onChange={(e) => onUpdateItemInSection(section.id, item.id, { projectUrl: e.target.value })}
                      placeholder="https://demo.app"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-[10.5px]"
                    />
                  </div>
                  <div className="flex items-center gap-1 flex-1">
                    <span className="text-slate-400 text-[10px]">GitHub:</span>
                    <input
                      type="url"
                      value={item.githubUrl || ''}
                      onChange={(e) => onUpdateItemInSection(section.id, item.id, { githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-[10.5px]"
                    />
                  </div>
                </div>

                {/* Ticket 01: Reverse Sync Toggle */}
                <label className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 cursor-pointer select-none hover:text-blue-600 transition-colors ml-auto">
                  <input
                    type="checkbox"
                    checked={item.syncToMasterProfile !== false}
                    onChange={(e) => onUpdateItemInSection(section.id, item.id, { syncToMasterProfile: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="font-medium text-[10.5px]">Lưu vào Kho Quản lý dự án</span>
                </label>
              </div>
            )}

            {/* Description (Grows naturally) */}
            <AutoExpandingTextarea
              value={item.description}
              onChange={(val) => onUpdateItemInSection(section.id, item.id, { description: val })}
              placeholder="• Mô tả chi tiết kết quả đạt được..."
              className={`${baseTextSize} text-slate-600 dark:text-slate-300`}
              readOnly={!isEditorMode}
            />

            {/* Evidence Showcase Pills & Print-Only Smart Quick-Verify QR (Ticket 06) */}
            {(item.projectUrl || item.githubUrl) && (
              <div className="flex items-center justify-between gap-2 mt-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  {item.projectUrl && (
                    <a
                      href={item.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:underline"
                    >
                      🌐 Live Demo ↗
                    </a>
                  )}
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:underline"
                    >
                      📦 GitHub Repo ↗
                    </a>
                  )}
                </div>

                {/* Print-Only Smart Quick-Verify Mini QR */}
                <div className="hidden print:flex items-center gap-1 border border-slate-300 p-0.5 rounded bg-white shrink-0">
                  <QRCodeSVG value={item.projectUrl || item.githubUrl || ''} size={28} />
                  <div className="text-[7px] leading-none text-slate-600 font-semibold">Quét xem<br/>Demo</div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isEditorMode && showAddBtn && (
          <div className="print:hidden flex items-center gap-2">
            <button
              onClick={() => onAddItemToSection(section.id)}
              className="flex-1 py-1 border border-dashed border-slate-300 hover:border-blue-400 text-slate-500 hover:text-blue-600 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
            >
              <Plus className="w-3 h-3" /> + Thêm Dự Án
            </button>
            {onOpenProfilePicker && (
              <button
                type="button"
                onClick={() => onOpenProfilePicker('projects')}
                className="py-1 px-3 border border-dashed border-blue-300 bg-blue-50/60 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Kéo dự án từ Hồ sơ cá nhân bằng checkbox"
              >
                <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
                <span>📥 Kéo Từ Hồ Sơ</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // 5. SKILLS SECTION (Grouped Skills)
  const renderSkillsContent = (section: CVSection, overrideItems?: SkillGroupItem[], showAddBtn: boolean = true) => {
    const groups = overrideItems || (section.items as SkillGroupItem[]) || [];

    if (groups.length === 0 && section.content !== undefined) {
      return (
        <AutoExpandingTextarea
          value={section.content || ''}
          onChange={(val) => onUpdateSection(section.id, { content: val })}
          className={`${baseTextSize} text-slate-700 dark:text-slate-200`}
          style={{ fontFamily }}
          readOnly={!isEditorMode}
        />
      );
    }

    return (
      <div className="space-y-1.5" style={{ height: 'auto' }}>
        {groups.map((grp) => (
          <div
            key={grp.id}
            id={`cv-measure-item-${grp.id}`}
            className="cv-item-block group/grp relative py-0.5"
            style={{ height: 'auto', breakInside: 'avoid', pageBreakInside: 'avoid' }}
          >
            {isEditorMode && (
              <button
                onClick={() => onDeleteItemFromSection(section.id, grp.id)}
                className="absolute top-0 right-0 hidden group-hover/grp:block print:hidden text-slate-400 hover:text-rose-500"
                title="Xóa nhóm"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            )}

            <div className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 mb-0.5">
              <input
                type="text"
                value={grp.groupName}
                onChange={(e) => onUpdateItemInSection(section.id, grp.id, { groupName: e.target.value })}
                readOnly={!isEditorMode}
                className="font-bold text-[11.5px] text-slate-800 dark:text-slate-200 bg-transparent border-none outline-none w-full"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {grp.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[10.5px] font-medium border border-slate-200/80 dark:border-slate-700/80"
                >
                  <span>{skill}</span>
                  {isEditorMode && (
                    <button
                      type="button"
                      onClick={() => {
                        const newSkills = grp.skills.filter((_, idx) => idx !== sIdx);
                        onUpdateItemInSection(section.id, grp.id, { skills: newSkills });
                      }}
                      className="text-slate-400 hover:text-rose-500 print:hidden text-[9px]"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}

              {isEditorMode && (
                <input
                  type="text"
                  placeholder="+ Skill (Enter)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val) {
                        onUpdateItemInSection(section.id, grp.id, { skills: [...grp.skills, val] });
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                  className="text-[10.5px] px-1.5 py-0.2 bg-transparent border border-dashed border-slate-300 dark:border-slate-700 rounded text-slate-500 outline-none focus:border-blue-400 print:hidden w-24"
                />
              )}
            </div>
          </div>
        ))}

        {isEditorMode && showAddBtn && (
          <button
            onClick={() => onAddItemToSection(section.id)}
            className="print:hidden py-0.5 px-2 border border-dashed border-slate-300 hover:border-blue-400 text-slate-500 hover:text-blue-600 rounded text-[10.5px] font-semibold flex items-center gap-1 transition-all mt-1"
          >
            <Plus className="w-2.5 h-2.5" /> + Nhóm Kỹ Năng
          </button>
        )}
      </div>
    );
  };

  // 6. CERTIFICATIONS SECTION
  const renderCertificationsContent = (section: CVSection, overrideItems?: CertificationItem[], showAddBtn: boolean = true) => {
    const items = overrideItems || (section.items as CertificationItem[]) || [];
    return (
      <div className="space-y-1.5" style={{ height: 'auto' }}>
        {items.map((item) => (
          <div
            key={item.id}
            id={`cv-measure-item-${item.id}`}
            className="cv-item-block group/item relative py-0.5"
            style={{ height: 'auto', breakInside: 'avoid', pageBreakInside: 'avoid' }}
          >
            {isEditorMode && (
              <div className="absolute top-0 right-0 hidden group-hover/item:flex print:hidden items-center gap-1 bg-slate-800 text-white rounded px-1.5 py-0.5 text-[10px] z-10 shadow-xs">
                <button onClick={() => onDeleteItemFromSection(section.id, item.id)} title="Xóa" className="p-0.5 hover:text-rose-400">
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-start justify-between gap-1">
              <div className="flex-1 min-w-[120px]">
                <AutoExpandingTextarea
                  value={item.certificateName}
                  onChange={(val) => onUpdateItemInSection(section.id, item.id, { certificateName: val })}
                  placeholder="Tên Chứng Chỉ"
                  className="font-bold text-[11px] text-slate-900 dark:text-slate-100 focus:bg-blue-50/40 rounded px-0.5"
                  readOnly={!isEditorMode}
                />
                <input
                  type="text"
                  value={item.organization}
                  onChange={(e) => onUpdateItemInSection(section.id, item.id, { organization: e.target.value })}
                  placeholder="Đơn vị cấp"
                  readOnly={!isEditorMode}
                  className="w-full text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 bg-transparent border-none outline-none px-0.5"
                />
              </div>

              <div className="shrink-0">
                <input
                  type="text"
                  value={item.issueDate}
                  onChange={(e) => onUpdateItemInSection(section.id, item.id, { issueDate: e.target.value })}
                  placeholder="2026"
                  readOnly={!isEditorMode}
                  className="text-[10.5px] font-medium text-slate-500 bg-transparent border-none outline-none w-10 text-right"
                />
              </div>
            </div>
          </div>
        ))}

        {isEditorMode && showAddBtn && (
          <div className="print:hidden flex items-center gap-2">
            <button
              onClick={() => onAddItemToSection(section.id)}
              className="flex-1 py-0.5 border border-dashed border-slate-300 hover:border-blue-400 text-slate-500 hover:text-blue-600 rounded text-[10.5px] font-semibold flex items-center justify-center gap-1 transition-all"
            >
              <Plus className="w-2.5 h-2.5" /> + Thêm Chứng Chỉ
            </button>
            {onOpenProfilePicker && (
              <button
                type="button"
                onClick={() => onOpenProfilePicker('certificates')}
                className="py-0.5 px-3 border border-dashed border-blue-300 bg-blue-50/60 hover:bg-blue-100 text-blue-700 rounded text-[10.5px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Kéo chứng chỉ từ Hồ sơ cá nhân bằng checkbox"
              >
                <Award className="w-3 h-3 text-blue-600" />
                <span>📥 Kéo Từ Hồ Sơ</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // 7. ACTIVITIES SECTION
  const renderActivitiesContent = (section: CVSection, overrideItems?: ActivityItem[], showAddBtn: boolean = true) => {
    const items = overrideItems || (section.items as ActivityItem[]) || [];
    return (
      <div className="space-y-2" style={{ height: 'auto' }}>
        {items.map((item) => (
          <div key={item.id} id={`cv-measure-item-${item.id}`} className="cv-item-block group/item relative py-0.5" style={{ height: 'auto', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            {isEditorMode && (
              <div className="absolute top-0 right-0 hidden group-hover/item:flex print:hidden items-center gap-1 bg-slate-800 text-white rounded px-1.5 py-0.5 text-[10px] z-10">
                <button onClick={() => onDeleteItemFromSection(section.id, item.id)} className="p-0.5 hover:text-rose-400">
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-baseline justify-between gap-1 mb-0.5">
              <input
                type="text"
                value={item.organization}
                onChange={(e) => onUpdateItemInSection(section.id, item.id, { organization: e.target.value })}
                placeholder="Câu Lạc Bộ / Hoạt Động"
                readOnly={!isEditorMode}
                className="font-bold text-xs text-slate-900 dark:text-slate-100 bg-transparent border-none outline-none px-0.5 flex-1"
              />
              <div className="text-[11px] text-slate-500 shrink-0">
                <span>{item.startDate} – {item.endDate}</span>
              </div>
            </div>

            <input
              type="text"
              value={item.role}
              onChange={(e) => onUpdateItemInSection(section.id, item.id, { role: e.target.value })}
              placeholder="Vai trò"
              readOnly={!isEditorMode}
              className="w-full text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-transparent border-none outline-none px-0.5 mb-0.5"
            />

            {item.description && (
              <AutoExpandingTextarea
                value={item.description}
                onChange={(val) => onUpdateItemInSection(section.id, item.id, { description: val })}
                className={`${baseTextSize} text-slate-600 dark:text-slate-300`}
                readOnly={!isEditorMode}
              />
            )}
          </div>
        ))}

        {isEditorMode && showAddBtn && (
          <button
            onClick={() => onAddItemToSection(section.id)}
            className="print:hidden w-full py-1 border border-dashed border-slate-300 hover:border-blue-400 text-slate-500 hover:text-blue-600 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
          >
            <Plus className="w-3 h-3" /> + Thêm Hoạt Động
          </button>
        )}
      </div>
    );
  };

  // 8. AWARDS SECTION
  const renderAwardsContent = (section: CVSection, overrideItems?: AwardItem[], showAddBtn: boolean = true) => {
    const items = overrideItems || (section.items as AwardItem[]) || [];
    return (
      <div className="space-y-1.5" style={{ height: 'auto' }}>
        {items.map((item) => (
          <div key={item.id} id={`cv-measure-item-${item.id}`} className="cv-item-block group/item relative py-0.5" style={{ height: 'auto', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            {isEditorMode && (
              <div className="absolute top-0 right-0 hidden group-hover/item:flex print:hidden items-center gap-1 bg-slate-800 text-white rounded px-1.5 py-0.5 text-[10px] z-10">
                <button onClick={() => onDeleteItemFromSection(section.id, item.id)} className="p-0.5 hover:text-rose-400">
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            )}

            <div className="flex items-baseline justify-between gap-1">
              <input
                type="text"
                value={item.awardName}
                onChange={(e) => onUpdateItemInSection(section.id, item.id, { awardName: e.target.value })}
                placeholder="Tên Giải Thưởng"
                readOnly={!isEditorMode}
                className="font-bold text-xs text-slate-900 dark:text-slate-100 bg-transparent outline-none flex-1 px-0.5"
              />
              <span className="text-[11px] text-slate-500">{item.date}</span>
            </div>
            <div className="text-[10.5px] text-slate-600 dark:text-slate-400 px-0.5">{item.organization}</div>
          </div>
        ))}

        {isEditorMode && showAddBtn && (
          <button
            onClick={() => onAddItemToSection(section.id)}
            className="print:hidden w-full py-0.5 border border-dashed border-slate-300 hover:border-blue-400 text-slate-500 hover:text-blue-600 rounded text-[10.5px] font-semibold flex items-center justify-center gap-1 transition-all"
          >
            <Plus className="w-2.5 h-2.5" /> + Thêm Giải Thưởng
          </button>
        )}
      </div>
    );
  };

  // 9. LANGUAGES SECTION
  const renderLanguagesContent = (section: CVSection, overrideItems?: LanguageItem[]) => {
    const items = overrideItems || (section.items as LanguageItem[]) || [];
    return (
      <div className="space-y-1" style={{ height: 'auto' }}>
        {items.map((item) => (
          <div key={item.id} id={`cv-measure-item-${item.id}`} className="cv-item-block group/item relative flex items-center justify-between text-[11px] py-0.5" style={{ height: 'auto', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{item.language}</span>
            <span className="text-slate-500">{item.level}</span>
          </div>
        ))}
      </div>
    );
  };

  // 10. REFERENCES & 11. CUSTOM
  const renderCustomContent = (section: CVSection, overrideItems?: CustomSectionItem[], showAddBtn: boolean = true) => {
    if (section.content !== undefined || !section.items) {
      return (
        <div style={{ height: 'auto' }}>
          <AutoExpandingTextarea
            value={section.content || ''}
            onChange={(val) => onUpdateSection(section.id, { content: val })}
            placeholder="Nội dung mục tùy chỉnh..."
            className={`${baseTextSize} text-slate-700 dark:text-slate-200`}
            readOnly={!isEditorMode}
          />
        </div>
      );
    }

    const items = overrideItems || (section.items as CustomSectionItem[]) || [];
    return (
      <div className="space-y-1.5" style={{ height: 'auto' }}>
        {items.map((item) => (
          <div key={item.id} id={`cv-measure-item-${item.id}`} className="cv-item-block group/item relative py-0.5" style={{ height: 'auto', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <div className="flex items-baseline justify-between gap-1">
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{item.title}</span>
              {item.date && <span className="text-[11px] text-slate-500">{item.date}</span>}
            </div>
            {item.description && (
              <AutoExpandingTextarea
                value={item.description}
                onChange={(val) => onUpdateItemInSection(section.id, item.id, { description: val })}
                className={`${baseTextSize} text-slate-600 dark:text-slate-300`}
                readOnly={!isEditorMode}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Section Content Switcher
  const renderSectionContent = (section: CVSection, overrideItems?: any[], showAddBtn: boolean = true) => {
    switch (section.type) {
      case 'objective':
        return renderObjectiveContent(section);
      case 'education':
        return renderEducationContent(section, overrideItems, showAddBtn);
      case 'work_experience':
        return renderWorkExperienceContent(section, overrideItems, showAddBtn);
      case 'projects':
        return renderProjectsContent(section, overrideItems, showAddBtn);
      case 'skills':
        return renderSkillsContent(section, overrideItems, showAddBtn);
      case 'certifications':
        return renderCertificationsContent(section, overrideItems, showAddBtn);
      case 'activities':
        return renderActivitiesContent(section, overrideItems, showAddBtn);
      case 'awards':
        return renderAwardsContent(section, overrideItems, showAddBtn);
      case 'languages':
        return renderLanguagesContent(section, overrideItems);
      case 'custom':
      default:
        return renderCustomContent(section, overrideItems, showAddBtn);
    }
  };

  // ----------------------------------------------------
  // MAIN SECTION BLOCK (NO CARD BORDERS - PURE DOCUMENT FLOW)
  // ----------------------------------------------------
  const renderSectionBlock = (
    section: CVSection,
    secIdx: number,
    options?: {
      overrideItems?: any[];
      isContinuation?: boolean;
      showAddButton?: boolean;
      hideHeader?: boolean;
      isLeftColumn?: boolean;
    }
  ) => {
    const isActive = activeSectionId === section.id;
    const settings = section.settings || {
      showTitle: true,
      showDivider: true,
      spacing: 'normal',
      titleStyle: 'bold',
      titleCase: 'uppercase'
    };

    // If section is hidden: show a collapsed banner in editor, hide in print
    if (!section.is_visible) {
      if (!isEditorMode) return null;
      return (
        <div
          key={section.id}
          className="my-1.5 p-2 bg-slate-100 dark:bg-slate-800/80 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-between text-xs text-slate-500 print:hidden transition-all"
        >
          <div className="flex items-center gap-2">
            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {section.title}
            </span>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded font-medium">
              Đã ẩn khỏi CV
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleHideSection(section.id)}
              className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> Hiện Lại
            </button>
            <button
              onClick={() => onRequestDeleteSection(section)}
              className="p-1 text-slate-400 hover:text-rose-500 rounded"
              title="Xóa vĩnh viễn"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <section
        key={`${section.id}_${options?.isContinuation ? 'cont' : 'main'}_${secIdx}`}
        id={`cv-measure-sec-${section.id}`}
        draggable={isEditorMode && !options?.isContinuation}
        onDragStart={(e) => handleDragStart(e, section.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, section.id)}
        onClick={() => {
          const evalContent = section.content || JSON.stringify(section.items || '');
          onFocusSection(section.id, section.type, evalContent);
        }}
        className={`cv-section-block group relative transition-all ${
          isEditorMode && isActive
            ? 'ring-1 ring-blue-400 bg-blue-50/10 rounded-md p-1'
            : isEditorMode
            ? 'hover:ring-1 hover:ring-slate-200 dark:hover:ring-slate-700 rounded-md p-1'
            : ''
        }`}
        style={{
          fontFamily,
          height: 'auto',
          breakInside: section.items && section.items.length > 1 ? 'auto' : 'avoid',
          pageBreakInside: section.items && section.items.length > 1 ? 'auto' : 'avoid'
        }}
      >
        {/* Hover Toolbar (Editor Mode Only) */}
        {isEditorMode && !options?.isContinuation && (
          <div className="absolute -top-3.5 right-1 hidden group-hover:flex print:hidden items-center gap-1 bg-slate-900 text-white rounded px-2 py-0.5 shadow-md text-xs z-20 animate-in fade-in duration-100">
            <span title="Kéo thả để đổi vị trí" className="cursor-grab active:cursor-grabbing p-0.5 text-slate-400 hover:text-white">
              <GripVertical className="w-3 h-3" />
            </span>
            <button onClick={(e) => { e.stopPropagation(); onMoveSection(section.id, 'up'); }} disabled={secIdx === 0} title="Lên" className="p-0.5 hover:text-blue-400 disabled:opacity-30">
              <ArrowUp className="w-3 h-3" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onMoveSection(section.id, 'down'); }} disabled={secIdx === sections.length - 1} title="Xuống" className="p-0.5 hover:text-blue-400 disabled:opacity-30">
              <ArrowDown className="w-3 h-3" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onToggleHideSection(section.id); }} title="Ẩn mục" className="p-0.5 hover:text-amber-400 text-amber-300">
              <EyeOff className="w-3 h-3" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDuplicateSection(section.id); }} title="Nhân bản" className="p-0.5 hover:text-indigo-400 text-indigo-300">
              <Copy className="w-3 h-3" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onOpenSettingsModal(section); }} title="Cài đặt" className="p-0.5 hover:text-emerald-400 text-emerald-300">
              <Settings className="w-3 h-3" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onRequestDeleteSection(section); }} title="Xóa" className="p-0.5 hover:text-rose-400 text-rose-300">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Section Header */}
        {settings.showTitle && !options?.hideHeader && (
          <div
            id={`cv-measure-header-${section.id}`}
            className={`cv-section-header flex items-center justify-between pb-0.5 mb-1.5 ${
              settings.showDivider ? (template === 'executive' ? 'border-b-2 border-double' : 'border-b') : ''
            }`}
            style={{
              borderColor: template === 'minimal' ? '#0f172a' : `${primaryColor}40`,
              breakAfter: 'avoid',
              pageBreakAfter: 'avoid',
              breakInside: 'avoid',
              pageBreakInside: 'avoid'
            }}
          >
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs leading-none select-none">
                ●
              </span>
              <input
                type="text"
                value={formatTitle(section.title, settings.titleCase)}
                onChange={(e) => onUpdateSection(section.id, { title: e.target.value })}
                readOnly={!isEditorMode}
                className={`font-bold tracking-wider bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-0.5 flex-1 ${
                  fontSizeLevel === 'small' || template === 'compact_ats' ? 'text-[11px]' : 'text-xs'
                } ${template === 'executive' ? 'font-serif' : ''}`}
                style={{
                  color: template === 'minimal' ? '#0f172a' : primaryColor,
                  fontFamily
                }}
              />
              {options?.isContinuation && (
                <span className="text-[10px] text-slate-400 font-medium italic lowercase shrink-0">
                  (tiếp theo)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Section Content */}
        <div className="section-content" style={{ height: 'auto' }}>
          {renderSectionContent(section, options?.overrideItems, options?.showAddButton)}
        </div>

      </section>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hidden Offscreen Measurer to get accurate DOM heights across all fonts & devices */}
      <div
        ref={measureContainerRef}
        aria-hidden="true"
        className="absolute left-[-9999px] top-0 w-[210mm] pointer-events-none opacity-0 invisible"
        style={{ fontFamily }}
      >
        <div id="cv-measure-header" className="p-4">
          <div className="text-2xl font-black">{personalInfo.fullName}</div>
          <div className="text-sm">{personalInfo.jobTitle}</div>
          <div className="text-xs">{personalInfo.phone} {personalInfo.email}</div>
        </div>
        {sections.map(sec => (
          <div key={`meas_${sec.id}`} id={`cv-measure-sec-${sec.id}`}>
            <div id={`cv-measure-header-${sec.id}`} className="font-bold text-xs">{sec.title}</div>
            {sec.items && sec.items.map((it: any) => (
              <div key={`it_${it.id}`} id={`cv-measure-item-${it.id}`} className="py-1">
                <div className="font-bold text-xs">{it.projectName || it.company || it.institution || it.groupName || it.title}</div>
                <div className="text-xs">{it.description || it.major || it.role}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Dynamic Page Counter Badge */}
      <div className="mb-4 px-3.5 py-1 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-full shadow-xs text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2 print:hidden">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Khổ giấy WYSIWYG: <strong className="text-blue-600 dark:text-blue-400">{pages.length} Trang A4</strong> {pages.length === 1 ? '(Vừa vặn 1 trang chuẩn ATS)' : `(Đã tự động ngắt thành ${pages.length} trang theo chuẩn Word)`}</span>
      </div>

      {/* Pages Container: Word-like multi-page layout */}
      <div ref={canvasRef} className="w-full flex flex-col items-center">
        {pages.map((page, pageIdx) => (
          <React.Fragment key={page.pageNumber}>
            
            {/* Visual Page Break Separator (Between Page 1 and Page 2, Page 2 and Page 3...) */}
            {pageIdx > 0 && (
              <div className="w-full max-w-[210mm] my-6 flex items-center gap-3 relative print:hidden select-none">
                {/* Green Badge on the Left Edge */}
                <div className="flex items-center gap-1.5 px-3.5 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-md shadow-emerald-600/30 border border-emerald-500 shrink-0 z-10 animate-in fade-in zoom-in-95 duration-200">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>Trang {page.pageNumber}</span>
                </div>

                {/* Horizontal Dashed Divider Line */}
                <div className="flex-1 border-t-2 border-dashed border-emerald-400/60" />

                {/* Info Text */}
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                  ⚡ Tự động ngắt trang A4
                </span>
              </div>
            )}

            {/* A4 Sheet Container for this Page */}
            <div
              id={pageIdx === 0 ? "cv-preview-a4" : `cv-preview-a4-page-${page.pageNumber}`}
              className={`cv-page-sheet w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-800 shadow-xl rounded-sm ${paddingMap[spacingDensity]} relative transition-all border border-slate-200 print:border-none print:shadow-none print:p-[8mm_10mm] print:mb-0`}
              style={{
                fontFamily,
                fontFeatureSettings: "'cv02', 'cv03', 'cv04', 'cv11'",
                height: 'auto'
              }}
            >
              {/* Header on Page 1 (Dynamic Layout per Template) */}
              {page.hasHeader && (
                <header
                  onClick={() => onFocusSection('personal_info', 'personal_info', `${personalInfo.fullName} | ${personalInfo.jobTitle}\nEmail: ${personalInfo.email} | SĐT: ${personalInfo.phone}`)}
                  className={`cv-header-block cv-section-block group pb-3 mb-3 transition-all relative ${
                    template === 'executive'
                      ? 'border-b-4 border-double pb-3 mb-4'
                      : template === 'minimal'
                      ? 'border-b-2 border-slate-900 pb-3 mb-4'
                      : 'border-b-2'
                  } ${
                    isEditorMode && activeSectionId === 'personal_info' ? 'ring-1 ring-blue-400 bg-blue-50/20 rounded p-2' : ''
                  }`}
                  style={{
                    borderColor: template === 'minimal' ? '#0f172a' : primaryColor,
                    height: 'auto',
                    breakInside: 'avoid',
                    pageBreakInside: 'avoid'
                  }}
                >
                  {/* TEMPLATE TYPE 1: CENTERED HEADER (Minimal Harvard & Executive Academic) */}
                  {(template === 'minimal' || template === 'executive') ? (
                    <div className="flex flex-col items-center text-center w-full">
                      {/* Full Name */}
                      <input
                        type="text"
                        value={personalInfo.fullName}
                        onChange={(e) => onUpdatePersonalInfo('fullName', e.target.value)}
                        placeholder="HỌ VÀ TÊN"
                        readOnly={!isEditorMode}
                        className={`w-full font-black text-2xl uppercase tracking-tight text-center bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-1 text-slate-900 ${
                          template === 'executive' ? 'font-serif' : ''
                        }`}
                        style={{ fontFamily }}
                      />
                      
                      {/* Job Title */}
                      <input
                        type="text"
                        value={personalInfo.jobTitle}
                        onChange={(e) => onUpdatePersonalInfo('jobTitle', e.target.value)}
                        placeholder="VỊ TRÍ ỨNG TUYỂN"
                        readOnly={!isEditorMode}
                        className={`w-full font-bold text-xs tracking-widest uppercase text-center bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-1 mt-0.5 ${
                          template === 'executive' ? 'font-serif italic text-slate-600' : 'text-slate-700'
                        }`}
                        style={{ fontFamily }}
                      />

                      {/* Contact Row (Centered Inline) */}
                      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300 mt-2.5 pt-2 border-t border-slate-200/60 w-full">
                        {personalInfo.visibleFields.phone && (
                          <div className="inline-flex items-center gap-1.5 group/fld">
                            <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <input
                              type="text"
                              value={personalInfo.phone}
                              onChange={(e) => onUpdatePersonalInfo('phone', e.target.value)}
                              placeholder="0912 345 678"
                              readOnly={!isEditorMode}
                              className="bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-0.5 text-xs text-slate-700 text-center"
                              style={{ fontFamily, width: `${Math.max((personalInfo.phone || '').length + 1, 10)}ch` }}
                            />
                            {personalInfo.visibleFields.email && <span className="text-slate-300">•</span>}
                          </div>
                        )}

                        {personalInfo.visibleFields.email && (
                          <div className="inline-flex items-center gap-1.5 group/fld">
                            <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <input
                              type="text"
                              value={personalInfo.email}
                              onChange={(e) => onUpdatePersonalInfo('email', e.target.value)}
                              placeholder="email@example.com"
                              readOnly={!isEditorMode}
                              className="bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-0.5 text-xs text-slate-700 text-center"
                              style={{ fontFamily, width: `${Math.max((personalInfo.email || '').length + 1, 16)}ch` }}
                            />
                            {personalInfo.visibleFields.location && <span className="text-slate-300">•</span>}
                          </div>
                        )}

                        {personalInfo.visibleFields.location && (
                          <div className="inline-flex items-center gap-1.5 group/fld">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <input
                              type="text"
                              value={personalInfo.location}
                              onChange={(e) => onUpdatePersonalInfo('location', e.target.value)}
                              placeholder="TP. Hồ Chí Minh"
                              readOnly={!isEditorMode}
                              className="bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-0.5 text-xs text-slate-700 text-center"
                              style={{ fontFamily, width: `${Math.max((personalInfo.location || '').length + 1, 14)}ch` }}
                            />
                            {personalInfo.visibleFields.linkedin && <span className="text-slate-300">•</span>}
                          </div>
                        )}

                        {personalInfo.visibleFields.linkedin && (
                          <div className="inline-flex items-center gap-1.5 group/fld">
                            <Linkedin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <input
                              type="text"
                              value={personalInfo.linkedin || ''}
                              onChange={(e) => onUpdatePersonalInfo('linkedin', e.target.value)}
                              placeholder="linkedin.com/in/profile"
                              readOnly={!isEditorMode}
                              className="bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-0.5 text-xs text-slate-700 text-center"
                              style={{ fontFamily, width: `${Math.max((personalInfo.linkedin || '').length + 1, 18)}ch` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : template === 'tech' ? (
                    /* TEMPLATE TYPE 2: TECH SPECIALIST (Left-Aligned Code Aesthetic) */
                    <div className="flex flex-col gap-2 w-full">
                      <div className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 select-none">
                        // CANDIDATE PROFILE & TECH STACK
                      </div>
                      <div className="border-l-4 pl-3" style={{ borderColor: primaryColor }}>
                        <input
                          type="text"
                          value={personalInfo.fullName}
                          onChange={(e) => onUpdatePersonalInfo('fullName', e.target.value)}
                          placeholder="NGUYỄN VĂN AN"
                          readOnly={!isEditorMode}
                          className="w-full font-black text-2xl uppercase tracking-tight text-left bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-0.5 text-slate-900"
                          style={{ fontFamily }}
                        />
                        <input
                          type="text"
                          value={personalInfo.jobTitle}
                          onChange={(e) => onUpdatePersonalInfo('jobTitle', e.target.value)}
                          placeholder="FULL-STACK DEVELOPER"
                          readOnly={!isEditorMode}
                          className="w-full font-mono font-bold text-xs tracking-wider uppercase text-left bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-0.5 mt-0.5 text-indigo-600 dark:text-indigo-400"
                          style={{ fontFamily }}
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {personalInfo.visibleFields.phone && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px] font-mono text-slate-700 dark:text-slate-300">
                            <Phone className="w-3 h-3 text-indigo-500" />
                            <input
                              type="text"
                              value={personalInfo.phone}
                              onChange={(e) => onUpdatePersonalInfo('phone', e.target.value)}
                              placeholder="0912 345 678"
                              readOnly={!isEditorMode}
                              className="bg-transparent border-none outline-none w-24 text-[11px]"
                            />
                          </span>
                        )}
                        {personalInfo.visibleFields.email && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px] font-mono text-slate-700 dark:text-slate-300">
                            <Mail className="w-3 h-3 text-indigo-500" />
                            <input
                              type="text"
                              value={personalInfo.email}
                              onChange={(e) => onUpdatePersonalInfo('email', e.target.value)}
                              placeholder="dev@example.com"
                              readOnly={!isEditorMode}
                              className="bg-transparent border-none outline-none w-40 text-[11px]"
                            />
                          </span>
                        )}
                        {personalInfo.visibleFields.location && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px] font-mono text-slate-700 dark:text-slate-300">
                            <MapPin className="w-3 h-3 text-indigo-500" />
                            <input
                              type="text"
                              value={personalInfo.location}
                              onChange={(e) => onUpdatePersonalInfo('location', e.target.value)}
                              placeholder="TP. Hồ Chí Minh"
                              readOnly={!isEditorMode}
                              className="bg-transparent border-none outline-none w-28 text-[11px]"
                            />
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* TEMPLATE TYPE 3: CLASSIC / PRO_SPLIT / COMPACT_ATS (2-Column Left Title + Right Contact) */
                    <div className="flex flex-col md:flex-row items-start justify-between gap-3 w-full">
                      {/* Left: Name & Title */}
                      <div className="flex-1 text-left">
                        <input
                          type="text"
                          value={personalInfo.fullName}
                          onChange={(e) => onUpdatePersonalInfo('fullName', e.target.value)}
                          placeholder="NGUYỄN VĂN AN"
                          readOnly={!isEditorMode}
                          className="w-full font-black text-2xl uppercase tracking-tight text-left bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-0.5 text-slate-900"
                          style={{ fontFamily }}
                        />
                        
                        <input
                          type="text"
                          value={personalInfo.jobTitle}
                          onChange={(e) => onUpdatePersonalInfo('jobTitle', e.target.value)}
                          placeholder="DƯỢC SĨ LÂM SÀNG & TƯ VẤN Y DƯỢC"
                          readOnly={!isEditorMode}
                          className="w-full font-bold text-xs tracking-wider uppercase text-left bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-0.5 mt-0.5 text-indigo-600 dark:text-indigo-500"
                          style={{ fontFamily }}
                        />
                      </div>

                      {/* Right: Contact Details (Right-aligned with icons) */}
                      <div className="flex flex-col items-end gap-1 text-[11px] text-slate-600 dark:text-slate-400 shrink-0">
                        {personalInfo.visibleFields.phone && (
                          <div className="inline-flex items-center justify-end gap-1.5 group/fld">
                            {isEditorMode && (
                              <button
                                onClick={(e) => { e.stopPropagation(); onToggleFieldVisibility('phone'); }}
                                className="opacity-0 group-hover/fld:opacity-100 text-slate-400 hover:text-amber-500 print:hidden text-[10px]"
                                title="Ẩn SĐT"
                              >
                                <EyeOff className="w-2.5 h-2.5" />
                              </button>
                            )}
                            <input
                              type="text"
                              value={personalInfo.phone}
                              onChange={(e) => onUpdatePersonalInfo('phone', e.target.value)}
                              placeholder="0912 345 678"
                              readOnly={!isEditorMode}
                              className="bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-0.5 text-[11px] text-slate-700 dark:text-slate-300 text-right"
                              style={{ fontFamily, width: `${Math.max((personalInfo.phone || '').length + 1, 10)}ch` }}
                            />
                            <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          </div>
                        )}

                        {personalInfo.visibleFields.email && (
                          <div className="inline-flex items-center justify-end gap-1.5 group/fld">
                            {isEditorMode && (
                              <button
                                onClick={(e) => { e.stopPropagation(); onToggleFieldVisibility('email'); }}
                                className="opacity-0 group-hover/fld:opacity-100 text-slate-400 hover:text-amber-500 print:hidden text-[10px]"
                                title="Ẩn Email"
                              >
                                <EyeOff className="w-2.5 h-2.5" />
                              </button>
                            )}
                            <input
                              type="text"
                              value={personalInfo.email}
                              onChange={(e) => onUpdatePersonalInfo('email', e.target.value)}
                              placeholder="email@example.com"
                              readOnly={!isEditorMode}
                              className="bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-0.5 text-[11px] text-slate-700 dark:text-slate-300 text-right"
                              style={{ fontFamily, width: `${Math.max((personalInfo.email || '').length + 1, 16)}ch` }}
                            />
                            <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          </div>
                        )}

                        {personalInfo.visibleFields.location && (
                          <div className="inline-flex items-center justify-end gap-1.5 group/fld">
                            {isEditorMode && (
                              <button
                                onClick={(e) => { e.stopPropagation(); onToggleFieldVisibility('location'); }}
                                className="opacity-0 group-hover/fld:opacity-100 text-slate-400 hover:text-amber-500 print:hidden text-[10px]"
                                title="Ẩn Địa chỉ"
                              >
                                <EyeOff className="w-2.5 h-2.5" />
                              </button>
                            )}
                            <input
                              type="text"
                              value={personalInfo.location}
                              onChange={(e) => onUpdatePersonalInfo('location', e.target.value)}
                              placeholder="TP. Hồ Chí Minh"
                              readOnly={!isEditorMode}
                              className="bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-0.5 text-[11px] text-slate-700 dark:text-slate-300 text-right"
                              style={{ fontFamily, width: `${Math.max((personalInfo.location || '').length + 1, 14)}ch` }}
                            />
                            <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          </div>
                        )}

                        {personalInfo.visibleFields.linkedin && (
                          <div className="inline-flex items-center justify-end gap-1.5 group/fld">
                            {isEditorMode && (
                              <button
                                onClick={(e) => { e.stopPropagation(); onToggleFieldVisibility('linkedin'); }}
                                className="opacity-0 group-hover/fld:opacity-100 text-slate-400 hover:text-amber-500 print:hidden text-[10px]"
                                title="Ẩn LinkedIn"
                              >
                                <EyeOff className="w-2.5 h-2.5" />
                              </button>
                            )}
                            <input
                              type="text"
                              value={personalInfo.linkedin || ''}
                              onChange={(e) => onUpdatePersonalInfo('linkedin', e.target.value)}
                              placeholder="linkedin.com/in/profile"
                              readOnly={!isEditorMode}
                              className="bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-0.5 text-[11px] text-slate-700 dark:text-slate-300 text-right"
                              style={{ fontFamily, width: `${Math.max((personalInfo.linkedin || '').length + 1, 18)}ch` }}
                            />
                            <Linkedin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick Unhide Badges in Editor Mode */}
                  {isEditorMode && Object.entries(personalInfo.visibleFields).some(([_, vis]) => !vis) && (
                    <div className="flex flex-wrap items-center justify-start gap-2 mt-2 pt-1 border-t border-dashed border-slate-200 dark:border-slate-700 print:hidden text-[10.5px] text-slate-400">
                      <span>Hiện lại mục đã ẩn:</span>
                      {Object.entries(personalInfo.visibleFields).filter(([_, vis]) => !vis).map(([key]) => (
                        <button
                          key={key}
                          onClick={(e) => { e.stopPropagation(); onToggleFieldVisibility(key as any); }}
                          className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded flex items-center gap-1 font-medium transition-colors"
                        >
                          <Eye className="w-2.5 h-2.5" /> {key === 'phone' ? 'SĐT' : key === 'email' ? 'Email' : key === 'location' ? 'Địa chỉ' : key === 'linkedin' ? 'LinkedIn' : 'Website'}
                        </button>
                      ))}
                    </div>
                  )}
                </header>
              )}

              {/* Page Content: Sections & Items assigned to this page */}
              {template === 'classic' || template === 'tech' || template === 'pro_split' || template === 'compact_ats' ? (
                <div className="grid grid-cols-12 gap-5 w-full items-start">
                  {/* Left Column (col-span-4 / ~33%) */}
                  <div className={`col-span-4 ${
                    template === 'pro_split'
                      ? 'bg-slate-50/90 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60'
                      : template === 'tech'
                      ? 'bg-slate-900/5 dark:bg-slate-900/30 p-2 rounded border-l-2 border-indigo-500'
                      : ''
                  } ${sectionSpacingMap[spacingDensity]}`}>
                    {page.leftSections && page.leftSections.length > 0 ? (
                      page.leftSections.map((pSec, sIdx) =>
                        renderSectionBlock(pSec.section, sIdx, {
                          overrideItems: pSec.items,
                          isContinuation: pSec.isContinuation,
                          showAddButton: pSec.showAddButton,
                          isLeftColumn: true
                        })
                      )
                    ) : isEditorMode && pageIdx === 0 ? (
                      <div className="p-3 border border-dashed border-slate-200 rounded-lg text-center text-[10px] text-slate-400 print:hidden">
                        Cột kỹ năng, chứng chỉ, ngoại ngữ...
                      </div>
                    ) : null}
                  </div>

                  {/* Right Column (col-span-8 / ~67%) */}
                  <div className={`col-span-8 ${sectionSpacingMap[spacingDensity]}`}>
                    {page.rightSections && page.rightSections.length > 0 ? (
                      page.rightSections.map((pSec, sIdx) =>
                        renderSectionBlock(pSec.section, sIdx, {
                          overrideItems: pSec.items,
                          isContinuation: pSec.isContinuation,
                          showAddButton: pSec.showAddButton,
                          isLeftColumn: false
                        })
                      )
                    ) : isEditorMode && pageIdx === 0 ? (
                      <div className="p-3 border border-dashed border-slate-200 rounded-lg text-center text-[10px] text-slate-400 print:hidden">
                        Cột mục tiêu, kinh nghiệm, đồ án, học vấn...
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                /* 1-Column Layout (Minimal Harvard, Executive Academic) */
                <div className={sectionSpacingMap[spacingDensity]}>
                  {page.sections.map((pSec, sIdx) =>
                    renderSectionBlock(pSec.section, sIdx, {
                      overrideItems: pSec.items,
                      isContinuation: pSec.isContinuation,
                      showAddButton: pSec.showAddButton
                    })
                  )}
                </div>
              )}

              {/* Bottom of Last Page: + Add Section Button */}
              {pageIdx === pages.length - 1 && isEditorMode && (
                <div className="mt-4 pt-2 border-t border-slate-200 print:hidden">
                  <button
                    type="button"
                    onClick={onOpenAddSectionModal}
                    className="w-full py-2.5 px-5 bg-blue-50/70 hover:bg-blue-100 text-blue-700 border border-dashed border-blue-300 hover:border-blue-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs"
                  >
                    <PlusCircle className="w-4 h-4 text-blue-600" />
                    + Thêm Mục Mới Vào CV
                  </button>
                </div>
              )}

              {/* Page Number Footer (Bottom Right of each page) */}
              <div className="absolute bottom-2.5 right-4 text-[10px] text-slate-400 font-medium print:text-slate-500">
                Trang {page.pageNumber} / {pages.length}
              </div>
            </div>

          </React.Fragment>
        ))}
      </div>

      {/* Inline Edit & Contextual AI Popover (Spec v0.4 - UC-CAN-009 & UC-CAN-010) */}
      <InlineEditPopover
        isOpen={inlineEditState.isOpen}
        initialText={inlineEditState.initialText}
        fieldLabel={inlineEditState.fieldLabel}
        targetRole={targetRole}
        jdContext={jdContext}
        remainingCredits={remainingCredits}
        onSaveManual={(newText) => {
          inlineEditState.onSave(newText);
        }}
        onApplyAi={(newText) => {
          inlineEditState.onApplyAi(newText);
        }}
        onClose={() => {
          setInlineEditState(prev => ({ ...prev, isOpen: false }));
        }}
      />

      {/* STAR Diff Review Modal (Ticket 04) */}
      {starProjectToReview && (
        <StarDiffReviewModal
          isOpen={Boolean(starProjectToReview)}
          onClose={() => setStarProjectToReview(null)}
          project={starProjectToReview}
          onApplyFinalBullets={(_projId, newBullets) => {
            const desc = newBullets.map(b => `• ${b}`).join('\n');
            onUpdateItemInSection(starProjectToReview._sectionId, starProjectToReview.id, {
              description: desc,
              bullets: newBullets
            });
            setStarProjectToReview(null);
          }}
        />
      )}

      {/* Project Defense Briefing Modal (Trụ Cột 3) */}
      {defenseProjectToReview && (
        <ProjectDefenseModal
          isOpen={Boolean(defenseProjectToReview)}
          onClose={() => setDefenseProjectToReview(null)}
          project={defenseProjectToReview}
          targetRole={personalInfo?.jobTitle}
        />
      )}
    </div>
  );
}
