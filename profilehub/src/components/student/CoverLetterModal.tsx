import { useState, useEffect, useMemo } from 'react';
import {
  X,
  FileText,
  Mail,
  Copy,
  Check,
  Download,
  Sparkles,
  Building,
  Briefcase,
  Layers,
  Save,
  Send,
  ExternalLink,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import { cvService } from '../../services/cvService';
import { coverLetterService } from '../../services/coverLetterService';
import type {
  CoverLetterDraft,
  CoverLetterTone,
  CoverLetterCandidateProject
} from '../../types/coverLetter.types';
import type { ProjectItem } from '../../types/cvSection';

export interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: string;
  companyName: string;
  roleTitle: string;
  linkedCvId?: string;
}

export default function CoverLetterModal({
  isOpen,
  onClose,
  applicationId,
  companyName,
  roleTitle,
  linkedCvId
}: CoverLetterModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'letter' | 'email' | 'projects'>('letter');
  const [tone, setTone] = useState<CoverLetterTone>('professional');

  const [copiedLetter, setCopiedLetter] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Extract projects from linked CV if available
  const candidateProjects = useMemo<CoverLetterCandidateProject[]>(() => {
    if (!linkedCvId || !user?.id) return [];
    try {
      const cv = cvService.getCVById(linkedCvId, user.id);
      if (cv && cv.data && Array.isArray(cv.data.sections)) {
        const projectSection = cv.data.sections.find(s => s.type === 'projects');
        if (projectSection && Array.isArray(projectSection.items)) {
          return (projectSection.items as ProjectItem[]).map(p => {
            const raw = p as unknown as Record<string, string | undefined>;
            return {
              id: p.id,
              projectName: p.projectName,
              description: p.description || '',
              bullets: p.bullets || (p.description ? p.description.split('\n') : []),
              technologies: p.technologies || [],
              verificationCode: raw.verification_code || raw.verificationCode
            };
          });
        }
      }
    } catch {
      // Fallback
    }
    return [];
  }, [linkedCvId, user?.id]);

  // Draft State
  const [draft, setDraft] = useState<CoverLetterDraft | null>(null);

  // Load existing or initialize draft
  useEffect(() => {
    if (!isOpen) return;

    if (applicationId) {
      const saved = coverLetterService.getSavedCoverLetter(applicationId);
      if (saved) {
        setDraft(saved);
        setTone(saved.tone);
        return;
      }
    }

    const initial = coverLetterService.generateCoverLetterDraft({
      applicationId,
      companyName,
      roleTitle,
      tone,
      candidateName: user?.user_metadata?.full_name || 'Ứng viên IT',
      candidateEmail: user?.email,
      candidateUniversity: 'Khoa Công Nghệ Thông Tin',
      projects: candidateProjects
    });

    setDraft(initial);
  }, [isOpen, applicationId, companyName, roleTitle, user, candidateProjects]);

  // Handle Tone Switch
  const handleToneChange = (newTone: CoverLetterTone) => {
    setTone(newTone);
    const updated = coverLetterService.generateCoverLetterDraft({
      applicationId,
      companyName,
      roleTitle,
      tone: newTone,
      candidateName: user?.user_metadata?.full_name || 'Ứng viên IT',
      candidateEmail: user?.email,
      candidateUniversity: 'Khoa Công Nghệ Thông Tin',
      projects: candidateProjects
    });
    setDraft(updated);
  };

  if (!isOpen || !draft) return null;

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(draft.letter.fullMarkdown);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const handleCopySubject = () => {
    navigator.clipboard.writeText(draft.email.subjectLine);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(draft.email.bodyText);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSaveDraft = () => {
    coverLetterService.saveCoverLetter(draft);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = coverLetterService.exportCoverLetterAsMarkdown(draft);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CoverLetter_${companyName.replace(/\s+/g, '_')}_${roleTitle.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Word count and reading time
  const fullText = `${draft.letter.hookParagraph} ${draft.letter.projectHighlightParagraph} ${draft.letter.companyFitParagraph} ${draft.letter.callToActionParagraph}`;
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;
  const estimatedReadTime = Math.ceil(wordCount / 180);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                  Bộ Hồ Sơ Ứng Tuyển May Đo
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  1-Click Kit
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{companyName}</span>
                <span>•</span>
                <span>{roleTitle}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tone Selector & Tabs Subheader */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Main Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('letter')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'letter'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Thư Ứng Tuyển (Cover Letter)</span>
            </button>

            <button
              onClick={() => setActiveTab('email')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'email'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Mẫu Email Gửi HR</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'projects'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Đồ Án Trích Xuất ({draft.highlightedProjects.length})</span>
            </button>
          </div>

          {/* Tone Presets */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase hidden sm:inline">Văn phong:</span>
            {(['professional', 'startup', 'technical'] as CoverLetterTone[]).map(t => (
              <button
                key={t}
                onClick={() => handleToneChange(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                  tone === t
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {t === 'professional' ? '👔 Chuyên nghiệp' : t === 'startup' ? '🚀 Startup' : '⚡ Kỹ thuật'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: FORMAL COVER LETTER */}
          {activeTab === 'letter' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {/* Document Meta info bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>Độ dài: <strong>{wordCount} từ</strong> (~{estimatedReadTime} phút đọc)</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  ✨ Đã dệt số liệu STAR từ đồ án thực tế
                </span>
              </div>

              {/* A4 Paper Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                {/* Salutation */}
                <input
                  type="text"
                  value={draft.letter.salutation}
                  onChange={e => {
                    const newSal = e.target.value;
                    setDraft(prev => prev ? {
                      ...prev,
                      letter: { ...prev.letter, salutation: newSal }
                    } : null);
                  }}
                  className="w-full font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-emerald-500 focus:outline-none transition py-0.5"
                />

                {/* Đoạn 1: The Hook */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Đoạn 1: Mở đầu & Mục tiêu ứng tuyển
                  </span>
                  <textarea
                    rows={3}
                    value={draft.letter.hookParagraph}
                    onChange={e => {
                      const newHook = e.target.value;
                      setDraft(prev => prev ? {
                        ...prev,
                        letter: { ...prev.letter, hookParagraph: newHook }
                      } : null);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition resize-y"
                  />
                </div>

                {/* Đoạn 2: Hero Project & Metrics */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                      Đoạn 2: Minh chứng đồ án & Số liệu STAR định lượng
                    </span>
                    <span className="text-[10px] text-slate-400">Trọng tâm kỹ thuật</span>
                  </div>
                  <textarea
                    rows={4}
                    value={draft.letter.projectHighlightParagraph}
                    onChange={e => {
                      const newProj = e.target.value;
                      setDraft(prev => prev ? {
                        ...prev,
                        letter: { ...prev.letter, projectHighlightParagraph: newProj }
                      } : null);
                    }}
                    className="w-full p-2.5 rounded-xl bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition resize-y"
                  />
                </div>

                {/* Đoạn 3: Company Fit */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Đoạn 3: Sự am hiểu & Độ tương thích với doanh nghiệp
                  </span>
                  <textarea
                    rows={3}
                    value={draft.letter.companyFitParagraph}
                    onChange={e => {
                      const newFit = e.target.value;
                      setDraft(prev => prev ? {
                        ...prev,
                        letter: { ...prev.letter, companyFitParagraph: newFit }
                      } : null);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition resize-y"
                  />
                </div>

                {/* Đoạn 4: CTA & Sign-off */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Đoạn 4: Lời cảm ơn & Kêu gọi phỏng vấn (CTA)
                  </span>
                  <textarea
                    rows={2}
                    value={draft.letter.callToActionParagraph}
                    onChange={e => {
                      const newCta = e.target.value;
                      setDraft(prev => prev ? {
                        ...prev,
                        letter: { ...prev.letter, callToActionParagraph: newCta }
                      } : null);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition resize-y"
                  />
                </div>

                <div className="pt-2 text-right">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {draft.letter.signOff}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OUTBOUND HR EMAIL */}
          {activeTab === 'email' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-300 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <p>
                  Mẫu email ngắn gọn dưới 150 từ được tối ưu hóa cho HR đọc nhanh trên điện thoại trong 15 giây đầu tiên. Sao chép và dán trực tiếp vào Gmail / Outlook khi gửi kèm CV.
                </p>
              </div>

              {/* Subject Line Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Tiêu Đề Email (Subject Line)
                  </label>
                  <button
                    onClick={handleCopySubject}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {copiedSubject ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSubject ? 'Đã sao chép!' : 'Sao chép Tiêu Đề'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={draft.email.subjectLine}
                  onChange={e => {
                    const newSub = e.target.value;
                    setDraft(prev => prev ? {
                      ...prev,
                      email: { ...prev.email, subjectLine: newSub }
                    } : null);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Email Body Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Nội Dung Thư (Email Body)
                  </label>
                  <button
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? 'Đã sao chép!' : 'Sao chép Toàn Bộ'}</span>
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={draft.email.bodyText}
                  onChange={e => {
                    const newBody = e.target.value;
                    setDraft(prev => prev ? {
                      ...prev,
                      email: { ...prev.email, bodyText: newBody }
                    } : null);
                  }}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-sans leading-relaxed text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition resize-y"
                />
              </div>

              {/* Attachments checklist */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Checklist trước khi bấm gửi:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Đã đính kèm file CV PDF chuẩn A4</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Đã kiểm tra liên kết minh chứng đồ án</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HIGHLIGHTED PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Các dự án dưới đây được hệ thống tự động trích xuất từ CV của bạn và dệt vào nội dung Cover Letter để thuyết phục Tech Lead:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {draft.highlightedProjects.map((p, idx) => (
                  <div
                    key={p.projectId || idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            {p.projectTitle}
                          </h4>
                          {p.verificationCode && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              <ShieldCheck className="w-3 h-3" />
                              <span>{p.verificationCode}</span>
                            </span>
                          )}
                        </div>
                        {p.keyMetric && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            🎯 Số liệu STAR: "{p.keyMetric}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {p.technologies.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition shadow-2xs"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Đã lưu bản nháp!' : 'Lưu bản nháp'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition shadow-2xs"
              title="Tải về máy định dạng Markdown (.md)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tải Markdown (.md)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLetter}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-md shadow-emerald-600/20"
            >
              {copiedLetter ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLetter ? 'Đã sao chép Thư!' : 'Sao Chép Thư'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
