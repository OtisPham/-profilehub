import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import type { UserRole, CandidatePipelineItem } from '../../types/database';
import { 
  Menu, X, Sparkles, Bell, ChevronDown, LogOut, 
  User, CheckCircle2, Video
} from 'lucide-react';
import { getHeaderNavLinks, getPendingInterviewNotificationCount } from './headerNavigation';
import { getSharedPipeline, updateInterviewStatusByStudent } from '../../utils/pipelineSync';
import CreateCvFlowModal from '../cv/CreateCvFlowModal';
import ThemeToggleSwitch from '../common/ThemeToggleSwitch';

export default function HeaderBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [pipeline, setPipeline] = useState<CandidatePipelineItem[]>([]);
  const [isCreateCvModalOpen, setIsCreateCvModalOpen] = useState(false);

  const toolsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Lắng nghe dữ liệu pipeline đồng bộ thời gian thực
  useEffect(() => {
    const loadPipeline = () => {
      const data = getSharedPipeline(user?.id);
      setPipeline(data);
    };
    loadPipeline();

    const handleStorage = () => loadPipeline();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user?.id]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileOpen(false);
    setToolsDropdownOpen(false);
    setProfileDropdownOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  const navLinks = getHeaderNavLinks(userRole);
  const pendingNotificationCount = getPendingInterviewNotificationCount(pipeline);
  const scheduledInterviews = pipeline.filter(i => i.stage === 'interview' || Boolean(i.interview_date));

  const handleStudentAcceptInterview = (item: CandidatePipelineItem) => {
    const success = updateInterviewStatusByStudent(item.student_id, 'confirmed');
    if (success) {
      setPipeline(getSharedPipeline(user?.id));
    }
  };

  const handleSwitchRole = (newRole: UserRole) => {
    localStorage.setItem('profilehub_demo_role', newRole);
    window.location.reload();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-16 bg-white/85 dark:bg-[#0c101c]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* 1. Khu vực Trái: Logo & Branding */}
          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              className="flex items-center gap-2 group transition-transform active:scale-95"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 dark:from-white dark:via-indigo-200 dark:to-blue-300 bg-clip-text text-transparent">
                    ProfileHub
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/80">
                    v1.0
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium -mt-1 hidden sm:inline">
                  Evidence-Based Career Platform
                </span>
              </div>
            </Link>
          </div>

          {/* 2. Khu vực Giữa: Desktop Navigation Bar */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                const isSubActive = link.subLinks?.some(s => location.pathname.startsWith(s.path));
                return (
                  <div key={link.label} className="relative" ref={toolsRef}>
                    <button
                      type="button"
                      onClick={() => setToolsDropdownOpen(prev => !prev)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSubActive 
                          ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300' 
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Popover Menu Công Cụ */}
                    {toolsDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#111728] rounded-2xl shadow-xl dark:shadow-[0_12px_40px_rgba(0,0,0,0.7)] border border-slate-200/80 dark:border-slate-700/80 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-3 py-1.5">
                          Tiện Ích Nghề Nghiệp
                        </div>
                        <div className="space-y-0.5">
                          {link.subLinks?.map((sub) => {
                            const isCurrent = location.pathname.startsWith(sub.path);
                            return (
                              <Link
                                key={sub.path}
                                to={sub.path}
                                onClick={() => setToolsDropdownOpen(false)}
                                className={`flex flex-col px-3 py-2 rounded-xl text-xs transition-colors ${
                                  isCurrent 
                                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 font-bold' 
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-400'
                                }`}
                              >
                                <span className="font-semibold text-xs">{sub.label}</span>
                                {sub.description && (
                                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-normal mt-0.5 line-clamp-1">
                                    {sub.description}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 3. Khu vực Phải: Quick Actions, Notification & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Công Tắc Gạt Sáng / Tối (Theme Sliding Toggle Switch) */}
            <ThemeToggleSwitch size="md" className="hidden sm:inline-flex" />

            {/* Nút Tạo CV Nhanh (Dành cho Sinh viên/Guest) */}
            {userRole !== 'recruiter' && (
              <button
                type="button"
                onClick={() => setIsCreateCvModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200 animate-spin-slow" />
                <span>Tạo CV Mới</span>
              </button>
            )}

            {/* Chuông Thông Báo Phỏng Vấn (Notification Bell) */}
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(prev => !prev)}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                title="Thông báo lịch phỏng vấn"
                aria-label="Thông báo lịch phỏng vấn"
              >
                <Bell className="w-4 h-4" />
                {pendingNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* Popover Lịch Phỏng Vấn */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#111728] rounded-2xl shadow-xl dark:shadow-[0_12px_40px_rgba(0,0,0,0.7)] border border-slate-200/80 dark:border-slate-700/80 p-3 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-100">Thông Báo Phỏng Vấn</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {scheduledInterviews.length} lịch hẹn
                    </span>
                  </div>

                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                    {scheduledInterviews.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                        Chưa có lịch hẹn phỏng vấn nào
                      </div>
                    ) : (
                      scheduledInterviews.map((item) => (
                        <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#151d30] border border-slate-200/70 dark:border-slate-700/80 text-xs">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                            <span>{item.job?.title || 'Vị trí thực tập sinh'}</span>
                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                              {item.interview_time || '10:00 AM'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                            Ngày hẹn: {item.interview_date || 'Theo thỏa thuận'}
                          </div>
                          {item.meeting_link && (
                            <a 
                              href={item.meeting_link}
                              target="_blank" 
                              rel="noreferrer"
                              className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <Video className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                              <span>Mở Google Meet / Zoom</span>
                            </a>
                          )}
                          {item.interview_status !== 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => handleStudentAcceptInterview(item)}
                              className="mt-2 w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 transition"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Xác Nhận Tham Gia</span>
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar & Menu */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                aria-label="Tài khoản người dùng"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {user?.email?.split('@')[0] || 'Khách truy cập'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-none">
                    {userRole === 'recruiter' ? 'Nhà tuyển dụng' : 'Ứng viên'}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu Profile */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111728] rounded-2xl shadow-xl dark:shadow-[0_12px_40px_rgba(0,0,0,0.7)] border border-slate-200/80 dark:border-slate-700/80 p-2 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {user?.email || 'Tài khoản Khách'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                      Vai trò: {userRole === 'recruiter' ? 'Nhà Tuyển Dụng' : 'Ứng Viên'}
                    </p>
                  </div>

                  <div className="py-1">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-3 py-1 uppercase tracking-wider">
                      Chuyển Vai Trò Demo
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSwitchRole('student')}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                        userRole !== 'recruiter' 
                          ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>Ứng Viên (Student)</span>
                      {userRole !== 'recruiter' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchRole('recruiter')}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                        userRole === 'recruiter' 
                          ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>Nhà Tuyển Dụng (HR)</span>
                      {userRole === 'recruiter' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      to="/login"
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{user ? 'Chuyển Tài Khoản' : 'Đăng Nhập'}</span>
                    </Link>
                    {user && (
                      <Link
                        to="/logout"
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng Xuất</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Nút Hamburger Mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen(prev => !prev)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 4. Mobile Drawer Navigation */}
        {mobileOpen && (
          <div className="md:hidden bg-white dark:bg-[#0c101c] border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-2.5 shadow-lg animate-in slide-in-from-top-2 duration-150">
            {/* Chuyển đổi theme trên mobile */}
            <div className="flex items-center justify-between py-2 px-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Giao diện (Sáng / Tối):</span>
              <ThemeToggleSwitch size="sm" showLabel />
            </div>

            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div key={link.label} className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 py-1 uppercase">
                      {link.label}
                    </div>
                    {link.subLinks?.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className="block px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setIsCreateCvModalOpen(true);
                }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tạo CV Mới</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Modal Lựa chọn luồng tạo CV */}
      {isCreateCvModalOpen && (
        <CreateCvFlowModal
          isOpen={isCreateCvModalOpen}
          initialStep="choose_flow"
          onClose={() => setIsCreateCvModalOpen(false)}
          userId={user?.id}
          userEmail={user?.email}
          profileSourceData={null}
        />
      )}
    </>
  );
}
