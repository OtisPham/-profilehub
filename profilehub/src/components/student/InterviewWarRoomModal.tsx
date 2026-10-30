import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Building2, Briefcase, FileText, Calendar, 
  Clock, Video, MapPin, ChevronDown, ChevronUp, Check, Wand2, ShieldCheck 
} from 'lucide-react';
import { 
  selfInterviewService, 
  quickParseInterviewInvitation, 
  type CandidateInterviewSession,
  type InterviewStageType
} from '../../services/selfInterviewService';
import { cvService, type ManagedCVItem } from '../../services/cvService';

interface InterviewWarRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionCreated?: (session: CandidateInterviewSession) => void;
}

const POPULAR_COMPANIES = [
  'FPT Software',
  'VNG Corporation',
  'Shopee Vietnam',
  'MoMo Fintech',
  'Viettel Telecom',
  'Techcombank',
  'One Mount Group',
  'KMS Technology'
];

export default function InterviewWarRoomModal({
  isOpen,
  onClose,
  onSessionCreated
}: InterviewWarRoomModalProps) {
  const [activeTab, setActiveTab] = useState<'quick' | 'magic'>('quick');
  const [availableCvs, setAvailableCvs] = useState<ManagedCVItem[]>([]);

  // Form Fields
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [selectedCvId, setSelectedCvId] = useState('');
  const [interviewDate, setInterviewDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [interviewTime, setInterviewTime] = useState('09:30');
  const [stage, setStage] = useState<InterviewStageType>('technical');
  const [format, setFormat] = useState<'online' | 'offline'>('online');
  const [meetingLink, setMeetingLink] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');

  // Expandable details toggle
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Magic Paste
  const [rawEmailText, setRawEmailText] = useState('');
  const [parseSuccessMsg, setParseSuccessMsg] = useState(false);

  // Load CV list on open
  useEffect(() => {
    if (isOpen) {
      const cvs = cvService.getAllCVs();
      setAvailableCvs(cvs);
      if (cvs.length > 0 && !selectedCvId) {
        setSelectedCvId(cvs[0].id);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMagicParse = () => {
    if (!rawEmailText.trim()) return;
    const parsed = quickParseInterviewInvitation(rawEmailText);

    if (parsed.company_name) setCompanyName(parsed.company_name);
    if (parsed.role_title) setRoleTitle(parsed.role_title);
    if (parsed.stage) setStage(parsed.stage);
    if (parsed.interview_time) setInterviewTime(parsed.interview_time);
    if (parsed.meeting_link) {
      setMeetingLink(parsed.meeting_link);
      setFormat('online');
    }

    setParseSuccessMsg(true);
    setTimeout(() => {
      setParseSuccessMsg(false);
      setActiveTab('quick');
    }, 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleTitle.trim()) {
      alert('Vui lòng nhập Tên công ty và Vị trí ứng tuyển mục tiêu!');
      return;
    }

    const created = selfInterviewService.createSession({
      company_name: companyName,
      role_title: roleTitle,
      interview_date: interviewDate,
      interview_time: interviewTime,
      format,
      meeting_link: meetingLink,
      location_address: locationAddress,
      stage,
      linked_cv_id: selectedCvId || undefined,
      personal_notes: personalNotes
    });

    if (onSessionCreated) {
      onSessionCreated(created);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#0f1523] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  Thiết Lập Trạm Tác Chiến Phỏng Vấn (War Room)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 uppercase">
                  Targeted Prep
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Vạch sẵn đề thi thử AI & bộ câu hỏi bẫy đồ án sát sườn từng doanh nghiệp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 bg-slate-50 dark:bg-[#0c101c] border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'quick'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>⚡ Nhập Siêu Tốc (3 Thông Tin)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('magic')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'magic'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-500" />
            <span>🪄 Dán Email Mời HR (Tự Bóc Tách)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'magic' ? (
            /* TAB 2: MAGIC PASTE */
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <span className="font-bold flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Cơ chế Zero-Friction:
                </span>
                Sao chép nguyên văn email, thư mời hoặc tin nhắn LinkedIn/Zalo từ HR và dán vào dưới đây. Bộ bóc tách thông minh sẽ tự nhận diện Tên công ty, Vị trí tuyển dụng, Giờ hẹn và Link Google Meet!
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Nội dung thư mời phỏng vấn:
                </label>
                <textarea
                  rows={7}
                  value={rawEmailText}
                  onChange={e => setRawEmailText(e.target.value)}
                  placeholder="Ví dụ: 'Chào bạn Nam, Bộ phận Tuyển dụng FPT Software trân trọng mời bạn tham gia buổi Phỏng vấn Kỹ thuật cho vị trí Frontend React Developer vào lúc 09:30 AM ngày mai qua Google Meet: https://meet.google.com/xyz-abc...'"
                  className="w-full p-3.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111728] text-slate-900 dark:text-slate-100 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 font-sans"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleMagicParse}
                  disabled={!rawEmailText.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
                >
                  {parseSuccessMsg ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-950" />
                      <span>Đã Bóc Tách Thành Công!</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>⚡ Bóc Tách & Điền Tự Động Vào Form</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* TAB 1: 3-STEP QUICK FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Trường 1: Tên Công Ty */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  1. Tên Công Ty Mục Tiêu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="VD: FPT Software, VNG, Shopee, MoMo, Viettel..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111728] text-slate-900 dark:text-white rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                
                {/* Popular Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Gợi ý nhanh:</span>
                  {POPULAR_COMPANIES.map(comp => (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => setCompanyName(comp)}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border font-medium transition cursor-pointer ${
                        companyName === comp
                          ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {comp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trường 2: Vị trí ứng tuyển */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  2. Vị Trí / Chức Danh Ứng Tuyển <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={e => setRoleTitle(e.target.value)}
                  placeholder="VD: Frontend ReactJS Developer, Backend Node.js, Mobile Flutter..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111728] text-slate-900 dark:text-white rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Trường 3: Bản CV gắn liền */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    3. Bản CV Bạn Đã Nộp Cho Doanh Nghiệp Này
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                    (Giúp AI tạo câu hỏi bám sát đồ án thực tế)
                  </span>
                </label>
                
                {availableCvs.length > 0 ? (
                  <select
                    value={selectedCvId}
                    onChange={e => setSelectedCvId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161f36] text-slate-900 dark:text-slate-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {availableCvs.map(cv => (
                      <option 
                        key={cv.id} 
                        value={cv.id}
                        className="bg-white dark:bg-[#161f36] text-slate-900 dark:text-slate-100 py-1.5"
                      >
                        {cv.title || 'Bản CV Tiêu Chuẩn'} ({cv.targetRole || 'Chung'}) • Lưu lúc {new Date(cv.updatedAt).toLocaleDateString('vi-VN')}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                    Chưa có CV nào trong kho. Hệ thống sẽ dùng cấu hình hồ sơ mặc định để mô phỏng phỏng vấn.
                  </div>
                )}
              </div>

              {/* Advanced / Optional Accordion */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#111728] hover:bg-slate-200 dark:hover:bg-[#161f36] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Thời gian, link họp & ghi chú riêng tư (Tùy chọn)</span>
                  </span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                  <div className="mt-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Ngày phỏng vấn:
                        </label>
                        <input
                          type="date"
                          value={interviewDate}
                          onChange={e => setInterviewDate(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111728] rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Giờ phỏng vấn:
                        </label>
                        <input
                          type="time"
                          value={interviewTime}
                          onChange={e => setInterviewTime(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111728] rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Vòng phỏng vấn:
                        </label>
                        <select
                          value={stage}
                          onChange={e => setStage(e.target.value as InterviewStageType)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161f36] rounded-lg text-slate-900 dark:text-slate-100"
                        >
                          <option value="technical" className="bg-white dark:bg-[#161f36] text-slate-900 dark:text-slate-100 py-1.5">Vòng Kỹ thuật & Live Coding</option>
                          <option value="hr_screen" className="bg-white dark:bg-[#161f36] text-slate-900 dark:text-slate-100 py-1.5">Vòng HR & Văn hóa sơ bộ</option>
                          <option value="culture_final" className="bg-white dark:bg-[#161f36] text-slate-900 dark:text-slate-100 py-1.5">Vòng Phỏng vấn Giám đốc & Deal Offer</option>
                          <option value="other" className="bg-white dark:bg-[#161f36] text-slate-900 dark:text-slate-100 py-1.5">Vòng khác</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Hình thức:
                        </label>
                        <div className="flex items-center gap-2 pt-1">
                          <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                            <input
                              type="radio"
                              name="format"
                              checked={format === 'online'}
                              onChange={() => setFormat('online')}
                            />
                            <span>Online</span>
                          </label>
                          <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer ml-3">
                            <input
                              type="radio"
                              name="format"
                              checked={format === 'offline'}
                              onChange={() => setFormat('offline')}
                            />
                            <span>Offline</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {format === 'online' ? (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                          <Video className="w-3 h-3 text-indigo-500" />
                          Link phòng họp (Google Meet / Zoom):
                        </label>
                        <input
                          type="url"
                          value={meetingLink}
                          onChange={e => setMeetingLink(e.target.value)}
                          placeholder="https://meet.google.com/..."
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111728] rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-indigo-500" />
                          Địa chỉ văn phòng công ty:
                        </label>
                        <input
                          type="text"
                          value={locationAddress}
                          onChange={e => setLocationAddress(e.target.value)}
                          placeholder="Tòa nhà, số nhà, quận..."
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111728] rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Ghi chú riêng tư:
                      </label>
                      <input
                        type="text"
                        value={personalNotes}
                        onChange={e => setPersonalNotes(e.target.value)}
                        placeholder="VD: Cần đọc lại kiến trúc Microservices và mang theo laptop có demo..."
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111728] rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs sm:text-sm font-black rounded-xl shadow-md shadow-indigo-600/25 transition active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Kích Hoạt Trạm Tác Chiến & Bắt Đầu Ôn Bài</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
