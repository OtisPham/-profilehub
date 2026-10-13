import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { cvService } from '../../services/cvService';
import {
  FileText,
  Sparkles,
  Printer,
  Copy,
  Check,
  CheckCheck,
  Briefcase,
  Building2,
  FolderKanban,
  Send,
  Eye,
  RefreshCw,
  Zap,
  ArrowLeft,
  FileDown,
  Download,
  Type
} from 'lucide-react';
import {
  COVER_LETTER_TONES,
  type CoverLetterTone,
  type CoverLetterInput,
  type GeneratedCoverLetter,
  generateCoverLetter
} from '../../services/aiCoverLetterService';
import { detectIndustryDomain, type IndustryDomainId } from '../../services/aiCvCoachService';
import { downloadCoverLetterDocx } from '../../services/wordExportService';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';

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

export default function CoverLetterPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [candidateLocation, setCandidateLocation] = useState('TP. Hồ Chí Minh');
  
  const [role, setRole] = useState('Frontend ReactJS Developer');
  const [companyName, setCompanyName] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [selectedTone, setSelectedTone] = useState<CoverLetterTone>('confident');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projects, setProjects] = useState<Array<{ id: string; title: string; description?: string }>>([]);
  const [domainId, setDomainId] = useState<IndustryDomainId>('it_software');
  const [customNotes, setCustomNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontFamily, setFontFamily] = useState<'times' | 'arial' | 'inter'>('times');

  // Editable Letter Content
  const [letter, setLetter] = useState<GeneratedCoverLetter>({
    salutation: '',
    opening: '',
    bodyParagraph1: '',
    bodyParagraph2: '',
    closing: '',
    signoff: '',
    fullContent: ''
  });

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        // 1. Fetch active CV data if available
        const activeCvId = cvService.getActiveCVId(user?.id);
        const activeCv = activeCvId ? cvService.getCVById(activeCvId, user?.id) : null;
        
        // 2. Fetch profile source data
        const sourceData = await cvService.fetchStudentCVSourceData(user?.id);

        let realName = activeCv?.data?.personalInfo?.fullName
          || sourceData.profile?.full_name
          || user?.user_metadata?.full_name
          || user?.user_metadata?.name;

        let realEmail = activeCv?.data?.personalInfo?.email
          || user?.email
          || '';

        let realPhone = activeCv?.data?.personalInfo?.phone || '';
        let realLocation = activeCv?.data?.personalInfo?.location || 'TP. Hồ Chí Minh';
        let realRole = activeCv?.data?.personalInfo?.jobTitle
          || sourceData.profile?.major
          || 'Frontend Developer';

        // 3. Fallback direct database query if name is not yet present
        if ((!realName || realName === 'Nguyễn Văn An') && user?.id) {
          try {
            const [spRes, uRes] = await Promise.all([
              supabase.from('student_profiles').select('*').eq('id', user.id).maybeSingle(),
              supabase.from('users').select('*').eq('id', user.id).maybeSingle()
            ]);

            if (spRes.data?.full_name) {
              realName = spRes.data.full_name;
              if (spRes.data.major) realRole = spRes.data.major;
            } else if (uRes.data?.full_name) {
              realName = uRes.data.full_name;
            }
          } catch (fetchErr) {
            console.error('Error fetching name fallback:', fetchErr);
          }
        }

        // 4. Fallback to email username if still empty
        if (!realName) {
          if (user?.email) {
            const prefix = user.email.split('@')[0];
            realName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
          } else {
            realName = 'Ứng Viên';
          }
        }

        setCandidateName(realName);
        setCandidateEmail(realEmail || 'candidate@example.com');
        setCandidatePhone(realPhone || '0901 234 567');
        setCandidateLocation(realLocation);
        setRole(realRole);

        const detected = detectIndustryDomain(realRole);
        setDomainId(detected.id);

        // Projects list from active CV or student profile
        const activeCvProjects = activeCv?.data?.sections?.find((s: any) => s.type === 'projects')?.items;
        let projsList: Array<{ id: string; title: string; description?: string }> = [];

        if (activeCvProjects && activeCvProjects.length > 0) {
          projsList = activeCvProjects.map((p: any) => ({
            id: p.id,
            title: p.projectName || p.title || 'Dự án',
            description: p.description || ''
          }));
        } else if (sourceData.projects && sourceData.projects.length > 0) {
          projsList = sourceData.projects.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description || ''
          }));
        }

        setProjects(projsList);
        if (projsList.length > 0) {
          setSelectedProjectId(projsList[0].id);
        }

        // Initial Auto Generation with user's real name and data
        const initialProj = projsList[0];
        const input: CoverLetterInput = {
          candidateName: realName,
          candidateEmail: realEmail,
          candidatePhone: realPhone,
          candidateLocation: realLocation,
          targetRole: realRole,
          targetCompany: '',
          hiringManager: '',
          featuredProjectTitle: initialProj?.title,
          featuredProjectDesc: initialProj?.description,
          domainId: detected.id,
          tone: 'confident'
        };
        const generated = generateCoverLetter(input);
        setLetter(generated);
      } catch (err) {
        console.error('Error loading data for cover letter:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const handleGenerate = (toneToUse: CoverLetterTone = selectedTone) => {
    setIsGenerating(true);
    setTimeout(() => {
      const selectedProj = projects.find(p => p.id === selectedProjectId);
      const input: CoverLetterInput = {
        candidateName,
        candidateEmail,
        candidatePhone,
        candidateLocation,
        targetRole: role,
        targetCompany: companyName,
        hiringManager,
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
        targetRole: role,
        letter
      });
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Đã xảy ra lỗi khi tạo file Word. Vui lòng thử lại!');
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

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'times':
        return 'font-["Times_New_Roman",Times,serif]';
      case 'arial':
        return 'font-[Arial,Helvetica,sans-serif]';
      case 'inter':
      default:
        return 'font-sans';
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col bg-[#eef2f6] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased">
      
      {/* CSS @media print Rules for Perfect Microsoft Word & A4 Standard Alignment */}
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
          #cover-letter-page-a4, #cover-letter-page-a4 * {
            visibility: visible;
          }
          #cover-letter-page-a4 {
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
          #cover-letter-page-a4 textarea,
          #cover-letter-page-a4 input {
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

      {/* Top Header Bar */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between shrink-0 z-20 shadow-2xs print:hidden">
        
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 shrink-0">
            <FileText className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Hồ Sơ & CV /</span>
              <h2 className="text-sm sm:text-base font-bold text-blue-950 dark:text-white">
                Thư Giới Thiệu & Thư Ứng Tuyển (Cover Letter)
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Soạn thư ứng tuyển chuẩn hóa Word & In ấn A4 tiêu chuẩn doanh nghiệp
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <Link
            to="/cv-builder"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quay Lại CV Builder</span>
          </Link>

          <button
            onClick={handleCopy}
            className="px-3 sm:px-4 py-2 bg-white dark:bg-slate-800 hover:bg-blue-50 text-blue-700 dark:text-blue-400 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />}
            <span>{copied ? 'Đã Sao Chép' : 'Sao Chép'}</span>
          </button>

          {/* Microsoft Word Export Button */}
          <button
            onClick={handleExportWord}
            disabled={isExportingWord}
            className="px-3.5 sm:px-4.5 py-2 bg-[#185abd] hover:bg-[#104a9e] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-800/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="Tải xuống tệp Microsoft Word .docx chuẩn căn lề 1 inch"
          >
            {isExportingWord ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang Tạo Docx...</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" />
                <span>Xuất File Word (.docx)</span>
              </>
            )}
          </button>

          {/* Print / PDF Button */}
          <button
            onClick={handlePrint}
            className="px-3.5 sm:px-4.5 py-2 bg-slate-900 hover:bg-black text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            title="In ấn hoặc lưu dạng PDF khổ A4 tiêu chuẩn"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In / PDF A4</span>
          </button>
        </div>

      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left/Center Column: Live Word Standard A4 Interactive Canvas (Trọng Tâm Soạn Thảo) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Document Top Bar with Word Format Tools */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs flex items-center justify-between flex-wrap gap-2.5 print:hidden">
            
            {/* Left: Document Info */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Khổ Giấy A4 (Chuẩn Word 1 Inch Margins)</span>
              <span className="text-[11px] font-mono text-slate-400 font-medium">
                • {letter.fullContent.trim().split(/\s+/).filter(Boolean).length} từ
              </span>
            </div>

            {/* Right: Typography font family switch */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFontFamily('times')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  fontFamily === 'times'
                    ? 'bg-white dark:bg-slate-700 font-bold text-blue-700 dark:text-blue-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Font chuẩn công văn & văn bản quốc tế: Times New Roman"
              >
                Times New Roman
              </button>

              <button
                type="button"
                onClick={() => setFontFamily('arial')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  fontFamily === 'arial'
                    ? 'bg-white dark:bg-slate-700 font-bold text-blue-700 dark:text-blue-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Font Arial / Calibri hiện đại"
              >
                Arial
              </button>

              <button
                type="button"
                onClick={() => setFontFamily('inter')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  fontFamily === 'inter'
                    ? 'bg-white dark:bg-slate-700 font-bold text-blue-700 dark:text-blue-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Font Inter UI"
              >
                Inter
              </button>
            </div>

          </div>

          {/* Authentic Word Sheet Container */}
          <div className="flex justify-center w-full">
            <div
              id="cover-letter-page-a4"
              className={`w-full max-w-[800px] bg-white border border-slate-300/80 rounded-sm p-10 sm:p-14 md:p-16 shadow-xl space-y-6 text-slate-900 ${getFontFamilyClass()}`}
              style={{ minHeight: '900px' }}
            >
              
              {/* Candidate Header - Inline Editable */}
              <div className="border-b-2 border-blue-600 pb-5 flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-[240px]">
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCandidateName(val);
                      setLetter(prev => ({
                        ...prev,
                        signoff: `Trân trọng cảm ơn,\n${val}`
                      }));
                    }}
                    placeholder="HỌ VÀ TÊN CỦA BẠN"
                    className="w-full text-2xl sm:text-3xl font-black text-blue-950 uppercase tracking-tight font-sans bg-transparent border-b border-transparent hover:border-blue-300 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 cursor-text"
                    title="Nhấp để sửa tên trực tiếp"
                  />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Vị trí ứng tuyển"
                    className="w-full text-sm sm:text-base font-bold text-blue-600 mt-1 font-sans bg-transparent border-b border-transparent hover:border-blue-300 focus:border-blue-500 outline-none transition-all placeholder:text-blue-300 cursor-text"
                    title="Nhấp để sửa vị trí trực tiếp"
                  />
                </div>
                <div className="text-right text-xs sm:text-[13px] text-slate-600 space-y-1 font-medium font-sans min-w-[200px]">
                  <div>
                    <input
                      type="text"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      placeholder="Email liên hệ"
                      className="text-right bg-transparent border-b border-transparent hover:border-blue-300 focus:border-blue-500 outline-none w-full"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={candidatePhone}
                      onChange={(e) => setCandidatePhone(e.target.value)}
                      placeholder="Số điện thoại"
                      className="text-right bg-transparent border-b border-transparent hover:border-blue-300 focus:border-blue-500 outline-none w-full"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={candidateLocation}
                      onChange={(e) => setCandidateLocation(e.target.value)}
                      placeholder="Địa chỉ / Tỉnh thành"
                      className="text-right bg-transparent border-b border-transparent hover:border-blue-300 focus:border-blue-500 outline-none w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="text-xs sm:text-sm text-slate-500 italic text-left">
                Ngày {new Date().toLocaleDateString('vi-VN')}
              </div>

              {/* Salutation */}
              <div>
                <input
                  type="text"
                  value={letter.salutation}
                  onChange={(e) => updateSection('salutation', e.target.value)}
                  placeholder="Kính gửi Quý Công Ty,"
                  className="w-full text-sm sm:text-base font-bold text-slate-900 bg-transparent border-none outline-none focus:bg-blue-50/40 rounded px-1 text-left"
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
                  className="text-[14.5px] sm:text-[15.5px] text-slate-900 leading-[1.65] border border-transparent hover:border-blue-200 focus:border-blue-400 focus:bg-blue-50/20 rounded-md p-1.5 transition-all text-justify"
                />
              </div>

              {/* Body Paragraph 1 (Evidence & STAR) */}
              <div className="space-y-1 text-justify">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left print:hidden font-sans">
                  Thân Bài 1: Năng Lực Cốt Lõi & Dự Án Thực Chiến
                </label>
                <AutoExpandingTextarea
                  value={letter.bodyParagraph1}
                  onChange={(val) => updateSection('bodyParagraph1', val)}
                  placeholder="Chứng minh năng lực qua dự án thực tế và kỹ năng..."
                  className="text-[14.5px] sm:text-[15.5px] text-slate-900 leading-[1.65] border border-transparent hover:border-blue-200 focus:border-blue-400 focus:bg-blue-50/20 rounded-md p-1.5 transition-all text-justify"
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
                  className="text-[14.5px] sm:text-[15.5px] text-slate-900 leading-[1.65] border border-transparent hover:border-blue-200 focus:border-blue-400 focus:bg-blue-50/20 rounded-md p-1.5 transition-all text-justify"
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
                  className="text-[14.5px] sm:text-[15.5px] text-slate-900 leading-[1.65] border border-transparent hover:border-blue-200 focus:border-blue-400 focus:bg-blue-50/20 rounded-md p-1.5 transition-all text-justify"
                />
              </div>

              {/* Signoff */}
              <div className="pt-4 text-left space-y-2">
                <div className="text-sm sm:text-base font-normal text-slate-800">
                  Trân trọng cảm ơn,
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-950 pt-2 font-sans">
                  {candidateName}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Form & Tone Controls (Bảng Điều Khiển Phụ Trợ) */}
        <div className="lg:col-span-5 flex flex-col gap-4 print:hidden lg:sticky lg:top-4">
          
          {/* Card 1: Job Target & Recruiter Context */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-blue-950 dark:text-white flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Thông Tin Vị Trí Ứng Tuyển
              </span>
              <span className="text-[10.5px] text-slate-400 font-medium">Bám sát theo JD</span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-left">
                  Họ Và Tên Ứng Viên
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCandidateName(val);
                    setLetter(prev => ({
                      ...prev,
                      signoff: `Trân trọng cảm ơn,\n${val}`
                    }));
                  }}
                  placeholder="Nhập họ và tên của bạn..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold placeholder:text-slate-400 placeholder:italic focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-left">
                  Vị Trí Mục Tiêu
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ví dụ: Frontend ReactJS Developer"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium placeholder:text-slate-400 placeholder:italic focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-left">
                  Tên Công Ty <span className="text-slate-400 font-normal">(Tùy chọn)</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ví dụ: Công Ty Cổ Phần Công Nghệ FPT"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium placeholder:text-slate-400 placeholder:italic focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-left">
                  Người Nhận / Bộ Phận Tuyển Dụng <span className="text-slate-400 font-normal">(Tùy chọn)</span>
                </label>
                <input
                  type="text"
                  value={hiringManager}
                  onChange={(e) => setHiringManager(e.target.value)}
                  placeholder="Ví dụ: Anh/Chị Trưởng Phòng Tuyển Dụng"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium placeholder:text-slate-400 placeholder:italic focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Tone Selection */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-blue-950 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Phong Cách & Giọng Văn
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
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/90 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border-blue-400 shadow-2xs ring-1 ring-blue-400'
                        : 'bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                      <span>{t.icon}</span>
                      <span className="truncate">{t.label}</span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                      {t.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 3: Select Featured Verified Project */}
          {projects.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-blue-950 dark:text-white flex items-center gap-1.5">
                  <FolderKanban className="w-4 h-4 text-blue-600" />
                  Dự Án Đưa Vào Thư
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Bằng chứng năng lực</span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {projects.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      handleGenerate(selectedTone);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center justify-between border transition-all ${
                      selectedProjectId === p.id
                        ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold border-blue-300 dark:border-blue-700'
                        : 'text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate font-medium">{p.title}</span>
                    {selectedProjectId === p.id && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card 4: Additional Notes / Prompt */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 text-left">
              Ghi Chú Hoặc Yêu Cầu Đặc Biệt Cho AI:
            </label>
            <textarea
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              rows={2}
              placeholder="Ví dụ: Nhấn mạnh kinh nghiệm làm việc nhóm và mong muốn học hỏi thêm về Cloud..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium placeholder:text-slate-400 placeholder:italic focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition-all text-left"
            />
          </div>

          {/* Action Buttons: AI Regenerate */}
          <button
            type="button"
            onClick={() => handleGenerate(selectedTone)}
            disabled={isGenerating}
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI Đang Tinh Chỉnh Thư...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Tạo Lại Với AI (Cập Nhật Thư)</span>
              </>
            )}
          </button>

        </div>

      </main>

    </div>
  );
}
