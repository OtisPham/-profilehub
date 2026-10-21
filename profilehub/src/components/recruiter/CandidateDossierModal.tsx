import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Folder,
  FolderOpen,
  FileText,
  FileDown,
  Printer,
  X,
  Sparkles,
  CheckCircle2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Layers,
  Columns,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Send,
  Star,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export interface DossierCandidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  major?: string;
  role?: string;
  university?: string;
  gpa?: string;
  skills?: string[];
  bio?: string;
  appliedDate?: string;
  stage?: string;
  matchScore?: number;
  verifiedProjectsCount?: number;
  coverLetterNotes?: string;
  coverLetterTone?: 'confident' | 'passionate' | 'polite' | 'concise';
  projects?: Array<{
    id: string;
    title: string;
    description?: string;
    demo_url?: string;
    github_url?: string;
    role?: string;
    is_verified?: boolean;
    score?: string;
  }>;
}

interface CandidateDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: DossierCandidate | null;
  onMoveStage?: (candidateId: string, stage: string) => void;
  onScheduleInterview?: (candidate: DossierCandidate) => void;
}

export default function CandidateDossierModal({
  isOpen,
  onClose,
  candidate,
  onMoveStage,
  onScheduleInterview
}: CandidateDossierModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cv' | 'cover_letter' | 'split'>('split');
  const [fontFamily, setFontFamily] = useState<'times' | 'arial'>('times');
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [hrNotes, setHrNotes] = useState('');

  if (!isOpen || !candidate) return null;

  // Inline fallback for candidate summary / cover letter
  const coverLetter = {
    salutation: 'Kính gửi Quý Nhà Tuyển Dụng,',
    opening: `Tôi viết thư này để bày tỏ sự quan tâm chân thành đến cơ hội việc làm tại Quý Công Ty.`,
    bodyParagraph1: `Với nền tảng kỹ năng: ${candidate.skills?.slice(0, 5).join(', ') || 'Công nghệ thông tin'} và các dự án thực tế đã hoàn thành, tôi tin rằng năng lực của mình đáp ứng tốt yêu cầu công việc.`,
    bodyParagraph2: `Các dự án thực chiến của tôi đã rèn luyện tinh thần trách nhiệm và khả năng giải quyết vấn đề hiệu quả.`,
    closing: `Tôi rất mong có cơ hội trao đổi trực tiếp hơn về năng lực đóng góp của mình.`,
  };

  const handleExportWord = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  const fontClass = fontFamily === 'times' ? 'font-["Times_New_Roman",Times,serif]' : 'font-sans';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/45 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto font-sans antialiased text-slate-900 animate-in fade-in duration-200">
      
      {/* Print Styles for clean A4 printing */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 20mm;
        }
        @media print {
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden;
          }
          #dossier-print-area, #dossier-print-area * {
            visibility: visible;
          }
          #dossier-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Main Dossier Folder Modal */}
      <div className="bg-[#f8fafc] border border-blue-200/90 rounded-3xl shadow-2xl w-full max-w-7xl max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Dossier Top Bar - Folder Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 flex-wrap gap-3">
          
          {/* Left: Folder Name & Candidate Info */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  📁 Cặp Hồ Sơ Ứng Tuyển
                </span>
                <h2 className="text-lg font-black text-blue-950">
                  {candidate.name}
                </h2>
                {candidate.verifiedProjectsCount !== undefined && candidate.verifiedProjectsCount > 0 && (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    {candidate.verifiedProjectsCount} Đồ Án Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {candidate.role || candidate.major} • {candidate.university || 'Đại học đối tác'} • Ngày nộp: {candidate.appliedDate || 'Gần đây'}
              </p>
            </div>
          </div>

          {/* Right: Actions & Close */}
          <div className="flex items-center gap-2 flex-wrap">
            {onScheduleInterview && (
              <button
                onClick={() => {
                  onClose();
                  onScheduleInterview(candidate);
                }}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/20 active:scale-95 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Mời Phỏng Vấn</span>
              </button>
            )}

            <button
              onClick={handleExportWord}
              disabled={isExportingWord}
              className="px-3.5 py-2 bg-[#185abd] hover:bg-[#104a9e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-800/20 active:scale-95 cursor-pointer disabled:opacity-50"
              title="Tải tệp Microsoft Word .docx thư giới thiệu"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Tải Word (.docx)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In A4</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Dossier Tabs Navigation (File 1: CV, File 2: Cover Letter, File 3: Split View) */}
        <div className="px-6 py-2.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">
              Tài liệu trong thư mục:
            </span>

            {/* Tab 1: CV */}
            <button
              onClick={() => setActiveTab('cv')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'cv'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. CV Năng Lực (ATS)</span>
            </button>

            {/* Tab 2: Cover Letter */}
            <button
              onClick={() => setActiveTab('cover_letter')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'cover_letter'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>2. Thư Giới Thiệu (Word A4)</span>
            </button>

            {/* Tab 3: Split View */}
            <button
              onClick={() => setActiveTab('split')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'split'
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
              title="Xem cả 2 tài liệu cạnh nhau để so sánh đối chiếu"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Xem Song Song 2 File</span>
            </button>
          </div>

          {/* Right: Quick Stage Changer */}
          {onMoveStage && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium text-[11px]">Trạng thái:</span>
              <select
                value={candidate.stage || 'discovered'}
                onChange={(e) => onMoveStage(candidate.id, e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 outline-none cursor-pointer focus:ring-1 focus:ring-blue-500"
              >
                <option value="discovered">Ứng viên mới</option>
                <option value="shortlisted">Đã chọn (Shortlist)</option>
                <option value="contacted">Đã liên hệ</option>
                <option value="interview">Phỏng vấn</option>
                <option value="hired">Tuyển dụng thành công</option>
              </select>
            </div>
          )}

        </div>

        {/* Dossier Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f1f5f9]">
          
          {/* SPLIT VIEW (2 COLUMNS) */}
          {activeTab === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="dossier-print-area">
              
              {/* LEFT: CV SHEET */}
              <div className="lg:col-span-6 flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>TÀI LIỆU 1: BẢN CV NĂNG LỰC</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    GPA: {candidate.gpa || '3.6'}
                  </span>
                </div>

                <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-md text-slate-800 space-y-5">
                  {/* Header */}
                  <div className="border-b border-slate-200 pb-4">
                    <h3 className="text-xl font-black text-blue-950 uppercase tracking-tight">
                      {candidate.name}
                    </h3>
                    <p className="text-xs font-bold text-blue-600 mt-0.5">
                      {candidate.role || candidate.major}
                    </p>
                    <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                      <div>📧 {candidate.email || 'candidate@profilehub.edu.vn'}</div>
                      <div>📞 {candidate.phone || '0901 234 567'} • 📍 {candidate.location || 'TP. Hồ Chí Minh'}</div>
                    </div>
                  </div>

                  {/* Summary / Bio */}
                  {candidate.bio && (
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Giới Thiệu Bản Thân
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed text-justify">
                        {candidate.bio}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {candidate.skills && candidate.skills.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Kỹ Năng Kỹ Thuật
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verified Projects */}
                  {candidate.projects && candidate.projects.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        Đồ Án Tiêu Biểu & Đã Xác Thực
                      </h4>
                      <div className="space-y-2">
                        {candidate.projects.map((proj) => (
                          <div
                            key={proj.id}
                            className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-blue-950">{proj.title}</span>
                              {proj.score && (
                                <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                                  {proj.score}
                                </span>
                              )}
                            </div>
                            {proj.description && (
                              <p className="text-[11px] text-slate-600 leading-snug line-clamp-3">
                                {proj.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 pt-1 text-[10px] text-blue-600 font-medium">
                              {proj.demo_url && (
                                <a href={proj.demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                                  <ExternalLink className="w-3 h-3" /> Demo
                                </a>
                              )}
                              {proj.github_url && (
                                <a href={proj.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                                  <ExternalLink className="w-3 h-3" /> GitHub
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Học Vấn & Chuyên Ngành
                    </h4>
                    <div className="text-xs text-slate-800 font-semibold">
                      {candidate.university || 'Đại Học Công Nghệ / Bách Khoa'}
                    </div>
                    <div className="text-xs text-slate-500">
                      Chuyên ngành: {candidate.major || 'Công Nghệ Thông Tin'}
                    </div>
                  </div>

                </div>
              </div>

              {/* RIGHT: COVER LETTER SHEET */}
              <div className="lg:col-span-6 flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                    <Mail className="w-4 h-4 text-amber-600" />
                    <span>TÀI LIỆU 2: THƯ GIỚI THIỆU (COVER LETTER)</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Chuẩn Word A4
                  </span>
                </div>

                <div
                  className={`bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-md text-slate-900 space-y-4 ${fontClass}`}
                >
                  {/* Candidate Header */}
                  <div className="border-b-2 border-blue-600 pb-3 flex items-start justify-between font-sans">
                    <div>
                      <h4 className="text-lg font-black text-blue-950 uppercase tracking-tight">
                        {candidate.name}
                      </h4>
                      <p className="text-xs font-bold text-blue-600">
                        {candidate.role || candidate.major}
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-slate-500 font-medium">
                      <div>{candidate.email}</div>
                      <div>{candidate.phone}</div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-slate-500 italic">
                    Ngày {new Date().toLocaleDateString('vi-VN')}
                  </div>

                  {/* Salutation */}
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    {coverLetter.salutation}
                  </div>

                  {/* Opening */}
                  <div className="text-xs sm:text-[13px] text-slate-800 leading-relaxed text-justify">
                    {coverLetter.opening}
                  </div>

                  {/* Body 1 */}
                  <div className="text-xs sm:text-[13px] text-slate-800 leading-relaxed text-justify">
                    {coverLetter.bodyParagraph1}
                  </div>

                  {/* Body 2 */}
                  <div className="text-xs sm:text-[13px] text-slate-800 leading-relaxed text-justify">
                    {coverLetter.bodyParagraph2}
                  </div>

                  {/* Closing */}
                  <div className="text-xs sm:text-[13px] text-slate-800 leading-relaxed text-justify">
                    {coverLetter.closing}
                  </div>

                  {/* Signoff */}
                  <div className="pt-2 text-left">
                    <div className="text-xs text-slate-700">Trân trọng cảm ơn,</div>
                    <div className="text-sm font-bold text-blue-950 mt-1 font-sans">
                      {candidate.name}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* SINGLE VIEW: CV ONLY */}
          {activeTab === 'cv' && (
            <div className="max-w-4xl mx-auto" id="dossier-print-area">
              <div className="bg-white border border-slate-300 rounded-3xl p-8 sm:p-12 shadow-lg text-slate-800 space-y-6">
                <div className="border-b-2 border-blue-600 pb-5 flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-blue-950 uppercase tracking-tight">
                      {candidate.name}
                    </h2>
                    <p className="text-sm font-bold text-blue-600 mt-1">
                      {candidate.role || candidate.major}
                    </p>
                  </div>
                  <div className="text-right text-xs sm:text-sm text-slate-600 space-y-1 font-medium">
                    <div>📧 {candidate.email || 'candidate@profilehub.edu.vn'}</div>
                    <div>📞 {candidate.phone || '0901 234 567'}</div>
                    <div>📍 {candidate.location || 'TP. Hồ Chí Minh'}</div>
                  </div>
                </div>

                {/* Summary */}
                {candidate.bio && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Tóm Tắt Năng Lực & Mục Tiêu
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed text-justify">
                      {candidate.bio}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Kỹ Năng Chuyên Môn
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verified Projects */}
                {candidate.projects && candidate.projects.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      Danh Sách Đồ Án Tiêu Biểu (Đã Xác Thực)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {candidate.projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-blue-950">{proj.title}</span>
                            {proj.score && (
                              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                                {proj.score}
                              </span>
                            )}
                          </div>
                          {proj.description && (
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {proj.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 pt-2 text-xs text-blue-600 font-bold">
                            {proj.demo_url && (
                              <a href={proj.demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                                <ExternalLink className="w-3.5 h-3.5" /> Xem Demo
                              </a>
                            )}
                            {proj.github_url && (
                              <a href={proj.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                                <ExternalLink className="w-3.5 h-3.5" /> Source Code
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Học Vấn & Thành Tích
                  </h3>
                  <div className="text-sm font-bold text-slate-900">
                    {candidate.university || 'Đại Học Công Nghệ'}
                  </div>
                  <div className="text-xs text-slate-600">
                    Ngành: {candidate.major || 'Kỹ Thuật Phần Mềm'} • Điểm GPA: {candidate.gpa || '3.6 / 4.0'}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SINGLE VIEW: COVER LETTER ONLY */}
          {activeTab === 'cover_letter' && (
            <div className="max-w-3xl mx-auto" id="dossier-print-area">
              <div
                className={`bg-white border border-slate-300 rounded-2xl p-8 sm:p-14 shadow-lg text-slate-900 space-y-6 ${fontClass}`}
                style={{ minHeight: '800px' }}
              >
                {/* Candidate Header */}
                <div className="border-b-2 border-blue-600 pb-5 flex items-start justify-between flex-wrap gap-4 font-sans">
                  <div>
                    <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tight">
                      {candidate.name}
                    </h2>
                    <p className="text-sm font-bold text-blue-600 mt-1">
                      {candidate.role || candidate.major}
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-600 space-y-1 font-medium font-sans">
                    <div>{candidate.email}</div>
                    {candidate.phone && <div>{candidate.phone}</div>}
                    {candidate.location && <div>{candidate.location}</div>}
                  </div>
                </div>

                {/* Date */}
                <div className="text-xs sm:text-sm text-slate-500 italic">
                  Ngày {new Date().toLocaleDateString('vi-VN')}
                </div>

                {/* Salutation */}
                <div className="text-sm sm:text-base font-bold text-slate-900">
                  {coverLetter.salutation}
                </div>

                {/* Opening */}
                <div className="text-sm sm:text-[15px] text-slate-800 leading-[1.65] text-justify">
                  {coverLetter.opening}
                </div>

                {/* Body 1 */}
                <div className="text-sm sm:text-[15px] text-slate-800 leading-[1.65] text-justify">
                  {coverLetter.bodyParagraph1}
                </div>

                {/* Body 2 */}
                <div className="text-sm sm:text-[15px] text-slate-800 leading-[1.65] text-justify">
                  {coverLetter.bodyParagraph2}
                </div>

                {/* Closing */}
                <div className="text-sm sm:text-[15px] text-slate-800 leading-[1.65] text-justify">
                  {coverLetter.closing}
                </div>

                {/* Signoff */}
                <div className="pt-4 text-left space-y-2 font-sans">
                  <div className="text-sm font-normal text-slate-800">Trân trọng cảm ơn,</div>
                  <div className="text-base font-bold text-slate-950 pt-1">
                    {candidate.name}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
