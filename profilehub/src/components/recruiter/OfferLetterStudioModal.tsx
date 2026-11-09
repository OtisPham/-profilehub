import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Check, 
  Building2, 
  ShieldCheck, 
  DollarSign, 
  Calendar, 
  Clock, 
  Laptop, 
  MapPin, 
  ExternalLink,
  Copy,
  Printer
} from 'lucide-react';
import { offerLetterService } from '../../services/offerLetterService';
import { DEFAULT_OFFER_BENEFITS, getSampleOfferParams } from '../../services/offerTemplateBank';
import type { CandidatePipelineItem, OfferLetter, OfferBenefitItem } from '../../types/database';

interface OfferLetterStudioModalProps {
  candidate: CandidatePipelineItem | null;
  onClose: () => void;
  onOfferIssued?: (offer: OfferLetter) => void;
}

export default function OfferLetterStudioModal({
  candidate,
  onClose,
  onOfferIssued
}: OfferLetterStudioModalProps) {
  if (!candidate) return null;

  // Lấy dữ liệu mặc định từ template hoặc candidate
  const candidateName = candidate.student?.full_name || 'Ứng viên tiềm năng';
  const candidateEmail = (candidate.student as any)?.email || '';
  const initialJobTitle = candidate.job?.title || 'Lập Trình Viên';
  const initialCompany = candidate.job?.company_name || 'Công Ty Công Nghệ';

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 7);

  // Form States
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [department, setDepartment] = useState('Phát Triển Sản Phẩm (Engineering)');
  const [level, setLevel] = useState('junior');
  const [workplaceType, setWorkplaceType] = useState('hybrid');
  const [location, setLocation] = useState('Tầng 12, Tòa nhà Innovation, TP. Hồ Chí Minh');
  const [salaryOfficial, setSalaryOfficial] = useState('16000000');
  const [salaryProbation, setSalaryProbation] = useState('13600000');
  const [signOnBonus, setSignOnBonus] = useState('0');
  const [startDate, setStartDate] = useState(nextMonth.toISOString().split('T')[0]);
  const [deadlineDate, setDeadlineDate] = useState(deadline.toISOString().split('T')[0]);
  const [customMessage, setCustomMessage] = useState(
    'Ban Lãnh Đạo và Hội đồng phỏng vấn rất ấn tượng với năng lực thực chiến và đồ án bảo chứng của bạn. Chào mừng bạn gia nhập đội ngũ!'
  );
  const [selectedBenefits, setSelectedBenefits] = useState<OfferBenefitItem[]>(DEFAULT_OFFER_BENEFITS);

  // Generated Link state
  const [issuedOffer, setIssuedOffer] = useState<OfferLetter | null>(() => {
    return offerLetterService.getOfferByCandidateId(candidate.id || candidate.student_id);
  });
  const [copyFeedback, setCopyFeedback] = useState(false);

  const toggleBenefit = (item: OfferBenefitItem) => {
    if (selectedBenefits.some(b => b.id === item.id)) {
      setSelectedBenefits(selectedBenefits.filter(b => b.id !== item.id));
    } else {
      setSelectedBenefits([...selectedBenefits, item]);
    }
  };

  const handleIssueOffer = () => {
    const offer = offerLetterService.createOffer({
      candidateId: candidate.id || candidate.student_id,
      candidateName,
      candidateEmail,
      recruiterId: candidate.recruiter_id,
      companyName: initialCompany,
      isCompanyVerified: true,
      jobTitle,
      department,
      level,
      workplaceType,
      location,
      salaryOfficial: Number(salaryOfficial) || 15000000,
      salaryProbation: Number(salaryProbation) || Math.round((Number(salaryOfficial) || 15000000) * 0.85),
      probationPeriodMonths: 2,
      signOnBonus: Number(signOnBonus) || 0,
      currency: 'VND',
      startDate,
      deadlineDate,
      benefits: selectedBenefits,
      customMessage
    });

    setIssuedOffer(offer);
    if (onOfferIssued) onOfferIssued(offer);
  };

  const offerUrl = issuedOffer 
    ? `${window.location.origin}/offer/${issuedOffer.token}`
    : '';

  const handleCopyLink = () => {
    if (!offerUrl) return;
    navigator.clipboard.writeText(offerUrl);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/50 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden my-auto animate-in zoom-in-95 duration-150 text-left">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-blue-950 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                <span>Studio Soạn Thư Mời Nhận Việc (Offer Letter)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                  Official Studio
                </span>
              </h3>
              <p className="text-[11px] text-blue-200">
                Gửi lời mời trực tuyến tương tác & tự động đồng bộ trạng thái tuyển dụng khi ứng viên ký nhận
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          
          {/* Target Candidate Summary Banner */}
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-indigo-700 uppercase">Ứng viên nhận thư mời:</span>
              <h4 className="font-bold text-slate-800 text-base">{candidateName}</h4>
              <p className="text-xs text-slate-500">Mã định danh: {candidate.id || candidate.student_id}</p>
            </div>
            <div className="text-right">
              <span className="text-xs bg-indigo-600 text-white font-semibold px-3 py-1 rounded-xl">
                {initialCompany}
              </span>
            </div>
          </div>

          {/* Offer Issued Success Banner */}
          {issuedOffer && (
            <div className="p-4.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  ĐÃ PHÁT HÀNH LINK THƯ MỜI CÔNG KHAI!
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full uppercase">
                  {issuedOffer.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={offerUrl}
                  className="w-full text-xs bg-white border border-emerald-200 px-3 py-2 rounded-xl text-slate-700 font-mono select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                >
                  {copyFeedback ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copyFeedback ? 'Đã Sao Chép!' : 'Copy Link'}
                </button>
                <a
                  href={offerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                  title="Mở xem trước trong tab mới"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Form Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chức Danh Công Việc:</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phòng Ban / Khối:</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lương Chính Thức (VND / Tháng):</label>
              <input
                type="number"
                value={salaryOfficial}
                onChange={(e) => {
                  setSalaryOfficial(e.target.value);
                  setSalaryProbation(String(Math.round(Number(e.target.value) * 0.85)));
                }}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 font-bold text-indigo-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lương Thử Việc (85%):</label>
              <input
                type="number"
                value={salaryProbation}
                onChange={(e) => setSalaryProbation(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 font-medium text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ngày Bắt Đầu Làm Việc (Start Date):</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hạn Phản Hồi Thư Mời (Deadline):</label>
              <input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Địa Điểm Làm Việc & Hình Thức:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Lời Nhắn Cá Nhân Từ Ban Lãnh Đạo (Personalized Message):</label>
              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 font-medium resize-none"
              />
            </div>
          </div>

          {/* Benefits Selection List */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Gói Phúc Lợi Đính Kèm ({selectedBenefits.length} mục đã chọn):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEFAULT_OFFER_BENEFITS.map((ben) => {
                const isSelected = selectedBenefits.some(b => b.id === ben.id);
                return (
                  <button
                    key={ben.id}
                    type="button"
                    onClick={() => toggleBenefit(ben)}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 ring-1 ring-indigo-400' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 opacity-60'
                    }`}
                  >
                    <span className="text-lg">{ben.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold">{ben.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{ben.description}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleIssueOffer}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" /> {issuedOffer ? '🔄 Cập Nhật & Tạo Lại Thư Mời' : '🚀 Phát Hành Thư Mời & Tạo Link Công Khai'}
          </button>
        </div>

      </div>
    </div>
  );
}
