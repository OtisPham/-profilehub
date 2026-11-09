import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Printer, 
  AlertCircle, 
  MessageSquare, 
  Share2, 
  Laptop, 
  ChevronRight,
  Send,
  HelpCircle
} from 'lucide-react';
import { offerLetterService } from '../../services/offerLetterService';
import { getSampleOfferParams } from '../../services/offerTemplateBank';
import { fireAcceptanceConfetti } from '../../utils/confettiEffect';
import type { OfferLetter } from '../../types/database';

export default function PublicOfferPortal() {
  const { token } = useParams<{ token: string }>();
  const [offer, setOffer] = useState<OfferLetter | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Sign-off State
  const [signatureName, setSignatureName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Negotiation Modal / State
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [negotiationText, setNegotiationText] = useState('');

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null);

  useEffect(() => {
    // Tải dữ liệu thư mời
    if (token) {
      let data = offerLetterService.getOfferByToken(token);
      
      // Fallback demo nếu người dùng xem token mẫu
      if (!data && (token === 'demo' || token.startsWith('off_sec_sample') || token === 'sample')) {
        const sampleParams = getSampleOfferParams('cand_demo', 'Nguyễn Văn An');
        data = offerLetterService.createOffer(sampleParams);
        data.token = token;
      }
      
      setOffer(data);
    }
    setLoading(false);
  }, [token]);

  // Tính đồng hồ đếm ngược
  useEffect(() => {
    if (!offer?.deadline_date) return;
    const calculateTime = () => {
      const target = new Date(offer.deadline_date);
      target.setHours(23, 59, 59, 999);
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft(null);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        setTimeLeft({ days, hours, minutes });
      }
    };
    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [offer?.deadline_date]);

  // Xử lý ký chấp thuận
  const handleAccept = () => {
    if (!offer) return;
    if (!signatureName.trim() || signatureName.trim().length < 2) {
      setErrorMessage('Vui lòng gõ đầy đủ họ và tên của bạn để xác nhận ký số.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = offerLetterService.acceptOffer(offer.token, signatureName);
    if (res.success && res.offer) {
      setOffer(res.offer);
      setActionSuccess('🎉 Chúc mừng bạn đã chính thức chấp thuận lời mời nhận việc! Chúng tôi rất hào hứng được đồng hành cùng bạn!');
      fireAcceptanceConfetti();
    } else {
      setErrorMessage(res.error || 'Có lỗi xảy ra khi xác nhận thư mời.');
    }
    setIsSubmitting(false);
  };

  // Xử lý gửi phản hồi thương lượng
  const handleSendNegotiation = () => {
    if (!offer) return;
    if (!negotiationText.trim()) return;

    setIsSubmitting(true);
    const res = offerLetterService.negotiateOffer(offer.token, negotiationText);
    if (res.success && res.offer) {
      setOffer(res.offer);
      setShowNegotiationModal(false);
      setActionSuccess('💬 Đã gửi đề xuất điều chỉnh đến Bộ Phận Tuyển Dụng. HR sẽ liên hệ lại với bạn sớm nhất!');
    } else {
      setErrorMessage(res.error || 'Có lỗi xảy ra.');
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Đang tải Thư Mời Nhận Việc...</p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold mb-2">Không Tìm Thấy Thư Mời</h2>
          <p className="text-sm text-slate-400 mb-6">
            Đường link bạn truy cập có thể đã hết hạn, bị thay đổi hoặc không tồn tại trong hệ thống tuyển dụng.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all"
          >
            Quay Về Trang Chủ ProfileHub
          </Link>
        </div>
      </div>
    );
  }

  const isAccepted = offer.status === 'accepted';
  const isExpired = offer.status === 'expired';
  const isNegotiating = offer.status === 'negotiating';

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20">
            P
          </div>
          <div>
            <span className="font-bold text-sm text-white tracking-tight flex items-center gap-2">
              ProfileHub <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full font-medium">Official Offer Portal</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> In / Tải PDF
          </button>
        </div>
      </header>

      {/* Hero Welcome Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[200px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Thư Mời Nhận Việc Chính Thức</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            Chào mừng <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">{offer.candidate_name}</span>!
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-6">
            <strong className="text-white font-semibold">{offer.company_name}</strong> trân trọng gửi đến bạn lời mời gia nhập đội ngũ với cương vị{' '}
            <span className="text-indigo-400 font-bold underline decoration-indigo-500/50 underline-offset-4">{offer.job_title}</span>.
          </p>

          {/* Company Badge & Verified Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="text-xs sm:text-sm font-semibold text-slate-200">{offer.company_name}</span>
            {offer.is_company_verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" /> Doanh Nghiệp Xác Thực
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Status Alerts */}
        {actionSuccess && (
          <div className="p-4 bg-emerald-950/70 border border-emerald-500/40 rounded-2xl flex items-start gap-3 text-emerald-200 text-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="font-medium">{actionSuccess}</p>
          </div>
        )}

        {isAccepted && !actionSuccess && (
          <div className="p-5 bg-gradient-to-r from-emerald-950/60 to-indigo-950/60 border border-emerald-500/40 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-emerald-300 text-sm sm:text-base">Bạn Đã Ký Chấp Thuận Lời Mời!</h4>
                <p className="text-xs text-slate-400">
                  Chữ ký điện tử: <strong className="text-slate-200">{offer.digital_signature}</strong> • Ngày ký:{' '}
                  {offer.signed_at ? new Date(offer.signed_at).toLocaleDateString('vi-VN') : 'Gần đây'}
                </p>
              </div>
            </div>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold border border-emerald-400/30">
              ĐÃ TUYỂN
            </span>
          </div>
        )}

        {isNegotiating && (
          <div className="p-4 bg-amber-950/60 border border-amber-500/40 rounded-2xl flex items-start gap-3 text-amber-200 text-sm">
            <MessageSquare className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Đang Trong Quá Trình Trao Đổi Thêm</p>
              <p className="text-xs text-amber-300/80 mt-1">Ghi chú của bạn: "{offer.negotiation_notes}"</p>
            </div>
          </div>
        )}

        {isExpired && (
          <div className="p-4 bg-rose-950/60 border border-rose-500/40 rounded-2xl flex items-start gap-3 text-rose-200 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Thư Mời Đã Quá Hạn Phản Hồi</p>
              <p className="text-xs text-rose-300/80 mt-1">Hạn chót là ngày {new Date(offer.deadline_date).toLocaleDateString('vi-VN')}. Vui lòng liên hệ lại HR nếu bạn vẫn quan tâm.</p>
            </div>
          </div>
        )}

        {/* Executive Letter Message from CEO/CTO */}
        {offer.custom_message && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 relative shadow-xl">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="text-base">✍️</span> Lời Nhắn Từ Ban Lãnh Đạo
            </div>
            <p className="text-slate-300 italic text-sm sm:text-base leading-relaxed">
              "{offer.custom_message}"
            </p>
          </div>
        )}

        {/* Compensation & Offer Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Main Salary Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> Thu Nhập Chính Thức
              </span>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-bold">
                {offer.currency} / Tháng
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              {Number(offer.salary_official).toLocaleString('vi-VN')}{' '}
              <span className="text-lg font-bold text-slate-400">{offer.currency}</span>
            </div>

            <p className="text-xs text-slate-400 mb-6">
              Mức lương cạnh tranh theo năng lực thực chiến, đánh giá xét tăng định kỳ 2 lần/năm.
            </p>

            {/* Sub-breakdown: Probation & Bonus */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800">
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Lương Thời Gian Thử Việc ({offer.probation_period_months} tháng)</span>
                <span className="text-base font-bold text-slate-200">
                  {Number(offer.salary_probation).toLocaleString('vi-VN')} {offer.currency}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">85% mức lương chính thức</span>
              </div>

              {Number(offer.sign_on_bonus) > 0 && (
                <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Thưởng Chào Đón (Sign-on Bonus)</span>
                  <span className="text-base font-bold text-amber-300">
                    +{Number(offer.sign_on_bonus).toLocaleString('vi-VN')} {offer.currency}
                  </span>
                  <span className="text-[10px] text-amber-400/80 block mt-0.5">Chi trả ngay trong kỳ lương đầu tiên</span>
                </div>
              )}
            </div>
          </div>

          {/* Time & Countdown Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" /> Hạn Phản Hồi Offer
              </span>

              {timeLeft && !isAccepted && !isExpired ? (
                <div className="text-center py-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 mb-4">
                  <div className="text-2xl font-black text-purple-400">
                    {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Còn lại để xác nhận</span>
                </div>
              ) : (
                <div className="text-xs text-slate-400 mb-4">
                  Hạn chót: <strong className="text-slate-200">{new Date(offer.deadline_date).toLocaleDateString('vi-VN')}</strong>
                </div>
              )}

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Ngày bắt đầu:</span>
                  <strong className="text-slate-200">{new Date(offer.start_date).toLocaleDateString('vi-VN')}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Hình thức:</span>
                  <strong className="text-slate-200 uppercase">{offer.workplace_type}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Địa điểm:</span>
                  <strong className="text-slate-200 truncate max-w-[140px]" title={offer.location}>{offer.location}</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
              Cần hỗ trợ? Liên hệ bộ phận tuyển dụng qua email ghi trong thư.
            </div>
          </div>
        </div>

        {/* Benefits & Perks Grid */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🎁 Quyền Lợi & Gói Đãi Ngộ Dành Riêng Cho Bạn</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Được thiết kế nhằm đảm bảo sự phát triển nghề nghiệp và sức khỏe toàn diện.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {offer.benefits.map((ben) => (
              <div 
                key={ben.id} 
                className="p-4.5 bg-slate-950/60 border border-slate-800 rounded-2xl hover:border-indigo-500/40 transition-colors text-left"
              >
                <div className="text-2xl mb-2.5">{ben.icon}</div>
                <h4 className="text-sm font-bold text-slate-100 mb-1">{ben.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{ben.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action / Acceptance Section */}
        {!isAccepted && !isExpired && (
          <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              Sẵn Sàng Gia Nhập Đội Ngũ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-6">
              Vui lòng nhập họ và tên của bạn bên dưới để xác nhận chữ ký điện tử và chấp thuận thư mời nhận việc.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs font-semibold max-w-md mx-auto">
                {errorMessage}
              </div>
            )}

            <div className="max-w-md mx-auto space-y-3">
              <input
                type="text"
                placeholder="Nhập họ và tên của bạn (VD: Nguyễn Văn An)"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-indigo-500/40 rounded-2xl text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500 text-center"
              />

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleAccept}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> 🎉 Đồng Ý Nhận Việc & Ký Tên
                </button>

                <button
                  type="button"
                  onClick={() => setShowNegotiationModal(true)}
                  className="w-full sm:w-auto px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-2xl transition-all cursor-pointer"
                >
                  💬 Đề Xuất Điều Chỉnh
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-4">
              Bằng việc bấm xác nhận, bạn đồng ý với các điều khoản nêu trên và sẵn sàng tham gia onboard đúng hạn.
            </p>
          </div>
        )}
      </main>

      {/* Negotiation Feedback Modal */}
      {showNegotiationModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-left shadow-2xl">
            <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" /> Đề Xuất Điều Chỉnh / Hỏi Thêm Thông Tin
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Nếu bạn muốn thay đổi ngày bắt đầu làm việc, điều chỉnh hình thức làm việc, hoặc có câu hỏi, hãy gửi cho chúng tôi:
            </p>

            <textarea
              rows={4}
              placeholder="VD: Em xin phép đề xuất lùi ngày bắt đầu làm việc sang 15/12 để kịp bàn giao đồ án ở trường..."
              value={negotiationText}
              onChange={(e) => setNegotiationText(e.target.value)}
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 text-xs sm:text-sm outline-none focus:border-indigo-500 resize-none mb-4"
            />

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowNegotiationModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isSubmitting || !negotiationText.trim()}
                onClick={handleSendNegotiation}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Gửi Phản Hồi Cho HR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
