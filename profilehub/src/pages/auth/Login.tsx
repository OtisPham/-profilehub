import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabase';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('student'); // student, business
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const returnTo = (location.state as any)?.returnTo || '/dashboard';

  // Đẩy user vào trang đích hoặc dashboard nếu đã đăng nhập
  useEffect(() => {
    if (user) {
      navigate(returnTo, { replace: true });
    }
  }, [user, navigate, returnTo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email hoặc mật khẩu không chính xác.");
    } else {
      navigate(returnTo, { replace: true });
    }
    setLoading(false);
  };

  const handleGitHubLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}${returnTo}`,
        },
      });
      if (error) {
        setError(`Đăng nhập GitHub: ${error.message}`);
      }
    } catch (err: any) {
      setError(err?.message || 'Lỗi kết nối GitHub OAuth');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${returnTo}`,
        },
      });
      if (error) {
        setError(`Đăng nhập Google: ${error.message}`);
      }
    } catch (err: any) {
      setError(err?.message || 'Lỗi kết nối Google OAuth');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif', margin: '-8px' }}>
      
      {/* ================= CỘT TRÁI (DARK BLUE PANEL - DEVELOPER RESUME FOCUS) ================= */}
      <div style={{ 
        flex: 1, 
        backgroundColor: '#0b192c', 
        color: 'white', 
        padding: '40px 60px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between' 
      }}>
        
        {/* Logo */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '42px', height: '42px', backgroundColor: '#2563eb', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>⚡</div>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>ProfileHub</h2>
              <p style={{ margin: 0, fontSize: '10px', color: '#60a5fa', letterSpacing: '1px', fontWeight: 'bold' }}>DATA-DRIVEN DEVELOPER RESUME</p>
            </div>
          </div>
        </div>

        {/* Nội dung chính cột trái */}
        <div style={{ maxWidth: '480px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(37, 99, 235, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', padding: '6px 14px', borderRadius: '20px', marginBottom: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            <span style={{ fontSize: '12px', color: '#93c5fd', fontWeight: '600' }}>AI + GitHub Evidence Engine</span>
          </div>

          <h1 style={{ fontSize: '38px', fontWeight: 'bold', lineHeight: '1.25', marginBottom: '16px' }}>
            Code-Backed CV <br />for <span style={{ color: '#60a5fa' }}>Developers.</span>
          </h1>
          <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '35px' }}>
            Biến mã nguồn GitHub và sản phẩm thực tế thành bản CV chuẩn ATS trong 2 phút. Bằng chứng code thật, tự động đối soát với JD tuyển dụng.
          </p>

          {/* Mockup Card Dự án GitHub (Thay thế thẻ phòng thủ đồ án) */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '22px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>📦</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc' }}>shop-ecommerce-app</span>
              </div>
              <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                ● 24 Commits by Author
              </span>
            </div>

            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>TỰ ĐỘNG BÓC TÁCH TECH-STACK</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>React 18</span>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>TypeScript</span>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#a7f3d0' }}>Prisma ORM</span>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fde68a' }}>JWT Auth</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <span style={{ color: '#94a3b8' }}>🎯 Khớp 85% với JD Tuyển Dụng</span>
              <span style={{ color: '#38bdf8', fontWeight: '600' }}>Tự động sinh Bullet Points →</span>
            </div>
          </div>
        </div>

        {/* Footer cột trái */}
        <div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>Hệ sinh thái CV chuẩn cho kỹ sư phần mềm:</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '4px', fontSize: '11px' }}>⚡ Quét GitHub 5s</span>
            <span style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '4px', fontSize: '11px' }}>🎯 Đối soát JD bằng AI</span>
            <span style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '4px', fontSize: '11px' }}>📄 Xuất PDF Chuẩn ATS</span>
          </div>
        </div>

      </div>

      {/* ================= CỘT PHẢI (WHITE PANEL - LOGIN FORM) ================= */}
      <div style={{ flex: 1, backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '450px' }}>
          
          <div style={{ marginBottom: '24px' }}>
            <h5 style={{ margin: 0, color: '#2563eb', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>PROFILEHUB • DEVELOPER RESUME PLATFORM</h5>
            <h2 style={{ margin: '8px 0', fontSize: '28px', color: '#0f172a' }}>Đăng nhập</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Đăng nhập để lưu trữ hồ sơ và tạo CV tối ưu theo JD tuyển dụng.</p>
          </div>

          {/* Login-First Trust Banner - Bảo vệ dữ liệu vĩnh viễn (updateui.md Section 1.1) */}
          <div style={{ 
            backgroundColor: '#eff6ff', 
            border: '1px solid #bfdbfe', 
            borderRadius: '10px', 
            padding: '12px 16px', 
            marginBottom: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px' 
          }}>
            <span style={{ fontSize: '22px' }}>🛡️</span>
            <div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#1e40af' }}>Cam kết bảo vệ dữ liệu vĩnh viễn</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#3b82f6', lineHeight: '1.4' }}>Mọi CV và đồ án của bạn được lưu trữ an toàn trên đám mây Supabase. Đổi thiết bị không sợ mất bài.</p>
            </div>
          </div>

          <p style={{ fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Đăng nhập với tư cách:</p>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', padding: '4px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
            <button onClick={() => setActiveTab('student')} style={{ flex: 1, padding: '9px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: activeTab === 'student' ? '#1e3a8a' : 'transparent', color: activeTab === 'student' ? 'white' : '#64748b' }}>
              👤 Lập trình viên / Ứng viên
            </button>
            <button onClick={() => setActiveTab('business')} style={{ flex: 1, padding: '9px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: activeTab === 'business' ? '#1e3a8a' : 'transparent', color: activeTab === 'business' ? 'white' : '#64748b' }}>
              🏢 Nhà tuyển dụng
            </button>
          </div>

          {/* Cụm Nút Đăng Nhập 1-Click (GitHub & Google) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
            <button 
              type="button"
              onClick={handleGitHubLogin}
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '11px', 
                backgroundColor: '#0f172a', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px', 
                fontSize: '13.5px', 
                fontWeight: '600', 
                cursor: 'pointer', 
                transition: 'opacity 0.2s'
              }}
            >
              <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span>Tiếp tục với GitHub (Đăng nhập 2s)</span>
            </button>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '11px', 
                backgroundColor: '#ffffff', 
                color: '#1e293b', 
                border: '1px solid #cbd5e1', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px', 
                fontSize: '13.5px', 
                fontWeight: '600', 
                cursor: 'pointer', 
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <svg height="18" width="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Tiếp tục với Google</span>
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
            <span style={{ padding: '0 12px', fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>HOẶC DÙNG EMAIL TRUYỀN THỐNG</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 15px 0', padding: '10px', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{error}</p>}
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>Email đăng nhập</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com" 
                required
                style={{ width: '100%', padding: '11px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }} 
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  minLength={6} 
                  style={{ width: '100%', padding: '11px 45px 11px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none' }} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '0' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <input type="checkbox" id="remember" style={{ cursor: 'pointer' }} />
              <label htmlFor="remember" style={{ fontSize: '13px', color: '#475569', cursor: 'pointer' }}>Ghi nhớ phiên đăng nhập</label>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập vào hệ thống →'}
            </button>
          </form>

          <div style={{ marginTop: '20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', display: 'flex', gap: '10px' }}>
            <span style={{ color: '#3b82f6' }}>ℹ️</span>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Chưa có tài khoản? 
                <Link to="/register" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none', marginLeft: '5px' }}>Đăng ký miễn phí</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
