import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useSearchParams, Link } from 'react-router-dom';
import { getSharedPipeline } from '../../utils/pipelineSync';
import {
  FileText,
  FileDown,
  Printer,
  Copy,
  Check,
  CheckCheck,
  Briefcase,
  Building2,
  Sparkles,
  RefreshCw,
  Send,
  Mail,
  Calendar,
  DollarSign,
  Gift,
  Clock,
  MapPin,
  Shield,
  ArrowLeft,
  User,
  CheckSquare,
  Square,
  ChevronRight
} from 'lucide-react';
import {
  OFFER_LETTER_TONES,
  type OfferLetterTone,
  type OfferLetterInput,
  type GeneratedOfferLetter,
  generateOfferLetter,
  DEFAULT_OFFER_BENEFITS
} from '../../services/aiOfferLetterService';
import { downloadOfferLetterDocx } from '../../services/wordExportService';

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

export default function OfferLetterPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  // Candidate Data
  const [candidateName, setCandidateName] = useState(searchParams.get('candidateName') || 'Nguyễn Văn An');
  const [candidateEmail, setCandidateEmail] = useState(searchParams.get('candidateEmail') || 'nguyenvanan.dev@gmail.com');
  const [candidatePhone, setCandidatePhone] = useState(searchParams.get('candidatePhone') || '0901 234 567');
  
  // Company Data
  const [companyName, setCompanyName] = useState('Công Ty Cổ Phần Công Nghệ ProfileHub');
  const [recruiterName, setRecruiterName] = useState((user as any)?.user_metadata?.full_name || (user as any)?.full_name || 'Trần Hoàng Nam');
  const [recruiterTitle, setRecruiterTitle] = useState('Trưởng Phòng Nhân Sự (Head of HR)');

  // Job & Terms
  const [jobTitle, setJobTitle] = useState(searchParams.get('role') || 'Frontend ReactJS Developer');
  const [department, setDepartment] = useState('Khối Phát Triển Sản Phẩm (Product Engineering)');
  const [employmentType, setEmploymentType] = useState('Toàn thời gian chính thức (Full-time)');
  
  // Dates
  const defaultStartDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN');
  const defaultDeadline = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN');
  const [startDate, setStartDate] = useState(`Ngày ${defaultStartDate}`);
  const [responseDeadline, setResponseDeadline] = useState(`17:00 ngày ${defaultDeadline}`);

  // Compensation
  const [baseSalary, setBaseSalary] = useState('18,000,000 VNĐ / tháng (Gross)');
  const [probationDuration, setProbationDuration] = useState('02 tháng (hưởng 85% lương chính thức)');
  const [probationSalary, setProbationSalary] = useState('15,300,000 VNĐ / tháng');
  const [workLocation, setWorkLocation] = useState('Tòa nhà Innovation Hub, Quận 1, TP. Hồ Chí Minh (Chế độ Hybrid)');
  const [workHours, setWorkHours] = useState('Thứ Hai đến Thứ Sáu (08:30 - 17:30)');

  // Tone & Benefits
  const [selectedTone, setSelectedTone] = useState<OfferLetterTone>('corporate_standard');
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(DEFAULT_OFFER_BENEFITS);
  const [customNotes, setCustomNotes] = useState('');

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontFamily, setFontFamily] = useState<'times' | 'arial'>('times');

  // Generated Offer Letter
  const [letter, setLetter] = useState<GeneratedOfferLetter>({
    documentTitle: '',
    dateStr: '',
    salutation: '',
    opening: '',
    positionDetailsText: '',
    compensationText: '',
    benefitsText: '',
    confidentialityText: '',
    acceptanceDeadlineText: '',
    closing: '',
    employerSignOffName: '',
    employerSignOffTitle: '',
    candidateSignOffPrompt: '',
    fullContent: ''
  });

  const handleGenerate = (toneToUse: OfferLetterTone = selectedTone) => {
    setIsGenerating(true);
    setTimeout(() => {
      const input: OfferLetterInput = {
        candidateName,
        candidateEmail,
        candidatePhone,
        companyName,
        recruiterName,
        recruiterTitle,
        jobTitle,
        department,
        employmentType,
        startDate,
        baseSalary,
        probationDuration,
        probationSalary,
        workLocation,
        workHours,
        benefits: selectedBenefits,
        responseDeadline,
        tone: toneToUse,
        customNotes
      };
      const result = generateOfferLetter(input);
      setLetter(result);
      setIsGenerating(false);
    }, 200);
  };

  useEffect(() => {
    handleGenerate(selectedTone);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(letter.fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportWord = async () => {
    try {
      setIsExportingWord(true);
      await downloadOfferLetterDocx({
        candidateName,
        companyName,
        jobTitle,
        letter
      });
    } catch (err) {
      console.error('Error generating Word document:', err);
      alert('Đã xảy ra lỗi khi tạo file Word.');
    } finally {
      setIsExportingWord(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    if (!candidateEmail) {
      alert('Vui lòng nhập địa chỉ email của ứng viên để mở ứng dụng gửi thư.');
      return;
    }

    const emailSubject = `[${companyName}] - THƯ MỜI NHẬN VIỆC (JOB OFFER LETTER) - VỊ TRÍ ${jobTitle.toUpperCase()} - ${candidateName.toUpperCase()}`;

    const emailBody = `Kính gửi ${candidateName},

Thay mặt ${companyName}, chúng tôi rất vui mừng và trân trọng gửi đến bạn Thư Mời Nhận Việc chính thức (Job Offer Letter) cho vị trí ${jobTitle} tại ${department}.

==================================================
📋 TÓM TẮT THÔNG TIN NHẬN VIỆC:
- Vị trí công tác: ${jobTitle}
- Khối / Phòng ban: ${department}
- Hình thức làm việc: ${employmentType}
- Ngày bắt đầu nhận việc: ${startDate}
- Địa điểm làm việc: ${workLocation}
- Giờ làm việc tiêu chuẩn: ${workHours}
- Mức lương chính thức: ${baseSalary}
- Thời gian thử việc: ${probationDuration} (Mức lương thử việc: ${probationSalary})
- Thời hạn phản hồi xác nhận: Trước ${responseDeadline}
==================================================

📜 NỘI DUNG CHI TIẾT THƯ MỜI NHẬN VIỆC:

${letter.fullContent || ''}

==================================================
Nếu bạn đồng ý nhận việc hoặc có bất kỳ câu hỏi nào cần giải đáp thêm, vui lòng phản hồi lại email này trước ${responseDeadline}.

Rất mong sớm được chào đón bạn gia nhập đại gia đình ${companyName}!

Trân trọng,
${letter.employerSignOffName || recruiterName}
${letter.employerSignOffTitle || recruiterTitle}
${companyName}`;

    const mailtoUrl = `mailto:${encodeURIComponent(candidateEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoUrl;
  };

  const toggleBenefit = (b: string) => {
    if (selectedBenefits.includes(b)) {
      setSelectedBenefits(selectedBenefits.filter(item => item !== b));
    } else {
      setSelectedBenefits([...selectedBenefits, b]);
    }
  };

  const fontClass = fontFamily === 'times' ? 'font-["Times_New_Roman",Times,serif]' : 'font-sans';

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col bg-[#eef2f6] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased">
      
      {/* Print styles for authentic A4 Word document */}
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
          #offer-letter-a4-sheet, #offer-letter-a4-sheet * {
            visibility: visible;
          }
          #offer-letter-a4-sheet {
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
            font-size: 12pt !important;
            line-height: 1.5 !important;
          }
          #offer-letter-a4-sheet textarea,
          #offer-letter-a4-sheet input {
            font-size: 12pt !important;
            line-height: 1.5 !important;
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

      {/* Top Header Bar - Single Row Clean Layout */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20 shadow-2xs print:hidden gap-3">
        
        {/* Left: Brand & Title on Single Line */}
        <div className="flex items-center gap-2.5 min-w-0 shrink">
          <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Tuyển Dụng /</span>
              <h1 className="text-sm sm:text-base font-bold text-blue-950 dark:text-white truncate">
                Thư Mời Nhận Việc
              </h1>
              <span className="hidden lg:inline text-[11px] text-slate-400 font-normal">
                (Job Offer Letter Generator)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions All in 1 Single Row */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/recruiter/pipeline"
            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all"
            title="Quay lại luồng tuyển dụng"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pipeline</span>
          </Link>

          {/* Open Email Client Button */}
          <button
            onClick={handleSendEmail}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            title="Mở ứng dụng Email (Gmail / Outlook) với tiêu đề và nội dung Thư Mời Nhận Việc đã điền sẵn"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Gửi Email Thư Mời</span>
          </button>

          {/* Microsoft Word Export */}
          <button
            onClick={handleExportWord}
            disabled={isExportingWord}
            className="px-3.5 py-2 bg-[#185abd] hover:bg-[#104a9e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-800/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50 whitespace-nowrap"
            title="Tải xuống tệp Microsoft Word .docx chuẩn 1 inch margins"
          >
            {isExportingWord ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang Tạo Docx...</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" />
                <span>Xuất File Word</span>
              </>
            )}
          </button>

          {/* Print / PDF */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            title="In trực tiếp ra máy in hoặc Lưu dưới dạng PDF chuẩn khổ A4"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In / PDF A4</span>
          </button>
        </div>

      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Controls & Offer Parameters */}
        <div className="lg:col-span-5 flex flex-col gap-4 print:hidden">
          
          {/* Card 1: Candidate & Company */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-blue-950 dark:text-white flex items-center gap-1.5">
                <User className="w-4 h-4 text-purple-600" />
                Thông Tin Ứng Viên & Doanh Nghiệp
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-left">
                  Họ và Tên Ứng Viên:
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-left">
                    Email Ứng Viên:
                  </label>
                  <input
                    type="email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-left">
                    Số Điện Thoại:
                  </label>
                  <input
                    type="text"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    placeholder="0901 234 567"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-left">
                    Vị Trí Nhận Việc:
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-left">
                    Phòng Ban:
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-left">
                  Tên Doanh Nghiệp Phát Hành:
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                />
              </div>

              {/* Recruiter / Hiring Representative Info */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider block text-left">
                  👤 Người Tuyển Dụng / Đại Diện Ký Thư:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-left">
                      Tên Người Tuyển Dụng:
                    </label>
                    <input
                      type="text"
                      value={recruiterName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRecruiterName(val);
                        setLetter(prev => ({ ...prev, employerSignOffName: val }));
                      }}
                      placeholder="VD: Trần Hoàng Nam"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-left">
                      Chức Danh Người Tuyển:
                    </label>
                    <input
                      type="text"
                      value={recruiterTitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRecruiterTitle(val);
                        setLetter(prev => ({ ...prev, employerSignOffTitle: val }));
                      }}
                      placeholder="VD: Trưởng Phòng Nhân Sự"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Compensation & Dates */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-blue-950 dark:text-white flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Mức Lương & Thời Gian Làm Việc
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-left">
                  Mức Lương Chính Thức (Gross/Net):
                </label>
                <input
                  type="text"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(e.target.value)}
                  placeholder="VD: 18,000,000 VNĐ / tháng"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-left">
                    Lương Thử Việc:
                  </label>
                  <input
                    type="text"
                    value={probationSalary}
                    onChange={(e) => setProbationSalary(e.target.value)}
                    placeholder="VD: 15,300,000 VNĐ"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-left">
                    Thời Gian Thử Việc:
                  </label>
                  <input
                    type="text"
                    value={probationDuration}
                    onChange={(e) => setProbationDuration(e.target.value)}
                    placeholder="VD: 02 tháng"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-left">
                    Ngày Nhận Việc:
                  </label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-left">
                    Hạn Phản Hồi Offer:
                  </label>
                  <input
                    type="text"
                    value={responseDeadline}
                    onChange={(e) => setResponseDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Tone Selection */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-blue-950 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Văn Phong Thư Mời Nhận Việc
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {OFFER_LETTER_TONES.map(t => {
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
                        ? 'bg-purple-50/90 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 border-purple-400 shadow-2xs ring-1 ring-purple-400'
                        : 'bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                      <span>{t.icon}</span>
                      <span className="truncate">{t.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                      {t.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 4: Benefits Selection */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-blue-950 dark:text-white flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-purple-600" />
                Chính Sách Phúc Lợi Đi Kèm
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Chọn để đưa vào thư</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {DEFAULT_OFFER_BENEFITS.map((benefit, idx) => {
                const isChecked = selectedBenefits.includes(benefit);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      toggleBenefit(benefit);
                      setTimeout(() => handleGenerate(selectedTone), 50);
                    }}
                    className={`w-full p-2 rounded-xl text-left text-xs flex items-start gap-2 border transition-all ${
                      isChecked
                        ? 'bg-purple-50/80 text-purple-900 border-purple-200 font-medium'
                        : 'bg-slate-50/50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {isChecked ? <CheckSquare className="w-3.5 h-3.5 text-purple-600" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                    </span>
                    <span className="leading-snug text-[11px]">{benefit}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons: AI Regenerate & Send Email */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => handleGenerate(selectedTone)}
              disabled={isGenerating}
              className="w-full py-3 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Đang Soạn Thảo Thư Mời...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo Lại Với AI (Cập Nhật Thư Mời)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSendEmail}
              className="w-full py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Mở Email Gửi Cho Ứng Viên ({candidateEmail || 'Chưa nhập email'})</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Live Word Standard A4 Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Document Top Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs flex items-center justify-between flex-wrap gap-2.5 print:hidden">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Bản Soạn Thảo Thư Mời Nhận Việc (Khổ A4 Chuẩn Word)</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFontFamily('times')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  fontFamily === 'times'
                    ? 'bg-white dark:bg-slate-700 font-bold text-purple-700 dark:text-purple-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Times New Roman
              </button>

              <button
                type="button"
                onClick={() => setFontFamily('arial')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  fontFamily === 'arial'
                    ? 'bg-white dark:bg-slate-700 font-bold text-purple-700 dark:text-purple-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Arial
              </button>
            </div>
          </div>

          {/* Authentic Word Sheet Container */}
          <div className="flex justify-center w-full">
            <div
              id="offer-letter-a4-sheet"
              className={`w-full max-w-[800px] bg-white border border-slate-300 rounded-sm p-10 sm:p-14 md:p-16 shadow-xl space-y-5 text-slate-900 ${fontClass}`}
              style={{ minHeight: '900px' }}
            >
              {/* Company Header */}
              <div className="text-center border-b border-slate-200 pb-4 font-sans">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  VĂN BẢN TUYỂN DỤNG CHÍNH THỨC
                </div>
                <h2 className="text-base sm:text-lg font-black text-blue-950 uppercase mt-0.5">
                  {companyName}
                </h2>
              </div>

              {/* Document Title & Date */}
              <div className="text-center pt-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight font-sans">
                  THƯ MỜI NHẬN VIỆC (JOB OFFER LETTER)
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 italic mt-1 text-right">
                  {letter.dateStr}
                </p>
              </div>

              {/* Salutation */}
              <div>
                <input
                  type="text"
                  value={letter.salutation}
                  onChange={(e) => setLetter({ ...letter, salutation: e.target.value })}
                  placeholder="Kính gửi Anh/Chị,"
                  className="w-full text-sm sm:text-base font-bold text-slate-900 bg-transparent border-none outline-none focus:bg-purple-50/40 rounded px-1 text-left"
                />
              </div>

              {/* Opening Paragraph */}
              <div className="space-y-1 text-justify">
                <AutoExpandingTextarea
                  value={letter.opening}
                  onChange={(val) => setLetter({ ...letter, opening: val })}
                  placeholder="Lời mở đầu chúc mừng ứng viên..."
                  className="text-[14px] sm:text-[15px] text-slate-900 leading-[1.65] border border-transparent hover:border-purple-200 focus:border-purple-400 focus:bg-purple-50/20 rounded-md p-1.5 transition-all text-justify"
                />
              </div>

              {/* Section 1: Position & Work Details */}
              <div className="space-y-1">
                <AutoExpandingTextarea
                  value={letter.positionDetailsText}
                  onChange={(val) => setLetter({ ...letter, positionDetailsText: val })}
                  className="text-[14px] sm:text-[15px] text-slate-900 leading-[1.65] border border-transparent hover:border-purple-200 focus:border-purple-400 focus:bg-purple-50/20 rounded-md p-1.5 transition-all whitespace-pre-wrap"
                />
              </div>

              {/* Section 2: Compensation */}
              <div className="space-y-1">
                <AutoExpandingTextarea
                  value={letter.compensationText}
                  onChange={(val) => setLetter({ ...letter, compensationText: val })}
                  className="text-[14px] sm:text-[15px] text-slate-900 leading-[1.65] border border-transparent hover:border-purple-200 focus:border-purple-400 focus:bg-purple-50/20 rounded-md p-1.5 transition-all whitespace-pre-wrap"
                />
              </div>

              {/* Section 3: Benefits */}
              <div className="space-y-1">
                <AutoExpandingTextarea
                  value={letter.benefitsText}
                  onChange={(val) => setLetter({ ...letter, benefitsText: val })}
                  className="text-[14px] sm:text-[15px] text-slate-900 leading-[1.65] border border-transparent hover:border-purple-200 focus:border-purple-400 focus:bg-purple-50/20 rounded-md p-1.5 transition-all whitespace-pre-wrap"
                />
              </div>

              {/* Section 4: Confidentiality */}
              <div className="space-y-1 text-justify">
                <AutoExpandingTextarea
                  value={letter.confidentialityText}
                  onChange={(val) => setLetter({ ...letter, confidentialityText: val })}
                  className="text-[14px] sm:text-[15px] text-slate-900 leading-[1.65] border border-transparent hover:border-purple-200 focus:border-purple-400 focus:bg-purple-50/20 rounded-md p-1.5 transition-all text-justify whitespace-pre-wrap"
                />
              </div>

              {/* Section 5: Acceptance Deadline */}
              <div className="space-y-1 text-justify">
                <AutoExpandingTextarea
                  value={letter.acceptanceDeadlineText}
                  onChange={(val) => setLetter({ ...letter, acceptanceDeadlineText: val })}
                  className="text-[14px] sm:text-[15px] text-slate-900 leading-[1.65] border border-transparent hover:border-purple-200 focus:border-purple-400 focus:bg-purple-50/20 rounded-md p-1.5 transition-all text-justify whitespace-pre-wrap"
                />
              </div>

              {/* Closing */}
              <div className="text-sm sm:text-base font-bold text-blue-950 pt-1 font-sans">
                {letter.closing}
              </div>

              {/* Signatures 2 Columns */}
              <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-left font-sans">
                {/* Employer Signature */}
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase text-slate-600">
                    ĐẠI DIỆN CÔNG TY:
                  </div>
                  <input
                    type="text"
                    value={letter.employerSignOffName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLetter({ ...letter, employerSignOffName: val });
                      setRecruiterName(val);
                    }}
                    placeholder="Họ và tên người ký đại diện"
                    className="w-full text-sm sm:text-base font-bold text-slate-950 bg-transparent border-none outline-none focus:bg-purple-50/40 rounded px-0 text-left"
                  />
                  <input
                    type="text"
                    value={letter.employerSignOffTitle}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLetter({ ...letter, employerSignOffTitle: val });
                      setRecruiterTitle(val);
                    }}
                    placeholder="Chức danh (VD: Giám Đốc Nhân Sự)"
                    className="w-full text-xs text-slate-500 italic bg-transparent border-none outline-none focus:bg-purple-50/40 rounded px-0 text-left"
                  />
                </div>

                {/* Candidate Signature Block */}
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase text-slate-600">
                    XÁC NHẬN CỦA ỨNG VIÊN:
                  </div>
                  <div className="text-xs text-slate-500 pt-1 leading-relaxed">
                    Tôi đồng ý nhận việc theo các điều khoản nêu trên.
                  </div>
                  <div className="text-xs text-slate-400 pt-6">
                    Ký và ghi rõ họ tên: ...........................................
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
