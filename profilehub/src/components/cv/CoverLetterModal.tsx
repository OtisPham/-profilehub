import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  X,
  Sparkles,
  Printer,
  Copy,
  Check,
  CheckCheck,
  Briefcase,
  Building2,
  UserCheck,
  Layers,
  Send,
  Eye,
  Edit3,
  RefreshCw,
  FolderKanban,
  FileDown
} from 'lucide-react';
import {
  COVER_LETTER_TONES,
  type CoverLetterTone,
  type CoverLetterInput,
  type GeneratedCoverLetter,
  generateCoverLetter
} from '../../services/aiCoverLetterService';
import { INDUSTRY_DOMAINS, type IndustryDomainId } from '../../services/aiCvCoachService';
import { downloadCoverLetterDocx } from '../../services/wordExportService';

function AutoExpandingTextarea({
  value,
  onChange,
  placeholder,
  className = '',
  readOnly = false
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
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
      className={`w-full overflow-hidden resize-none bg-transparent outline-none leading-relaxed block text-left ${className}`}
      style={{ height: 'auto' }}
      rows={1}
    />
  );
}

interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateLocation?: string;
  targetRole?: string;
  skills?: string[];
  projects?: Array<{ id: string; title: string; description?: string }>;
  domainId?: IndustryDomainId;
}

export default function CoverLetterModal({
  isOpen,
  onClose,
  candidateName = 'Nguyễn Văn An',
  candidateEmail = 'nguyenvanan@example.com',
  candidatePhone = '0901 234 567',
  candidateLocation = 'TP. Hồ Chí Minh',
  targetRole = 'Frontend ReactJS Developer',
  skills = [],
  projects = [],
  domainId = 'it_software'
}: CoverLetterModalProps) {
  // Form controls
  const [role, setRole] = useState(targetRole);
  const [companyName, setCompanyName] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [selectedTone, setSelectedTone] = useState<CoverLetterTone>('confident');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [customNotes, setCustomNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontFamily, setFontFamily] = useState<'times' | 'arial'>('times');

  // Editable Letter State
  const [letter, setLetter] = useState<GeneratedCoverLetter>({
    salutation: '',
    opening: '',
    bodyParagraph1: '',
    bodyParagraph2: '',
    closing: '',
    signoff: '',
    fullContent: ''
  });

  const selectedProj = projects.find(p => p.id === selectedProjectId);

  // Initial generation
  const handleGenerate = (toneToUse: CoverLetterTone = selectedTone) => {
    setIsGenerating(true);
    setTimeout(() => {
      const input: CoverLetterInput = {
        candidateName,
        candidateEmail,
        candidatePhone,
        candidateLocation,
        targetRole: role || targetRole,
        targetCompany: companyName,
        hiringManager,
        skills,
        featuredProjectTitle: selectedProj?.title,
        featuredProjectDesc: selectedProj?.description,
        domainId,
        tone: toneToUse,
        customNotes
      };
      const result = generateCoverLetter(input);
      setLetter(result);
      setIsGenerating(false);
    }, 250);
  };

  useEffect(() => {
    if (isOpen) {
      setRole(targetRole);
      handleGenerate(selectedTone);
    }
  }, [isOpen, targetRole, domainId]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(letter.fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportWord = async () => {
    try {
      setIsExportingWord(true);
      await downloadCoverLetterDocx({
        candidateName,
        candidateEmail,
        candidatePhone,
        candidateLocation,
        targetRole: role || targetRole,
        letter
      });
    } catch (err) {
      console.error('Error creating Word docx:', err);
      alert('Đã xảy ra lỗi khi xuất file Word.');
    } finally {
      setIsExportingWord(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const updateSection = (key: keyof GeneratedCoverLetter, value: string) => {
    setLetter(prev => {
      const updated = { ...prev, [key]: value };
      updated.fullContent = `${updated.salutation}\n\n${updated.opening}\n\n${updated.bodyParagraph1}\n\n${updated.bodyParagraph2}\n\n${updated.closing}\n\n${updated.signoff}`;
      return updated;
    });
  };

  const fontClass = fontFamily === 'times' ? 'font-["Times_New_Roman",Times,serif]' : 'font-sans';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 backdrop-blur-sm p-2 sm:p-4 md:p-6 overflow-y-auto font-sans antialiased text-slate-800 animate-in fade-in duration-200">
      
      {/* Print styles for clean Word A4 Cover Letter */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 20mm 20mm 20mm 20mm;
        }
        @media print {
          html, body {
            width: 100% !important;
            height: auto !important;
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            font-family: "Times New Roman", Times, serif !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          #cover-letter-a4-sheet, #cover-letter-a4-sheet * {
            visibility: visible;
          }
          #cover-letter-a4-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            font-size: 13pt !important;
            line-height: 1.6 !important;
          }
          #cover-letter-a4-sheet textarea,
          #cover-letter-a4-sheet input {
            font-size: 13pt !important;
            line-height: 1.6 !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            outline: none !important;
            background: transparent !important;
            color: #000000 !important;
            font-family: inherit !important;
            resize: none !important;
          }
        }
      `}</style>

      {/* Main Container */}
      <div className="bg-[#f8fafc] border border-blue-200/80 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-white border-b border-blue-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                <span>AI Cover Letter Generator</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  Chuẩn Word & A4
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Tạo thư ứng tuyển chuyên nghiệp bám sát JD & đồ án thực tế
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - 2 Columns */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f1f5f9]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Controls */}
            <div className="lg:col-span-5 flex flex-col gap-4 print:hidden">
              
              {/* Card 1: Job Target & Company */}
              <div className="bg-white border border-blue-100 rounded-2xl p-4.5 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-blue-50">
                  <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    Thông Tin Ứng Tuyển
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Khớp theo JD</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 text-left">
                      Vị Trí Mục Tiêu:
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Ví dụ: Frontend ReactJS Developer"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 text-left">
                      Công Ty Ứng Tuyển:
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ví dụ: Công Ty Cổ Phần FPT Software"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 text-left">
                      Người Nhận / Phòng Tuyển Dụng:
                    </label>
                    <input
                      type="text"
                      value={hiringManager}
                      onChange={(e) => setHiringManager(e.target.value)}
                      placeholder="Ví dụ: Ban Giám Đốc Tuyển Dụng"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Tone Selection */}
              <div className="bg-white border border-blue-100 rounded-2xl p-4.5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-blue-50">
                  <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Phong Cách Thư
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {COVER_LETTER_TONES.map(t => {
                    const isSelected = selectedTone === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setSelectedTone(t.id);
                          handleGenerate(t.id);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-50/90 text-blue-900 border-blue-400 shadow-2xs ring-1 ring-blue-400'
                            : 'bg-white text-slate-700 border-blue-100 hover:bg-blue-50/40'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                          <span>{t.icon}</span>
                          <span className="truncate">{t.label}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                          {t.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card 3: Select Featured Verified Project */}
              {projects.length > 0 && (
                <div className="bg-white border border-blue-100 rounded-2xl p-4.5 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                      <FolderKanban className="w-4 h-4 text-blue-600" />
                      Đồ Án Đưa Vào Thư:
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Chọn để AI trích dẫn</span>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {projects.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          handleGenerate(selectedTone);
                        }}
                        className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between border transition-all ${
                          selectedProjectId === p.id
                            ? 'bg-blue-50 text-blue-700 font-bold border-blue-300'
                            : 'text-slate-700 bg-slate-50/50 border-slate-200/80 hover:bg-blue-50/40'
                        }`}
                      >
                        <span className="truncate font-medium">{p.title}</span>
                        {selectedProjectId === p.id && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: AI Regenerate */}
              <button
                type="button"
                onClick={() => handleGenerate(selectedTone)}
                disabled={isGenerating}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    AI Đang Viết Lại Thư...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Tạo Lại Với AI
                  </>
                )}
              </button>

            </div>

            {/* RIGHT COLUMN: Interactive Document Flow & A4 Canvas */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* Document Header & Quick Actions Toolbar */}
              <div className="bg-white border border-blue-100 rounded-2xl p-3.5 shadow-xs flex items-center justify-between flex-wrap gap-2 print:hidden">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-950">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Khổ A4 Chuẩn Word</span>
                  <span className="text-[11px] font-mono text-slate-400 font-medium">
                    ({letter.fullContent.trim().split(/\s+/).filter(Boolean).length} từ)
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />}
                    <span>{copied ? 'Đã Sao Chép' : 'Sao Chép'}</span>
                  </button>

                  {/* Word Download Button */}
                  <button
                    type="button"
                    onClick={handleExportWord}
                    disabled={isExportingWord}
                    className="px-3 py-1.5 bg-[#185abd] hover:bg-[#104a9e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-800/20 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isExportingWord ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileDown className="w-3.5 h-3.5" />
                    )}
                    <span>Xuất Word (.docx)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In / PDF A4</span>
                  </button>
                </div>
              </div>

              {/* A4 Sheet Container */}
              <div className="flex justify-center w-full">
                <div
                  id="cover-letter-a4-sheet"
                  className={`w-full max-w-[760px] bg-white border border-slate-300 rounded-sm p-8 sm:p-12 shadow-lg space-y-6 text-slate-900 ${fontClass}`}
                  style={{ minHeight: '650px' }}
                >
                  
                  {/* Candidate Information Header */}
                  <div className="border-b-2 border-blue-600 pb-4 flex items-start justify-between flex-wrap gap-3 font-sans">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-blue-950 uppercase tracking-tight">
                        {candidateName}
                      </h2>
                      <p className="text-xs sm:text-sm font-bold text-blue-600 mt-0.5">
                        {role || targetRole}
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-600 space-y-0.5 font-medium">
                      <div>{candidateEmail}</div>
                      {candidatePhone && <div>{candidatePhone}</div>}
                      {candidateLocation && <div>{candidateLocation}</div>}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-slate-500 italic text-left">
                    Ngày {new Date().toLocaleDateString('vi-VN')}
                  </div>

                  {/* Salutation */}
                  <div>
                    <input
                      type="text"
                      value={letter.salutation}
                      onChange={(e) => updateSection('salutation', e.target.value)}
                      placeholder="Kính gửi Quý Công Ty,"
                      className="w-full text-xs sm:text-sm font-bold text-slate-900 bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-1 text-left"
                    />
                  </div>

                  {/* Opening Paragraph */}
                  <div className="space-y-1 text-justify">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left print:hidden font-sans">
                      Đoạn Mở Đầu (Hook & Vị Trí)
                    </label>
                    <AutoExpandingTextarea
                      value={letter.opening}
                      onChange={(val) => updateSection('opening', val)}
                      placeholder="Mở đầu nêu rõ vị trí và lý do ứng tuyển..."
                      className="text-[14px] sm:text-[15px] text-slate-900 leading-[1.6] border border-transparent hover:border-blue-200 focus:border-blue-400 focus:bg-blue-50/20 rounded-md p-1.5 transition-all text-justify"
                    />
                  </div>

                  {/* Body Paragraph 1 (Evidence / STAR) */}
                  <div className="space-y-1 text-justify">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left print:hidden font-sans">
                      Thân Bài 1: Năng Lực Cốt Lõi & Bằng Chứng Đồ Án
                    </label>
                    <AutoExpandingTextarea
                      value={letter.bodyParagraph1}
                      onChange={(val) => updateSection('bodyParagraph1', val)}
                      placeholder="Chứng minh năng lực qua đồ án thực tế và kỹ năng..."
                      className="text-[14px] sm:text-[15px] text-slate-900 leading-[1.6] border border-transparent hover:border-blue-200 focus:border-blue-400 focus:bg-blue-50/20 rounded-md p-1.5 transition-all text-justify"
                    />
                  </div>

                  {/* Body Paragraph 2 (Value Proposition) */}
                  <div className="space-y-1 text-justify">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left print:hidden font-sans">
                      Thân Bài 2: Giá Trị Đóng Góp Cho Doanh Nghiệp
                    </label>
                    <AutoExpandingTextarea
                      value={letter.bodyParagraph2}
                      onChange={(val) => updateSection('bodyParagraph2', val)}
                      placeholder="Bày tỏ mong muốn cống hiến và giá trị mang lại..."
                      className="text-[14px] sm:text-[15px] text-slate-900 leading-[1.6] border border-transparent hover:border-blue-200 focus:border-blue-400 focus:bg-blue-50/20 rounded-md p-1.5 transition-all text-justify"
                    />
                  </div>

                  {/* Closing Paragraph */}
                  <div className="space-y-1 text-justify">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left print:hidden font-sans">
                      Đoạn Kết Thúc (Lời Cảm Ơn & Kêu Gọi Phỏng Vấn)
                    </label>
                    <AutoExpandingTextarea
                      value={letter.closing}
                      onChange={(val) => updateSection('closing', val)}
                      placeholder="Lời cảm ơn và hy vọng được trao đổi trong buổi phỏng vấn..."
                      className="text-[14px] sm:text-[15px] text-slate-900 leading-[1.6] border border-transparent hover:border-blue-200 focus:border-blue-400 focus:bg-blue-50/20 rounded-md p-1.5 transition-all text-justify"
                    />
                  </div>

                  {/* Signoff */}
                  <div className="pt-3 text-left space-y-1">
                    <div className="text-xs sm:text-sm font-medium text-slate-800">
                      Trân trọng cảm ơn,
                    </div>
                    <div className="text-sm sm:text-base font-bold text-slate-950 pt-2 font-sans">
                      {candidateName}
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
