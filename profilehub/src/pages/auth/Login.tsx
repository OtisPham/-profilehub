import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabase';
import AuthLayout from '../../components/layout/AuthLayout';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  X,
  User,
  Building2,
  Sparkles
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'github' | 'google' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'student' | 'recruiter'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Xác định điểm chuyển hướng đích sau đăng nhập
  const explicitReturnTo = (location.state as any)?.returnTo;
  const defaultDestination = activeTab === 'recruiter' ? '/recruiter/dashboard' : '/dashboard';
  const returnTo = explicitReturnTo || defaultDestination;

  // Tự động đẩy người dùng vào trang làm việc nếu đã đăng nhập sẵn
  useEffect(() => {
    if (user) {
      navigate(returnTo, { replace: true });
    }
  }, [user, navigate, returnTo]);

  const handleRoleTabChange = (role: 'student' | 'recruiter') => {
    setActiveTab(role);
    localStorage.setItem('profilehub_demo_role', role);
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      localStorage.setItem('profilehub_demo_role', activeTab);

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        if (authError.message.toLowerCase().includes('invalid login credentials')) {
          setError('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.');
        } else {
          setError(authError.message || 'Lỗi kết nối máy chủ xác thực.');
        }
      } else {
        navigate(returnTo, { replace: true });
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể kết nối đến hệ thống xác thực.');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setOauthLoading('github');
    setError(null);
    try {
      localStorage.setItem('profilehub_demo_role', activeTab);
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}${returnTo}`,
        },
      });
      if (oauthError) {
        setError(`Lỗi đăng nhập GitHub: ${oauthError.message}`);
      }
    } catch (err: any) {
      setError(err?.message || 'Lỗi kết nối GitHub OAuth.');
    } finally {
      setOauthLoading(null);
    }
  };

  const handleGoogleLogin = async () => {
    setOauthLoading('google');
    setError(null);
    try {
      localStorage.setItem('profilehub_demo_role', activeTab);
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${returnTo}`,
        },
      });
      if (oauthError) {
        setError(`Lỗi đăng nhập Google: ${oauthError.message}`);
      }
    } catch (err: any) {
      setError(err?.message || 'Lỗi kết nối Google OAuth.');
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <AuthLayout 
      heading="Khởi đầu sự nghiệp từ những sản phẩm thật của bạn."
      subheading="Tập hợp các đồ án thực tế, tự động may đo CV phù hợp theo từng công việc và tự tin bước vào mọi buổi phỏng vấn."
      pageType="login"
    >
      {/* Top Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Đăng nhập
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {activeTab === 'student' 
            ? 'Chào mừng bạn trở lại! Tiếp tục quản lý CV và đồ án của bạn.' 
            : 'Đăng nhập cổng Doanh nghiệp để quản lý tin tuyển dụng và tìm kiếm ứng viên.'}
        </p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="mb-4">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Vai trò của bạn:</div>
        <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => handleRoleTabChange('student')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'student'
                ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User size={14} />
            <span>Ứng Viên / Sinh Viên</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleTabChange('recruiter')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'recruiter'
                ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 size={14} />
            <span>Nhà Tuyển Dụng</span>
          </button>
        </div>
      </div>

      {/* 1-Click Fast Demo Testing */}
      <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-900/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
            <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
            <span>Trải Nghiệm Nhanh Bản Demo</span>
          </span>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
            1-Click Test
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              localStorage.setItem('profilehub_demo_role', 'student');
              localStorage.setItem('profilehub_demo_mode', 'true');
              window.location.href = '/dashboard';
            }}
            className="py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <User size={13} className="text-indigo-500" />
            <span>Demo Ứng Viên</span>
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.setItem('profilehub_demo_role', 'recruiter');
              localStorage.setItem('profilehub_demo_mode', 'true');
              window.location.href = '/recruiter/dashboard';
            }}
            className="py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Building2 size={13} className="text-white" />
            <span>Demo Tuyển Dụng</span>
          </button>
        </div>
      </div>

      {/* 1-Click OAuth Social Buttons */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <button
          type="button"
          onClick={handleGitHubLogin}
          disabled={loading || Boolean(oauthLoading)}
          className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 shadow-sm active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
        >
          {oauthLoading === 'github' ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          )}
          <span>GitHub</span>
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || Boolean(oauthLoading)}
          className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 shadow-sm active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
        >
          {oauthLoading === 'google' ? (
            <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg height="16" width="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          )}
          <span>Google</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <span className="relative px-3 bg-white dark:bg-[#070b14] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Hoặc dùng email
        </span>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start justify-between gap-2 text-xs text-red-700 dark:text-red-300">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setError(null)} 
            className="text-red-400 hover:text-red-600 dark:hover:text-red-200 p-0.5"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Email
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail size={16} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tenban@example.com"
              required
              className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Mật khẩu
            </label>
            <button
              type="button"
              onClick={() => setForgotPasswordNotice(!forgotPasswordNotice)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={16} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="block w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Notice Quên mật khẩu */}
        {forgotPasswordNotice && (
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
            💡 <strong>Hỗ trợ đăng nhập:</strong> Vui lòng sử dụng đăng nhập nhanh bằng Google hoặc GitHub để truy cập tài khoản ngay lập tức nếu quên mật khẩu.
          </div>
        )}

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
          />
          <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
            Ghi nhớ phiên đăng nhập
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang đăng nhập...</span>
            </>
          ) : (
            <>
              <span>Đăng nhập</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>

      {/* Register Link Box */}
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Chưa có tài khoản?{' '}
          <Link
            to="/register"
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline ml-1"
          >
            Đăng ký miễn phí
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
