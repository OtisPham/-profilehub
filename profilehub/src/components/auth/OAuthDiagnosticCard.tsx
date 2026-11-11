import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, ShieldAlert, Sparkles, RefreshCw, KeyRound } from 'lucide-react';
import type { OAuthDiagnosticInfo } from '../../types/database';

interface OAuthDiagnosticCardProps {
  diagnostic: OAuthDiagnosticInfo;
  onRetry?: () => void;
}

export const OAuthDiagnosticCard: React.FC<OAuthDiagnosticCardProps> = ({
  diagnostic,
  onRetry,
}) => {
  const navigate = useNavigate();

  const handleActivateDemo = (role: 'student' | 'recruiter') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('profilehub_demo_mode', 'true');
      localStorage.setItem('profilehub_demo_role', role);
      // Phát sự kiện storage để AuthProvider cập nhật ngay lập tức
      window.dispatchEvent(new Event('storage'));
    }
    const destination = role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard';
    navigate(destination, { replace: true });
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-900/60 shadow-xl p-6 sm:p-8 text-left space-y-6">
      {/* Icon & Tiêu đề */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <ShieldAlert size={26} />
        </div>
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
            Cảnh Báo Xác Thực OAuth
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            Không thể hoàn tất đăng nhập bằng Google
          </h2>
        </div>
      </div>

      {/* Chi tiết lỗi */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-mono text-[11px] text-red-600 dark:text-red-400 font-semibold">
          <AlertTriangle size={14} className="shrink-0" />
          <span>Mã lỗi: {diagnostic.errorCode || 'OAUTH_CALLBACK_ERROR'}</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {diagnostic.errorDescription || 'Google hoặc Supabase đã từ chối quyền truy cập hoặc phiên làm việc đã hết hạn.'}
        </p>
      </div>

      {/* Gợi ý giải pháp cấu hình */}
      {diagnostic.solutionHint && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 space-y-1.5">
          <div className="font-bold flex items-center gap-1.5">
            <KeyRound size={14} className="text-blue-600 dark:text-blue-400" />
            <span>Hướng dẫn kỹ thuật dành cho Nhà phát triển / Quản trị viên:</span>
          </div>
          <p className="text-[12px] leading-relaxed text-blue-800 dark:text-blue-300">
            {diagnostic.solutionHint}
          </p>
        </div>
      )}

      {/* Hành động khắc phục ngay */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Chọn hành động để tiếp tục:
        </div>

        {/* Nút 1-Click Demo: Cứu cánh khi OAuth mạng ngoài bị chặn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleActivateDemo('student')}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            <Sparkles size={14} />
            <span>Vào vai Sinh Viên (Demo)</span>
          </button>

          <button
            type="button"
            onClick={() => handleActivateDemo('recruiter')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            <Sparkles size={14} />
            <span>Vào vai Tuyển Dụng (Demo)</span>
          </button>
        </div>

        {/* Nút quay lại đăng nhập thủ công */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="py-2 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Thử lại OAuth</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate('/login', { replace: true })}
            className="ml-auto py-2 px-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Đăng nhập bằng Email & Mật khẩu</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
