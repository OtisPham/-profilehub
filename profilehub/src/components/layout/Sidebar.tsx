import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import type { UserRole } from '../../types/database';
import { 
  Menu, X, LogOut, FileText, LayoutDashboard, UserCheck, 
  Briefcase, Star, Kanban, Sparkles, FolderKanban,
  Building2, Layers, ChevronDown, ChevronRight, User, LayoutTemplate,
  PanelLeftClose, PanelLeftOpen, ShieldAlert
} from 'lucide-react';
import CreateCvFlowModal from '../cv/CreateCvFlowModal';
import type { ProjectItem } from '../../types/cvSection';
import { cvService } from '../../services/cvService';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Trạng thái thu gọn Sidebar (Collapsible) được lưu vào localStorage
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('profilehub_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('profilehub_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Phím tắt Ctrl + B / Cmd + B để bật/tắt sidebar tương tự VS Code / Linear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        const activeEl = document.activeElement;
        const isInput = activeEl && (
          activeEl.tagName === 'INPUT' || 
          activeEl.tagName === 'TEXTAREA' || 
          activeEl.getAttribute('contenteditable') === 'true'
        );
        if (!isInput) {
          e.preventDefault();
          toggleCollapse();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const cvPaths = ['/cv-manager', '/cv-management', '/cv-builder'];
  const isCvSectionActive = cvPaths.some(path => location.pathname.includes(path));
  const [isCreateCvFlowModalOpen, setIsCreateCvFlowModalOpen] = useState(false);
  const [createFlowStep, setCreateFlowStep] = useState<'choose_flow' | 'manual_studio'>('choose_flow');





  // Bảng màu theo role (SaaS Palette tinh tế chuẩn Linear / Stripe)
  const getRoleTheme = (role: UserRole) => {
    switch (role) {
      case 'recruiter':
        return {
          activeBg: '#f5f3ff',
          activeText: '#5b21b6',
          activeIcon: '#7c3aed',
          badgeBg: '#f5f3ff',
          badgeText: '#6d28d9',
          badgeLabel: 'NHÀ TUYỂN DỤNG',
          accent: '#7c3aed',
        };
      default:
        return {
          activeBg: '#eff6ff',
          activeText: '#1e40af',
          activeIcon: '#2563eb',
          badgeBg: '#eff6ff',
          badgeText: '#1d4ed8',
          badgeLabel: 'ỨNG VIÊN',
          accent: '#2563eb',
        };
    }
  };

  const theme = getRoleTheme(userRole);

  const getMenuStyles = (path: string, collapsed: boolean) => {
    const isActive = location.pathname.includes(path);
    if (collapsed) {
      return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        margin: '4px auto',
        borderRadius: '8px',
        backgroundColor: isActive ? theme.activeBg : 'transparent',
        color: isActive ? theme.activeText : '#64748b',
        textDecoration: 'none',
        transition: 'all 0.15s ease',
        borderLeft: isActive ? `3px solid ${theme.accent}` : '3px solid transparent',
        boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.03)' : 'none',
        position: 'relative' as const,
      };
    }
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '7.5px 12px',
      margin: '2px 8px',
      borderRadius: '8px',
      backgroundColor: isActive ? theme.activeBg : 'transparent',
      color: isActive ? theme.activeText : '#475569',
      textDecoration: 'none',
      fontWeight: isActive ? '600' : '500',
      fontSize: '13px',
      transition: 'all 0.15s ease',
      borderLeft: isActive ? `3px solid ${theme.accent}` : '3px solid transparent',
    };
  };

  const getSubMenuStyles = (path: string, collapsed: boolean) => {
    const isActive = path ? location.pathname.includes(path) : false;
    if (collapsed) {
      return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        margin: '3px auto',
        borderRadius: '7px',
        backgroundColor: isActive ? theme.activeBg : 'transparent',
        color: isActive ? theme.activeText : '#64748b',
        textDecoration: 'none',
        transition: 'all 0.15s ease',
      };
    }
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

  const renderNavContent = (collapsed: boolean) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff' }}>
      {/* Brand Header */}
      <div style={{
        padding: collapsed ? '14px 10px' : '14px 14px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        flexDirection: collapsed ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: collapsed ? '8px' : '0',
        minHeight: '62px',
        boxSizing: 'border-box'
      }}>
        {!collapsed ? (
          <>
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
                flexShrink: 0
              }}>
                <Briefcase size={15} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  ProfileHub
                </div>
                <div style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: '500' }}>
                  Career Ecosystem
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '9px',
                fontWeight: '700',
                backgroundColor: theme.badgeBg,
                color: theme.badgeText,
                padding: '2.5px 6px',
                borderRadius: '5px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                {theme.badgeLabel}
              </span>
              <button
                type="button"
                onClick={toggleCollapse}
                title="Thu gọn sidebar (Ctrl + B)"
                className="ph-collapse-btn"
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <PanelLeftClose size={16} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div
              title="ProfileHub (Bấm để mở rộng menu)"
              onClick={toggleCollapse}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
            >
              <Briefcase size={16} strokeWidth={2.2} />
            </div>
            <button
              type="button"
              onClick={toggleCollapse}
              title="Mở rộng sidebar (Ctrl + B)"
              className="ph-collapse-btn"
              style={{
                border: 'none',
                background: '#f8fafc',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <PanelLeftOpen size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '8px 0', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {userRole === 'student' && (
          <>
            {!collapsed ? (
              <div className="ph-section-title" style={{ padding: '8px 16px 4px 16px', fontSize: '10px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Portfolio
              </div>
            ) : (
              <div style={{ margin: '6px 12px', borderTop: '1px solid #f1f5f9' }} />
            )}

            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="ph-nav-link"
              title={collapsed ? 'Dashboard' : undefined}
              style={getMenuStyles('/dashboard', collapsed)}
            >
              <LayoutDashboard size={17} color={location.pathname.includes('/dashboard') ? theme.activeIcon : '#64748b'} />
              {!collapsed && <span>Dashboard</span>}
            </Link>

            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="ph-nav-link"
              title={collapsed ? 'Hồ Sơ Cá Nhân' : undefined}
              style={getMenuStyles('/profile', collapsed)}
            >
              <UserCheck size={17} color={location.pathname.includes('/profile') ? theme.activeIcon : '#64748b'} />
              {!collapsed && <span>Hồ Sơ Cá Nhân</span>}
            </Link>

            <Link
              to="/my-projects"
              onClick={() => setMobileOpen(false)}
              className="ph-nav-link"
              title={collapsed ? 'Kho Đồ Án (Proof-of-Work)' : undefined}
              style={getMenuStyles('/my-projects', collapsed)}
            >
              <FolderKanban size={17} color={location.pathname.includes('/my-projects') || location.pathname.includes('/projects') ? theme.activeIcon : '#64748b'} />
              {!collapsed && <span>Kho Đồ Án</span>}
            </Link>

            {/* Quản Lý CV - 1 Cửa duy nhất theo Lean UX */}
            {!collapsed ? (
              <>
                <div className="ph-section-title" style={{ padding: '14px 16px 4px 16px', fontSize: '10px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Hồ Sơ & CV
                </div>

                <Link
                  to="/cv-management"
                  onClick={() => setMobileOpen(false)}
                  className="ph-nav-link"
                  title="Quản Lý CV"
                  style={getMenuStyles('/cv-manage', collapsed)}
                >
                  <Layers size={17} color={isCvSectionActive ? theme.activeIcon : '#6366f1'} />
                  <span>Quản Lý CV</span>
                </Link>

                {/* Single Clean Action Button: + Tạo CV Mới */}
                <div style={{ margin: '8px 8px 10px 8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setCreateFlowStep('choose_flow');
                      setIsCreateCvFlowModalOpen(true);
                    }}
                    className="ph-ai-quick-btn"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '7px',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      boxShadow: '0 2px 8px rgba(30, 58, 138, 0.25)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Sparkles size={14} color="#fde047" />
                    <span>+ Tạo CV Mới</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ margin: '6px 12px', borderTop: '1px solid #f1f5f9' }} />
                
                <Link
                  to="/cv-management"
                  className="ph-nav-link"
                  title="Quản Lý CV"
                  style={getMenuStyles('/cv-manage', true)}
                >
                  <Layers size={17} color={isCvSectionActive ? theme.activeIcon : '#6366f1'} />
                </Link>

                {/* Collapsed Single Action Button */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCreateFlowStep('choose_flow');
                      setIsCreateCvFlowModalOpen(true);
                    }}
                    className="ph-ai-quick-btn"
                    title="+ Tạo CV Mới"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(30, 58, 138, 0.3)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Sparkles size={16} color="#fde047" />
                  </button>
                </div>
              </>
            )}

            {/* Kho Đồ Án & Hồ Sơ đã được ưu tiên ở trên; ẩn menu việc làm theo đặc tả Fix.md BUG-01 */}
          </>
        )}

        {userRole === 'recruiter' && (
          <>
            {!collapsed ? (
              <div className="ph-section-title" style={{ padding: '8px 16px 4px 16px', fontSize: '10px', color: '#8b5cf6', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Portal Nhà Tuyển Dụng
              </div>
            ) : (
              <div style={{ margin: '6px 12px', borderTop: '1px solid #f1f5f9' }} />
            )}

            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="ph-nav-link"
              title={collapsed ? 'Bảng Điều Khiển' : undefined}
              style={getMenuStyles('/dashboard', collapsed)}
            >
              <LayoutDashboard size={17} color={location.pathname.includes('/dashboard') ? theme.activeIcon : '#7c3aed'} />
              {!collapsed && <span>Bảng Điều Khiển</span>}
            </Link>

            <Link
              to="/recruiter/profile"
              onClick={() => setMobileOpen(false)}
              className="ph-nav-link"
              title={collapsed ? 'Hồ Sơ Doanh Nghiệp (MST)' : undefined}
              style={getMenuStyles('/recruiter/profile', collapsed)}
            >
              <Building2 size={17} color={location.pathname.includes('/recruiter/profile') ? theme.activeIcon : '#7c3aed'} />
              {!collapsed && <span>Hồ Sơ Doanh Nghiệp (MST)</span>}
            </Link>

            <Link
              to="/recruiter/jobs"
              onClick={() => setMobileOpen(false)}
              className="ph-nav-link"
              title={collapsed ? 'Quản Lý Tin Tuyển Dụng' : undefined}
              style={getMenuStyles('/recruiter/jobs', collapsed)}
            >
              <Briefcase size={17} color={location.pathname.includes('/recruiter/jobs') ? theme.activeIcon : '#7c3aed'} />
              {!collapsed && <span>Quản Lý Tin Tuyển Dụng</span>}
            </Link>

            <Link
              to="/recruiter/search"
              onClick={() => setMobileOpen(false)}
              className="ph-nav-link"
              title={collapsed ? 'Tìm Kiếm Ứng Viên' : undefined}
              style={getMenuStyles('/recruiter/search', collapsed)}
            >
              <UserCheck size={17} color={location.pathname.includes('/recruiter/search') ? theme.activeIcon : '#7c3aed'} />
              {!collapsed && <span>Tìm Kiếm Ứng Viên</span>}
            </Link>

            <Link
              to="/recruiter/pipeline"
              onClick={() => setMobileOpen(false)}
              className="ph-nav-link"
              title={collapsed ? 'Luồng Tuyển Dụng (Pipeline)' : undefined}
              style={getMenuStyles('/recruiter/pipeline', collapsed)}
            >
              <Kanban size={17} color={location.pathname.includes('/recruiter/pipeline') ? theme.activeIcon : '#7c3aed'} />
              {!collapsed && <span>Luồng Tuyển Dụng</span>}
            </Link>

            <Link
              to="/recruiter/saved"
              onClick={() => setMobileOpen(false)}
              className="ph-nav-link"
              title={collapsed ? 'Ứng Viên Đã Lưu' : undefined}
              style={getMenuStyles('/recruiter/saved', collapsed)}
            >
              <Star size={17} color={location.pathname.includes('/recruiter/saved') ? theme.activeIcon : '#f59e0b'} />
              {!collapsed && <span>Ứng Viên Đã Lưu</span>}
            </Link>

            <Link
              to="/recruiter/ai-assistant"
              onClick={() => setMobileOpen(false)}
              className="ph-nav-link"
              title={collapsed ? 'AI Hỗ Trợ Tuyển Dụng' : undefined}
              style={getMenuStyles('/recruiter/ai-assistant', collapsed)}
            >
              <Sparkles size={17} color={location.pathname.includes('/recruiter/ai-assistant') ? theme.activeIcon : '#7c3aed'} />
              {!collapsed && <span>AI Tuyển Dụng</span>}
            </Link>
          </>
        )}
      </nav>

      {/* Footer Account & Logout */}
      <div style={{
        padding: collapsed ? '10px 8px' : '10px 12px',
        borderTop: '1px solid #f1f5f9',
        backgroundColor: '#fcfcfd',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px'
      }}>
        {!collapsed ? (
          <>
            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 8px',
              borderRadius: '6px',
              backgroundColor: '#f8fafc',
              boxSizing: 'border-box'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
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
                {user?.email ? user.email.charAt(0).toUpperCase() : <User size={12} />}
              </div>
              <div style={{ fontSize: '11.5px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>
                {user?.email || 'user@profilehub.vn'}
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/logout'}
              className="ph-logout-btn"
              style={{
                width: '100%',
                padding: '6.5px 10px',
                backgroundColor: '#fff1f2',
                color: '#e11d48',
                border: '1px solid #ffe4e6',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '11.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <LogOut size={13} /> Đăng xuất
            </button>
          </>
        ) : (
          <>
            <div
              title={user?.email || 'Tài khoản ProfileHub'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                border: '1px solid #e2e8f0'
              }}
            >
              {user?.email ? user.email.charAt(0).toUpperCase() : <User size={13} />}
            </div>
            <button
              onClick={() => window.location.href = '/logout'}
              className="ph-logout-btn"
              title="Đăng xuất"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#fff1f2',
                color: '#e11d48',
                border: '1px solid #ffe4e6',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <LogOut size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE TOP BAR (Hiển thị trên Màn hình < 1024px) */}
      <div className="mobile-top-bar" style={{
        display: 'none',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: 'white',
        borderBottom: '1px solid #f1f5f9',
        padding: '12px 18px',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          <span style={{ fontSize: '9.5px', fontWeight: 'bold', backgroundColor: theme.badgeBg, color: theme.badgeText, padding: '3px 7px', borderRadius: '5px' }}>
            {theme.badgeLabel}
          </span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0f172a', padding: '4px' }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
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
            {renderNavContent(false)}
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR (Cố định ở Màn hình >= 1024px, hỗ trợ thu gọn mượt mà) */}
      <aside
        className={`desktop-sidebar ${isCollapsed ? 'is-collapsed' : ''}`}
        style={{
          width: isCollapsed ? '64px' : '246px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #f1f5f9',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflowY: isCollapsed ? 'visible' : 'auto',
          overflowX: 'hidden',
          transition: 'width 0.2s cubic-bezier(0.2, 0, 0, 1)',
          zIndex: 30,
        }}
      >
        {renderNavContent(isCollapsed)}
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
        .ph-collapse-btn:hover {
          background-color: #f1f5f9 !important;
          color: #0f172a !important;
        }
        .ph-ai-quick-btn:hover {
          filter: brightness(1.06);
          transform: translateY(-1px);
        }
        .ph-logout-btn:hover {
          background-color: #ffe4e6 !important;
        }
      `}</style>

      {/* Modal Tạo CV Mới (AI May Đo Khớp JD hoặc Tự Chọn Mẫu Viết Tay) */}
      {isCreateCvFlowModalOpen && (
        <CreateCvFlowModal
          isOpen={isCreateCvFlowModalOpen}
          initialStep={createFlowStep}
          onClose={() => setIsCreateCvFlowModalOpen(false)}
          userId={user?.id}
          userEmail={user?.email}
          profileSourceData={null}
        />
      )}

    </>
  );
}