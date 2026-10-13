import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import type { UserRole } from '../../types/database';
import { 
  Menu, X, LogOut, Shield, Award, FileText, LayoutDashboard, UserCheck, 
  Briefcase, Trophy, FolderKanban, FolderOpen, Star, Kanban, Sparkles, 
  Building2, GraduationCap, Target, Brain, Layers, Send, FileSignature, 
  ChevronDown, ChevronRight, User
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const { user, userRole } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cvPaths = ['/cv-manager', '/cv-builder', '/cover-letter', '/portfolio-match'];
  const isCvSectionActive = cvPaths.some(path => location.pathname.includes(path));
  const [cvMenuOpen, setCvMenuOpen] = useState(true);

  // Tự động mở menu CV khi người dùng truy cập bất kỳ trang nào thuộc nhóm CV
  useEffect(() => {
    if (isCvSectionActive) {
      setCvMenuOpen(true);
    }
  }, [location.pathname, isCvSectionActive]);

  // Bảng màu theo role (SaaS Palette tinh chỉnh theo chuẩn Linear/Notion)
  const getRoleTheme = (role: UserRole) => {
    switch (role) {
      case 'teacher':
        return {
          activeBg: '#ecfdf5',
          activeText: '#065f46',
          activeIcon: '#059669',
          badgeBg: '#ecfdf5',
          badgeText: '#047857',
          badgeLabel: 'GIẢNG VIÊN',
          accent: '#10b981',
        };
      case 'recruiter':
        return {
          activeBg: '#f5f3ff',
          activeText: '#5b21b6',
          activeIcon: '#7c3aed',
          badgeBg: '#f5f3ff',
          badgeText: '#6d28d9',
          badgeLabel: 'NHÀ TUYỂN DỤNG',
          accent: '#8b5cf6',
        };
      default:
        return {
          activeBg: '#eff6ff',
          activeText: '#1e40af',
          activeIcon: '#2563eb',
          badgeBg: '#eff6ff',
          badgeText: '#1d4ed8',
          badgeLabel: 'ỨNG VIÊN',
          accent: '#3b82f6',
        };
    }
  };

  const theme = getRoleTheme(userRole);

  const getMenuStyles = (path: string) => {
    const isActive = location.pathname.includes(path);
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '7px 12px',
      margin: '2px 10px',
      borderRadius: '8px',
      backgroundColor: isActive ? theme.activeBg : 'transparent',
      color: isActive ? theme.activeText : '#475569',
      textDecoration: 'none',
      fontWeight: isActive ? '600' : '500',
      fontSize: '13px',
      transition: 'all 0.15s ease',
    };
  };

  const getSubMenuStyles = (path: string) => {
    const isActive = location.pathname.includes(path);
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
      padding: '6.5px 12px',
      margin: '1.5px 6px',
      borderRadius: '6px',
      backgroundColor: isActive ? theme.activeBg : 'transparent',
      color: isActive ? theme.activeText : '#64748b',
      textDecoration: 'none',
      fontWeight: isActive ? '600' : '500',
      fontSize: '12.5px',
      transition: 'all 0.15s ease',
    };
  };

  const navContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff' }}>
      {/* Brand Header */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
            }}>
              <Briefcase size={16} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontSize: '15.5px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                ProfileHub
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500' }}>
                Career Ecosystem
              </div>
            </div>
          </div>
          <span style={{
            fontSize: '9.5px',
            fontWeight: '700',
            backgroundColor: theme.badgeBg,
            color: theme.badgeText,
            padding: '3px 7px',
            borderRadius: '6px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            {theme.badgeLabel}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '8px 0', flex: 1, overflowY: 'auto' }}>
        {userRole === 'student' && (
          <>
            <div className="ph-section-title" style={{ padding: '8px 18px 4px 18px', fontSize: '10.5px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Portfolio
            </div>
            <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/dashboard')}>
              <LayoutDashboard size={16} color={location.pathname.includes('/dashboard') ? theme.activeIcon : '#64748b'} />
              <span>Dashboard</span>
            </Link>
            <Link to="/profile" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/profile')}>
              <UserCheck size={16} color={location.pathname.includes('/profile') ? theme.activeIcon : '#64748b'} />
              <span>Hồ Sơ Cá Nhân</span>
            </Link>
            <Link to="/projects" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/projects')}>
              <FolderKanban size={16} color={location.pathname.includes('/projects') ? theme.activeIcon : '#64748b'} />
              <span>Quản Lý Dự Án</span>
            </Link>
            <Link to="/certificates" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/certificates')}>
              <Award size={16} color={location.pathname.includes('/certificates') ? theme.activeIcon : '#64748b'} />
              <span>Chứng Chỉ & Bằng Cấp</span>
            </Link>
            <Link to="/achievements" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/achievements')}>
              <Trophy size={16} color={location.pathname.includes('/achievements') ? theme.activeIcon : '#64748b'} />
              <span>Thành Tích & Khen Thưởng</span>
            </Link>

            {/* Nhóm Quản Lý Hồ Sơ & CV - Collapsible Submenu tinh giản, bỏ tag 4 mục */}
            <div className="ph-section-title" style={{ padding: '14px 18px 4px 18px', fontSize: '10.5px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Hồ Sơ & CV
            </div>
            <div style={{ margin: '2px 0' }}>
              <button
                type="button"
                onClick={() => setCvMenuOpen(!cvMenuOpen)}
                className="ph-nav-link"
                style={{
                  width: 'calc(100% - 20px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  margin: '2px 10px',
                  borderRadius: '8px',
                  backgroundColor: isCvSectionActive && !cvMenuOpen ? theme.activeBg : 'transparent',
                  color: isCvSectionActive ? theme.activeText : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: isCvSectionActive ? '600' : '500',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Layers size={17} color={isCvSectionActive ? theme.activeIcon : '#6366f1'} />
                  <span>Quản Lý Hồ Sơ & CV</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
                  {cvMenuOpen ? (
                    <ChevronDown size={15} style={{ transition: 'transform 0.2s ease' }} />
                  ) : (
                    <ChevronRight size={15} style={{ transition: 'transform 0.2s ease' }} />
                  )}
                </div>
              </button>

              {/* Submenu xổ xuống với thanh ray dọc tinh tế */}
              {cvMenuOpen && (
                <div style={{
                  marginLeft: '26px',
                  marginRight: '10px',
                  paddingLeft: '4px',
                  borderLeft: '1.5px solid #e2e8f0',
                  marginTop: '2px',
                  marginBottom: '4px'
                }}>
                  <Link to="/cv-manager" onClick={() => setMobileOpen(false)} className="ph-subnav-link" style={getSubMenuStyles('/cv-manager')}>
                    <Layers size={14} color={location.pathname.includes('/cv-manager') ? theme.activeIcon : '#6366f1'} />
                    <span>Danh Sách & Quản Lý CV</span>
                  </Link>
                  <Link to="/cv-builder" onClick={() => setMobileOpen(false)} className="ph-subnav-link" style={getSubMenuStyles('/cv-builder')}>
                    <FileText size={14} color={location.pathname.includes('/cv-builder') ? theme.activeIcon : '#2563eb'} />
                    <span>AI CV Builder & Coach</span>
                  </Link>
                  <Link to="/cover-letter" onClick={() => setMobileOpen(false)} className="ph-subnav-link" style={getSubMenuStyles('/cover-letter')}>
                    <Send size={14} color={location.pathname.includes('/cover-letter') ? theme.activeIcon : '#0284c7'} />
                    <span>Thư Giới Thiệu (Cover Letter)</span>
                  </Link>
                  <Link to="/portfolio-match" onClick={() => setMobileOpen(false)} className="ph-subnav-link" style={getSubMenuStyles('/portfolio-match')}>
                    <Target size={14} color={location.pathname.includes('/portfolio-match') ? theme.activeIcon : '#10b981'} />
                    <span>Đánh Giá AI vs JD</span>
                  </Link>
                </div>
              )}
            </div>

            <div className="ph-section-title" style={{ padding: '14px 18px 4px 18px', fontSize: '10.5px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Định Hướng Nghề Nghiệp
            </div>
            <Link to="/mbti-test" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/mbti-test')}>
              <Brain size={17} color={location.pathname.includes('/mbti-test') ? theme.activeIcon : '#8b5cf6'} />
              <span>Trắc Nghiệm MBTI</span>
            </Link>
            <Link to="/student/jobs" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/student/jobs')}>
              <Briefcase size={17} color={location.pathname.includes('/student/jobs') ? theme.activeIcon : '#3b82f6'} />
              <span>Bài Đăng Tuyển Dụng</span>
            </Link>
            <Link to="/interview-prep" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/interview-prep')}>
              <Sparkles size={17} color={location.pathname.includes('/interview-prep') ? theme.activeIcon : '#f59e0b'} />
              <span>Luyện Phỏng Vấn AI</span>
            </Link>
          </>
        )}

        {userRole === 'recruiter' && (
          <>
            <div className="ph-section-title" style={{ padding: '8px 18px 4px 18px', fontSize: '10.5px', color: '#8b5cf6', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Portal Nhà Tuyển Dụng
            </div>
            <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/dashboard')}>
              <LayoutDashboard size={17} color={location.pathname.includes('/dashboard') ? theme.activeIcon : '#7c3aed'} />
              <span>Bảng Điều Khiển</span>
            </Link>
            <Link to="/recruiter/profile" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/recruiter/profile')}>
              <Building2 size={17} color={location.pathname.includes('/recruiter/profile') ? theme.activeIcon : '#7c3aed'} />
              <span>Hồ Sơ Doanh Nghiệp</span>
            </Link>
            <Link to="/recruiter/ai-assistant" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/recruiter/ai-assistant')}>
              <Sparkles size={17} color={location.pathname.includes('/recruiter/ai-assistant') ? theme.activeIcon : '#7c3aed'} />
              <span>AI Tuyển Dụng (AI Match)</span>
            </Link>
            <Link to="/recruiter/dossiers" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/recruiter/dossiers')}>
              <FolderOpen size={17} color={location.pathname.includes('/recruiter/dossiers') ? theme.activeIcon : '#f59e0b'} />
              <span>Cặp Hồ Sơ Ứng Tuyển</span>
            </Link>
            <Link to="/recruiter/offer-letter" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/recruiter/offer-letter')}>
              <FileSignature size={17} color={location.pathname.includes('/recruiter/offer-letter') ? theme.activeIcon : '#7c3aed'} />
              <span>Thư Mời Nhận Việc</span>
            </Link>
            <Link to="/recruiter/search" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/recruiter/search')}>
              <Briefcase size={17} color={location.pathname.includes('/recruiter/search') ? theme.activeIcon : '#7c3aed'} />
              <span>Tìm Ứng Viên (Verified)</span>
            </Link>
            <Link to="/recruiter/pipeline" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/recruiter/pipeline')}>
              <Kanban size={17} color={location.pathname.includes('/recruiter/pipeline') ? theme.activeIcon : '#7c3aed'} />
              <span>Luồng Tuyển Dụng</span>
            </Link>
            <Link to="/recruiter/saved" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/recruiter/saved')}>
              <Star size={17} color={location.pathname.includes('/recruiter/saved') ? theme.activeIcon : '#f59e0b'} />
              <span>Ứng Viên Đã Lưu</span>
            </Link>
            <Link to="/recruiter/jobs" onClick={() => setMobileOpen(false)} className="ph-nav-link" style={getMenuStyles('/recruiter/jobs')}>
              <Briefcase size={17} color={location.pathname.includes('/recruiter/jobs') ? theme.activeIcon : '#7c3aed'} />
              <span>Quản Lý Bài Đăng</span>
            </Link>
          </>
        )}
      </nav>

      {/* Footer Account & Logout */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid #f1f5f9', backgroundColor: '#fcfcfd' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 8px',
          borderRadius: '6px',
          marginBottom: '8px',
          backgroundColor: '#f8fafc',
        }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            fontSize: '11px',
            fontWeight: '600',
            flexShrink: 0
          }}>
            {user?.email ? user.email.charAt(0).toUpperCase() : <User size={13} />}
          </div>
          <div style={{ fontSize: '12px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>
            {user?.email || 'user@profilehub.vn'}
          </div>
        </div>
        <button
          onClick={() => window.location.href = '/logout'}
          className="ph-logout-btn"
          style={{
            width: '100%',
            padding: '7px 10px',
            backgroundColor: '#fff1f2',
            color: '#e11d48',
            border: '1px solid #ffe4e6',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <LogOut size={13} /> Đăng xuất
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE BAR (Hiển thị trên Màn hình < 1024px) */}
      <div className="mobile-top-bar" style={{
        display: 'none',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: 'white',
        borderBottom: '1px solid #f1f5f9',
        padding: '12px 20px',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}>
        <div style={{ fontSize: '16.5px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}>
            <Briefcase size={14} strokeWidth={2.2} />
          </div>
          <span>ProfileHub</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', backgroundColor: theme.badgeBg, color: theme.badgeText, padding: '3px 8px', borderRadius: '6px' }}>
            {theme.badgeLabel}
          </span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0f172a', padding: '4px' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 999,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '260px',
              height: '100%',
              backgroundColor: 'white',
              boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
            }}
          >
            {navContent}
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR (Cố định ở Màn hình >= 1024px) */}
      <aside className="desktop-sidebar" style={{ width: '252px', backgroundColor: '#ffffff', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100vh', position: 'sticky', top: 0, overflowY: 'auto' }}>
        {navContent}
      </aside>

      {/* Responsive & Hover Interactive CSS */}
      <style>{`
        @media (max-width: 1023px) {
          .desktop-sidebar { display: none !important; }
          .mobile-top-bar { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .desktop-sidebar { display: flex !important; }
          .mobile-top-bar { display: none !important; }
        }
        .ph-nav-link:hover {
          background-color: #f8fafc !important;
          color: #0f172a !important;
        }
        .ph-subnav-link:hover {
          background-color: #f1f5f9 !important;
          color: #0f172a !important;
        }
        .ph-logout-btn:hover {
          background-color: #ffe4e6 !important;
        }
      `}</style>
    </>
  );
}