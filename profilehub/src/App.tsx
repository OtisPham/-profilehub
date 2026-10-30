import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthProvider';
import type { UserRole } from './types/database';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register'; 
import Logout from './pages/auth/Logout';
import HomePage from './pages/public/HomePage';
import PublicShowcase from './pages/public/PublicShowcase';

import Dashboard from './pages/student/Dashboard';
import MyProfile from './pages/student/MyProfile';
import Achievements from './pages/student/MyAchievements';
import Projects from './pages/student/MyProjects';
import CVBuilder from './pages/student/CVBuilder';
import CVManagementPage from './pages/student/CVManagementPage';
import Certificates from './pages/student/Certificates';
import StudentJobs from './pages/student/StudentJobs';

import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import CandidateSearch from './pages/recruiter/CandidateSearch';
import CandidatePipeline from './pages/recruiter/CandidatePipeline';
import SavedCandidates from './pages/recruiter/SavedCandidates';
import JobManagement from './pages/recruiter/JobManagement';
import AIRecruitmentAssistant from './pages/recruiter/AIRecruitmentAssistant';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';

import MainLayout from './components/layout/MainLayout';

/**
 * Component bảo vệ tuyến đường nội bộ - Kích hoạt luồng bắt buộc đăng nhập (Login-First Architecture)
 * (updateui.md Section 1.1 & Section 5)
 */
function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles?: UserRole[];
}) {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0c101c]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Đang kiểm tra phiên làm việc ProfileHub...</p>
        </div>
      </div>
    );
  }

  // Khách chưa đăng nhập: chuyển hướng về /login và ghi nhớ đường dẫn quay lại
  if (!user) {
    return <Navigate to="/login" state={{ returnTo: location.pathname }} replace />;
  }

  // Phân quyền theo vai trò nếu có yêu cầu cụ thể
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={userRole === 'recruiter' ? '/recruiter/dashboard' : '/dashboard'} replace />;
  }

  return <>{children}</>;
}

/**
 * Điều hướng thông minh cho đường dẫn /dashboard:
 * Chuyển sang /recruiter/dashboard nếu là Nhà tuyển dụng,
 * hoặc hiển thị Dashboard hành động phỏng vấn War Room cho Ứng viên.
 */
function DashboardRoute() {
  const { userRole } = useAuth();
  if (userRole === 'recruiter') {
    return <Navigate to="/recruiter/dashboard" replace />;
  }
  return <Dashboard />;
}

function App() {
  return (
    <Routes>
      {/* Các tuyến xác thực độc lập */}
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />

      {/* Trang Portfolio & Showcase công khai (Không yêu cầu đăng nhập) */}
      <Route path="/showcase" element={<PublicShowcase />} />
      <Route path="/showcase/:id" element={<PublicShowcase />} />
      <Route path="/p/:id" element={<PublicShowcase />} />
      <Route path="/portfolio/:id" element={<PublicShowcase />} />

      {/* Layout SaaS toàn cục có HeaderBar kính mờ & Footer */}
      <Route element={<MainLayout />}>
        {/* 1. Trang chủ Landing Page chuẩn Consumer SaaS (Công khai) */}
        <Route path="/" element={<HomePage />} />

        {/* 2. Bảng điều khiển trung tâm hành động (Bảo vệ đăng nhập) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardRoute />
            </ProtectedRoute>
          } 
        />

        {/* 3. Phân hệ Ứng viên (Candidate & Student Workspace - Bắt buộc đăng nhập) */}
        <Route 
          path="/cv-management" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CVManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/cv-manager" element={<Navigate to="/cv-management" replace />} />
        <Route 
          path="/cv-builder" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CVBuilder />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/my-projects" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Projects />
            </ProtectedRoute>
          } 
        />
        <Route path="/projects" element={<Navigate to="/my-projects" replace />} />

        <Route 
          path="/my-profile" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <MyProfile />
            </ProtectedRoute>
          } 
        />
        <Route path="/profile" element={<Navigate to="/my-profile" replace />} />

        <Route 
          path="/certificates" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Certificates />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/achievements" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Achievements />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/jobs" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentJobs />
            </ProtectedRoute>
          } 
        />

        {/* 4. Phân hệ Nhà tuyển dụng (Recruiter Workspace - Bắt buộc đăng nhập) */}
        <Route 
          path="/recruiter/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recruiter/profile" 
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recruiter/jobs" 
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <JobManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recruiter/candidates" 
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <CandidateSearch />
            </ProtectedRoute>
          } 
        />
        <Route path="/recruiter/search" element={<Navigate to="/recruiter/candidates" replace />} />
        <Route 
          path="/recruiter/pipeline" 
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <CandidatePipeline />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recruiter/saved" 
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <SavedCandidates />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recruiter/ai-assistant" 
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <AIRecruitmentAssistant />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* 404 Route */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
            <h1 className="text-6xl font-extrabold text-indigo-600">404</h1>
            <p className="mt-2 text-lg font-bold text-slate-800">Không tìm thấy trang</p>
            <p className="text-sm text-slate-500 mt-1">Đường dẫn bạn truy cập không tồn tại hoặc đã được chuyển dời.</p>
            <a 
              href="/"
              className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-sm"
            >
              Về Trang Chủ ProfileHub
            </a>
          </div>
        } 
      />
    </Routes>
  );
}

export default App;
