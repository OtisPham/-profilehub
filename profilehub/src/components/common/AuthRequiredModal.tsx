import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  X, 
  LogIn, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  FolderKanban, 
  ArrowRight,
  UserPlus
} from 'lucide-react';

export interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  targetJobTitle?: string;
  companyName?: string;
  actionReason?: string;
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
  title = 'Đăng Nhập Để Nộp Hồ Sơ Ứng Tuyển',
  subtitle,
  targetJobTitle,
  companyName,
  actionReason = 'Để đồng bộ hồ sơ năng lực chuẩn ATS và bảo chứng đồ án thực chiến trực tiếp đến Nhà tuyển dụng, bạn cần có tài khoản ProfileHub.'
}: AuthRequiredModalProps) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate('/login', { state: { returnTo: location.pathname } });
  };

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 dark:bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        className="bg-white dark:bg-[#0f1523] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden my-auto animate-in zoom-in-95 duration-200 text-left transition-colors"
      >
        {/* Header với dải màu Indigo sang trọng */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center font-bold shadow-inner">
              <LogIn className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h3 id="auth-modal-title" className="font-extrabold text-base tracking-tight text-white">
                {title}
              </h3>
              <p className="text-[11px] text-indigo-200 font-medium">
                {subtitle || 'Xác thực danh tính ứng viên ProfileHub'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nội dung chi tiết */}
        <div className="p-6 space-y-4">
          
          {/* Hộp thông tin vị trí đang nhắm tới (nếu có) */}
          {targetJobTitle && (
            <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                Vị trí bạn đang chọn:
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {targetJobTitle}
              </h4>
              {companyName && (
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                  Doanh nghiệp: <span className="font-bold text-slate-800 dark:text-slate-200">{companyName}</span>
                </p>
              )}
            </div>
          )}

          {/* Lời giải thích lý do */}
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {actionReason}
          </p>

          {/* 3 Lợi ích khi đăng nhập */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#141b2d] border border-slate-100 dark:border-slate-800/80">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-[11px]">
                <span className="font-bold text-slate-800 dark:text-slate-200">Đồng bộ bản CV chuẩn ATS:</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">Tự động xuất bản hồ sơ Harvard 1-trang khớp chuẩn ngành.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#141b2d] border border-slate-100 dark:border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[11px]">
                <span className="font-bold text-slate-800 dark:text-slate-200">Bảo chứng đồ án GitHub:</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">Đính kèm link Live Demo và commit code thật, tăng tỷ lệ phản hồi.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#141b2d] border border-slate-100 dark:border-slate-800/80">
              <FolderKanban className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px]">
                <span className="font-bold text-slate-800 dark:text-slate-200">Theo dõi tiến độ Kanban:</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">Cập nhật kết quả phản hồi và lịch phỏng vấn ngay trên Dashboard.</span>
              </div>
            </div>
          </div>

          {/* Cụm nút hành động */}
          <div className="pt-3 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleLogin}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleRegister}
              className="w-full py-2.5 px-4 bg-white dark:bg-[#161f36] hover:bg-slate-50 dark:hover:bg-[#1f2b4a] text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <UserPlus className="w-4 h-4 text-slate-500" />
              <span>Chưa có tài khoản? Đăng Ký Miễn Phí</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-1 text-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
            >
              Để sau
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
