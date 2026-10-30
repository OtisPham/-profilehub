import type { UserRole, CandidatePipelineItem } from '../../types/database';

export interface HeaderNavLink {
  label: string;
  path: string;
  badge?: string;
  isDropdown?: boolean;
  subLinks?: {
    label: string;
    path: string;
    description?: string;
    icon?: string;
  }[];
}

/**
 * Trả về danh sách liên kết điều hướng trên HeaderBar dựa theo trạng thái đăng nhập và vai trò người dùng (updateui.md Section 2)
 */
export function getHeaderNavLinks(
  role: UserRole = 'student',
  isAuthenticated: boolean = false
): HeaderNavLink[] {
  // Trạng thái 1: Khi chưa đăng nhập (Public Landing Page)
  if (!isAuthenticated) {
    return [
      { label: 'Về Chúng Tôi', path: '/#about' },
      { label: 'Tính Năng JEV', path: '/#features' },
    ];
  }

  // Trạng thái 2: Khi đã đăng nhập - Nhà tuyển dụng (Recruiter Workspace)
  if (role === 'recruiter') {
    return [
      { label: 'Bảng Tin Tuyển Dụng', path: '/recruiter/dashboard' },
      { label: 'Tin Tuyển Dụng', path: '/recruiter/jobs' },
      { label: 'Tìm Ứng Viên', path: '/recruiter/candidates' },
      { label: 'Pipeline Phỏng Vấn', path: '/recruiter/pipeline' },
    ];
  }

  // Trạng thái 2: Khi đã đăng nhập - Ứng viên (Candidate Workspace: Đúng 3 Menu Cốt Lõi Duy Nhất)
  return [
    { label: '📊 Tổng Quan', path: '/dashboard' },
    { label: '📂 Kho Đồ Án', path: '/my-projects' },
    { label: '📄 Quản Lý CV', path: '/cv-management' },
  ];
}

/**
 * Tính toán số lượng thông báo phỏng vấn đang chờ xử lý từ pipeline
 */
export function getPendingInterviewNotificationCount(pipeline: CandidatePipelineItem[] | null | undefined): number {
  if (!Array.isArray(pipeline)) return 0;
  return pipeline.filter(item => item && (item.stage === 'interview' || Boolean(item.interview_date)) && item.interview_status !== 'confirmed').length;
}
