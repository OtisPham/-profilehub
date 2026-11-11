import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { parseOAuthErrorFromUrl, provisionOAuthUserProfile } from '../../services/oauthProvisioningService';
import { OAuthDiagnosticCard } from '../../components/auth/OAuthDiagnosticCard';
import type { OAuthDiagnosticInfo, UserRole } from '../../types/database';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  const [diagnostic, setDiagnostic] = useState<OAuthDiagnosticInfo | null>(null);
  const [syncStatus, setSyncStatus] = useState<'analyzing' | 'provisioning' | 'redirecting'>('analyzing');
  const [syncedUserTitle, setSyncedUserTitle] = useState<string>('');

  useEffect(() => {
    // 1. Phân tích ngay các tham số lỗi từ search và hash
    const diag = parseOAuthErrorFromUrl(location.search, location.hash);
    if (diag.isError) {
      setDiagnostic(diag);
      return;
    }

    let isMounted = true;

    // 2. Lắng nghe và hoàn tất phiên xác thực với Supabase
    const processSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          if (isMounted) {
            setDiagnostic({
              isError: true,
              errorCode: sessionError.message,
              errorDescription: 'Không thể thiết lập phiên đăng nhập từ mã xác thực Google.',
              canFallbackToDemo: true,
            });
          }
          return;
        }

        if (session?.user) {
          if (isMounted) {
            setSyncStatus('provisioning');
            setSyncedUserTitle(session.user.user_metadata?.full_name || session.user.email || '');
          }

          // Lấy vai trò ưa thích từ LocalStorage
          const savedRole = (localStorage.getItem('profilehub_demo_role') as UserRole) || 'student';

          // Tự động cấp phát dữ liệu vào public.users và public.student_profiles
          const provisionResult = await provisionOAuthUserProfile(session.user, savedRole);

          if (isMounted) {
            setSyncStatus('redirecting');
            setTimeout(() => {
              navigate(provisionResult.destinationUrl, { replace: true });
            }, 600);
          }
          return;
        }

        // Lắng nghe sự kiện auth state change một lần nếu getSession chưa kịp bắt
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (newSession?.user && isMounted) {
            subscription.unsubscribe();
            setSyncStatus('provisioning');
            setSyncedUserTitle(newSession.user.user_metadata?.full_name || newSession.user.email || '');

            const savedRole = (localStorage.getItem('profilehub_demo_role') as UserRole) || 'student';
            const provisionResult = await provisionOAuthUserProfile(newSession.user, savedRole);

            setSyncStatus('redirecting');
            setTimeout(() => {
              navigate(provisionResult.destinationUrl, { replace: true });
            }, 600);
          }
        });

        // Timeout an toàn sau 8 giây nếu không nhận được token
        const timer = setTimeout(() => {
          if (isMounted && syncStatus === 'analyzing') {
            subscription.unsubscribe();
            setDiagnostic({
              isError: true,
              errorCode: 'session_timeout',
              errorDescription: 'Quá thời gian chờ phản hồi từ nhà cung cấp OAuth. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại.',
              solutionHint: 'Đảm bảo Redirect URL trong Supabase Dashboard bao gồm http://localhost:5173/auth/callback hoặc domain hiện tại.',
              canFallbackToDemo: true,
            });
          }
        }, 8000);

        return () => {
          clearTimeout(timer);
          subscription.unsubscribe();
        };
      } catch (err: any) {
        if (isMounted) {
          setDiagnostic({
            isError: true,
            errorCode: 'callback_exception',
            errorDescription: err?.message || 'Lỗi không xác định trong quá trình xử lý callback.',
            canFallbackToDemo: true,
          });
        }
      }
    };

    processSession();

    return () => {
      isMounted = false;
    };
  }, [location, navigate, syncStatus]);

  // Nếu có lỗi chẩn đoán: hiển thị Card chẩn đoán lỗi
  if (diagnostic?.isError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex items-center justify-center p-4">
        <OAuthDiagnosticCard diagnostic={diagnostic} onRetry={() => navigate('/login')} />
      </div>
    );
  }

  // Màn hình chờ đồng bộ thông tin tài khoản
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
          {syncStatus === 'redirecting' ? (
            <CheckCircle2 size={32} className="text-white animate-bounce" />
          ) : (
            <Loader2 size={32} className="animate-spin text-white" />
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {syncStatus === 'redirecting'
              ? 'Xác thực thành công!'
              : syncStatus === 'provisioning'
              ? 'Đang khởi tạo hồ sơ ProfileHub...'
              : 'Đang kết nối tài khoản Google...'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            {syncedUserTitle 
              ? `Chào mừng ${syncedUserTitle}, hệ thống đang đưa bạn vào không gian làm việc.` 
              : 'Đang trao đổi khóa bảo mật và thiết lập quyền truy cập cho bạn.'}
          </p>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-500" 
            style={{ 
              width: syncStatus === 'redirecting' ? '100%' : syncStatus === 'provisioning' ? '70%' : '35%' 
            }} 
          />
        </div>
      </div>
    </div>
  );
}
