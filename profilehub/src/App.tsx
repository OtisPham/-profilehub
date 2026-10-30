import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthProvider';

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
 * Điều hướng thông minh cho đường dẫn /dashboard:
 * Chuyển thẳng về CV Management Workspace đối với Ứng viên,
 * hoặc Bảng Tin Tuyển Dụng đối với Nhà tuyển dụng.
 */
function SmartDashboardRedirect() {
  const { userRole } = useAuth();
  if (userRole === 'recruiter') {
    return <Navigate to="/recruiter/dashboard" replace />;
  }
  return <Navigate to="/cv-management" replace />;
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
        {/* 1. Trang chủ Landing Page chuẩn Consumer SaaS */}
        <Route path="/" element={<HomePage />} />

        {/* 2. Bảng điều khiển trung tâm hành động (Action-Driven Dashboard) */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 3. Phân hệ Ứng viên (Candidate & Student Workspace) */}
        <Route path="/cv-management" element={<CVManagementPage />} />
        <Route path="/cv-manager" element={<Navigate to="/cv-management" replace />} />
        <Route path="/cv-builder" element={<CVBuilder />} />
        
        <Route path="/my-projects" element={<Projects />} />
        <Route path="/projects" element={<Navigate to="/my-projects" replace />} />

        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/profile" element={<Navigate to="/my-profile" replace />} />

        <Route path="/certificates" element={<Certificates />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/student/jobs" element={<StudentJobs />} />

        {/* 4. Phân hệ Nhà tuyển dụng (Recruiter Workspace) */}
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/profile" element={<RecruiterProfile />} />
        <Route path="/recruiter/jobs" element={<JobManagement />} />
        <Route path="/recruiter/candidates" element={<CandidateSearch />} />
        <Route path="/recruiter/search" element={<Navigate to="/recruiter/candidates" replace />} />
        <Route path="/recruiter/pipeline" element={<CandidatePipeline />} />
        <Route path="/recruiter/saved" element={<SavedCandidates />} />
        <Route path="/recruiter/ai-assistant" element={<AIRecruitmentAssistant />} />
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
